import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContractType } from "@/types";
import { Search } from "lucide-react";

interface ServiceRecommendation {
  mileage: number;
  services: string[];
  parts: string[];
  contractTypes: ContractType[];
}

interface IntakeInfoTabProps {
  mileage: string;
  setMileage: (mileage: string) => void;
  customerNotes: string;
  setCustomerNotes: (notes: string) => void;
  frameNumber: string;
  setFrameNumber: (frameNumber: string) => void;
  onFrameNumberSearch: () => void;
  onBack: () => void;
  onNext: () => void;
  customerContractType?: ContractType;
  hasContract: boolean;
}

// Mock frame numbers for partial search demonstration
const mockFrameNumbers = [
  "JH2PC37G9MC700100",
  "WB10408C5JZ123456",
  "JH2PC37G9MC700101",
  "WB10408C5JZ123457",
  "JH2PC37G9MC700102",
  "WB10408C5JZ123458"
];

// Service recommendations based on mileage and contract type
const serviceRecommendations: ServiceRecommendation[] = [
  {
    mileage: 5000,
    services: ["Oil change", "Basic inspection"],
    parts: ["Engine oil", "Oil filter"],
    contractTypes: ["basic", "premium", "inclusive"]
  },
  {
    mileage: 10000,
    services: ["Oil change", "Air filter replacement", "Brake inspection"],
    parts: ["Engine oil", "Oil filter", "Air filter"],
    contractTypes: ["basic", "premium", "inclusive"]
  },
  {
    mileage: 15000,
    services: ["Oil change", "Brake fluid replacement", "Chain adjustment"],
    parts: ["Engine oil", "Oil filter", "Brake fluid"],
    contractTypes: ["premium", "inclusive"]
  },
  {
    mileage: 20000,
    services: ["Major service", "Valve adjustment", "Coolant replacement"],
    parts: ["Engine oil", "Oil filter", "Spark plugs", "Coolant"],
    contractTypes: ["premium", "inclusive"]
  },
  {
    mileage: 25000,
    services: ["Oil change", "Transmission service", "Suspension check"],
    parts: ["Engine oil", "Oil filter", "Transmission oil"],
    contractTypes: ["basic", "premium", "inclusive"]
  },
  {
    mileage: 30000,
    services: ["Major service", "Timing chain inspection", "Brake pad replacement"],
    parts: ["Engine oil", "Oil filter", "Brake pads", "Brake discs"],
    contractTypes: ["premium", "inclusive"]
  }
];

export function IntakeInfoTab({
  mileage,
  setMileage,
  customerNotes,
  setCustomerNotes,
  frameNumber,
  setFrameNumber,
  onFrameNumberSearch,
  onBack,
  onNext,
  customerContractType = "basic",
  hasContract,
}: IntakeInfoTabProps) {
  
  // Get matching frame numbers for partial search
  const getMatchingFrameNumbers = () => {
    if (!frameNumber.trim()) return [];
    return mockFrameNumbers.filter(fn => 
      fn.toLowerCase().includes(frameNumber.toLowerCase())
    );
  };

  const matchingFrameNumbers = getMatchingFrameNumbers();
  
  const getRecommendedServices = () => {
    const currentMileage = parseInt(mileage);
    if (!currentMileage) return [];
    
    return serviceRecommendations.filter(rec => 
      currentMileage >= rec.mileage && 
      rec.contractTypes.includes(customerContractType)
    ).sort((a, b) => b.mileage - a.mileage);
  };

  const recommendedServices = getRecommendedServices();

  const handleFrameNumberSelect = (selectedFrameNumber: string) => {
    setFrameNumber(selectedFrameNumber);
    onFrameNumberSearch();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="frameNumber">Frame Number (VIN)</Label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                id="frameNumber"
                placeholder="Enter partial or full frame number"
                value={frameNumber}
                onChange={(e) => setFrameNumber(e.target.value)}
              />
              
              {/* Show matching frame numbers dropdown */}
              {frameNumber && matchingFrameNumbers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {matchingFrameNumbers.map((fn, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleFrameNumberSelect(fn)}
                    >
                      {fn}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={onFrameNumberSearch} variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {frameNumber && matchingFrameNumbers.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No matching frame numbers found
            </p>
          )}
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
      </div>

      {hasContract && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              Contract Information
              <Badge variant="secondary">{customerContractType} contract</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600">
              This frame number has an active {customerContractType} contract. 
              The checklist will be customized based on the contract type and current mileage ({mileage} km).
            </p>
          </CardContent>
        </Card>
      )}

      {!hasContract && mileage && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-700">No Contract</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-600">
              This frame number does not have an active contract. 
              A complete inspection checklist will be used where you can specify actions for each item.
            </p>
          </CardContent>
        </Card>
      )}

      {mileage && parseInt(mileage) > 0 && recommendedServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recommended Services & Parts
              <Badge variant="secondary">{customerContractType} contract</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mileage Interval</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Required Parts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendedServices.map((recommendation, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {recommendation.mileage.toLocaleString()} km
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {recommendation.services.map((service, serviceIndex) => (
                          <Badge key={serviceIndex} variant="outline" className="mr-1 mb-1">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {recommendation.parts.map((part, partIndex) => (
                          <Badge key={partIndex} variant="secondary" className="mr-1 mb-1">
                            {part}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
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
