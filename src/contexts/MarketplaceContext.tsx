import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { pets as initialPets, products as initialProducts, breeds as initialBreeds, articles as initialArticles, sellers as initialSellers, type Pet, type Product, type Breed, type Article } from '@/lib/mockData';
import { toast } from 'sonner';

interface MarketplaceContextType {
  pets: Pet[];
  products: Product[];
  breeds: Breed[];
  articles: Article[];
  sellers: any[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  addComment: (articleSlug: string, comment: any) => void;
  getPet: (id: string) => Pet | undefined;
  getProduct: (id: string) => Product | undefined;
  getArticle: (slug: string) => Article | undefined;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [pets] = useState(initialPets);
  const [products] = useState(initialProducts);
  const [breeds] = useState(initialBreeds);
  const [articles, setArticles] = useState(initialArticles);
  const [sellers] = useState(initialSellers);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem('pawdeal_favorites');
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
      
      const storedArticles = localStorage.getItem('pawdeal_articles');
      if (storedArticles) {
        setArticles(JSON.parse(storedArticles));
      }
    } catch (e) {
      console.error("Failed to load marketplace data from localStorage", e);
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('pawdeal_favorites', JSON.stringify(newFavs));
      toast.success(prev.includes(id) ? 'Removed from favorites' : 'Added to favorites');
      return newFavs;
    });
  };

  const addComment = (articleSlug: string, comment: any) => {
    setArticles(prev => {
      const updated = prev.map(a => {
        if (a.slug === articleSlug) {
          return { ...a, comments: [comment, ...a.comments] };
        }
        return a;
      });
      localStorage.setItem('pawdeal_articles', JSON.stringify(updated));
      return updated;
    });
  };

  const getPet = (id: string) => pets.find(p => p.id === id);
  const getProduct = (id: string) => products.find(p => p.id === id);
  const getArticle = (slug: string) => articles.find(a => a.slug === slug);

  return (
    <MarketplaceContext.Provider value={{ 
      pets, products, breeds, articles, sellers, favorites, 
      toggleFavorite, addComment, getPet, getProduct, getArticle 
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
