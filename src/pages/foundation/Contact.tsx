import React from 'react';
import { PageHeader } from '@/components/common/PageCollection';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your message has been sent successfully!');
  };

  return (
    <div className="pb-20">
      <PageHeader 
        title="Get in Touch" 
        description="Have a question? We're here to help you every step of the way."
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Contact' }]}
      />
      
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-12 animate-fade-in">
             <div className="space-y-4">
                <h2 className="text-4xl font-extrabold text-ocean leading-tight">We'd love to <span className="text-reef">hear</span> from you</h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md">Whether you're looking to buy a pet, list as a seller, or just want some advice, our team is ready to assist.</p>
             </div>
             <div className="space-y-8">
                {[
                   { icon: <Phone className="w-8 h-8 text-tropical" />, title: "Call Us", desc: "+1 (555) 123-4567", sub: "Mon-Fri 9am-6pm EST" },
                   { icon: <Mail className="w-8 h-8 text-reef" />, title: "Email Us", desc: "support@pawdeal.com", sub: "Response within 24h" },
                   { icon: <MapPin className="w-8 h-8 text-tropical" />, title: "Our Office", desc: "123 Pet Plaza, Suite 400", sub: "New York, NY 10001" },
                ].map((item, i) => (
                   <div key={i} className="flex gap-6 items-start">
                      <div className="p-4 bg-foam rounded-2xl shrink-0 border border-border">{item.icon}</div>
                      <div className="space-y-1">
                         <h3 className="text-xl font-extrabold text-ocean">{item.title}</h3>
                         <p className="text-lg font-bold text-muted-foreground">{item.desc}</p>
                         <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.sub}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <Card className="border-border shadow-2xl rounded-[3rem] overflow-hidden bg-white">
            <CardContent className="p-12 md:p-16 space-y-8">
               <div className="flex items-center gap-4 mb-8 bg-foam p-4 rounded-2xl w-fit">
                  <MessageCircle className="w-6 h-6 text-reef" />
                  <span className="font-extrabold text-ocean">Send us a message</span>
               </div>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="name" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Full Name</Label>
                        <Input id="name" placeholder="John Doe" className="h-14 bg-foam border-none rounded-xl" required />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" className="h-14 bg-foam border-none rounded-xl" required />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="subject" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Subject</Label>
                     <Input id="subject" placeholder="What's this regarding?" className="h-14 bg-foam border-none rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="message" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Message</Label>
                     <Textarea id="message" placeholder="Type your message here..." className="min-h-[150px] bg-foam border-none rounded-2xl p-6" required />
                  </div>
                  <Button type="submit" className="w-full bg-reef hover:bg-reef/90 text-white font-extrabold h-14 rounded-2xl text-lg shadow-xl shadow-reef/20 group">
                     Send Message <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
               </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
