import nodemailer from 'nodemailer';
import { logger } from '../lib/logger';

// ─── Transport Priority ────────────────────────────────────────────────────────
// 1. Generic SMTP  (SMTP_HOST + SMTP_USER + SMTP_PASS)  ← primary
//    Works with any provider: Gmail, Brevo, Mailgun, SendGrid, etc.
// 2. Resend API    (RESEND_API_KEY)                     ← fallback
// 3. Console log                                        ← dev-only last resort
// ─────────────────────────────────────────────────────────────────────────────

// ── Generic / Gmail SMTP transporter (lazy-init, cached) ─────────────────────
let smtpTransporter: nodemailer.Transporter | null = null;

function getSmtpTransporter(): nodemailer.Transporter | null {
  if (smtpTransporter) return smtpTransporter;

  // Read env vars at runtime (not at module import time) so dotenv always wins
  const host   = process.env.SMTP_HOST || (process.env.GMAIL_USER ? 'smtp.gmail.com' : '');
  const port   = parseInt(process.env.SMTP_PORT || '587', 10);
  const user   = process.env.SMTP_USER || process.env.GMAIL_USER || '';
  const pass   = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '';
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!user || !pass) return null;

  if (host === 'smtp.gmail.com' || (!host && user.endsWith('@gmail.com'))) {
    smtpTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });
  } else {
    smtpTransporter = nodemailer.createTransport({
      host: host || 'smtp.gmail.com',
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return smtpTransporter;
}

// ── Resend client (lazy-init, cached) ─────────────────────────────────────────
let resendClient: any = null;

function getResendClient() {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Resend } = require('resend');
    resendClient = new Resend(apiKey);
    return resendClient;
  } catch {
    logger.warn('[EmailService] Failed to initialize Resend client');
    return null;
  }
}

/**
 * Sends a password reset email.
 *
 * Transport priority:
 *   1. Generic SMTP  (set SMTP_HOST + SMTP_USER + SMTP_PASS in .env)
 *   2. Resend API    (set RESEND_API_KEY in .env)
 *   3. Console log   (dev fallback — no email is actually sent)
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string | null,
  resetUrl: string,
  expiryMinutes: number = 5
): Promise<boolean> {
  const displayName = name || 'there';
  const fromName    = process.env.EMAIL_FROM_NAME  || 'RiskRule';
  const fromEmail   = process.env.SMTP_FROM_EMAIL  || process.env.SMTP_USER || process.env.GMAIL_USER || 'admin.riskrule@gmail.com';
  const html = buildResetEmailHtml(displayName, resetUrl, expiryMinutes);
  const text = buildResetEmailText(displayName, resetUrl, expiryMinutes);

  // ── 1. Generic SMTP ───────────────────────────────────────────────────────
  const smtpTransport = getSmtpTransporter();
  if (smtpTransport) {
    try {
      await smtpTransport.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject: 'Reset your RiskRule password',
        html,
        text,
      });
      logger.info(`[EmailService] Password reset email sent via SMTP to ${to.substring(0, 3)}***`);
      return true;
    } catch (err: any) {
      logger.error(`[EmailService] SMTP send failed: ${err?.message || err}`);
    }
  }

  // ── 2. Resend API ─────────────────────────────────────────────────────────
  const resend = getResendClient();
  if (resend) {
    try {
      await resend.emails.send({
        from: `${fromName} <onboarding@resend.dev>`,
        to: [to],
        subject: 'Reset your RiskRule password',
        html,
        text,
      });
      logger.info(`[EmailService] Password reset email sent via Resend to ${to.substring(0, 3)}***`);
      return true;
    } catch (err: any) {
      logger.error(`[EmailService] Resend failed: ${err?.message || err}`);
    }
  }

  // ── 3. Console Fallback (Dev only) ────────────────────────────────────────
  logger.warn('[EmailService] No active email transport succeeded. Falling back to console log.');
  logger.info(`[EmailService] [Dev] Password reset link for ${to}: ${resetUrl}`);
  console.log(`\n🔑 [Dev] Password reset link for ${to}:\n   ${resetUrl}\n   Expires in ${expiryMinutes} minutes.\n`);
  return true;
}

// ─── Plain Text Fallback ──────────────────────────────────────────────────────

function buildResetEmailText(name: string, resetUrl: string, expiryMinutes: number): string {
  return `Hi ${name},

We received a request to reset your RiskRule password.

Reset your password by visiting this link:
${resetUrl}

This link will expire in ${expiryMinutes} minutes.

If you didn't request this, you can safely ignore this email. Your password will remain unchanged.

— RiskRule

This is an automated message. Please do not reply.
If you need help, contact admin.riskrule@gmail.com`;
}

// ─── Minimal, Professional HTML Email Template ────────────────────────────────
// Design: GitHub / Stripe / Linear style — clean, minimal, professional.
// No heavy gradients, no unnecessary graphics. Works in dark and light mode.

function buildResetEmailHtml(name: string, resetUrl: string, expiryMinutes: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Reset your RiskRule password</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root { color-scheme: light dark; }

    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f6f6f6;
      color: #1a1a1a;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media (prefers-color-scheme: dark) {
      body { background-color: #111111 !important; color: #e5e5e5 !important; }
      .outer-bg { background-color: #111111 !important; }
      .card { background-color: #1a1a1a !important; border-color: #2a2a2a !important; }
      .heading { color: #f0f0f0 !important; }
      .body-text { color: #b0b0b0 !important; }
      .muted-text { color: #777777 !important; }
      .divider { border-color: #2a2a2a !important; }
      .footer-text { color: #666666 !important; }
      .url-text { color: #818cf8 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;">
  <div class="outer-bg" style="background-color:#f6f6f6;padding:48px 20px;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px;margin:0 auto;">

      <!-- Logo -->
      <tr>
        <td style="padding-bottom:28px;text-align:center;">
          <span class="heading" style="font-size:22px;font-weight:700;color:#1a1a1a;letter-spacing:-0.3px;">
            RiskRule
          </span>
        </td>
      </tr>

      <!-- Card -->
      <tr>
        <td>
          <div class="card" style="background-color:#ffffff;border:1px solid #e8e8e8;border-radius:12px;overflow:hidden;">
            <div style="padding:40px 36px;">

              <!-- Heading -->
              <h1 class="heading" style="font-size:20px;font-weight:700;color:#1a1a1a;margin:0 0 16px 0;letter-spacing:-0.2px;">
                Reset your password
              </h1>

              <!-- Body -->
              <p class="body-text" style="font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 24px 0;">
                Hi ${name}, we received a request to reset the password for your RiskRule account. Click the button below to choose a new password.
              </p>

              <!-- CTA Button -->
              <div style="margin:0 0 24px 0;">
                <a href="${resetUrl}" target="_blank" rel="noopener noreferrer"
                   style="display:inline-block;background-color:#111111;color:#ffffff;font-size:14px;font-weight:600;padding:12px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.1px;">
                  Reset Password
                </a>
              </div>

              <!-- Expiry -->
              <p class="muted-text" style="font-size:13px;color:#888888;line-height:1.6;margin:0 0 20px 0;">
                This link will expire in <strong>${expiryMinutes} minutes</strong>.
              </p>

              <!-- Divider -->
              <hr class="divider" style="border:none;border-top:1px solid #eeeeee;margin:20px 0;">

              <!-- Security Notice -->
              <p class="muted-text" style="font-size:13px;color:#888888;line-height:1.6;margin:0 0 16px 0;">
                If you didn't request this, you can safely ignore this email. Your password will not be changed.
              </p>

              <!-- Fallback URL -->
              <p class="muted-text" style="font-size:12px;color:#aaaaaa;line-height:1.5;word-break:break-all;margin:0;">
                If the button doesn't work, paste this URL into your browser:<br>
                <a href="${resetUrl}" class="url-text" style="color:#6366f1;text-decoration:none;">${resetUrl}</a>
              </p>

            </div>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding-top:24px;text-align:center;">
          <p class="footer-text" style="font-size:12px;color:#999999;line-height:1.6;margin:0 0 4px 0;">
            &copy; ${new Date().getFullYear()} RiskRule &middot; Trading Risk Management
          </p>
          <p class="footer-text" style="font-size:12px;color:#999999;line-height:1.6;margin:0;">
            Need help? Contact <a href="mailto:admin.riskrule@gmail.com" style="color:#6366f1;text-decoration:none;">admin.riskrule@gmail.com</a>
          </p>
        </td>
      </tr>

    </table>
  </div>
</body>
</html>`;
}
