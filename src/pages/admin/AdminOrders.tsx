import React, { useState, useEffect } from 'react';
import { Eye, Loader2, RefreshCw, Package, DollarSign, Clock, Search, Calendar, User, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('pawdeal_token');
      let url = 'http://localhost:5000/api/admin/orders?';
      if (search) url += `search=${search}&`;
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 rounded-full">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 rounded-full">Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-500 rounded-full">Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500 rounded-full">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 rounded-full">Cancelled</Badge>;
      default:
        return <Badge variant="secondary" className="rounded-full">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 rounded-full">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 rounded-full">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 rounded-full">Failed</Badge>;
      default:
        return <Badge variant="secondary" className="rounded-full">{status}</Badge>;
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-reef" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-foam min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-ocean">Order Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-border rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-ocean">{totalOrders}</p>
              </div>
              <div className="w-10 h-10 bg-ocean/10 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-ocean" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-border rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number or customer..."
                className="pl-10 border-border rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] border-border rounded-xl">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchOrders} className="border-reef text-reef hover:bg-reef/10 rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-ocean/5 border-b border-border">
                <th className="text-left p-4 font-semibold text-ocean">Order #</th>
                <th className="text-left p-4 font-semibold text-ocean">Customer</th>
                <th className="text-left p-4 font-semibold text-ocean">Amount</th>
                <th className="text-left p-4 font-semibold text-ocean">Status</th>
                <th className="text-left p-4 font-semibold text-ocean">Payment</th>
                <th className="text-left p-4 font-semibold text-ocean">Date</th>
                <th className="text-left p-4 font-semibold text-ocean">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-ocean/5 transition-colors">
                  <td className="p-4 font-mono text-sm text-ocean">{order.order_number}</td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-ocean">{order.buyer_name}</p>
                      <p className="text-xs text-muted-foreground">{order.buyer_email}</p>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-reef">${order.total_amount.toLocaleString()}</td>
                  <td className="p-4">{getStatusBadge(order.status)}</td>
                  <td className="p-4">{getPaymentStatusBadge(order.payment_status)}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-full"
                      onClick={() => {
                        setSelectedOrder(order);
                        setDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 text-reef" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {orders.length === 0 && (
        <Card className="border-border rounded-2xl">
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-ocean">Order Details - {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium text-ocean flex items-center gap-2">
                    <User className="w-4 h-4 text-reef" />
                    {selectedOrder.buyer_name}
                  </p>
                  <p className="text-sm">{selectedOrder.buyer_email}</p>
                </div>
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium text-ocean flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-reef" />
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  {getPaymentStatusBadge(selectedOrder.payment_status)}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold text-ocean mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-foam rounded-lg">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No items found</p>
                  )}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-reef">${selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;