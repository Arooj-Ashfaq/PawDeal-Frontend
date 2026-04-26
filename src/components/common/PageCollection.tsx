import React from 'react';
import { PetCard, ProductCard } from '@/components/common/MarketCards';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  ChevronRight, Filter, Search, SortAsc, 
  MapPin, CheckCircle, Star, ShoppingBag, 
  MessageSquare, Heart, Share2, Info, 
  ArrowLeft, Plus, Minus, Trash2,
  Phone, Mail, MapPinIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, 
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

// Common Page Header
export const PageHeader: React.FC<{ title: string; description?: string; breadcrumbs: { name: string; path?: string }[] }> = ({ title, description, breadcrumbs }) => {
  return (
    <div className="bg-ocean text-white py-12 mb-8 border-b border-reef/20">
      <div className="container px-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {breadcrumbs.map((bc, i) => (
              <React.Fragment key={i}>
                <BreadcrumbItem>
                  {bc.path ? (
                    <BreadcrumbLink asChild>
                      <Link to={bc.path} className="text-white/60 hover:text-reef transition-colors">{bc.name}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-reef">{bc.name}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {i < breadcrumbs.length - 1 && <BreadcrumbSeparator className="text-white/20" />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        {description && <p className="text-white/60 max-w-2xl">{description}</p>}
      </div>
    </div>
  );
};

// Listings Layout Component
export const ListingsLayout: React.FC<{ 
  title: string; 
  description?: string; 
  breadcrumbs: { name: string; path?: string }[];
  type: 'pets' | 'products';
  items: any[];
  categories: string[];
}> = ({ title, description, breadcrumbs, type, items, categories }) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    (item.breed && item.breed.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} />
      <div className="container px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-reef" /> Filters
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <Link 
                        key={cat} 
                        to={`/${type}/${cat.toLowerCase()}`} 
                        className="flex items-center justify-between group py-1 text-sm hover:text-reef transition-colors capitalize"
                      >
                        {cat}
                        <ChevronRight className="w-3 h-3 text-border group-hover:text-reef" />
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Price Range</h4>
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Min" className="h-8 text-xs" />
                    <span className="text-muted-foreground">-</span>
                    <Input type="number" placeholder="Max" className="h-8 text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-xl border border-border">
              <p className="text-sm font-medium text-muted-foreground">Showing {filteredItems.length} results</p>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-8 h-10" />
                </div>
                <Button type="button" onClick={() => {}} variant="outline" className="gap-2">
                  <SortAsc className="w-4 h-4" /> Sort
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                type === 'pets' 
                  ? <PetCard key={item.id} pet={item} /> 
                  : <ProductCard key={item.id} product={item} />
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="w-8 h-8 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
