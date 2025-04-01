
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdmin, Testimonial } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

const TestimonialForm = () => {
  const { id } = useParams();
  const { testimonials, addTestimonial, updateTestimonial } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isEditMode = !!id;
  const existingTestimonial = isEditMode 
    ? testimonials.find(test => test.id === id) 
    : null;
  
  const [formData, setFormData] = useState<Omit<Testimonial, 'id'>>({
    name: '',
    description: '',
    image: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    image: ''
  });
  
  useEffect(() => {
    if (existingTestimonial) {
      setFormData({
        name: existingTestimonial.name,
        description: existingTestimonial.description,
        image: existingTestimonial.image
      });
    }
  }, [existingTestimonial]);
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      image: ''
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Testimonial text is required';
    }
    
    if (!formData.image) {
      newErrors.image = 'Image is required';
    }
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors in the form',
        variant: 'destructive'
      });
      return;
    }
    
    if (isEditMode && id) {
      updateTestimonial(id, formData);
      toast({
        title: 'Testimonial Updated',
        description: `Testimonial from ${formData.name} has been updated successfully.`
      });
    } else {
      addTestimonial(formData);
      toast({
        title: 'Testimonial Added',
        description: `Testimonial from ${formData.name} has been added successfully.`
      });
    }
    
    navigate('/admin/testimonials');
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
  
  return (
    <AdminLayout title={isEditMode ? 'Edit Testimonial' : 'Add New Testimonial'}>
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate('/admin/testimonials')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Testimonials
      </Button>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Client's Name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Testimonial</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What they said about your services"
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Client Image</Label>
              <ImageUpload
                value={formData.image}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, image: value }));
                  if (errors.image) {
                    setErrors(prev => ({ ...prev, image: '' }));
                  }
                }}
                className="max-w-md"
              />
              {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
              <p className="text-sm text-gray-500">Upload a photo of the client or their company logo.</p>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? 'Update Testimonial' : 'Add Testimonial'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default TestimonialForm;
