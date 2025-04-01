
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Users, FolderKanban, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { 
    name: 'Employees', 
    path: '/admin/employees',
    icon: Users
  },
  { 
    name: 'Projects', 
    path: '/admin/projects',
    icon: FolderKanban
  },
  { 
    name: 'Testimonials', 
    path: '/admin/testimonials',
    icon: MessageSquare
  }
];

export const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  return (
    <aside className="w-64 bg-admin-sidebar text-white min-h-screen flex flex-col">
      <div className="p-6">
      <Link to="/admin" className="text-2xl font-bold hover:text-admin-primary">
          Admin Panel
        </Link>
      </div>
      <nav className="mt-6 flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors",
                  location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                    ? "bg-admin-sidebar/60 text-admin-primary"
                    : "text-gray-400 hover:text-white hover:bg-admin-sidebar/30"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-6 pt-6 pb-6 border-t border-gray-700/50">
        <div className="flex flex-col gap-2">
          
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
