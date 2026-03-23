import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { 
  Menu, X, Search, ShoppingCart, User, LogOut, 
  Dog, Cat, Fish, Bird, Rabbit, Heart, MessageSquare, 
  LayoutDashboard, BookOpen, Users, HelpCircle, Phone, Info,
  ChevronDown, Bell, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/pets?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pets', path: '/pets' },
    { name: 'Products', path: '/products' },
    { name: 'Breeds', path: '/breeds' },
    { name: 'Guides', path: '/guides' },
    { name: 'Community', path: '/success-stories' },
    { name: 'Pricing', path: '/pricing' },
  ];

  const petCategories = [
    { name: 'Dogs', path: '/pets/dogs', icon: <Dog className="w-4 h-4" /> },
    { name: 'Cats', path: '/pets/cats', icon: <Cat className="w-4 h-4" /> },
    { name: 'Fish', path: '/pets/fish', icon: <Fish className="w-4 h-4" /> },
    { name: 'Birds', path: '/pets/birds', icon: <Bird className="w-4 h-4" /> },
    { name: 'Small Animals', path: '/pets/small', icon: <Rabbit className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Top Banner/Header */}
      <header className="sticky top-0 z-50 w-full bg-ocean text-white shadow-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter">PawDeal</span>
            </Link>

            <form onSubmit={handleSearch} className="hidden md:flex relative w-64 lg:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
              <Input
                type="search"
                placeholder="Search pets, products..."
                className="pl-8 text-white placeholder:text-white/60 focus-visible:ring-reef border-white/20 bg-white/10 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors hover:text-reef ${location.pathname === link.path ? 'text-reef font-bold' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-reef hover:bg-reef px-1.5 py-0.5 text-[10px] h-4 min-w-4 flex items-center justify-center">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </Badge>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/messages" className="hidden sm:flex relative p-2 hover:bg-white/10 rounded-full transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-reef rounded-full border border-ocean"></span>    
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:bg-white/10">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/pets/create">
                        <Dog className="mr-2 h-4 w-4" />
                        <span>Add New Pet</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/products/create">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>Add New Product</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/listings">
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Listings</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/favorites">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Favorites</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/messages">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Messages</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/settings">
                        <User className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" className="hidden sm:inline-flex hover:bg-white/10 text-white">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-reef hover:bg-reef/90 text-white border-none shadow-lg">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="lg:hidden p-0 h-10 w-10 hover:bg-white/10 text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-ocean text-white border-white/10">
                <SheetHeader>
                  <SheetTitle className="text-reef text-2xl font-bold">PawDeal</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="text-lg font-medium hover:text-reef py-2 border-b border-white/5"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="mt-4">
                    <p className="text-xs uppercase text-white/40 mb-2 font-bold tracking-widest">Categories</p>
                    {petCategories.map((cat) => (
                      <Link
                        key={cat.path}
                        to={cat.path}
                        className="flex items-center gap-3 text-white/80 hover:text-reef py-2"
                      >
                        {cat.icon}
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
      {/* Footer */}
      <footer className="text-white py-12 bg-ocean">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-reef">PawDeal</h3>
              <p className="text-sm text-white/60">
                The most trusted marketplace for pets and pet products. We connect loving homes with healthy pets.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/about" className="hover:text-reef transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-reef transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-reef transition-colors">FAQ</Link></li>
                <li><Link to="/pricing" className="hover:text-reef transition-colors">Pricing</Link></li>
                <li><Link to="/sellers" className="hover:text-reef transition-colors">Sellers Directory</Link></li>        
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/pets/dogs" className="hover:text-reef transition-colors">Dogs</Link></li>
                <li><Link to="/pets/cats" className="hover:text-reef transition-colors">Cats</Link></li>
                <li><Link to="/products" className="hover:text-reef transition-colors">Products</Link></li>
                <li><Link to="/guides" className="hover:text-reef transition-colors">Care Guides</Link></li>
                <li><Link to="/success-stories" className="hover:text-reef transition-colors">Success Stories</Link></li>  
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/terms" className="hover:text-reef transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-reef transition-colors">Privacy Policy</Link></li>
                <li><Link to="/shipping" className="hover:text-reef transition-colors">Shipping Policy</Link></li>
                <li><Link to="/returns" className="hover:text-reef transition-colors">Returns Policy</Link></li>
                <li><Link to="/welfare" className="hover:text-reef transition-colors">Animal Welfare Promise</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
            &copy; 2026 PawDeal Pet Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;