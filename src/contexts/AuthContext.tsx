import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { auth } from '../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phone: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pawdeal_token');
    const storedUser = localStorage.getItem('pawdeal_user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('pawdeal_token');
        localStorage.removeItem('pawdeal_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      
      localStorage.setItem('pawdeal_token', response.token);
      localStorage.setItem('pawdeal_user', JSON.stringify(response.user));
      setUser(response.user);
      toast.success('Logged in successfully!');
      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return { error: error };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone: string) => {
    try {
      const response = await auth.register({ 
        email, 
        password, 
        first_name: firstName,
        last_name: lastName,
        phone: phone || null
      });
      
      localStorage.setItem('pawdeal_token', response.token);
      localStorage.setItem('pawdeal_user', JSON.stringify(response.user));
      setUser(response.user);
      toast.success('Account created successfully!');
      return { error: null };
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return { error: error };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('pawdeal_token');
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