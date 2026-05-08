import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  image?: string;
  category?: string;
  type?: string;
}

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('pawdeal_cart');
    if (saved && saved !== '[]') {
      try {
        const parsed = JSON.parse(saved);
        // Convert price to number for each item
        const fixedItems = parsed.map((item: CartItem) => ({
          ...item,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
        }));
        setItems(fixedItems);
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    localStorage.setItem('pawdeal_cart', JSON.stringify(newItems));
    setItems(newItems);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updated = items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updated);
  };

  const removeFromCart = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveCart(updated);
    toast.success('Removed from cart');
  };

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

  // Ensure price is a number for calculations
  const getPrice = (item: CartItem) => {
    return typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0;
  };

  const subtotal = items.reduce((sum, item) => sum + (getPrice(item) * item.quantity), 0);
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
      <div className="min-h-screen bg-foam py-20">
        <div className="container px-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-foam rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-ocean mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any items yet.</p>
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
        <h1 className="text-2xl font-bold text-ocean mb-6">Shopping Cart ({items.length} items)</h1>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => {
              const itemPrice = getPrice(item);
              return (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-foam shrink-0">
                      <img src={getImageUrl(item)} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-ocean">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category || 'Product'}</p>
                      <p className="text-lg font-bold text-reef mt-1">${itemPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-foam"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-foam"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-red-500">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
            <Button asChild variant="link" className="text-tropical">
              <Link to="/products"><ArrowLeft className="w-4 h-4 mr-1" /> Continue Shopping</Link>
            </Button>
          </div>

          <div>
            <Card className="p-5 sticky top-24">
              <h2 className="text-lg font-bold text-ocean mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
                <div className="flex justify-between"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="pt-3 border-t flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold text-reef">${total.toFixed(2)}</span>
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