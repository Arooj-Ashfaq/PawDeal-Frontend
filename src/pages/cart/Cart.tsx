import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/common/PageCollection';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      const saved = localStorage.getItem('pawdeal_cart');
      if (saved && saved !== '[]') {
        try {
          const parsed = JSON.parse(saved);
          setItems(parsed);
        } catch (e) {
          console.error('Parse error:', e);
        }
      }
    };
    loadCart();
  }, []);

  const updateQuantity = (id: string, change: number) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return newQty >= 1 ? { ...item, quantity: newQty } : item;
      }
      return item;
    });
    setItems(newItems);
    localStorage.setItem('pawdeal_cart', JSON.stringify(newItems));
  };

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    localStorage.setItem('pawdeal_cart', JSON.stringify(newItems));
    toast.success('Removed from cart');
  };

  const getImageUrl = (item: any) => {
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
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price) || 0;
    return 0;
  };

  const subtotal = items.reduce((sum, item) => sum + (getPrice(item.price) * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-foam">
        <PageHeader 
          title="Shopping Cart" 
          description="Review your selected items before checkout"
          breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Cart' }]}
        />
        <div className="container px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-12 text-center border border-border">
            <div className="w-24 h-24 bg-foam rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-ocean mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any items yet.</p>
            <Button asChild className="bg-reef hover:bg-reef/90 text-white h-12 px-8 rounded-xl">
              <Link to="/products">Start Shopping <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foam">
      <PageHeader 
        title="Shopping Cart" 
        description={`You have ${items.length} ${items.length === 1 ? 'item' : 'items'} in your cart`}
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Cart' }]}
      />
      
      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden border-border hover:shadow-lg transition-shadow rounded-2xl bg-white">
                <div className="p-5 flex gap-5">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-foam shrink-0 border border-border">
                    <img 
                      src={getImageUrl(item)} 
                      className="w-full h-full object-cover" 
                      alt={item.name} 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-ocean text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{item.category || 'Product'}</p>
                      </div>
                      <p className="text-xl font-bold text-reef">${getPrice(item.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-border rounded-xl bg-white overflow-hidden h-10">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="w-10 h-full flex items-center justify-center hover:bg-foam transition-colors text-muted-foreground hover:text-ocean"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-medium text-ocean">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="w-10 h-full flex items-center justify-center hover:bg-foam transition-colors text-muted-foreground hover:text-ocean"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-ocean">
                        Total: ${(getPrice(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            <Button asChild variant="ghost" className="text-tropical hover:text-reef hover:bg-transparent mt-2">
              <Link to="/products"><ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping</Link>
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-border shadow-lg rounded-2xl bg-white sticky top-24">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-ocean">Order Summary</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-ocean">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-success font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span className="font-medium text-ocean">${tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-ocean">Total</span>
                    <span className="text-2xl font-bold text-reef">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCheckout} 
                  className="w-full bg-reef hover:bg-reef/90 text-white font-semibold h-12 rounded-xl text-base shadow-md transition-all"
                >
                  Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-tropical" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="w-4 h-4 text-tropical" />
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="w-4 h-4 text-tropical" />
                    <span>All major credit cards accepted</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;