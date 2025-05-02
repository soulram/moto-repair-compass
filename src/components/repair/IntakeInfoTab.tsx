
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IntakeInfoTabProps {
  mileage: string;
  setMileage: (mileage: string) => void;
  customerNotes: string;
  setCustomerNotes: (notes: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function IntakeInfoTab({
  mileage,
  setMileage,
  customerNotes,
  setCustomerNotes,
  onBack,
  onNext,
}: IntakeInfoTabProps) {
  return (
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
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!mileage}
        >
          Next: Start Inspection
        </Button>
      </div>
    </div>
  );
}
