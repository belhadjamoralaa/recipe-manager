import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Recipe from '../models/Recipe';

function parsePagination(query: Request['query']) {
  const page = Math.max(1, parseInt((query.page as string) || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt((query.limit as string) || '10', 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function normalizeIngredients(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map(String).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export async function listRecipes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const q = (req.query.q as string) || '';

    const filter: Record<string, unknown> = {};
    if (q.trim()) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const [recipes, totalItems] = await Promise.all([
      Recipe.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username email'),
      Recipe.countDocuments(filter),
    ]);

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

export async function getRecipeById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const recipe = await Recipe.findById(id).populate('author', 'username email');
    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    res.json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
}

export async function createRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, description, instructions, imageUrl } = req.body;
    const ingredients = normalizeIngredients(req.body.ingredients);

    if (!title || !description || !instructions) {
      res.status(400).json({ success: false, message: 'Title, description, and instructions are required' });
      return;
    }

    const authorId = req.user?.id;
    if (!authorId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const recipe = await Recipe.create({
      title,
      description,
      instructions,
      ingredients,
      imageUrl,
      author: authorId,
    });

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const userId = req.user?.id;
    if (!userId || recipe.author.toString() !== userId) {
      res.status(403).json({ success: false, message: 'You are not allowed to update this recipe' });
      return;
    }

    const { title, description, instructions, imageUrl } = req.body;
    const ingredients = req.body.ingredients !== undefined ? normalizeIngredients(req.body.ingredients) : undefined;

    if (title !== undefined) recipe.title = title;
    if (description !== undefined) recipe.description = description;
    if (instructions !== undefined) recipe.instructions = instructions;
    if (ingredients !== undefined) recipe.ingredients = ingredients;
    if (imageUrl !== undefined) recipe.imageUrl = imageUrl;

    await recipe.save();

    res.json({ success: true, message: 'Recipe updated successfully', data: recipe });
  } catch (error) {
    next(error);
  }
}

export async function deleteRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const userId = req.user?.id;
    if (!userId || recipe.author.toString() !== userId) {
      res.status(403).json({ success: false, message: 'You are not allowed to delete this recipe' });
      return;
    }

    await recipe.deleteOne();

    res.json({ success: true, message: 'Recipe deleted successfully' });
  } catch (error) {
    next(error);
  }
}
