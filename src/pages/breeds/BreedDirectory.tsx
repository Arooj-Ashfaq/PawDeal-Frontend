import React, { useState } from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { PageHeader } from '@/components/common/PageCollection';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Dog, Cat, Fish, Bird, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
        <div className="space-y-12">
          {letters.length > 0 ? letters.map(letter => (
            <section key={letter} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ocean text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">
                  {letter}
                </div>
                <div className="h-px flex-1 bg-border"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedBreeds[letter].map(breed => (
                  <Link 
                    key={breed.name} 
                    to={`/breeds/${breed.name.toLowerCase().replace(/ /g, '-')}`}
                    className="group"
                  >
                    <Card className="hover:border-reef transition-all hover:shadow-xl rounded-2xl border-border bg-white overflow-hidden group">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted group-hover:scale-105 transition-transform">
                              <img 
                                src={`https://images.unsplash.com/photo-${breed.name.toLowerCase().replace(/ /g, '-') || 'pet'}?auto=format&fit=crop&w=200&q=80`} 
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
                  </Link>
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
