import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

// C-3 fix: No fallback secret. Crash at startup if JWT_SECRET is missing or weak.
const _jwtSecret = process.env.JWT_SECRET;
if (!_jwtSecret || _jwtSecret.length < 32) {
  throw new Error(
    'FATAL: JWT_SECRET environment variable must be set to a cryptographically random value of at least 32 characters. ' +
    'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
  );
}
export const JWT_SECRET = _jwtSecret;

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

// Middleware to authenticate JWT
export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.query && req.query.token && req.path.includes('/stream')) {
    // M-2 fix: Only accept query param tokens for SSE endpoints (EventSource can't send headers)
    token = req.query.token as string;
  }

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    // L-1 fix: Explicitly specify HS256 to prevent algorithm confusion attacks
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as { userId: string; v?: number };
    
    // Check token version for forced invalidation
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, role: true, tokenVersion: true } });
    if (!user || (decoded.v !== undefined && decoded.v !== user.tokenVersion)) {
      res.status(401).json({ error: 'Token invalidated' });
      return;
    }

    req.userId = decoded.userId;
    req.userRole = user.role;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRoles(allowedRoles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.userId! } });
      if (!user || !allowedRoles.includes(user.role)) {
        res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        return;
      }
      req.userRole = user.role;
      next();
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
