import "server-only";
import { Resend } from "resend";

type AuthEmail = {
  to: string;
  subject: string;
  title: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
  event: "verify-email" | "reset-password";
  idempotencyKey: string;
};

const defaultFrom = "Northstar <hello@momsoilchange.com>";
const from = process.env.RESEND_FROM_EMAIL ?? defaultFrom;

export function getAuthEmailHealth() {
  const missing: string[] = [];
  if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
  if (!process.env.RESEND_FROM_EMAIL) missing.push("RESEND_FROM_EMAIL");

  return {
    provider: "resend" as const,
    configured: missing.length === 0,
    missing,
    from: process.env.RESEND_FROM_EMAIL ?? null,
    requiredInProduction: true,
  };
}

function assertEmailConfigured() {
  const health = getAuthEmailHealth();
  if (health.configured) return;

  const message = `[auth-email] Missing production email configuration: ${health.missing.join(", ")}`;
  if (process.env.NODE_ENV === "production") throw new Error(message);
  console.warn(message);
}

function renderEmail({ title, message, actionLabel, actionUrl }: AuthEmail) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f6f7f2;color:#17382f;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:36px 20px;">
      <div style="background:#17382f;border-radius:18px 18px 0 0;padding:26px 30px;color:#ffffff;">
        <div style="display:inline-block;border-radius:8px;background:#d9ff5a;color:#17382f;font-size:12px;font-weight:800;letter-spacing:-0.08em;padding:7px 8px;">NS</div>
        <p style="margin:18px 0 0;font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#cbe0d3;">Northstar</p>
      </div>
      <div style="background:#ffffff;border:1px solid #dce5df;border-top:0;border-radius:0 0 18px 18px;padding:30px;">
        <h1 style="margin:0;font-size:26px;line-height:1.15;letter-spacing:-.04em;color:#17382f;">${title}</h1>
        <p style="margin:18px 0 26px;font-size:16px;line-height:1.6;color:#4c6458;">${message}</p>
        <a href="${actionUrl}" style="display:inline-block;border-radius:10px;background:#17382f;color:#ffffff;font-size:14px;font-weight:800;padding:13px 18px;text-decoration:none;">${actionLabel}</a>
        <p style="margin:26px 0 0;font-size:12px;line-height:1.6;color:#718279;">If you did not request this, you can safely ignore this email. This link expires automatically for your protection.</p>
      </div>
    </div>
  </body>
</html>`;
}

/**
 * Sends transactional authentication email without exposing account state through
 * provider timing. Production misconfiguration fails the auth operation instead of
 * reporting a successful recovery or verification flow that cannot deliver mail.
 */
export function queueAuthEmail(email: AuthEmail) {
  assertEmailConfigured();
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  void resend.emails.send({
    from,
    to: [email.to],
    subject: email.subject,
    html: renderEmail(email),
    text: `${email.title}\n\n${email.message}\n\n${email.actionLabel}: ${email.actionUrl}`,
    tags: [{ name: "category", value: email.event }],
  }, {
    idempotencyKey: email.idempotencyKey,
  }).then(({ error, data }) => {
    if (error) {
      console.error(JSON.stringify({ event: "auth_email_delivery_failed", authEvent: email.event, recipient: email.to, error }));
      return;
    }
    console.info(JSON.stringify({ event: "auth_email_delivery_accepted", authEvent: email.event, recipient: email.to, providerMessageId: data?.id ?? null }));
  }).catch((error: unknown) => {
    console.error(JSON.stringify({ event: "auth_email_delivery_error", authEvent: email.event, recipient: email.to, error: error instanceof Error ? error.message : String(error) }));
  });
}
