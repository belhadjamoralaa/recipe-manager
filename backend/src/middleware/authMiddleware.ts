import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

type JwtPayload = {
  id: string;
  email: string;
  username?: string;
};

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      username?: string;
    };
  }
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res
      .status(401)
      .json({ success: false, message: 'No token provided' });
    return;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res
      .status(401)
      .json({ success: false, message: 'Invalid authorization header' });
    return;
  }

  try {
    const decoded = verifyToken(token) as JwtPayload;

    if (!decoded?.id || !decoded?.email) {
      res
        .status(401)
        .json({ success: false, message: 'Invalid token payload' });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
}
