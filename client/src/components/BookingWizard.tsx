import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Car, 
  Clock, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  { id: "basic", name: "Basic Wash", price: 30, duration: 30, description: "Exterior wash & dry, tire shine" },
  { id: "full", name: "Full Detail", price: 120, duration: 120, description: "Deep clean inside & out, clay bar, sealant" },
  { id: "wax", name: "Waxing", price: 50, duration: 45, description: "Premium carnauba wax application" },
  { id: "interior", name: "Interior Cleaning", price: 80, duration: 60, description: "Vacuum, shampoo mats, dashboard wipe" },
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", 
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

const wizardSchema = z.object({
  selectedServiceIds: z.array(z.string()).min(1, "Select at least one service"),
  address: z.string().min(1, "Address is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  vehicleInfo: z.object({
    year: z.string().min(1, "Year is required"),
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    color: z.string().optional(),
  }),
  contactPhone: z.string().min(1, "Phone is required"),
  contactMethod: z.enum(["sms", "whatsapp"]),
  notes: z.string().optional(),
});

type WizardFormData = z.infer<typeof wizardSchema>;

export default function BookingWizard({ styles }: { styles?: { primaryColor?: string, borderRadius?: number, fontFamily?: string } }) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const primaryColor = styles?.primaryColor || "#0ea5e9";
  const borderRadius = styles?.borderRadius !== undefined ? styles.borderRadius : 8;

  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      selectedServiceIds: [],
      address: "",
      date: "",
      time: "",
      vehicleInfo: { year: "", make: "", model: "", color: "" },
      notes: "",
      contactPhone: "",
      contactMethod: "sms",
    },
  });

  const { watch, setValue, handleSubmit, trigger, formState: { errors } } = form;
  const formData = watch();

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["selectedServiceIds"];
    if (step === 2) fieldsToValidate = ["address"];
    if (step === 3) fieldsToValidate = ["date", "time"];
    if (step === 4) fieldsToValidate = ["vehicleInfo", "contactPhone"];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(s => s + 1);
  };

  const handleServiceToggle = (serviceId: string) => {
    const current = formData.selectedServiceIds || [];
    const updated = current.includes(serviceId)
      ? current.filter(id => id !== serviceId)
      : [...current, serviceId];
    setValue("selectedServiceIds", updated);
  };

  const onSubmit = (data: WizardFormData) => {
    console.log("Form Data:", data);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="p-8 text-center space-y-6 shadow-xl border-t-4" style={{ borderTopColor: primaryColor, borderRadius: `${borderRadius}px` }}>
        <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
        <h2 className="text-2xl font-bold">Booking Received!</h2>
        <p className="text-muted-foreground">We'll contact you shortly to confirm your appointment.</p>
        <Button className="w-full" onClick={() => window.location.reload()} style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}>
          Done
        </Button>
      </Card>
    );
  }

  const totalPrice = SERVICES.filter(s => formData.selectedServiceIds.includes(s.id)).reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="space-y-6" style={{ fontFamily: styles?.fontFamily || 'Inter', color: 'inherit' }}>
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                step >= i ? "text-white" : "bg-slate-100 text-slate-400"
              )}
              style={{ 
                backgroundColor: step >= i ? primaryColor : undefined,
                fontFamily: styles?.fontFamily 
              }}
            >
              {i}
            </div>
            {i < 5 && <div className={cn("w-4 md:w-12 h-px", step > i ? "bg-primary" : "bg-slate-200")} style={{ backgroundColor: step > i ? primaryColor : undefined }} />}
          </div>
        ))}
      </div>

      <div className="min-h-[400px]" style={{ fontFamily: styles?.fontFamily }}>
        {step === 1 && (
          <div className="grid gap-4">
            <h3 className="text-lg font-bold" style={{ fontFamily: styles?.fontFamily }}>Select Services</h3>
            {SERVICES.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceToggle(service.id)}
                className={cn(
                  "p-4 border-2 cursor-pointer transition-all",
                  formData.selectedServiceIds.includes(service.id) ? "bg-slate-50" : "border-slate-100"
                )}
                style={{ 
                  borderRadius: `${borderRadius}px`,
                  borderColor: formData.selectedServiceIds.includes(service.id) ? primaryColor : undefined,
                  fontFamily: styles?.fontFamily
                }}
              >
                <div className="flex justify-between font-bold" style={{ fontFamily: styles?.fontFamily }}>
                  <span>{service.name}</span>
                  <span>${service.price}</span>
                </div>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: styles?.fontFamily }}>{service.description}</p>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4" style={{ fontFamily: styles?.fontFamily }}>
            <h3 className="text-lg font-bold" style={{ fontFamily: styles?.fontFamily }}>Service Location</h3>
            <div className="space-y-2">
              <Label style={{ fontFamily: styles?.fontFamily }}>Address</Label>
              <Input 
                placeholder="Enter your address" 
                value={formData.address}
                onChange={e => setValue("address", e.target.value)}
                style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }}
              />
              {errors.address && <p className="text-xs text-red-500" style={{ fontFamily: styles?.fontFamily }}>{errors.address.message}</p>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6" style={{ fontFamily: styles?.fontFamily }}>
            <h3 className="text-lg font-bold" style={{ fontFamily: styles?.fontFamily }}>Date & Time</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <Calendar
                mode="single"
                selected={formData.date ? new Date(formData.date) : undefined}
                onSelect={d => d && setValue("date", format(d, "yyyy-MM-dd"))}
                className="border rounded-md"
                style={{ fontFamily: styles?.fontFamily }}
              />
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map(t => (
                  <Button
                    key={t}
                    variant={formData.time === t ? "default" : "outline"}
                    onClick={() => setValue("time", t)}
                    style={{ 
                      borderRadius: `${borderRadius}px`,
                      backgroundColor: formData.time === t ? primaryColor : undefined,
                      borderColor: formData.time === t ? primaryColor : undefined,
                      fontFamily: styles?.fontFamily
                    }}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4" style={{ fontFamily: styles?.fontFamily }}>
            <h3 className="text-lg font-bold" style={{ fontFamily: styles?.fontFamily }}>Vehicle & Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ fontFamily: styles?.fontFamily }}>Make</Label>
                <Input value={formData.vehicleInfo.make} onChange={e => setValue("vehicleInfo.make", e.target.value)} style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
              </div>
              <div className="space-y-2">
                <Label style={{ fontFamily: styles?.fontFamily }}>Model</Label>
                <Input value={formData.vehicleInfo.model} onChange={e => setValue("vehicleInfo.model", e.target.value)} style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
              </div>
            </div>
            <div className="space-y-2">
              <Label style={{ fontFamily: styles?.fontFamily }}>Phone Number</Label>
              <Input placeholder="(555) 000-0000" value={formData.contactPhone} onChange={e => setValue("contactPhone", e.target.value)} style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4" style={{ fontFamily: styles?.fontFamily }}>
            <h3 className="text-lg font-bold" style={{ fontFamily: styles?.fontFamily }}>Review Booking</h3>
            <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm" style={{ fontFamily: styles?.fontFamily }}>
              <div className="flex justify-between" style={{ fontFamily: styles?.fontFamily }}>
                <span>Services</span>
                <span className="font-bold">${totalPrice}</span>
              </div>
              <div className="flex justify-between" style={{ fontFamily: styles?.fontFamily }}>
                <span>Date</span>
                <span className="font-bold">{formData.date} at {formData.time}</span>
              </div>
              <div className="flex justify-between" style={{ fontFamily: styles?.fontFamily }}>
                <span>Location</span>
                <span className="font-bold truncate max-w-[200px]">{formData.address}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-6">
        {step > 1 && (
          <Button variant="outline" className="flex-1" onClick={() => setStep(s => s - 1)} style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        )}
        <Button 
          className="flex-1" 
          onClick={step === 5 ? handleSubmit(onSubmit) : handleNext}
          style={{ 
            backgroundColor: primaryColor,
            borderRadius: `${borderRadius}px`,
            fontFamily: styles?.fontFamily
          }}
        >
          {step === 5 ? "Confirm Booking" : "Continue"} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
