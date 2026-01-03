import { Router, Request, Response, NextFunction } from 'express';
import { mockStockService } from '../services/mockStockService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query.q || '');
    if (!q) return res.status(400).json({ error: 'Missing q parameter' });

    const data = await mockStockService.search(q);
    return res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
