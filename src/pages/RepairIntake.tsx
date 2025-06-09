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

  // Contract-based checklist items for different mileages
  const contractChecklists = {
    5000: [
      { id: "c1", name: "Engine oil level", category: "engine", type: "V" as const },
      { id: "c2", name: "Engine oil condition", category: "engine", type: "V" as const },
      { id: "c3", name: "Basic visual inspection", category: "general", type: "V" as const }
    ],
    10000: [
      { id: "c1", name: "Engine oil level", category: "engine", type: "V" as const },
      { id: "c2", name: "Engine oil condition", category: "engine", type: "V" as const },
      { id: "c4", name: "Air filter replacement", category: "engine", type: "R" as const },
      { id: "c5", name: "Brake inspection", category: "brakes", type: "V" as const }
    ],
    15000: [
      { id: "c1", name: "Engine oil level", category: "engine", type: "V" as const },
      { id: "c2", name: "Engine oil condition", category: "engine", type: "V" as const },
      { id: "c6", name: "Brake fluid replacement", category: "brakes", type: "R" as const },
      { id: "c7", name: "Chain adjustment", category: "transmission", type: "V" as const }
    ],
    20000: [
      { id: "c1", name: "Engine oil level", category: "engine", type: "V" as const },
      { id: "c2", name: "Engine oil condition", category: "engine", type: "V" as const },
      { id: "c8", name: "Valve adjustment", category: "engine", type: "V" as const },
      { id: "c9", name: "Coolant replacement", category: "engine", type: "R" as const },
      { id: "c10", name: "Spark plugs", category: "engine", type: "R" as const }
    ]
  };

  // Complete checklist for non-contract vehicles
  const completeChecklistCategories = [
    {
      name: "Engine & Transmission",
      icon: <CheckSquare className="h-5 w-5 text-blue-500" />,
      items: [
        { id: "e1", name: "Engine oil level", category: "engine", type: "V" as const },
        { id: "e2", name: "Engine oil condition", category: "engine", type: "V" as const },
        { id: "e3", name: "Coolant level and condition", category: "engine", type: "V" as const },
        { id: "e4", name: "Transmission oil level", category: "engine", type: "V" as const },
        { id: "e5", name: "Engine mounts", category: "engine", type: "V" as const },
        { id: "e6", name: "Air filter condition", category: "engine", type: "V" as const },
        { id: "e7", name: "Spark plugs condition", category: "engine", type: "V" as const }
      ]
    },
    {
      name: "Brakes & Suspension",
      icon: <CheckSquare className="h-5 w-5 text-red-500" />,
      items: [
        { id: "b1", name: "Front brake pads", category: "brakes", type: "V" as const },
        { id: "b2", name: "Rear brake pads", category: "brakes", type: "V" as const },
        { id: "b3", name: "Brake fluid level", category: "brakes", type: "V" as const },
        { id: "b4", name: "Front fork condition", category: "suspension", type: "V" as const },
        { id: "b5", name: "Rear shock condition", category: "suspension", type: "V" as const },
        { id: "b6", name: "Brake lines inspection", category: "brakes", type: "V" as const }
      ]
    },
    {
      name: "Electrical & Lighting",
      icon: <CheckSquare className="h-5 w-5 text-yellow-500" />,
      items: [
        { id: "l1", name: "Headlight operation", category: "electrical", type: "V" as const },
        { id: "l2", name: "Tail light operation", category: "electrical", type: "V" as const },
        { id: "l3", name: "Turn signals", category: "electrical", type: "V" as const },
        { id: "l4", name: "Battery condition", category: "electrical", type: "V" as const },
        { id: "l5", name: "Charging system", category: "electrical", type: "V" as const },
        { id: "l6", name: "Wiring harness inspection", category: "electrical", type: "V" as const }
      ]
    },
    {
      name: "Tires & Wheels",
      icon: <CheckSquare className="h-5 w-5 text-green-500" />,
      items: [
        { id: "t1", name: "Front tire tread", category: "tires", type: "V" as const },
        { id: "t2", name: "Rear tire tread", category: "tires", type: "V" as const },
        { id: "t3", name: "Tire pressure", category: "tires", type: "V" as const },
        { id: "t4", name: "Wheel bearings", category: "wheels", type: "V" as const },
        { id: "t5", name: "Wheel alignment", category: "wheels", type: "V" as const },
        { id: "t6", name: "Rim condition", category: "wheels", type: "V" as const }
      ]
    }
  ];

  // State for checklist items
  const [checklistData, setChecklistData] = useState<ChecklistItem[]>([]);
  
  // Customer confirmation states
  const [showCustomerChecklist, setShowCustomerChecklist] = useState(false);
  const [customerConfirmed, setCustomerConfirmed] = useState(false);
  const [customerComments, setCustomerComments] = useState("");

  // Add state for contract status
  const [hasContract, setHasContract] = useState(false);
  const [currentChecklistCategories, setCurrentChecklistCategories] = useState(completeChecklistCategories);

  // Filtered customers based on search query
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

  const handleFrameNumberSearch = () => {
    if (!frameNumber.trim()) {
      toast.error("Please enter a frame number");
      return;
    }

    // Search for motorcycle by frame number
    const foundMotorcycle = mockCustomers
      .flatMap(customer => customer.motorcycles)
      .find(motorcycle => motorcycle.vinNumber.toLowerCase() === frameNumber.toLowerCase());

    if (foundMotorcycle) {
      // Find the customer who owns this motorcycle
      const customer = mockCustomers.find(c => c.motorcycles.some(m => m.id === foundMotorcycle.id));
      
      if (customer) {
        setSelectedCustomer(customer);
        setSelectedMotorcycle(foundMotorcycle);
        setMileage(foundMotorcycle.currentMileage.toString());
        
        // Check if customer has a contract (not 'none')
        const contractExists = customer.contractType !== 'none';
        setHasContract(contractExists);
        
        toast.success(`Found motorcycle: ${foundMotorcycle.make} ${foundMotorcycle.model}`);
        setActiveTab("intake");
      }
    } else {
      toast.error("Frame number not found in the database");
    }
  };

  const getContractChecklistForMileage = (mileage: number) => {
    // Find the appropriate checklist based on mileage
    const mileageIntervals = [5000, 10000, 15000, 20000];
    const applicableInterval = mileageIntervals
      .filter(interval => mileage >= interval)
      .sort((a, b) => b - a)[0]; // Get the highest applicable interval

    return contractChecklists[applicableInterval] || contractChecklists[5000];
  };

  const initializeChecklist = () => {
    const initialChecklist: ChecklistItem[] = [];
    
    if (hasContract && selectedCustomer?.contractType !== 'none') {
      // Use contract-specific checklist based on mileage
      const currentMileage = parseInt(mileage);
      const contractItems = getContractChecklistForMileage(currentMileage);
      
      contractItems.forEach(item => {
        initialChecklist.push({
          id: item.id,
          name: item.name,
          category: item.category,
          type: item.type,
          status: "not-checked",
          notes: "",
          requiresAttention: false
        });
      });

      // Create simplified categories for contract checklist
      const contractCategories = [
        {
          name: "Contract Maintenance Items",
          icon: <CheckSquare className="h-5 w-5 text-blue-500" />,
          items: contractItems
        }
      ];
      setCurrentChecklistCategories(contractCategories);
      
      toast.success(`Contract checklist loaded for ${currentMileage} km service`);
    } else {
      // Use complete checklist for non-contract vehicles
      completeChecklistCategories.forEach(category => {
        category.items.forEach(item => {
          initialChecklist.push({
            id: item.id,
            name: item.name,
            category: item.category,
            type: item.type,
            status: "not-checked",
            notes: "",
            requiresAttention: false
          });
        });
      });
      
      setCurrentChecklistCategories(completeChecklistCategories);
      toast.success("Complete inspection checklist loaded");
    }
    
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
    const categoryItems = currentChecklistCategories
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
    setFrameNumber("");
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
                frameNumber={frameNumber}
                setFrameNumber={setFrameNumber}
                onFrameNumberSearch={handleFrameNumberSearch}
                customerContractType={selectedCustomer?.contractType}
                hasContract={hasContract}
                onBack={() => setActiveTab("motorcycle")}
                onNext={initializeChecklist}
              />
            </TabsContent>
            
            <TabsContent value="checklist">
              <ChecklistTab 
                checklistCategories={currentChecklistCategories}
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
