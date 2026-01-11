import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { supabase } from "@/lib/supabase";
import { createCheckoutSession, cancelSubscription, initializePolar } from "@/lib/polar";
import { planSchema } from "@shared/schema";
import { z } from "zod";

const plansSchema = z.array(planSchema);

export default function Subscription() {
  const [, setLocation] = useLocation();
  const { subscription, plan, isLoading, error, refetch } = useSubscriptionContext();
  const [user, setUser] = useState<any>(null);
  const [plans, setPlans] = useState<z.infer<typeof planSchema>[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        setLocation("/signup");
        return;
      }
      if (!subscription) {
        setLocation("/pricing");
        return;
      }
    };
    checkAuth();
  }, [subscription, setLocation]);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase.from("plans").select("*").eq("active", true);
      if (error) {
        console.error("Error fetching plans:", error);
        return;
      }
      const validatedPlans = plansSchema.parse(data);
      setPlans(validatedPlans);
    };
    fetchPlans();
  }, []);

  const handleChangePlan = async (newPlan: z.infer<typeof planSchema>) => {
    if (!user || !subscription) return;

    setLoading(newPlan.id);

    try {
      // Initialize Polar if needed
      // Assuming access token is available, perhaps from env
      const accessToken = import.meta.env.VITE_POLAR_ACCESS_TOKEN;
      if (accessToken) {
        initializePolar(accessToken);
      }

      await createCheckoutSession({ id: newPlan.polar_product_id }, { email: user.email });
    } catch (error) {
      console.error("Error changing plan:", error);
      alert("Failed to change plan. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setLoading("cancel");

    try {
      const accessToken = import.meta.env.VITE_POLAR_ACCESS_TOKEN;
      if (accessToken) {
        initializePolar(accessToken);
      }

      await cancelSubscription(subscription.polar_subscription_id);
      await refetch();
      alert("Subscription cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  if (isLoading || !user || !subscription || !plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Manage Subscription</h1>
          <p className="text-lg text-foreground">View and manage your current subscription plan.</p>
        </div>

        {/* Current Subscription */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Plan: {plan.name}
              <Badge variant="secondary">{subscription.status}</Badge>
            </CardTitle>
            <CardDescription>
              ${plan.price / 100} / {plan.interval} • Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setLocation("/pricing")}>
                View All Plans
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={loading === "cancel"}>
                    {loading === "cancel" ? "Cancelling..." : "Cancel Subscription"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will cancel your subscription. You will lose access to premium features at the end of your billing period.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelSubscription}>
                      Cancel Subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Available Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Change Plan</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {plans.filter(p => p.id !== plan.id).map((p) => (
              <Card key={p.id} className="relative">
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <CardDescription>${p.price / 100} / {p.interval}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                  <Button
                    onClick={() => handleChangePlan(p)}
                    disabled={loading === p.id}
                    className="w-full"
                  >
                    {loading === p.id ? "Processing..." : `Switch to ${p.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}