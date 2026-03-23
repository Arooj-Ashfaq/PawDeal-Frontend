import React from 'react';
import { PageHeader } from '@/components/common/PageCollection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Quote, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SuccessStories: React.FC = () => {
  const stories = [
    { name: 'Buddy', breed: 'Golden Retriever', owner: 'The Wilson Family', text: 'Finding Buddy through PawDeal was the best decision we ever made. The breeder was professional and Buddy is the most healthy and happy pup!', img: 'buddy' },
    { name: 'Luna', breed: 'Siamese Cat', owner: 'Sarah Chen', text: 'Luna has brought so much joy to our home. The process was seamless and we felt supported every step of the way.', img: 'luna' },
    { name: 'Max', breed: 'Beagle', owner: 'Robert Miller', text: 'Professional, transparent, and caring. PawDeal is truly the gold standard for pet marketplaces.', img: 'max' },
    { name: 'Oliver', breed: 'Persian Cat', owner: 'Emily Davis', text: 'We were worried about finding a reputable breeder, but PawDeal verified sellers gave us complete peace of mind.', img: 'oliver' },
  ];

  return (
    <div className="pb-20">
      <PageHeader 
        title="Happy Tails" 
        description="Read about the beautiful journeys of our pets finding their forever homes. Real stories from real families."
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Success Stories' }]}
      />
      
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {stories.map((story, i) => (
            <Card key={i} className="overflow-hidden border-none shadow-2xl rounded-[3rem] bg-white group hover:-translate-y-2 transition-transform duration-500">
              <div className="flex flex-col lg:flex-row h-full">
                <div className="lg:w-1/2 aspect-square lg:aspect-auto overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-story-${i+1}?auto=format&fit=crop&w=800&q=80`} 
                    alt={story.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <CardContent className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center space-y-6 bg-foam">
                  <Quote className="w-12 h-12 text-reef opacity-20" />
                  <div className="space-y-2">
                    <Badge className="bg-reef text-white border-none uppercase font-extrabold tracking-widest text-[10px]">Story of {story.name}</Badge>
                    <h3 className="text-3xl font-extrabold text-ocean leading-tight">{story.owner}</h3>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">"{story.text}"</p>
                  <div className="pt-6 border-t border-border flex items-center gap-4">
                    <div className="flex text-sunlight text-sm">★★★★★</div>
                    <span className="text-xs font-bold text-ocean uppercase tracking-widest">{story.breed}</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <section className="mt-20 bg-ocean rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-reef/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-tropical/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <Heart className="w-20 h-20 text-reef mx-auto animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">Share Your Story</h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Have you found your perfect pet on PawDeal? We'd love to hear your story and feature you in our gallery!
          </p>
          <Button className="bg-reef hover:bg-reef/90 text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl" type="button" onClick={() => {}}>Submit Your Tail</Button>
        </section>
      </div>
    </div>
  );
};

export default SuccessStories;
