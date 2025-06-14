import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Edit, Trash, ChevronDown, ChevronRight } from "lucide-react";

interface ContractType {
  id: string;
  name: string;
  description: string;
  price: number;
  partsAllowance: number;
  maintenanceIntervals: MaintenanceInterval[];
}

interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  type: 'N' | 'V' | 'R';
  required: boolean;
}

interface MaintenanceInterval {
  id: string;
  mileage: number;
  description: string;
  checklistItems: ChecklistItem[];
  partReplacements: PartReplacement[];
  services: ServiceItem[];
}

interface PartReplacement {
  id: string;
  partName: string;
  quantity: number;
  labor: number;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  duration: number;
}

export default function ContractTypes() {
  const [contractTypes, setContractTypes] = useState<ContractType[]>([
    {
      id: "1",
      name: "Basic Service Contract",
      description: "Covers regular maintenance services",
      price: 199.99,
      partsAllowance: 10,
      maintenanceIntervals: [
        {
          id: "m1",
          mileage: 3000,
          description: "Oil change service",
          checklistItems: [
            { id: "c1", name: "Engine oil level", category: "Fluids", type: "V", required: true },
            { id: "c2", name: "Oil filter condition", category: "Fluids", type: "V", required: true },
          ],
          partReplacements: [
            { id: "p1", partName: "Oil filter", quantity: 1, labor: 0.5 },
            { id: "p2", partName: "Engine oil", quantity: 4, labor: 0.5 },
          ],
          services: [
            { id: "s1", name: "Oil change", description: "Drain old oil and replace with new oil", duration: 0.5 },
            { id: "s2", name: "Filter replacement", description: "Replace oil filter", duration: 0.3 },
          ]
        },
        {
          id: "m2",
          mileage: 6000,
          description: "Basic tune-up",
          checklistItems: [
            { id: "c3", name: "Spark plug condition", category: "Engine", type: "V", required: true },
            { id: "c4", name: "Air filter condition", category: "Engine", type: "V", required: true },
            { id: "c5", name: "Brake fluid level", category: "Safety", type: "V", required: true },
          ],
          partReplacements: [
            { id: "p3", partName: "Spark plugs", quantity: 2, labor: 1.0 },
            { id: "p4", partName: "Air filter", quantity: 1, labor: 0.5 },
          ],
          services: [
            { id: "s3", name: "Spark plug replacement", description: "Replace and gap spark plugs", duration: 1.0 },
            { id: "s4", name: "Air filter cleaning", description: "Clean or replace air filter", duration: 0.5 },
          ]
        }
      ]
    },
    {
      id: "2",
      name: "Premium Service Contract",
      description: "Comprehensive maintenance with priority service",
      price: 399.99,
      partsAllowance: 25,
      maintenanceIntervals: [
        {
          id: "m3",
          mileage: 3000,
          description: "Premium oil service",
          checklistItems: [
            { id: "c6", name: "Engine oil quality check", category: "Fluids", type: "V", required: true },
            { id: "c7", name: "Oil pressure test", category: "Engine", type: "N", required: true },
            { id: "c8", name: "Filter housing inspection", category: "Engine", type: "V", required: true },
          ],
          partReplacements: [
            { id: "p5", partName: "Premium oil filter", quantity: 1, labor: 0.5 },
            { id: "p6", partName: "Synthetic engine oil", quantity: 4, labor: 0.5 },
          ],
          services: [
            { id: "s5", name: "Synthetic oil change", description: "Drain old oil and replace with synthetic oil", duration: 0.5 },
            { id: "s6", name: "Premium filter installation", description: "Replace with premium oil filter", duration: 0.3 },
          ]
        },
        {
          id: "m4",
          mileage: 6000,
          description: "Enhanced tune-up",
          checklistItems: [
            { id: "c9", name: "Ignition system check", category: "Engine", type: "N", required: true },
            { id: "c10", name: "Fuel system inspection", category: "Engine", type: "V", required: true },
            { id: "c11", name: "Complete brake inspection", category: "Safety", type: "V", required: true },
            { id: "c12", name: "Electrical system test", category: "Electrical", type: "N", required: true },
          ],
          partReplacements: [
            { id: "p7", partName: "Iridium spark plugs", quantity: 2, labor: 1.0 },
            { id: "p8", partName: "Premium air filter", quantity: 1, labor: 0.5 },
            { id: "p9", partName: "Fuel filter", quantity: 1, labor: 1.0 },
          ],
          services: [
            { id: "s7", name: "Iridium spark plug installation", description: "Replace with iridium spark plugs", duration: 1.0 },
            { id: "s8", name: "Air filter replacement", description: "Replace with premium air filter", duration: 0.5 },
            { id: "s9", name: "Fuel system cleaning", description: "Clean fuel injectors and replace filter", duration: 1.0 },
          ]
        }
      ]
    }
  ]);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditContractDialogOpen, setIsEditContractDialogOpen] = useState(false);
  const [isChecklistItemDialogOpen, setIsChecklistItemDialogOpen] = useState(false);
  const [isMaintenanceIntervalDialogOpen, setIsMaintenanceIntervalDialogOpen] = useState(false);
  const [isPartDialogOpen, setIsPartDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [expandedIntervals, setExpandedIntervals] = useState<Record<string, boolean>>({});
  const [activeContractId, setActiveContractId] = useState<string>("1");
  const [editingContractId, setEditingContractId] = useState<string>("");
  const [editingChecklistItemId, setEditingChecklistItemId] = useState<string>("");
  const [editingIntervalId, setEditingIntervalId] = useState<string>("");
  const [editingPartId, setEditingPartId] = useState<string>("");
  const [editingServiceId, setEditingServiceId] = useState<string>("");

  const toggleInterval = (intervalId: string) => {
    setExpandedIntervals(prev => ({
      ...prev,
      [intervalId]: !prev[intervalId]
    }));
  };

  const contractFormSchema = z.object({
    name: z.string().min(1, "Contract name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    partsAllowance: z.coerce.number().min(0, "Parts allowance must be positive")
  });

  const checklistItemFormSchema = z.object({
    name: z.string().min(1, "Item name is required"),
    category: z.string().min(1, "Category is required"),
    type: z.enum(['N', 'V', 'R'], { required_error: "Type is required" }),
    required: z.boolean().default(false)
  });

  const maintenanceIntervalFormSchema = z.object({
    mileage: z.coerce.number().min(1, "Mileage must be at least 1"),
    description: z.string().min(1, "Description is required")
  });

  const partFormSchema = z.object({
    partName: z.string().min(1, "Part name is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    labor: z.coerce.number().min(0, "Labor hours must be positive")
  });

  const serviceFormSchema = z.object({
    name: z.string().min(1, "Service name is required"),
    description: z.string().min(1, "Description is required"),
    duration: z.coerce.number().min(0, "Duration must be positive")
  });

  const contractForm = useForm<z.infer<typeof contractFormSchema>>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      partsAllowance: 0
    },
  });

  const checklistItemForm = useForm<z.infer<typeof checklistItemFormSchema>>({
    resolver: zodResolver(checklistItemFormSchema),
    defaultValues: {
      name: "",
      category: "",
      type: "N",
      required: false
    },
  });

  const maintenanceIntervalForm = useForm<z.infer<typeof maintenanceIntervalFormSchema>>({
    resolver: zodResolver(maintenanceIntervalFormSchema),
    defaultValues: {
      mileage: 0,
      description: ""
    },
  });

  const partForm = useForm<z.infer<typeof partFormSchema>>({
    resolver: zodResolver(partFormSchema),
    defaultValues: {
      partName: "",
      quantity: 1,
      labor: 0
    },
  });

  const serviceForm = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 0
    },
  });

  const getActiveContract = () => {
    return contractTypes.find(contract => contract.id === activeContractId);
  };

  const onCreateContractSubmit = (data: z.infer<typeof contractFormSchema>) => {
    const newContractType: ContractType = {
      id: `${contractTypes.length + 1}`,
      name: data.name,
      description: data.description,
      price: data.price,
      partsAllowance: data.partsAllowance,
      maintenanceIntervals: []
    };
    
    setContractTypes([...contractTypes, newContractType]);
    setIsCreateDialogOpen(false);
    contractForm.reset();
  };

  const onEditContractSubmit = (data: z.infer<typeof contractFormSchema>) => {
    setContractTypes(prevContractTypes => 
      prevContractTypes.map(contract => 
        contract.id === editingContractId 
          ? { ...contract, name: data.name, description: data.description, price: data.price, partsAllowance: data.partsAllowance } 
          : contract
      )
    );
    setIsEditContractDialogOpen(false);
    contractForm.reset();
  };

  const onChecklistItemSubmit = (data: z.infer<typeof checklistItemFormSchema>) => {
    if (editingChecklistItemId) {
      setContractTypes(prevContractTypes => 
        prevContractTypes.map(contract => 
          contract.id === activeContractId 
            ? { 
                ...contract, 
                maintenanceIntervals: contract.maintenanceIntervals.map(interval => 
                  interval.id === editingIntervalId 
                    ? {
                        ...interval,
                        checklistItems: interval.checklistItems.map(item => 
                          item.id === editingChecklistItemId 
                            ? { ...item, name: data.name, category: data.category, type: data.type, required: data.required } 
                            : item
                        )
                      }
                    : interval
                ) 
              } 
            : contract
        )
      );
      setEditingChecklistItemId("");
    } else {
      const newChecklistItem: ChecklistItem = {
        id: `c${Date.now()}`,
        name: data.name,
        category: data.category,
        type: data.type,
        required: data.required
      };
      
      setContractTypes(prevContractTypes => 
        prevContractTypes.map(contract => 
          contract.id === activeContractId 
            ? { 
                ...contract, 
                maintenanceIntervals: contract.maintenanceIntervals.map(interval => 
                  interval.id === editingIntervalId 
                    ? {
                        ...interval,
                        checklistItems: [...interval.checklistItems, newChecklistItem]
                      }
                    : interval
                ) 
              } 
            : contract
        )
      );
    }
    
    setIsChecklistItemDialogOpen(false);
    checklistItemForm.reset();
  };

  const onMaintenanceIntervalSubmit = (data: z.infer<typeof maintenanceIntervalFormSchema>) => {
    if (editingIntervalId) {
      setContractTypes(prevContractTypes => 
        prevContractTypes.map(contract => 
          contract.id === activeContractId 
            ? { 
                ...contract, 
                maintenanceIntervals: contract.maintenanceIntervals.map(interval => 
                  interval.id === editingIntervalId 
                    ? { ...interval, mileage: data.mileage, description: data.description } 
                    : interval
                ) 
              } 
            : contract
        )
      );
      setEditingIntervalId("");
    } else {
      const newMaintenanceInterval: MaintenanceInterval = {
        id: `m${Date.now()}`,
        mileage: data.mileage,
        description: data.description,
        checklistItems: [],
        partReplacements: [],
        services: []
      };
      
      setContractTypes(prevContractTypes => 
        prevContractTypes.map(contract => 
          contract.id === activeContractId 
            ? { 
                ...contract, 
                maintenanceIntervals: [...contract.maintenanceIntervals, newMaintenanceInterval] 
              } 
            : contract
        )
      );
    }
    
    setIsMaintenanceIntervalDialogOpen(false);
    maintenanceIntervalForm.reset();
  };

  const onPartSubmit = (data: z.infer<typeof partFormSchema>) => {
    if (editingPartId) {
      setContractTypes(prevContractTypes => 
        prevContractTypes.map(contract => 
          contract.id === activeContractId 
            ? { 
                ...contract, 
                maintenanceIntervals: contract.maintenanceIntervals.map(interval => 
                  interval.id === editingIntervalId 
                    ? { 
                        ...interval,
                        partReplacements: interval.partReplacements.map(part => 
                          part.id === editingPartId 
                            ? { ...part, partName: data.partName, quantity: data.quantity, labor: data.labor } 
                            : part
                        )
                      } 
                    : interval
                ) 
              } 
            : contract
        )
      );
      setEditingPartId("");
    } else {
      const newPart: PartReplacement = {
        id: `p${Date.now()}`,
        partName: data.partName,
        quantity: data.quantity,
        labor: data.labor
      };
      
      setContractTypes(prevContractTypes => 
        prevContractTypes.map(contract => 
          contract.id === activeContractId 
            ? { 
                ...contract, 
                maintenanceIntervals: contract.maintenanceIntervals.map(interval => 
                  interval.id === editingIntervalId 
                    ? { 
                        ...interval,
                        partReplacements: [...interval.partReplacements, newPart]
                      } 
                    : interval
                ) 
              } 
            : contract
        )
      );
    }
    
    setIsPartDialogOpen(false);
    partForm.reset();
  };

  const onServiceSubmit = (data: z.infer<typeof serviceFormSchema>) => {
    if (editingServiceId) {
      setContractTypes(prevContractTypes => 
        prevContractTypes.map(contract => 
          contract.id === activeContractId 
            ? { 
                ...contract, 
                maintenanceIntervals: contract.maintenanceIntervals.map(interval => 
                  interval.id === editingIntervalId 
                    ? { 
                        ...interval,
                        services: interval.services.map(service => 
                          service.id === editingServiceId 
                            ? { ...service, name: data.name, description: data.description, duration: data.duration } 
                            : service
                        )
                      } 
                    : interval
                ) 
              } 
            : contract
        )
      );
      setEditingServiceId("");
    } else {
      const newService: ServiceItem = {
        id: `s${Date.now()}`,
        name: data.name,
        description: data.description,
        duration: data.duration
      };
      
      setContractTypes(prevContractTypes => 
        prevContractTypes.map(contract => 
          contract.id === activeContractId 
            ? { 
                ...contract, 
                maintenanceIntervals: contract.maintenanceIntervals.map(interval => 
                  interval.id === editingIntervalId 
                    ? { 
                        ...interval,
                        services: [...interval.services, newService]
                      } 
                    : interval
                ) 
              } 
            : contract
        )
      );
    }
    
    setIsServiceDialogOpen(false);
    serviceForm.reset();
  };

  const handleEditContract = (contract: ContractType) => {
    setEditingContractId(contract.id);
    contractForm.reset({
      name: contract.name,
      description: contract.description,
      price: contract.price,
      partsAllowance: contract.partsAllowance
    });
    setIsEditContractDialogOpen(true);
  };

  const handleEditChecklistItem = (intervalId: string, item: ChecklistItem) => {
    setEditingIntervalId(intervalId);
    setEditingChecklistItemId(item.id);
    checklistItemForm.reset({
      name: item.name,
      category: item.category,
      type: item.type,
      required: item.required
    });
    setIsChecklistItemDialogOpen(true);
  };

  const handleEditInterval = (interval: MaintenanceInterval) => {
    setEditingIntervalId(interval.id);
    maintenanceIntervalForm.reset({
      mileage: interval.mileage,
      description: interval.description
    });
    setIsMaintenanceIntervalDialogOpen(true);
  };

  const handleEditPart = (intervalId: string, part: PartReplacement) => {
    setEditingIntervalId(intervalId);
    setEditingPartId(part.id);
    partForm.reset({
      partName: part.partName,
      quantity: part.quantity,
      labor: part.labor
    });
    setIsPartDialogOpen(true);
  };

  const handleEditService = (intervalId: string, service: ServiceItem) => {
    setEditingIntervalId(intervalId);
    setEditingServiceId(service.id);
    serviceForm.reset({
      name: service.name,
      description: service.description,
      duration: service.duration
    });
    setIsServiceDialogOpen(true);
  };

  const handleAddChecklistItem = (intervalId: string) => {
    setEditingIntervalId(intervalId);
    setEditingChecklistItemId("");
    checklistItemForm.reset({
      name: "",
      category: "",
      type: "N",
      required: false
    });
    setIsChecklistItemDialogOpen(true);
  };

  const handleAddMaintenanceInterval = () => {
    setEditingIntervalId("");
    maintenanceIntervalForm.reset({
      mileage: 0,
      description: ""
    });
    setIsMaintenanceIntervalDialogOpen(true);
  };

  const handleAddPart = (intervalId: string) => {
    setEditingIntervalId(intervalId);
    setEditingPartId("");
    partForm.reset({
      partName: "",
      quantity: 1,
      labor: 0
    });
    setIsPartDialogOpen(true);
  };

  const handleAddService = (intervalId: string) => {
    setEditingIntervalId(intervalId);
    setEditingServiceId("");
    serviceForm.reset({
      name: "",
      description: "",
      duration: 0
    });
    setIsServiceDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contract Types</h1>
          <p className="text-muted-foreground">
            Manage service contract types and maintenance schedules
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Contract Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Contract Types</CardTitle>
          <CardDescription>
            Manage the different contract types offered to customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Parts Allowance (qty)</TableHead>
                <TableHead>Maintenance Intervals</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractTypes.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.name}</TableCell>
                  <TableCell>{contract.description}</TableCell>
                  <TableCell>${contract.price.toFixed(2)}</TableCell>
                  <TableCell>{contract.partsAllowance} parts</TableCell>
                  <TableCell>{contract.maintenanceIntervals.length} intervals</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditContract(contract)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
          <CardDescription>
            Select a contract to view and edit its details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="1" value={activeContractId} onValueChange={setActiveContractId}>
            <TabsList className="mb-4">
              {contractTypes.map((contract) => (
                <TabsTrigger key={contract.id} value={contract.id}>
                  {contract.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {contractTypes.map((contract) => (
              <TabsContent key={contract.id} value={contract.id}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Maintenance Intervals</h3>
                    <p className="text-muted-foreground mb-4">Schedule of services based on mileage with specific checklist items</p>
                    
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mileage</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Checklist Items</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contract.maintenanceIntervals.map((interval) => (
                            <React.Fragment key={interval.id}>
                              <TableRow>
                                <TableCell>{interval.mileage} miles</TableCell>
                                <TableCell>{interval.description}</TableCell>
                                <TableCell>{interval.checklistItems.length} items</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => toggleInterval(interval.id)}
                                    >
                                      {expandedIntervals[interval.id] ? 
                                        <ChevronDown className="h-4 w-4" /> : 
                                        <ChevronRight className="h-4 w-4" />}
                                      <span className="ml-2">Details</span>
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleEditInterval(interval)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              {expandedIntervals[interval.id] && (
                                <TableRow>
                                  <TableCell colSpan={4} className="bg-muted/30 p-0">
                                    <div className="p-4">
                                      <div className="mb-4">
                                        <h4 className="text-md font-medium mb-2">Checklist Items for {interval.mileage} miles</h4>
                                        <div className="border rounded-md">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Item Name</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Required</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {interval.checklistItems.map((item) => (
                                                <TableRow key={item.id}>
                                                  <TableCell>{item.name}</TableCell>
                                                  <TableCell>{item.category}</TableCell>
                                                  <TableCell>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                      item.type === 'N' ? 'bg-blue-100 text-blue-800' :
                                                      item.type === 'V' ? 'bg-green-100 text-green-800' :
                                                      'bg-red-100 text-red-800'
                                                    }`}>
                                                      {item.type}
                                                    </span>
                                                  </TableCell>
                                                  <TableCell>{item.required ? "Yes" : "No"}</TableCell>
                                                  <TableCell className="text-right">
                                                    <Button 
                                                      variant="ghost" 
                                                      size="sm"
                                                      onClick={() => handleEditChecklistItem(interval.id, item)}
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </div>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="mt-2"
                                          onClick={() => handleAddChecklistItem(interval.id)}
                                        >
                                          <Plus className="mr-2 h-4 w-4" /> Add Checklist Item
                                        </Button>
                                      </div>

                                      <div className="mb-4">
                                        <h4 className="text-md font-medium mb-2">Parts to Replace</h4>
                                        <div className="border rounded-md">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Part Name</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Labor Hours</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {interval.partReplacements.map((part) => (
                                                <TableRow key={part.id}>
                                                  <TableCell>{part.partName}</TableCell>
                                                  <TableCell>{part.quantity}</TableCell>
                                                  <TableCell>{part.labor} hrs</TableCell>
                                                  <TableCell className="text-right">
                                                    <Button 
                                                      variant="ghost" 
                                                      size="sm"
                                                      onClick={() => handleEditPart(interval.id, part)}
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </div>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="mt-2"
                                          onClick={() => handleAddPart(interval.id)}
                                        >
                                          <Plus className="mr-2 h-4 w-4" /> Add Part
                                        </Button>
                                      </div>
                                      
                                      <div>
                                        <h4 className="text-md font-medium mb-2">Services to Perform</h4>
                                        <div className="border rounded-md">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Service Name</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Duration (hrs)</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {interval.services.map((service) => (
                                                <TableRow key={service.id}>
                                                  <TableCell>{service.name}</TableCell>
                                                  <TableCell>{service.description}</TableCell>
                                                  <TableCell>{service.duration} hrs</TableCell>
                                                  <TableCell className="text-right">
                                                    <Button 
                                                      variant="ghost" 
                                                      size="sm"
                                                      onClick={() => handleEditService(interval.id, service)}
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </div>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="mt-2"
                                          onClick={() => handleAddService(interval.id)}
                                        >
                                          <Plus className="mr-2 h-4 w-4" /> Add Service
                                        </Button>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={handleAddMaintenanceInterval}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Maintenance Interval
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contract Type</DialogTitle>
            <DialogDescription>
              Create a new service contract type for customers.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...contractForm}>
            <form onSubmit={contractForm.handleSubmit(onCreateContractSubmit)} className="space-y-4">
              <FormField
                control={contractForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Contract Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={contractForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Contract Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={contractForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={contractForm.control}
                name="partsAllowance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parts Allowance (quantity)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Contract Type</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditContractDialogOpen} onOpenChange={setIsEditContractDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contract Type</DialogTitle>
            <DialogDescription>
              Update the details for this service contract type.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...contractForm}>
            <form onSubmit={contractForm.handleSubmit(onEditContractSubmit)} className="space-y-4">
              <FormField
                control={contractForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Contract Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={contractForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Contract Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={contractForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={contractForm.control}
                name="partsAllowance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parts Allowance (quantity)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditContractDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Contract Type</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isChecklistItemDialogOpen} onOpenChange={setIsChecklistItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingChecklistItemId ? "Edit Checklist Item" : "Add Checklist Item"}
            </DialogTitle>
            <DialogDescription>
              {editingChecklistItemId 
                ? "Update the details for this checklist item." 
                : "Add a new item to this maintenance interval's checklist."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...checklistItemForm}>
            <form onSubmit={checklistItemForm.handleSubmit(onChecklistItemSubmit)} className="space-y-4">
              <FormField
                control={checklistItemForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Item Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={checklistItemForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Safety">Safety</SelectItem>
                          <SelectItem value="Performance">Performance</SelectItem>
                          <SelectItem value="Fluids">Fluids</SelectItem>
                          <SelectItem value="Electrical">Electrical</SelectItem>
                          <SelectItem value="Engine">Engine</SelectItem>
                          <SelectItem value="Chassis">Chassis</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={checklistItemForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="V">V</SelectItem>
                          <SelectItem value="R">R</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={checklistItemForm.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Required</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsChecklistItemDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingChecklistItemId ? "Update Item" : "Add Item"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isMaintenanceIntervalDialogOpen} onOpenChange={setIsMaintenanceIntervalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingIntervalId ? "Edit Maintenance Interval" : "Add Maintenance Interval"}
            </DialogTitle>
            <DialogDescription>
              {editingIntervalId 
                ? "Update the details for this maintenance interval." 
                : "Add a new maintenance interval to the schedule."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...maintenanceIntervalForm}>
            <form onSubmit={maintenanceIntervalForm.handleSubmit(onMaintenanceIntervalSubmit)} className="space-y-4">
              <FormField
                control={maintenanceIntervalForm.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mileage</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Mileage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={maintenanceIntervalForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description of maintenance to be performed at this interval" 
                        className="min-h-20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsMaintenanceIntervalDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingIntervalId ? "Update Interval" : "Add Interval"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPartDialogOpen} onOpenChange={setIsPartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPartId ? "Edit Part Replacement" : "Add Part Replacement"}
            </DialogTitle>
            <DialogDescription>
              {editingPartId 
                ? "Update the details for this part replacement." 
                : "Add a new part to be replaced during this maintenance interval."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...partForm}>
            <form onSubmit={partForm.handleSubmit(onPartSubmit)} className="space-y-4">
              <FormField
                control={partForm.control}
                name="partName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Part Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Part Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={partForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="Quantity" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={partForm.control}
                name="labor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Labor Hours</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        placeholder="Labor Hours" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsPartDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPartId ? "Update Part" : "Add Part"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingServiceId ? "Edit Service" : "Add Service"}
            </DialogTitle>
            <DialogDescription>
              {editingServiceId 
                ? "Update the details for this service." 
                : "Add a new service to be performed during this maintenance interval."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...serviceForm}>
            <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="space-y-4">
              <FormField
                control={serviceForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Service Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={serviceForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description of the service" 
                        className="min-h-20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={serviceForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        placeholder="Duration" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingServiceId ? "Update Service" : "Add Service"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
