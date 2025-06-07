
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Appointment } from '@/types/schedule';

interface CalendarViewProps {
  appointments: Appointment[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  onDateSelect,
  selectedDate
}) => {
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dateStr);
  };

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateSelect(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              Appointments for {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDateAppointments.length === 0 ? (
              <p className="text-muted-foreground">No appointments scheduled</p>
            ) : (
              selectedDateAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-3 border rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {appointment.startTime} - {appointment.endTime}
                    </span>
                    <Badge 
                      className={`text-white ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {appointment.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{appointment.type}</Badge>
                    <Badge variant={appointment.priority === 'urgent' ? 'destructive' : 'secondary'}>
                      {appointment.priority}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
