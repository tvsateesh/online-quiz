import { Router, Request, Response, NextFunction } from 'express';
import { mockStockService } from '../services/mockStockService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const symbol = String(req.query.symbol || 'AAPL');
    const data = await mockStockService.quote(symbol);
    return res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
