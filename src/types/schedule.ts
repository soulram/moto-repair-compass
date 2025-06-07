
export interface Appointment {
  id: string;
  customerId: string;
  motorcycleId: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  type: 'repair' | 'maintenance' | 'inspection' | 'consultation';
  description: string;
  estimatedDuration: number; // in minutes
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  isAvailable: boolean;
  workingHours: {
    start: string;
    end: string;
  };
  breakTime: {
    start: string;
    end: string;
  };
}

export interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  technicianId?: string;
  appointmentId?: string;
}
