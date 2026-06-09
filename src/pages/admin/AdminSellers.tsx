import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle, XCircle, Loader2, RefreshCw,
  Store, Mail, MapPin, Clock, Shield, User
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Seller {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  store_name: string;
  business_name: string;
  verification_status: string;
  created_at: string;
  city: string;
  state: string;
  country: string;
}

const AdminSellers: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');

  useEffect(() => {
    fetchSellers();
  }, [search]);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('pawdeal_token');
      let url = 'http://localhost:5000/api/admin/sellers/pending';
      if (search) url += `?search=${search}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSellers(data.data || []);
      } else {
        setSellers([]);
      }
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySeller = async (sellerId: string, status: string) => {
    try {
      const token = localStorage.getItem('pawdeal_token');
      const response = await fetch(`http://localhost:5000/api/admin/sellers/${sellerId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Seller ${status === 'verified' ? 'verified' : 'rejected'}`);
        fetchSellers();
        setDialogOpen(false);
      } else {
        toast.error(data.error || 'Failed to verify seller');
      }
    } catch (error) {
      toast.error('Failed to verify seller');
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500 rounded-full">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 rounded-full">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 rounded-full">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="rounded-full">{status || 'Pending'}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-reef" />
      </div>
    );
  }

  const pendingCount = sellers.filter(s => s.verification_status === 'pending').length;

  return (
    <div className="p-6 bg-foam min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-ocean">Seller Management</h1>
          <p className="text-muted-foreground mt-1">Verify and manage seller accounts</p>
        </div>
        <Button variant="outline" onClick={fetchSellers} className="border-reef text-reef hover:bg-reef/10 rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats Card */}
      <Card className="mb-6 border-border rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Verifications</p>
                <p className="text-2xl font-bold text-ocean">{pendingCount}</p>
              </div>
            </div>
            <Badge className="bg-yellow-500 text-white rounded-full">{pendingCount} pending</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6 border-border rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by store name or email..."
                className="pl-10 border-border rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sellers List */}
      {sellers.length === 0 ? (
        <Card className="border-border rounded-2xl">
          <CardContent className="p-12 text-center">
            <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ocean mb-2">No pending sellers</h3>
            <p className="text-muted-foreground">All sellers have been verified</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sellers.map((seller) => (
            <Card key={seller.id} className="border-border rounded-2xl hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Store className="w-6 h-6 text-reef" />
                      <h3 className="text-xl font-bold text-ocean">{seller.store_name || seller.business_name || 'Store Name'}</h3>
                      {getVerificationBadge(seller.verification_status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <p className="text-sm flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {seller.email}
                        </p>
                        <p className="text-sm flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {seller.first_name} {seller.last_name}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {seller.city || 'Unknown'}, {seller.state || 'Unknown'}, {seller.country || 'Unknown'}
                        </p>
                        <p className="text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          Joined: {seller.created_at ? new Date(seller.created_at).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-green-500 hover:bg-green-600 rounded-xl"
                      onClick={() => {
                        setSelectedSeller(seller);
                        setVerificationStatus('verified');
                        setDialogOpen(true);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Verify
                    </Button>
                    <Button 
                      variant="destructive"
                      className="rounded-xl"
                      onClick={() => {
                        setSelectedSeller(seller);
                        setVerificationStatus('rejected');
                        setDialogOpen(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-ocean">Confirm Seller Verification</DialogTitle>
            <DialogDescription>
              Are you sure you want to {verificationStatus === 'verified' ? 'verify' : 'reject'} {selectedSeller?.store_name || selectedSeller?.business_name || 'this seller'}?
              {verificationStatus === 'rejected' && " The seller will need to reapply."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button 
              onClick={() => selectedSeller && handleVerifySeller(selectedSeller.id, verificationStatus)}
              className={verificationStatus === 'verified' ? 'bg-green-500 hover:bg-green-600 rounded-xl' : 'bg-red-500 hover:bg-red-600 rounded-xl'}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSellers;