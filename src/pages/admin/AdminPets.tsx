import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Eye, Trash2, Loader2, Ban, RefreshCw,
  Package, AlertCircle, CheckCircle, XCircle, Heart, MapPin, Calendar, DollarSign
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

interface Pet {
  id: string;
  name: string;
  category: string;
  breed: string;
  price: number;
  status: string;
  seller_id: string;
  seller_name?: string;
  seller_email?: string;
  created_at: string;
  primary_image: string | null;
  city?: string;
  state?: string;
  age_years?: number;
  age_months?: number;
  gender?: string;
  vaccinated?: boolean;
  description?: string;
}

const AdminPets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchPets();
  }, [search, statusFilter, categoryFilter]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('pawdeal_token');
      let url = 'http://localhost:5000/api/admin/pets?';
      if (search) url += `search=${search}&`;
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (categoryFilter !== 'all') url += `category=${categoryFilter}&`;
      
      console.log('Fetching pets from:', url);
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Pets API Response:', data);
      
      if (data.success && data.data) {
        setPets(data.data);
      } else {
        setPets([]);
        toast.info(data.message || 'No pets found');
      }
    } catch (error) {
      console.error('Failed to fetch pets:', error);
      toast.error('Failed to load pets');
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModeratePet = async (petId: string, action: string) => {
    try {
      const token = localStorage.getItem('pawdeal_token');
      const response = await fetch(`http://localhost:5000/api/admin/pets/${petId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Pet ${action === 'hide' ? 'hidden' : action === 'delete' ? 'deleted' : 'restored'}`);
        fetchPets();
        setDialogOpen(false);
      } else {
        toast.error(data.error || 'Failed to moderate pet');
      }
    } catch (error) {
      toast.error('Failed to moderate pet');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500 rounded-full">Available</Badge>;
      case 'sold':
        return <Badge className="bg-blue-500 rounded-full">Sold</Badge>;
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
    
    // If it's already a full URL with http
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it starts with /uploads, add base URL
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    // If it's just a filename
    const filename = imagePath.split('/').pop();
    return `http://localhost:5000/uploads/pets/${filename}`;
  };

  const totalPets = pets.length;
  const availablePets = pets.filter(p => p.status === 'available').length;
  const soldPets = pets.filter(p => p.status === 'sold').length;

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
        <h1 className="text-3xl font-extrabold text-ocean">Pet Management</h1>
        <p className="text-muted-foreground mt-1">Moderate and manage all pet listings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-border rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pets</p>
                <p className="text-2xl font-bold text-ocean">{totalPets}</p>
              </div>
              <div className="w-10 h-10 bg-ocean/10 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-ocean" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-green-600">{availablePets}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sold</p>
                <p className="text-2xl font-bold text-blue-600">{soldPets}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-500" />
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
                placeholder="Search pets by name..."
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[150px] border-border rounded-xl">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="dog">Dogs</SelectItem>
                <SelectItem value="cat">Cats</SelectItem>
                <SelectItem value="bird">Birds</SelectItem>
                <SelectItem value="fish">Fish</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchPets} className="border-reef text-reef hover:bg-reef/10 rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <Card className="border-border rounded-2xl">
          <CardContent className="p-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ocean mb-2">No pets found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <Card 
              key={pet.id} 
              className="border-border rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
              onClick={() => { setSelectedPet(pet); setViewDialogOpen(true); }}
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-ocean/20 to-reef/20">
                <img
                  src={getImageUrl(pet.primary_image)}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/400x300?text=No+Image';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Link to={`/pet/${pet.id}`} target="_blank" onClick={(e) => e.stopPropagation()}>
                    <Button variant="secondary" size="icon" className="bg-white/90 rounded-full">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-ocean">{pet.name}</h3>
                  <span className="text-lg font-bold text-reef">${pet.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <Badge variant="outline" className="rounded-full">{pet.category}</Badge>
                  {getStatusBadge(pet.status)}
                </div>
                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                  <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {pet.city || 'Unknown'}</p>
                  <p className="flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" /> Listed: {new Date(pet.created_at).toLocaleDateString()}</p>
                  <p className="flex items-center gap-1 mt-1">Seller: {pet.seller_name || 'Unknown'}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Pet Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-ocean">Pet Details - {selectedPet?.name}</DialogTitle>
          </DialogHeader>
          {selectedPet && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={getImageUrl(selectedPet.primary_image)}
                    alt={selectedPet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/400x300?text=No+Image';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-ocean">{selectedPet.name}</h2>
                  <p className="text-reef font-bold text-lg">${selectedPet.price}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{selectedPet.category}</Badge>
                    {getStatusBadge(selectedPet.status)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Breed</p>
                  <p className="font-medium">{selectedPet.breed || 'N/A'}</p>
                </div>
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{selectedPet.age_years || 0} years {selectedPet.age_months || 0} months</p>
                </div>
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{selectedPet.gender || 'Unknown'}</p>
                </div>
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedPet.city || 'Unknown'}, {selectedPet.state || ''}</p>
                </div>
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <p className="font-medium">{selectedPet.seller_name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{selectedPet.seller_email}</p>
                </div>
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Listed Date</p>
                  <p className="font-medium">{new Date(selectedPet.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {selectedPet.description && (
                <div className="p-3 bg-foam rounded-xl">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedPet.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="rounded-xl">Close</Button>
            {selectedPet && selectedPet.status !== 'hidden' && (
              <Button 
                className="bg-red-500 hover:bg-red-600 rounded-xl"
                onClick={() => {
                  setSelectedPet(selectedPet);
                  setActionType('hide');
                  setDialogOpen(true);
                  setViewDialogOpen(false);
                }}
              >
                <Ban className="w-4 h-4 mr-2" /> Hide Pet
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
              Are you sure you want to {actionType === 'hide' ? 'hide' : actionType === 'delete' ? 'delete' : 'restore'} "{selectedPet?.name}"?
              {actionType === 'delete' && " This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button 
              onClick={() => selectedPet && handleModeratePet(selectedPet.id, actionType)}
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

export default AdminPets;