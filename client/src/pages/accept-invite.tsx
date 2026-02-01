import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface LeadData {
  first_name: string;
  business_name: string;
  phone: string;
  email: string;
  city: string | null;
  issue: string;
}

export default function AcceptInvite() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // Form state (pre-filled from lead data, editable)
  const [formData, setFormData] = useState({
    first_name: "",
    business_name: "",
    phone: "",
    email: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  // Parse token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid or missing invite token");
      setIsLoading(false);
    }
  }, []);

  // Validate token and fetch lead data
  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      try {
        // Look up the invite token
        const { data: leadData, error: leadError } = await supabase
          .from("lead_signups")
          .select("first_name, business_name, phone, email, city, issue, invite_token_expires_at, invite_used")
          .eq("invite_token", token)
          .single();

        if (leadError || !leadData) {
          setError("Invalid invite link. This link may have expired or already been used.");
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        if (new Date(leadData.invite_token_expires_at) < new Date()) {
          setError("This invite link has expired. Please request a new one.");
          setIsLoading(false);
          return;
        }

        // Check if token is already used
        if (leadData.invite_used) {
          setError("This invite link has already been used. Please sign in instead.");
          setIsLoading(false);
          return;
        }

        // Check if user already exists with this email
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", leadData.email)
          .single();

        if (existingUser) {
          setError("An account with this email already exists. Please sign in instead.");
          setIsLoading(false);
          return;
        }

        // Set lead data and pre-fill form
        setLeadData(leadData);
        setFormData({
          first_name: leadData.first_name,
          business_name: leadData.business_name,
          phone: leadData.phone,
          email: leadData.email,
          city: leadData.city || "",
          password: "",
          confirmPassword: "",
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Error validating token:", err);
        setError("An error occurred while validating your invite. Please try again.");
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!formData.first_name.trim()) {
      setError("First name is required");
      setIsSubmitting(false);
      return;
    }
    if (!formData.business_name.trim()) {
      setError("Business name is required");
      setIsSubmitting(false);
      return;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      setIsSubmitting(false);
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            business_name: formData.business_name,
            phone: formData.phone,
            city: formData.city,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("An account with this email already exists. Please sign in instead.");
        } else {
          setError(authError.message);
        }
        setIsSubmitting(false);
        return;
      }

      if (!authData.user) {
        setError("Failed to create account. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const userId = authData.user.id;

      // Mark invite as used
      const { error: updateError } = await supabase
        .from("lead_signups")
        .update({
          invite_used: true,
          user_id: userId,
          updated_at: new Date().toISOString(),
        })
        .eq("invite_token", token);

      if (updateError) {
        console.error("Error updating invite status:", updateError);
        // Don't fail the request, but log the error
      }

      // Create customer record
      try {
        await supabase.from("customers").insert({
          user_id: userId,
          first_name: formData.first_name,
          business_name: formData.business_name,
          phone: formData.phone,
          email: formData.email,
          city: formData.city || null,
          notes: leadData?.issue || "",
          created_at: new Date().toISOString(),
        });
      } catch (customerError) {
        console.error("Customer creation error:", customerError);
        // Continue anyway
      }

      // Get free plan and create subscription
      try {
        const { data: freePlan } = await supabase
          .from("plans")
          .select("id")
          .eq("name", "Free")
          .single();

        if (freePlan) {
          await supabase.from("subscriptions").insert({
            user_id: userId,
            plan_id: freePlan.id,
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (subscriptionError) {
        console.error("Subscription setup error:", subscriptionError);
        // Continue anyway
      }

      setIsSuccess(true);
      toast({
        title: "Account Created!",
        description: "Your account has been created successfully. Welcome to OrbitL Dash!",
      });

      // Redirect to app after a short delay
      setTimeout(() => {
        window.location.href = "https://app.orbitl-dash.us";
      }, 3000);
    } catch (err) {
      console.error("Error creating account:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600">Validating your invite...</p>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Account Created!</h1>
            <p className="text-slate-600">
              Welcome to OrbitL Dash, {formData.first_name}!
            </p>
          </div>
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your account has been created successfully. Redirecting you to the app...
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => (window.location.href = "https://app.orbitl-dash.us")}
            className="w-full"
          >
            Go to App Now
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <img src="/favicon.png" alt="Logo" className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Complete Your Setup</h1>
          <p className="text-slate-600">
            Review your information and create your password
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                name="business_name"
                type="text"
                value={formData.business_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-slate-100"
            />
            <p className="text-xs text-slate-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City / Service Area</Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Create Your Password</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account & Continue"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <a
              href="https://app.orbitl-dash.us/signin"
              className="text-primary hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
