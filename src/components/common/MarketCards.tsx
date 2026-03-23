import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const PetCard: React.FC<{ pet: any }> = ({ pet }) => {
  const { toggleFavorite, favorites } = useMarketplace();
  const { user } = useAuth();
  const isFavorite = favorites.includes(pet.id);

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    toggleFavorite(pet.id);
  };

  return (
    <Link to={`/pet/${pet.id}`} className="group block">
      <Card className="overflow-hidden border-border rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 group">
        <div className="aspect-[4/5] relative overflow-hidden">
          <img 
            src={pet.image} 
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 right-4 z-10">
            <Button 
              type="button"
              variant="secondary" 
              size="icon" 
              className={cn(
                "rounded-full bg-white/80 backdrop-blur-sm transition-all hover:scale-110 shadow-lg",
                isFavorite ? "text-reef" : "text-muted-foreground"
              )}
              onClick={handleToggleFav}
            >
              <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
            </Button>
          </div>
          <div className="absolute bottom-4 left-4">
             <Badge className="bg-white/90 backdrop-blur-sm text-ocean border-none font-extrabold uppercase tracking-widest text-[10px] px-3 py-1 shadow-sm">{pet.breed}</Badge>
          </div>
        </div>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-extrabold text-ocean group-hover:text-reef transition-colors">{pet.name}</h3>
            <span className="text-xl font-black text-reef">${pet.price.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
             <MapPin className="w-3 h-3 text-tropical" /> {pet.location}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 font-medium">{pet.description}</p>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
           <div className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>{pet.age} • {pet.gender}</span>
              <span className="text-tropical flex items-center gap-1 group-hover:gap-2 transition-all">View Details <ArrowRight className="w-3 h-3" /></span>
           </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to shop');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    toast.success('Added to cart!');
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <Card className="overflow-hidden border-border rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 bg-white">
        <div className="aspect-square relative overflow-hidden bg-foam p-4">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
          />
          {product.sale && (
             <div className="absolute top-4 left-4">
                <Badge className="bg-reef text-white border-none font-black uppercase tracking-widest text-[10px]">SALE</Badge>
             </div>
          )}
          <div className="absolute bottom-4 right-4 z-10 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             <Button 
               type="button"
               size="icon" 
               className="rounded-full bg-tropical text-white hover:bg-tropical/90 shadow-xl"
               onClick={handleAddToCart}
             >
                <ShoppingBag className="w-5 h-5" />
             </Button>
          </div>
        </div>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-1 text-sunlight text-xs">
             <Star className="w-3 h-3 fill-current" />
             <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-widest ml-1">{product.rating} (120 reviews)</span>
          </div>
          <h3 className="text-lg font-extrabold text-ocean group-hover:text-reef transition-colors line-clamp-2 leading-snug">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-ocean">${product.price.toFixed(2)}</span>
            {product.sale && <span className="text-sm text-muted-foreground line-through font-bold">${(product.price * 1.2).toFixed(2)}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
