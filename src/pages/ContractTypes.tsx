
import { useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Edit, Trash, ChevronDown, ChevronRight } from "lucide-react";

interface ContractType {
  id: string;
  name: string;
  description: string;
  price: number;
  checklistItems: ChecklistItem[];
  maintenanceIntervals: MaintenanceInterval[];
}

interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  required: boolean;
}

interface MaintenanceInterval {
  id: string;
  mileage: number;
  description: string;
  partReplacements: PartReplacement[];
  services: ServiceItem[];
}

interface PartReplacement {
  id: string;
  partName: string;
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
      checklistItems: [
        { id: "c1", name: "Brake inspection", category: "Safety", required: true },
        { id: "c2", name: "Tire pressure check", category: "Safety", required: true },
        { id: "c3", name: "Oil level check", category: "Fluids", required: true },
      ],
      maintenanceIntervals: [
        {
          id: "m1",
          mileage: 3000,
          description: "Oil change service",
          partReplacements: [
            { id: "p1", partName: "Oil filter", labor: 0.5 },
            { id: "p2", partName: "Engine oil", labor: 0.5 },
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
          partReplacements: [
            { id: "p3", partName: "Spark plugs", labor: 1.0 },
            { id: "p4", partName: "Air filter", labor: 0.5 },
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
      checklistItems: [
        { id: "c4", name: "Full brake system inspection", category: "Safety", required: true },
        { id: "c5", name: "Tire and wheel inspection", category: "Safety", required: true },
        { id: "c6", name: "Complete fluid level check", category: "Fluids", required: true },
        { id: "c7", name: "Battery test", category: "Electrical", required: true },
      ],
      maintenanceIntervals: [
        {
          id: "m3",
          mileage: 3000,
          description: "Premium oil service",
          partReplacements: [
            { id: "p5", partName: "Premium oil filter", labor: 0.5 },
            { id: "p6", partName: "Synthetic engine oil", labor: 0.5 },
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
          partReplacements: [
            { id: "p7", partName: "Iridium spark plugs", labor: 1.0 },
            { id: "p8", partName: "Premium air filter", labor: 0.5 },
            { id: "p9", partName: "Fuel filter", labor: 1.0 },
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
  const [expandedIntervals, setExpandedIntervals] = useState<Record<string, boolean>>({});

  const toggleInterval = (intervalId: string) => {
    setExpandedIntervals(prev => ({
      ...prev,
      [intervalId]: !prev[intervalId]
    }));
  };

  const formSchema = z.object({
    name: z.string().min(1, "Contract name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(0, "Price must be positive")
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // In a real app, this would call an API to create a contract type
    const newContractType: ContractType = {
      id: `${contractTypes.length + 1}`,
      name: data.name,
      description: data.description,
      price: data.price,
      checklistItems: [],
      maintenanceIntervals: []
    };
    
    setContractTypes([...contractTypes, newContractType]);
    setIsCreateDialogOpen(false);
    form.reset();
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
                <TableHead>Checklist Items</TableHead>
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
                  <TableCell>{contract.checklistItems.length} items</TableCell>
                  <TableCell>{contract.maintenanceIntervals.length} intervals</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
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
          <Tabs defaultValue="1">
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
                    <h3 className="text-lg font-medium">Checklist Items</h3>
                    <p className="text-muted-foreground mb-4">Items to be checked during each service</p>
                    
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Required</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contract.checklistItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.required ? "Yes" : "No"}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <Button variant="outline" size="sm" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Add Checklist Item
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Maintenance Intervals</h3>
                    <p className="text-muted-foreground mb-4">Schedule of services based on mileage</p>
                    
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mileage</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contract.maintenanceIntervals.map((interval) => (
                            <React.Fragment key={interval.id}>
                              <TableRow>
                                <TableCell>{interval.mileage} miles</TableCell>
                                <TableCell>{interval.description}</TableCell>
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
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              {expandedIntervals[interval.id] && (
                                <TableRow>
                                  <TableCell colSpan={3} className="bg-muted/30 p-0">
                                    <div className="p-4">
                                      <div className="mb-4">
                                        <h4 className="text-md font-medium mb-2">Parts to Replace</h4>
                                        <div className="border rounded-md">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Part Name</TableHead>
                                                <TableHead>Labor Hours</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {interval.partReplacements.map((part) => (
                                                <TableRow key={part.id}>
                                                  <TableCell>{part.partName}</TableCell>
                                                  <TableCell>{part.labor} hrs</TableCell>
                                                  <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </div>
                                        <Button variant="outline" size="sm" className="mt-2">
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
                                                    <Button variant="ghost" size="sm">
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </div>
                                        <Button variant="outline" size="sm" className="mt-2">
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
                    
                    <Button variant="outline" size="sm" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Add Maintenance Interval
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Contract Type Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contract Type</DialogTitle>
            <DialogDescription>
              Create a new service contract type for customers.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
    </div>
  );
}
