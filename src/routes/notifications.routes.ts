import webpush from 'web-push';

import { Router } from "express";
import InstructorsController from '@/controllers/instructors.controller';
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();


const subscriptions:any[] = [];

router.post('/subscribe', (req, res) => {
  subscriptions.push(req.body);
  res.sendStatus(201);
});
router.post('/send', async (req, res) => {
  const payload = JSON.stringify({
    title: 'Hello!',
    body: 'New message arrived 🚀',
  });

  for (const sub of subscriptions) {
    await webpush.sendNotification(sub, payload);
  }

  res.sendStatus(200);
});

export default router;
