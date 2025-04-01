
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdmin, Project } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { MultipleImageUpload } from '@/components/admin/ImageUpload';
import { VideoEmbed } from '@/components/admin/VideoEmbed';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save, Video } from 'lucide-react';

const ProjectForm = () => {
  const { id } = useParams();
  const { projects, addProject, updateProject } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isEditMode = !!id;
  const existingProject = isEditMode 
    ? projects.find(proj => proj.id === id) 
    : null;
  
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: '',
    description: '',
    details: '',
    images: [],
    videoUrl: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    details: '',
    images: '',
    videoUrl: ''
  });
  
  const [previewVideo, setPreviewVideo] = useState(false);
  
  useEffect(() => {
    if (existingProject) {
      setFormData({
        name: existingProject.name,
        description: existingProject.description,
        details: existingProject.details,
        images: [...existingProject.images],
        videoUrl: existingProject.videoUrl || ''
      });
      if (existingProject.videoUrl) {
        setPreviewVideo(true);
      }
    }
  }, [existingProject]);
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      details: '',
      images: '',
      videoUrl: ''
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.details.trim()) {
      newErrors.details = 'Details are required';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    // Video URL validation is optional, so we don't check for emptiness
    if (formData.videoUrl && !formData.videoUrl.includes('youtube.com') && 
        !formData.videoUrl.includes('youtu.be') && 
        !formData.videoUrl.includes('vimeo.com')) {
      newErrors.videoUrl = 'Please enter a valid YouTube or Vimeo URL';
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
      updateProject(id, formData);
      toast({
        title: 'Project Updated',
        description: `${formData.name} has been updated successfully.`
      });
    } else {
      addProject(formData);
      toast({
        title: 'Project Added',
        description: `${formData.name} has been added successfully.`
      });
    }
    
    navigate('/admin/projects');
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
    
    // If it's the video URL field, reset the preview flag
    if (name === 'videoUrl') {
      setPreviewVideo(false);
    }
  };
  
  return (
    <AdminLayout title={isEditMode ? 'Edit Project' : 'Add New Project'}>
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate('/admin/projects')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
      </Button>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name of the Project"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="A brief description of the project"
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="details">Project Details</Label>
              <Textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Comprehensive details about the project, challenges, and solutions"
                rows={6}
                className={errors.details ? 'border-red-500' : ''}
              />
              {errors.details && <p className="text-red-500 text-sm">{errors.details}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL (YouTube or Vimeo)</Label>
              <div className="flex gap-2">
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`flex-1 ${errors.videoUrl ? 'border-red-500' : ''}`}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => formData.videoUrl ? setPreviewVideo(!previewVideo) : null}
                  disabled={!formData.videoUrl}
                >
                  {previewVideo ? 'Hide' : 'Preview'}
                </Button>
              </div>
              {errors.videoUrl && <p className="text-red-500 text-sm">{errors.videoUrl}</p>}
              <p className="text-sm text-gray-500">Enter a YouTube or Vimeo video URL for your project.</p>
              
              {previewVideo && formData.videoUrl && (
                <div className="mt-2">
                  <VideoEmbed url={formData.videoUrl} />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Project Images (Max 10)</Label>
              <MultipleImageUpload
                values={formData.images}
                onChange={(values) => {
                  setFormData(prev => ({ ...prev, images: values }));
                  if (errors.images) {
                    setErrors(prev => ({ ...prev, images: '' }));
                  }
                }}
                max={10}
              />
              {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
              <p className="text-sm text-gray-500">Upload up to 10 images showcasing your project.</p>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? 'Update Project' : 'Add Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ProjectForm;
