import { Link } from "wouter";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-foreground">Choose the plan that fits your business stage.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Starter Plan */}
          <div className="bg-white rounded-3xl p-8 border border-border flex flex-col shadow-sm relative overflow-hidden">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-foreground text-sm">Perfect for solo operators just getting started.</p>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-foreground">$49.99</span>
                <span className="text-foreground">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Simple booking flow",
                "Customer requests",
                "Basic scheduling",
                "Website booking form",
                "Email support"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full h-12">Get Started</Button>
          </div>

          {/* Professional Plan */}
          <div className="bg-primary/5 rounded-3xl p-8 border-2 border-primary flex flex-col shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <p className="text-foreground text-sm">Everything you need to grow your business.</p>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-foreground">$89.99</span>
                <span className="text-foreground">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Route optimization (Smart Routes)",
                "Full dashboard analytics",
                "Advanced customer profiles",
                "Previous job & vehicle data",
                "Smart time-saving schedule",
                "Priority 24/7 support"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full h-12 shadow-lg shadow-primary/20">Get Started</Button>
          </div>
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