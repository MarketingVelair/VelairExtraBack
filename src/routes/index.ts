import { Router } from "express";
import UserRoutes from "./user.routes";
import ExamsRoutes from "./exams.routes";
import InstructorsRoutes from './instructors.routes';
import AircraftsRoutes from './aircrafts.routes';
import FlightsRoutes from './flights.routes';
import NotificationsRoutes from './notifications.routes';

const router = Router();

router.use("/users", UserRoutes);
router.use("/exams", ExamsRoutes);
router.use("/instructors", InstructorsRoutes);
router.use("/aircrafts", AircraftsRoutes);
router.use("/flights", FlightsRoutes);
router.use("/notifications", NotificationsRoutes);

export default router;
