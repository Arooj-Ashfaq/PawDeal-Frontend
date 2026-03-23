import React from 'react';
import { PageHeader } from '@/components/common/PageCollection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Events: React.FC = () => {
  const events = [
    { title: 'Puppy Socialization Class', date: 'Mar 25, 2026', time: '10:00 AM', loc: 'Central Park, NY', img: 'event-1' },
    { title: 'Cat Grooming Workshop', date: 'Apr 02, 2026', time: '2:00 PM', loc: 'PawDeal Hub, Brooklyn', img: 'event-2' },
    { title: 'Annual Pet Expo', date: 'May 15-17, 2026', time: '9:00 AM', loc: 'Convention Center, NY', img: 'event-3' },
  ];

  return (
    <div className="pb-20">
      <PageHeader title="Community Events" description="Join our local events and workshops to learn more about pet care and connect with other owners." breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Events' }]} />
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <Card key={i} className="overflow-hidden border-border rounded-3xl group hover:shadow-2xl transition-all">
              <div className="aspect-video relative overflow-hidden">
                <img src={`https://images.unsplash.com/photo-event-${i+1}?auto=format&fit=crop&w=800&q=80`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={event.title} />
                <div className="absolute top-4 left-4">
                   <Badge className="bg-reef text-white border-none px-3 py-1 font-bold">UPCOMING</Badge>
                </div>
              </div>
              <CardContent className="p-8 space-y-6">
                 <h3 className="text-2xl font-extrabold text-ocean group-hover:text-reef transition-colors">{event.title}</h3>
                 <div className="space-y-3 text-sm text-muted-foreground font-medium">
                    <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-tropical" /> {event.date}</div>
                    <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-tropical" /> {event.time}</div>
                    <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-tropical" /> {event.loc}</div>
                 </div>
                 <Button className="w-full bg-ocean hover:bg-ocean/90 text-white font-bold h-12 rounded-xl" onClick={() => toast.info('Registration coming soon!')}>Register Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
import { toast } from 'sonner';
export default Events;
