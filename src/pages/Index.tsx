
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Building2 } from "lucide-react";

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-10" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000')",
          backgroundSize: "cover", 
          backgroundPosition: "center" 
        }}
      ></div>

      {/* Admin Panel Link at Top Right (only if logged in) */}
      {currentUser && (
        <div className="absolute top-4 right-4 z-20">
          <Link 
            to="/admin" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Building2 className="h-4 w-4" />
            Admin Panel
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative z-10 py-20 px-4 md:px-8 max-w-6xl mx-auto text-center">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
            <Building2 className="h-10 w-10 text-blue-600" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">Sriram Builders</h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Excellence in Construction and Real Estate Development
          </p>
          
          {currentUser ? (
            <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800">
              <Link to="/admin">Go to Admin Panel</Link>
            </Button>
          ) : (
            <div className="space-y-4">
              <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800">
                <Link to="/login">Login to Admin Panel</Link>
              </Button>
              <p className="text-sm text-gray-500">You need to login to access the admin features</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 absolute bottom-0 w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Sriram Builders</h2>
            <p className="mb-4">Building dreams, crafting futures</p>
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Sriram Builders. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
