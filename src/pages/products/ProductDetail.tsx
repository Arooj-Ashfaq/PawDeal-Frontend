import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { PageHeader } from '@/components/common/PageCollection';
import { ProductCard } from '@/components/common/MarketCards';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, Heart, Star, Truck, 
  ShieldCheck, RefreshCw, Minus, Plus, 
  ChevronRight, ArrowLeft, CheckCircle, Info, ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct, products } = useMarketplace();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const product = getProduct(id || '');

  if (!product) {
    return <div className="container py-20 text-center">Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image
    });
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const images = [
    product.image,
    product.image,
    product.image,
  ];

  const hasSale = product.category === 'sale' || (product.originalPrice && product.originalPrice > product.price);

  return (
    <div className="pb-20">
      <PageHeader 
        title={product.name} 
        description={product.category}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: product.name }
        ]}
      />
      
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[2rem] overflow-hidden bg-white border border-border shadow-xl">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-contain p-8" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all p-2 bg-white ${activeImg === i ? "border-reef shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} className="w-full h-full object-contain" alt={`${product.name} ${i}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Badge className="bg-tropical/10 text-tropical border-none font-bold uppercase tracking-widest text-[10px] px-3 py-1">{product.category}</Badge>
                 {hasSale && <Badge className="bg-reef text-white border-none font-bold uppercase tracking-widest text-[10px] px-3 py-1">SALE</Badge>}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-ocean leading-tight tracking-tighter">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex text-sunlight items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "opacity-30"}`} />
                  ))}
                  <span className="text-sm font-bold text-ocean ml-1">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground text-sm font-medium border-l border-border pl-4">120 Verified Reviews</span>
              </div>
              <div className="flex items-baseline gap-3 pt-4">
                 <span className="text-4xl font-black text-reef">${product.price.toFixed(2)}</span>
                 {hasSale && <span className="text-xl text-muted-foreground line-through font-bold">${(product.price * 1.2).toFixed(2)}</span>}
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Premium quality supplies designed specifically for your pet's comfort and well-being. Our {product.name} is made from high-quality materials and tested by pet experts.
            </p>

            <div className="space-y-6 pt-6 border-t border-border">
              <div className="flex items-center gap-6">
                 <div className="flex items-center border-2 border-border rounded-2xl bg-foam overflow-hidden h-14">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 flex items-center justify-center hover:bg-white transition-colors"><Minus className="w-5 h-5" /></button>
                    <span className="w-12 text-center font-extrabold text-xl text-ocean">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 flex items-center justify-center hover:bg-white transition-colors"><Plus className="w-5 h-5" /></button>
                 </div>
                 <Button 
                   onClick={handleAddToCart}
                   className="flex-1 bg-reef hover:bg-reef/90 text-white font-extrabold h-14 rounded-2xl text-lg shadow-xl shadow-reef/20 group"
                 >
                   <ShoppingBag className="w-6 h-6 mr-2" /> Add to Cart
                 </Button>
              </div>
              <Button type="button" variant="outline" className="w-full h-14 rounded-2xl border-border text-ocean font-extrabold gap-2" onClick={() => toast.success('Saved to wishlist!')}>
                 <Heart className="w-5 h-5" /> Save to Wishlist
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               {[
                 { icon: <Truck className="w-5 h-5 text-tropical" />, title: "Free Shipping", sub: "On orders over $50" },
                 { icon: <ShieldCheck className="w-5 h-5 text-tropical" />, title: "2 Year Warranty", sub: "Quality guaranteed" },
                 { icon: <RefreshCw className="w-5 h-5 text-tropical" />, title: "30 Day Returns", sub: "Hassle-free process" },
                 { icon: <CheckCircle className="w-5 h-5 text-tropical" />, title: "Pet Safe", sub: "Non-toxic materials" },
               ].map((item, i) => (
                 <div key={i} className="flex gap-3 items-center p-4 bg-white rounded-2xl border border-border">
                    {item.icon}
                    <div>
                       <h4 className="font-extrabold text-xs text-ocean leading-tight uppercase tracking-widest">{item.title}</h4>
                       <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.sub}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <section className="mt-24">
           <Tabs defaultValue="description" className="w-full">
              <TabsList className="bg-white p-1 rounded-2xl h-14 border border-border shadow-sm flex justify-start w-fit">
                 <TabsTrigger value="description" className="rounded-xl data-[state=active]:bg-ocean data-[state=active]:text-white font-bold h-full px-8">Description</TabsTrigger>
                 <TabsTrigger value="specs" className="rounded-xl data-[state=active]:bg-ocean data-[state=active]:text-white font-bold h-full px-8">Specifications</TabsTrigger>
                 <TabsTrigger value="reviews" className="rounded-xl data-[state=active]:bg-ocean data-[state=active]:text-white font-bold h-full px-8">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-12 prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                 <h2 className="text-3xl font-extrabold text-ocean">Product Overview</h2>
                 <p>Our {product.name} represents the absolute best in pet care innovation. We've spent months researching and testing this product to ensure it meets the highest standards of safety, durability, and most importantly, your pet's happiness.</p>
                 <p>Every detail has been carefully considered, from the choice of materials to the ergonomic design. Whether you're at home or on the go, this is a must-have addition to your pet supplies collection.</p>
              </TabsContent>
              <TabsContent value="specs" className="py-12">
                 <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, val], i) => (
                      <div key={i} className="flex justify-between p-4 bg-white rounded-xl border border-border">
                         <span className="text-muted-foreground font-bold uppercase tracking-widest text-xs">{key}</span>
                         <span className="text-ocean font-extrabold">{val}</span>
                      </div>
                    ))}
                 </div>
              </TabsContent>
              <TabsContent value="reviews" className="py-12">
                 <div className="space-y-6">
                    {product.reviews.map((rev, i) => (
                       <Card key={i} className="border-border rounded-2xl">
                          <CardContent className="p-6 space-y-4">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-full bg-foam flex items-center justify-center font-bold text-ocean">{rev.user[0]}</div>
                                   <span className="font-extrabold text-ocean">{rev.user}</span>
                                </div>
                                <div className="flex text-sunlight text-xs">
                                   {Array.from({ length: 5 }).map((_, j) => (
                                      <Star key={j} className={`w-3 h-3 ${j < rev.rating ? "fill-current" : "opacity-30"}`} />
                                   ))}
                                </div>
                             </div>
                             <p className="text-muted-foreground">{rev.comment}</p>
                             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{rev.date}</p>
                          </CardContent>
                       </Card>
                    ))}
                 </div>
              </TabsContent>
           </Tabs>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 space-y-12 bg-foam -mx-4 px-4 py-24 rounded-[4rem] shadow-inner border border-white">
            <div className="container">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-extrabold text-ocean tracking-tighter">You Might Also <span className="text-reef">Like</span></h2>
                  <p className="text-muted-foreground text-lg">Specially selected based on your interest.</p>
                </div>
                <Button asChild variant="ghost" className="text-tropical font-bold hover:bg-transparent">
                  <Link to="/products" className="flex items-center gap-2">View All <ArrowRight className="w-5 h-5" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
