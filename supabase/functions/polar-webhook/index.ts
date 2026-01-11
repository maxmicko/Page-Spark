import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyWebhookSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expectedHex = Array.from(new Uint8Array(expectedSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return signature === `sha256=${expectedHex}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const secret = Deno.env.get('POLAR_WEBHOOK_SECRET');
    if (!secret) {
      console.error('POLAR_WEBHOOK_SECRET not set');
      return new Response('Server configuration error', { status: 500, headers: corsHeaders });
    }

    const signature = req.headers.get('polar-signature') || req.headers.get('x-polar-signature');
    if (!signature) {
      console.error('No signature provided');
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const body = await req.text();
    const isValid = await verifyWebhookSignature(body, signature, secret);
    if (!isValid) {
      console.error('Invalid signature');
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const event = JSON.parse(body);
    console.log('Received event:', event.type);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase env vars not set');
      return new Response('Server configuration error', { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { type, data } = event;

    switch (type) {
      case 'subscription.created':
        await handleSubscriptionCreated(supabase, data);
        break;
      case 'subscription.updated':
        await handleSubscriptionUpdated(supabase, data);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(supabase, data);
        break;
      default:
        console.log('Unhandled event type:', type);
    }

    return new Response('OK', { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Internal server error', { status: 500, headers: corsHeaders });
  }
});

async function handleSubscriptionCreated(supabase: any, data: any) {
  const { id: polar_subscription_id, user_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end, trial_start, trial_end } = data;

  const { error } = await supabase
    .from('subscriptions')
    .insert({
      user_id,
      plan_id,
      polar_subscription_id,
      status,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
      trial_start,
      trial_end,
    });

  if (error) {
    console.error('Error inserting subscription:', error);
    throw error;
  }

  console.log('Subscription created:', polar_subscription_id);
}

async function handleSubscriptionUpdated(supabase: any, data: any) {
  const { id: polar_subscription_id, status, current_period_start, current_period_end, cancel_at_period_end, trial_start, trial_end, previous_attributes } = data;

  // Update subscription
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
      trial_start,
      trial_end,
      updated_at: new Date().toISOString(),
    })
    .eq('polar_subscription_id', polar_subscription_id);

  if (updateError) {
    console.error('Error updating subscription:', updateError);
    throw updateError;
  }

  // If plan changed, record in subscription_changes
  if (previous_attributes && previous_attributes.plan_id && previous_attributes.plan_id !== data.plan_id) {
    const { error: changeError } = await supabase
      .from('subscription_changes')
      .insert({
        subscription_id: (await supabase.from('subscriptions').select('id').eq('polar_subscription_id', polar_subscription_id).single()).data.id,
        old_plan_id: previous_attributes.plan_id,
        new_plan_id: data.plan_id,
        change_type: data.plan_id > previous_attributes.plan_id ? 'upgrade' : 'downgrade', // Assuming plan_id is comparable
        changed_at: new Date().toISOString(),
      });

    if (changeError) {
      console.error('Error inserting subscription change:', changeError);
      throw changeError;
    }
  }

  console.log('Subscription updated:', polar_subscription_id);
}

async function handleSubscriptionCancelled(supabase: any, data: any) {
  const { id: polar_subscription_id } = data;

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('polar_subscription_id', polar_subscription_id);

  if (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }

  console.log('Subscription cancelled:', polar_subscription_id);
}