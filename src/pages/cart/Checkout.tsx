import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/common/PageCollection';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, CreditCard, Truck, 
  ArrowLeft, CheckCircle2, ShoppingBag, 
  Package, Heart, Mail, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  type?: string;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNumber, setOrderNumber] = useState('');
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
  });

  useEffect(() => {
    const cartData = localStorage.getItem('pawdeal_cart');
    if (cartData) {
      try {
        const parsed = JSON.parse(cartData);
        setItems(parsed);
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
    
    if (user) {
      const nameParts = user.name?.split(' ') || [];
      setShippingInfo(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
      }));
    }
    
    // Generate random order number
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    setOrderNumber(`ORD-${Date.now().toString().slice(-8)}-${randomNum}`);
  }, [user]);

  const getImageUrl = (item: CartItem) => {
    if (item.image) {
      if (item.image.startsWith('http')) return item.image;
      const filename = item.image.split('/').pop();
      if (item.type === 'pet') {
        return `http://localhost:5000/api/images/pets/${filename}`;
      }
      return `http://localhost:5000/api/images/products/${filename}`;
    }
    return 'https://placehold.co/400x400?text=Item';
  };

  const getPrice = (price: any) => {
    return typeof price === 'number' ? price : parseFloat(price) || 0;
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.id]: e.target.value
    });
  };

  const validateShipping = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof ShippingInfo]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return false;
    }
    
    if (!shippingInfo.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (shippingInfo.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      if (!cardInfo.cardNumber || cardInfo.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid card number');
        return false;
      }
      if (!cardInfo.expiry) {
        toast.error('Please enter expiry date');
        return false;
      }
      if (!cardInfo.cvv || cardInfo.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
      if (!cardInfo.nameOnCard) {
        toast.error('Please enter name on card');
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateShipping()) return;
    if (!validatePayment()) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      localStorage.removeItem('pawdeal_cart');
      toast.success('Order placed successfully!');
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="pb-20 min-h-screen bg-foam">
        <div className="container py-32 text-center bg-white rounded-3xl shadow-2xl border border-border my-20 max-w-md mx-auto">
          <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-30" />
          <h2 className="text-3xl font-extrabold text-ocean mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Add some items to your cart before checking out.</p>
          <Button asChild className="bg-reef hover:bg-reef/90 text-white">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="pb-20 bg-foam min-h-screen">
        <div className="container px-4 py-12">
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-ocean to-reef p-8 text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Order Confirmed!</h2>
              <p className="text-white/80">Thank you for your purchase</p>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-1">Order Number</p>
                <p className="text-2xl font-extrabold text-ocean font-mono">{orderNumber}</p>
              </div>
              
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-tropical" />
                  <h3 className="font-bold text-ocean">Order Confirmation Sent</h3>
                </div>
                <p className="text-muted-foreground text-sm pl-8">
                  A confirmation email has been sent to <span className="font-medium text-ocean">{shippingInfo.email || user?.email}</span>
                </p>
              </div>
              
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-tropical" />
                  <h3 className="font-bold text-ocean">Estimated Delivery</h3>
                </div>
                <p className="text-muted-foreground text-sm pl-8">
                  Your order will be delivered within <span className="font-medium text-ocean">3-5 business days</span>
                </p>
              </div>
              
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-5 h-5 text-tropical" />
                  <h3 className="font-bold text-ocean">Shipping Address</h3>
                </div>
                <p className="text-muted-foreground text-sm pl-8">
                  {shippingInfo.firstName} {shippingInfo.lastName}<br />
                  {shippingInfo.address}<br />
                  {shippingInfo.city}, {shippingInfo.zipCode}<br />
                  {shippingInfo.country}
                </p>
              </div>
              
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-5 h-5 text-reef" />
                  <h3 className="font-bold text-ocean">What's Next?</h3>
                </div>
                <p className="text-muted-foreground text-sm pl-8">
                  We'll notify you once your order ships. You can track your order status in your dashboard.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <Button asChild className="bg-ocean text-white font-extrabold h-12 px-8 rounded-xl hover:bg-ocean/90">
                  <Link to="/dashboard/buyer">View Order Details</Link>
                </Button>
                <Button asChild variant="outline" className="border-reef text-reef font-extrabold h-12 px-8 rounded-xl hover:bg-reef/10">
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + (getPrice(item.price) * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="pb-20 bg-foam">
      <PageHeader 
        title="Checkout" 
        description="Complete your purchase safely and securely." 
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Cart', path: '/cart' }, { name: 'Checkout' }]} 
      />
      
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
              <Card className="border-border shadow-sm rounded-3xl overflow-hidden bg-white p-8 space-y-8">
                <h3 className="text-2xl font-extrabold text-ocean">Shipping Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      First Name <span className="text-reef">*</span>
                    </Label>
                    <Input 
                      id="firstName" 
                      placeholder="Arooj" 
                      className="h-12 bg-foam border-none rounded-xl" 
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      Last Name <span className="text-reef">*</span>
                    </Label>
                    <Input 
                      id="lastName" 
                      placeholder="Ashfaq" 
                      className="h-12 bg-foam border-none rounded-xl" 
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      Email <span className="text-reef">*</span>
                    </Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="arooj@example.com" 
                      className="h-12 bg-foam border-none rounded-xl" 
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      Phone <span className="text-reef">*</span>
                    </Label>
                    <Input 
                      id="phone" 
                      placeholder="+92 300 1234567" 
                      className="h-12 bg-foam border-none rounded-xl" 
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      Address <span className="text-reef">*</span>
                    </Label>
                    <Input 
                      id="address" 
                      placeholder="123 Pet St, Kennel City" 
                      className="h-12 bg-foam border-none rounded-xl" 
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      City <span className="text-reef">*</span>
                    </Label>
                    <Input 
                      id="city" 
                      placeholder="Faisalabad" 
                      className="h-12 bg-foam border-none rounded-xl" 
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      ZIP / Postal Code <span className="text-reef">*</span>
                    </Label>
                    <Input 
                      id="zipCode" 
                      placeholder="38000" 
                      className="h-12 bg-foam border-none rounded-xl" 
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={() => {
                      if (validateShipping()) {
                        setStep(2);
                      }
                    }} 
                    className="bg-reef hover:bg-reef/90 text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-reef/20 group"
                  >
                    Continue to Payment <ArrowLeft className="ml-2 w-6 h-6 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="border-border shadow-sm rounded-3xl overflow-hidden bg-white p-8 space-y-8">
                <h3 className="text-2xl font-extrabold text-ocean">Payment Method</h3>
                <RadioGroup defaultValue="card" onValueChange={setPaymentMethod} className="grid gap-4">
                  <div className="relative">
                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                    <Label htmlFor="card" className="flex items-center justify-between p-6 border-2 border-muted bg-white rounded-2xl hover:bg-foam peer-data-[state=checked]:border-reef cursor-pointer transition-all">
                      <div className="flex items-center gap-4">
                        <CreditCard className="w-8 h-8 text-tropical" />
                        <div>
                          <p className="font-extrabold text-ocean">Credit / Debit Card</p>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Secure encrypted payment</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="grid gap-6 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                        Name on Card <span className="text-reef">*</span>
                      </Label>
                      <Input 
                        id="nameOnCard" 
                        placeholder="Arooj Ashfaq" 
                        className="h-12 bg-foam border-none rounded-xl" 
                        value={cardInfo.nameOnCard}
                        onChange={(e) => setCardInfo({...cardInfo, nameOnCard: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                        Card Number <span className="text-reef">*</span>
                      </Label>
                      <Input 
                        id="cardNumber" 
                        placeholder="0000 0000 0000 0000" 
                        className="h-12 bg-foam border-none rounded-xl" 
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo({...cardInfo, cardNumber: formatCardNumber(e.target.value)})}
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="expiry" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                          Expiry Date <span className="text-reef">*</span>
                        </Label>
                        <Input 
                          id="expiry" 
                          placeholder="MM/YY" 
                          className="h-12 bg-foam border-none rounded-xl" 
                          value={cardInfo.expiry}
                          onChange={(e) => setCardInfo({...cardInfo, expiry: formatExpiry(e.target.value)})}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                          CVV <span className="text-reef">*</span>
                        </Label>
                        <Input 
                          id="cvv" 
                          type="password"
                          placeholder="123" 
                          className="h-12 bg-foam border-none rounded-xl" 
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-8 border-t border-border">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground font-extrabold gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder} 
                    disabled={loading} 
                    className="bg-reef hover:bg-reef/90 text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-reef/20"
                  >
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
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                        <img src={getImageUrl(item)} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-ocean line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-ocean">${(getPrice(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-success font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-6 border-t flex justify-between items-center">
                    <span className="text-xl font-extrabold text-ocean">Total</span>
                    <span className="text-2xl font-extrabold text-reef">${total.toFixed(2)}</span>
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