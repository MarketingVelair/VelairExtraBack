
import { Router } from "express";
import FlightsController from '@/controllers/flights.controller';
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.get('/', authMiddleware, FlightsController.getFlightsDataToSync);
router.post('/', authMiddleware, FlightsController.pushFlightsDataToSync);

export default router;
