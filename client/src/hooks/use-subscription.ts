import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { subscriptionSchema, planSchema } from "@shared/schema";
import { z } from "zod";

const subscriptionWithPlanSchema = subscriptionSchema.extend({
  plans: planSchema,
});

type SubscriptionWithPlan = z.infer<typeof subscriptionWithPlanSchema>;

export function useSubscription() {
  const {
    data: subscriptionData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(`Authentication error: ${userError.message}`);
      }

      if (!user) {
        return null;
      }

      // Fetch subscription with plan details
      const { data, error } = await supabase
        .from("subscriptions")
        .select(`
          *,
          plans (*)
        `)
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned - user has no active subscription
          return null;
        }
        throw new Error(`Failed to fetch subscription: ${error.message}`);
      }

      // Validate the data
      const validatedData = subscriptionWithPlanSchema.parse(data);

      return validatedData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes("Authentication error")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    subscription: subscriptionData,
    plan: subscriptionData?.plans || null,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}