import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { pets, messages, favorites } from '@/services/api';
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
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPet();
    }
  }, [id]);

  useEffect(() => {
    if (pet && user) {
      checkFavoriteStatus();
    }
  }, [pet, user]);

  // Fixed: Handle image URLs from backend
  const getImageUrl = (url: string) => {
    if (!url) return '';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it starts with /uploads, add the base URL
    if (url.startsWith('/uploads')) {
      return `http://localhost:5000${url}`;
    }
    
    // If it's just a filename, construct the path
    const filename = url.split('/').pop();
    return `http://localhost:5000/uploads/pets/${filename}`;
  };

  // Fixed: Correctly parse the API response which has { success: true, pet: {...} }
  const fetchPet = async () => {
    setLoading(true);
    try {
      const response: any = await pets.getById(id!);
      // The pet data is directly under the 'pet' key
      const petData = response.pet || response.data || response;
      setPet(petData);
      
      // Set the selected image
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

  const checkFavoriteStatus = async () => {
    if (!user || !pet) return;
    try {
      const token = localStorage.getItem('pawdeal_token');
      if (!token) return;
      const response = await favorites.check(token, pet.id);
      setIsFavorite(response.is_favorite);
    } catch (error) {
      console.error('Check favorite error:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }
    
    if (!pet) return;
    
    setFavoriteLoading(true);
    try {
      const token = localStorage.getItem('pawdeal_token');
      if (!token) throw new Error('No token');
      
      if (isFavorite) {
        await favorites.remove(token, pet.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await favorites.add(token, pet.id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error: any) {
      console.error('Toggle favorite error:', error);
      toast.error(error.message || 'Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
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

  const handleMessageSeller = async () => {
    if (!user) {
      toast.error('Please login to message the seller');
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }
    
    if (!pet) return;
    
    try {
      const token = localStorage.getItem('pawdeal_token');
      if (!token) return;
      
      const response: any = await messages.createConversation(
        token,
        pet.seller_id,
        `Hi, I'm interested in your pet "${pet.name}". Is it still available?`,
        pet.id
      );
      
      const conversationId = response.conversation?.id || response.id;
      if (conversationId) {
        navigate(`/messages/${conversationId}`);
      } else {
        navigate('/messages');
      }
    } catch (error: any) {
      console.error('Failed to create conversation:', error);
      toast.error(error.message || 'Failed to start conversation');
      navigate('/messages');
    }
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
                  onError={(e) => {
                    // Fallback: try the API endpoint
                    const target = e.target as HTMLImageElement;
                    const filename = selectedImage.split('/').pop();
                    target.src = `http://localhost:5000/api/images/pets/${filename}`;
                  }}
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
                    onClick={handleToggleFavorite}
                    disabled={favoriteLoading}
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
                className={`w-full h-12 gap-2 transition-all ${isAdded ? 'bg-sunlight hover:bg-sunlight/80 text-white' : 'bg-reef hover:bg-reef/90 text-white'}`}
              >
                {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
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