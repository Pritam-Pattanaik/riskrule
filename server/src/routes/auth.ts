import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db';
import { authenticate, AuthRequest, JWT_SECRET } from '../middleware/auth';
import { lockService } from '../services/lockService';
import { sendPasswordResetEmail } from '../services/emailService';
import { logger } from '../lib/logger';
import { cache } from '../lib/redis';

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password must contain at least one uppercase letter').regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().optional(),
});

// POST /api/auth/signup
router.post('/signup', lockService.authRateLimit(), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }
    const { email, password, fullName } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ error: 'An account with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: fullName || null,
      },
    });

    const token = jwt.sign({ userId: newUser.id, v: newUser.tokenVersion }, JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(201).json({
      token,
      user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName, avatarUrl: newUser.avatarUrl, timezone: newUser.timezone, role: newUser.role },
    });
  } catch (err: any) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/auth/login
router.post('/login', lockService.authRateLimit(), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ userId: user.id, v: user.tokenVersion }, JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, COOKIE_OPTIONS);

    res.json({
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl, timezone: user.timezone, role: user.role },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // ── Session Invalidation Check ──────────────────────────────────────
    // If the JWT's token version is behind the user's current version,
    // this session was issued before a password reset and must be rejected.
    const jwtVersion = req.tokenVersion ?? 0;
    if (jwtVersion < user.tokenVersion) {
      res.clearCookie('token', COOKIE_OPTIONS);
      res.status(401).json({ error: 'Session invalidated. Please log in again.' });
      return;
    }

    const token = jwt.sign({ userId: user.id, v: user.tokenVersion }, JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl, timezone: user.timezone, role: user.role },
    });
  } catch (err: any) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/auth/profile
router.patch('/profile', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, avatarUrl, timezone } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.userId! },
      data: { fullName, avatarUrl, timezone, updatedAt: new Date() },
    });
    res.json({ user: { id: updated.id, email: updated.email, fullName: updated.fullName, avatarUrl: updated.avatarUrl, timezone: updated.timezone, role: updated.role } });
  } catch (err: any) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const RESET_TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const EMAIL_COOLDOWN_SECONDS = 60;

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * Hash a raw reset token with SHA-256 before database storage.
 * The raw token is sent via email; only the hash is persisted.
 */
function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

// POST /api/auth/forgot-password
router.post('/forgot-password', lockService.authRateLimit(), async (req: Request, res: Response): Promise<void> => {
  const GENERIC_SUCCESS = { success: true, message: 'If an account exists, a reset link has been sent.' };
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }
    const { email } = parsed.data;
    const ip = ((req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    const userAgent = (req.headers['user-agent'] || 'unknown').substring(0, 500);

    // ── Email Cooldown (60s per email address) ──────────────────────────
    const cooldownKey = `pwd-reset-cooldown:${email.toLowerCase()}`;
    const cooldownActive = await cache.get(cooldownKey);
    if (cooldownActive) {
      // Don't reveal the cooldown to prevent email enumeration
      res.json(GENERIC_SUCCESS);
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Prevent email enumeration: always return generic success
      // Set cooldown even for non-existent emails to prevent timing attacks
      await cache.setex(cooldownKey, EMAIL_COOLDOWN_SECONDS, '1');
      res.json(GENERIC_SUCCESS);
      return;
    }

    // ── Generate Cryptographically Secure Token ─────────────────────────
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

    // ── Delete Any Existing Tokens for This User ────────────────────────
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    // ── Store Hashed Token ──────────────────────────────────────────────
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        ipAddress: ip,
        userAgent,
      },
    });

    // ── Set Email Cooldown ──────────────────────────────────────────────
    await cache.setex(cooldownKey, EMAIL_COOLDOWN_SECONDS, '1');

    // ── Send Reset Email ────────────────────────────────────────────────
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail(user.email, user.fullName, resetUrl, 5);

    // ── Audit Log ───────────────────────────────────────────────────────
    await prisma.auditLog.create({
      data: {
        adminId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        targetType: 'USER',
        targetId: user.id,
        details: JSON.stringify({ ip, userAgent: userAgent.substring(0, 200) }),
      },
    });

    logger.info(`[Auth] Password reset requested for user ${user.id.substring(0, 8)}***`);
    res.json(GENERIC_SUCCESS);
  } catch (err) {
    logger.error(`[Auth] Forgot password error: ${(err as Error)?.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password must contain at least one uppercase letter').regex(/[0-9]/, 'Password must contain at least one number'),
});

// POST /api/auth/reset-password
router.post('/reset-password', lockService.authRateLimit(), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }
    const { token, password } = parsed.data;
    const ip = ((req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    const userAgent = (req.headers['user-agent'] || 'unknown').substring(0, 500);

    // ── Hash the Incoming Token ─────────────────────────────────────────
    const tokenHash = hashResetToken(token);

    // ── Find Token Record ───────────────────────────────────────────────
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetRecord) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    // ── Validate Expiry ─────────────────────────────────────────────────
    if (new Date() > resetRecord.expiresAt) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } }).catch(() => {});
      res.status(400).json({ error: 'Reset token has expired. Please request a new one.' });
      return;
    }

    // ── Hash New Password ───────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── Atomic Transaction: Update Password + Invalidate Sessions + Delete Token ──
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: {
          password: hashedPassword,
          tokenVersion: { increment: 1 }, // Invalidates all existing JWTs
          updatedAt: new Date(),
        },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { userId: resetRecord.userId }, // Delete ALL tokens for this user
      }),
    ]);

    // ── Audit Log ───────────────────────────────────────────────────────
    await prisma.auditLog.create({
      data: {
        adminId: resetRecord.userId,
        action: 'PASSWORD_RESET_COMPLETED',
        targetType: 'USER',
        targetId: resetRecord.userId,
        details: JSON.stringify({ ip, userAgent: userAgent.substring(0, 200) }),
      },
    });

    logger.info(`[Auth] Password reset completed for user ${resetRecord.userId.substring(0, 8)}***`);
    res.json({ success: true, message: 'Password has been successfully reset.' });
  } catch (err) {
    logger.error(`[Auth] Reset password error: ${(err as Error)?.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/verify-reset-token
router.get('/verify-reset-token', lockService.authRateLimit(), async (req: Request, res: Response): Promise<void> => {
  try {
    const rawToken = req.query.token as string;
    if (!rawToken || typeof rawToken !== 'string' || rawToken.length < 10) {
      res.status(400).json({ valid: false, reason: 'invalid' });
      return;
    }

    const tokenHash = hashResetToken(rawToken);
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetRecord) {
      res.status(400).json({ valid: false, reason: 'invalid' });
      return;
    }

    if (new Date() > resetRecord.expiresAt) {
      res.status(400).json({ valid: false, reason: 'expired' });
      return;
    }

    res.json({ valid: true });
  } catch (err) {
    logger.error(`[Auth] Verify reset token error: ${(err as Error)?.message}`);
    res.status(500).json({ valid: false, reason: 'invalid' });
  }
});

// DELETE /api/auth/account
router.delete('/account', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.user.delete({
      where: { id: req.userId! },
    });
    res.clearCookie('token', COOKIE_OPTIONS);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err: any) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
