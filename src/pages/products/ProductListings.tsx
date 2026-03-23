import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, PlusCircle, Heart, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  category: string;
  brand: string;
  stock_quantity: number;
  rating_avg: number;
  primary_image: string | null;
  status: string;
  created_at?: string;
  description?: string;
}

const ProductListings: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const { user } = useAuth();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [category, search, sortBy, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response: any = await products.getAll();
      let filtered = response.data || response.products || [];
      
      // Apply category filter
      if (category) {
        filtered = filtered.filter((p: any) => p.category === category);
      }
      
      // Apply search filter
      if (search) {
        filtered = filtered.filter((p: any) => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Apply price filter
      if (priceRange === 'under25') {
        filtered = filtered.filter((p: any) => p.price < 25);
      } else if (priceRange === '25to50') {
        filtered = filtered.filter((p: any) => p.price >= 25 && p.price <= 50);
      } else if (priceRange === '50to100') {
        filtered = filtered.filter((p: any) => p.price >= 50 && p.price <= 100);
      } else if (priceRange === 'over100') {
        filtered = filtered.filter((p: any) => p.price > 100);
      }
      
      // Apply sorting
      if (sortBy === 'price_asc') {
        filtered.sort((a: any, b: any) => (a.sale_price || a.price) - (b.sale_price || b.price));
      } else if (sortBy === 'price_desc') {
        filtered.sort((a: any, b: any) => (b.sale_price || b.price) - (a.sale_price || a.price));
      } else if (sortBy === 'rating_avg') {
        filtered.sort((a: any, b: any) => (b.rating_avg || 0) - (a.rating_avg || 0));
      } else {
        filtered.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      }
      
      setProductList(filtered);
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, salePrice: number | null) => {
    if (salePrice) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-reef">${salePrice}</span>
          <span className="text-sm line-through text-muted-foreground">${price}</span>
        </div>
      );
    }
    return <span className="text-lg font-bold text-ocean">${price}</span>;
  };

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-reef" />
        <p className="mt-4 text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="bg-foam min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-ocean">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
            </h1>
            <p className="text-muted-foreground mt-2">Find the best products for your furry friends</p>
          </div>

          {/* Add Product Button - Only for logged in users */}
          {user && (
  <Link to="/products/create">
    <Button className="bg-reef hover:bg-reef/90 text-white">
      <PlusCircle className="w-4 h-4 mr-2" /> Add New Product
    </Button>
  </Link>
)}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating_avg">Top Rated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under25">Under $25</SelectItem>
                <SelectItem value="25to50">$25 - $50</SelectItem>
                <SelectItem value="50to100">$50 - $100</SelectItem>
                <SelectItem value="over100">Over $100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {productList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-border">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-ocean mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productList.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 rounded-2xl">
                  <div className="relative h-48 overflow-hidden bg-foam">
                    <img
                      src={product.primary_image || `https://placehold.co/400x300`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.sale_price && (
                      <Badge className="absolute top-3 right-3 bg-reef text-white">
                        Sale
                      </Badge>
                    )}
                    {product.stock_quantity === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge className="bg-red-500 text-white">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      {product.rating_avg > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold">{product.rating_avg}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-ocean mb-1 line-clamp-1">{product.name}</h3>
                    {product.brand && (
                      <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      {formatPrice(product.price, product.sale_price)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-reef/10 hover:text-reef"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info('Login to add to favorites');
                        }}
                      >
                        <Heart className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListings;