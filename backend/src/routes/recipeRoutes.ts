import { Router } from 'express';
import {
  listRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController';
import {
  listComments,
  addComment,
  deleteComment,
} from '../controllers/commentController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Comments sub-router (merge params)
const commentRouter = Router({ mergeParams: true });
commentRouter.get('/', listComments);
commentRouter.post('/', authMiddleware, addComment);
commentRouter.delete('/:commentId', authMiddleware, deleteComment);

// Recipes
router.get('/', listRecipes);
router.get('/:id', getRecipeById);
router.post('/', authMiddleware, createRecipe);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

// Nested comments routes
router.use('/:recipeId/comments', commentRouter);

export default router;
