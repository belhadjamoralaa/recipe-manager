import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Favorite from '../models/Favorite';
import Recipe from '../models/Recipe';

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function addFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { recipeId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!isValidObjectId(recipeId)) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const existing = await Favorite.findOne({ user: userId, recipe: recipeId });
    if (existing) {
      res.json({ success: true, message: 'Recipe already in favorites' });
      return;
    }

    await Favorite.create({ user: userId, recipe: recipeId });
    await Recipe.findByIdAndUpdate(recipeId, { $inc: { favoritesCount: 1 } });

    res.json({ success: true, message: 'Recipe added to favorites' });
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { recipeId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!isValidObjectId(recipeId)) {
      res.status(404).json({ success: false, message: 'Favorite not found' });
      return;
    }

    const favorite = await Favorite.findOneAndDelete({ user: userId, recipe: recipeId });
    if (!favorite) {
      res.status(404).json({ success: false, message: 'Favorite not found' });
      return;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $inc: { favoritesCount: -1 } },
      { new: true }
    );
    if (updatedRecipe && updatedRecipe.favoritesCount < 0) {
      updatedRecipe.favoritesCount = 0;
      await updatedRecipe.save();
    }

    res.json({ success: true, message: 'Recipe removed from favorites' });
  } catch (error) {
    next(error);
  }
}

export async function listFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt((req.query.limit as string) || '10', 10)));
    const skip = (page - 1) * limit;

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
      .filter((recipe): recipe is NonNullable<typeof recipe> => Boolean(recipe));

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    res.json({
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
