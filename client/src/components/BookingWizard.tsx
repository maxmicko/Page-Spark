import { useState, useEffect } from "react";
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
import { Info, CheckCircle2, ArrowRight, ArrowLeft, Clock, MapPin, Car, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPendingAppointment, getWorkHoursByUserId } from "../shared/booking";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { AddressInput } from "./AddressInput";

const DEFAULT_SERVICES = [
  { id: "basic", name: "Basic Wash", price: 30, duration: 30, description: "Exterior wash & dry, tire shine" },
  { id: "full", name: "Full Detail", price: 120, duration: 120, description: "Deep clean inside & out, clay bar, sealant" },
  { id: "wax", name: "Waxing", price: 50, duration: 45, description: "Premium carnauba wax application" },
  { id: "interior", name: "Interior Cleaning", price: 80, duration: 60, description: "Vacuum, shampoo mats, dashboard wipe" },
];


const wizardSchema = z.object({
  selectedServiceIds: z.array(z.string()).min(1, "Select at least one service"),
  address: z.string().min(1, "Address is required"),
  date: z.string().min(1, "Date is required"),
  dateObj: z.date().nullable(),
  time: z.string().min(1, "Time is required"),
  totalDuration: z.number().optional(),
  customerName: z.string().min(1, "Name is required"),
  vehicleInfo: z.object({
    year: z.string().min(1, "Year is required"),
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    color: z.string().optional(),
    license_plate: z.string().optional(),
  }),
  contactPhone: z.string().min(1, "Phone is required"),
  contactMethod: z.enum(["sms", "whatsapp"]),
  notes: z.string().optional(),
});

type WizardFormData = z.infer<typeof wizardSchema>;

export default function BookingWizard({ styles, userId, services, businessName }: { styles?: { primaryColor?: string, borderRadius?: number, fontFamily?: string }, userId?: string, services?: any[], businessName?: string }) {
   const SERVICES = userId ? (services || []) : DEFAULT_SERVICES;
   const [step, setStep] = useState(1);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [showConfirmation, setShowConfirmation] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState<string | null>(null);
   const [addressCoordinates, setAddressCoordinates] = useState<{ lat: number; lng: number } | null>(null);
   const [workHours, setWorkHours] = useState<any[]>([]);
   const [currentDayHours, setCurrentDayHours] = useState<any>(null);
  
  const primaryColor = styles?.primaryColor || "#0ea5e9";
  const borderRadius = styles?.borderRadius !== undefined ? styles.borderRadius : 12;

  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      selectedServiceIds: [],
      address: "",
      date: "",
      dateObj: null,
      time: "",
      customerName: "",
      vehicleInfo: { year: "", make: "", model: "", color: "", license_plate: "" },
      notes: "",
      contactPhone: "",
      contactMethod: "sms",
    },
  });

  const { watch, setValue, handleSubmit, trigger, formState: { errors } } = form;
  const formData = watch();

  useEffect(() => {
    if (userId) {
      getWorkHoursByUserId(userId).then(hours => {
        const mapped = hours.map(h => ({
          dayOfWeek: h.day_of_week,
          startTime: h.start_time,
          endTime: h.end_time,
          isEnabled: h.is_enabled
        }));
        setWorkHours(mapped);
      }).catch(console.error);
    } else {
      // Mock work hours for form builder preview
      const mockWorkHours = [
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', isEnabled: 'true' },
        { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', isEnabled: 'true' },
        { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', isEnabled: 'true' },
        { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', isEnabled: 'true' },
        { dayOfWeek: 'Friday', startTime: '09:00', endTime: '17:00', isEnabled: 'true' },
      ];
      setWorkHours(mockWorkHours);
    }
  }, [userId]);

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["selectedServiceIds"];
    if (step === 2) fieldsToValidate = ["address"];
    if (step === 3) fieldsToValidate = ["dateObj", "time"];
    if (step === 4) fieldsToValidate = ["customerName", "vehicleInfo.year", "vehicleInfo.make", "vehicleInfo.model", "contactPhone"];

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
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!userId) throw new Error('User not authenticated');

      // For now, create appointment for the first selected service
      const firstServiceId = formData.selectedServiceIds[0];
      if (!firstServiceId) throw new Error('No service selected');

      const startTime = new Date(`${formData.date}T${formData.time}`);
      if (isNaN(startTime.getTime())) {
        throw new Error('Invalid date or time selected');
      }

      const bookingData = {
        serviceId: firstServiceId,
        customer: {
          name: formData.customerName?.trim() || 'Customer',
          phone: formData.contactPhone?.trim() || '',
          address: formData.address?.trim() || '',
          notes: formData.notes?.trim() || '',
        },
        vehicle: {
          make: formData.vehicleInfo.make?.trim() || '',
          model: formData.vehicleInfo.model?.trim() || '',
          year: formData.vehicleInfo.year?.trim() || '',
          color: formData.vehicleInfo.color?.trim() || '',
          license_plate: formData.vehicleInfo.license_plate?.trim() || '',
        },
        scheduledAt: startTime.toISOString(),
        latitude: addressCoordinates?.lat || 0,
        longitude: addressCoordinates?.lng || 0,
        notes: formData.notes?.trim() || '',
      };

      await createPendingAppointment(userId, bookingData);

      setIsSubmitted(true);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = SERVICES.filter(s => formData.selectedServiceIds.includes(s.id)).reduce((acc, s) => acc + s.price, 0);
  const totalDuration = SERVICES.filter(s => formData.selectedServiceIds.includes(s.id)).reduce((acc, s) => acc + (s.duration_minutes || s.duration || 30), 0);
  const selectedDuration = Math.ceil(totalDuration / 15) * 15;

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
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
        <div className="text-center space-y-2 shrink-0 mb-6">
          <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: styles?.fontFamily }}>Review Your Booking</h2>
          <p className="text-slate-500 text-sm">Please verify the details below.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-1 space-y-6">
          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase font-bold tracking-widest">Appointment</p>
                    <p className="font-bold text-base leading-tight">{formData.date} at {formData.time}</p>
                  </div>
              </div>
              <div className="text-right">
                  <p className="text-xs text-white/50 uppercase font-bold tracking-widest">Total</p>
                  <p className="text-xl font-bold" style={{ color: primaryColor }}>${totalPrice}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-white/80">{formData.customerName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-white/80">{formData.address || "No address provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Car className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-white/80">{formData.vehicleInfo.make} {formData.vehicleInfo.model}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Appointment Details</p>
              <p className="text-sm text-blue-700">
                {format(new Date(`${formData.date}T${formData.time}`), "EEEE, MMMM d, yyyy 'at' h:mm a")}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Duration: {selectedDuration} minutes
              </p>
            </div>
            {errors.dateObj && <p className="text-xs text-red-500 font-medium" style={{ fontFamily: styles?.fontFamily }}>{errors.dateObj.message}</p>}
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                 By confirming, you agree to our 24-hour cancellation policy.
              </p>
          </div>
        </div>

        <div className="flex gap-3 pt-6 shrink-0 border-t mt-6">
          <Button variant="ghost" className="h-12 px-6 font-bold text-slate-500" onClick={() => setShowConfirmation(false)} style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button
            className="flex-1 h-12 text-white font-bold text-lg shadow-lg shadow-primary/20"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={{
              backgroundColor: primaryColor,
              borderRadius: `${borderRadius}px`,
              fontFamily: styles?.fontFamily
            }}
          >
            {isSubmitting ? "Booking..." : "Confirm & Book"} <CheckCircle2 className="w-4 h-4 ml-2" />
          </Button>
        </div>
        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800">{submitError}</p>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-[650px] w-full" style={{ fontFamily: styles?.fontFamily || 'Inter' }}>
      {businessName && (
        <div className="shrink-0 text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: styles?.fontFamily, color: primaryColor }}>
            {businessName}
          </h1>
          <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: styles?.fontFamily }}>
            Book your service appointment
          </p>
        </div>
      )}
      <div className="shrink-0 flex flex-col gap-4 mb-4 md:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400" style={{ fontFamily: styles?.fontFamily }}>Step {step} of 4</span>
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: styles?.fontFamily }}>
              {step === 1 && "Choose Services"}
              {step === 2 && "Service Location"}
              {step === 3 && "Pick Date & Time"}
              {step === 4 && "Vehicle & Contact"}
            </h2>
          </div>
          <div className="w-[72px] text-right text-lg font-semibold text-slate-700" style={{ fontFamily: styles?.fontFamily }}>
            ${totalPrice}
          </div>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${(step / 4) * 100}%`,
              backgroundColor: primaryColor
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1">
        {step === 1 && (
          <div className="grid gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
            {SERVICES.map((service) => {
              const isSelected = formData.selectedServiceIds.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceToggle(service.id)}
                  className={cn(
                    "relative p-4 md:p-5 border-2 cursor-pointer transition-all duration-300",
                    isSelected ? "border-transparent bg-slate-50 shadow-md" : "border-slate-200 hover:border-slate-300"
                  )}
                  style={{
                    borderRadius: `${borderRadius}px`,
                    borderColor: isSelected ? primaryColor : undefined
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-base md:text-lg text-slate-900 leading-tight" style={{ fontFamily: styles?.fontFamily }}>{service.name}</span>
                    <span className="font-bold text-base md:text-lg shrink-0 ml-2" style={{ color: isSelected ? primaryColor : '#64748b', fontFamily: styles?.fontFamily }}>${service.price}</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-3" style={{ fontFamily: styles?.fontFamily }}>{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-semibold text-slate-600 text-[10px] md:text-xs">
                      <Clock className="w-3 h-3" /> {(service.duration_minutes || service.duration || 30)} min
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] md:text-xs" style={{ color: primaryColor }}>
                        <CheckCircle2 className="w-3 h-3" /> Selected
                      </span>
                    )}
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
               <AddressInput
                  value={formData.address}
                  onChange={(value, coordinates) => {
                    setValue("address", value);
                    setAddressCoordinates(coordinates || null);
                  }}
                  placeholder="Address, city, zip"
                />
                {errors.address && <p className="mt-2 text-xs text-red-500 font-medium">{errors.address.message}</p>}
                <p className="mt-3 text-[11px] md:text-xs text-slate-400 leading-relaxed">
                  Our mobile detailers will come directly to your location.
                </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid md:grid-cols-2 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-900">Select Date</Label>
              <div style={{ borderRadius: `${borderRadius}px` }} className="border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Calendar
                  mode="single"
                  selected={formData.dateObj || undefined}
                  onSelect={(date) => {
                    if (date && formData.dateObj && format(date, "yyyy-MM-dd") === formData.date) {
                      // Deselect if clicking the same date
                      setValue("dateObj", null);
                      setValue("date", "");
                      setValue("time", "");
                      setCurrentDayHours(null);
                    } else if (date) {
                      setValue("dateObj", date);
                      setValue("date", format(date, "yyyy-MM-dd"));
                      setValue("time", ""); // Clear time when changing date
                      const dayOfWeek = date.getDay();
                      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                      const dayName = dayNames[dayOfWeek];
                      const dayHours = workHours.find(h => h.dayOfWeek === dayName && h.isEnabled === "true");
                      setCurrentDayHours(dayHours || { closed: true });
                    }
                  }}
                  className="p-4 w-full border-0"
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-900">Select Time</Label>
              <TimeSlotPicker
                selectedDate={formData.dateObj || new Date()}
                existingAppointments={[]}
                selectedDuration={selectedDuration}
                resolvedTravelMinutes={0}
                onTimeSelect={(time) => setValue("time", time ? format(time, "HH:mm") : "")}
                selectedStartTime={formData.dateObj && formData.time ? (() => {
                  const [hours, minutes] = formData.time.split(':').map(Number);
                  const date = new Date(formData.dateObj);
                  date.setHours(hours, minutes, 0, 0);
                  return date;
                })() : undefined}
                workHours={workHours}
              />
            </div>
          </div>
        )}

        {step === 4 && (
           <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
             <div className="space-y-2">
               <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</Label>
               <Input placeholder="Enter your full name" value={formData.customerName} onChange={e => setValue("customerName", e.target.value)} className="h-12" style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
               {errors.customerName && <p className="text-xs text-red-500 font-medium">{errors.customerName.message}</p>}
             </div>
             <div className="grid grid-cols-3 gap-4">
               <div className="space-y-2">
                 <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Year</Label>
                 <Input placeholder="e.g. 2020" value={formData.vehicleInfo.year} onChange={e => setValue("vehicleInfo.year", e.target.value)} className="h-12" style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
                 {errors.vehicleInfo?.year && <p className="text-xs text-red-500 font-medium">{errors.vehicleInfo.year.message}</p>}
               </div>
               <div className="space-y-2">
                 <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Make</Label>
                 <Input placeholder="e.g. Tesla" value={formData.vehicleInfo.make} onChange={e => setValue("vehicleInfo.make", e.target.value)} className="h-12" style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
                 {errors.vehicleInfo?.make && <p className="text-xs text-red-500 font-medium">{errors.vehicleInfo.make.message}</p>}
               </div>
               <div className="space-y-2">
                 <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Model</Label>
                 <Input placeholder="e.g. Model 3" value={formData.vehicleInfo.model} onChange={e => setValue("vehicleInfo.model", e.target.value)} className="h-12" style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
                 {errors.vehicleInfo?.model && <p className="text-xs text-red-500 font-medium">{errors.vehicleInfo.model.message}</p>}
               </div>
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">License Plate</Label>
               <Input placeholder="e.g. ABC1234" value={formData.vehicleInfo.license_plate} onChange={e => setValue("vehicleInfo.license_plate", e.target.value)} className="h-12" style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</Label>
               <Input placeholder="(555) 000-0000" value={formData.contactPhone} onChange={e => setValue("contactPhone", e.target.value)} className="h-12" style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
               {errors.contactPhone && <p className="text-xs text-red-500 font-medium">{errors.contactPhone.message}</p>}
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Notes</Label>
               <textarea placeholder="Any special instructions or notes..." value={formData.notes} onChange={e => setValue("notes", e.target.value)} className="w-full h-20 p-3 border border-slate-200 rounded-lg resize-none" style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }} />
             </div>
           </div>
         )}
      </div>

      <div className="flex gap-3 pt-6 shrink-0 border-t">
        {step > 1 && (
          <Button variant="ghost" className="h-12 px-6 font-bold text-slate-500 hover:bg-slate-50" onClick={() => setStep(s => s - 1)} style={{ borderRadius: `${borderRadius}px`, fontFamily: styles?.fontFamily }}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        )}
        <Button
          className="flex-1 h-12 text-white font-bold text-lg shadow-lg shadow-primary/20"
          onClick={handleNext}
          style={{
            backgroundColor: primaryColor,
            borderRadius: `${borderRadius}px`,
            fontFamily: styles?.fontFamily
          }}
        >
          {step === 4 ? "Review Details" : "Continue"} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
