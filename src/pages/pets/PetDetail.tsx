import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, MapPin, Calendar, CheckCircle, 
  MessageSquare, Info, Share2, ArrowLeft, 
  ShieldCheck, User
} from 'lucide-react';
import { PetCard } from '@/components/common/MarketCards';
import { toast } from 'sonner';

const PetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pets, getPet, favorites, toggleFavorite } = useMarketplace();
  const { user } = useAuth();
  const navigate = useNavigate();
  const pet = getPet(id || '');
  const isFavorite = favorites.includes(id || '');

  if (!pet) {
    return <div className="container py-20 text-center">Pet not found</div>;
  }

  const relatedPets = pets.filter(p => p.category === pet.category && p.id !== pet.id).slice(0, 4);

  const handleMessageSeller = () => {
    if (!user) {
      toast.error('Please login to message the seller');
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }
    navigate(`/messages/new?seller=${pet.sellerId}&pet=${pet.id}`);
  };

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
              <img 
                src={pet.image} 
                alt={pet.name} 
                className="w-full h-full object-cover"
              />
              {pet.isVerified && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-success text-white">Verified Seller</Badge>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer hover:ring-2 ring-reef">
                  <img 
                    src={pet.image} 
                    alt={`${pet.name} thumb ${i}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
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
                    className={cn("rounded-full", isFavorite && "text-reef")}
                    onClick={() => {
                      if (!user) {
                        toast.error('Please login to save favorites');
                        navigate('/login?redirect=' + window.location.pathname);
                        return;
                      }
                      toggleFavorite(pet.id);
                    }}
                  >
                    <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                  </Button>
                </div>
              </div>
              <p className="text-2xl font-bold text-reef">${pet.price}</p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Badge variant="secondary" className="bg-foam text-ocean flex gap-1 px-3 py-1">
                  <Calendar className="w-3 h-3" /> {pet.age}
                </Badge>
                <Badge variant="secondary" className="bg-foam text-ocean flex gap-1 px-3 py-1">
                  <User className="w-3 h-3" /> {pet.gender}
                </Badge>
                <Badge variant="secondary" className="bg-foam text-ocean flex gap-1 px-3 py-1">
                  <MapPin className="w-3 h-3" /> {pet.location}
                </Badge>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleMessageSeller} className="flex-1 bg-reef hover:bg-reef/90 text-white h-14 text-lg font-bold gap-2">
                <MessageSquare className="w-5 h-5" /> Message Seller
              </Button>
              {user && (
                 <Button variant="outline" className="border-tropical text-tropical h-14 px-8" onClick={() => toggleFavorite(pet.id)}>
                   {isFavorite ? 'Saved' : 'Save'}
                 </Button>
              )}
            </div>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${pet.sellerId}`} alt="Seller" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">Happy Paws Kennel</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="text-sunlight">★★★★★</span>
                    <span>(120 reviews)</span>
                  </div>
                </div>
                <Button type="button" onClick={() => {}} variant="ghost" asChild className="text-tropical font-bold">
                  <Link to={`/seller/${pet.sellerId}`}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-foam p-1">
                <TabsTrigger value="description" className="data-[state=active]:bg-white data-[state=active]:text-reef">Description</TabsTrigger>
                <TabsTrigger value="health" className="data-[state=active]:bg-white data-[state=active]:text-reef">Health Records</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-6 text-muted-foreground leading-relaxed">
                {pet.description}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-success" /> Fully Vaccinated
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-success" /> Vet Checked
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-success" /> Microchipped
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-success" /> Breed Papers
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="health" className="py-6">
                <ul className="space-y-3">
                  {pet.healthRecords.map((record, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-foam rounded-lg text-ocean">
                      <CheckCircle className="w-5 h-5 text-success" />
                      {record}
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Pets */}
        <section className="mt-20 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-ocean">You Might Also Like</h2>
            <Button asChild variant="ghost" className="text-tropical font-bold">
              <Link to="/pets">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedPets.map(p => (
              <PetCard key={p.id} pet={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PetDetail;

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
