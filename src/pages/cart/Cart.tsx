import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/common/PageCollection';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, Plus, Minus, ArrowRight, 
  ShoppingBag, Truck, ShieldCheck, 
  CreditCard, Info, ArrowLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="pb-20 min-h-[calc(100vh-80px)]">
        <PageHeader title="Shopping Cart" description="Review your selected pet products and accessories before checkout." breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Cart' }]} />
        <div className="container py-32 text-center bg-white rounded-[3rem] shadow-2xl border border-border">
           <div className="w-24 h-24 bg-foam rounded-full flex items-center justify-center mx-auto mb-8">
             <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-30" />
           </div>
           <h2 className="text-4xl font-extrabold text-ocean mb-4 tracking-tighter">Your cart is empty</h2>
           <p className="text-muted-foreground max-w-sm mx-auto mb-12 leading-relaxed">Looks like you haven't added any pet supplies yet. Browse our store to find the best for your companion.</p>
           <Button asChild size="lg" className="bg-reef hover:bg-reef/90 text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl">
             <Link to="/products">Start Shopping <ArrowRight className="ml-2 w-5 h-5" /></Link>
           </Button>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="pb-20 bg-foam">
      <PageHeader title="Shopping Cart" description={`You have ${items.length} items in your cart`} breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Cart' }]} />
      
      <div className="container px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card key={item.id} className="border-border shadow-sm rounded-3xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-8">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-muted shrink-0 border border-border">
                    <img src={`https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&w=300&q=80`} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h3 className="text-xl font-extrabold text-ocean line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Category: Pet Supplies</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                       <span className="text-2xl font-extrabold text-reef">${item.price.toFixed(2)}</span>
                       <Badge variant="secondary" className="bg-success/10 text-success border-none text-[10px] font-bold">IN STOCK</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-border rounded-xl bg-foam overflow-hidden h-12">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 flex items-center justify-center hover:bg-white transition-colors"><Minus className="w-4 h-4" /></button>
                      <span className="w-10 text-center font-bold text-ocean">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 flex items-center justify-center hover:bg-white transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-reef h-12 w-12 rounded-xl">
                      <Trash2 className="w-6 h-6" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button asChild variant="ghost" className="text-tropical font-extrabold h-12 px-0 hover:bg-transparent">
              <Link to="/products" className="flex items-center gap-2"><ArrowLeft className="w-5 h-5" /> Continue Shopping</Link>
            </Button>
          </div>

          {/* Summary */}
          <aside className="space-y-8">
            <Card className="border-border shadow-2xl rounded-[2.5rem] overflow-hidden sticky top-24 bg-white">
              <CardHeader className="bg-ocean text-white p-8">
                <CardTitle className="text-2xl font-extrabold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-muted-foreground font-medium text-sm">
                    <span>Subtotal</span>
                    <span className="text-ocean font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-medium text-sm">
                    <span>Shipping</span>
                    <span className="text-success font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-medium text-sm">
                    <span>Tax Estimate</span>
                    <span className="text-ocean font-bold">${(subtotal * 0.08).toFixed(2)}</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-border flex justify-between items-center">
                   <span className="text-xl font-extrabold text-ocean">Total</span>
                   <span className="text-3xl font-extrabold text-reef">${(subtotal * 1.08).toFixed(2)}</span>
                </div>
                <div className="pt-4 space-y-4">
                  <div className="bg-foam p-4 rounded-2xl flex gap-3 border border-border">
                    <Truck className="w-5 h-5 text-tropical shrink-0 mt-0.5" />
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-relaxed">Expect delivery within 3-5 business days after order confirmation.</p>
                  </div>
                  <Button onClick={handleCheckout} className="w-full bg-reef hover:bg-reef/90 text-white font-extrabold h-14 rounded-2xl text-lg shadow-xl shadow-reef/20 group">
                    Checkout Now <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-3xl border border-border flex flex-col items-center text-center space-y-2">
                 <ShieldCheck className="w-8 h-8 text-tropical" />
                 <h4 className="font-extrabold text-xs text-ocean uppercase tracking-widest leading-none">Secure Payment</h4>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-border flex flex-col items-center text-center space-y-2">
                 <CreditCard className="w-8 h-8 text-tropical" />
                 <h4 className="font-extrabold text-xs text-ocean uppercase tracking-widest leading-none">Many Options</h4>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
