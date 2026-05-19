import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, ShoppingBag, ArrowRight, Star, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const PetCard: React.FC<{ pet: any }> = ({ pet }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !pet.id) return;
      try {
        const token = localStorage.getItem('pawdeal_token');
        if (!token) return;
        const response = await fetch(`http://localhost:5000/api/favorites/check/pet/${pet.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setIsFavorite(data.is_favorited === true);
      } catch (error) {
        console.error('Check favorite error:', error);
      }
    };
    checkFavorite();
  }, [user, pet.id]);

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('pawdeal_token');
      if (!token) throw new Error('No token');
      if (isFavorite) {
        await fetch(`http://localhost:5000/api/favorites/pet/${pet.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await fetch(`http://localhost:5000/api/favorites/pet/${pet.id}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error: any) {
      console.error('Toggle favorite error:', error);
      toast.error(error.message || 'Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    
    const priceNum = typeof pet.price === 'number' ? pet.price : parseFloat(pet.price) || 0;
    
    const existingCart = localStorage.getItem('pawdeal_cart');
    let cart = [];
    
    if (existingCart) {
      try {
        cart = JSON.parse(existingCart);
      } catch (error) {
        console.error('Error parsing cart:', error);
        cart = [];
      }
    }
    
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
    setIsAdded(true);
    toast.success(`${pet.name} added to cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Fixed: Handle all image URL formats
  const getImageUrl = () => {
    if (!pet.primary_image) {
      return 'https://placehold.co/400x400?text=Pet';
    }
    
    // If it's already a full URL
    if (pet.primary_image.startsWith('http')) {
      return pet.primary_image;
    }
    
    // If it starts with /uploads
    if (pet.primary_image.startsWith('/uploads')) {
      return `http://localhost:5000${pet.primary_image}`;
    }
    
    // If it's just a filename or other format
    const filename = pet.primary_image.split('/').pop();
    return `http://localhost:5000/uploads/pets/${filename}`;
  };

  const formatPrice = (price: any) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return isNaN(numPrice) ? '0' : numPrice.toLocaleString();
  };

  return (
    <Link to={`/pet/${pet.id}`} className="group block">
      <Card className="overflow-hidden border-border rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 group">
        <div className="aspect-[4/5] relative overflow-hidden">
          <img 
            src={getImageUrl()} 
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/400x400?text=Pet';
            }}
          />
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button 
              type="button"
              variant="secondary" 
              size="icon" 
              className={cn(
                "rounded-full bg-white/80 backdrop-blur-sm transition-all hover:scale-110 shadow-lg",
                isFavorite ? "text-reef" : "text-muted-foreground"
              )}
              onClick={handleToggleFav}
              disabled={loading}
            >
              <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
            </Button>
            <Button 
              type="button"
              variant="secondary" 
              size="icon" 
              className={`rounded-full bg-white/80 backdrop-blur-sm transition-all hover:scale-110 shadow-lg ${isAdded ? 'bg-green-500 text-white' : 'text-tropical hover:text-white hover:bg-tropical'}`}
              onClick={handleAddToCart}
            >
              {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            </Button>
          </div>
          <div className="absolute bottom-4 left-4">
             <Badge className="bg-white/90 backdrop-blur-sm text-ocean border-none font-extrabold uppercase tracking-widest text-[10px] px-3 py-1 shadow-sm">{pet.breed || pet.category}</Badge>
          </div>
        </div>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-extrabold text-ocean group-hover:text-reef transition-colors">{pet.name}</h3>
            <span className="text-xl font-black text-reef">${formatPrice(pet.price)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
             <MapPin className="w-3 h-3 text-tropical" /> {pet.city || pet.location || 'Unknown Location'}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 font-medium">{pet.description || 'No description available'}</p>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
           <div className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>{pet.age || `${pet.age_years || 0} years`} • {pet.gender || 'Unknown'}</span>
              <span className="text-tropical flex items-center gap-1 group-hover:gap-2 transition-all">View Details <ArrowRight className="w-3 h-3" /></span>
           </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { user } = useAuth();
  const [isAdded, setIsAdded] = useState(false);

  const safePrice = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    
    const existingCart = localStorage.getItem('pawdeal_cart');
    let cart = [];
    
    if (existingCart) {
      try {
        cart = JSON.parse(existingCart);
      } catch (error) {
        console.error('Error parsing cart:', error);
        cart = [];
      }
    }
    
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: safePrice,
        quantity: 1,
        image: product.primary_image || product.image,
        category: product.category,
        type: 'product'
      });
    }
    
    localStorage.setItem('pawdeal_cart', JSON.stringify(cart));
    setIsAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const getImageUrl = () => {
    const imagePath = product.primary_image || product.image;
    if (!imagePath) return 'https://placehold.co/400x400?text=Product';
    
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
    
    const filename = imagePath.split('/').pop();
    return `http://localhost:5000/uploads/products/${filename}`;
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <Card className="overflow-hidden border-border rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 bg-white">
        <div className="aspect-square relative overflow-hidden bg-foam p-4">
          <img 
            src={getImageUrl()} 
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/400x400?text=Product';
            }}
          />
          {product.sale_price && (
             <div className="absolute top-4 left-4">
                <Badge className="bg-reef text-white border-none font-black uppercase tracking-widest text-[10px]">SALE</Badge>
             </div>
          )}
          <div className="absolute bottom-4 right-4 z-10 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             <Button 
               type="button"
               size="icon" 
               className={`rounded-full shadow-xl ${isAdded ? 'bg-green-500 text-white' : 'bg-tropical text-white hover:bg-tropical/90'}`}
               onClick={handleAddToCart}
             >
                {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
             </Button>
          </div>
        </div>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-1 text-sunlight text-xs">
             <Star className="w-3 h-3 fill-current" />
             <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-widest ml-1">{product.rating || 4.5} (120 reviews)</span>
          </div>
          <h3 className="text-lg font-extrabold text-ocean group-hover:text-reef transition-colors line-clamp-2 leading-snug">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-ocean">${safePrice.toFixed(2)}</span>
            {product.sale_price && <span className="text-sm text-muted-foreground line-through font-bold">${(safePrice * 1.2).toFixed(2)}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};