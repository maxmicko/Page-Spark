import { Link } from "wouter";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { createCheckoutSession } from "@/lib/polar";

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$49.99',
    description: 'Perfect for solo operators just getting started.',
    features: [
      "Simple booking flow",
      "Customer requests",
      "Basic scheduling",
      "Website booking form",
      "Email support"
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$89.99',
    description: 'Everything you need to grow your business.',
    features: [
      "Route optimization (Smart Routes)",
      "Full dashboard analytics",
      "Advanced customer profiles",
      "Previous job & vehicle data",
      "Smart time-saving schedule",
      "Priority 24/7 support"
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$149.99',
    description: 'Advanced features for large teams.',
    features: [
      "All Pro features",
      "Multi-user access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "Phone support"
    ],
    popular: false,
  },
];

export default function Pricing() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleCheckout = async (planId: string) => {
    if (!user) return;

    setLoading(planId);

    try {
      await createCheckoutSession({ id: planId }, { email: user.email });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-foreground">Choose the plan that fits your business stage.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-8 border flex flex-col shadow-sm relative overflow-hidden ${
                plan.popular ? 'border-2 border-primary shadow-xl bg-primary/5' : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-foreground text-sm">{plan.description}</p>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "default" : "outline"}
                className={`w-full h-12 ${plan.popular ? 'shadow-lg shadow-primary/20' : ''}`}
                onClick={() => handleCheckout(plan.id)}
                disabled={!user || loading !== null}
              >
                {loading === plan.id ? 'Loading...' : 'Get Started'}
              </Button>
            </div>
          ))}
        </div>

        {/* Add-on Services */}
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-secondary/20 border border-secondary flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold font-heading mb-2 text-secondary-foreground">Need a Web Presence?</h3>
              <p className="text-foreground">We offer professional web design and setup services for your business.</p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="bg-white p-4 rounded-xl border border-border flex items-center justify-between gap-6">
                <div>
                  <p className="font-bold text-sm">Custom Website</p>
                  <p className="text-xs text-black">Add to any plan</p>
                </div>
                <p className="font-bold text-primary">+$34.99/mo</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-border flex items-center justify-between gap-6">
                <div>
                  <p className="font-bold text-sm">Existing Setup Fee</p>
                  <p className="text-xs text-black">One-time fee</p>
                </div>
                <p className="font-bold text-primary">$19.99</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}