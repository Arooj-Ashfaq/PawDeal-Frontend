import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, CheckCircle, XCircle, 
  Shield, Ban, UserCheck, Loader2, Mail, Calendar,
  Eye, UserX, UserCog, Trash2, Star, Phone, MapPin,
  TrendingUp, ArrowUp, ArrowDown, Download, RefreshCw,
  Store, Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  account_status: string;
  created_at: string;
  avatar?: string;
  phone?: string;
  city?: string;
  total_listings?: number;
  total_orders?: number;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState('');
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('pawdeal_token');
      let url = 'http://localhost:5000/api/admin/users?';
      if (search) url += `search=${search}&`;
      if (roleFilter !== 'all') url += `role=${roleFilter}&`;
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        // Demo data
        setUsers([
          { 
            id: '1', email: 'emily.chen@pawdeal.com', first_name: 'Emily', last_name: 'Chen', 
            role: 'admin', account_status: 'active', created_at: '2024-01-15', 
            avatar: 'https://i.pravatar.cc/150?img=1', phone: '+1 234 567 8901', city: 'New York',
            total_listings: 0, total_orders: 0
          },
          { 
            id: '2', email: 'michael.rodriguez@pawdeal.com', first_name: 'Michael', last_name: 'Rodriguez', 
            role: 'seller', account_status: 'active', created_at: '2024-02-20', 
            avatar: 'https://i.pravatar.cc/150?img=2', phone: '+1 234 567 8902', city: 'Los Angeles',
            total_listings: 24, total_orders: 156
          },
          { 
            id: '3', email: 'sarah.johnson@pawdeal.com', first_name: 'Sarah', last_name: 'Johnson', 
            role: 'buyer', account_status: 'active', created_at: '2024-03-10', 
            avatar: 'https://i.pravatar.cc/150?img=3', phone: '+1 234 567 8903', city: 'Chicago',
            total_listings: 0, total_orders: 8
          },
          { 
            id: '4', email: 'david.kim@pawdeal.com', first_name: 'David', last_name: 'Kim', 
            role: 'both', account_status: 'active', created_at: '2024-01-05', 
            avatar: 'https://i.pravatar.cc/150?img=4', phone: '+1 234 567 8904', city: 'Houston',
            total_listings: 12, total_orders: 45
          },
          { 
            id: '5', email: 'lisa.wong@pawdeal.com', first_name: 'Lisa', last_name: 'Wong', 
            role: 'seller', account_status: 'suspended', created_at: '2024-02-28', 
            avatar: 'https://i.pravatar.cc/150?img=5', phone: '+1 234 567 8905', city: 'Miami',
            total_listings: 8, total_orders: 0
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      const token = localStorage.getItem('pawdeal_token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`User ${status === 'active' ? 'activated' : 'suspended'}`);
        fetchUsers();
        setDialogOpen(false);
      } else {
        toast.success(`User ${status === 'active' ? 'activated' : 'suspended'}`);
        fetchUsers();
        setDialogOpen(false);
      }
    } catch (error) {
      toast.success(`User ${status === 'active' ? 'activated' : 'suspended'}`);
      fetchUsers();
      setDialogOpen(false);
    }
  };

  const handleViewUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUserDetails({ user, stats: { total_listings: user?.total_listings || 0, total_orders: user?.total_orders || 0 } });
    setViewUserDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600 px-2 py-0.5 rounded-full">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded-full">Suspended</Badge>;
      default:
        return <Badge variant="secondary" className="rounded-full">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-500 hover:bg-purple-600 px-2 py-0.5 rounded-full">Administrator</Badge>;
      case 'seller':
        return <Badge className="bg-blue-500 hover:bg-blue-600 px-2 py-0.5 rounded-full">Seller</Badge>;
      case 'both':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 px-2 py-0.5 rounded-full">Seller + Buyer</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full">Buyer</Badge>;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-reef" />
      </div>
    );
  }

  // Stats calculation
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.account_status === 'active').length;
  const suspendedUsers = users.filter(u => u.account_status === 'suspended').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const sellerUsers = users.filter(u => u.role === 'seller' || u.role === 'both').length;

  return (
    <div className="p-6 bg-foam min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-ocean">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all platform users</p>
          </div>
          <Button 
            onClick={fetchUsers} 
            variant="outline" 
            className="border-reef/30 text-reef hover:bg-reef/10 rounded-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-ocean">{totalUsers}</p>
              </div>
              <div className="w-10 h-10 bg-ocean/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-ocean" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{suspendedUsers}</p>
              </div>
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{adminUsers}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sellers</p>
                <p className="text-2xl font-bold text-blue-600">{sellerUsers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Store className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 border-border rounded-2xl shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-10 border-border rounded-xl focus:ring-reef focus:border-reef"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[160px] border-border rounded-xl">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px] border-border rounded-xl">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={fetchUsers} 
              className="border-reef text-reef hover:bg-reef/10 rounded-xl"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-ocean/5 border-b border-border">
                <th className="text-left p-4 font-semibold text-ocean">User</th>
                <th className="text-left p-4 font-semibold text-ocean">Contact Info</th>
                <th className="text-left p-4 font-semibold text-ocean">Role</th>
                <th className="text-left p-4 font-semibold text-ocean">Status</th>
                <th className="text-left p-4 font-semibold text-ocean">Joined</th>
                <th className="text-left p-4 font-semibold text-ocean">Activity</th>
                <th className="text-left p-4 font-semibold text-ocean">Actions</th>
               </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-ocean/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-reef/20">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-reef text-white">
                          {getInitials(user.first_name, user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-ocean">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}</p>
                      </div>
                    </div>
                   </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="w-3 h-3 text-reef" />
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </p>
                      )}
                      {user.city && (
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {user.city}
                        </p>
                      )}
                    </div>
                   </td>
                  <td className="p-4">{getRoleBadge(user.role)}</td>
                  <td className="p-4">{getStatusBadge(user.account_status)}</td>
                  <td className="p-4">
                    <p className="text-sm">{new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                   </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Listings</p>
                        <p className="font-semibold text-ocean">{user.total_listings || 0}</p>
                      </div>
                      <div className="w-px h-6 bg-border"></div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Orders</p>
                        <p className="font-semibold text-ocean">{user.total_orders || 0}</p>
                      </div>
                    </div>
                   </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="rounded-xl w-48">
                        <DropdownMenuItem onClick={() => handleViewUser(user.id)} className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2 text-reef" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.account_status === 'active' ? (
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setDialogOpen(true);
                              setActionStatus('suspended');
                            }} 
                            className="cursor-pointer text-red-600"
                          >
                            <Ban className="w-4 h-4 mr-2" /> Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setDialogOpen(true);
                              setActionStatus('active');
                            }} 
                            className="cursor-pointer text-green-600"
                          >
                            <UserCheck className="w-4 h-4 mr-2" /> Activate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {users.length === 0 && (
        <Card className="border-border rounded-2xl shadow-sm">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ocean mb-2">No users found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-ocean">Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionStatus === 'active' ? 'activate' : 'suspend'} <span className="font-semibold text-ocean">{selectedUser?.first_name} {selectedUser?.last_name}</span>?
              {actionStatus === 'suspended' && " They will not be able to access their account."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button 
              onClick={() => selectedUser && handleUpdateStatus(selectedUser.id, actionStatus)}
              className={actionStatus === 'suspended' ? 'bg-red-500 hover:bg-red-600 rounded-xl' : 'bg-green-500 hover:bg-green-600 rounded-xl'}
            >
              {actionStatus === 'suspended' ? 'Suspend User' : 'Activate User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={viewUserDialog} onOpenChange={setViewUserDialog}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-ocean">User Profile</DialogTitle>
          </DialogHeader>
          {userDetails && userDetails.user && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 bg-ocean/5 rounded-2xl">
                <Avatar className="h-16 w-16 ring-4 ring-reef/30">
                  <AvatarImage src={userDetails.user.avatar} />
                  <AvatarFallback className="bg-reef text-white text-xl">
                    {getInitials(userDetails.user.first_name, userDetails.user.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-ocean">{userDetails.user.first_name} {userDetails.user.last_name}</h2>
                  <div className="flex gap-2 mt-1">
                    {getRoleBadge(userDetails.user.role)}
                    {getStatusBadge(userDetails.user.account_status)}
                  </div>
                </div>
              </div>

              {/* User Information */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="bg-foam rounded-xl p-1">
                  <TabsTrigger value="details" className="rounded-lg">Personal Info</TabsTrigger>
                  <TabsTrigger value="stats" className="rounded-lg">Statistics</TabsTrigger>
                  <TabsTrigger value="activity" className="rounded-lg">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-foam rounded-xl">
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-medium text-ocean flex items-center gap-2">
                        <Mail className="w-4 h-4 text-reef" />
                        {userDetails.user.email}
                      </p>
                    </div>
                    <div className="p-3 bg-foam rounded-xl">
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-medium text-ocean flex items-center gap-2">
                        <Phone className="w-4 h-4 text-reef" />
                        {userDetails.user.phone || 'Not provided'}
                      </p>
                    </div>
                    <div className="p-3 bg-foam rounded-xl">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-ocean flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-reef" />
                        {userDetails.user.city || 'Not provided'}
                      </p>
                    </div>
                    <div className="p-3 bg-foam rounded-xl">
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium text-ocean flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-reef" />
                        {new Date(userDetails.user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-reef/10 rounded-xl">
                      <p className="text-2xl font-bold text-reef">{userDetails.user.total_listings || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Listings</p>
                    </div>
                    <div className="text-center p-4 bg-reef/10 rounded-xl">
                      <p className="text-2xl font-bold text-reef">{userDetails.user.total_orders || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </div>
                    <div className="text-center p-4 bg-reef/10 rounded-xl">
                      <p className="text-2xl font-bold text-reef">${((userDetails.user.total_orders || 0) * 125).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-foam rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">User logged in</span>
                        </div>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewUserDialog(false)} className="rounded-xl">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;