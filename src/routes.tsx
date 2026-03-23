import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load all pages
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const PetListings = lazy(() => import('@/pages/pets/PetListings'));
const PetDetail = lazy(() => import('@/pages/pets/PetDetail'));
const PetCreate = lazy(() => import('@/pages/pets/PetCreate'));
const ProductListings = lazy(() => import('@/pages/products/ProductListings'));
const ProductDetail = lazy(() => import('@/pages/products/ProductDetail'));
const ProductCreate = lazy(() => import('@/pages/products/ProductCreate'));
const BreedDirectory = lazy(() => import('@/pages/breeds/BreedDirectory'));
const BreedDetail = lazy(() => import('@/pages/breeds/BreedDetail'));
const GuideListings = lazy(() => import('@/pages/guides/GuideListings'));
const GuideDetail = lazy(() => import('@/pages/guides/GuideDetail'));
const BlogListings = lazy(() => import('@/pages/blog/BlogListings'));
const BlogDetail = lazy(() => import('@/pages/blog/BlogDetail'));
const SuccessStories = lazy(() => import('@/pages/community/SuccessStories'));
const Events = lazy(() => import('@/pages/community/Events'));
const Sellers = lazy(() => import('@/pages/community/Sellers'));
const SellerProfile = lazy(() => import('@/pages/community/SellerProfile'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Messages = lazy(() => import('@/pages/messages/Messages'));
const Cart = lazy(() => import('@/pages/cart/Cart'));
const Checkout = lazy(() => import('@/pages/cart/Checkout'));
const Favorites = lazy(() => import('@/pages/favorites/Favorites'));
const Pricing = lazy(() => import('@/pages/pricing/Pricing'));
const About = lazy(() => import('@/pages/foundation/About'));
const Contact = lazy(() => import('@/pages/foundation/Contact'));
const FAQ = lazy(() => import('@/pages/foundation/FAQ'));
const Legal = lazy(() => import('@/pages/foundation/Legal'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Wrapper for layout
const withLayout = (Component: React.ComponentType<any>) => (
  <MainLayout>
    <Suspense fallback={<div className="container py-20"><Skeleton className="h-[400px] w-full" /></div>}>
      <Component />
    </Suspense>
  </MainLayout>
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('pawdeal_token');
  const user = localStorage.getItem('pawdeal_user');
  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const routes = [
  // Public routes (no login required)
  { path: '/', element: withLayout(Home) },
  { path: '/login', element: withLayout(Login) },
  { path: '/register', element: withLayout(Register) },
  
  // Public pet viewing routes
  { path: '/pets', element: withLayout(PetListings) },
  { path: '/pets/:category', element: withLayout(PetListings) },
  { path: '/pet/:id', element: withLayout(PetDetail) },
  
  // Protected pet routes (require login)
  { 
    path: '/pets/create', 
    element: (
      <ProtectedRoute>
        {withLayout(PetCreate)}
      </ProtectedRoute>
    ) 
  },
  
  // Public product viewing routes
  { path: '/products', element: withLayout(ProductListings) },
  { path: '/products/:category', element: withLayout(ProductListings) },
  { path: '/product/:id', element: withLayout(ProductDetail) },
  
  // Protected product routes (require login)
  { 
    path: '/products/create', 
    element: (
      <ProtectedRoute>
        {withLayout(ProductCreate)}
      </ProtectedRoute>
    ) 
  },
  
  // Breeds (public)
  { path: '/breeds', element: withLayout(BreedDirectory) },
  { path: '/breeds/:breedName', element: withLayout(BreedDetail) },
  
  // Guides & Blog (public)
  { path: '/guides', element: withLayout(GuideListings) },
  { path: '/guides/:slug', element: withLayout(GuideDetail) },
  { path: '/blog', element: withLayout(BlogListings) },
  { path: '/blog/:slug', element: withLayout(BlogDetail) },
  
  // Community (public)
  { path: '/success-stories', element: withLayout(SuccessStories) },
  { path: '/events', element: withLayout(Events) },
  { path: '/sellers', element: withLayout(Sellers) },
  { path: '/seller/:id', element: withLayout(SellerProfile) },
  
  // Protected routes (require login)
  { 
    path: '/favorites', 
    element: (
      <ProtectedRoute>
        {withLayout(Favorites)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/dashboard', 
    element: (
      <ProtectedRoute>
        {withLayout(Dashboard)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/dashboard/:view', 
    element: (
      <ProtectedRoute>
        {withLayout(Dashboard)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/messages', 
    element: (
      <ProtectedRoute>
        {withLayout(Messages)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/messages/:id', 
    element: (
      <ProtectedRoute>
        {withLayout(Messages)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/cart', 
    element: (
      <ProtectedRoute>
        {withLayout(Cart)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/checkout', 
    element: (
      <ProtectedRoute>
        {withLayout(Checkout)}
      </ProtectedRoute>
    ) 
  },
  
  // Pricing (public)
  { path: '/pricing', element: withLayout(Pricing) },
  { path: '/upgrade', element: withLayout(Pricing) },
  { path: '/premium', element: withLayout(Pricing) },
  
  // Foundation (public)
  { path: '/about', element: withLayout(About) },
  { path: '/contact', element: withLayout(Contact) },
  { path: '/faq', element: withLayout(FAQ) },
  { path: '/terms', element: withLayout(() => <Legal type="terms" />) },
  { path: '/privacy', element: withLayout(() => <Legal type="privacy" />) },
  { path: '/shipping', element: withLayout(() => <Legal type="shipping" />) },
  { path: '/returns', element: withLayout(() => <Legal type="returns" />) },
  { path: '/seller-guidelines', element: withLayout(() => <Legal type="seller-guidelines" />) },
  { path: '/welfare', element: withLayout(() => <Legal type="welfare" />) },
  
  // 404
  { path: '/404', element: withLayout(NotFound) },
];

export default routes;