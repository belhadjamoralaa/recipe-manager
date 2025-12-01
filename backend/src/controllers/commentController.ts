import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Comment from '../models/Comment';
import Recipe from '../models/Recipe';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

function sendNotFound(res: Response, message = 'Resource not found'): void {
  res.status(404).json({ success: false, message });
}

function sendUnauthorized(res: Response): void {
  res.status(401).json({ success: false, message: 'Unauthorized' });
}

function validateObjectIdOr404(
  id: string,
  res: Response,
  message: string,
): boolean {
  if (!isValidObjectId(id)) {
    sendNotFound(res, message);
    return false;
  }
  return true;
}

async function ensureRecipeExists(
  recipeId: string,
  res: Response,
): Promise<boolean> {
  const recipeExists = await Recipe.exists({ _id: recipeId });
  if (!recipeExists) {
    sendNotFound(res, 'Recipe not found');
    return false;
  }
  return true;
}

export async function listComments(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { recipeId } = req.params;

    if (!validateObjectIdOr404(recipeId, res, 'Recipe not found')) {
      return;
    }

    if (!(await ensureRecipeExists(recipeId, res))) {
      return;
    }

    const comments = await Comment.find({ recipe: recipeId })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatarUrl');

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
}

export async function addComment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { recipeId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendUnauthorized(res);
      return;
    }

    if (!validateObjectIdOr404(recipeId, res, 'Recipe not found')) {
      return;
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      res
        .status(400)
        .json({ success: false, message: 'Content is required' });
      return;
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      sendNotFound(res, 'Recipe not found');
      return;
    }

    const comment = await Comment.create({
      recipe: recipeId,
      author: userId,
      content: content.trim(),
    });

    await comment.populate('author', 'username avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { recipeId, commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      sendUnauthorized(res);
      return;
    }

    if (
      !validateObjectIdOr404(recipeId, res, 'Comment not found') ||
      !validateObjectIdOr404(commentId, res, 'Comment not found')
    ) {
      return;
    }

    const comment = await Comment.findById(commentId);
    if (!comment || comment.recipe.toString() !== recipeId) {
      sendNotFound(res, 'Comment not found');
      return;
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      sendNotFound(res, 'Recipe not found');
      return;
    }

    const isCommentAuthor = comment.author.toString() === userId;
    const isRecipeAuthor = recipe.author.toString() === userId;

    if (!isCommentAuthor && !isRecipeAuthor) {
      res.status(403).json({
        success: false,
        message: 'You are not allowed to delete this comment',
      });
      return;
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
