/**
 * Stripe Service for handling subscriptions and payments
 */

import Stripe from 'stripe';
import { SubscriptionTier } from '../engines/subscriptionLimits';

// Note: This should ideally come from environment variables.
// Using a placeholder for development/demo purposes.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

// @ts-ignore - Stripe version might vary, ignoring type check for apiVersion to avoid strict errors
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16' as any, 
});

// Map our internal tiers to Stripe Price IDs
// These would typically be created in the Stripe Dashboard and loaded via env vars.
export const TIER_PRICE_MAP: Partial<Record<SubscriptionTier, string>> = {
  pro: process.env.STRIPE_PRICE_PRO || 'price_pro_mock_id',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_mock_id',
};

/**
 * Creates a Stripe Checkout Session for subscription
 */
export async function createCheckoutSession(
  tier: SubscriptionTier,
  userId: number,
  successUrl: string,
  cancelUrl: string
) {
  if (tier === 'free' || tier === 'government') {
    throw new Error('Invalid tier for checkout session');
  }

  const priceId = TIER_PRICE_MAP[tier];
  
  if (!priceId) {
    throw new Error(`Price ID not configured for tier: ${tier}`);
  }

  try {
    // If we are using the mock key, return a simulated successful URL
    if (stripeSecretKey === 'sk_test_placeholder') {
      console.log(`[Stripe Mock] Creating checkout for user ${userId}, tier ${tier}`);
      return {
        url: `${successUrl}?session_id=mock_session_id_for_${tier}`,
        id: `mock_session_id_for_${tier}`,
      };
    }

    // Actual Stripe API call
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      client_reference_id: userId.toString(),
    });

    return { 
      url: session.url, 
      id: session.id 
    };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw error;
  }
}
