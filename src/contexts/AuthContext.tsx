import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'both';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  { id: 'u-buyer', email: 'buyer@test.com', name: 'Test Buyer', password: 'password123', role: 'buyer' as const },
  { id: 'u-seller', email: 'seller@test.com', name: 'Test Seller', password: 'password123', role: 'seller' as const },
  { id: 'u-both', email: 'both@test.com', name: 'Test User Both', password: 'password123', role: 'both' as const },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('pawdeal_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('pawdeal_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    
    // Check in local storage registered users first
    const registeredUsers = JSON.parse(localStorage.getItem('pawdeal_registered_users') || '[]');
    const allUsers = [...MOCK_USERS, ...registeredUsers];
    
    const found = allUsers.find(u => u.email === email && u.password === password);
    
    if (found) {
      const { password: _, ...userWithoutPass } = found;
      setUser(userWithoutPass);
      localStorage.setItem('pawdeal_user', JSON.stringify(userWithoutPass));
      return { error: null };
    } else {
      return { error: new Error('Invalid email or password') };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string) => {
    await new Promise(r => setTimeout(r, 500));
    const registeredUsers = JSON.parse(localStorage.getItem('pawdeal_registered_users') || '[]');
    
    if (registeredUsers.find((u: any) => u.email === email) || MOCK_USERS.find(u => u.email === email)) {
      return { error: new Error('Email already exists') };
    }
    
    const newUser = { id: `u-${Date.now()}`, email, password, name, role: role as any };
    registeredUsers.push(newUser);
    localStorage.setItem('pawdeal_registered_users', JSON.stringify(registeredUsers));
    
    const { password: _, ...userWithoutPass } = newUser;
    setUser(userWithoutPass);
    localStorage.setItem('pawdeal_user', JSON.stringify(userWithoutPass));
    
    return { error: null };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('pawdeal_user');
    toast.success('Logged out successfully');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('pawdeal_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
