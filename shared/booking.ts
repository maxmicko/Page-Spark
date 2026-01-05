import { supabase } from '../client/src/lib/supabase';

export async function getUserByBookingId(bookingId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (error) throw error;
  return data;
}

export async function getServicesByUserId(userId: string) {
  const { data, error } = await supabase
    .from('user_services')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

export async function getWorkHoursByUserId(userId: string) {
  const { data, error } = await supabase
    .from('user_work_hours')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

export async function getAvailableSlots(userId: string, date: Date, serviceDuration: number, serviceBuffer: number) {
  // Get work hours for the day
  const workHours = await getWorkHoursByUserId(userId);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayHours = workHours.find(h => h.day_of_week === dayOfWeek);

  if (!dayHours) return [];

  // Get existing appointments for the date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: appointments, error } = await supabase
    .from('user_appointments')
    .select('start_time, service_id')
    .eq('user_id', userId)
    .gte('start_time', startOfDay.toISOString())
    .lte('start_time', endOfDay.toISOString())
    .in('status', ['confirmed', 'scheduled', 'active']);

  if (error) throw error;

  // Calculate available slots
  const slots = [];
  const startTime = new Date(date);
  startTime.setHours(dayHours.start_hour, dayHours.start_minute, 0, 0);
  const endTime = new Date(date);
  endTime.setHours(dayHours.end_hour, dayHours.end_minute, 0, 0);

  const slotDuration = 30; // 30 minutes
  const totalDuration = serviceDuration + serviceBuffer;

  for (let time = startTime; time < endTime; time.setMinutes(time.getMinutes() + slotDuration)) {
    const slotEnd = new Date(time);
    slotEnd.setMinutes(slotEnd.getMinutes() + totalDuration);

    // Check if slot conflicts with existing appointments
    const conflict = appointments.some(apt => {
      const aptTime = new Date(apt.start_time);
      const aptEnd = new Date(aptTime);
      aptEnd.setMinutes(aptEnd.getMinutes() + serviceDuration); // Assuming service duration for existing apt

      return (time < aptEnd && slotEnd > aptTime);
    });

    if (!conflict) {
      slots.push({
        start: time.toISOString(),
        end: slotEnd.toISOString()
      });
    }
  }

  return slots;
}

export async function createPendingAppointment(userId: string, bookingData: any) {
  const { data, error } = await supabase
    .from('user_appointments')
    .insert({
      user_id: userId,
      service_id: bookingData.serviceId,
      customer_name: bookingData.customer.name,
      customer_phone: bookingData.customer.phone,
      address: bookingData.customer.address,
      start_time: bookingData.scheduledAt,
      vehicle_make: bookingData.vehicle.make,
      vehicle_model: bookingData.vehicle.model,
      vehicle_year: bookingData.vehicle.year,
      vehicle_color: bookingData.vehicle.color,
      notes: bookingData.notes,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}