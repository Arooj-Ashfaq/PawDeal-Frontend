import React, { useState, useEffect } from 'react';
import { 
  Eye, Trash2, Loader2, Ban, RefreshCw, CheckCircle,
  AlertTriangle, MessageSquare, Package, Heart, XCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ReportedItem {
  id: string;
  title?: string;
  content?: string;
  reporter_name?: string;
  reason?: string;
  created_at: string;
  status: string;
}

const AdminModeration: React.FC = () => {
  const [reportedComments, setReportedComments] = useState<ReportedItem[]>([]);
  const [reportedPets, setReportedPets] = useState<ReportedItem[]>([]);
  const [reportedProducts, setReportedProducts] = useState<ReportedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ReportedItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    fetchReportedContent();
  }, []);

  const fetchReportedContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('pawdeal_token');
      const response = await fetch('http://localhost:5000/api/admin/moderation/reported', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReportedComments(data.data?.comments || []);
        setReportedPets(data.data?.pets || []);
        setReportedProducts(data.data?.products || []);
      } else {
        setReportedComments([]);
        setReportedPets([]);
        setReportedProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch reported content:', error);
      setReportedComments([]);
      setReportedPets([]);
      setReportedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (type: string, id: string, action: string) => {
    try {
      const token = localStorage.getItem('pawdeal_token');
      const response = await fetch(`http://localhost:5000/api/admin/moderation/${type}/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Content ${action === 'hide' ? 'hidden' : action === 'delete' ? 'deleted' : 'warned'}`);
        fetchReportedContent();
        setDialogOpen(false);
      } else {
        toast.error(data.error || 'Failed to moderate content');
      }
    } catch (error) {
      toast.error('Failed to moderate content');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 rounded-full">Pending Review</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500 rounded-full">Resolved</Badge>;
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

  return (
    <div className="p-6 bg-foam min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-ocean">Content Moderation</h1>
          <p className="text-muted-foreground mt-1">Review and moderate reported content</p>
        </div>
        <Button variant="outline" onClick={fetchReportedContent} className="border-reef text-reef hover:bg-reef/10 rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <Tabs defaultValue="pets" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl">
          <TabsTrigger value="pets" className="flex gap-2 rounded-lg">
            <Heart className="w-4 h-4" /> Pets ({reportedPets.length})
          </TabsTrigger>
          <TabsTrigger value="products" className="flex gap-2 rounded-lg">
            <Package className="w-4 h-4" /> Products ({reportedProducts.length})
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex gap-2 rounded-lg">
            <MessageSquare className="w-4 h-4" /> Comments ({reportedComments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pets">
          {reportedPets.length === 0 ? (
            <Card className="border-border rounded-2xl">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-ocean mb-2">No reported pets</h3>
                <p className="text-muted-foreground">All pet listings are clean!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reportedPets.map((item) => (
                <Card key={item.id} className="border-border rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-ocean">{item.title || 'Pet Listing'}</h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Reported by: {item.reporter_name || 'Anonymous'}
                        </p>
                        <p className="text-sm">Reason: {item.reason || 'No reason provided'}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-orange-500 text-orange-500 hover:bg-orange-50 rounded-xl"
                          onClick={() => {
                            setSelectedItem(item);
                            setActionType('hide');
                            setDialogOpen(true);
                          }}
                        >
                          <Ban className="w-4 h-4 mr-1" /> Hide
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="rounded-xl"
                          onClick={() => {
                            setSelectedItem(item);
                            setActionType('delete');
                            setDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="products">
          {reportedProducts.length === 0 ? (
            <Card className="border-border rounded-2xl">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-ocean mb-2">No reported products</h3>
                <p className="text-muted-foreground">All product listings are clean!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reportedProducts.map((item) => (
                <Card key={item.id} className="border-border rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-ocean">{item.title || 'Product Listing'}</h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Reported by: {item.reporter_name || 'Anonymous'}
                        </p>
                        <p className="text-sm">Reason: {item.reason || 'No reason provided'}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-orange-500 text-orange-500 hover:bg-orange-50 rounded-xl"
                          onClick={() => {
                            setSelectedItem(item);
                            setActionType('hide');
                            setDialogOpen(true);
                          }}
                        >
                          <Ban className="w-4 h-4 mr-1" /> Hide
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="rounded-xl"
                          onClick={() => {
                            setSelectedItem(item);
                            setActionType('delete');
                            setDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments">
          {reportedComments.length === 0 ? (
            <Card className="border-border rounded-2xl">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-ocean mb-2">No reported comments</h3>
                <p className="text-muted-foreground">All comments are clean!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reportedComments.map((item) => (
                <Card key={item.id} className="border-border rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-sm">{item.content || 'Comment content'}</p>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Reported by: {item.reporter_name || 'Anonymous'}
                        </p>
                        <p className="text-sm">Reason: {item.reason || 'No reason provided'}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="rounded-xl"
                          onClick={() => {
                            setSelectedItem(item);
                            setActionType('delete');
                            setDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-ocean">Confirm Moderation Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType === 'hide' ? 'hide' : 'delete'} this content?
              {actionType === 'delete' && " This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button 
              onClick={() => selectedItem && handleModerate('pet', selectedItem.id, actionType)}
              className={actionType === 'delete' ? 'bg-red-500 hover:bg-red-600 rounded-xl' : 'bg-blue-500 hover:bg-blue-600 rounded-xl'}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminModeration;