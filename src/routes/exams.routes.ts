
import { Router } from "express";
import ExamsController from '@/controllers/exams.controller';
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.get('/', authMiddleware, ExamsController.getExamsDataToSync);
router.post('/', authMiddleware, ExamsController.pushExamsDataToSync);

export default router;
