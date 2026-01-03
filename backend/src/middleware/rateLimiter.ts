import { Request, Response, NextFunction } from 'express';

const requests: { [key: string]: number[] } = {};
const LIMIT = 30; // requests
const WINDOW = 60 * 1000; // 1 minute

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const key = req.ip || 'unknown';
  const now = Date.now();

  if (!requests[key]) {
    requests[key] = [];
  }

  requests[key] = requests[key].filter(time => now - time < WINDOW);

  if (requests[key].length >= LIMIT) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  requests[key].push(now);
  next();
};
