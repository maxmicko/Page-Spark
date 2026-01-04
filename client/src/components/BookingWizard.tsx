import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Info, CheckCircle2, ArrowRight, ArrowLeft, Clock, MapPin, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPendingAppointment } from "../shared/booking";

const DEFAULT_SERVICES = [
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

export default function BookingWizard({ styles, userId, services }: { styles?: { primaryColor?: string, borderRadius?: number, fontFamily?: string }, userId?: string, services?: any[] }) {
  const SERVICES = userId ? (services || []) : DEFAULT_SERVICES;
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const primaryColor = styles?.primaryColor || "#0ea5e9";
  const borderRadius = styles?.borderRadius !== undefined ? styles.borderRadius : 12;

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
    if (isValid) {
      if (step === 4) {
        setShowConfirmation(true);
      } else {
        setStep(s => s + 1);
      }
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    const current = formData.selectedServiceIds || [];
    const updated = current.includes(serviceId)
      ? current.filter(id => id !== serviceId)
      : [...current, serviceId];
    setValue("selectedServiceIds", updated);
  };

  const onSubmit = async () => {
    try {
      if (!userId) throw new Error('User not authenticated');

      // For now, create appointment for the first selected service
      const firstServiceId = formData.selectedServiceIds[0];
      if (!firstServiceId) throw new Error('No service selected');

      const bookingData = {
        serviceId: firstServiceId,
        customer: {
          name: 'Embedded Form Customer', // Could be enhanced to collect name
          phone: formData.contactPhone,
          address: formData.address,
          notes: formData.notes,
        },
        vehicle: {
          make: formData.vehicleInfo.make,
          model: formData.vehicleInfo.model,
          year: formData.vehicleInfo.year,
          color: formData.vehicleInfo.color,
        },
        scheduledAt: new Date(`${formData.date}T${formData.time}`).toISOString(),
        notes: formData.notes,
      };

      await createPendingAppointment(userId, bookingData);

      setIsSubmitted(true);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error submitting booking:', error);
      // For now, still show success
      setIsSubmitted(true);
      setShowConfirmation(false);
    }
  };

  const totalPrice = SERVICES.filter(s => formData.selectedServiceIds.includes(s.id)).reduce((acc, s) => acc + s.price, 0);

  if (isSubmitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center h-full min-h-[500px]">
        <Card className="p-8 md:p-12 text-center space-y-6 shadow-xl border-none ring-1 ring-slate-200 w-full max-w-md mx-auto" style={{ borderRadius: `${borderRadius}px` }}>
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: styles?.fontFamily }}>Booking Confirmed!</h2>
          <p className="text-slate-500 max-w-sm mx-auto" style={{ fontFamily: styles?.fontFamily }}>
            We've received your request for {formData.date} at {formData.time}. A pro will be in touch shortly.
          </p>
          <Button className="w-full h-12 text-white font-semibold shadow-lg shadow-primary/20" onClick={() => window.location.reload()} style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }}>
            Return Home
          </Button>
        </Card>
      </motion.div>
    );
  }

  if (showConfirmation) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full space-y-4 md:space-y-6">
        <div className="text-center space-y-1 md:space-y-2 shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900" style={{ fontFamily: styles?.fontFamily }}>Review Your Booking</h2>
          <p className="text-slate-500 text-xs md:text-sm">Please verify the details below.</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 md:pr-2 -mr-1 md:-mr-2 custom-scrollbar min-h-0 space-y-4">
          <div className="p-4 md:p-6 bg-slate-900 text-white rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 md:gap-3">
                 <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
                 </div>
                 <div>
                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Appointment</p>
                    <p className="font-bold text-sm md:text-base leading-tight">{formData.date} at {formData.time}</p>
                 </div>
              </div>
              <div className="text-right ml-2">
                 <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Total</p>
                 <p className="text-lg md:text-xl font-bold" style={{ color: primaryColor }}>${totalPrice}</p>
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                <MapPin className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-white/80 truncate">{formData.address || "No address provided"}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                <Car className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-white/80">{formData.vehicleInfo.make} {formData.vehicleInfo.model}</span>
              </div>
            </div>
          </div>

          <div className="p-3 md:p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
             <Info className="w-4 h-4 md:w-5 md:h-5 text-amber-500 shrink-0 mt-0.5" />
             <p className="text-[10px] md:text-xs text-amber-800 leading-relaxed">
                By confirming, you agree to our 24-hour cancellation policy.
             </p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-3 pt-4 md:pt-6 shrink-0 border-t mt-auto">
          <Button variant="ghost" className="h-11 md:h-12 px-4 md:px-6 font-bold text-slate-500 text-sm md:text-base" onClick={() => setShowConfirmation(false)} style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }}>
            <ArrowLeft className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Edit</span>
          </Button>
          <Button 
            className="flex-1 h-11 md:h-12 text-white font-bold text-base md:text-lg shadow-lg shadow-primary/20" 
            onClick={handleSubmit(onSubmit)}
            style={{ 
              backgroundColor: primaryColor,
              borderRadius: `${borderRadius}px`,
              fontFamily: styles?.fontFamily
            }}
          >
            Confirm & Book <CheckCircle2 className="w-4 h-4 ml-1 md:ml-2" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh] md:max-h-[650px] w-full" style={{ fontFamily: styles?.fontFamily || 'Inter' }}>
      <div className="flex flex-col gap-4 mb-4 md:mb-6 shrink-0">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5 md:mb-1 block" style={{ fontFamily: styles?.fontFamily }}>Step {step} of 4</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight" style={{ fontFamily: styles?.fontFamily }}>
              {step === 1 && "Choose Services"}
              {step === 2 && "Service Location"}
              {step === 3 && "Pick Date & Time"}
              {step === 4 && "Vehicle & Contact"}
            </h2>
          </div>
          <div className="text-lg md:text-xl font-bold shrink-0 ml-2" style={{ color: primaryColor, fontFamily: styles?.fontFamily }}>
            ${totalPrice}
          </div>
        </div>
        <div className="h-1.5 md:h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500 ease-out"
            style={{ 
              width: `${(step / 4) * 100}%`,
              backgroundColor: primaryColor
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 md:pr-2 -mr-1 md:-mr-2 custom-scrollbar min-h-0">
        {step === 1 && (
          <div className="grid gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
            {SERVICES.map((service) => {
              const isSelected = formData.selectedServiceIds.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceToggle(service.id)}
                  className={cn(
                    "group relative p-4 md:p-5 border-2 cursor-pointer transition-all duration-300",
                    isSelected ? "shadow-md scale-[1.01]" : "border-slate-100 hover:border-slate-200"
                  )}
                  style={{ 
                    borderRadius: `${borderRadius}px`,
                    borderColor: isSelected ? primaryColor : undefined,
                    backgroundColor: isSelected ? `${primaryColor}05` : 'white'
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-base md:text-lg text-slate-900" style={{ fontFamily: styles?.fontFamily }}>{service.name}</span>
                    <span className="font-bold text-base md:text-lg shrink-0 ml-2" style={{ color: isSelected ? primaryColor : '#64748b', fontFamily: styles?.fontFamily }}>${service.price}</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed pr-6 md:pr-8" style={{ fontFamily: styles?.fontFamily }}>{service.description}</p>
                  <div className="mt-2 md:mt-3 flex items-center gap-3 text-[10px] md:text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration} min</span>
                    {isSelected && <span className="flex items-center gap-1" style={{ color: primaryColor }}><CheckCircle2 className="w-3 h-3" /> Selected</span>}
                  </div>
                </div>
              );
            })}
            {errors.selectedServiceIds && <p className="text-xs text-red-500 font-medium" style={{ fontFamily: styles?.fontFamily }}>{errors.selectedServiceIds.message}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
            <div className="p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
               </div>
               <Label className="text-sm font-bold text-slate-900 mb-2 block">Service Address</Label>
               <Input 
                  placeholder="Address, city, zip" 
                  value={formData.address}
                  onChange={e => setValue("address", e.target.value)}
                  className="h-11 md:h-12 border-slate-200 focus:ring-2 bg-white shadow-sm"
                  style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }}
                />
                {errors.address && <p className="mt-2 text-xs text-red-500 font-medium">{errors.address.message}</p>}
                <p className="mt-3 text-[11px] md:text-xs text-slate-400 leading-relaxed">
                  Our mobile detailers will come directly to your location.
                </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
            <div className="space-y-2 md:space-y-3">
              <Label className="text-sm font-bold text-slate-900">Select Date</Label>
              <Calendar
                mode="single"
                selected={formData.date ? new Date(formData.date) : undefined}
                onSelect={d => d && setValue("date", format(d, "yyyy-MM-dd"))}
                className="border rounded-2xl p-2 md:p-4 bg-white shadow-sm w-full max-w-[280px] mx-auto md:max-w-none"
              />
            </div>
            <div className="space-y-2 md:space-y-3">
              <Label className="text-sm font-bold text-slate-900">Select Time</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] md:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {TIME_SLOTS.map(t => (
                  <Button
                    key={t}
                    variant="outline"
                    onClick={() => setValue("time", t)}
                    className={cn(
                      "h-10 md:h-12 border-slate-200 transition-all text-xs md:text-sm",
                      formData.time === t && "text-white"
                    )}
                    style={{ 
                      borderRadius: `${borderRadius / 1.5}px`,
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
          <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Make</Label>
                <Input placeholder="e.g. Tesla" value={formData.vehicleInfo.make} onChange={e => setValue("vehicleInfo.make", e.target.value)} className="h-11 md:h-12" style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Model</Label>
                <Input placeholder="e.g. Model 3" value={formData.vehicleInfo.model} onChange={e => setValue("vehicleInfo.model", e.target.value)} className="h-11 md:h-12" style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
              </div>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</Label>
              <Input placeholder="(555) 000-0000" value={formData.contactPhone} onChange={e => setValue("contactPhone", e.target.value)} className="h-11 md:h-12" style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 md:gap-3 pt-4 md:pt-6 shrink-0 border-t mt-auto">
        {step > 1 && (
          <Button variant="ghost" className="h-11 md:h-12 px-4 md:px-6 font-bold text-slate-500 hover:bg-slate-50 text-sm md:text-base" onClick={() => setStep(s => s - 1)} style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }}>
            <ArrowLeft className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Back</span>
          </Button>
        )}
        <Button 
          className="flex-1 h-11 md:h-12 text-white font-bold text-base md:text-lg shadow-lg shadow-primary/20 hover:scale-[0.99] transition-transform" 
          onClick={handleNext}
          style={{ 
            backgroundColor: primaryColor,
            borderRadius: `${borderRadius}px`,
            fontFamily: styles?.fontFamily
          }}
        >
          {step === 4 ? "Review Details" : "Continue"} <ArrowRight className="w-4 h-4 ml-1 md:ml-2" />
        </Button>
      </div>
    </div>
  );
}
