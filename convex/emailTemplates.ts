/**
 * Email Templates - Refactored for conciseness
 * All templates use a shared layout and parameterized content.
 */

// Brand configuration
const BRAND = {
  name: "Your App Name",
  website: "https://yourapp.com",
  supportEmail: "support@yourapp.com",
  primaryColor: "#e5e5e5",
  accentColor: "#d4d4d4",
  backgroundColor: "#1a1a1a",
  cardBackground: "#262626",
  textColor: "#fafafa",
  mutedColor: "#a3a3a3",
  borderColor: "rgba(255, 255, 255, 0.1)",
};

// Base email styles
const baseStyles = `
  body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${BRAND.backgroundColor}; color: ${BRAND.textColor}; line-height: 1.6; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .card { background-color: ${BRAND.cardBackground}; border-radius: 12px; border: 1px solid ${BRAND.borderColor}; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); }
  .header { text-align: center; margin-bottom: 32px; }
  .brand-name { font-size: 24px; font-weight: 700; color: ${BRAND.textColor}; margin: 0; }
  h1 { font-size: 28px; font-weight: 700; color: ${BRAND.textColor}; margin: 0 0 16px; text-align: center; }
  h2 { font-size: 20px; font-weight: 600; color: ${BRAND.textColor}; margin: 24px 0 12px; }
  p { color: ${BRAND.mutedColor}; margin: 0 0 16px; font-size: 16px; }
  .highlight { color: ${BRAND.primaryColor}; font-weight: 600; }
  .button { display: inline-block; background-color: ${BRAND.primaryColor}; color: ${BRAND.backgroundColor} !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; }
  .button-container { text-align: center; }
  .divider { border: none; border-top: 1px solid ${BRAND.borderColor}; margin: 32px 0; }
  .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid ${BRAND.borderColor}; }
  .footer p { font-size: 14px; color: ${BRAND.mutedColor}; margin: 8px 0; }
  .footer a { color: ${BRAND.primaryColor}; text-decoration: none; }
  .feature-item { display: flex; align-items: center; margin: 12px 0; color: ${BRAND.mutedColor}; }
  .feature-icon { color: ${BRAND.primaryColor}; margin-right: 12px; font-size: 18px; }
  .order-details { background-color: rgba(255, 255, 255, 0.05); border: 1px solid ${BRAND.borderColor}; border-radius: 8px; padding: 20px; margin: 24px 0; }
  .order-table { width: 100%; border-collapse: collapse; }
  .order-table td { border-bottom: 1px solid ${BRAND.borderColor}; padding: 12px 0; font-size: 14px; color: ${BRAND.textColor}; }
  .order-table tr:last-child td { border-bottom: none; }
  .order-table td:first-child { color: ${BRAND.mutedColor}; text-align: left; width: 40%; }
  .order-table td:last-child { text-align: right; font-weight: 500; }
  .feature-list { margin: 16px 0; padding: 0; list-style: none; }
`;

// Wrap content in base layout
function wrapInLayout(content: string, previewText = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND.name}</title>
  <style>${baseStyles}</style>
</head>
<body>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>` : ""}
  <div class="container"><div class="card">
    <div class="header"><p class="brand-name">${BRAND.name}</p></div>
    ${content}
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
      <p><a href="${BRAND.website}">Website</a> • <a href="mailto:${BRAND.supportEmail}">Contact Support</a></p>
    </div>
  </div></div>
</body>
</html>`.trim();
}

// Helper: Generate feature list HTML
const featureList = (items: string[]) =>
  `<ul class="feature-list">${items.map(i => `<li class="feature-item"><span class="feature-icon">✓</span><span>${i}</span></li>`).join("")}</ul>`;

// Helper: Generate order details table
const orderTable = (rows: [string, string][]) =>
  `<div class="order-details"><table class="order-table">${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</table></div>`;

// ============================================
// EMAIL TYPES & PARAMS
// ============================================
export type EmailType = "welcome" | "premium_plus" | "premium_pro" | "premium_lifetime" | "credit_bundle" | "generic_purchase";

export interface WelcomeEmailParams { userName: string; email: string; }
export interface PurchaseEmailParams { userName: string; email: string; productName: string; productDescription?: string; amount: string; currency: string; orderId?: string; purchaseDate?: string; }
export interface CreditBundleEmailParams extends PurchaseEmailParams { credits?: number; bundleName?: string; }

// ============================================
// WELCOME EMAIL
// ============================================
export const getWelcomeEmailSubject = () => `Welcome to ${BRAND.name}!`;

export function getWelcomeEmailHtml({ userName }: WelcomeEmailParams): string {
  return wrapInLayout(`
    <h1>Welcome to ${BRAND.name}!</h1>
    <p style="text-align: center; font-size: 18px;">Hey <span class="highlight">${userName || "there"}</span>, we're thrilled to have you on board!</p>
    <hr class="divider">
    <h2>Here's what you can do next:</h2>
    ${featureList(["Explore our premium features and tools", "Set up your profile and preferences", "Check out our getting started guide", "Connect with our community"])}
    <div class="button-container"><a href="${BRAND.website}" class="button">Get Started →</a></div>
    <p style="text-align: center;">Questions? Contact us at <a href="mailto:${BRAND.supportEmail}" style="color: ${BRAND.primaryColor};">${BRAND.supportEmail}</a></p>
  `, `Welcome to ${BRAND.name}! We're excited to have you.`);
}

// ============================================
// PREMIUM PURCHASE EMAILS (Unified)
// ============================================
type PlanConfig = { subject: string; period: string; headline: string; features: string[]; preview: string };

const PLAN_CONFIGS: Record<string, PlanConfig> = {
  premium_plus: {
    subject: "Welcome to Premium Plus!",
    period: "/month",
    headline: "your Plus subscription is now active!",
    features: ["Everything in Free", "500 bonus credits", "Advanced features", "Email support", "Priority queue"],
    preview: "Your Premium Plus subscription is now active!",
  },
  premium_pro: {
    subject: "Welcome to Premium Pro!",
    period: "/month",
    headline: "your Pro subscription is now active!",
    features: ["Everything in Plus", "500 bonus credits", "Pro-only features", "Priority support", "Custom integrations", "API access", "White-label options"],
    preview: "Your Premium Pro subscription is now active!",
  },
  premium_lifetime: {
    subject: "Welcome to Premium Lifetime!",
    period: " (one-time)",
    headline: "you now have lifetime access!",
    features: ["Everything in Pro", "Lifetime access", "All future updates", "Priority support forever", "1000 one-time bonus credits"],
    preview: "Congratulations! You now have lifetime access!",
  },
};

function getPremiumEmailHtml(type: string, params: PurchaseEmailParams): string {
  const config = PLAN_CONFIGS[type] || PLAN_CONFIGS.premium_monthly;
  const { userName, productName, amount, currency, orderId, purchaseDate } = params;
  const rows: [string, string][] = [
    ["Plan", productName || type.replace("premium_", "Premium ").replace(/_/g, " ")],
    ["Amount", `${currency} ${amount}${config.period}`],
  ];
  if (orderId) rows.push(["Order ID", orderId]);
  if (purchaseDate) rows.push(["Date", purchaseDate]);

  const title = type === "premium_lifetime" ? "Welcome to Premium Forever!" : "Welcome to Premium!";
  return wrapInLayout(`
    <h1>${title}</h1>
    <p style="text-align: center; font-size: 18px;">Hi <span class="highlight">${userName || "there"}</span>, ${config.headline}</p>
    ${orderTable(rows)}
    <h2>Your ${type === "premium_lifetime" ? "Lifetime" : "Premium"} Benefits:</h2>
    ${featureList(config.features)}
    <div class="button-container"><a href="${BRAND.website}" class="button">Start Exploring →</a></div>
    ${type === "premium_lifetime" ? `<p style="text-align: center; font-size: 14px;">Thank you for believing in us! We're honored to have you as a lifetime member.</p>` : ""}
  `, config.preview);
}

// Export individual functions for backwards compatibility
export const getPremiumPlusEmailSubject = () => PLAN_CONFIGS.premium_plus.subject;
export const getPremiumPlusEmailHtml = (p: PurchaseEmailParams) => getPremiumEmailHtml("premium_plus", p);
export const getPremiumProEmailSubject = () => PLAN_CONFIGS.premium_pro.subject;
export const getPremiumProEmailHtml = (p: PurchaseEmailParams) => getPremiumEmailHtml("premium_pro", p);
export const getPremiumLifetimeEmailSubject = () => PLAN_CONFIGS.premium_lifetime.subject;
export const getPremiumLifetimeEmailHtml = (p: PurchaseEmailParams) => getPremiumEmailHtml("premium_lifetime", p);

// ============================================
// CREDIT BUNDLE EMAIL
// ============================================
export const getCreditBundleEmailSubject = (credits = 0) => `Your ${credits} Credits Have Been Added!`;

export function getCreditBundleEmailHtml(params: CreditBundleEmailParams): string {
  const { userName, productName, amount, currency, orderId, purchaseDate, credits, bundleName } = params;
  const rows: [string, string][] = [
    ["Bundle", bundleName || productName || "Credit Bundle"],
    ["Credits Added", `<strong>${credits || "N/A"} Credits</strong>`],
    ["Amount Paid", `${currency} ${amount}`],
  ];
  if (orderId) rows.push(["Order ID", orderId]);
  if (purchaseDate) rows.push(["Date", purchaseDate]);

  return wrapInLayout(`
    <h1>Credits Added to Your Account!</h1>
    <p style="text-align: center; font-size: 18px;">Hi <span class="highlight">${userName || "there"}</span>, your credits have been added!</p>
    ${orderTable(rows)}
    <h2>How to Use Your Credits:</h2>
    ${featureList(["Credits are available immediately in your account", "Use credits for premium features and actions", "Your credits <strong>never expire</strong>", "Check your balance anytime in your dashboard"])}
    <div class="button-container"><a href="${BRAND.website}" class="button">Go to Dashboard →</a></div>
  `, `${credits || "Your"} credits have been added to your account!`);
}

// ============================================
// GENERIC PURCHASE EMAIL
// ============================================
export const getGenericPurchaseEmailSubject = () => `Thank you for your purchase!`;

export function getGenericPurchaseEmailHtml(params: PurchaseEmailParams): string {
  const { userName, productName, amount, currency, orderId, purchaseDate } = params;
  const rows: [string, string][] = [["Product", productName || "Product"], ["Amount Paid", `${currency} ${amount}`]];
  if (orderId) rows.push(["Order ID", orderId]);
  if (purchaseDate) rows.push(["Date", purchaseDate]);

  return wrapInLayout(`
    <h1>Thank You for Your Purchase!</h1>
    <p style="text-align: center; font-size: 18px;">Hi <span class="highlight">${userName || "there"}</span>, your purchase has been confirmed!</p>
    ${orderTable(rows)}
    <p style="text-align: center;">Your purchase is now available in your account. If you have any questions, please don't hesitate to contact us.</p>
    <div class="button-container"><a href="${BRAND.website}" class="button">Go to Dashboard →</a></div>
  `, "Your purchase has been confirmed!");
}

// ============================================
// UNIFIED EMAIL CONTENT GETTER
// ============================================
export function getEmailContent(type: EmailType, params: WelcomeEmailParams | PurchaseEmailParams): { subject: string; html: string } {
  switch (type) {
    case "welcome":
      return { subject: getWelcomeEmailSubject(), html: getWelcomeEmailHtml(params as WelcomeEmailParams) };
    case "premium_plus":
    case "premium_pro":
    case "premium_lifetime":
      return { subject: PLAN_CONFIGS[type].subject, html: getPremiumEmailHtml(type, params as PurchaseEmailParams) };
    case "credit_bundle":
      return { subject: getCreditBundleEmailSubject((params as CreditBundleEmailParams).credits), html: getCreditBundleEmailHtml(params as CreditBundleEmailParams) };
    default:
      return { subject: getGenericPurchaseEmailSubject(), html: getGenericPurchaseEmailHtml(params as PurchaseEmailParams) };
  }
}
