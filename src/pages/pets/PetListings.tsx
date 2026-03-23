import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ListingsLayout } from '@/components/common/PageCollection';

const PetListings: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const { pets } = useMarketplace();
  
  const filteredPets = category 
    ? pets.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : pets;

  const title = category 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} for Sale`
    : 'All Pets for Sale';

  const categories = ['Dogs', 'Cats', 'Fish', 'Birds', 'Small', 'Reptiles'];

  return (
    <ListingsLayout
      title={title}
      description={`Find the perfect ${category || 'pet'} from our verified sellers. All pets are health-checked and ready for their forever homes.`}
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Pets', path: '/pets' },
        ...(category ? [{ name: category.charAt(0).toUpperCase() + category.slice(1) }] : [])
      ]}
      type="pets"
      items={filteredPets}
      categories={categories}
    />
  );
};

export default PetListings;
