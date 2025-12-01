import { Request, Response } from 'express';
import User from '../models/User';
import { signToken } from '../utils/jwt';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

function buildUserResponse(user: any) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

function handleDuplicateKeyError(error: unknown, res: Response): boolean {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: number }).code === 11000
  ) {
    res.status(409).json({
      success: false,
      message: 'Email is already in use',
    });
    return true;
  }
  return false;
}

export async function register(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({
      success: false,
      message: 'Username, email, and password are required',
    });
    return;
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'Email is already in use',
      });
      return;
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = signToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (handleDuplicateKeyError(error, res)) {
      return;
    }

    const message =
      error instanceof Error ? error.message : 'Registration failed';

    res.status(500).json({ success: false, message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error('Login error:', error);

    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(500).json({ success: false, message });
  }
}

export async function getMe(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
}
