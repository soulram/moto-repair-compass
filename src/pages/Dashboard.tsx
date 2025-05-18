
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Clock,
  Users,
  Wrench,
  FileText,
  Package,
  AlertTriangle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Mock data - would come from an API in a real application
  const upcomingRepairs = [
    { id: "1", customer: "James Wilson", motorcycle: "Honda CBR600", time: "9:00 AM", status: "confirmed" },
    { id: "2", customer: "Sarah Miller", motorcycle: "BMW R1200GS", time: "10:30 AM", status: "confirmed" },
    { id: "3", customer: "Robert Brown", motorcycle: "Yamaha MT-07", time: "1:15 PM", status: "pending" }
  ];

  const stats = {
    dailyRepairs: 8,
    pendingQuotes: 5,
    lowStockItems: 3,
    activeRepairs: 6,
    completedToday: 4,
    monthlyRevenue: 12580
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Workshop overview for today, {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Calendar View
          </Button>
          <Button asChild>
            <Link to="/repair-intake">
              <Clock className="mr-2 h-4 w-4" /> New Repair Intake
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Repairs
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dailyRepairs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeRepairs} active, {stats.completedToday} completed
            </p>
            <Progress value={50} className="mt-3 h-1" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Quotes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting customer approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Parts Status
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground text-red-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Items below minimum stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                Upcoming repair appointments for today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-0 p-0">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">Time</th>
                    <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">Customer</th>
                    <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">Motorcycle</th>
                    <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">Status</th>
                    <th className="py-3 px-4 text-right font-medium text-sm text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingRepairs.map((repair) => (
                    <tr key={repair.id} className="border-b">
                      <td className="py-3 px-4 text-sm">{repair.time}</td>
                      <td className="py-3 px-4 text-sm">{repair.customer}</td>
                      <td className="py-3 px-4 text-sm">{repair.motorcycle}</td>
                      <td className="py-3 px-4 text-sm">
                        {repair.status === "confirmed" ? (
                          <span className="status-badge status-badge-ok">Confirmed</span>
                        ) : (
                          <span className="status-badge status-badge-warning">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Check In</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>
                Upcoming repair appointments for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Switch to the "upcoming" tab to view appointments scheduled for the next 7 days.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Important notifications requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <h4 className="font-medium">Low Stock Alert</h4>
                    <p className="text-sm text-muted-foreground">
                      3 items are below minimum stock level
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    View Items
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <h4 className="font-medium">Upcoming Warranty Expiration</h4>
                    <p className="text-sm text-muted-foreground">
                      2 motorcycles have warranties expiring next week
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
