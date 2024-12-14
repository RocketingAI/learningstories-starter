# DealClosers.ai App (Next.js)

## Initial Setup

### Clone the Github Repo
```bash
git clone https://github.com/RocketingAI/DealClosers.git
cd DealClosers
```
### Environment Variables Setup
1. Create a new `.env` and `.env.local` file and populate them with the contents of `.env.example`
2. Within the new files, confirm the following environment variables are correct:
   - `DATABASE_URL`
   - `OPENAI_API_KEY` (if using an OpenAI assistant, you must use a project API Key corresponding to your Assistant API Key)
   - `OPENAI_ASSISTANT_ID`

### Prisma Setup
Execute a Prisma Schema Migration to setup the tables or update the mySQL Database:
```bash
npx prisma migrate dev --name init

```
### Stripe Setup
To test Stripe checkout locally we must set up a local webhook listener with the Stripe CLI tool.
- Stripe CLI Tool Install guide: https://docs.stripe.com/stripe-cli?install-method=windows
Make sure to add all the Stripe ENV Variables to your `.env` file:
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
If you have multiple Paid subscriptions, add more `STRIPE_PRICE_ID_1` and `STRIPE_PRICE_ID_2`, etc.
If you add more Stripe Price IDs, make sure to add them to the `SUBSCRIPTION_PLANS` object in `src/app/api/webhooks/stripe/route.ts`

### Clerk Setup
If a Clerk Application has not been created, create one in your Clerk dashboard.
Then, in the Clerk dashboard, create two roles:
'free_user' (default)
'paid_user' (for subscribers)

### Install Dependencies
```bash
npm install
```

## Running the App Locally
1. Launch the Stripe CLI local Webhook listener:
# If you have multiple Stripe accounts, run the following commands to log out then log back in under the correct Stripe account.
```bash
stripe logout
```
```bash
stripe login
```
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
2. Launch the App:
```bash
npm run dev
```
3. Visit App at http://localhost:3000

## Tech Stack & Resources
- [Next.js](https://nextjs.org) - React framework
- [Prisma](https://prisma.io) - Database ORM
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [tRPC](https://trpc.io) - End-to-end typesafe APIs
- [T3 Documentation](https://create.t3.gg/)
- [T3 Discord Community](https://t3.gg/discord)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available)
- [T3 GitHub Repository](https://github.com/t3-oss/create-t3-app)
- [Vercel Deployment Guide](https://create.t3.gg/en/deployment/vercel)

## GitHub Workflow Guide
### Setup
1. Clone the repository:
```bash
git clone https://github.com/RocketingAI/DealClosers.git
cd workspace
```
### Working on Changes
1. Pull the latest changes:
```bash
git pull origin main
```
2. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```
3. Stage and commit changes:
```bash
git add .
git commit -m "Describe the changes made"
```
4. Push your branch:
```bash
git push origin feature/your-feature-name
```
### Creating a Pull Request
1. Go to the repository on GitHub
2. Click on "Pull Requests" and then "New Pull Request"
3. Select your branch and compare it with main
4. Add a description and submit the pull request for review
### Merging Changes
After your pull request is approved:
```bash
git checkout main
git pull origin main
```
### Best Practices
- Always work on a new branch for each feature or fix
- Write clear and concise commit messages
- Pull the latest changes frequently to avoid conflicts
- Test your changes locally before pushing

## Change Log
- 12/9/24: Added Stripe, Clerk, Sidebar from ShadCN, Editor.js
- 12/13/24: Initial Commit to DealClosers Github Repo
