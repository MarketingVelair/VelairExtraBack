
import { Router } from "express";
import AircraftsController from '@/controllers/aircrafts.controller';
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.get('/', authMiddleware, AircraftsController.getAircraftsDataToSync);
router.post('/', authMiddleware, AircraftsController.pushAircraftsDataToSync);

export default router;
