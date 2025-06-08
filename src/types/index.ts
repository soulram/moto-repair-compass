
// Customer types
export type ContractType = 'none' | 'basic' | 'premium' | 'inclusive';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  contractType: ContractType;
  motorcycles: Motorcycle[];
  createdAt: string;
  updatedAt: string;
}

// Motorcycle types
export interface Motorcycle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  vinNumber: string;
  licensePlate: string;
  color: string;
  currentMileage: number;
  lastServiceDate: string;
  lastServiceMileage: number;
  nextServiceMileage: number;
  warrantyExpiryDate: string | null;
  notes: string;
}

// Repair and service types
export type RepairStatus = 'pending' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';

export type ChecklistStatus = 'ok' | 'monitor' | 'replace' | 'not-checked';

export type ChecklistItemType = 'N' | 'V' | 'R';

export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  type: ChecklistItemType;
  status: ChecklistStatus;
  notes: string;
  requiresAttention: boolean;
}

export interface RepairOrder {
  id: string;
  customerId: string;
  motorcycleId: string;
  scheduledDate: string;
  completedDate: string | null;
  mechanicId: string | null;
  status: RepairStatus;
  description: string;
  customerNotes: string;
  mechanicNotes: string;
  estimatedHours: number;
  checklist: ChecklistItem[];
  partsUsed: PartUsage[];
  laborHours: number;
  quoteId: string | null;
  invoiceId: string | null;
}

// Inventory types
export type PartCategory = 'engine' | 'brakes' | 'suspension' | 'electrical' | 'body' | 'transmission' | 'other';

export interface Part {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  category: PartCategory;
  price: number;
  cost: number;
  stockQuantity: number;
  minimumStock: number;
  supplierIds: string[];
  location: string;
  warrantyPeriod: number; // in months
  compatibleModels: string[];
  isActive: boolean;
}

export interface PartUsage {
  partId: string;
  repairOrderId: string;
  quantity: number;
  warrantyCovered: boolean;
  unitPrice: number;
}

// Quote and Invoice types
export interface Quote {
  id: string;
  customerId: string;
  motorcycleId: string;
  repairOrderId: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  parts: QuoteItem[];
  labor: QuoteItem[];
  taxRate: number;
  discount: number;
  notes: string;
  total: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  motorcycleId: string;
  repairOrderId: string;
  quoteId: string | null;
  createdAt: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod: string | null;
  paymentDate: string | null;
  parts: InvoiceItem[];
  labor: InvoiceItem[];
  taxRate: number;
  discount: number;
  notes: string;
  total: number;
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  warrantyCovered: boolean;
  subtotal: number;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  warrantyCovered: boolean;
  subtotal: number;
}

// Staff types
export interface Mechanic {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'mechanic' | 'receptionist';
  isActive: boolean;
}
