import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, MapPin, Calendar, CheckCircle, 
  MessageSquare, Share2, ArrowLeft, 
  ShieldCheck, User, Loader2, ShoppingBag,
  Star, Truck, Package
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  category: string;
  subcategory: string;
  brand: string;
  sku: string;
  stock_quantity: number;
  weight_kg: number;
  dimensions: string;
  materials: string;
  care_instructions: string;
  rating_avg: number;
  rating_count: number;
  images: Array<{ image_url: string; is_primary: number }>;
  seller_id: string;
  seller_name: string;
  seller_email: string;
  status: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response: any = await products.getById(id!);
      const productData = response.product || response.data || response;
      setProduct(productData);
      if (productData.images && productData.images.length > 0) {
        const primaryImage = productData.images.find((img: any) => img.is_primary === 1) || productData.images[0];
        setSelectedImage(primaryImage.image_url);
      }
    } catch (error: any) {
      console.error('Failed to fetch product:', error);
      toast.error(error.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    // Add to cart logic here
    toast.success(`Added ${quantity} x ${product?.name} to cart`);
  };

  const handleMessageSeller = () => {
    if (!user) {
      toast.error('Please login to message the seller');
      navigate('/login');
      return;
    }
    navigate(`/messages/new?seller=${product?.seller_id}&product=${product?.id}`);
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const filename = url.split('/').pop();
    return `http://localhost:5000/api/images/products/${filename}`;
  };

  const getPrice = () => {
    if (product?.sale_price) {
      return (
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-reef">${product.sale_price}</span>
          <span className="text-xl line-through text-muted-foreground">${product.price}</span>
          <Badge className="bg-reef text-white">Sale</Badge>
        </div>
      );
    }
    return <span className="text-3xl font-bold text-reef">${product?.price}</span>;
  };

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-reef" />
        <p className="mt-4 text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-ocean mb-4">Product not found</h2>
        <Button onClick={() => navigate('/products')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="container px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-reef mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Photos */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-foam relative">
              {selectedImage ? (
                <img
                  src={getImageUrl(selectedImage)}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-foam">
                  <Package className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`aspect-square rounded-xl overflow-hidden bg-foam cursor-pointer hover:ring-2 ${selectedImage === img.image_url ? 'ring-2 ring-reef' : 'ring-0'}`}
                    onClick={() => setSelectedImage(img.image_url)}
                  >
                    <img
                      src={getImageUrl(img.image_url)}
                      alt={`${product.name} thumb ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-extrabold text-ocean">{product.name}</h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.brand && <Badge variant="outline">{product.brand}</Badge>}
                {product.stock_quantity > 0 ? (
                  <Badge className="bg-green-500 text-white">In Stock ({product.stock_quantity})</Badge>
                ) : (
                  <Badge className="bg-red-500 text-white">Out of Stock</Badge>
                )}
              </div>
              {product.rating_avg > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{product.rating_avg}</span>
                  </div>
                  <span className="text-muted-foreground">({product.rating_count} reviews)</span>
                </div>
              )}
            </div>

            <div className="border-t border-b py-4">
              {getPrice()}
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-ocean">Description</h3>
              <p className="text-muted-foreground">{product.description || 'No description available.'}</p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.sku && (
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <p className="font-medium">{product.sku}</p>
                </div>
              )}
              {product.weight_kg && (
                <div>
                  <span className="text-muted-foreground">Weight:</span>
                  <p className="font-medium">{product.weight_kg} kg</p>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <span className="text-muted-foreground">Dimensions:</span>
                  <p className="font-medium">{product.dimensions}</p>
                </div>
              )}
              {product.materials && (
                <div>
                  <span className="text-muted-foreground">Materials:</span>
                  <p className="font-medium">{product.materials}</p>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock_quantity > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    className="px-3 py-2 hover:bg-foam"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    className="px-3 py-2 hover:bg-foam"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  >
                    +
                  </button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1 bg-reef hover:bg-reef/90 text-white h-12 gap-2">
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </Button>
              </div>
            )}

            {/* Seller Information */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-bold">{product.seller_name || 'Pet Store'}</h4>
                  <p className="text-xs text-muted-foreground">{product.seller_email}</p>
                </div>
                <Button onClick={handleMessageSeller} variant="outline" className="text-tropical">
                  <MessageSquare className="w-4 h-4 mr-2" /> Message
                </Button>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <div className="bg-foam rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-tropical" />
                <span className="text-sm font-medium">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-tropical" />
                <span className="text-sm font-medium">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;