
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Customer, Motorcycle } from "@/types";

interface MotorcycleSelectionTabProps {
  selectedCustomer: Customer | null;
  selectedMotorcycle: Motorcycle | null;
  handleMotorcycleSelect: (motorcycle: Motorcycle) => void;
  onBack: () => void;
  onNext: () => void;
}

export function MotorcycleSelectionTab({
  selectedCustomer,
  selectedMotorcycle,
  handleMotorcycleSelect,
  onBack,
  onNext,
}: MotorcycleSelectionTabProps) {
  return (
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
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button disabled={!selectedMotorcycle} onClick={onNext}>
          Next: Intake Information
        </Button>
      </div>
    </div>
  );
}
