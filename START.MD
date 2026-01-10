PROJECT SETUP GUIDE

1. INITIALIZATION
-----------------
Run these commands in terminal:
rm -rf .git
git init
npx convex dev


2. AUTHENTICATION SETUP
-----------------------
Run this command in terminal:
npm run jwt

Copy the output and add to .env file:
JWT_PRIVATE_KEY=
JWKS=


Google OAuth:
Go to: https://console.cloud.google.com/
Set Javascript Origins: http://localhost:5173
Set Redirect URI: https://dazzling-nightingale-531.convex.site/api/auth/callback/google

Add to .env:
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=


GitHub OAuth:
Go to: https://github.com/settings/developers
Set Homepage URL: http://localhost:5173
Set Callback URL: https://dazzling-nightingale-531.convex.site/api/auth/callback/github

Add to .env:
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=


3. POLAR INTEGRATION (SANDBOX)
------------------------------
Go to: https://sandbox.polar.sh/dashboard/create?existing_org=true

Organization Setup:
1. Go to General Settings -> Create Organization
2. Get Organization Token

Add to .env:
POLAR_ORGANIZATION_TOKEN=polar_oat_xxxxx


Webhook Setup:
1. Create Webhook
2. URL: https://adventurous-bandicoot-498.convex.site/polar/events

Add to .env:
POLAR_WEBHOOK_SECRET=polar_whs_xxxxx


Final Step:
Create Products in Polar