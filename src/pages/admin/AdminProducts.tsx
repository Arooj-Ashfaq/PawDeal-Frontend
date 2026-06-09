import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Eye, Trash2, Loader2, Ban, RefreshCw,
  Package, DollarSign, Calendar, User, MapPin, 
  ShoppingBag, CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  status: string;
  seller_id: string;
  seller_name?: string;
  seller_email?: string;
  created_at: string;
  primary_image: string | null;
  description?: string;
  brand?: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search, statusFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('pawdeal_token');
      let url = 'http://localhost:5000/api/admin/products?';
      if (search) url += `search=${search}&`;
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      
      console.log('Fetching products from:', url);
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Products API Response:', data);
      
      if (data.success && data.data) {
        setProducts(data.data);
      } else {
        setProducts([]);
        toast.info(data.message || 'No products found');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModerateProduct = async (productId: string, action: string) => {
    try {
      const token = localStorage.getItem('pawdeal_token');
      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Product ${action === 'hide' ? 'hidden' : action === 'delete' ? 'deleted' : 'restored'}`);
        fetchProducts();
        setDialogOpen(false);
      } else {
        toast.error(data.error || 'Failed to moderate product');
      }
    } catch (error) {
      toast.error('Failed to moderate product');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 rounded-full">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500 rounded-full">Inactive</Badge>;
      case 'hidden':
        return <Badge className="bg-red-500 rounded-full">Hidden</Badge>;
      default:
        return <Badge variant="secondary" className="rounded-full">{status}</Badge>;
    }
  };

  // Fixed: Convert image path to full URL
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) {
      return 'https://placehold.co/400x300?text=No+Image';
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    const filename = imagePath.split('/').pop();
    return `http://localhost:5000/uploads/products/${filename}`;
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock_quantity || 0)), 0);

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
        <h1 className="text-3xl font-extrabold text-ocean">Product Management</h1>
        <p className="text-muted-foreground mt-1">Moderate and manage all product listings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-border rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-ocean">{totalProducts}</p>
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
                <p className="text-sm text-muted-foreground">Total Stock</p>
                <p className="text-2xl font-bold text-blue-600">{totalStock}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
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
                placeholder="Search products by name..."
                className="pl-10 border-border rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px] border-border rounded-xl">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchProducts} className="border-reef text-reef hover:bg-reef/10 rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card className="border-border rounded-2xl">
          <CardContent className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ocean mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="border-border rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
              onClick={() => { setSelectedProduct(product); setViewDialogOpen(true); }}
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-ocean/20 to-reef/20">
                <img
                  src={getImageUrl(product.primary_image)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/400x300?text=No+Image';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Link to={`/product/${product.id}`} target="_blank" onClick={(e) => e.stopPropagation()}>
                    <Button variant="secondary" size="icon" className="bg-white/90 rounded-full">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                {product.stock_quantity === 0 && (
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-red-500 rounded-full">Out of Stock</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-ocean line-clamp-1">{product.name}</h3>
                  <span className="text-lg font-bold text-reef">${product.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <Badge variant="outline" className="rounded-full">{product.category}</Badge>
                  {getStatusBadge(product.status)}
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3" /> Stock: {product.stock_quantity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Product Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-ocean">Product Details - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={getImageUrl(selectedProduct.primary_image)}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/400x300?text=No+Image';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-ocean">{selectedProduct.name}</h2>
                  <p className="text-reef font-bold text-lg">${selectedProduct.price}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{selectedProduct.category}</Badge>
                    {getStatusBadge(selectedProduct.status)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Brand</p>
                  <p className="font-medium">{selectedProduct.brand || 'N/A'}</p>
                </div>
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Stock Quantity</p>
                  <p className="font-medium">{selectedProduct.stock_quantity} units</p>
                </div>
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <p className="font-medium">{selectedProduct.seller_name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{selectedProduct.seller_email}</p>
                </div>
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Listed Date</p>
                  <p className="font-medium">{new Date(selectedProduct.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {selectedProduct.description && (
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedProduct.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="rounded-xl">Close</Button>
            {selectedProduct && selectedProduct.status !== 'hidden' && (
              <Button 
                className="bg-red-500 hover:bg-red-600 rounded-xl"
                onClick={() => {
                  setSelectedProduct(selectedProduct);
                  setActionType('hide');
                  setDialogOpen(true);
                  setViewDialogOpen(false);
                }}
              >
                <Ban className="w-4 h-4 mr-2" /> Hide Product
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-ocean">Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType === 'hide' ? 'hide' : actionType === 'delete' ? 'delete' : 'restore'} "{selectedProduct?.name}"?
              {actionType === 'delete' && " This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button 
              onClick={() => selectedProduct && handleModerateProduct(selectedProduct.id, actionType)}
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

export default AdminProducts;