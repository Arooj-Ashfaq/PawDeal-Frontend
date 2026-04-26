import React, { useState } from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { PageHeader } from '@/components/common/PageCollection';
import { Search, ChevronRight, Dog, Cat, Fish, Bird, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Real pet images for each breed category
const breedImages: Record<string, string> = {
  'Labrador Retriever': 'https://www.pets-lifestyle.com/cdn/shop/articles/Labrador_Retriever_in_India_003c85e9-7329-4fce-bebf-0b584895b3a5.webp?crop=center&height=500&v=1775329948&width=600',
  'German Shepherd': 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=200&h=200&fit=crop',
  'Golden Retriever': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop',
  'Poodle': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop',
  'Persian Cat': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop',
  'Siamese Cat': 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=200&h=200&fit=crop',
  'Maine Coon': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop',
  'Betta Fish': 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=200&h=200&fit=crop',
  'Goldfish': 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=200&h=200&fit=crop',
  'Cockatiel': 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&h=200&fit=crop',
  'Budgie': 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&h=200&fit=crop',
  'African Grey': 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&h=200&fit=crop',
};

const getBreedImage = (breedName: string): string => {
  return breedImages[breedName] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop';
};

const BreedDirectory: React.FC = () => {
  const { breeds } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: <Info className="w-4 h-4" /> },
    { name: 'Dogs', icon: <Dog className="w-4 h-4" /> },
    { name: 'Cats', icon: <Cat className="w-4 h-4" /> },
    { name: 'Fish', icon: <Fish className="w-4 h-4" /> },
    { name: 'Birds', icon: <Bird className="w-4 h-4" /> },
  ];

  const filteredBreeds = breeds.filter(breed => {
    const matchesSearch = breed.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || breed.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.name.localeCompare(b.name));

  // Group by first letter
  const groupedBreeds = filteredBreeds.reduce((acc, breed) => {
    const letter = breed.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(breed);
    return acc;
  }, {} as Record<string, typeof breeds>);

  const letters = Object.keys(groupedBreeds).sort();

  return (
    <div className="pb-20">
      <PageHeader 
        title="Breed Directory" 
        description="Explore our comprehensive directory of pet breeds. Learn about their personality, care needs, and history."
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Breeds' }]}
      />
      
      <div className="container px-4">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search breeds..." 
              className="pl-10 h-12 bg-foam border-none rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={activeCategory === cat.name ? "default" : "outline"}
                className={activeCategory === cat.name ? "bg-ocean text-white border-none rounded-xl h-11 px-6" : "border-border text-ocean rounded-xl h-11 px-6"}
                onClick={() => setActiveCategory(cat.name)}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Breed List */}
        <div className="space-y-8">
          {letters.length > 0 ? letters.map(letter => (
            <section key={letter} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-ocean text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md">
                  {letter}
                </div>
                <div className="h-px flex-1 bg-border"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedBreeds[letter].map(breed => (
                  <div 
                    key={breed.name} 
                    className="group cursor-pointer"
                  >
                    <Card className="hover:border-reef transition-all hover:shadow-xl rounded-2xl border-border bg-white overflow-hidden group">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted group-hover:scale-105 transition-transform">
                            <img 
                              src={getBreedImage(breed.name)}
                              className="w-full h-full object-cover"
                              alt={breed.name}
                            />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-ocean group-hover:text-reef transition-colors">{breed.name}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{breed.category}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-reef group-hover:translate-x-1 transition-all" />
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </section>
          )) : (
            <div className="text-center py-32 bg-foam rounded-[3rem] border border-border border-dashed">
              <Info className="w-16 h-16 text-muted-foreground mx-auto opacity-10 mb-4" />
              <h3 className="text-2xl font-bold text-ocean">No breeds found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
              <Button variant="outline" className="mt-6 border-reef text-reef font-bold h-11 px-8 rounded-xl" onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}>Clear All</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreedDirectory;