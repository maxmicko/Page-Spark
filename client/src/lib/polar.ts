import { Polar } from '@polar-sh/sdk';

let polarClient: Polar | null = null;

/**
 * Initializes the Polar client with the provided access token.
 * @param accessToken - The access token for Polar API.
 */
export function initializePolar(accessToken: string): void {
  polarClient = new Polar({
    accessToken,
  });
}

/**
 * Creates a checkout session for a given plan and redirects to Polar's hosted checkout page.
 * @param plan - The plan details including id and other info.
 * @param user - The user information including email.
 */
export async function createCheckoutSession(
  plan: { id: string; price?: number; name?: string },
  user: { email: string; name?: string }
): Promise<void> {
  if (!polarClient) {
    throw new Error('Polar client not initialized. Call initializePolar first.');
  }

  const session = await polarClient.checkouts.create({
    products: [plan.id],
    customerEmail: user.email,
    successUrl: `${window.location.origin}/success`,
    cancelUrl: `${window.location.origin}/cancel`,
  });

  // Redirect to the hosted checkout page
  window.location.href = session.url;
}

/**
 * Cancels a subscription.
 * @param subscriptionId - The Polar subscription ID.
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  if (!polarClient) {
    throw new Error('Polar client not initialized. Call initializePolar first.');
  }

  await polarClient.subscriptions.cancel({ id: subscriptionId });
}

/**
 * Updates a subscription to a new plan.
 * @param subscriptionId - The Polar subscription ID.
 * @param newProductId - The new product ID.
 */
export async function updateSubscription(subscriptionId: string, newProductId: string): Promise<void> {
  if (!polarClient) {
    throw new Error('Polar client not initialized. Call initializePolar first.');
  }

  await polarClient.subscriptions.update(subscriptionId, { productId: newProductId });
}