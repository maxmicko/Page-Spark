import React, { createContext, useContext, ReactNode } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { subscriptionSchema, planSchema } from "@shared/schema";
import { z } from "zod";

const subscriptionWithPlanSchema = subscriptionSchema.extend({
  plans: planSchema,
});

type SubscriptionWithPlan = z.infer<typeof subscriptionWithPlanSchema>;

interface SubscriptionContextType {
  subscription: SubscriptionWithPlan | null;
  plan: z.infer<typeof planSchema> | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { subscription, plan, isLoading, error, refetch } = useSubscription();

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        plan,
        isLoading,
        error,
        refetch,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscriptionContext must be used within a SubscriptionProvider"
    );
  }
  return context;
}