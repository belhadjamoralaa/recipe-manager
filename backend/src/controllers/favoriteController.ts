import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Favorite from '../models/Favorite';
import Recipe from '../models/Recipe';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

function sendUnauthorized(res: Response): void {
  res.status(401).json({ success: false, message: 'Unauthorized' });
}

function sendNotFound(res: Response, message = 'Resource not found'): void {
  res.status(404).json({ success: false, message });
}

function parsePagination(req: Request) {
  const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
  const limit = Math.max(
    1,
    Math.min(100, parseInt((req.query.limit as string) || '10', 10)),
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export async function addFavorite(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { recipeId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      sendUnauthorized(res);
      return;
    }

    if (!isValidObjectId(recipeId)) {
      sendNotFound(res, 'Recipe not found');
      return;
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      sendNotFound(res, 'Recipe not found');
      return;
    }

    const existing = await Favorite.findOne({ user: userId, recipe: recipeId });
    if (existing) {
      res.status(200).json({
        success: true,
        message: 'Recipe already in favorites',
        alreadyFavorite: true,
      });
      return;
    }

    await Favorite.create({ user: userId, recipe: recipeId });
    await Recipe.findByIdAndUpdate(recipeId, { $inc: { favoritesCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Recipe added to favorites',
      alreadyFavorite: false,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { recipeId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      sendUnauthorized(res);
      return;
    }

    if (!isValidObjectId(recipeId)) {
      sendNotFound(res, 'Favorite not found');
      return;
    }

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      recipe: recipeId,
    });

    if (!favorite) {
      sendNotFound(res, 'Favorite not found');
      return;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $inc: { favoritesCount: -1 } },
      { new: true },
    );

    if (updatedRecipe && updatedRecipe.favoritesCount < 0) {
      updatedRecipe.favoritesCount = 0;
      await updatedRecipe.save();
    }

    res.status(200).json({
      success: true,
      message: 'Recipe removed from favorites',
    });
  } catch (error) {
    next(error);
  }
}

export async function listFavorites(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      sendUnauthorized(res);
      return;
    }

    const { page, limit, skip } = parsePagination(req);
    const filter = { user: userId };

    const [favorites, totalItems] = await Promise.all([
      Favorite.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'recipe',
          populate: { path: 'author', select: 'username email' },
        }),
      Favorite.countDocuments(filter),
    ]);

    const recipes = favorites
      .map((fav) => fav.recipe)
      .filter(
        (
          recipe,
        ): recipe is NonNullable<(typeof favorites)[number]['recipe']> =>
          Boolean(recipe),
      );

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    res.status(200).json({
      success: true,
      data: recipes,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    next(error);
  }
}
