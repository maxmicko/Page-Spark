# Polar Subscription Integration Schema Plan

## Current Schema Analysis

Based on existing code in `shared/booking.ts`, the current database includes:

- `user_profiles`: Stores user information, linked to bookings.
- `user_services`: Services offered by users.
- `user_work_hours`: Working hours for users.
- `user_appointments`: Appointment bookings.

No existing subscription-related tables.

## Required Schema Changes

### New Tables

1. **plans**
   - `id` (uuid, primary key)
   - `name` (text)
   - `description` (text)
   - `price` (integer, in cents)
   - `currency` (text, default 'usd')
   - `interval` (text, e.g., 'month', 'year')
   - `polar_product_id` (text, unique)
   - `active` (boolean, default true)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

2. **subscriptions**
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key to user_profiles.id)
   - `plan_id` (uuid, foreign key to plans.id)
   - `polar_subscription_id` (text, unique)
   - `status` (text: active, canceled, past_due, incomplete, trialing)
   - `current_period_start` (timestamptz)
   - `current_period_end` (timestamptz)
   - `cancel_at_period_end` (boolean, default false)
   - `trial_start` (timestamptz, nullable)
   - `trial_end` (timestamptz, nullable)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

3. **payments**
   - `id` (uuid, primary key)
   - `subscription_id` (uuid, foreign key to subscriptions.id)
   - `amount` (integer, in cents)
   - `currency` (text)
   - `status` (text: paid, open, void, draft)
   - `polar_invoice_id` (text, unique)
   - `paid_at` (timestamptz, nullable)
   - `created_at` (timestamptz)

4. **subscription_changes** (for upgrade/downgrade history)
   - `id` (uuid, primary key)
   - `subscription_id` (uuid, foreign key to subscriptions.id)
   - `old_plan_id` (uuid, foreign key to plans.id)
   - `new_plan_id` (uuid, foreign key to plans.id)
   - `change_type` (text: upgrade, downgrade, cancel)
   - `changed_at` (timestamptz)

### Modified Tables

- **user_profiles**: Add column `polar_customer_id` (text, unique, nullable) to store Polar's customer ID.

## Migration Plan

1. Create migration SQL for adding `polar_customer_id` to `user_profiles`.
2. Create migration SQL for new tables: `plans`, `subscriptions`, `payments`, `subscription_changes`.
3. Ensure foreign key constraints and indexes on foreign keys and unique fields.
4. Update any existing data if necessary (none expected).

## Implementation Notes

- Use Supabase migrations for applying changes.
- Update `shared/schema.ts` with Zod schemas for the new tables.
- Ensure RLS policies for security.

This plan supports subscription management including upgrades, downgrades (via `subscription_changes`), and cancellations (via `status` and `cancel_at_period_end`).