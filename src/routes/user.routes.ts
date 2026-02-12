
import { Router } from "express";
import userController from '@/controllers/user.controller';
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.post('/auth', userController.authenticate);

router.post('/', userController.createUser);

router.post('/forgot_password', userController.forgotPassword);

router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/change_password', authMiddleware, userController.changePassword);
router.patch('/profile', authMiddleware, userController.updateProfile);
router.get('/test', authMiddleware, (req, res) => {
    res.send()
});

export default router;
