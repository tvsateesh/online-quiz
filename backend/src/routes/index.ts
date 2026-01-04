import { Router } from 'express';
import quoteRouter from './quote';
import historicalRouter from './historical';
import searchRouter from './search';
import authRouter from './auth';
import gameStatsRouter from './games';

const router = Router();

router.use('/auth', authRouter);
router.use('/games', gameStatsRouter);
router.use('/quote', quoteRouter);
router.use('/historical', historicalRouter);
router.use('/search', searchRouter);

export default router;
