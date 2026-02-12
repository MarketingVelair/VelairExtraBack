
import crypto from 'crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export const hash = (pureText: string, randomSalt: boolean = true) => {
    const SERVER_HASH_SECRET = process.env.SERVER_HASH_SECRET!;
    const salt = randomSalt ? crypto.randomBytes(SALT_LENGTH).toString('hex') : SERVER_HASH_SECRET;

    const hash = crypto.scryptSync(pureText, salt, KEY_LENGTH).toString('hex');
    return `${salt}:${hash}`;
}

export const compareToHash = (pureText: string, hashText: string) => {
    const [salt, originalHash] = hashText.split(':');
    const hashToTest = crypto.scryptSync(pureText, salt, KEY_LENGTH).toString('hex');
    return crypto.timingSafeEqual(
        Buffer.from(originalHash, 'hex'),
        Buffer.from(hashToTest, 'hex')
    )
}

export default {
    hash,
    compareToHash
}