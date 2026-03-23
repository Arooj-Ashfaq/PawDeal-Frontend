import React from 'react';
import { useParams } from 'react-router-dom';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ListingsLayout } from '@/components/common/PageCollection';

const ProductListings: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const { products } = useMarketplace();
  
  const filteredProducts = category 
    ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : products;

  const title = category 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Supplies`
    : 'All Pet Supplies';

  const categories = ['Dogs', 'Cats', 'Fish', 'Birds', 'Small', 'Reptiles', 'New', 'Sale'];

  return (
    <ListingsLayout
      title={title}
      description={`Find everything your ${category || 'pet'} needs, from premium food to luxury accessories.`}
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        ...(category ? [{ name: category.charAt(0).toUpperCase() + category.slice(1) }] : [])
      ]}
      type="products"
      items={filteredProducts}
      categories={categories}
    />
  );
};

export default ProductListings;
