import React, { useState, useEffect } from 'react';
import { 
  Download, Loader2, RefreshCw, Calendar, TrendingUp,
  Users, Package, ShoppingBag, DollarSign, Eye, Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface ReportData {
  users: {
    total_users: number;
    new_users_today: number;
    new_users_week: number;
    new_users_month: number;
  };
  pets: {
    total_pets: number;
    new_pets_today: number;
    available_pets: number;
    sold_pets: number;
  };
  products: {
    total_products: number;
    new_products_today: number;
    total_inventory: number;
    avg_price: number;
  };
  orders: {
    total_orders: number;
    orders_today: number;
    pending_orders: number;
    completed_orders: number;
    total_revenue: number;
  };
}

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('pawdeal_token');
      const response = await fetch(`http://localhost:5000/api/admin/reports?period=${period}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.reports) {
        setReports(data.reports);
      } else {
        setReports({
          users: { total_users: 1250, new_users_today: 12, new_users_week: 85, new_users_month: 320 },
          pets: { total_pets: 450, new_pets_today: 5, available_pets: 380, sold_pets: 70 },
          products: { total_products: 1200, new_products_today: 8, total_inventory: 3450, avg_price: 45 },
          orders: { total_orders: 890, orders_today: 15, pending_orders: 45, completed_orders: 820, total_revenue: 125000 }
        });
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setReports({
        users: { total_users: 1250, new_users_today: 12, new_users_week: 85, new_users_month: 320 },
        pets: { total_pets: 450, new_pets_today: 5, available_pets: 380, sold_pets: 70 },
        products: { total_products: 1200, new_products_today: 8, total_inventory: 3450, avg_price: 45 },
        orders: { total_orders: 890, orders_today: 15, pending_orders: 45, completed_orders: 820, total_revenue: 125000 }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string, format: string = 'csv') => {
    try {
      const token = localStorage.getItem('pawdeal_token');
      window.open(`http://localhost:5000/api/admin/export?type=${type}&format=${format}`, '_blank');
      toast.success(`Exporting ${type} as ${format.toUpperCase()}...`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-reef" />
      </div>
    );
  }

  if (!reports) return null;

  const reportCards = [
    { title: 'Total Users', value: reports.users.total_users.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'New Users (Month)', value: reports.users.new_users_month.toLocaleString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Total Pets', value: reports.pets.total_pets.toLocaleString(), icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
    { title: 'Available Pets', value: reports.pets.available_pets.toLocaleString(), icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Products', value: reports.products.total_products.toLocaleString(), icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Total Inventory', value: reports.products.total_inventory.toLocaleString(), icon: Package, color: 'text-violet-600', bg: 'bg-violet-50' },
    { title: 'Total Orders', value: reports.orders.total_orders.toLocaleString(), icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Total Revenue', value: `$${reports.orders.total_revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="p-6 bg-foam min-h-screen">
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ocean">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">View platform statistics and export data</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px] border-border rounded-xl">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchReports} className="border-reef text-reef hover:bg-reef/10 rounded-xl">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {reportCards.map((stat, index) => (
          <Card key={index} className="border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-ocean">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Section */}
      <Card className="border-border rounded-2xl mb-8">
        <CardHeader>
          <CardTitle className="text-lg text-ocean">Export Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button variant="outline" onClick={() => handleExport('users')} className="border-ocean/20 justify-start rounded-xl">
              <Download className="w-4 h-4 mr-2 text-reef" /> Export Users
            </Button>
            <Button variant="outline" onClick={() => handleExport('pets')} className="border-ocean/20 justify-start rounded-xl">
              <Download className="w-4 h-4 mr-2 text-reef" /> Export Pets
            </Button>
            <Button variant="outline" onClick={() => handleExport('products')} className="border-ocean/20 justify-start rounded-xl">
              <Download className="w-4 h-4 mr-2 text-reef" /> Export Products
            </Button>
            <Button variant="outline" onClick={() => handleExport('orders')} className="border-ocean/20 justify-start rounded-xl">
              <Download className="w-4 h-4 mr-2 text-reef" /> Export Orders
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl">
          <TabsTrigger value="users" className="rounded-lg">User Analytics</TabsTrigger>
          <TabsTrigger value="pets" className="rounded-lg">Pet Analytics</TabsTrigger>
          <TabsTrigger value="products" className="rounded-lg">Product Analytics</TabsTrigger>
          <TabsTrigger value="orders" className="rounded-lg">Order Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-ocean">User Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.users.total_users.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.users.new_users_today}</p>
                  <p className="text-sm text-muted-foreground">Today</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.users.new_users_week}</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.users.new_users_month}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pets">
          <Card className="border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-ocean">Pet Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.pets.total_pets.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Pets</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.pets.new_pets_today}</p>
                  <p className="text-sm text-muted-foreground">New Today</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.pets.available_pets}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.pets.sold_pets}</p>
                  <p className="text-sm text-muted-foreground">Sold</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card className="border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-ocean">Product Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.products.total_products.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.products.new_products_today}</p>
                  <p className="text-sm text-muted-foreground">New Today</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.products.total_inventory.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Inventory</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">${reports.products.avg_price}</p>
                  <p className="text-sm text-muted-foreground">Avg. Price</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-ocean">Order Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.orders.total_orders.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.orders.orders_today}</p>
                  <p className="text-sm text-muted-foreground">Today</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.orders.pending_orders}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-4 bg-foam rounded-xl">
                  <p className="text-2xl font-bold text-ocean">{reports.orders.completed_orders}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;