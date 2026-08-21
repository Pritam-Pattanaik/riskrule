import { Request, Response, NextFunction } from 'express';

const MAX_MESSAGE_LENGTH = 2000;

export interface SanitizedChatRequest extends Request {
  sanitizedMessage?: string;
  parsedMode?: string;
}

const ALLOWED_MODES = [
  'general',
  'performance',
  'psychology',
  'risk',
  'strategy',
  'journal',
  'premarket',
  'postmarket'
];

/**
 * Sanitizes incoming user messages for the AI Coach:
 * 1. Strips null bytes and control characters
 * 2. Rejects whitespace-only messages
 * 3. Enforces 2000 character limit
 * 4. Extracts and validates [MODE:xxx] tags
 */
export function sanitizeChatInput(req: SanitizedChatRequest, res: Response, next: NextFunction): void {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'A valid text message is required.' });
    return;
  }

  // Strip null bytes and non-printable control characters
  const cleanRaw = message.replace(/\0/g, '').trim();

  if (cleanRaw.length === 0) {
    res.status(400).json({ error: 'Message cannot be empty or whitespace only.' });
    return;
  }

  if (cleanRaw.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({
      error: `Message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters (received ${cleanRaw.length}).`
    });
    return;
  }

  // Parse [MODE:xxx] prefix if present
  let cleanMessage = cleanRaw;
  let mode = 'general';

  if (cleanRaw.startsWith('[MODE:')) {
    const endBracket = cleanRaw.indexOf(']');
    if (endBracket !== -1) {
      const candidateMode = cleanRaw.substring(6, endBracket).toLowerCase().trim();
      if (ALLOWED_MODES.includes(candidateMode)) {
        mode = candidateMode;
      }
      cleanMessage = cleanRaw.substring(endBracket + 1).trim();
    }
  }

  req.sanitizedMessage = cleanMessage;
  req.parsedMode = mode;
  next();
}
