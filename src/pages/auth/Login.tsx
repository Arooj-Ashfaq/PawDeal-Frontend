import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully');
      navigate(redirectTo);
    }
    setLoading(false);
  };

  const handleMockLogin = (mockEmail: string) => {
    setEmail(mockEmail);
    setPassword('password123');
  };

  return (
    <div className="container min-h-[calc(100vh-80px)] flex items-center justify-center py-20 px-4">
      <Card className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-ocean">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/404" className="text-sm text-tropical hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
            </div>
            
            <div className="relative w-full py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or test with mock users</span></div>
            </div>
            
            <div className="grid grid-cols-1 gap-2 w-full">
              <Button type="button" variant="outline" size="sm" onClick={() => handleMockLogin('buyer@test.com')} className="text-xs h-8">
                Buyer Test (buyer@test.com)
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleMockLogin('seller@test.com')} className="text-xs h-8">
                Seller Test (seller@test.com)
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleMockLogin('both@test.com')} className="text-xs h-8">
                Both Test (both@test.com)
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-reef hover:bg-reef/90 text-white h-12 text-lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
            <div className="text-center text-sm">
              Don't have an account? <Link to="/register" className="text-tropical font-bold hover:underline">Register now</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
