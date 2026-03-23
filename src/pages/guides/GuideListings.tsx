import React from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { PageHeader } from '@/components/common/PageCollection';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Clock, User, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const GuideListings: React.FC = () => {
  const { articles } = useMarketplace();
  const guides = articles.filter(a => a.category === 'Guides' || a.category === 'Training' || a.category === 'Health');

  return (
    <div className="pb-20">
      <PageHeader 
        title="Pet Care Guides" 
        description="Expert advice on everything from puppy training to senior pet health. We help you provide the best care for your furry family."
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Guides' }]}
      />
      
      <div className="container px-4">
        {/* Featured Guide */}
        <section className="mb-16">
          <Link to={`/guides/${guides[0].slug}`} className="group">
            <Card className="bg-ocean text-white overflow-hidden rounded-[2rem] border-none flex flex-col lg:flex-row h-full">
              <div className="lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-blog-1?auto=format&fit=crop&w=1200&q=80`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt="Featured guide"
                />
              </div>
              <CardContent className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center space-y-6">
                <Badge className="bg-reef text-white w-fit uppercase font-extrabold tracking-widest text-xs">Featured Guide</Badge>
                <h2 className="text-3xl md:text-5xl font-extrabold group-hover:text-reef transition-colors">{guides[0].title}</h2>
                <p className="text-white/60 text-lg line-clamp-3">{guides[0].content}</p>
                <div className="flex items-center gap-6 text-sm text-white/40">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 10 min read</div>
                  <div className="flex items-center gap-2"><User className="w-4 h-4" /> {guides[0].author}</div>
                </div>
                <Button className="bg-white text-ocean hover:bg-reef hover:text-white font-extrabold w-fit h-12 px-8 rounded-xl" type="button" onClick={() => {}}>Read More</Button>
              </CardContent>
            </Card>
          </Link>
        </section>

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
            <Link key={i} to={`/guides/${guide.slug}`} className="group">
              <Card className="h-full hover:shadow-2xl transition-all border-border rounded-[1.5rem] overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-blog-${i+2}?auto=format&fit=crop&w=800&q=80`} 
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideListings;
