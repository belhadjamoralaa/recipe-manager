import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { addFavorite, removeFavorite, listFavorites } from '../controllers/favoriteController';

const router = Router();

router.get('/', authMiddleware, listFavorites);
router.post('/:recipeId', authMiddleware, addFavorite);
router.delete('/:recipeId', authMiddleware, removeFavorite);

export default router;
