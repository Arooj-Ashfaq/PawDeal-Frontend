import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { PageHeader } from '@/components/common/PageCollection';
import { PetCard } from '@/components/common/MarketCards';
import { Star, MapPin, Calendar, CheckCircle, MessageSquare, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SellerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { sellers, pets } = useMarketplace();
  
  const seller = sellers.find(s => s.id === id);
  if (!seller) return <div className="container py-20 text-center">Seller not found</div>;

  const sellerPets = pets.filter(p => p.sellerId === seller.id);

  return (
    <div className="pb-20">
      <div className="h-[300px] bg-ocean relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <img 
          src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1920&q=80" 
          className="w-full h-full object-cover opacity-30" 
          alt="Banner"
        />
      </div>
      
      <div className="container px-4 -mt-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: Seller Info */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-border shadow-2xl rounded-[3rem] overflow-hidden bg-white p-8 space-y-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl overflow-hidden border border-border">
                  <img src={`https://i.pravatar.cc/200?u=${seller.id}`} className="w-full h-full object-cover rounded-2xl" alt={seller.name} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-extrabold text-ocean leading-tight">{seller.name}</h2>
                  <div className="flex items-center justify-center gap-1 text-sunlight">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < Math.floor(seller.rating) ? "fill-current" : "opacity-30"}`} />
                    ))}
                    <span className="text-sm font-bold text-muted-foreground ml-1">{seller.rating.toFixed(1)}</span>
                  </div>
                  <Badge className="bg-success text-white border-none mt-2 px-3 py-1 font-bold uppercase tracking-widest text-[10px] flex gap-1 mx-auto w-fit">
                    <CheckCircle className="w-3 h-3" /> Verified Seller
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
                  <MapPin className="w-5 h-5 text-tropical" /> {seller.location}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
                  <Calendar className="w-5 h-5 text-tropical" /> Joined {seller.joinedDate}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
                  <ShieldCheck className="w-5 h-5 text-tropical" /> Ethical Breeding Certified
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <Button className="bg-reef hover:bg-reef/90 text-white font-extrabold h-12 rounded-xl shadow-lg gap-2" onClick={() => toast.success('Message thread started!')}>
                    <MessageSquare className="w-5 h-5" /> Message Seller
                 </Button>
                 <Button type="button" onClick={() => {}} variant="outline" className="border-border text-ocean font-bold h-12 rounded-xl">
                    <ExternalLink className="w-5 h-5 mr-2" /> Visit Website
                 </Button>
              </div>
            </Card>

            <Card className="border-border shadow-xl rounded-3xl bg-foam p-8 space-y-4">
               <h3 className="font-extrabold text-ocean uppercase tracking-widest text-xs">Seller Stats</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-border space-y-1">
                     <p className="text-2xl font-extrabold text-ocean">{seller.totalSales}</p>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Pets</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-border space-y-1">
                     <p className="text-2xl font-extrabold text-ocean">100%</p>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Health Clear</p>
                  </div>
               </div>
            </Card>
          </div>

          {/* Right: Listings and Info */}
          <div className="lg:col-span-2 space-y-12">
            <Card className="border-border shadow-sm rounded-[3rem] bg-white p-8 lg:p-12 space-y-8">
               <h3 className="text-3xl font-extrabold text-ocean">About the Seller</h3>
               <p className="text-muted-foreground text-lg leading-relaxed">{seller.description}</p>
               <div className="grid md:grid-cols-2 gap-6 pt-6">
                  {[
                    "Ethical breeding practices",
                    "Health and temperament focused",
                    "Lifetime breeder support",
                    "Vet checked and vaccinated"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-foam rounded-2xl border border-border text-ocean font-bold">
                       <CheckCircle className="w-5 h-5 text-success" /> {item}
                    </div>
                  ))}
               </div>
            </Card>

            <Tabs defaultValue="listings" className="w-full">
               <TabsList className="bg-white p-1 rounded-2xl h-14 border border-border shadow-sm mb-8 flex justify-start w-fit">
                  <TabsTrigger value="listings" className="rounded-xl data-[state=active]:bg-ocean data-[state=active]:text-white font-bold h-full px-8">Active Listings ({sellerPets.length})</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-xl data-[state=active]:bg-ocean data-[state=active]:text-white font-bold h-full px-8">Client Reviews (12)</TabsTrigger>
               </TabsList>

               <TabsContent value="listings">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {sellerPets.map(pet => (
                        <PetCard key={pet.id} pet={pet} />
                     ))}
                  </div>
               </TabsContent>

               <TabsContent value="reviews">
                  <div className="py-20 text-center bg-foam rounded-3xl border border-border border-dashed space-y-4">
                     <Star className="w-16 h-16 text-muted-foreground mx-auto opacity-10" />
                     <h3 className="text-2xl font-bold text-ocean">Reviews are being processed</h3>
                     <p className="text-muted-foreground max-w-sm mx-auto">We're verifying all customer feedback to ensure only genuine reviews are displayed.</p>
                  </div>
               </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
import { toast } from 'sonner';
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
export default SellerProfile;
