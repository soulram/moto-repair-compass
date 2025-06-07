
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Appointment, Technician } from '@/types/schedule';

interface AppointmentBookingProps {
  technicians: Technician[];
  onBookAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  technicians,
  onBookAppointment
}) => {
  const [formData, setFormData] = useState({
    customerId: '',
    motorcycleId: '',
    technicianId: '',
    date: undefined as Date | undefined,
    startTime: '',
    endTime: '',
    type: '',
    description: '',
    estimatedDuration: 60,
    priority: 'medium',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) return;

    const appointment: Omit<Appointment, 'id'> = {
      customerId: formData.customerId,
      motorcycleId: formData.motorcycleId,
      technicianId: formData.technicianId,
      date: format(formData.date, 'yyyy-MM-dd'),
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: 'scheduled',
      type: formData.type as any,
      description: formData.description,
      estimatedDuration: formData.estimatedDuration,
      priority: formData.priority as any,
      notes: formData.notes
    };

    onBookAppointment(appointment);
    
    // Reset form
    setFormData({
      customerId: '',
      motorcycleId: '',
      technicianId: '',
      date: undefined,
      startTime: '',
      endTime: '',
      type: '',
      description: '',
      estimatedDuration: 60,
      priority: 'medium',
      notes: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book New Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID</Label>
              <Input
                id="customerId"
                value={formData.customerId}
                onChange={(e) => setFormData(prev => ({...prev, customerId: e.target.value}))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="motorcycleId">Motorcycle ID</Label>
              <Input
                id="motorcycleId"
                value={formData.motorcycleId}
                onChange={(e) => setFormData(prev => ({...prev, motorcycleId: e.target.value}))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData(prev => ({...prev, date}))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technician">Technician</Label>
              <Select
                value={formData.technicianId}
                onValueChange={(value) => setFormData(prev => ({...prev, technicianId: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name} - {tech.specialties.join(', ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({...prev, startTime: e.target.value}))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({...prev, endTime: e.target.value}))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({...prev, type: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({...prev, priority: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData(prev => ({...prev, estimatedDuration: parseInt(e.target.value)}))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Book Appointment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentBooking;
