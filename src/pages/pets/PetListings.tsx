import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { pets } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, PlusCircle, Heart, PawPrint, Loader2, ShoppingBag, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Pet {
  id: string;
  name: string;
  price: number;
  category: string;
  breed: string;
  gender: string;
  age_years: number;
  age_months: number;
  status: string;
  primary_image: string | null;
  seller_name: string;
  vaccinated: boolean;
}

const PetListings: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [petList, setPetList] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [gender, setGender] = useState('all');
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPets();
  }, [category, search, sortBy, gender]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response: any = await pets.getAll();
      let filtered = response.data || response.pets || [];
      
      if (category) {
        filtered = filtered.filter((p: any) => p.category === category);
      }
      
      if (search) {
        filtered = filtered.filter((p: any) => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.breed?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (gender !== 'all') {
        filtered = filtered.filter((p: any) => p.gender === gender);
      }
      
      if (sortBy === 'price_asc') {
        filtered.sort((a: any, b: any) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        filtered.sort((a: any, b: any) => b.price - a.price);
      } else if (sortBy === 'age_asc') {
        filtered.sort((a: any, b: any) => (a.age_years * 12 + a.age_months) - (b.age_years * 12 + b.age_months));
      } else {
        filtered.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      }
      
      setPetList(filtered);
    } catch (error: any) {
      console.error('Failed to fetch pets:', error);
      toast.error(error.message || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (pet: Pet) => {
    if (!user) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    
    const priceNum = typeof pet.price === 'number' ? pet.price : parseFloat(String(pet.price)) || 0;
    
    const existingCart = localStorage.getItem('pawdeal_cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];
    
    const existingIndex = cart.findIndex((item: any) => item.id === pet.id);
    
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: pet.id,
        name: pet.name,
        price: priceNum,
        quantity: 1,
        image: pet.primary_image,
        category: pet.category,
        type: 'pet'
      });
    }
    
    localStorage.setItem('pawdeal_cart', JSON.stringify(cart));
    
    setAddedItems(prev => new Set(prev).add(pet.id));
    toast.success(`${pet.name} added to cart!`);
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(pet.id);
        return newSet;
      });
    }, 2000);
  };

  const formatAge = (years: number, months: number) => {
    if (years === 0 && months === 0) return 'Newborn';
    if (years === 0) return `${months} month${months > 1 ? 's' : ''}`;
    if (months === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} yr ${months} mo`;
  };

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-reef" />
        <p className="mt-4 text-muted-foreground">Loading pets...</p>
      </div>
    );
  }

  return (
    <div className="bg-foam min-h-screen py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-ocean">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}s` : 'All Pets'}
            </h1>
            <p className="text-muted-foreground mt-2">Find your perfect furry companion</p>
          </div>

          {user && (
            <Link to="/pets/create">
              <Button className="bg-reef hover:bg-reef/90 text-white">
                <PlusCircle className="w-4 h-4 mr-2" /> Add New Pet
              </Button>
            </Link>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pets by name or breed..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="age_asc">Age: Youngest First</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {petList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-border">
            <PawPrint className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-ocean mb-2">No pets found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {petList.map((pet) => {
              const isAdded = addedItems.has(pet.id);
              return (
                <Link to={`/pet/${pet.id}`} key={pet.id}>
                  <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 rounded-2xl">
                    <div className="relative h-48 overflow-hidden bg-foam">
                      <img
                        src={pet.primary_image ? `http://localhost:5000${pet.primary_image}` : `https://placehold.co/400x300`}
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {pet.vaccinated && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                          Vaccinated
                        </Badge>
                      )}
                      {pet.status === 'sold' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge className="bg-red-500 text-white">Sold</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {pet.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground capitalize">{pet.gender}</span>
                      </div>
                      <h3 className="font-bold text-ocean mb-1 line-clamp-1">{pet.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {pet.breed || 'Mixed Breed'} • {formatAge(pet.age_years, pet.age_months)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-reef">${pet.price}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-reef/10 hover:text-reef"
                            onClick={(e) => {
                              e.preventDefault();
                              toast.info('Login to add to favorites');
                            }}
                          >
                            <Heart className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full hover:scale-110 transition-all ${isAdded ? 'bg-green-500 text-white' : 'hover:bg-reef/10 hover:text-reef'}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(pet);
                            }}
                          >
                            {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetListings;