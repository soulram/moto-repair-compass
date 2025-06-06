
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
}

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
}: IntakeInfoTabProps) {
  
  const getRecommendedServices = () => {
    const currentMileage = parseInt(mileage);
    if (!currentMileage) return [];
    
    return serviceRecommendations.filter(rec => 
      currentMileage >= rec.mileage && 
      rec.contractTypes.includes(customerContractType)
    ).sort((a, b) => b.mileage - a.mileage);
  };

  const recommendedServices = getRecommendedServices();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="frameNumber">Frame Number (VIN)</Label>
          <div className="flex gap-2">
            <Input
              id="frameNumber"
              placeholder="Enter frame number"
              value={frameNumber}
              onChange={(e) => setFrameNumber(e.target.value)}
            />
            <Button onClick={onFrameNumberSearch} variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
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
