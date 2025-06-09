
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContractType } from "@/types";
import { Search, TrendingDown, TrendingUp, Package } from "lucide-react";

interface ContractUsage {
  customerId: string;
  customerName: string;
  frameNumber: string;
  contractType: ContractType;
  servicesAllowed: number;
  servicesUsed: number;
  partsAllowance: number;
  partsUsed: number;
  lastServiceDate: string;
  expiryDate: string;
}

export default function ContractMonitoring() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contractFilter, setContractFilter] = useState<string>("all");

  // Mock data - would come from an API
  const contractUsages: ContractUsage[] = [
    {
      customerId: "1",
      customerName: "James Wilson",
      frameNumber: "JH2PC37G9MC700100",
      contractType: "premium",
      servicesAllowed: 12,
      servicesUsed: 8,
      partsAllowance: 25,
      partsUsed: 18,
      lastServiceDate: "2024-01-15",
      expiryDate: "2024-12-31"
    },
    {
      customerId: "2",
      customerName: "Sarah Miller",
      frameNumber: "WB10408C5JZ123456",
      contractType: "basic",
      servicesAllowed: 6,
      servicesUsed: 4,
      partsAllowance: 10,
      partsUsed: 6,
      lastServiceDate: "2024-02-20",
      expiryDate: "2024-11-30"
    },
    {
      customerId: "3",
      customerName: "Mike Johnson",
      frameNumber: "1HD1KB4197Y678901",
      contractType: "inclusive",
      servicesAllowed: 24,
      servicesUsed: 15,
      partsAllowance: 50,
      partsUsed: 32,
      lastServiceDate: "2024-01-28",
      expiryDate: "2025-06-15"
    }
  ];

  const filteredContracts = contractUsages.filter(contract => {
    const matchesSearch = 
      contract.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.frameNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = contractFilter === "all" || contract.contractType === contractFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getUsagePercentage = (used: number, allowed: number) => {
    return Math.round((used / allowed) * 100);
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return "critical";
    if (percentage >= 70) return "warning";
    return "normal";
  };

  const getContractTypeColor = (type: ContractType) => {
    switch (type) {
      case "basic": return "bg-blue-500";
      case "premium": return "bg-purple-500";
      case "inclusive": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTotalPartsRemaining = () => {
    return contractUsages.reduce((total, contract) => {
      return total + (contract.partsAllowance - contract.partsUsed);
    }, 0);
  };

  const getHighPartsUsageCount = () => {
    return contractUsages.filter(c => getUsagePercentage(c.partsUsed, c.partsAllowance) >= 70).length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contract Monitoring</h1>
        <p className="text-muted-foreground">
          Track contract consumption for services and spare parts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractUsages.length}</div>
            <p className="text-xs text-muted-foreground">Total active contracts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Usage</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractUsages.filter(c => getUsagePercentage(c.servicesUsed, c.servicesAllowed) >= 70).length}
            </div>
            <p className="text-xs text-muted-foreground">Contracts with high usage</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parts High Usage</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getHighPartsUsageCount()}</div>
            <p className="text-xs text-muted-foreground">High spare parts usage</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Expiring within 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Usage Details</CardTitle>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by customer name or frame number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="contract-filter">Contract Type</Label>
              <Select value={contractFilter} onValueChange={setContractFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="inclusive">Inclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Frame Number</TableHead>
                <TableHead>Contract Type</TableHead>
                <TableHead>Services Usage</TableHead>
                <TableHead>Parts Allowance (qty)</TableHead>
                <TableHead>Parts Remaining (qty)</TableHead>
                <TableHead>Last Service</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => {
                const servicesPercentage = getUsagePercentage(contract.servicesUsed, contract.servicesAllowed);
                const partsPercentage = getUsagePercentage(contract.partsUsed, contract.partsAllowance);
                const partsRemaining = contract.partsAllowance - contract.partsUsed;
                
                return (
                  <TableRow key={contract.customerId}>
                    <TableCell className="font-medium">{contract.customerName}</TableCell>
                    <TableCell className="font-mono text-sm">{contract.frameNumber}</TableCell>
                    <TableCell>
                      <Badge className={`${getContractTypeColor(contract.contractType)} text-white`}>
                        {contract.contractType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{contract.servicesUsed}/{contract.servicesAllowed}</span>
                          <span>{servicesPercentage}%</span>
                        </div>
                        <Progress 
                          value={servicesPercentage} 
                          className={`h-2 ${
                            getUsageStatus(servicesPercentage) === 'critical' ? 'bg-red-100' :
                            getUsageStatus(servicesPercentage) === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{contract.partsUsed}/{contract.partsAllowance}</span>
                          <span>{partsPercentage}%</span>
                        </div>
                        <Progress 
                          value={partsPercentage} 
                          className={`h-2 ${
                            getUsageStatus(partsPercentage) === 'critical' ? 'bg-red-100' :
                            getUsageStatus(partsPercentage) === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className={`font-medium ${
                          partsRemaining <= contract.partsAllowance * 0.1 ? 'text-red-600' :
                          partsRemaining <= contract.partsAllowance * 0.3 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {partsRemaining}
                        </div>
                        <div className="text-muted-foreground">remaining</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(contract.lastServiceDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(contract.expiryDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
