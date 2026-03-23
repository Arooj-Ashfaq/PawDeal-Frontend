import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { 
  LayoutDashboard, ShoppingBag, Heart, MessageSquare, 
  Settings, User, PlusCircle, TrendingUp, 
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  Package, DollarSign, Users, Eye, FileText, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const { view } = useParams<{ view?: string }>();
  const navigate = useNavigate();
  const { pets, favorites } = useMarketplace();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access the dashboard');
      navigate('/login?redirect=/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="container py-20 text-center">Loading...</div>;

  const activeView = view || 'overview';

  // Mock data for charts
  const performanceData = [
    { name: 'Mon', views: 400, messages: 24 },
    { name: 'Tue', views: 300, messages: 18 },
    { name: 'Wed', views: 600, messages: 36 },
    { name: 'Thu', views: 800, messages: 45 },
    { name: 'Fri', views: 500, messages: 30 },
    { name: 'Sat', views: 900, messages: 55 },
    { name: 'Sun', views: 700, messages: 42 },
  ];

  const trafficSources = [
    { name: 'Direct', value: 400, color: '#0A2540' },
    { name: 'Social', value: 300, color: '#00A8CC' },
    { name: 'Search', value: 300, color: '#FF6B6B' },
    { name: 'Referral', value: 200, color: '#27AE60' },
  ];

  const sidebarLinks = [
    { name: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, view: 'overview' },
    { name: 'Buyer Dashboard', icon: <ShoppingBag className="w-5 h-5" />, view: 'buyer' },
    { name: 'Seller Dashboard', icon: <TrendingUp className="w-5 h-5" />, view: 'seller' },
    { name: 'My Listings', icon: <Package className="w-5 h-5" />, view: 'listings' },
    { name: 'Favorites', icon: <Heart className="w-5 h-5" />, view: 'favorites' },
    { name: 'Messages', icon: <MessageSquare className="w-5 h-5" />, view: 'messages', path: '/messages' },
    { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, view: 'analytics' },
    { name: 'Account Settings', icon: <Settings className="w-5 h-5" />, view: 'settings' },
  ];

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Profile Views', value: '12,450', change: '+12.5%', icon: <Eye className="text-tropical" />, up: true },
          { title: 'Active Messages', value: '45', change: '+5.2%', icon: <MessageSquare className="text-reef" />, up: true },
          { title: 'Total Sales', value: '$8,240', change: '-2.1%', icon: <DollarSign className="text-success" />, up: false },
          { title: 'Favorites', value: '89', change: '+18.7%', icon: <Heart className="text-reef" />, up: true },
        ].map((stat, i) => (
          <Card key={i} className="border-border shadow-sm rounded-2xl">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-foam rounded-xl">{stat.icon}</div>
                  <Badge variant="secondary" className={`bg-transparent ${stat.up ? "text-success" : "text-reef"}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
               </div>
               <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</p>
               <h3 className="text-3xl font-extrabold text-ocean mt-1">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Activity Performance</CardTitle>
              <CardDescription>Daily views and messages overview</CardDescription>
            </div>
            <Button type="button" onClick={() => {}} variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold gap-2">
              <Download className="w-3 h-3" /> Export CSV
            </Button>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A2540', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="views" stroke="#00A8CC" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="messages" stroke="#FF6B6B" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
             </ResponsiveContainer>
             <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {trafficSources.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                    <span className="text-xs font-bold text-ocean">{s.name}</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMyListings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-extrabold text-ocean">Manage Your Listings</h2>
        <Button className="bg-reef hover:bg-reef/90 text-white font-bold h-10 px-6 rounded-xl gap-2 shadow-lg" type="button" onClick={() => {}}>
          <PlusCircle className="w-5 h-5" /> Add New Pet
        </Button>
      </div>
      <div className="grid gap-6">
        {pets.slice(0, 5).map((pet, i) => (
          <Card key={i} className="border-border shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
                <img src={`https://images.unsplash.com/photo-${pet.id}?auto=format&fit=crop&w=200&q=80`} className="w-full h-full object-cover" alt={pet.name} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-ocean text-lg">{pet.name}</h4>
                    <p className="text-sm text-muted-foreground">{pet.breed} • {pet.age}</p>
                  </div>
                  <Badge className="bg-success/10 text-success border-none">Active</Badge>
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                    <Eye className="w-3 h-3" /> 1,240 Views
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                    <MessageSquare className="w-3 h-3" /> 12 Chats
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                    <Heart className="w-3 h-3" /> 45 Saves
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                 <Button type="button" onClick={() => {}} variant="outline" size="sm" className="h-8 rounded-lg font-bold border-border text-xs">Edit</Button>
                 <Button type="button" onClick={() => {}} variant="ghost" size="sm" className="h-8 rounded-lg font-bold text-reef hover:bg-reef/10 text-xs">Remove</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-foam">
      <div className="container px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-6">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <div className="p-8 bg-ocean text-white space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 p-1 backdrop-blur-md overflow-hidden border border-white/10">
                    <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} className="w-full h-full object-cover rounded-xl" alt={user.name} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg line-clamp-1">{user.name}</h3>
                    <Badge className="bg-reef text-white border-none text-[10px] font-bold uppercase tracking-widest">{user.role}</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Account Completeness</p>
                  <Progress value={85} className="h-1.5 bg-white/10 [&>div]:bg-reef" />
                </div>
              </div>
              <CardContent className="p-4 py-6">
                <nav className="space-y-1">
                  {sidebarLinks.map((link) => (
                    link.path ? (
                      <Link 
                        key={link.view} 
                        to={link.path}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-foam hover:text-reef transition-all"
                      >
                        {link.icon} {link.name}
                      </Link>
                    ) : (
                      <button 
                        key={link.view} 
                        onClick={() => navigate(`/dashboard/${link.view}`)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeView === link.view ? "bg-ocean text-white shadow-lg" : "text-muted-foreground hover:bg-foam hover:text-reef"}`}
                      >
                        {link.icon} {link.name}
                      </button>
                    )
                  ))}
                </nav>
              </CardContent>
            </Card>

            <Card className="border-none bg-reef text-white p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <h3 className="text-xl font-extrabold leading-tight">Pro Plan Features</h3>
               <p className="text-white/80 text-xs">Unlock advanced analytics and premium seller tools.</p>
               <Button className="w-full bg-white text-reef hover:bg-white/90 font-extrabold h-10 rounded-xl" type="button" onClick={() => {}}>Upgrade Now</Button>
            </Card>
          </aside>

          {/* Main View */}
          <main className="flex-1 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-border shadow-sm">
               <div>
                  <h1 className="text-3xl font-extrabold text-ocean capitalize">{activeView.replace('-', ' ')}</h1>
                  <p className="text-muted-foreground font-medium">Welcome back, {user.name}! Here's what's happening.</p>
               </div>
               <div className="flex gap-3 w-full md:w-auto">
                 <Button type="button" onClick={() => {}} variant="outline" className="h-12 border-border text-ocean font-bold rounded-xl flex-1 md:flex-none">
                    <FileText className="w-5 h-5 mr-2" /> PDF Report
                 </Button>
                 <Button className="h-12 bg-reef hover:bg-reef/90 text-white font-bold rounded-xl flex-1 md:flex-none" type="button" onClick={() => {}}>
                    <Download className="w-5 h-5 mr-2" /> Export Data
                 </Button>
               </div>
            </header>

            {activeView === 'overview' && renderOverview()}
            {activeView === 'listings' && renderMyListings()}
            {activeView === 'buyer' && (
               <div className="grid gap-8">
                  <h2 className="text-2xl font-extrabold text-ocean">Purchase History</h2>
                  <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                        <thead className="bg-foam border-b border-border">
                           <tr>
                              <th className="px-6 py-4 text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Order ID</th>
                              <th className="px-6 py-4 text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Product</th>
                              <th className="px-6 py-4 text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Date</th>
                              <th className="px-6 py-4 text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Price</th>
                              <th className="px-6 py-4 text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                           {[1,2,3].map(i => (
                              <tr key={i} className="hover:bg-foam/50 transition-colors">
                                 <td className="px-6 py-4 font-bold text-ocean">#ORD-{1024 + i}</td>
                                 <td className="px-6 py-4 text-sm text-muted-foreground">Premium Pet Supply {i}</td>
                                 <td className="px-6 py-4 text-sm text-muted-foreground">Mar {12-i}, 2026</td>
                                 <td className="px-6 py-4 font-bold text-ocean">${45 + i*10}.99</td>
                                 <td className="px-6 py-4">
                                    <Badge className="bg-success/10 text-success border-none">Delivered</Badge>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
            {/* ... other views would be similar ... */}
            {['favorites', 'settings', 'seller', 'analytics'].includes(activeView) && (
              <div className="py-20 text-center bg-white rounded-3xl border border-border border-dashed space-y-4">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto opacity-10" />
                <h3 className="text-2xl font-bold text-ocean">{activeView.charAt(0).toUpperCase() + activeView.slice(1)} view is coming soon</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">We're working hard to bring this feature to you. Stay tuned!</p>
                <Button variant="outline" className="border-reef text-reef font-bold h-12 px-8 rounded-xl" onClick={() => navigate('/dashboard/overview')}>Back to Overview</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
