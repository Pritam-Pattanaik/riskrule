import { logger } from '../lib/logger';

// Lazy-load Resend to avoid import errors if the package isn't configured
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
  } catch (err) {
    logger.warn('[EmailService] Failed to initialize Resend client');
    return null;
  }
}

const FROM_ADDRESS = process.env.EMAIL_FROM || 'TradeVault <onboarding@resend.dev>';

/**
 * Sends a password reset email.
 *
 * If RESEND_API_KEY is not set, logs the reset link to the console
 * (development fallback — matches previous behavior).
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string | null,
  resetUrl: string,
  expiryMinutes: number = 5
): Promise<boolean> {
  const displayName = name || 'there';

  // ── Development Fallback ──────────────────────────────────────────────
  const client = getResendClient();

  if (!client) {
    logger.info(`[EmailService] [Dev] Password reset link for ${to}: ${resetUrl}`);
    console.log(`\n🔑 [Dev] Password reset link for ${to}:\n   ${resetUrl}\n   Expires in ${expiryMinutes} minutes.\n`);
    return true;
  }

  // ── Production Email via Resend ───────────────────────────────────────
  try {
    const html = buildResetEmailHtml(displayName, resetUrl, expiryMinutes);
    const text = buildResetEmailText(displayName, resetUrl, expiryMinutes);

    await client.emails.send({
      from: FROM_ADDRESS,
      to: [to],
      subject: 'Reset your TradeVault password',
      html,
      text,
    });

    logger.info(`[EmailService] Password reset email sent to ${to.substring(0, 3)}***`);
    return true;
  } catch (err: any) {
    logger.error(`[EmailService] Failed to send reset email: ${err?.message}`);
    return false;
  }
}

// ─── Plain Text Fallback ──────────────────────────────────────────────────────

function buildResetEmailText(name: string, resetUrl: string, expiryMinutes: number): string {
  return `Hi ${name},

We received a request to reset your TradeVault password.

Reset your password by visiting this link:
${resetUrl}

This link will expire in ${expiryMinutes} minutes.

If you didn't request this, you can safely ignore this email. Your password will remain unchanged.

— TradeVault

This is an automated message. Please do not reply.
If you need help, contact support@tradevault.app`;
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
  <title>Reset your TradeVault password</title>
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
            TradeVault
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
                Hi ${name}, we received a request to reset the password for your TradeVault account. Click the button below to choose a new password.
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
            &copy; ${new Date().getFullYear()} TradeVault &middot; Institutional Trading Journal
          </p>
          <p class="footer-text" style="font-size:12px;color:#999999;line-height:1.6;margin:0;">
            Need help? Contact <a href="mailto:support@tradevault.app" style="color:#6366f1;text-decoration:none;">support@tradevault.app</a>
          </p>
        </td>
      </tr>

    </table>
  </div>
</body>
</html>`;
}
