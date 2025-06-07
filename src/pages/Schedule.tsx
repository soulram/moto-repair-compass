
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CalendarView from '@/components/schedule/CalendarView';
import AppointmentBooking from '@/components/schedule/AppointmentBooking';
import TechnicianAvailability from '@/components/schedule/TechnicianAvailability';
import ResourcePlanning from '@/components/schedule/ResourcePlanning';
import { Appointment, Technician } from '@/types/schedule';

const Schedule = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Mock data - in a real app, this would come from an API
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      customerId: 'CUST001',
      motorcycleId: 'BIKE001',
      technicianId: 'TECH001',
      date: '2024-12-07',
      startTime: '09:00',
      endTime: '11:00',
      status: 'scheduled',
      type: 'repair',
      description: 'Engine oil change and brake inspection',
      estimatedDuration: 120,
      priority: 'medium',
      notes: 'Customer reported squeaking brakes'
    },
    {
      id: '2',
      customerId: 'CUST002',
      motorcycleId: 'BIKE002',
      technicianId: 'TECH002',
      date: '2024-12-07',
      startTime: '14:00',
      endTime: '15:30',
      status: 'in-progress',
      type: 'maintenance',
      description: 'Regular maintenance check',
      estimatedDuration: 90,
      priority: 'low',
      notes: ''
    },
    {
      id: '3',
      customerId: 'CUST003',
      motorcycleId: 'BIKE003',
      technicianId: 'TECH001',
      date: '2024-12-07',
      startTime: '16:00',
      endTime: '17:00',
      status: 'scheduled',
      type: 'inspection',
      description: 'Pre-purchase inspection',
      estimatedDuration: 60,
      priority: 'urgent',
      notes: 'Rush job - customer needs results today'
    }
  ]);

  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: 'TECH001',
      name: 'Mike Johnson',
      email: 'mike@motorepair.com',
      phone: '(555) 123-4567',
      specialties: ['Engine Repair', 'Electrical Systems'],
      isAvailable: true,
      workingHours: { start: '08:00', end: '17:00' },
      breakTime: { start: '12:00', end: '13:00' }
    },
    {
      id: 'TECH002',
      name: 'Sarah Davis',
      email: 'sarah@motorepair.com',
      phone: '(555) 234-5678',
      specialties: ['Brakes', 'Suspension', 'Tires'],
      isAvailable: true,
      workingHours: { start: '09:00', end: '18:00' },
      breakTime: { start: '13:00', end: '14:00' }
    },
    {
      id: 'TECH003',
      name: 'Carlos Rodriguez',
      email: 'carlos@motorepair.com',
      phone: '(555) 345-6789',
      specialties: ['Transmission', 'Clutch', 'Engine Repair'],
      isAvailable: false,
      workingHours: { start: '07:00', end: '16:00' },
      breakTime: { start: '11:30', end: '12:30' }
    },
    {
      id: 'TECH004',
      name: 'Jessica Chen',
      email: 'jessica@motorepair.com',
      phone: '(555) 456-7890',
      specialties: ['Electrical Systems', 'Diagnostics', 'Fuel Systems'],
      isAvailable: true,
      workingHours: { start: '08:30', end: '17:30' },
      breakTime: { start: '12:30', end: '13:30' }
    },
    {
      id: 'TECH005',
      name: 'David Wilson',
      email: 'david@motorepair.com',
      phone: '(555) 567-8901',
      specialties: ['Body Work', 'Paint', 'Customization'],
      isAvailable: true,
      workingHours: { start: '09:00', end: '18:00' },
      breakTime: { start: '14:00', end: '15:00' }
    }
  ]);

  const handleBookAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
    const appointment: Appointment = {
      ...newAppointment,
      id: `APPT${Date.now()}`
    };
    
    setAppointments(prev => [...prev, appointment]);
    toast({
      title: "Appointment Booked",
      description: `New appointment scheduled for ${appointment.date} at ${appointment.startTime}`,
    });
  };

  const handleUpdateTechnicianAvailability = (technicianId: string, isAvailable: boolean) => {
    setTechnicians(prev => 
      prev.map(tech => 
        tech.id === technicianId 
          ? { ...tech, isAvailable }
          : tech
      )
    );
    
    const technician = technicians.find(t => t.id === technicianId);
    toast({
      title: "Availability Updated",
      description: `${technician?.name} is now ${isAvailable ? 'available' : 'busy'}`,
    });
  };

  // Statistics for the dashboard cards
  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
  const pendingRepairs = appointments.filter(apt => apt.status === 'scheduled' && apt.type === 'repair');
  const availableTechnicians = technicians.filter(tech => tech.isAvailable);
  const availableSlots = 6; // This would be calculated based on technician schedules

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Schedule Management</h2>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayAppointments.length > 8 ? 'Fully booked' : `${8 - todayAppointments.length} slots available`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Repairs
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRepairs.length}</div>
            <p className="text-xs text-muted-foreground">
              awaiting technician assignment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Slots
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableSlots}</div>
            <p className="text-xs text-muted-foreground">
              for this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Technicians
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableTechnicians.length}</div>
            <p className="text-xs text-muted-foreground">
              out of {technicians.length} total
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Schedule Management Interface */}
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="booking">Book Appointment</TabsTrigger>
          <TabsTrigger value="technicians">Technician Availability</TabsTrigger>
          <TabsTrigger value="planning">Resource Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <CalendarView
            appointments={appointments}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        </TabsContent>
        
        <TabsContent value="booking" className="space-y-4">
          <AppointmentBooking
            technicians={technicians}
            onBookAppointment={handleBookAppointment}
          />
        </TabsContent>
        
        <TabsContent value="technicians" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technician Availability</CardTitle>
              <CardDescription>
                Monitor and update technician availability and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TechnicianAvailability
                technicians={technicians}
                onUpdateAvailability={handleUpdateTechnicianAvailability}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="planning" className="space-y-4">
          <ResourcePlanning
            appointments={appointments}
            technicians={technicians}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Schedule;
