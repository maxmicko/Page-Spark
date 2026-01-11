import { z } from 'zod';

// Existing schemas based on code analysis

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  booking_id: z.string(),
  polar_customer_id: z.string().nullable(),
  // Add other fields as needed
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertUserProfileSchema = userProfileSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const userServiceSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number().int(),
  duration: z.number().int(), // minutes
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertUserServiceSchema = userServiceSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const userWorkHourSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  day_of_week: z.number().int().min(0).max(6),
  start_hour: z.number().int().min(0).max(23),
  start_minute: z.number().int().min(0).max(59),
  end_hour: z.number().int().min(0).max(23),
  end_minute: z.number().int().min(0).max(59),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertUserWorkHourSchema = userWorkHourSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const userAppointmentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  service_id: z.string().uuid(),
  customer_name: z.string(),
  customer_phone: z.string(),
  address: z.string(),
  start_time: z.string().datetime(),
  vehicle_make: z.string(),
  vehicle_model: z.string(),
  vehicle_year: z.number().int(),
  vehicle_color: z.string(),
  notes: z.string().nullable(),
  status: z.enum(['pending', 'confirmed', 'scheduled', 'active', 'completed', 'canceled']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertBookingSchema = userAppointmentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// New schemas for Polar subscriptions

export const planSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number().int(),
  currency: z.string().default('usd'),
  interval: z.enum(['month', 'year']),
  polar_product_id: z.string(),
  active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertPlanSchema = planSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  plan_id: z.string().uuid(),
  polar_subscription_id: z.string(),
  status: z.enum(['active', 'canceled', 'past_due', 'incomplete', 'trialing']),
  current_period_start: z.string().datetime(),
  current_period_end: z.string().datetime(),
  cancel_at_period_end: z.boolean().default(false),
  trial_start: z.string().datetime().nullable(),
  trial_end: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertSubscriptionSchema = subscriptionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const paymentSchema = z.object({
  id: z.string().uuid(),
  subscription_id: z.string().uuid(),
  amount: z.number().int(),
  currency: z.string(),
  status: z.enum(['paid', 'open', 'void', 'draft']),
  polar_invoice_id: z.string(),
  paid_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export const insertPaymentSchema = paymentSchema.omit({
  id: true,
  created_at: true,
});

export const subscriptionChangeSchema = z.object({
  id: z.string().uuid(),
  subscription_id: z.string().uuid(),
  old_plan_id: z.string().uuid(),
  new_plan_id: z.string().uuid(),
  change_type: z.enum(['upgrade', 'downgrade', 'cancel']),
  changed_at: z.string().datetime(),
});

export const insertSubscriptionChangeSchema = subscriptionChangeSchema.omit({
  id: true,
});