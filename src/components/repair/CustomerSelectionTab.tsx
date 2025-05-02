
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus } from "lucide-react";
import { Customer } from "@/types";

interface CustomerSelectionTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCustomers: Customer[];
  selectedCustomer: Customer | null;
  handleCustomerSelect: (customer: Customer) => void;
  onNext: () => void;
}

export function CustomerSelectionTab({
  searchQuery,
  setSearchQuery,
  filteredCustomers,
  selectedCustomer,
  handleCustomerSelect,
  onNext,
}: CustomerSelectionTabProps) {
  return (
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
        <Button disabled={!selectedCustomer} onClick={onNext}>
          Next: Select Motorcycle
        </Button>
      </div>
    </div>
  );
}
