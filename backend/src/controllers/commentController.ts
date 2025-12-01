import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Comment from '../models/Comment';
import Recipe from '../models/Recipe';

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function listComments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { recipeId } = req.params;

    if (!isValidObjectId(recipeId)) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const recipeExists = await Recipe.exists({ _id: recipeId });
    if (!recipeExists) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const comments = await Comment.find({ recipe: recipeId })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatarUrl');

    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
}

export async function addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { recipeId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!isValidObjectId(recipeId)) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      res.status(400).json({ success: false, message: 'Content is required' });
      return;
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const comment = await Comment.create({ recipe: recipeId, author: userId, content: content.trim() });
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

export async function deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { recipeId, commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!isValidObjectId(recipeId) || !isValidObjectId(commentId)) {
      res.status(404).json({ success: false, message: 'Comment not found' });
      return;
    }

    const comment = await Comment.findById(commentId);
    if (!comment || comment.recipe.toString() !== recipeId) {
      res.status(404).json({ success: false, message: 'Comment not found' });
      return;
    }

    // Allow deletion by comment author or recipe author
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const isCommentAuthor = comment.author.toString() === userId;
    const isRecipeAuthor = recipe.author.toString() === userId;

    if (!isCommentAuthor && !isRecipeAuthor) {
      res.status(403).json({ success: false, message: 'You are not allowed to delete this comment' });
      return;
    }

    await comment.deleteOne();

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
}
