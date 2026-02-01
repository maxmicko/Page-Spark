import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
// Note: Schema import removed as it's not needed for this component
import { useActivityTracking } from '@/hooks/use-activity-tracking';

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

interface LeadSignupFormProps {
  /** When true, uses invite link flow (recommended for lower-intent leads).
   *  When false/omitted, uses auto-create flow (original, for high-intent leads).
   */
  useInviteLink?: boolean;
}

export function LeadSignupForm({ useInviteLink = true }: LeadSignupFormProps) {
  const { toast } = useToast();
  const { trackFormSubmit } = useActivityTracking();
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
    
    // Client-side validation
    if (!formData.first_name.trim() || !formData.business_name.trim() || 
        !formData.phone.trim() || !formData.email.trim() || !formData.issue.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Track form submission attempt
    trackFormSubmit({
      form_type: 'lead_signup',
      has_data: {
        first_name: !!formData.first_name,
        business_name: !!formData.business_name,
        phone: !!formData.phone,
        email: !!formData.email,
        city: !!formData.city,
        issue: !!formData.issue,
      }
    });

    try {
       console.log('Submitting lead signup form with data:', formData)
       
       // Save to lead_signups table directly from client
       const { data: directSaveData, error: directSaveError } = await supabase
         .from('lead_signups')
         .insert({
           first_name: formData.first_name,
           business_name: formData.business_name,
           phone: formData.phone,
           email: formData.email,
           city: formData.city || null,
           issue: formData.issue,
         })
         .select()
         .single()

       if (directSaveError) {
         console.error('Direct lead_signups save error:', directSaveError)
       } else {
         console.log('Lead signup data saved directly to DB:', directSaveData?.id)
       }
       
        const response = await fetch('https://app.orbitl-dash.us/api/lead-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            use_invite_link: useInviteLink
          })
        });

       console.log('Lead signup API response status:', response.status)
       const status = response.status;

      if (status === 201) {
        const responseData = await response.json().catch(() => ({}))
        console.log('Lead signup successful, response:', responseData)
        
        // Track successful form submission
        trackFormSubmit({
          form_type: 'lead_signup',
          status: 'success',
          email: formData.email,
          lead_signup_id: directSaveData?.id || responseData.lead_signup_id,
          lead_signup_saved: !!directSaveData?.id || responseData.lead_signup_saved,
          direct_save_success: !!directSaveData?.id,
          api_save_success: responseData.lead_signup_saved,
          flow_type: responseData.flow_type,
        });
        
        // Different success messages based on flow type
        const isInviteFlow = responseData.flow_type === 'invite_link';
        toast({
          title: isInviteFlow ? "Check Your Email!" : "Account Created!",
          description: isInviteFlow 
            ? "We've sent you an invite link to complete your setup. Check your email!"
            : "Check your email for password setup instructions.",
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
        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          result = { error: "Unable to parse response" };
        }

        let errorTitle = "Error";
        let errorDescription = result.error || "Something went wrong. Please try again.";

        if (status === 409) {
          errorTitle = "Account Already Exists";
          errorDescription = "An account with this email address already exists. Please try signing in instead.";
        } else if (status === 400) {
          errorTitle = "Invalid Input";
          // Use the specific error message from API
        } else if (status === 500) {
          errorTitle = "Server Error";
          errorDescription = "Something went wrong on our end. Please try again later.";
        }

        // Track failed form submission
        trackFormSubmit({
          form_type: 'lead_signup',
          status: 'error',
          error_code: status,
          error_message: errorDescription,
        });

        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive"
        });
      }
    } catch (error) {
      // Track network error
      trackFormSubmit({
        form_type: 'lead_signup',
        status: 'error',
        error_type: 'network',
      });

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
        <Select 
          required 
          value={formData.issue}
          onValueChange={(value) => setFormData(prev => ({ ...prev, issue: value }))}
        >
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
          {isSubmitting 
            ? (useInviteLink ? 'Sending Invite...' : 'Creating Account...') 
            : (useInviteLink ? 'Get My Invite Link →' : 'Create My Booking Form →')}
        </Button>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {useInviteLink 
            ? "We'll send you a secure link to complete your setup. No account created until you confirm."
            : "Upon submission, an account will be created with a temporary password. Check your email for secure setup instructions."}
        </p>
      </div>
    </form>
  );
}