import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/common/PageCollection';
import { Link, useNavigate } from 'react-router-dom';
import { PetCard } from '@/components/common/MarketCards';
import { favorites as favoritesAPI, pets as petsAPI } from '@/services/api';
import { Heart, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Favorites: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [favoritePets, setFavoritePets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to view your favorites');
      navigate('/login?redirect=/favorites');
      return;
    }
    
    if (user) {
      fetchFavorites();
    }
  }, [user, authLoading, navigate]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('pawdeal_token');
      if (!token) return;
      
      // Get favorite IDs from backend
      const favResponse: any = await favoritesAPI.getAll(token);
      const favoriteItems = favResponse?.data || favResponse?.favorites || [];
      const favoriteIds = favoriteItems.map((item: any) => item.pet_id || item.id);
      
      if (favoriteIds.length === 0) {
        setFavoritePets([]);
        setLoading(false);
        return;
      }
      
      // Fetch full pet details for each favorite
      const petPromises = favoriteIds.map((id: string) => petsAPI.getById(id));
      const petResponses = await Promise.all(petPromises);
      const petsData = petResponses.map((res: any) => res.pet || res.data || res);
      
      setFavoritePets(petsData);
    } catch (error: any) {
      console.error('Failed to fetch favorites:', error);
      toast.error(error.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="pb-20 bg-foam">
      <PageHeader 
        title="Your Favorites" 
        description={`You have ${favoritePets.length} items saved to your collection.`}
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Favorites' }]}
      />
      
      <div className="container px-4">
        <Tabs defaultValue="pets" className="w-full">
          <TabsList className="bg-white p-1 rounded-2xl h-14 border border-border shadow-sm mb-12 flex justify-start w-fit">
            <TabsTrigger value="pets" className="rounded-xl data-[state=active]:bg-ocean data-[state=active]:text-white font-bold h-full px-8">Saved Pets ({favoritePets.length})</TabsTrigger>
            <TabsTrigger value="products" className="rounded-xl data-[state=active]:bg-ocean data-[state=active]:text-white font-bold h-full px-8">Saved Products (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="pets">
             {favoritePets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                   {favoritePets.map(pet => (
                      <PetCard key={pet.id} pet={pet} />
                   ))}
                </div>
             ) : (
                <div className="py-32 text-center bg-white rounded-[3rem] shadow-2xl border border-border">
                   <Heart className="w-20 h-20 text-muted-foreground opacity-10 mx-auto mb-8" />
                   <h2 className="text-4xl font-extrabold text-ocean mb-4 tracking-tighter">No pets saved yet</h2>
                   <p className="text-muted-foreground max-w-sm mx-auto mb-12 text-lg">Browse our pet directory and save the ones you love!</p>
                   <Button asChild size="lg" className="bg-reef hover:bg-reef/90 text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl">
                      <Link to="/pets">Browse Pets <ArrowRight className="ml-2 w-5 h-5" /></Link>
                   </Button>
                </div>
             )}
          </TabsContent>

          <TabsContent value="products">
             <div className="py-32 text-center bg-white rounded-[3rem] shadow-2xl border border-border">
                <ShoppingBag className="w-20 h-20 text-muted-foreground opacity-10 mx-auto mb-8" />
                <h2 className="text-4xl font-extrabold text-ocean mb-4 tracking-tighter">No products saved yet</h2>
                <p className="text-muted-foreground max-w-sm mx-auto mb-12 text-lg">Check out our store for premium pet supplies and save your favorites!</p>
                <Button asChild size="lg" className="bg-tropical hover:bg-tropical/90 text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl">
                   <Link to="/products">Shop Products <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Favorites;