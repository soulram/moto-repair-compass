
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Check,
  ArrowDownUp, 
  Edit, 
  Package, 
  Clipboard
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { Part, PartCategory } from "@/types";

export default function Inventory() {
  // Mock data for inventory parts
  const [parts, setParts] = useState<Part[]>([
    {
      id: "p1",
      partNumber: "OIL-1040-FG",
      name: "Full Synthetic Engine Oil 10W-40",
      description: "High-performance synthetic engine oil for motorcycles",
      category: "engine",
      price: 18.99,
      cost: 12.50,
      stockQuantity: 45,
      minimumStock: 10,
      supplierIds: ["s1", "s2"],
      location: "A-12-3",
      warrantyPeriod: 0,
      compatibleModels: ["Honda CBR", "Yamaha R6", "Suzuki GSXR"],
      isActive: true
    },
    {
      id: "p2",
      partNumber: "FIL-OIL-234",
      name: "Oil Filter",
      description: "Standard oil filter for most motorcycle models",
      category: "engine",
      price: 8.99,
      cost: 4.75,
      stockQuantity: 32,
      minimumStock: 15,
      supplierIds: ["s1"],
      location: "A-13-1",
      warrantyPeriod: 6,
      compatibleModels: ["Honda CBR", "Kawasaki Ninja", "Yamaha MT"],
      isActive: true
    },
    {
      id: "p3",
      partNumber: "BRK-PAD-MT07",
      name: "Brake Pads - Yamaha MT07",
      description: "Front brake pads for Yamaha MT-07",
      category: "brakes",
      price: 34.99,
      cost: 22.50,
      stockQuantity: 8,
      minimumStock: 10,
      supplierIds: ["s3"],
      location: "B-05-2",
      warrantyPeriod: 12,
      compatibleModels: ["Yamaha MT-07"],
      isActive: true
    },
    {
      id: "p4",
      partNumber: "SPARK-IRID-01",
      name: "Iridium Spark Plugs",
      description: "High-performance iridium spark plugs",
      category: "electrical",
      price: 14.99,
      cost: 9.25,
      stockQuantity: 50,
      minimumStock: 20,
      supplierIds: ["s2", "s4"],
      location: "C-02-1",
      warrantyPeriod: 12,
      compatibleModels: ["Multiple"],
      isActive: true
    },
    {
      id: "p5",
      partNumber: "TIRE-SPORT-190",
      name: "Sport Motorcycle Tire 190/55 ZR17",
      description: "Rear sport motorcycle tire",
      category: "other",
      price: 129.99,
      cost: 95.00,
      stockQuantity: 6,
      minimumStock: 4,
      supplierIds: ["s5"],
      location: "D-01-3",
      warrantyPeriod: 24,
      compatibleModels: ["Sport Models"],
      isActive: true
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [showAddPartDialog, setShowAddPartDialog] = useState(false);
  const [selectedInventoryTab, setSelectedInventoryTab] = useState("parts");

  // Low stock items
  const lowStockItems = parts.filter(part => part.stockQuantity <= part.minimumStock);

  // Function to filter parts
  const filteredParts = parts.filter(part => {
    // Search filter
    const matchesSearch = 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || part.category === categoryFilter;
    
    // Stock level filter
    const matchesStockLevel = stockFilter === "all" || 
      (stockFilter === "low" && part.stockQuantity <= part.minimumStock) ||
      (stockFilter === "in-stock" && part.stockQuantity > 0) ||
      (stockFilter === "out-of-stock" && part.stockQuantity === 0);
    
    return matchesSearch && matchesCategory && matchesStockLevel;
  });

  const formSchema = z.object({
    partNumber: z.string().min(1, "Part number is required"),
    name: z.string().min(1, "Part name is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    cost: z.coerce.number().min(0, "Cost must be positive"),
    stockQuantity: z.coerce.number().min(0, "Stock quantity must be positive"),
    minimumStock: z.coerce.number().min(0, "Minimum stock must be positive"),
    location: z.string().min(1, "Storage location is required"),
    warrantyPeriod: z.coerce.number().min(0, "Warranty period must be positive"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partNumber: "",
      name: "",
      description: "",
      category: "other",
      price: 0,
      cost: 0,
      stockQuantity: 0,
      minimumStock: 0,
      location: "",
      warrantyPeriod: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // In a real app, this would call an API to create a part
    const newPart: Part = {
      id: `p${parts.length + 1}`,
      partNumber: data.partNumber,
      name: data.name,
      description: data.description,
      category: data.category as PartCategory,
      price: data.price,
      cost: data.cost,
      stockQuantity: data.stockQuantity,
      minimumStock: data.minimumStock,
      supplierIds: [],
      location: data.location,
      warrantyPeriod: data.warrantyPeriod,
      compatibleModels: [],
      isActive: true
    };
    
    setParts([...parts, newPart]);
    setShowAddPartDialog(false);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track parts, supplies, and order inventory
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Clipboard className="mr-2 h-4 w-4" /> Generate Order
          </Button>
          <Button onClick={() => setShowAddPartDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Part
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Dashboard Stats */}
        <Card className="w-3/4">
          <CardHeader className="pb-2">
            <CardTitle>Inventory Overview</CardTitle>
            <CardDescription>
              Monitor stock levels and inventory status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Parts</div>
                <div className="text-2xl font-bold">{parts.length}</div>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground">Low Stock Items</div>
                <div className="text-2xl font-bold text-amber-600">{lowStockItems.length}</div>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground">Out of Stock</div>
                <div className="text-2xl font-bold text-destructive">{parts.filter(p => p.stockQuantity === 0).length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="w-1/4">
          <CardHeader className="bg-amber-50 pb-2">
            <div className="flex items-center">
              <AlertTriangle className="text-amber-500 mr-2" />
              <CardTitle>Low Stock Items</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="max-h-36 overflow-y-auto">
            <div className="space-y-2 py-2">
              {lowStockItems.length > 0 ? (
                lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-amber-600 font-semibold">{item.stockQuantity} left</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center text-sm text-green-600">
                  <Check className="mr-2 h-4 w-4" /> All items at healthy stock levels
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedInventoryTab} onValueChange={setSelectedInventoryTab}>
        <TabsList>
          <TabsTrigger value="parts">Parts Inventory</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Parts Inventory</CardTitle>
                  <CardDescription>
                    Manage your parts and stock levels
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search parts..."
                      className="pl-9 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select defaultValue="all" onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="engine">Engine</SelectItem>
                      <SelectItem value="brakes">Brakes</SelectItem>
                      <SelectItem value="suspension">Suspension</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="body">Body</SelectItem>
                      <SelectItem value="transmission">Transmission</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="all" onValueChange={setStockFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Stock" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock</SelectItem>
                      <SelectItem value="low">Low Stock</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center">
                        Part Number <ArrowDownUp className="ml-2 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Stock <ArrowDownUp className="ml-2 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParts.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell className="font-mono">{part.partNumber}</TableCell>
                      <TableCell className="font-medium">
                        {part.name}
                        <div className="text-xs text-muted-foreground">{part.description}</div>
                      </TableCell>
                      <TableCell>
                        {part.category.charAt(0).toUpperCase() + part.category.slice(1)}
                      </TableCell>
                      <TableCell>{part.location}</TableCell>
                      <TableCell>${part.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={part.stockQuantity <= part.minimumStock ? "text-amber-600 font-medium" : ""}>
                            {part.stockQuantity}
                          </span>
                          {part.stockQuantity <= part.minimumStock && (
                            <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {part.stockQuantity === 0 ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : part.stockQuantity <= part.minimumStock ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Package className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredParts.length} of {parts.length} parts
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>
                Track and manage your inventory orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Purchase orders management will be implemented in the next phase
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Suppliers</CardTitle>
              <CardDescription>
                Manage your parts suppliers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Supplier management will be implemented in the next phase
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Part Dialog */}
      <Dialog open={showAddPartDialog} onOpenChange={setShowAddPartDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Part</DialogTitle>
            <DialogDescription>
              Enter part details to add to your inventory.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="partNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Part Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., BRK-PAD-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
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
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Part Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="engine">Engine</SelectItem>
                          <SelectItem value="brakes">Brakes</SelectItem>
                          <SelectItem value="suspension">Suspension</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="body">Body</SelectItem>
                          <SelectItem value="transmission">Transmission</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., A-12-3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
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

                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warrantyPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty (months)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minimumStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Stock Level</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddPartDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Part</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
