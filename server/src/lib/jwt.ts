import jwt from 'jsonwebtoken';
import { config } from '../config/env';

/**
 * The ONLY place that signs or verifies access tokens.
 * The raw signing key is intentionally not exported from anywhere.
 */

export interface AccessTokenPayload {
  userId: string;
  /** Token version. Must match users.token_version, which allows forced revocation. */
  v: number;
}

export const ACCESS_TOKEN_TTL = '7d';

export function signAccessToken(user: { id: string; tokenVersion: number }): string {
  return jwt.sign({ userId: user.id, v: user.tokenVersion }, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: ACCESS_TOKEN_TTL,
    issuer: config.jwtIssuer,
    audience: config.jwtAudience,
  });
}

/**
 * Throws if the token is invalid, expired, has the wrong algorithm/issuer/audience,
 * or lacks the mandatory `v` claim (tokens without `v` used to bypass revocation).
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, config.jwtSecret, {
    algorithms: ['HS256'],
    issuer: config.jwtIssuer,
    audience: config.jwtAudience,
  }) as Partial<AccessTokenPayload>;

  if (typeof decoded.userId !== 'string' || !decoded.userId) {
    throw new Error('Malformed token: missing userId');
  }
  if (typeof decoded.v !== 'number' || !Number.isInteger(decoded.v)) {
    throw new Error('Malformed token: missing token version');
  }
  return { userId: decoded.userId, v: decoded.v };
}
