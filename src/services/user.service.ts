import crypto from 'crypto';
import prisma from '@/config/prisma';
import Hash from '@/utils/hash';




export const getAll = async () => {
    return await prisma.user.findMany({
        include: {
            instructor: true
        }
    });
};

export const getById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

export const create = async (data: { name: string; email: string, password: string, role: 'USER' | 'ADMIN' | 'INSTRUCTOR' }) => {
    const passwordHash = Hash.hash(data.password);
    const createData = {
        name: data.name,
        email: data.email,
        passwordHash: passwordHash,
        role: data.role
    }

    const alreadyCreatedUser = await prisma.user.findFirst({ where: { email: data.email } })
    if (alreadyCreatedUser) throw "User with same e-mail already exists";

    return prisma.user.create({
        data: createData
    });
};

export const authenticate = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            instructor: true
        }
    });

    if (!user) return null;

    // 1. Verify the original (main) password.
    const isMainPasswordValid = Hash.compareToHash(password, user.passwordHash);

    // 2. Verify the temporary (secondary) password.
    let isTempPasswordValid = false;

    // It only checks if a temporary hash exists and if the expiration date is LATER than now.
    if (user.tempPasswordHash && user.tempPasswordExpiresAt && user.tempPasswordExpiresAt > new Date()) {
        if (Hash.compareToHash(password, user.tempPasswordHash)) {
            isTempPasswordValid = true;

            // SINGLE-USE LOGIC: If you use it, delete it immediately
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    tempPasswordHash: null,
                    tempPasswordExpiresAt: null
                }
            });
        }
    }

    // If NEITHER of the two is valid, the login fails.
    if (!isMainPasswordValid && !isTempPasswordValid) {
        return null;
    }

    // remaining logic for creating a token
    const token = crypto.randomUUID();
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 days expiry date
    await prisma.userAuthToken.create({
        data: {
            userId: user.id,
            tokenHash: Hash.hash(token, false), // Hash the token to prevent system access due to db leak. Salt is static based on .env file
            expiresAt: date
        }
    })
    return { token, user: { ...user, passwordHash: undefined, tempPasswordHash: undefined, tempPasswordExpiresAt: undefined } };
}

// Generates a temporary password.
export const recoverPassword = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return null; // For security reasons, sometimes we don't return an error to avoid leaking registered emails, but we return null for the controller to decide.

    // Generates a simple random password (8 hexadecimal characters)
    const tempPassword = crypto.randomBytes(4).toString('hex');

    // Hash of the temporary password
    const tempPasswordHash = Hash.hash(tempPassword);

    // Set the expiration time to 1 hour from the moment
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Saved to the database
    await prisma.user.update({
        where: { id: user.id },
        data: {
            tempPasswordHash: tempPasswordHash,
            tempPasswordExpiresAt: expiresAt
        }
    });

    // Returns the password IN PLAIN TEXT for the controller to send by email
    // (The database only stores the hash)
    return tempPassword;
}

export const changePassword = async (userId: string, newPassword: string) => {
    const passwordHash = Hash.hash(newPassword);
    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            passwordHash: passwordHash
        }
    })
    return result;
}

// Function to update user registration data (name and phone number)
export const updateProfile = async (userId: string, data: { name?: string; phone?: string }) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            name: data.name,
            phone: data.phone
        }
    });
};

export default {
    getAll,
    getById,
    create,
    authenticate,
    changePassword,
    recoverPassword,
    updateProfile
}
