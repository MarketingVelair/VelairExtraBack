
import { Router } from "express";
import InstructorsController from '@/controllers/instructors.controller';
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.get('/', authMiddleware, InstructorsController.getInstructorsDataToSync);
router.post('/', authMiddleware, InstructorsController.pushInstructorsDataToSync);

export default router;
