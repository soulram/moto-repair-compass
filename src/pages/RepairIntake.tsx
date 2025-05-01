import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  HelpCircle,
  Camera,
  ClipboardCheck
} from "lucide-react";
import { Customer, Motorcycle, ChecklistStatus, ChecklistItem } from "@/types";
import { CustomerChecklist } from "@/components/repair/CustomerChecklist";
import { toast } from "sonner";

export default function RepairIntake() {
  // Mock data - would come from an API in a real application
  const mockCustomers: Customer[] = [
    {
      id: "1",
      firstName: "James",
      lastName: "Wilson",
      email: "james.wilson@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Springfield",
      contractType: "premium",
      motorcycles: [
        {
          id: "m1",
          customerId: "1",
          make: "Honda",
          model: "CBR600",
          year: 2020,
          vinNumber: "JH2PC37G9MC700100",
          licensePlate: "MCY-1234",
          color: "Red",
          currentMileage: 8500,
          lastServiceDate: "2023-02-15",
          lastServiceMileage: 7500,
          nextServiceMileage: 10000,
          warrantyExpiryDate: "2024-06-15",
          notes: "Regular service customer"
        }
      ],
      createdAt: "2022-05-10T14:30:00.000Z",
      updatedAt: "2023-07-18T09:45:00.000Z"
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Miller",
      email: "sarah.miller@example.com",
      phone: "(555) 234-5678",
      address: "456 Elm St, Riverside",
      contractType: "basic",
      motorcycles: [
        {
          id: "m2",
          customerId: "2",
          make: "BMW",
          model: "R1200GS",
          year: 2019,
          vinNumber: "WB10408C5JZ123456",
          licensePlate: "ADV-5678",
          color: "Black",
          currentMileage: 12500,
          lastServiceDate: "2023-03-20",
          lastServiceMileage: 10000,
          nextServiceMileage: 15000,
          warrantyExpiryDate: "2023-10-30",
          notes: "Prefers weekend appointments"
        }
      ],
      createdAt: "2021-11-22T10:15:00.000Z",
      updatedAt: "2023-06-05T14:20:00.000Z"
    }
  ];

  // Checklist categories and items
  const checklistCategories = [
    {
      name: "Engine & Transmission",
      items: [
        { id: "e1", name: "Engine oil level", category: "engine" },
        { id: "e2", name: "Engine oil condition", category: "engine" },
        { id: "e3", name: "Coolant level and condition", category: "engine" },
        { id: "e4", name: "Transmission oil level", category: "engine" },
        { id: "e5", name: "Engine mounts", category: "engine" }
      ]
    },
    {
      name: "Brakes & Suspension",
      items: [
        { id: "b1", name: "Front brake pads", category: "brakes" },
        { id: "b2", name: "Rear brake pads", category: "brakes" },
        { id: "b3", name: "Brake fluid level", category: "brakes" },
        { id: "b4", name: "Front fork condition", category: "suspension" },
        { id: "b5", name: "Rear shock condition", category: "suspension" }
      ]
    },
    {
      name: "Electrical & Lighting",
      items: [
        { id: "l1", name: "Headlight operation", category: "electrical" },
        { id: "l2", name: "Tail light operation", category: "electrical" },
        { id: "l3", name: "Turn signals", category: "electrical" },
        { id: "l4", name: "Battery condition", category: "electrical" },
        { id: "l5", name: "Charging system", category: "electrical" }
      ]
    },
    {
      name: "Tires & Wheels",
      items: [
        { id: "t1", name: "Front tire tread", category: "tires" },
        { id: "t2", name: "Rear tire tread", category: "tires" },
        { id: "t3", name: "Tire pressure", category: "tires" },
        { id: "t4", name: "Wheel bearings", category: "wheels" },
        { id: "t5", name: "Wheel alignment", category: "wheels" }
      ]
    }
  ];

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const [mileage, setMileage] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("customer");
  
  // State for checklist items
  const [checklistData, setChecklistData] = useState<ChecklistItem[]>([]);
  
  // Customer confirmation states
  const [showCustomerChecklist, setShowCustomerChecklist] = useState(false);
  const [customerConfirmed, setCustomerConfirmed] = useState(false);
  const [customerComments, setCustomerComments] = useState("");

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    if (customer.motorcycles.length === 1) {
      setSelectedMotorcycle(customer.motorcycles[0]);
    } else {
      setSelectedMotorcycle(null);
    }
    setSearchQuery("");
    setActiveTab("motorcycle");
  };

  const handleMotorcycleSelect = (motorcycle: Motorcycle) => {
    setSelectedMotorcycle(motorcycle);
    setActiveTab("intake");
  };

  const initializeChecklist = () => {
    const initialChecklist: ChecklistItem[] = [];
    
    checklistCategories.forEach(category => {
      category.items.forEach(item => {
        initialChecklist.push({
          id: item.id,
          name: item.name,
          category: item.category,
          status: "not-checked",
          notes: "",
          requiresAttention: false
        });
      });
    });
    
    setChecklistData(initialChecklist);
    setActiveTab("checklist");
  };

  const handleChecklistItemChange = (itemId: string, status: ChecklistStatus, notes: string = "") => {
    setChecklistData(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status, 
              notes,
              requiresAttention: status === "monitor" || status === "replace"
            } 
          : item
      )
    );
  };

  const getStatusIcon = (status: ChecklistStatus) => {
    switch (status) {
      case "ok":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "monitor":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "replace":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "not-checked":
      default:
        return <HelpCircle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusClass = (status: ChecklistStatus) => {
    switch (status) {
      case "ok":
        return "border-green-200 bg-green-50";
      case "monitor":
        return "border-yellow-200 bg-yellow-50";
      case "replace":
        return "border-red-200 bg-red-50";
      case "not-checked":
      default:
        return "border-gray-200";
    }
  };

  const handleCustomerConfirmation = (comments: string) => {
    setCustomerComments(comments);
    setCustomerConfirmed(true);
    setShowCustomerChecklist(false);
    toast.success("Customer has confirmed the pre-repair checklist");
  };

  const completeIntakeAndGenerateQuote = () => {
    if (!customerConfirmed) {
      setShowCustomerChecklist(true);
    } else {
      // Here you would handle the final submission logic
      toast.success("Repair intake completed and quote generated!");
      // Ideally redirect to the quote view or next step in the process
    }
  };

  const issuesFound = checklistData.filter(item => item.requiresAttention).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repair Intake</h1>
          <p className="text-muted-foreground">
            Create a new repair order with comprehensive vehicle inspection
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Repair Order</CardTitle>
          <CardDescription>
            Enter customer and motorcycle details to start a new repair order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="motorcycle" disabled={!selectedCustomer}>Motorcycle</TabsTrigger>
              <TabsTrigger value="intake" disabled={!selectedMotorcycle}>Intake Info</TabsTrigger>
              <TabsTrigger value="checklist" disabled={!selectedMotorcycle || activeTab !== "checklist"}>Checklist</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerSearch">Search Customer</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="customerSearch"
                      placeholder="Search by name, email or phone..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {searchQuery && (
                  <div className="border rounded-md max-h-60 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-3 border-b flex items-center justify-between cursor-pointer hover:bg-gray-50"
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <div>
                            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">{customer.contractType}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <p>No customers found</p>
                        <Button className="mt-2" variant="outline">
                          <Plus className="mr-2 h-4 w-4" /> Add New Customer
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedCustomer && (
                  <div className="mt-4 p-4 border rounded-md bg-blue-50">
                    <p className="font-medium">Selected Customer:</p>
                    <p>{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                    <p className="text-sm">{selectedCustomer.email} | {selectedCustomer.phone}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button disabled={!selectedCustomer} onClick={() => setActiveTab("motorcycle")}>
                    Next: Select Motorcycle
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="motorcycle">
              <div className="space-y-4">
                {selectedCustomer?.motorcycles.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="mb-4">No motorcycles found for this customer</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add New Motorcycle
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Label>Select a Motorcycle</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {selectedCustomer?.motorcycles.map((motorcycle) => (
                        <div
                          key={motorcycle.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedMotorcycle?.id === motorcycle.id
                              ? "border-shop-blue-500 bg-shop-blue-50"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleMotorcycleSelect(motorcycle)}
                        >
                          <h3 className="font-medium text-lg">
                            {motorcycle.year} {motorcycle.make} {motorcycle.model}
                          </h3>
                          <p className="text-muted-foreground">
                            License: {motorcycle.licensePlate}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
                            <div>
                              <span className="text-muted-foreground">VIN: </span>
                              {motorcycle.vinNumber}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Color: </span>
                              {motorcycle.color}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Current Mileage: </span>
                              {motorcycle.currentMileage}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Last Service: </span>
                              {new Date(motorcycle.lastServiceDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setActiveTab("customer")}>
                    Back
                  </Button>
                  <Button disabled={!selectedMotorcycle} onClick={() => setActiveTab("intake")}>
                    Next: Intake Information
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="intake">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentMileage">Current Mileage</Label>
                    <Input
                      id="currentMileage"
                      type="number"
                      placeholder="Enter current mileage"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="repairType">Repair Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select repair type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular Maintenance</SelectItem>
                        <SelectItem value="repair">Repair Service</SelectItem>
                        <SelectItem value="diagnostic">Diagnostic</SelectItem>
                        <SelectItem value="warranty">Warranty Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerNotes">Customer Reported Issues</Label>
                  <Textarea
                    id="customerNotes"
                    placeholder="Enter any issues reported by the customer"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex justify-between space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setActiveTab("motorcycle")}>
                    Back
                  </Button>
                  <Button
                    onClick={initializeChecklist}
                    disabled={!mileage}
                  >
                    Next: Start Inspection
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="checklist">
              <div className="space-y-6">
                {checklistCategories.map((category) => (
                  <Accordion key={category.name} type="single" collapsible className="border rounded-md">
                    <AccordionItem value={category.name}>
                      <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent className="px-0">
                        <div className="divide-y">
                          {category.items.map((item) => {
                            const checklistItem = checklistData.find((i) => i.id === item.id);
                            const status = checklistItem?.status || "not-checked";
                            
                            return (
                              <div 
                                key={item.id} 
                                className={`checklist-item transition-colors ${getStatusClass(status)}`}
                              >
                                <div className="flex-1">
                                  <div className="font-medium">{item.name}</div>
                                  {checklistItem?.notes && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                      Note: {checklistItem.notes}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant={status === "ok" ? "default" : "outline"} 
                                    size="sm"
                                    className={status === "ok" ? "bg-green-500 hover:bg-green-600" : ""}
                                    onClick={() => handleChecklistItemChange(item.id, "ok")}
                                  >
                                    OK
                                  </Button>
                                  
                                  <Button 
                                    variant={status === "monitor" ? "default" : "outline"} 
                                    size="sm"
                                    className={status === "monitor" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                    onClick={() => {
                                      const notes = prompt("Add notes about this item:");
                                      if (notes !== null) {
                                        handleChecklistItemChange(item.id, "monitor", notes);
                                      }
                                    }}
                                  >
                                    Monitor
                                  </Button>
                                  
                                  <Button 
                                    variant={status === "replace" ? "default" : "outline"} 
                                    size="sm"
                                    className={status === "replace" ? "bg-red-500 hover:bg-red-600" : ""}
                                    onClick={() => {
                                      const notes = prompt("Add notes about this item:");
                                      if (notes !== null) {
                                        handleChecklistItemChange(item.id, "replace", notes);
                                      }
                                    }}
                                  >
                                    Replace
                                  </Button>
                                  
                                  <Button variant="ghost" size="sm">
                                    <Camera className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
                
                <div className="p-4 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Inspection Summary</p>
                      <p className="text-sm text-muted-foreground">
                        {checklistData.filter(item => item.status !== "not-checked").length} of {checklistData.length} items checked
                      </p>
                    </div>
                    <div className="text-right">
                      {issuesFound > 0 ? (
                        <div>
                          <p className="text-red-500 font-medium">{issuesFound} issues found</p>
                          <p className="text-sm text-muted-foreground">
                            {checklistData.filter(item => item.status === "replace").length} items need replacement
                          </p>
                        </div>
                      ) : (
                        <p className="text-green-500 font-medium">No issues found</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {customerConfirmed && (
                  <div className="p-4 border rounded-md bg-green-50 flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-700">Customer has confirmed the checklist</p>
                      {customerComments && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Comments: {customerComments}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between space-x-2">
                  <Button variant="outline" onClick={() => setActiveTab("intake")}>
                    Back
                  </Button>
                  <Button onClick={completeIntakeAndGenerateQuote}>
                    {customerConfirmed 
                      ? "Complete Intake & Generate Quote" 
                      : "Get Customer Confirmation & Complete"
                    }
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Customer pre-repair checklist confirmation dialog */}
      <CustomerChecklist
        isOpen={showCustomerChecklist}
        onClose={() => setShowCustomerChecklist(false)}
        onConfirm={handleCustomerConfirmation}
      />
    </div>
  );
}
