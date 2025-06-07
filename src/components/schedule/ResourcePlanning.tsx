
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Wrench, Clock, Users, AlertTriangle } from 'lucide-react';
import { Appointment, Technician } from '@/types/schedule';

interface ResourcePlanningProps {
  appointments: Appointment[];
  technicians: Technician[];
}

const ResourcePlanning: React.FC<ResourcePlanningProps> = ({
  appointments,
  technicians
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today);
  
  const workloadByTechnician = technicians.map(tech => {
    const techAppointments = todayAppointments.filter(apt => apt.technicianId === tech.id);
    const totalMinutes = techAppointments.reduce((sum, apt) => sum + apt.estimatedDuration, 0);
    const workingMinutes = 8 * 60; // 8 hour work day
    const utilization = (totalMinutes / workingMinutes) * 100;
    
    return {
      ...tech,
      appointments: techAppointments.length,
      totalMinutes,
      utilization: Math.min(utilization, 100)
    };
  });

  const urgentAppointments = todayAppointments.filter(apt => apt.priority === 'urgent');
  const completedToday = todayAppointments.filter(apt => apt.status === 'completed');

  const averageUtilization = workloadByTechnician.reduce((sum, tech) => sum + tech.utilization, 0) / technicians.length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Workload</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">appointments scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{urgentAppointments.length}</div>
            <p className="text-xs text-muted-foreground">require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{completedToday.length}</div>
            <p className="text-xs text-muted-foreground">tasks finished today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageUtilization.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">across all technicians</p>
          </CardContent>
        </Card>
      </div>

      {/* Technician Workload */}
      <Card>
        <CardHeader>
          <CardTitle>Technician Workload Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {workloadByTechnician.map((tech) => (
            <div key={tech.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{tech.name}</span>
                  <Badge variant={tech.isAvailable ? "default" : "secondary"}>
                    {tech.isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {tech.appointments} appointments ({(tech.totalMinutes / 60).toFixed(1)}h)
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Utilization</span>
                  <span>{tech.utilization.toFixed(0)}%</span>
                </div>
                <Progress 
                  value={tech.utilization} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Urgent Appointments */}
      {urgentAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Urgent Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{appointment.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.startTime} - {appointment.endTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Urgent</Badge>
                      <Badge variant="outline">{appointment.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourcePlanning;
