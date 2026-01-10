# SaaS Boilerplate: Developer Cheat Sheet & Reminders

This is a living document of "When you do X, remember Y" for this codebase. Focus on these patterns to keep the app premium, secure, and maintainable. Use the existing codebase as a reference for syntax and implementation details.

---

## When Adding a Premium Feature
*   **Reminder**: Use the `useSubscription` hook to gate access.
*   **Reference**: Search the codebase for `useSubscription` or check `src/pages/DashboardTemplate.tsx` for usage examples.
*   **Action**: Ensure you handle the hook's loading state before rendering gated content.

## When Adding a Mutation or Action (Backend)
*   **Reminder**: Always verify the user on the server and apply rate limits to spammable endpoints.
*   **Reference**: Check `convex/feedback.ts` or `convex/users.ts` to see how `auth.getUserId(ctx)` and `checkRateLimit` are implemented.
*   **Action**: Verify identity at the start of every user-facing function.

## When Adding a New Page (Route)
*   **Reminder**: A page is not complete without SEO configuration and a registered route.
*   **Reference**: See `src/App.tsx` for routing and `src/lib/seoConfig.ts` for metadata patterns.
*   **Action**: Use the `<PageSEO />` or `<SEO />` components on every new route.

## When Building UI Components & Using Shadcn & Creating a New Page
*   **Reminder**: Stick to the design system (Tailwind 4 + OKLCH) and leverage Shadcn UI patterns.
*   **Reference**: 
    *   Browse `src/components/ui/` for existing primitives.
    *   Check `src/components/icons/Icons.tsx` for the universal icon wrapper.
    *   Look at `src/theme.css` for the available OKLCH color variables.
*   **Action**: 
    *   Use `npx shadcn@latest add` for new components.
    *   Always use `var(--variable-name)` for colors to support dark mode.
    *   Use the `cn()` utility for merging classes.

## When Sending Emails
*   **Reminder**: Emails must be handled asynchronously to avoid blocking database transactions.
*   **Reference**: See the `afterUserCreatedOrUpdated` callback in `convex/auth.ts` for how to schedule an email using `ctx.scheduler`.
*   **Templates**: Add new HTML templates to `convex/emailTemplates.ts`.

## When Handling Payments/Credits
*   **Reminder**: Polar.sh webhooks are the source of truth.
*   **Reference**: Check `convex/http.ts` to see how webhook events and idempotency (via `processedOrders`) are handled.
*   **Action**: Use the environment variables for Product IDs; never hardcode them.

## Workflow & Env Vars
*   **Reminder**: Synchronize environment variables between your local environment and the Convex backend.
*   **Action**: 
    1. Run `npm run env-dev` after adding any `VITE_` variables to `.env.local`.
    2. Keep `npx convex dev` running to ensure backend types stay in sync with your changes.

## The "Never Ever" List
1. **Never** trust the frontend for security. Always verify the `userId` in Convex.
2. **Never** use hex codes in TSX. Use CSS variables to ensure dark mode works.
3. **Never** forget to handle the `undefined` (loading) state of `useQuery` or `useSubscription`.
4. **Never** use `localStorage` for data that should be persisted in the database.
5. **Never** skip the `path` prop in the `<SEO />` component.

---

## Quick Tool Reference (If/Then)
*   **If about payments** -> use Polar.sh
*   **If about emails** -> use Resend
*   **If about database/backend** -> use Convex
*   **If about authentication** -> use Convex Auth
*   **If about analytics/tracking** -> use PostHog or GA4
*   **If about blog/content** -> use React Markdown + Gray-matter
*   **If about icons** -> use Lucide React
*   **If about developer icons** -> use `Icons` component
*   **If about animations** -> use Framer Motion
*   **If about styling** -> use Tailwind 4 + OKLCH
*   **If about UI components** -> use Radix UI (Shadcn) via `npx shadcn@latest add`
*   **If about state management** -> use Zustand
*   **If about notifications** -> use Sonner (toast)
*   **If about SEO** -> use `<PageSEO />`
*   **If updating .env.local** -> run `npm run env-dev` to sync with Convex
*   **If starting local dev** -> keep `npm run dev` and `npx convex dev` running

---

## Packages We Use
*   **Core**: React 19, Vite 7, TypeScript, Zustand, React Router 7, @auth/core
*   **Styling & UI**: Tailwind CSS 4, Radix UI (Shadcn), Lucide React, Framer Motion, @tailwindcss/typography
*   **Backend & DB**: Convex
*   **Payments**: Polar.sh (@polar-sh/sdk, @convex-dev/polar)
*   **Analytics**: PostHog (@posthog/react), Google Analytics 4 (react-ga4), Vercel Analytics
*   **Communication**: Resend
*   **Content**: React Markdown, Gray-matter, Remark GFM, Rehype Raw
*   **Utilities**: Sonner, clsx, tailwind-merge, class-variance-authority