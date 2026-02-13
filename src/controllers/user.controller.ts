import type { RequestHandler } from "express";
import UserService from '@/services/user.service';
import Env from "@/utils/Env";
import { validateEmail } from "@/utils/email";

export const getAllUsers: RequestHandler = async (req, res, next) => {
    if (Env.env == Env.types.PRODUCTION) {
        return res.status(503).send();
    }

    UserService.getAll().then(r => {
        res.json({
            result: r
        })
    })
}

export const getUserById: RequestHandler = (req, res, next) => {
    res.json({
        success: true,
        id: req.params.id
    })
}

export const createUser: RequestHandler = (req, res, next) => {
    return UserService.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }).then(r => {
        res.send(r)
    })
}

export const authenticate: RequestHandler = (req, res, next) => {
    UserService.authenticate(req.body.email, req.body.password).then(r => {
        if (r === null) {
            return res.status(401).send();
        }
        res.json({
            token: r.token,
            user: r.user
        })
    })
}

export const changePassword: RequestHandler = (req, res, next) => {
    UserService.changePassword(req.user!.id, req.body.password).then(user => {
        res.json({});
    })
}

export const forgotPassword: RequestHandler = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const tempPassword = await UserService.recoverPassword(email);

    if (tempPassword) {
        // AQUI ENTRA O SEU CÓDIGO DE ENVIAR E-MAIL
        // Por enquanto, vamos apenas logar no console para você testar
        console.log(`>>> SIMULANDO ENVIO DE EMAIL PARA ${email} <<<`);
        console.log(`>>> NOVA SENHA TEMPORÁRIA: ${tempPassword} <<<`);

        // TODO: Chamar sua função de envio de e-mail aqui passando o tempPassword
    }

    // For security reasons, we always reply OK even if the email address doesn't exist (to prevent user enumeration).
    res.json({ message: "If your email is registered, you will receive a temporary password." });
}

export const updateProfile: RequestHandler = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;

        if (req.user!.email != email) {
            if (!validateEmail(email)) {
                return res.status(400).json({ message: "E-mail inválido" })
            }
            if (await UserService.getByEmail(email)) {
                return res.status(400).json({ message: "E-mail já está cadastrado para outro usuário" })
            }
        }

        // Call the service passing the ID of the logged-in user (req.user!.id)
        const updatedUser = await UserService.updateProfile(req.user!.id, {
            name,
            phone
        });

        res.json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        // If there's an error in the database, we pass it on to the error handler
        next(error);
    }
}

export default {
    getAllUsers,
    getUserById,
    createUser,
    authenticate,
    changePassword,
    forgotPassword,
    updateProfile
}