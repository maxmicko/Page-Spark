import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface LeadFormData {
  first_name: string;
  business_name: string;
  phone: string;
  email: string;
  city: string;
  issue: string;
}

const issueOptions = [
  { value: "no-shows", label: "No-shows / ghosting" },
  { value: "texting", label: "Too much back-and-forth texting" },
  { value: "drive-time", label: "Scheduling around drive time" },
  { value: "professional", label: "Just want to look more professional" },
];

export function LeadSignupForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    first_name: '',
    business_name: '',
    phone: '',
    email: '',
    city: '',
    issue: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://app.orbitl-dash.us/api/lead-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Account Created!",
          description: "Check your email for password setup instructions.",
        });
        // Reset form
        setFormData({
          first_name: '',
          business_name: '',
          phone: '',
          email: '',
          city: '',
          issue: ''
        });
      } else {
        let errorTitle = "Error";
        let errorDescription = result.error || "Something went wrong. Please try again.";

        if (response.status === 409) {
          errorTitle = "Account Already Exists";
          errorDescription = "An account with this email address already exists. Please try signing in instead.";
        } else if (response.status === 400) {
          errorTitle = "Invalid Input";
          // Use the specific error message from API
        } else if (response.status === 500) {
          errorTitle = "Server Error";
          errorDescription = "Something went wrong on our end. Please try again later.";
        }

        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            type="text"
            placeholder="John"
            required
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_name">Business Name</Label>
          <Input
            id="business_name"
            name="business_name"
            type="text"
            placeholder="Elite Details"
            required
            value={formData.business_name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Where should booking alerts go? (Phone)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="(555) 000-0000"
          required
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Setup + updates (Email)</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City / Service Area (Optional)</Label>
        <Input
          id="city"
          name="city"
          type="text"
          placeholder="Los Angeles, CA"
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="issue">What's your biggest issue right now?</Label>
        <Select required onValueChange={(value) => setFormData(prev => ({ ...prev, issue: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {issueOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-bold hover:scale-105 transition-transform">
          {isSubmitting ? 'Creating Account...' : 'Create My Booking Form →'}
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground italic">
          I only contact detailers who actually use the form.
        </p>
      </div>
    </form>
  );
}