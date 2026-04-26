import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { PageHeader } from '@/components/common/PageCollection';
import { PetCard, ProductCard } from '@/components/common/MarketCards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, ShieldCheck, Zap, Info, 
  ArrowLeft, Search, CheckCircle, 
  ArrowRight, InfoIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BreedDetail: React.FC = () => {
  const { breedName } = useParams<{ breedName: string }>();
  const { breeds, pets, products } = useMarketplace();
  
  const breed = breeds.find(b => b.name.toLowerCase().replace(/ /g, '-') === breedName);

  if (!breed) {
    return <div className="container py-20 text-center">Breed not found</div>;
  }

  const availablePets = pets.filter(p => p.breed.toLowerCase() === breed.name.toLowerCase()).slice(0, 4);
  const recommendedProducts = products.filter(p => p.category.toLowerCase() === breed.category.toLowerCase()).slice(0, 4);

  return (
    <div className="pb-20">
      <PageHeader 
        title={breed.name} 
        description={`The comprehensive guide to everything you need to know about the ${breed.name}. Personality, care needs, and characteristics.`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Breeds', path: '/breeds' },
          { name: breed.name }
        ]}
      />
      
      <div className="container px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section className="aspect-[16/9] rounded-3xl overflow-hidden bg-muted relative shadow-2xl">
              <img 
                src={`https://images.unsplash.com/photo-${breed.name.toLowerCase().replace(/ /g, '-') || 'dog'}?auto=format&fit=crop&w=1600&q=80`} 
                alt={breed.name}
                className="w-full h-full object-cover"
              />
            </section>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 w-full bg-foam h-14 p-1 rounded-2xl">
                <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-reef font-bold">Overview</TabsTrigger>
                <TabsTrigger value="care" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-reef font-bold">Care</TabsTrigger>
                <TabsTrigger value="health" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-reef font-bold">Health</TabsTrigger>
                <TabsTrigger value="temperament" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-reef font-bold">Temperament</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="py-8 space-y-6">
                <h2 className="text-3xl font-extrabold text-ocean">About the {breed.name}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{breed.description}</p>
                <div className="grid grid-cols-2 gap-4">
                   <Card className="bg-foam border-none p-6 rounded-2xl">
                     <Heart className="w-8 h-8 text-reef mb-4" />
                     <h3 className="font-bold text-lg mb-2">Social Needs</h3>
                     <p className="text-sm text-muted-foreground">Requires daily interaction and attention from owners.</p>
                   </Card>
                   <Card className="bg-foam border-none p-6 rounded-2xl">
                     <Zap className="w-8 h-8 text-tropical mb-4" />
                     <h3 className="font-bold text-lg mb-2">Energy Levels</h3>
                     <p className="text-sm text-muted-foreground">Medium to high energy. Requires daily walks and playtime.</p>
                   </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="care" className="py-8 space-y-6">
                <h2 className="text-3xl font-extrabold text-ocean">Care Requirements</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{breed.careRequirements}</p>
                <div className="space-y-4">
                  {[
                    "Daily exercise is a must",
                    "Grooming once or twice a week",
                    "High-quality nutritional diet",
                    "Regular vet check-ups"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-foam rounded-xl text-ocean font-medium">
                      <CheckCircle className="w-5 h-5 text-success" />
                      {item}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="health" className="py-8 space-y-6">
                <h2 className="text-3xl font-extrabold text-ocean">Health Considerations</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{breed.healthConsiderations}</p>
                <div className="bg-reef/10 p-6 rounded-2xl border border-reef/20 flex gap-4">
                  <InfoIcon className="w-6 h-6 text-reef shrink-0 mt-1" />
                  <p className="text-sm text-ocean">Always consult with a professional veterinarian regarding specific health concerns for your pet.</p>
                </div>
              </TabsContent>

              <TabsContent value="temperament" className="py-8 space-y-6">
                <h2 className="text-3xl font-extrabold text-ocean">Personality & Behavior</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{breed.temperament}</p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            <Card className="border-border shadow-xl overflow-hidden rounded-3xl sticky top-24">
              <CardHeader className="bg-ocean text-white p-8">
                <CardTitle className="text-xl font-bold">Breed Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between py-3 border-b border-border">
                   <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Category</span>
                   <span className="font-bold text-ocean">{breed.category}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                   <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Avg. Life Span</span>
                   <span className="font-bold text-ocean">10 - 15 Years</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                   <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Ease of Training</span>
                   <span className="font-bold text-ocean">High</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                   <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Grooming Needs</span>
                   <span className="font-bold text-ocean">Weekly</span>
                </div>
                <Button className="w-full bg-reef hover:bg-reef/90 text-white font-bold h-12 rounded-xl mt-4" type="button" onClick={() => {}}>
                  Find a Puppy
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Available Pets Section */}
        {availablePets.length > 0 && (
          <section className="mt-24 space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-ocean">Available {breed.name}s</h2>
                <p className="text-muted-foreground">Find verified {breed.name} puppies for sale.</p>
              </div>
              <Button asChild variant="ghost" className="text-tropical font-bold group">
                <Link to="/pets" className="flex items-center gap-2">View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {availablePets.map(p => (
                <PetCard key={p.id} pet={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Products */}
        <section className="mt-24 space-y-8 bg-foam -mx-4 px-4 py-20 rounded-[3rem]">
          <div className="container">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-extrabold text-ocean">Best for {breed.name}s</h2>
                <p className="text-muted-foreground">Supplies specifically recommended for this breed.</p>
              </div>
              <Button asChild variant="ghost" className="text-tropical font-bold group">
                <Link to="/products" className="flex items-center gap-2">Shop All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BreedDetail;
