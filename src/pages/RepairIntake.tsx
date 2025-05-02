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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
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
  ClipboardCheck,
  FileText,
  ListChecks,
  CheckSquare
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
      icon: <CheckSquare className="h-5 w-5 text-blue-500" />,
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
      icon: <CheckSquare className="h-5 w-5 text-red-500" />,
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
      icon: <CheckSquare className="h-5 w-5 text-yellow-500" />,
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
      icon: <CheckSquare className="h-5 w-5 text-green-500" />,
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

  const getCategoryProgressPercentage = (categoryName: string) => {
    const categoryItems = checklistCategories
      .find(cat => cat.name === categoryName)?.items || [];
    
    if (categoryItems.length === 0) return 0;
    
    const checkedItems = checklistData.filter(
      item => categoryItems.some(catItem => catItem.id === item.id) && 
      item.status !== "not-checked"
    ).length;
    
    return Math.round((checkedItems / categoryItems.length) * 100);
  };

  const getTotalProgress = () => {
    if (checklistData.length === 0) return 0;
    const checkedItems = checklistData.filter(item => item.status !== "not-checked").length;
    return Math.round((checkedItems / checklistData.length) * 100);
  };

  // Function to handle adding notes for a checklist item
  const handleAddNotes = (itemId: string, currentStatus: ChecklistStatus) => {
    // Find the current item to show existing notes if any
    const currentItem = checklistData.find(item => item.id === itemId);
    const currentNotes = currentItem?.notes || "";
    
    // Get new notes from user
    const notes = prompt("Add notes about this item:", currentNotes);
    
    if (notes !== null) {
      handleChecklistItemChange(itemId, currentStatus, notes);
    }
  };

  // Function to capture mock photo (would be replaced with camera functionality)
  const handleCapturePhoto = (itemId: string) => {
    toast.info("Camera functionality would open here", {
      description: "In a real app, this would open the device camera."
    });
  };

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
                {/* Total progress indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ListChecks className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Inspection Progress</h3>
                    </div>
                    <span className="text-sm font-medium">{getTotalProgress()}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                      style={{ width: `${getTotalProgress()}%` }}
                    ></div>
                  </div>
                </div>

                {checklistCategories.map((category) => (
                  <Accordion key={category.name} type="single" collapsible className="border rounded-md shadow-sm">
                    <AccordionItem value={category.name}>
                      <AccordionTrigger className="px-4 py-3 hover:bg-blue-50 group">
                        <div className="flex items-center gap-3 flex-1">
                          {category.icon}
                          <span>{category.name}</span>
                          <div className="ml-auto flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out" 
                                style={{ width: `${getCategoryProgressPercentage(category.name)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 min-w-[3rem] text-right">
                              {getCategoryProgressPercentage(category.name)}%
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 py-1">
                        <div className="divide-y">
                          {category.items.map((item) => {
                            const checklistItem = checklistData.find((i) => i.id === item.id);
                            const status = checklistItem?.status || "not-checked";
                            
                            return (
                              <div 
                                key={item.id} 
                                className={`p-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 transition-colors ${getStatusClass(status)}`}
                              >
                                <div className="flex items-start gap-3">
                                  {getStatusIcon(status)}
                                  <div>
                                    <div className="font-medium">{item.name}</div>
                                    {checklistItem?.notes && (
                                      <div className="text-sm text-muted-foreground mt-1 bg-white bg-opacity-50 p-2 rounded border border-gray-100">
                                        {checklistItem.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-2">
                                  <RadioGroup 
                                    value={status} 
                                    onValueChange={(value) => handleChecklistItemChange(
                                      item.id, 
                                      value as ChecklistStatus, 
                                      checklistItem?.notes || ""
                                    )}
                                    className="flex items-center space-x-2"
                                  >
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem value="ok" id={`${item.id}-ok`} />
                                      <Label 
                                        htmlFor={`${item.id}-ok`}
                                        className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md cursor-pointer"
                                      >
                                        OK
                                      </Label>
                                    </div>
                                    
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem value="monitor" id={`${item.id}-monitor`} />
                                      <Label 
                                        htmlFor={`${item.id}-monitor`}
                                        className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md cursor-pointer"
                                      >
                                        Monitor
                                      </Label>
                                    </div>
                                    
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem value="replace" id={`${item.id}-replace`} />
                                      <Label 
                                        htmlFor={`${item.id}-replace`}
                                        className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-md cursor-pointer"
                                      >
                                        Replace
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                  
                                  <div className="flex items-center space-x-2 ml-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleAddNotes(item.id, status)}
                                    >
                                      <FileText className="h-4 w-4" />
                                      <span className="sr-only">Add notes</span>
                                    </Button>
                                    
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleCapturePhoto(item.id)}
                                    >
                                      <Camera className="h-4 w-4" />
                                      <span className="sr-only">Take photo</span>
                                    </Button>
                                  </div>
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
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-blue-500" />
                        <p className="font-medium">Inspection Summary</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {checklistData.filter(item => item.status !== "not-checked").length} of {checklistData.length} items checked
                      </p>
                    </div>
                    <div className="text-right">
                      {issuesFound > 0 ? (
                        <div className="bg-red-50 border border-red-100 rounded-md p-3">
                          <p className="text-red-600 font-medium flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            {issuesFound} {issuesFound === 1 ? 'issue' : 'issues'} found
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {checklistData.filter(item => item.status === "replace").length} {checklistData.filter(item => item.status === "replace").length === 1 ? 'item' : 'items'} need replacement
                          </p>
                        </div>
                      ) : (
                        checklistData.filter(item => item.status !== "not-checked").length > 0 && (
                          <div className="bg-green-50 border border-green-100 rounded-md p-3">
                            <p className="text-green-600 font-medium flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5" />
                              No issues found
                            </p>
                          </div>
                        )
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
                
                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                  <div className="order-2 sm:order-1">
                    <Button variant="outline" onClick={() => setActiveTab("intake")}>
                      Back to Intake Information
                    </Button>
                  </div>
                  <div className="order-1 sm:order-2">
                    <Button 
                      onClick={completeIntakeAndGenerateQuote}
                      className={`w-full sm:w-auto ${getTotalProgress() < 100 ? 'bg-blue-500' : 'bg-green-500'}`}
                      disabled={getTotalProgress() === 0}
                    >
                      {customerConfirmed 
                        ? "Complete Intake & Generate Quote" 
                        : "Get Customer Confirmation & Complete"
                      }
                    </Button>
                  </div>
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
