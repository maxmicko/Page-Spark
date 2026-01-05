import { useState, useMemo } from "react";
import { format, addMinutes, isSameDay, parseISO, isBefore, startOfDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  startTime: string;  // Travel start time
  endTime: string;    // Service end time
  customerName: string;
  address: string;
  status: string;
  latitude: string;
  longitude: string;
  travelMinutes?: number;      // ADD THIS
  serviceStartTime?: string;   // ADD THIS
}
interface TimeSlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
  appointment?: Appointment;
}

interface TimeSlotPickerProps {
       selectedDate: Date;
       existingAppointments: Appointment[];
       selectedDuration: number; // in minutes
       resolvedTravelMinutes?: number; // pre-calculated travel time in minutes (no fallback)
       currentJobLocation?: { lat: number; lng: number } | null; // location of job being scheduled
       onTimeSelect: (startTime: Date | null) => void;
       selectedStartTime?: Date;
       workHours?: any[]; // work hours configuration
       workStartedEarly?: boolean;
       earlyStartTime?: string | null;
}

export function TimeSlotPicker({
       selectedDate,
       existingAppointments,
       selectedDuration,
       resolvedTravelMinutes,
       currentJobLocation,
       onTimeSelect,
       selectedStartTime,
       workHours,
       workStartedEarly = false,
       earlyStartTime,
}: TimeSlotPickerProps) {
   const [hoveredSlot, setHoveredSlot] = useState<Date | null>(null);

   // Round up to the next 15-minute increment
   const roundUpToNext15Minutes = (date: Date): Date => {
     const minutes = date.getMinutes();
     const remainder = minutes % 15;
     const minutesToAdd = remainder === 0 ? 0 : 15 - remainder;
     const roundedDate = new Date(date);
     roundedDate.setMinutes(minutes + minutesToAdd, 0, 0);
     return roundedDate;
   };

   // Check if slot is in the past
   const isSlotInPast = (slotTime: Date) => {
     const now = new Date();
     const isToday = selectedDate.toDateString() === now.toDateString();
     if (!isToday) return false;
     return slotTime < now;
   };

  // Check if slot is within work hours
  const isWithinWorkHours = (slotStart: Date): boolean => {
    // First check if slot is in the past - if so, never allow it
    if (isSlotInPast(slotStart)) return false;

    if (!workHours || workHours.length === 0) return true; // If no work hours set, allow all slots (early work logic handled in slot generation)

    const dayOfWeek = slotStart.toLocaleDateString('en-US', { weekday: 'long' });
    const workHour = workHours.find(wh => wh.dayOfWeek === dayOfWeek);

    if (!workHour || workHour.isEnabled !== "true") return true; // Allow slots for non-workdays (early work logic handled in slot generation)

    const [startHour, startMin] = workHour.startTime.split(':').map(Number);
    const [endHour, endMin] = workHour.endTime.split(':').map(Number);

    const workStart = new Date(slotStart);
    workStart.setHours(startHour, startMin, 0, 0);

    const workEnd = new Date(slotStart);
    workEnd.setHours(endHour, endMin, 0, 0);

    // Check if slot is within configured work hours OR after early start time (if work started early)
    const withinConfiguredHours = slotStart >= workStart && slotStart < workEnd;
    const afterEarlyStart = workStartedEarly && earlyStartTime ? slotStart >= new Date(earlyStartTime) : false;

    return withinConfiguredHours || afterEarlyStart;
  };

  // Check if there's enough travel time before this slot
  const hasEnoughTravelTime = (slotStart: Date) => {
    if (resolvedTravelMinutes == null) return false; // Only fail if no travel data (allows 0 minutes)
    // For booking wizard, simplify - assume travel time is 0 or not checked
    return true;
  };

  // Check if work hours are configured for this day
  const hasWorkHoursForDay = useMemo(() => {
    if (!workHours || workHours.length === 0) return false;
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    return workHours.some(wh => wh.dayOfWeek === dayOfWeek && wh.isEnabled === "true");
  }, [workHours, selectedDate]);

  // Generate time slots for the day (within work hours or 6 AM to 10 PM, 15-minute intervals)
    const timeSlots = useMemo(() => {
      // UX improvement: Don't render disabled grid when travel time isn't ready
      if (resolvedTravelMinutes == null) {
        return [];
      }

      // If the selected date is in the past, don't generate slots
      if (isBefore(startOfDay(selectedDate), startOfDay(new Date()))) {
        return [];
      }

      // If no work hours configured for this day, don't generate slots
      if (!hasWorkHoursForDay && !workStartedEarly) {
        return [];
      }

    const slots: TimeSlot[] = [];
    const intervalMinutes = 15;

    let dayStart: Date;
    let dayEnd: Date;

    // Check if work hours are configured for this day
    if (workHours && workHours.length > 0) {
        const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
        const workHour = workHours.find(wh => wh.dayOfWeek === dayOfWeek && wh.isEnabled === "true");

        if (workHour) {
          const [startHour, startMin] = workHour.startTime.split(':').map(Number);
          const [endHour, endMin] = workHour.endTime.split(':').map(Number);

          const configuredStart = new Date(selectedDate);
          configuredStart.setHours(startHour, startMin, 0, 0);

          const configuredEnd = new Date(selectedDate);
          configuredEnd.setHours(endHour, endMin, 0, 0);

          if (workStartedEarly && earlyStartTime) {
            // When work started early, start from the early start time rounded up to next 15 minutes
            const earlyStart = new Date(earlyStartTime);
            if (isSameDay(earlyStart, selectedDate)) {
              dayStart = roundUpToNext15Minutes(earlyStart);
              dayEnd = configuredEnd;
            } else {
              // For future dates, use configured work hours
              dayStart = configuredStart;
              dayEnd = configuredEnd;
            }
          } else {
            dayStart = configuredStart;
            dayEnd = configuredEnd;
          }
        } else {
          // No work hours for this day
          if (workStartedEarly && earlyStartTime) {
            // Work started early on a non-workday, start from the early start time rounded up to next 15 minutes
            const earlyStart = new Date(earlyStartTime);
            if (isSameDay(earlyStart, selectedDate)) {
              dayStart = roundUpToNext15Minutes(earlyStart);
            } else {
              dayStart = new Date(selectedDate);
              dayStart.setHours(6, 0, 0, 0);
            }
            dayEnd = new Date(selectedDate);
            dayEnd.setHours(22, 0, 0, 0);
          } else {
            // Use default range
            dayStart = new Date(selectedDate);
            dayStart.setHours(6, 0, 0, 0);

            dayEnd = new Date(selectedDate);
            dayEnd.setHours(22, 0, 0, 0);
          }
        }
      } else {
        // No work hours configured
        if (workStartedEarly && earlyStartTime) {
          // When work started early without configured hours, start from the early start time rounded up to next 15 minutes
          const earlyStart = new Date(earlyStartTime);
          if (isSameDay(earlyStart, selectedDate)) {
            dayStart = roundUpToNext15Minutes(earlyStart);
          } else {
            dayStart = new Date(selectedDate);
            dayStart.setHours(6, 0, 0, 0);
          }
          dayEnd = new Date(selectedDate);
          dayEnd.setHours(22, 0, 0, 0);
        } else {
          // Default range (6 AM to 10 PM)
          dayStart = new Date(selectedDate);
          dayStart.setHours(6, 0, 0, 0);

          dayEnd = new Date(selectedDate);
          dayEnd.setHours(22, 0, 0, 0);
        }
      }

    let currentTime = new Date(dayStart);

    while (currentTime < dayEnd) {
      const slotEnd = addMinutes(currentTime, intervalMinutes);

      // Check if this slot conflicts with any existing appointment (including travel time)
const conflictingAppointment = existingAppointments.find(apt => {
  const aptTravelStart = parseISO(apt.startTime); // Travel starts here
  const aptEnd = parseISO(apt.endTime);

  // The entire appointment blocks from travel start to service end
  return (
    isSameDay(aptTravelStart, selectedDate) &&
    ((currentTime >= aptTravelStart && currentTime < aptEnd) ||
     (slotEnd > aptTravelStart && slotEnd <= aptEnd) ||
     (currentTime <= aptTravelStart && slotEnd >= aptEnd))
  );
});

      const slotStartTime = new Date(currentTime);
      const hasTravelTime = hasEnoughTravelTime(slotStartTime);
      const withinWorkHours = isWithinWorkHours(slotStartTime);
      const inPast = isSlotInPast(slotStartTime);

      slots.push({
        startTime: slotStartTime,
        endTime: new Date(slotEnd),
        available: !conflictingAppointment && hasTravelTime && withinWorkHours,
        appointment: conflictingAppointment,
      });

      currentTime = new Date(slotEnd);
    }

    return slots;
   }, [selectedDate, existingAppointments, resolvedTravelMinutes, workHours, workStartedEarly, hasWorkHoursForDay, earlyStartTime]);

  // Check if a proposed time slot would conflict
  const wouldConflict = (proposedStart: Date) => {
    const proposedEnd = addMinutes(proposedStart, selectedDuration);

    return existingAppointments.some(apt => {
      const aptStart = parseISO(apt.startTime);
      const aptEnd = parseISO(apt.endTime);
      return (
        isSameDay(aptStart, selectedDate) &&
        ((proposedStart >= aptStart && proposedStart < aptEnd) ||
         (proposedEnd > aptStart && proposedEnd <= aptEnd) ||
         (proposedStart <= aptStart && proposedEnd >= aptEnd))
      );
    });
  };

  // Group slots by hour for better display
  const slotsByHour = useMemo(() => {
    const grouped: { [hour: number]: TimeSlot[] } = {};

    timeSlots.forEach(slot => {
      const hour = slot.startTime.getHours();
      if (!grouped[hour]) {
        grouped[hour] = [];
      }
      grouped[hour].push(slot);
    });

    return grouped;
  }, [timeSlots]);

  const handleSlotClick = (slotStart: Date) => {
    if (selectedStartTime && selectedStartTime.getTime() === slotStart.getTime()) {
      // Deselect if clicking the selected slot
      onTimeSelect(null);
    } else if (!wouldConflict(slotStart) && hasEnoughTravelTime(slotStart) && isWithinWorkHours(slotStart)) {
      onTimeSelect(slotStart);
    }
  };

  // Check if the selected date is in the past
  const isPastDate = isBefore(startOfDay(selectedDate), startOfDay(new Date()));

  // If no work hours configured for this day and work hasn't started early, or if it's a past date, show message
   if ((!hasWorkHoursForDay && !workStartedEarly) || isPastDate) {
     return (
       <div className="space-y-4">
         <Card className="border-slate-200 bg-slate-50">
           <CardContent className="p-6 text-center">
             <Clock className="w-8 h-8 text-slate-400 mx-auto mb-3" />
             <p className="text-slate-600 font-medium">
               {isPastDate ? "Cannot create jobs on past dates" : "We don't work that day"}
             </p>
             <p className="text-sm text-slate-500 mt-1">
               {isPastDate
                 ? "You cannot schedule jobs on dates that have already passed."
                 : "We're closed on this day. Please select a different date."
               }
             </p>
           </CardContent>
         </Card>
       </div>
     );
   }

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600 mb-4">
        Select a time slot for your service.
        {workHours && workHours.length > 0 ? (
          resolvedTravelMinutes ? (
            <>Green slots are available, gray slots are occupied. • Work hours configured.</>
          ) : (
            <>Slots will become available once travel time is determined.</>
          )
        ) : (
          <>No work hours configured. Please set your work hours to create appointments.</>
        )}
      </div>

      <div className="border rounded-lg bg-slate-50">
        {Object.entries(slotsByHour).map(([hour, slots]) => (
          <div key={hour} className="border-b border-slate-200 last:border-b-0">
            <div className="px-4 py-2 bg-slate-100 border-b">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <span className="font-medium text-slate-700">
                  {format(new Date().setHours(parseInt(hour), 0, 0, 0), "h:mm a")}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot, index) => {
                  const isSelected = selectedStartTime &&
                    selectedStartTime.getTime() === slot.startTime.getTime();
                  const isHovered = hoveredSlot?.getTime() === slot.startTime.getTime();
                  const hasConflict = !slot.available;
                  const isPastSlot = isSlotInPast(slot.startTime);

                  // For multi-slot selection, check if this slot is part of the selected range
                  const isInSelectedRange = selectedStartTime ? (() => {
                    const selectedEnd = addMinutes(selectedStartTime, selectedDuration);
                    return slot.startTime >= selectedStartTime && slot.endTime <= selectedEnd;
                  })() : false;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "relative p-2 rounded border-2 transition-all text-xs",
                        hasConflict || isPastSlot || (isInSelectedRange && !isSelected)
                          ? "bg-slate-200 border-slate-300 cursor-not-allowed opacity-60"
                          : isSelected
                          ? "bg-emerald-100 border-emerald-400 shadow-sm cursor-pointer"
                          : isHovered
                          ? "bg-emerald-50 border-emerald-300 cursor-pointer"
                          : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-25 cursor-pointer"
                      )}
                      onClick={() => !hasConflict && !isPastSlot && (isSelected || !isInSelectedRange) && handleSlotClick(slot.startTime)}
                      onMouseEnter={() => !isPastSlot && setHoveredSlot(slot.startTime)}
                      onMouseLeave={() => setHoveredSlot(null)}
                    >
                      <div className="text-center">
                        <div className="font-medium">
                          {format(slot.startTime, "mm")}
                        </div>
                      </div>

                      {slot.appointment && (() => {
  const apt = slot.appointment;
  const aptTravelStart = parseISO(apt.startTime);
  const aptEnd = parseISO(apt.endTime);

  // Calculate service start time
  const aptServiceStart = apt.serviceStartTime
    ? parseISO(apt.serviceStartTime)
    : apt.travelMinutes
      ? addMinutes(aptTravelStart, apt.travelMinutes)
      : aptTravelStart; // Fallback if no travel data

  // Determine if current slot is in travel or service time
  const isInTravelTime = slot.startTime >= aptTravelStart && slot.startTime < aptServiceStart;
  const isInServiceTime = slot.startTime >= aptServiceStart && slot.startTime < aptEnd;

  if (isInTravelTime) {
    // Gray travel block
    return (
      <div className="absolute inset-0 bg-slate-500/90 rounded flex items-center justify-center p-1">
        <div className="text-white text-[10px] text-center leading-tight">
          <Navigation className="w-3 h-3 mx-auto mb-0.5" />
          <div className="font-medium text-[9px]">Traveling</div>
          <div className="opacity-75 text-[8px] truncate">
            to {apt.customerName}
          </div>
        </div>
      </div>
    );
  } else if (isInServiceTime) {
    // Dark service block
    return (
      <div className="absolute inset-0 bg-slate-800/90 rounded flex items-center justify-center p-1">
        <div className="text-white text-[10px] text-center leading-tight">
          <div className="font-medium truncate">
            {apt.customerName}
          </div>
          <div className="opacity-75 text-[9px]">
            {format(aptServiceStart, "HH:mm")}-
            {format(aptEnd, "HH:mm")}
          </div>
        </div>
      </div>
    );
  }

  return null;
})()}

                      {isSelected && (
                        <div className="absolute -top-1 -right-1">
                          <Badge className="bg-emerald-500 text-white text-[10px] px-1">
                            Selected
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedStartTime && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-emerald-800">
                Selected: {format(selectedStartTime, "h:mm a")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}