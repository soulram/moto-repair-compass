import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Customer, Motorcycle, ChecklistStatus, ChecklistItem } from "@/types";
import { CustomerChecklist } from "@/components/repair/CustomerChecklist";
import { CustomerSelectionTab } from "@/components/repair/CustomerSelectionTab";
import { MotorcycleSelectionTab } from "@/components/repair/MotorcycleSelectionTab";
import { IntakeInfoTab } from "@/components/repair/IntakeInfoTab";
import { ChecklistTab } from "@/components/repair/ChecklistTab";
import { toast } from "sonner";
import { CheckSquare, Plus } from "lucide-react";

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

  const startNewRepairIntake = () => {
    // Reset all form state to start fresh
    setSelectedCustomer(null);
    setSelectedMotorcycle(null);
    setMileage("");
    setCustomerNotes("");
    setSearchQuery("");
    setActiveTab("customer");
    setChecklistData([]);
    setShowCustomerChecklist(false);
    setCustomerConfirmed(false);
    setCustomerComments("");
    
    toast.success("Started new repair intake");
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
        <Button onClick={startNewRepairIntake} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Repair Intake
        </Button>
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
              <TabsTrigger value="checklist" disabled={!selectedMotorcycle || !mileage}>Checklist</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer">
              <CustomerSelectionTab 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredCustomers={filteredCustomers}
                selectedCustomer={selectedCustomer}
                handleCustomerSelect={handleCustomerSelect}
                onNext={() => setActiveTab("motorcycle")}
              />
            </TabsContent>
            
            <TabsContent value="motorcycle">
              <MotorcycleSelectionTab 
                selectedCustomer={selectedCustomer}
                selectedMotorcycle={selectedMotorcycle}
                handleMotorcycleSelect={handleMotorcycleSelect}
                onBack={() => setActiveTab("customer")}
                onNext={() => setActiveTab("intake")}
              />
            </TabsContent>
            
            <TabsContent value="intake">
              <IntakeInfoTab 
                mileage={mileage}
                setMileage={setMileage}
                customerNotes={customerNotes}
                setCustomerNotes={setCustomerNotes}
                customerContractType={selectedCustomer?.contractType}
                onBack={() => setActiveTab("motorcycle")}
                onNext={initializeChecklist}
              />
            </TabsContent>
            
            <TabsContent value="checklist">
              <ChecklistTab 
                checklistCategories={checklistCategories}
                checklistData={checklistData}
                onStatusChange={handleChecklistItemChange}
                onBack={() => setActiveTab("intake")}
                getTotalProgress={getTotalProgress}
                getCategoryProgressPercentage={getCategoryProgressPercentage}
                customerConfirmed={customerConfirmed}
                customerComments={customerComments}
                handleAddNotes={handleAddNotes}
                handleCapturePhoto={handleCapturePhoto}
                completeIntakeAndGenerateQuote={completeIntakeAndGenerateQuote}
              />
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
