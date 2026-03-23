import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { PetCard, ProductCard } from '@/components/common/MarketCards';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, ShieldCheck, Heart, Truck, 
  MessageCircle, Star, Users, Search 
} from 'lucide-react';

const Home: React.FC = () => {
  const { pets, products } = useMarketplace();
  const featuredPets = pets.slice(0, 4);
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-ocean">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover opacity-40"
            alt="Dogs running"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ocean to-transparent"></div>
        </div>
        
        <div className="container relative z-10 px-4 text-white">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-reef text-white px-4 py-1 text-sm font-bold animate-fade-in border-none">Trusted by 50,000+ Pet Owners</Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter">
              Find Your Perfect <br /> <span className="text-reef">Furry Companion</span>
            </h1>
            <p className="text-xl text-white/80 max-w-lg">
              The premier marketplace for ethically bred pets and high-quality pet products. 
              Safe, secure, and full of love.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="bg-reef hover:bg-reef/90 text-white text-lg h-14 px-8 shadow-xl shadow-reef/20 font-extrabold border-none">
                <Link to="/pets">Browse Pets <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 text-lg h-14 px-8 font-extrabold shadow-xl shadow-white/5 bg-transparent">
                <Link to="/products">Shop Supplies</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 px-6 bg-white rounded-2xl shadow-sm border border-border -mt-20 relative z-20">
          {[
            { icon: <ShieldCheck className="w-10 h-10 text-tropical" />, title: "Verified Sellers", desc: "Every breeder is vetted" },
            { icon: <Heart className="w-10 h-10 text-reef" />, title: "Animal Welfare", desc: "We prioritize health first" },
            { icon: <Truck className="w-10 h-10 text-tropical" />, title: "Secure Delivery", desc: "Safe transport nationwide" },
            { icon: <MessageCircle className="w-10 h-10 text-reef" />, title: "24/7 Support", desc: "Expert care advice" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-2">
              {item.icon}
              <h3 className="font-bold text-ocean">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Featured Pets */}
      <section className="container px-4 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-ocean">Featured Pets</h2>
            <p className="text-muted-foreground">New companions waiting for a home</p>
          </div>
          <Button asChild variant="ghost" className="text-tropical hover:text-tropical hover:bg-tropical/10">
            <Link to="/pets" className="flex items-center gap-2">View All <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>
      {/* Shop by Category */}
      <section className="bg-foam py-20">
        <div className="container px-4 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold text-ocean">Shop by Category</h2>
            <p className="text-muted-foreground">Everything your pet needs, delivered to your door</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Dogs', icon: '🐶', path: '/pets/dogs', bg: 'bg-tropical/10' },
              { name: 'Cats', icon: '🐱', path: '/pets/cats', bg: 'bg-reef/10' },
              { name: 'Fish', icon: '🐠', path: '/pets/fish', bg: 'bg-tropical/20' },
              { name: 'Birds', icon: '🦜', path: '/pets/birds', bg: 'bg-success/10' },
              { name: 'Small Animals', icon: '🐹', path: '/pets/small', bg: 'bg-sunlight/10' },
              { name: 'Reptiles', icon: '🦎', path: '/pets/reptiles', bg: 'bg-ocean/10' },
            ].map((cat, i) => (
              <Link key={i} to={cat.path} className="group">
                <div className={`aspect-square ${cat.bg} rounded-2xl flex flex-col items-center justify-center p-6 transition-all group-hover:scale-105 group-hover:shadow-lg`}>
                  <span className="text-4xl mb-2">{cat.icon}</span>
                  <span className="font-bold text-ocean">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="container px-4 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-ocean">Trending Supplies</h2>
            <p className="text-muted-foreground">Top rated products for your pets</p>
          </div>
          <Button asChild variant="ghost" className="text-tropical hover:text-tropical hover:bg-tropical/10">
            <Link to="/products" className="flex items-center gap-2">Shop All <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      {/* Success Stories */}
      <section className="bg-ocean py-20 text-white">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-reef text-white border-none px-4 py-1">Testimonials</Badge>
              <h2 className="text-4xl font-bold">Connecting Pets with Loving Families</h2>
              <p className="text-lg text-white/70">
                We've helped over 10,000 pets find their forever homes. Read about their journey and the joy they bring to their new families.
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-reef">10k+</div>
                  <div className="text-sm uppercase tracking-widest text-white/50">Happy Tails</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-reef">500+</div>
                  <div className="text-sm uppercase tracking-widest text-white/50">Expert Breeders</div>
                </div>
              </div>
              <Button asChild className="bg-reef hover:bg-reef/90 text-white border-none font-bold shadow-lg">
                <Link to="/success-stories">Read Stories</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80" 
                  alt="Happy family with dog"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl hidden md:block max-w-[200px]">
                <div className="flex mb-2 text-sunlight">★★★★★</div>
                <p className="text-sm italic text-ocean">"Best experience ever! We found our Buddy through PawDeal and couldn't be happier."</p>
                <p className="text-muted-foreground text-xs mt-2 font-bold">- The Wilson Family</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="container px-4">
        <div className="bg-ocean rounded-[2rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">Ready to Find Your <br /> New Best Friend?</h2>
          <p className="text-white/90 text-xl max-w-2xl mx-auto">
            Join our community today. Browse thousands of pets or list your own for sale.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-reef hover:bg-white/90 text-lg h-14 px-8 font-extrabold shadow-xl border-none">
              <Link to="/register">Create Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 text-lg h-14 px-8 font-extrabold shadow-xl shadow-white/5 bg-transparent">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
