import { loadStripe } from '@stripe/stripe-js';
import { env } from '~/env';

// Initialize Stripe
export const stripe = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Price IDs for different subscription tiers
export const STRIPE_PRICES = {
  PRO: 'price_1QToJGRlpH0WD597XToJQ50v', // Replace with your actual price ID
} as const;