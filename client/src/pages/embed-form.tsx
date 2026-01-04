import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import BookingWizard from "@/components/BookingWizard";

const DEFAULT_SERVICES = [
  { id: "basic", name: "Basic Wash", price: 30, duration: 30, description: "Exterior wash & dry, tire shine" },
  { id: "full", name: "Full Detail", price: 120, duration: 120, description: "Deep clean inside & out, clay bar, sealant" },
  { id: "wax", name: "Waxing", price: 50, duration: 45, description: "Premium carnauba wax application" },
  { id: "interior", name: "Interior Cleaning", price: 80, duration: 60, description: "Vacuum, shampoo mats, dashboard wipe" },
];

interface FormConfig {
  name?: string;
  primary_color: string;
  border_radius: number;
  font_family: string;
}

export default function EmbedForm() {
  const [location] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const bookingId = urlParams.get('bookingId');

      if (!bookingId) {
        setError('Missing bookingId parameter');
        setLoading(false);
        return;
      }

      // Get user by bookingId
      const userResponse = await fetch(`https://gfpidktpzubpcsqlvxcq.supabase.co/rest/v1/user_profiles?select=*&booking_id=eq.${bookingId}`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcGlka3RwenVicGNzcWx2eGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMDk4NzYsImV4cCI6MjA4MTg4NTg3Nn0.lujAhtphHMLMVXSS6XMEGfoBbPo6jNeTyXJoiBO7RJY',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcGlka3RwenVicGNzcWx2eGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMDk4NzYsImV4cCI6MjA4MTg4NTg3Nn0.lujAhtphHMLMVXSS6XMEGfoBbPo6jNeTyXJoiBO7RJY'
        }
      });
      if (!userResponse.ok) {
        setError('Invalid booking ID');
        setLoading(false);
        return;
      }
      const userDataArray = await userResponse.json();
      if (!userDataArray || userDataArray.length === 0) {
        setError('Invalid booking ID');
        setLoading(false);
        return;
      }
      const userData = userDataArray[0];
      setUser(userData);

      // Get services for the user
      const servicesResponse = await fetch(`https://gfpidktpzubpcsqlvxcq.supabase.co/rest/v1/user_services?select=*&user_id=eq.${userData.id}`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcGlka3RwenVicGNzcWx2eGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMDk4NzYsImV4cCI6MjA4MTg4NTg3Nn0.lujAhtphHMLMVXSS6XMEGfoBbPo6jNeTyXJoiBO7RJY',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcGlka3RwenVicGNzcWx2eGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMDk4NzYsImV4cCI6MjA4MTg4NTg3Nn0.lujAhtphHMLMVXSS6XMEGfoBbPo6jNeTyXJoiBO7RJY'
        }
      });
      if (!servicesResponse.ok) {
        console.error('Error loading services:', servicesResponse.statusText);
        setServices([]);
      } else {
        const servicesData = await servicesResponse.json();
        setServices(servicesData || []);
      }

      setLoading(false);
    };

    loadData();
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading form: {error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Invalid booking ID</p>
        </div>
      </div>
    );
  }

  const urlParams = new URLSearchParams(window.location.search);
  const primaryColor = urlParams.get('color') || '#0ea5e9';
  const borderRadius = parseInt(urlParams.get('radius') || '8');
  const fontFamily = urlParams.get('font') || 'Inter';

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <BookingWizard
          styles={{
            primaryColor,
            borderRadius,
            fontFamily,
          }}
          userId={user?.id}
          services={services}
        />
      </div>
    </div>
  );
}