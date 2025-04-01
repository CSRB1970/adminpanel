
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Building2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, currentUser } = useAuth();
  const location = useLocation();

  // If user is already logged in, redirect to admin dashboard
  if (currentUser) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      // Auth context will handle the redirect
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: `url('/login_BG.jpg')`,
          backgroundSize: "cover", 
          backgroundPosition: "center",
          opacity: 1
        }}
      ></div>

      <div className="absolute top-4 left-4 z-20 flex items-center gap-4">
        <Link to="/login">
          <img src="/chennai_sriram.png" alt="Logo" className="h-20 w-30" />
        </Link>
      </div>
      
      {/* Admin Panel Link at Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <Link 
          to="/admin" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Building2 className="h-4 w-4" />
          Admin Panel
        </Link>
      </div>
      
      <div className="w-full max-w-md p-4 z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Sriram Builders</h1>
        </div>
        
        <Card className="w-full border border-white/40 shadow-lg bg-white/30 backdrop-blur-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">Admin Login</CardTitle>
            <CardDescription className="text-center text-gray-800">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 border border-white/40 backdrop-blur-md focus:border-white/70 focus:ring-white/70 text-black placeholder-white/80"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/20 border border-white/40 backdrop-blur-md focus:border-white/70 focus:ring-white/70 text-black placeholder-white/80"
              />
            </div>

            </CardContent>
            <CardFooter className="pt-0">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-900">
          <p>Need assistance? Contact your administrator</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
