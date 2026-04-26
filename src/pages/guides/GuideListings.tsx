import React from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { PageHeader } from '@/components/common/PageCollection';
import { Clock, User, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Pet-related images for guides
const guideImages = [
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=500&fit=crop', // puppy training
  'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&h=500&fit=crop', // senior dog
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=500&fit=crop', // dog nutrition
  'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800&h=500&fit=crop', // puppy checklist
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=500&fit=crop', // cat body language
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=500&fit=crop', // positive training
];

const featuredGuideImage = 'https://www.pets-lifestyle.com/cdn/shop/articles/Labrador_Retriever_in_India_003c85e9-7329-4fce-bebf-0b584895b3a5.webp?crop=center&height=500&v=1775329948&width=600';

const GuideListings: React.FC = () => {
  const { articles } = useMarketplace();
  const guides = articles.filter(a => a.category === 'Training' || a.category === 'Health' || a.category === 'Nutrition' || a.category === 'Checklists');

  return (
    <div className="pb-20">
      <PageHeader 
        title="Pet Care Guides" 
        description="Expert advice on everything from puppy training to senior pet health. We help you provide the best care for your furry family."
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Guides' }]}
      />
      
      <div className="container px-4">
        {/* Featured Guide */}
        {guides.length > 0 && (
          <section className="mb-16">
            <div className="group cursor-pointer">
              <Card className="bg-ocean text-white overflow-hidden rounded-[2rem] border-none flex flex-col lg:flex-row h-full">
                <div className="lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden">
                  <img 
                    src={featuredGuideImage}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt="Featured guide"
                  />
                </div>
                <CardContent className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center space-y-6">
                  <Badge className="bg-reef text-white w-fit uppercase font-extrabold tracking-widest text-xs">Featured Guide</Badge>
                  <h2 className="text-3xl md:text-5xl font-extrabold group-hover:text-reef transition-colors">{guides[0]?.title}</h2>
                  <p className="text-white/60 text-lg line-clamp-3">{guides[0]?.content}</p>
                  <div className="flex items-center gap-6 text-sm text-white/40">
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 10 min read</div>
                    <div className="flex items-center gap-2"><User className="w-4 h-4" /> {guides[0]?.author}</div>
                  </div>
                  <Button className="bg-white text-ocean hover:bg-reef hover:text-white font-extrabold w-fit h-12 px-8 rounded-xl" type="button">Read More</Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Categories */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {['All Guides', 'Training', 'Health', 'Nutrition', 'Checklists', 'Breeding'].map((cat, i) => (
            <Button 
              key={i} 
              type="button"
              onClick={() => {}}
              variant={i === 0 ? "default" : "outline"} 
              className={i === 0 ? "bg-reef hover:bg-reef/90" : "border-border text-ocean hover:border-reef hover:text-reef"}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.slice(1).map((guide, i) => (
            <div key={i} className="group cursor-pointer">
              <Card className="h-full hover:shadow-2xl transition-all border-border rounded-[1.5rem] overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={guideImages[i % guideImages.length]}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-sm text-ocean border-none text-[10px] font-bold uppercase">{guide.category}</Badge>
                  </div>
                </div>
                <CardHeader className="p-6">
                  <h3 className="text-xl font-bold text-ocean group-hover:text-reef transition-colors mb-2">{guide.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 8 min read</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> 12 comments</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{guide.content}</p>
                </CardHeader>
                <div className="px-6 pb-6 mt-auto">
                   <div className="flex items-center gap-2 pt-4 border-t border-border">
                     <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
                        <img src={`https://i.pravatar.cc/50?u=${i}`} alt="Author" />
                     </div>
                     <span className="text-xs font-medium">{guide.author}</span>
                   </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideListings;