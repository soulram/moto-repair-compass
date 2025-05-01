
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus,
  Search, 
  ChevronDown, 
  MoreHorizontal, 
  FileText, 
  Clipboard, 
  User, 
  Calendar
} from "lucide-react";

import { Customer, ContractType } from "@/types";

export default function Customers() {
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
    },
    {
      id: "3",
      firstName: "Robert",
      lastName: "Brown",
      email: "robert.brown@example.com",
      phone: "(555) 345-6789",
      address: "789 Oak St, Maplewood",
      contractType: "inclusive",
      motorcycles: [
        {
          id: "m3",
          customerId: "3",
          make: "Yamaha",
          model: "MT-07",
          year: 2021,
          vinNumber: "JYARN33E5MA012345",
          licensePlate: "YAM-9012",
          color: "Blue",
          currentMileage: 5000,
          lastServiceDate: "2023-05-12",
          lastServiceMileage: 3000,
          nextServiceMileage: 6000,
          warrantyExpiryDate: "2024-08-15",
          notes: "New customer, first bike"
        }
      ],
      createdAt: "2022-08-05T09:00:00.000Z",
      updatedAt: "2023-07-30T11:30:00.000Z"
    },
    {
      id: "4",
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily.johnson@example.com",
      phone: "(555) 456-7890",
      address: "101 Pine St, Oakville",
      contractType: "none",
      motorcycles: [
        {
          id: "m4",
          customerId: "4",
          make: "Kawasaki",
          model: "Ninja 650",
          year: 2018,
          vinNumber: "JKAZXDL18JA012345",
          licensePlate: "KAW-3456",
          color: "Green",
          currentMileage: 15000,
          lastServiceDate: "2023-01-30",
          lastServiceMileage: 12000,
          nextServiceMileage: 18000,
          warrantyExpiryDate: null,
          notes: "Warranty expired"
        }
      ],
      createdAt: "2021-05-18T13:45:00.000Z",
      updatedAt: "2023-04-10T16:20:00.000Z"
    }
  ];

  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  const getContractBadgeClass = (contractType: ContractType) => {
    switch (contractType) {
      case 'inclusive':
        return 'bg-shop-blue-100 text-shop-blue-800 border-shop-blue-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'basic':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer information and service history
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>
                View and manage all customer records
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search customers..."
                  className="pl-9 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Filter <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Customers</DropdownMenuItem>
                  <DropdownMenuItem>Inclusive Contract</DropdownMenuItem>
                  <DropdownMenuItem>Premium Contract</DropdownMenuItem>
                  <DropdownMenuItem>Basic Contract</DropdownMenuItem>
                  <DropdownMenuItem>No Contract</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Motorcycles</TableHead>
                <TableHead>Last Service</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>
                    <div>{customer.email}</div>
                    <div className="text-muted-foreground text-sm">{customer.phone}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getContractBadgeClass(customer.contractType)}`}>
                      {customer.contractType.charAt(0).toUpperCase() + customer.contractType.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {customer.motorcycles.map((moto) => (
                      <div key={moto.id} className="text-sm">
                        {moto.year} {moto.make} {moto.model}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {customer.motorcycles[0]?.lastServiceDate ? (
                      <div className="text-sm">
                        {new Date(customer.motorcycles[0].lastServiceDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No service history</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Clipboard className="mr-2 h-4 w-4" /> New Repair
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" /> View Invoices
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" /> Schedule Service
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredCustomers.length} of {customers.length} customers
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
    </div>
  );
}
