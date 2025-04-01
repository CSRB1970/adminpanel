import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define our data types
export interface Employee {
  id: string;
  name: string;
  image: string;
  designation: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  images: string[];
  details: string;
  videoUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  description: string;
}

// Context type
interface AdminContextType {
  // Data
  employees: Employee[];
  projects: Project[];
  testimonials: Testimonial[];
  
  // Loading states
  loadingEmployees: boolean;
  loadingProjects: boolean;
  loadingTestimonials: boolean;
  
  // Methods
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  
  // Refetch methods
  refetchEmployees: () => Promise<void>;
  refetchProjects: () => Promise<void>;
  refetchTestimonials: () => Promise<void>;
}

// Create the context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Context provider
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // State for data
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  // Loading states
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Fetch data from Supabase
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      console.log('Fetching employees...');
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error details from fetchEmployees:', error);
        throw error;
      }
      
      console.log('Fetched employees data:', data);
      
      // Convert the Supabase data to our Employee interface
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.name,
        designation: item.designation,
        description: item.description,
        image: item.image
      }));
      
      setEmployees(formattedData);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Error fetching employees',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setLoadingEmployees(false);
    }
  };
  
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert the Supabase data to our Project interface
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        details: item.details,
        images: item.images,
        videoUrl: item.video_url
      }));
      
      setProjects(formattedData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error fetching projects',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setLoadingProjects(false);
    }
  };
  
  const fetchTestimonials = async () => {
    setLoadingTestimonials(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert the Supabase data to our Testimonial interface
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image
      }));
      
      setTestimonials(formattedData);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: 'Error fetching testimonials',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setLoadingTestimonials(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchEmployees();
    fetchProjects();
    fetchTestimonials();
  }, []);

  // Employees CRUD
  const addEmployee = async (employee: Omit<Employee, 'id'>) => {
    try {
      console.log('Adding employee with data:', employee);
      
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select();
      
      if (error) {
        console.error('Error details from addEmployee:', error);
        throw error;
      }
      
      console.log('Successfully added employee, response:', data);
      
      await fetchEmployees();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error adding employee:', error);
      toast({
        title: 'Error adding employee',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };

  const updateEmployee = async (id: string, employee: Partial<Employee>) => {
    try {
      console.log('Updating employee with ID:', id, 'and data:', employee);
      
      const { error } = await supabase
        .from('employees')
        .update(employee)
        .eq('id', id);
      
      if (error) {
        console.error('Error details from updateEmployee:', error);
        throw error;
      }
      
      console.log('Successfully updated employee');
      
      await fetchEmployees();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error updating employee:', error);
      toast({
        title: 'Error updating employee',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      console.log('Deleting employee with ID:', id);
      
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error details from deleteEmployee:', error);
        throw error;
      }
      
      console.log('Successfully deleted employee');
      
      await fetchEmployees();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      toast({
        title: 'Error deleting employee',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };

  // Projects CRUD
  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      // Convert from our interface to Supabase schema
      const supabaseProject = {
        name: project.name,
        description: project.description,
        details: project.details,
        images: project.images,
        video_url: project.videoUrl
      };
      
      const { error } = await supabase
        .from('projects')
        .insert([supabaseProject]);
      
      if (error) throw error;
      
      await fetchProjects();
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: 'Error adding project',
        description: 'Please try again later',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      // Convert from our interface to Supabase schema
      const supabaseProject: any = {};
      if (project.name !== undefined) supabaseProject.name = project.name;
      if (project.description !== undefined) supabaseProject.description = project.description;
      if (project.details !== undefined) supabaseProject.details = project.details;
      if (project.images !== undefined) supabaseProject.images = project.images;
      if (project.videoUrl !== undefined) supabaseProject.video_url = project.videoUrl;
      
      const { error } = await supabase
        .from('projects')
        .update(supabaseProject)
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchProjects();
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error updating project',
        description: 'Please try again later',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchProjects();
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error deleting project',
        description: 'Please try again later',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };

  // Testimonials CRUD
  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([testimonial]);
      
      if (error) throw error;
      
      await fetchTestimonials();
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast({
        title: 'Error adding testimonial',
        description: 'Please try again later',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };

  const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update(testimonial)
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchTestimonials();
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: 'Error updating testimonial',
        description: 'Please try again later',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchTestimonials();
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: 'Error deleting testimonial',
        description: 'Please try again later',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };

  return (
    <AdminContext.Provider value={{
      employees,
      projects,
      testimonials,
      loadingEmployees,
      loadingProjects,
      loadingTestimonials,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addProject,
      updateProject,
      deleteProject,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      refetchEmployees: fetchEmployees,
      refetchProjects: fetchProjects,
      refetchTestimonials: fetchTestimonials
    }}>
      {children}
    </AdminContext.Provider>
  );
};

// Hook to use admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
