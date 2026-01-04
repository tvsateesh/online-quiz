import { Router } from 'express';
import quoteRouter from './quote';
import historicalRouter from './historical';
import searchRouter from './search';
import authRouter from './auth';

const router = Router();

router.use('/auth', authRouter);
router.use('/quote', quoteRouter);
router.use('/historical', historicalRouter);
router.use('/search', searchRouter);

export default router;
