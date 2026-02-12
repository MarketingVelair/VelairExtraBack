import { Request, Response, NextFunction } from 'express';
import prisma from '@/config/prisma';
import Hash from '@/utils/hash';

// TODO - swap to redis
const authCache:any = {

}


export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = process.hrtime.bigint();

  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = header.substring(7);
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }



  const hash = Hash.hash(token, false);

  const cache = authCache[hash];
  const authToken = cache ? cache : await prisma.userAuthToken.findUnique({
    where: { tokenHash:  hash},
    include: { user: true },
  });
  if (!cache) {
    authCache[hash] = authToken;
  }


  if (!authToken || authToken.revoked) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (authToken.expiresAt < new Date()) {
    return res.status(401).json({ message: 'Token expired' });
  }

  // attach user to request
  req.user = authToken.user;

  // update last used timestamp (non-blocking)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry date
  prisma.userAuthToken.update({
    where: { id: authToken.id },
    data: { lastUsedAt: new Date(), expiresAt: expiryDate },
  }).catch(() => {});



  const end = process.hrtime.bigint();
  const durationMs = Number(end - start) / 1e6;
  console.log(
    `[${new Date().toISOString()}] AUTH - ${durationMs.toFixed(2)}ms`
  );

  next();
}
