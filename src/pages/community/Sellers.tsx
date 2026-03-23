import React, { useState } from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { PageHeader } from '@/components/common/PageCollection';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ShieldCheck, CheckCircle, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Sellers: React.FC = () => {
  const { sellers } = useMarketplace();
  const [search, setSearch] = useState('');
  
  const filteredSellers = sellers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pb-20">
      <PageHeader 
        title="Seller Directory" 
        description="Connect with our community of verified, ethical breeders and quality pet stores. Your peace of mind is our priority."
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Sellers' }]}
      />
      
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="relative flex-1 max-w-xl w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search sellers by name or location..." 
              className="pl-10 h-12 text-lg border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Button type="button" onClick={() => {}} variant="outline" className="border-border text-ocean font-bold h-12 rounded-xl">All Categories</Button>
            <Button type="button" onClick={() => {}} variant="outline" className="border-border text-ocean font-bold h-12 rounded-xl">Location</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSellers.map((seller, i) => (
            <Link key={i} to={`/seller/${seller.id}`} className="group">
              <Card className="h-full hover:shadow-2xl transition-all border-border rounded-[2rem] overflow-hidden group">
                <div className="h-32 bg-ocean relative">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-success text-white border-none text-[10px] font-bold uppercase tracking-widest flex gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8 pt-0 -mt-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg overflow-hidden shrink-0 border border-border group-hover:-translate-y-2 transition-transform">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${seller.id}`} 
                      alt={seller.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-ocean group-hover:text-reef transition-colors">{seller.name}</h3>
                    <div className="flex items-center justify-center gap-1 text-sunlight">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < Math.floor(seller.rating) ? "fill-current" : "opacity-30"}`} />
                      ))}
                      <span className="text-xs font-bold text-muted-foreground ml-1">({seller.rating.toFixed(1)})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-foam px-3 py-1.5 rounded-full">
                    <MapPin className="w-3 h-3 text-tropical" /> {seller.location}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{seller.description}</p>
                  <div className="w-full pt-6 border-t border-border flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                    <div className="text-muted-foreground">Sales: <span className="text-ocean">{seller.totalSales}</span></div>
                    <div className="text-muted-foreground">Joined: <span className="text-ocean">{seller.joinedDate.split('-')[0]}</span></div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredSellers.length === 0 && (
          <div className="text-center py-32 bg-foam rounded-[3rem] border border-border border-dashed space-y-6">
            <Search className="w-20 h-20 text-muted-foreground mx-auto opacity-10" />
            <h3 className="text-3xl font-extrabold text-ocean">No Sellers Found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">We couldn't find any sellers matching your search. Try adjusting your filters or search terms.</p>
            <Button variant="outline" className="border-tropical text-tropical font-extrabold h-12 px-8 rounded-xl" onClick={() => setSearch('')}>Clear All Filters</Button>
          </div>
        )}

        <section className="mt-24 p-12 md:p-20 bg-foam rounded-[4rem] text-center space-y-8 shadow-inner border border-white">
           <Badge className="bg-tropical text-white uppercase font-extrabold tracking-widest px-6 py-2">Join Our Seller Community</Badge>
           <h2 className="text-4xl md:text-6xl font-extrabold text-ocean tracking-tighter leading-tight">Are You a <span className="text-reef underline decoration-wavy">Reputable</span> Breeder?</h2>
           <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
             PawDeal is looking for ethical partners who prioritize animal welfare above all else. Apply now to join our community.
           </p>
           <Button className="bg-ocean text-white hover:bg-ocean/90 h-14 px-12 rounded-xl text-lg font-extrabold shadow-xl" type="button" onClick={() => {}}>Apply to Sell</Button>
        </section>
      </div>
    </div>
  );
};

export default Sellers;
