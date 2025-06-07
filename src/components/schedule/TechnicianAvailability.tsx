
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Phone, Mail } from 'lucide-react';
import { Technician } from '@/types/schedule';

interface TechnicianAvailabilityProps {
  technicians: Technician[];
  onUpdateAvailability: (technicianId: string, isAvailable: boolean) => void;
}

const TechnicianAvailability: React.FC<TechnicianAvailabilityProps> = ({
  technicians,
  onUpdateAvailability
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {technicians.map((technician) => (
        <Card key={technician.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {technician.name}
              </CardTitle>
              <Badge 
                variant={technician.isAvailable ? "default" : "secondary"}
                className={technician.isAvailable ? "bg-green-500" : "bg-red-500"}
              >
                {technician.isAvailable ? "Available" : "Busy"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{technician.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{technician.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {technician.workingHours.start} - {technician.workingHours.end}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Specialties</h4>
              <div className="flex flex-wrap gap-1">
                {technician.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Break Time</h4>
              <p className="text-sm text-muted-foreground">
                {technician.breakTime.start} - {technician.breakTime.end}
              </p>
            </div>

            <Button
              variant={technician.isAvailable ? "outline" : "default"}
              size="sm"
              className="w-full"
              onClick={() => onUpdateAvailability(technician.id, !technician.isAvailable)}
            >
              Mark as {technician.isAvailable ? "Busy" : "Available"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TechnicianAvailability;
