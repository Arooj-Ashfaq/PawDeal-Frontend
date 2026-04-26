import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pets as petsAPI, products as productsAPI } from '@/services/api';
import { toast } from 'sonner';

export interface Pet {
  id: string;
  name: string;
  price: number;
  category: string;
  breed: string;
  gender: string;
  age_years: number;
  age_months: number;
  status: string;
  primary_image: string | null;
  vaccinated: number;
  city?: string;
  state?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  sellerId: string;
  sellerName: string;
}

export interface Breed {
  name: string;
  category: string;
  description: string;
  traits: string[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  slug: string;
  date: string;
}

interface MarketplaceContextType {
  pets: Pet[];
  products: Product[];
  breeds: Breed[];
  articles: Article[];
  favorites: string[];
  loading: boolean;
  getPet: (id: string) => Pet | undefined;
  getProduct: (id: string) => Product | undefined;
  toggleFavorite: (id: string) => Promise<void>;
  addToCart: (item: any) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

// Mock breeds data
const mockBreeds: Breed[] = [
  { name: 'Labrador Retriever', category: 'Dogs', description: 'Friendly, active, and outgoing.', traits: ['Good with kids', 'Energetic', 'Trainable'] },
  { name: 'German Shepherd', category: 'Dogs', description: 'Confident, courageous, and smart.', traits: ['Loyal', 'Protective', 'Intelligent'] },
  { name: 'Golden Retriever', category: 'Dogs', description: 'Intelligent, friendly, and devoted.', traits: ['Gentle', 'Playful', 'Patient'] },
  { name: 'Persian Cat', category: 'Cats', description: 'Sweet, gentle, and quiet.', traits: ['Affectionate', 'Calm', 'Lap cat'] },
  { name: 'Siamese Cat', category: 'Cats', description: 'Social, intelligent, and vocal.', traits: ['Talkative', 'Active', 'Loyal'] },
  { name: 'Betta Fish', category: 'Fish', description: 'Vibrant, territorial, and beautiful.', traits: ['Colorful', 'Easy care', 'Aggressive'] },
  { name: 'Goldfish', category: 'Fish', description: 'Hardy, social, and peaceful.', traits: ['Low maintenance', 'Social', 'Long lived'] },
  { name: 'Cockatiel', category: 'Birds', description: 'Affectionate, playful, and whistling.', traits: ['Friendly', 'Whistler', 'Social'] },
  { name: 'Budgie', category: 'Birds', description: 'Small, playful, and talkative.', traits: ['Chatty', 'Active', 'Easy care'] },
];

// Mock articles data
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Complete Guide to Puppy Training',
    content: 'Learn the essentials of training your new puppy, from housebreaking to basic commands. This comprehensive guide covers everything you need to know to raise a well-behaved dog.',
    author: 'Dr. Sarah Johnson',
    category: 'Training',
    slug: 'complete-guide-puppy-training',
    date: '2024-01-15'
  },
  {
    id: '2',
    title: 'Senior Pet Care: What You Need to Know',
    content: 'As pets age, their needs change. Here\'s how to keep your senior pet comfortable and healthy. Learn about diet, exercise, and regular check-ups.',
    author: 'Dr. Michael Chen',
    category: 'Health',
    slug: 'senior-pet-care-guide',
    date: '2024-02-20'
  },
  {
    id: '3',
    title: 'Nutritional Needs for Different Dog Breeds',
    content: 'Different breeds have different nutritional requirements. Learn what\'s best for your dog based on their size, age, and activity level.',
    author: 'Lisa Thompson',
    category: 'Nutrition',
    slug: 'dog-breed-nutrition-guide',
    date: '2024-03-10'
  },
  {
    id: '4',
    title: 'Essential Puppy Checklist',
    content: 'Everything you need to prepare for bringing a new puppy home. From supplies to vet visits, be fully prepared for your new family member.',
    author: 'Emily Wilson',
    category: 'Checklists',
    slug: 'puppy-checklist',
    date: '2024-03-05'
  },
  {
    id: '5',
    title: 'Understanding Your Cat\'s Body Language',
    content: 'Decode what your cat is trying to tell you through their body language. Learn the signs of happiness, fear, and affection.',
    author: 'Dr. Amanda Lee',
    category: 'Health',
    slug: 'cat-body-language',
    date: '2024-02-28'
  },
  {
    id: '6',
    title: 'The Art of Positive Reinforcement Training',
    content: 'Learn how to use positive reinforcement to train your dog effectively. Build a stronger bond with your pet through reward-based training.',
    author: 'Mark Roberts',
    category: 'Training',
    slug: 'positive-reinforcement-training',
    date: '2024-03-12'
  },
];

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>(mockBreeds);
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [petsResponse, productsResponse] = await Promise.all([
        petsAPI.getAll(),
        productsAPI.getAll()
      ]);
      
      const petsData = (petsResponse as any)?.data || (petsResponse as any)?.pets || [];
      const productsData = (productsResponse as any)?.data || (productsResponse as any)?.products || [];
      
      setPets(petsData);
      setProducts(productsData);
      
      // Load favorites from localStorage temporarily
      const savedFavorites = localStorage.getItem('pawdeal_favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Failed to fetch marketplace data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPet = (id: string) => pets.find(p => p.id === id);
  const getProduct = (id: string) => products.find(p => p.id === id);

  const toggleFavorite = async (id: string) => {
    let newFavorites: string[];
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(f => f !== id);
      toast.success('Removed from favorites');
    } else {
      newFavorites = [...favorites, id];
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
    localStorage.setItem('pawdeal_favorites', JSON.stringify(newFavorites));
  };

  const addToCart = (item: any) => {
    const cart = JSON.parse(localStorage.getItem('pawdeal_cart') || '[]');
    cart.push({ ...item, quantity: 1 });
    localStorage.setItem('pawdeal_cart', JSON.stringify(cart));
    toast.success('Added to cart');
  };

  return (
    <MarketplaceContext.Provider value={{ 
      pets, 
      products, 
      breeds,
      articles,
      favorites, 
      loading, 
      getPet, 
      getProduct, 
      toggleFavorite, 
      addToCart 
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};