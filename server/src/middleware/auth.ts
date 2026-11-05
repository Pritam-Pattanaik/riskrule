import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';
import { verifyAccessToken } from '../lib/jwt';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  userPlan?: string;
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
    // Verifies HS256 signature, issuer, audience, expiry and the MANDATORY `v` claim.
    const decoded = verifyAccessToken(token);

    // Check token version for forced invalidation (v is always present, so this cannot be skipped)
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, role: true, plan: true, tokenVersion: true } });
    if (!user || decoded.v !== user.tokenVersion) {
      res.status(401).json({ error: 'Token invalidated' });
      return;
    }

    req.userId = decoded.userId;
    req.userRole = user.role;
    req.userPlan = user.plan;
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
