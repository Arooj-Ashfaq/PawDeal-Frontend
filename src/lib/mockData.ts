
export interface Pet {
  id: string;
  name: string;
  category: 'dogs' | 'cats' | 'fish' | 'birds' | 'small' | 'reptiles';
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  price: number;
  location: string;
  image: string;
  sellerId: string;
  description: string;
  healthRecords: string[];
  isVerified: boolean;
  postedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'dogs' | 'cats' | 'fish' | 'birds' | 'small' | 'reptiles' | 'new' | 'sale';
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  description: string;
  specifications: Record<string, string>;
  reviews: { user: string; rating: number; comment: string; date: string }[];
}

export interface Breed {
  name: string;
  category: string;
  description: string;
  careRequirements: string;
  temperament: string;
  healthConsiderations: string;
  image: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  image: string;
  content: string;
  comments: { user: string; avatar: string; date: string; content: string; likes: number; replies?: any[] }[];
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  location: string;
  joinedDate: string;
  description: string;
  totalSales: number;
}

// Helper to generate IDs
const uid = () => Math.random().toString(36).substr(2, 9);

export const pets: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    category: 'dogs',
    breed: 'Golden Retriever',
    age: '2 months',
    gender: 'Male',
    price: 1200,
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    sellerId: 's1',
    description: 'A very friendly and playful Golden Retriever puppy. Loves to play fetch and is great with kids.',
    healthRecords: ['Vaccinated', 'Dewormed', 'Vet Checked'],
    isVerified: true,
    postedAt: '2026-03-10',
  },
  {
    id: '2',
    name: 'Luna',
    category: 'cats',
    breed: 'Siamese',
    age: '3 months',
    gender: 'Female',
    price: 800,
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    sellerId: 's2',
    description: 'Beautiful Siamese kitten with striking blue eyes. Very affectionate and vocal.',
    healthRecords: ['Vaccinated', 'Microchipped'],
    isVerified: true,
    postedAt: '2026-03-12',
  },
  // ... will generate more in a loop or add more manually
];

// Generate more pets to reach 50+
const dogBreeds = ['Labrador', 'Poodle', 'Bulldog', 'Beagle', 'German Shepherd', 'Dachshund'];
const catBreeds = ['Persian', 'Maine Coon', 'Bengal', 'Ragdoll', 'Sphynx'];
const locations = ['Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX'];

const dogImages = [
  '1543466835-00a7907e9de1', '1583511655826-05700d52f4d9', '1537151608828-ea2b11777ee8',
  '1548199973-03cce0bbc87b', '1516734212186-a967f81ad0d7', '1591160674255-44d758807a1b'
];
const catImages = [
  '1514888286974-6c03e2ca1dba', '1495360010541-f48722b31f6d', '1533738363-b7f9aef128ce',
  '1573865526739-10659fec78a5', '1494256997604-768d1f608cdc', '1513245543132-31f507417b26'
];
const fishImages = ['1522069169874-c58ec4b76be5', '1497671954146-59a89ff626ff', '1524704654690-b56c05c78a00'];
const birdImages = ['1522850949506-d8c4144615ee', '1552728081-220c09e45e99', '1452570053594-1b985d6ea890'];
const smallImages = ['1548767791-00529d7f6c2c', '1510771463146-e89e6e86560e', '1425023319891-99af1d8a1936'];
const reptileImages = ['1501700493717-b8f9fb20742d', '1504198453319-5ce911baf2ef', '1504198266287-1659872e6590'];

for (let i = 3; i <= 60; i++) {
  const category = (['dogs', 'cats', 'fish', 'birds', 'small', 'reptiles'] as const)[i % 6];
  const breed = category === 'dogs' ? dogBreeds[i % dogBreeds.length] : 
                category === 'cats' ? catBreeds[i % catBreeds.length] : 
                category.charAt(0).toUpperCase() + category.slice(1) + ' Generic';
  
  let imageId = '';
  if (category === 'dogs') imageId = dogImages[i % dogImages.length];
  else if (category === 'cats') imageId = catImages[i % catImages.length];
  else if (category === 'fish') imageId = fishImages[i % fishImages.length];
  else if (category === 'birds') imageId = birdImages[i % birdImages.length];
  else if (category === 'small') imageId = smallImages[i % smallImages.length];
  else if (category === 'reptiles') imageId = reptileImages[i % reptileImages.length];

  pets.push({
    id: i.toString(),
    name: `Pet ${i}`,
    category,
    breed,
    age: `${(i % 12) + 1} months`,
    gender: i % 2 === 0 ? 'Male' : 'Female',
    price: 100 + (i * 20),
    location: locations[i % locations.length],
    image: `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&q=80`,
    sellerId: `s${(i % 5) + 1}`,
    description: `This is a wonderful ${breed} looking for a new home. Very friendly and healthy.`,
    healthRecords: ['Vaccinated'],
    isVerified: i % 3 === 0,
    postedAt: `2026-03-${(i % 15) + 1}`.padStart(10, '0'),
  });
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Premium Dog Kibble',
    category: 'dogs',
    price: 45.99,
    originalPrice: 59.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    description: 'High-quality dog food for active adult dogs. Rich in protein and essential vitamins.',
    specifications: { weight: '15kg', flavor: 'Chicken & Rice', lifeStage: 'Adult' },
    reviews: [{ user: 'John D.', rating: 5, comment: 'My dog loves it!', date: '2026-02-15' }],
  },
  // ... generate more
];

const prodImages = [
  '1583511655857-d19b40a7a54e', '1541599540903-216a4667a0ee', '1522069169874-c58ec4b76be5',
  '1522850949506-d8c4144615ee', '1548767791-00529d7f6c2c', '1501700493717-b8f9fb20742d'
];

for (let i = 2; i <= 60; i++) {
  const category = (['dogs', 'cats', 'fish', 'birds', 'small', 'reptiles', 'new', 'sale'] as const)[i % 8];
  const imageId = prodImages[i % prodImages.length];
  products.push({
    id: `p${i}`,
    name: `Product ${i}`,
    category,
    price: 10 + (i * 2),
    rating: 3 + (Math.random() * 2),
    image: `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&q=80`,
    description: `High-quality pet product for your ${category}. Durable and safe.`,
    specifications: { Material: 'Plastic', Origin: 'USA' },
    reviews: [{ user: 'Buyer', rating: 4, comment: 'Good value.', date: '2026-03-01' }],
  });
}

export const breeds: Breed[] = [
  {
    name: 'Golden Retriever',
    category: 'Dogs',
    description: 'The Golden Retriever is a sturdy, muscular dog of medium size, famous for the dense, lustrous coat of gold that gives the breed its name.',
    careRequirements: 'High exercise needs, regular grooming, social interaction.',
    temperament: 'Friendly, intelligent, devoted.',
    healthConsiderations: 'Hip dysplasia, elbow dysplasia, heart problems.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Siamese',
    category: 'Cats',
    description: 'The Siamese cat is one of the first distinctly recognized breeds of Asian cat. Derived from the Wichianmat landrace, one of several varieties of cat native to Thailand.',
    careRequirements: 'Social companionship, mental stimulation.',
    temperament: 'Vocal, social, intelligent.',
    healthConsiderations: 'Progressive retinal atrophy, amyloidosis.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
  }
];

// Add more breeds to reach 30+
for (let i = 3; i <= 35; i++) {
  const category = (['Dogs', 'Cats', 'Birds', 'Fish', 'Reptiles'][i % 5]);
  let imageId = '';
  if (category === 'Dogs') imageId = dogImages[i % dogImages.length];
  else if (category === 'Cats') imageId = catImages[i % catImages.length];
  else if (category === 'Fish') imageId = fishImages[i % fishImages.length];
  else if (category === 'Birds') imageId = birdImages[i % birdImages.length];
  else imageId = reptileImages[i % reptileImages.length];
  
  breeds.push({
    name: `Breed ${i}`,
    category,
    description: `Detailed description for breed ${i}. Very popular and loved by many.`,
    careRequirements: 'Standard care requirements.',
    temperament: 'Friendly and adaptable.',
    healthConsiderations: 'General health is good.',
    image: `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&q=80`,
  });
}

export const articles: Article[] = [
  {
    slug: 'french-bulldog',
    title: 'French Bulldog Care Guide',
    category: 'Guides',
    author: 'Dr. Emily Smith',
    date: '2026-01-20',
    image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    content: 'French Bulldogs are small, muscular dogs with a heavy bone structure and a smooth, short coat. They are affectionate and playful...',
    comments: [
      { user: 'PetLover99', avatar: 'https://i.pravatar.cc/150?u=1', date: '2026-01-21', content: 'Great guide! Very helpful for new owners.', likes: 12 },
    ]
  },
  {
    slug: 'golden-retriever',
    title: 'Golden Retriever Care Guide',
    category: 'Guides',
    author: 'Mark Johnson',
    date: '2026-02-05',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    content: 'The Golden Retriever is a sturdy, muscular dog of medium size, famous for the dense, lustrous coat of gold that gives the breed its name...',
    comments: []
  },
  {
    slug: 'siamese-cat',
    title: 'Siamese Cat Care Guide',
    category: 'Guides',
    author: 'Sarah Wilson',
    date: '2026-02-10',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    content: 'The Siamese cat is one of the first distinctly recognized breeds of Asian cat. They are vocal, social and highly intelligent...',
    comments: []
  },
  {
    slug: 'new-pet',
    title: 'New Pet Owner Checklist',
    category: 'Checklists',
    author: 'John Doe',
    date: '2026-02-15',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    content: 'Bringing home a new pet is an exciting time! To make the transition as smooth as possible, here is a checklist...',
    comments: []
  },
  {
    slug: 'training',
    title: 'Training Tips',
    category: 'Guides',
    author: 'Expert Trainer',
    date: '2026-03-01',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
    content: 'Training your pet is an essential part of responsible ownership...',
    comments: []
  },
  {
    slug: 'health',
    title: 'Health & Nutrition',
    category: 'Guides',
    author: 'Vet Nutritionist',
    date: '2026-03-05',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    content: 'Providing your pet with proper nutrition is key to a long and healthy life...',
    comments: []
  },
  {
    slug: 'buying',
    title: 'Product Buying Guides',
    category: 'Guides',
    author: 'Product Reviewer',
    date: '2026-03-10',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    content: 'Not sure which product to buy? Here is our guide...',
    comments: []
  },
  {
    slug: 'seasonal',
    title: 'Seasonal Pet Care',
    category: 'Guides',
    author: 'Nature Lover',
    date: '2026-03-15',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    content: 'How to care for your pet in every season...',
    comments: []
  }
];

const blogImages = [
  '1544568100-847a948585b9', '1516734212186-a967f81ad0d7', '1583337130417-3346a1be7dee',
  '1591160674255-44d758807a1b', '1548199973-03cce0bbc87b'
];

for (let i = 3; i <= 25; i++) {
  const imageId = blogImages[i % blogImages.length];
  articles.push({
    slug: `article-${i}`,
    title: `Expert Guide ${i}: Everything You Need to Know`,
    category: (['Guides', 'Training', 'Health', 'Nutrition'][i % 4]),
    author: 'Expert Author',
    date: `2026-02-${(i % 28) + 1}`.padStart(10, '0'),
    image: `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&q=80`,
    content: `Comprehensive content for article ${i}. Detailed information and tips for pet owners.`,
    comments: [],
  });
}

export const sellers: Seller[] = [
  {
    id: 's1',
    name: 'Golden Paws Kennel',
    avatar: 'https://i.pravatar.cc/150?u=s1',
    rating: 4.9,
    location: 'Nashville, TN',
    joinedDate: '2024-05-15',
    description: 'Ethical breeders specializing in Golden Retrievers. Our pups are raised with love and professional care.',
    totalSales: 45,
  },
  {
    id: 's2',
    name: 'The Cat Emporium',
    avatar: 'https://i.pravatar.cc/150?u=s2',
    rating: 4.7,
    location: 'San Francisco, CA',
    joinedDate: '2023-11-10',
    description: 'Premium cats and kittens. We focus on health and temperament.',
    totalSales: 120,
  }
];

for (let i = 3; i <= 20; i++) {
  sellers.push({
    id: `s${i}`,
    name: `Seller ${i} Pet Shop`,
    avatar: `https://i.pravatar.cc/150?u=s${i}`,
    rating: 4.0 + (Math.random()),
    location: locations[i % locations.length],
    joinedDate: `2025-01-${(i % 28) + 1}`.padStart(10, '0'),
    description: `A reputable seller specializing in various pets and accessories.`,
    totalSales: i * 5,
  });
}
