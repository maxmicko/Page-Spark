import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Car, User, Phone } from 'lucide-react';

export const BookingFormPreview = () => {
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-2xl border-2 border-primary/20 p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-primary">Book Your Detail</h3>
        <p className="text-sm text-muted-foreground">Quick & easy scheduling</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Your Name
          </Label>
          <Input placeholder="John Doe" />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone
          </Label>
          <Input placeholder="(555) 123-4567" />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            Vehicle Type
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="van">Van</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Service Address
          </Label>
          <Input placeholder="123 Main St, City, State" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </Label>
            <Input placeholder="MM/DD/YYYY" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time
            </Label>
            <Input placeholder="10:00 AM" />
          </div>
        </div>

        <Button className="w-full" size="lg">
          Book Now
        </Button>
      </div>
    </Card>
  );
};