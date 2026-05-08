import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { pets } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, MapPin, Calendar, CheckCircle, 
  MessageSquare, Share2, ArrowLeft, 
  ShieldCheck, User, Loader2, ShoppingBag,
  Minus, Plus, Check
} from 'lucide-react';
import { toast } from 'sonner';

interface Pet {
  id: string;
  name: string;
  category: string;
  breed: string;
  age_years: number;
  age_months: number;
  gender: string;
  price: number;
  description: string;
  health_status: string;
  vaccinated: number;
  dewormed: number;
  neutered: number;
  microchipped: number;
  registration_papers: number;
  color: string;
  weight_kg: number;
  city: string;
  state: string;
  country: string;
  status: string;
  seller_id: string;
  seller_name: string;
  seller_email: string;
  seller_phone: string;
  seller_image: string;
  images: Array<{ image_url: string; is_primary: number }>;
  primary_image: string;
  created_at: string;
}

const PetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPet();
    }
  }, [id]);

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const cleanPath = url.replace(/\\/g, '/');
    const filename = cleanPath.split('/').pop();
    return `http://localhost:5000/uploads/pets/${filename}`;
  };

  const fetchPet = async () => {
    setLoading(true);
    try {
      const response: any = await pets.getById(id!);
      const petData = response.pet || response.data || response;
      setPet(petData);
      
      if (petData.images && petData.images.length > 0) {
        const primary = petData.images.find((img: any) => img.is_primary === 1);
        setSelectedImage(primary ? primary.image_url : petData.images[0].image_url);
      } else if (petData.primary_image) {
        setSelectedImage(petData.primary_image);
      }
    } catch (error: any) {
      console.error('Failed to fetch pet:', error);
      toast.error(error.message || 'Failed to load pet details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    
    if (!pet) return;
    
    const priceNum = typeof pet.price === 'number' ? pet.price : parseFloat(String(pet.price)) || 0;
    
    const existingCart = localStorage.getItem('pawdeal_cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];
    
    const existingIndex = cart.findIndex((item: any) => item.id === pet.id);
    
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: pet.id,
        name: pet.name,
        price: priceNum,
        quantity: quantity,
        image: pet.primary_image,
        category: pet.category,
        type: 'pet'
      });
    }
    
    localStorage.setItem('pawdeal_cart', JSON.stringify(cart));
    setIsAdded(true);
    toast.success(`${quantity} x ${pet.name} added to cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleMessageSeller = () => {
    if (!user) {
      toast.error('Please login to message the seller');
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }
    navigate(`/messages/new?seller=${pet?.seller_id}&pet=${pet?.id}`);
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
        <p className="mt-4 text-muted-foreground">Loading pet details...</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-ocean">Pet not found</h2>
        <Button className="mt-4" onClick={() => navigate('/pets')}>
          Browse Pets
        </Button>
      </div>
    );
  }

  const mainImageUrl = getImageUrl(selectedImage);

  return (
    <div className="pb-20">
      <div className="container px-4 py-8">
        <Link to="/pets" className="inline-flex items-center gap-2 text-muted-foreground hover:text-reef mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Photos */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted relative">
              {mainImageUrl ? (
                <img
                  src={mainImageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-foam">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
            </div>
            {(pet.images && pet.images.length > 1) && (
              <div className="grid grid-cols-4 gap-4">
                {pet.images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer hover:ring-2 ${selectedImage === img.image_url ? 'ring-2 ring-reef' : 'ring-0'}`}
                    onClick={() => setSelectedImage(img.image_url)}
                  >
                    <img
                      src={getImageUrl(img.image_url)}
                      alt={`${pet.name} thumb ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-extrabold text-ocean">{pet.name}</h1>
                <div className="flex gap-2">
                  <Button type="button" onClick={() => {}} variant="ghost" size="icon" className="rounded-full">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full ${isFavorite ? "text-reef" : ""}`}
                    onClick={() => {
                      if (!user) {
                        toast.error('Please login to save favorites');
                        navigate('/login?redirect=' + window.location.pathname);
                        return;
                      }
                      setIsFavorite(!isFavorite);
                      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
                    }}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current text-reef" : ""}`} />
                  </Button>
                </div>
              </div>
              <p className="text-2xl font-bold text-reef">${pet.price}</p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Badge variant="secondary" className="bg-foam text-ocean flex gap-1 px-3 py-1">
                  <Calendar className="w-3 h-3" /> {formatAge(pet.age_years, pet.age_months)}
                </Badge>
                <Badge variant="secondary" className="bg-foam text-ocean flex gap-1 px-3 py-1">
                  <User className="w-3 h-3" /> {pet.gender}
                </Badge>
                <Badge variant="secondary" className="bg-foam text-ocean flex gap-1 px-3 py-1">
                  <MapPin className="w-3 h-3" /> {pet.city}, {pet.state}
                </Badge>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    className="px-3 py-2 hover:bg-foam"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
                  <button
                    className="px-3 py-2 hover:bg-foam"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <Button 
                onClick={handleAddToCart} 
                className={`w-full h-12 gap-2 transition-all ${isAdded ? 'text-reef border-reef bg-white hover:bg-reef/10' : 'bg-reef hover:bg-reef/90 text-white'}`}
              >
                {isAdded ? <Check className="w-5 h-5 text-reef" /> : <ShoppingBag className="w-5 h-5" />}
                {isAdded ? 'Added to Cart!' : 'Add to Cart'}
              </Button>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleMessageSeller} className="flex-1 bg-reef hover:bg-reef/90 text-white h-14 text-lg font-bold gap-2">
                <MessageSquare className="w-5 h-5" /> Message Seller
              </Button>
            </div>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                  <img src={pet.seller_image || `https://i.pravatar.cc/150?u=${pet.seller_id}`} alt="Seller" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">{pet.seller_name || 'Pet Owner'}</h4>
                  <p className="text-xs text-muted-foreground">{pet.seller_email}</p>
                </div>
                <Button type="button" onClick={() => navigate(`/seller/${pet.seller_id}`)} variant="ghost" className="text-tropical font-bold">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-foam p-1">
                <TabsTrigger value="description" className="data-[state=active]:bg-white data-[state=active]:text-reef">Description</TabsTrigger>
                <TabsTrigger value="health" className="data-[state=active]:bg-white data-[state=active]:text-reef">Health Records</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-6 text-muted-foreground leading-relaxed">
                {pet.description || 'No description provided.'}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {pet.vaccinated === 1 && (
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-success" /> Fully Vaccinated
                    </div>
                  )}
                  {pet.dewormed === 1 && (
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-success" /> Dewormed
                    </div>
                  )}
                  {pet.neutered === 1 && (
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-success" /> Neutered/Spayed
                    </div>
                  )}
                  {pet.microchipped === 1 && (
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-success" /> Microchipped
                    </div>
                  )}
                  {pet.registration_papers === 1 && (
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-success" /> Registration Papers
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="health" className="py-6">
                <ul className="space-y-3">
                  {pet.health_status && (
                    <li className="flex items-center gap-3 p-3 bg-foam rounded-lg text-ocean">
                      <CheckCircle className="w-5 h-5 text-success" />
                      Health Status: {pet.health_status}
                    </li>
                  )}
                  <li className="flex items-center gap-3 p-3 bg-foam rounded-lg text-ocean">
                    <CheckCircle className="w-5 h-5 text-success" />
                    Color: {pet.color || 'Not specified'}
                  </li>
                  {pet.weight_kg > 0 && (
                    <li className="flex items-center gap-3 p-3 bg-foam rounded-lg text-ocean">
                      <CheckCircle className="w-5 h-5 text-success" />
                      Weight: {pet.weight_kg} kg
                    </li>
                  )}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;