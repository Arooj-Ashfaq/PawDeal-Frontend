import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      const saved = localStorage.getItem('pawdeal_cart');
      console.log('Loading cart:', saved);
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
  const total = subtotal + (subtotal * 0.08);

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
      <div className="min-h-screen bg-foam py-20">
        <div className="container px-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-ocean mb-3">Your cart is empty</h2>
            <Button asChild className="bg-reef hover:bg-reef/90 text-white">
              <Link to="/products">Start Shopping <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foam py-8">
      <div className="container px-4">
        <h1 className="text-2xl font-bold text-ocean mb-6">Shopping Cart ({items.length})</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <img src={getImageUrl(item)} className="w-20 h-20 rounded-lg object-cover bg-foam" alt={item.name} />
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category || 'Product'}</p>
                    <p className="text-lg font-bold text-reef mt-1">${getPrice(item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-lg">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 hover:bg-foam">-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 hover:bg-foam">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
            <Button asChild variant="link" className="text-tropical">
              <Link to="/products"><ArrowLeft className="w-4 h-4 mr-1" /> Continue Shopping</Link>
            </Button>
          </div>
          <div>
            <Card className="p-5">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
                <div className="flex justify-between"><span>Tax (8%)</span><span>${(subtotal * 0.08).toFixed(2)}</span></div>
                <div className="pt-2 border-t font-bold flex justify-between">
                  <span>Total</span>
                  <span className="text-xl text-reef">${total.toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full bg-reef hover:bg-reef/90 text-white mt-4">Proceed to Checkout</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;