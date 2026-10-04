# Busineskal landing page

Install dependencies with `npm ci`. Copy `.env.example` to `.env.local` and
set `BACKEND_API_URL` to the Express backend's API prefix (for local development,
`http://localhost:5000/api/v1`). Start the backend with its MongoDB configuration,
then run `npm run dev` here.

Buyer and seller signup, email/password login, password reset, and buyer-to-seller
applications use `/api/account/[action]`. Signup as a seller and applications from
existing buyers require admin approval. Business name, country, phone, and an
optional description are collected. Seller applications use the actual backend
account flow instead of a separate seller-interest form.

Access and refresh tokens stay in HttpOnly, SameSite cookies and never appear in
browser storage or account API responses. The server refreshes expired sessions
and clears cookies on logout or successful seller conversion. Use HTTPS in production.
Password reset delivery requires the backend's email configuration. Google login
is not offered here because Firebase credentials are not configured.

The API URL is server-only. The backend must be reachable from the Next.js server.

Products, services, categories, and supplier cards load from `/api/marketplace`,
which reads the backend's public `/api/v1/landing/catalogue` endpoint. The page
shows loading, empty, unavailable, and retry states without sample listings.
Search, category, country, and supplier filters operate on the latest 100
verified records per listing type. Listings require an approved seller (or an
administrator); inactive categories are hidden and missing legacy categories
appear as Uncategorized. Missing images show a neutral placeholder.
Product prices use the stored numeric price; the current schema has no currency.
The page contains discovery, signup, login, seller application, and account status.
Illustrative dashboard metrics, invented membership plans, and placeholder wishlist
controls have been removed. Marketplace order management and messaging are outside
this landing page.

Checks: `npm run lint`, `npm run build`, and `npm run test:accounts` after a build.
The account smoke test uses an isolated fake backend, not production accounts.

## Next.js development

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
