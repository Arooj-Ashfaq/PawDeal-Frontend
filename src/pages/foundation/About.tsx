import React from 'react';
import { PageHeader } from '@/components/common/PageCollection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShieldCheck, Heart, Truck, MessageCircle, 
  CheckCircle, ArrowRight, Star, Quote, 
  Users, Award, Globe, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const About: React.FC = () => {
  return (
    <div className="pb-20">
      <PageHeader 
        title="Our Story" 
        description="We are more than a marketplace. We are a community of animal lovers dedicated to ethical breeding and high-quality pet care."
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'About Us' }]}
      />
      
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 animate-fade-in">
             <Badge className="bg-reef text-white px-4 py-1 text-xs font-extrabold tracking-widest uppercase">Since 2018</Badge>
             <h2 className="text-4xl md:text-6xl font-extrabold text-ocean leading-tight tracking-tighter">Connecting Hearts <br /> One Paw at a Time</h2>
             <p className="text-muted-foreground text-xl leading-relaxed">
               PawDeal was founded with a simple mission: to make the process of finding and caring for a pet as ethical, safe, and joyful as possible. We saw a marketplace filled with uncertainty, and we decided to build a platform rooted in trust and animal welfare.
             </p>
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                   <div className="text-4xl font-extrabold text-reef">50k+</div>
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Happy Pets</p>
                </div>
                <div className="space-y-2">
                   <div className="text-4xl font-extrabold text-reef">500+</div>
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Expert Sellers</p>
                </div>
                <div className="space-y-2">
                   <div className="text-4xl font-extrabold text-reef">100+</div>
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Care Guides</p>
                </div>
                <div className="space-y-2">
                   <div className="text-4xl font-extrabold text-reef">24/7</div>
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Customer Support</p>
                </div>
             </div>
          </div>
          <div className="relative">
             <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80" 
                 alt="People with dog"
                 className="w-full h-full object-cover"
               />
             </div>
             <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-border hidden md:block max-w-[250px]">
                <Quote className="w-10 h-10 text-reef opacity-20 mb-4" />
                <p className="text-ocean font-bold italic text-sm leading-relaxed">"Every pet deserves a loving home, and every home deserves a healthy pet. That's our promise."</p>
                <div className="mt-4 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                     <img src="https://i.pravatar.cc/100?u=ceo" alt="CEO" />
                   </div>
                   <div>
                     <p className="font-extrabold text-xs text-ocean">Alex Rivers</p>
                     <p className="text-[10px] text-muted-foreground font-bold">FOUNDER & CEO</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <section className="mt-40 space-y-12 bg-foam -mx-4 px-4 py-20 rounded-[4rem] text-center shadow-inner">
           <h2 className="text-4xl font-extrabold text-ocean">Our Core Values</h2>
           <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">These principles guide every decision we make and every partnership we build.</p>
           <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: <ShieldCheck className="w-12 h-12 text-tropical" />, title: "Absolute Trust", desc: "Every seller is rigorously vetted for ethical practices." },
                { icon: <Heart className="w-12 h-12 text-reef" />, title: "Animal Welfare", desc: "The health and safety of our animals is our top priority." },
                { icon: <Award className="w-12 h-12 text-tropical" />, title: "Excellence", desc: "We provide only the best products and care advice." },
                { icon: <Users className="w-12 h-12 text-reef" />, title: "Community", desc: "We foster a supportive environment for all pet owners." },
                { icon: <Globe className="w-12 h-12 text-tropical" />, title: "Accessibility", desc: "Making premium pet care available to everyone, everywhere." },
                { icon: <Zap className="w-12 h-12 text-reef" />, title: "Innovation", desc: "Continuously improving the pet marketplace experience." },
              ].map((value, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl border border-border space-y-4 hover:shadow-xl transition-shadow group">
                   <div className="inline-flex p-4 bg-foam rounded-2xl group-hover:scale-110 transition-transform">{value.icon}</div>
                   <h3 className="text-xl font-extrabold text-ocean">{value.title}</h3>
                   <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
           </div>
        </section>

        <section className="mt-40 bg-ocean rounded-[4rem] p-12 md:p-20 text-center text-white space-y-8 shadow-2xl overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">Ready to Join Us?</h2>
           <p className="text-white/60 text-xl max-w-2xl mx-auto">
             Whether you're looking for a new companion or want to provide for your existing pet, PawDeal is here for you.
           </p>
           <div className="flex flex-wrap justify-center gap-4 pt-6">
             <Button asChild size="lg" className="bg-reef hover:bg-reef/90 text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-reef/20">
               <Link to="/register">Create Your Account</Link>
             </Button>
             <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/20 font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-white/10 bg-transparent">
               <Link to="/contact">Get in Touch</Link>
             </Button>
           </div>
        </section>
      </div>
    </div>
  );
};

export default About;
