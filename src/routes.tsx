import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// Lazy load all pages
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const PetListings = lazy(() => import('@/pages/pets/PetListings'));
const PetDetail = lazy(() => import('@/pages/pets/PetDetail'));
const PetCreate = lazy(() => import('@/pages/pets/PetCreate'));
const PetEdit = lazy(() => import('@/pages/pets/PetEdit'));
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

// Admin Pages - Using relative paths
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPets = lazy(() => import('./pages/admin/AdminPets'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminModeration = lazy(() => import('./pages/admin/AdminModeration'));
const AdminSellers = lazy(() => import('./pages/admin/AdminSellers'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));

// Wrapper for layout
const withLayout = (Component: React.ComponentType<any>) => (
  <MainLayout>
    <Suspense fallback={<div className="container py-20"><Skeleton className="h-[400px] w-full" /></div>}>
      <Component />
    </Suspense>
  </MainLayout>
);

// Protected route wrapper (for regular users)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('pawdeal_token');
  const user = localStorage.getItem('pawdeal_user');
  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route wrapper (requires admin role)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('pawdeal_token');
  const userStr = localStorage.getItem('pawdeal_user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const routes = [
  // Public routes
  { path: '/', element: withLayout(Home) },
  { path: '/login', element: withLayout(Login) },
  { path: '/register', element: withLayout(Register) },
  
  // Pets - Public viewing
  { path: '/pets', element: withLayout(PetListings) },
  { path: '/pets/:category', element: withLayout(PetListings) },
  { path: '/pet/:id', element: withLayout(PetDetail) },
  
  // Pets - Protected (require login)
  { 
    path: '/pets/create', 
    element: (
      <ProtectedRoute>
        {withLayout(PetCreate)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/pet/:id/edit', 
    element: (
      <ProtectedRoute>
        {withLayout(PetEdit)}
      </ProtectedRoute>
    ) 
  },
  
  // Products - Public viewing
  { path: '/products', element: withLayout(ProductListings) },
  { path: '/products/:category', element: withLayout(ProductListings) },
  { path: '/product/:id', element: withLayout(ProductDetail) },
  
  // Products - Protected (require login)
  { 
    path: '/products/create', 
    element: (
      <ProtectedRoute>
        {withLayout(ProductCreate)}
      </ProtectedRoute>
    ) 
  },
  
  // Breeds
  { path: '/breeds', element: withLayout(BreedDirectory) },
  { path: '/breeds/:breedName', element: withLayout(BreedDetail) },
  
  // Guides & Blog
  { path: '/guides', element: withLayout(GuideListings) },
  { path: '/guides/:slug', element: withLayout(GuideDetail) },
  { path: '/blog', element: withLayout(BlogListings) },
  { path: '/blog/:slug', element: withLayout(BlogDetail) },
  
  // Community
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
  
  // Pricing
  { path: '/pricing', element: withLayout(Pricing) },
  { path: '/upgrade', element: withLayout(Pricing) },
  { path: '/premium', element: withLayout(Pricing) },
  
  // Foundation
  { path: '/about', element: withLayout(About) },
  { path: '/contact', element: withLayout(Contact) },
  { path: '/faq', element: withLayout(FAQ) },
  { path: '/terms', element: withLayout(() => <Legal type="terms" />) },
  { path: '/privacy', element: withLayout(() => <Legal type="privacy" />) },
  { path: '/shipping', element: withLayout(() => <Legal type="shipping" />) },
  { path: '/returns', element: withLayout(() => <Legal type="returns" />) },
  { path: '/seller-guidelines', element: withLayout(() => <Legal type="seller-guidelines" />) },
  { path: '/welfare', element: withLayout(() => <Legal type="welfare" />) },
  
  // ========== ADMIN ROUTES ==========
  { 
    path: '/admin', 
    element: (
      <AdminRoute>
        {withLayout(AdminDashboard)}
      </AdminRoute>
    ) 
  },
  { 
    path: '/admin/dashboard', 
    element: (
      <AdminRoute>
        {withLayout(AdminDashboard)}
      </AdminRoute>
    ) 
  },
  { 
    path: '/admin/users', 
    element: (
      <AdminRoute>
        {withLayout(AdminUsers)}
      </AdminRoute>
    ) 
  },
  { 
    path: '/admin/pets', 
    element: (
      <AdminRoute>
        {withLayout(AdminPets)}
      </AdminRoute>
    ) 
  },
  { 
    path: '/admin/products', 
    element: (
      <AdminRoute>
        {withLayout(AdminProducts)}
      </AdminRoute>
    ) 
  },
  { 
    path: '/admin/orders', 
    element: (
      <AdminRoute>
        {withLayout(AdminOrders)}
      </AdminRoute>
    ) 
  },
  { 
    path: '/admin/settings', 
    element: (
      <AdminRoute>
        {withLayout(AdminSettings)}
      </AdminRoute>
    ) 
  },
  { 
    path: '/admin/moderation', 
    element: (
      <AdminRoute>
        {withLayout(AdminModeration)}
      </AdminRoute>
    ) 
  },
  { 
    path: '/admin/sellers', 
    element: (
      <AdminRoute>
        {withLayout(AdminSellers)}
      </AdminRoute>
    ) 
  },
  { 
    path: '/admin/reports', 
    element: (
      <AdminRoute>
        {withLayout(AdminReports)}
      </AdminRoute>
    ) 
  },
  
  // 404
  { path: '/404', element: withLayout(NotFound) },
];

export default routes;