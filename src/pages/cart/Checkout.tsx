import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/common/PageCollection';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, CreditCard, Truck, 
  MapPin, Phone, Mail, User, 
  ChevronRight, ArrowLeft, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const Checkout: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      clearCart();
      toast.success('Order placed successfully!');
    }, 2000);
  };

  if (!user) return null;

  if (step === 3) {
    return (
      <div className="container py-32 text-center bg-white rounded-[3rem] shadow-2xl border border-border my-20">
         <div className="w-32 h-32 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-12 animate-bounce">
           <CheckCircle2 className="w-16 h-16 text-success" />
         </div>
         <h2 className="text-5xl font-extrabold text-ocean mb-6 tracking-tighter">Thank you for your order!</h2>
         <p className="text-muted-foreground max-w-lg mx-auto mb-12 text-xl leading-relaxed">
           Your order #ORD-1025 has been placed successfully. We've sent a confirmation email to {user.email}.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-4">
           <Button asChild className="bg-ocean text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-ocean/20">
             <Link to="/dashboard/buyer">View Order Details</Link>
           </Button>
           <Button asChild variant="outline" className="border-reef text-reef font-extrabold h-14 px-12 rounded-xl text-lg hover:bg-reef/10 shadow-xl shadow-reef/10">
             <Link to="/">Back to Home</Link>
           </Button>
         </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-foam">
      <PageHeader title="Checkout" description="Complete your purchase safely and securely." breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Cart', path: '/cart' }, { name: 'Checkout' }]} />
      
      <div className="container px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-8 mb-4">
               <div className={`flex items-center gap-2 font-bold ${step >= 1 ? "text-reef" : "text-muted-foreground"}`}>
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? "border-reef bg-reef text-white" : "border-muted"}`}>1</span>
                  <span>Shipping</span>
               </div>
               <div className="h-px flex-1 bg-border"></div>
               <div className={`flex items-center gap-2 font-bold ${step >= 2 ? "text-reef" : "text-muted-foreground"}`}>
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? "border-reef bg-reef text-white" : "border-muted"}`}>2</span>
                  <span>Payment</span>
               </div>
            </div>

            {step === 1 ? (
               <Card className="border-border shadow-sm rounded-3xl overflow-hidden bg-white p-8 space-y-8 animate-fade-in">
                  <h3 className="text-2xl font-extrabold text-ocean">Shipping Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="firstName" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">First Name</Label>
                        <Input id="firstName" placeholder="John" className="h-12 bg-foam border-none rounded-xl" />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="lastName" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" className="h-12 bg-foam border-none rounded-xl" />
                     </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Address</Label>
                        <Input id="address" placeholder="123 Pet St, Kennel City" className="h-12 bg-foam border-none rounded-xl" />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="city" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">City</Label>
                        <Input id="city" placeholder="New York" className="h-12 bg-foam border-none rounded-xl" />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="zip" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">ZIP / Postal Code</Label>
                        <Input id="zip" placeholder="10001" className="h-12 bg-foam border-none rounded-xl" />
                     </div>
                  </div>
                  <div className="flex justify-end">
                     <Button onClick={() => setStep(2)} className="bg-reef hover:bg-reef/90 text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-reef/20 group">
                        Continue to Payment <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </div>
               </Card>
            ) : (
               <Card className="border-border shadow-sm rounded-3xl overflow-hidden bg-white p-8 space-y-8 animate-fade-in">
                  <h3 className="text-2xl font-extrabold text-ocean">Payment Method</h3>
                  <RadioGroup defaultValue="card" className="grid gap-4">
                     <div className="relative">
                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                        <Label htmlFor="card" className="flex flex-col md:flex-row items-center justify-between p-6 border-2 border-muted bg-white rounded-2xl hover:bg-foam peer-data-[state=checked]:border-reef [&:has([data-state=checked])]:border-reef cursor-pointer transition-all">
                           <div className="flex items-center gap-4">
                              <CreditCard className="w-8 h-8 text-tropical" />
                              <div>
                                 <p className="font-extrabold text-ocean">Credit / Debit Card</p>
                                 <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Secure encrypted payment</p>
                              </div>
                           </div>
                           <div className="flex gap-2 mt-4 md:mt-0 opacity-40">
                              <span className="w-10 h-6 bg-muted rounded-md border border-border"></span>
                              <span className="w-10 h-6 bg-muted rounded-md border border-border"></span>
                              <span className="w-10 h-6 bg-muted rounded-md border border-border"></span>
                           </div>
                        </Label>
                     </div>
                     <div className="relative">
                        <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                        <Label htmlFor="paypal" className="flex items-center justify-between p-6 border-2 border-muted bg-white rounded-2xl hover:bg-foam peer-data-[state=checked]:border-reef [&:has([data-state=checked])]:border-reef cursor-pointer transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-tropical/10 flex items-center justify-center font-extrabold text-tropical italic">P</div>
                              <div>
                                 <p className="font-extrabold text-ocean">PayPal</p>
                                 <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Fast & secure checkout</p>
                              </div>
                           </div>
                        </Label>
                     </div>
                  </RadioGroup>
                  
                  <div className="grid gap-6 pt-6">
                     <div className="space-y-2">
                        <Label htmlFor="cardNum" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Card Number</Label>
                        <Input id="cardNum" placeholder="0000 0000 0000 0000" className="h-12 bg-foam border-none rounded-xl" />
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Label htmlFor="expiry" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Expiry Date</Label>
                           <Input id="expiry" placeholder="MM / YY" className="h-12 bg-foam border-none rounded-xl" />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="cvv" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">CVV</Label>
                           <Input id="cvv" placeholder="123" className="h-12 bg-foam border-none rounded-xl" />
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-border">
                     <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground font-extrabold gap-2"><ArrowLeft className="w-5 h-5" /> Back</Button>
                     <Button onClick={handlePlaceOrder} disabled={loading} className="bg-reef hover:bg-reef/90 text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-reef/20">
                        {loading ? 'Processing...' : 'Place Order'}
                     </Button>
                  </div>
               </Card>
            )}
          </div>

          {/* Sidebar Summary */}
          <aside className="space-y-8">
            <Card className="border-border shadow-2xl rounded-[2.5rem] overflow-hidden sticky top-24 bg-white">
              <CardHeader className="bg-ocean text-white p-8">
                <CardTitle className="text-2xl font-extrabold">Your Order</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                     <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                           <img src={`https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&w=150&q=80`} className="w-full h-full object-cover" alt={item.name} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-xs font-extrabold text-ocean line-clamp-1">{item.name}</h4>
                           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-ocean">${(item.price * item.quantity).toFixed(2)}</span>
                     </div>
                  ))}
                </div>
                <div className="space-y-4 pt-6 border-t border-border">
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
                  <div className="pt-6 border-t border-border flex justify-between items-center">
                     <span className="text-xl font-extrabold text-ocean">Total</span>
                     <span className="text-3xl font-extrabold text-reef">${(subtotal * 1.08).toFixed(2)}</span>
                  </div>
                </div>
                <div className="pt-4 flex gap-3 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-tropical shrink-0" />
                  <span>Secure 256-bit SSL encrypted checkout. Your data is safe with us.</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
