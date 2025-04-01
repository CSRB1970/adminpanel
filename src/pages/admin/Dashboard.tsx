import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FolderKanban, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { employees, projects, testimonials } = useAdmin();

  const stats = [
    {
      title: 'Employees',
      value: employees.length,
      icon: Users,
      description: 'Team members',
      addLink: '/admin/employees/add',
      viewLink: '/admin/employees'
    },
    {
      title: 'Projects',
      value: projects.length,
      icon: FolderKanban,
      description: 'Portfolio items',
      addLink: '/admin/projects/add',
      viewLink: '/admin/projects'
    },
    {
      title: 'Testimonials',
      value: testimonials.length,
      icon: MessageSquare,
      description: 'Client reviews',
      addLink: '/admin/testimonials/add',
      viewLink: '/admin/testimonials'
    }
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      <p className="text-gray-500 mb-8">Welcome to your admin dashboard. Manage your content from here.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <CardDescription>{stat.description}</CardDescription>
              <div className="flex mt-4 gap-2">
                <Button size="sm" variant="outline" asChild className="flex-1">
                  <Link to={stat.viewLink}>View All</Link>
                </Button>
                <Button size="sm" asChild className="flex-1">
                  <Link to={stat.addLink}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center py-12 bg-white rounded-lg border">
        <h2 className="text-2xl font-semibold mb-2">Quick Actions</h2>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Button asChild>
            <Link to="/admin/employees/add">
              <Users className="h-4 w-4 mr-2" /> Add Employee
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/projects/add">
              <FolderKanban className="h-4 w-4 mr-2" /> Add Project
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/admin/testimonials/add">
              <MessageSquare className="h-4 w-4 mr-2" /> Add Testimonial
            </Link>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
