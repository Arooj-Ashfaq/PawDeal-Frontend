import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageCollection';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Zap, ShieldCheck, Crown, ArrowRight, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: 'Basic',
      price: annual ? 7.99 : 9.99,
      description: 'Perfect for casual sellers or new pet owners.',
      features: ['5 Pet Listings', 'Standard Analytics', 'Standard Support', 'Standard Profile'],
      icon: <Zap className="w-8 h-8 text-tropical" />,
      color: 'border-border'
    },
    {
      name: 'Pro',
      price: annual ? 19.99 : 24.99,
      description: 'Ideal for small breeders and active sellers.',
      features: ['25 Pet Listings', 'Advanced Analytics', 'Priority DM Access', 'Featured in Search', 'Marked as BEST VALUE'],
      icon: <Crown className="w-8 h-8 text-reef" />,
      color: 'border-reef shadow-xl shadow-reef/10',
      featured: true
    },
    {
      name: 'Premium',
      price: annual ? 39.99 : 49.99,
      description: 'For professional kennels and pet stores.',
      features: ['Unlimited Listings', 'Priority Support', 'Premium Breeder Badge', 'Analytics Export (PDF/CSV)', 'Custom Profile Design'],
      icon: <ShieldCheck className="w-8 h-8 text-ocean" />,
      color: 'border-ocean shadow-xl shadow-ocean/10'
    }
  ];

  return (
    <div className="pb-20 bg-foam">
      <PageHeader 
        title="Flexible Pricing" 
        description="Choose the plan that's right for your pet journey. Simple, transparent pricing with no hidden fees."
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Pricing' }]}
      />
      
      <div className="container px-4">
        <div className="flex items-center justify-center gap-4 mb-16 bg-white p-4 rounded-full w-fit mx-auto shadow-sm border border-border">
          <Label htmlFor="annual-toggle" className={`font-bold transition-colors ${!annual ? "text-ocean" : "text-muted-foreground"}`}>Monthly</Label>
          <Switch id="annual-toggle" checked={annual} onCheckedChange={setAnnual} className="data-[state=checked]:bg-reef" />
          <Label htmlFor="annual-toggle" className={`font-bold transition-colors ${annual ? "text-ocean" : "text-muted-foreground"}`}>
             Annual <Badge className="ml-2 bg-success text-white border-none text-[10px] uppercase font-bold px-1.5 py-0">Save 20%</Badge>
          </Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card key={i} className={`flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border-2 transition-all hover:-translate-y-2 duration-500 ${plan.color} ${plan.featured ? "scale-105" : ""}`}>
              {plan.featured && (
                 <div className="bg-reef text-white py-2 px-4 text-center text-xs font-bold uppercase tracking-widest">
                   Best Value & Most Popular
                 </div>
              )}
              <CardHeader className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                   <div className="p-4 bg-foam rounded-2xl">{plan.icon}</div>
                   <Badge variant="outline" className="border-border text-muted-foreground font-bold uppercase tracking-widest text-[10px]">{plan.name}</Badge>
                </div>
                <div className="space-y-1">
                   <CardTitle className="text-3xl font-extrabold text-ocean">{plan.name} Plan</CardTitle>
                   <CardDescription className="text-muted-foreground font-medium leading-relaxed">{plan.description}</CardDescription>
                </div>
                <div className="pt-4 flex items-baseline gap-1">
                   <span className="text-5xl font-extrabold text-ocean">${plan.price}</span>
                   <span className="text-muted-foreground font-bold uppercase tracking-widest text-xs">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 flex-1 border-t border-border/50 space-y-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">What's included:</p>
                <ul className="space-y-4">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <span className="text-ocean font-medium text-sm leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-8 bg-foam/50 border-t border-border">
                <Button 
                  type="button"
                  className={`w-full h-14 rounded-xl text-lg font-extrabold shadow-lg transition-all ${plan.featured ? "bg-reef hover:bg-reef/90 text-white shadow-reef/20" : "bg-ocean hover:bg-ocean/90 text-white shadow-ocean/20"}`}
                  onClick={() => toast.success(`Selected ${plan.name} Plan`)}
                >
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <section className="mt-40 p-12 md:p-20 bg-ocean rounded-[4rem] text-center text-white space-y-8 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-reef/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-tropical/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
           
           <Star className="w-16 h-16 text-sunlight mx-auto animate-spin-slow" />
           <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">Need a Custom Enterprise Solution?</h2>
           <p className="text-white/60 text-xl max-w-2xl mx-auto">
             If you're a large pet store or association with more than 500 listings monthly, we can build a custom plan just for you.
           </p>
           <Button type="button" className="bg-white text-ocean hover:bg-reef hover:text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-white/10 transition-colors" onClick={() => toast.info('Sales team contacted')}>Talk to Sales</Button>
        </section>
      </div>
    </div>
  );
};
import { toast } from 'sonner';
export default Pricing;
