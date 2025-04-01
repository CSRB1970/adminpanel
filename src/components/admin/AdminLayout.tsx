
import React from 'react';
import { Sidebar } from './Sidebar';
import { useToast } from '@/components/ui/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-admin-light-gray">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
};
