import { Router } from 'express';
import { getHealth } from '../controllers/healthController';
import authRoutes from './authRoutes';
import recipeRoutes from './recipeRoutes';
import favoriteRoutes from './favoriteRoutes';

const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);
router.use('/recipes', recipeRoutes);
router.use('/favorites', favoriteRoutes);

export default router;
