
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdmin, Employee } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const EmployeeForm = () => {
  const { id } = useParams();
  const { employees, addEmployee, updateEmployee, loadingEmployees } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isEditMode = !!id;
  const existingEmployee = isEditMode 
    ? employees.find(emp => emp.id === id) 
    : null;
  
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    designation: '',
    description: '',
    image: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    designation: '',
    description: '',
    image: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (existingEmployee) {
      setFormData({
        name: existingEmployee.name,
        designation: existingEmployee.designation,
        description: existingEmployee.description,
        image: existingEmployee.image
      });
    }
  }, [existingEmployee]);
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      designation: '',
      description: '',
      image: ''
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.image) {
      newErrors.image = 'Image is required';
    }
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors in the form',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log('Form submission started. Form data:', formData);
    
    try {
      if (isEditMode && id) {
        console.log('Updating employee with ID:', id);
        await updateEmployee(id, formData);
        toast({
          title: 'Employee Updated',
          description: `${formData.name} has been updated successfully.`
        });
      } else {
        console.log('Adding new employee');
        await addEmployee(formData);
        toast({
          title: 'Employee Added',
          description: `${formData.name} has been added successfully.`
        });
      }
      
      navigate('/admin/employees');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: isEditMode 
          ? 'Failed to update employee. Please try again.' 
          : 'Failed to add employee. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  if (loadingEmployees && isEditMode) {
    return (
      <AdminLayout title="Loading Employee...">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={isEditMode ? 'Edit Employee' : 'Add New Employee'}>
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate('/admin/employees')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Employees
      </Button>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name of the Employee"
                  className={errors.name ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Designation of the Employee"
                  className={errors.designation ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a short bio or description"
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Employee Image</Label>
              <ImageUpload
                value={formData.image}
                onChange={(value) => {
                  console.log('Image uploaded, new value:', value);
                  setFormData(prev => ({ ...prev, image: value }));
                  if (errors.image) {
                    setErrors(prev => ({ ...prev, image: '' }));
                  }
                }}
                className="max-w-md"
                disabled={isSubmitting}
              />
              {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditMode ? 'Update Employee' : 'Add Employee'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default EmployeeForm;
