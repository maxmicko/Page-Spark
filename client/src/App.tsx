import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FormBuilder from "@/pages/form-builder";
import EmbedForm from "@/pages/embed-form";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Careers from "@/pages/careers";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Pricing from "@/pages/pricing";
import RefundPolicy from "@/pages/refund-policy";
import Signup from "@/pages/signup";
import Subscription from "@/pages/subscription";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signup" component={Signup} />
      <Route path="/builder" component={FormBuilder} />
      <Route path="/embed" component={EmbedForm} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/careers" component={Careers} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/subscription" component={Subscription} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SubscriptionProvider>
          <Toaster />
          <Router />
        </SubscriptionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
