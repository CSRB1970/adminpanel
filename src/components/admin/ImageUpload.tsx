
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange, 
  className,
  disabled = false 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);
      
      if (error) {
        console.error('Upload error details:', error);
        throw error;
      }
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      // Pass the public URL to parent component
      onChange(publicUrl);
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded"
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    
    setIsLoading(true);
    
    try {
      // Extract file path from URL
      const fileNameWithPath = value.split('/').pop();
      
      if (fileNameWithPath) {
        // Remove file from Supabase Storage
        const { error } = await supabase.storage
          .from('images')
          .remove([fileNameWithPath]);
        
        if (error) {
          console.error('Removal error details:', error);
          throw error;
        }
      }
      
      // Clear the value in parent component
      onChange('');
      
      toast({
        title: "Image removed",
        description: "Your image has been deleted"
      });
    } catch (error: any) {
      console.error('Error removing image:', error);
      // Still clear the value even if storage removal fails
      onChange('');
      toast({
        title: "Warning",
        description: "Image reference removed, but file deletion may have failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {value ? (
        <div className="relative w-full h-auto rounded-md overflow-hidden border border-gray-200">
          <img 
            src={value} 
            alt="Uploaded image" 
            className="w-full h-auto object-cover" 
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 rounded-full"
            onClick={handleRemove}
            disabled={disabled || isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      ) : (
        <div className={`flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 w-full ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}>
          <label className={`flex flex-col items-center justify-center w-full ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            {isLoading ? (
              <Loader2 className="h-8 w-8 text-gray-400 mb-2 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
            )}
            <span className="text-sm text-gray-500 font-medium">
              {isLoading ? 'Uploading...' : 'Click to upload image'}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Max size: 5MB
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              disabled={isLoading || disabled}
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};

interface MultipleImageUploadProps {
  values: string[];
  onChange: (values: string[]) => void;
  max?: number;
  className?: string;
  disabled?: boolean;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({ 
  values, 
  onChange, 
  max = 10,
  className,
  disabled = false
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files?.length) return;
    
    // Check if adding would exceed max
    if (values.length + files.length > max) {
      toast({
        title: `Maximum ${max} images allowed`,
        description: `Please select fewer images (${max - values.length} more allowed)`,
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Array to store new URLs
    const newUrls: string[] = [];
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size and type
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is over 5MB and will be skipped`,
          variant: "destructive"
        });
        continue;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image and will be skipped`,
          variant: "destructive"
        });
        continue;
      }
      
      try {
        // Generate a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('images')
          .upload(filePath, file);
        
        if (error) {
          console.error(`Upload error for ${file.name}:`, error);
          throw error;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        newUrls.push(publicUrl);
      } catch (error: any) {
        console.error(`Error uploading ${file.name}:`, error);
        toast({
          title: "Upload failed",
          description: `Could not upload ${file.name}: ${error.message || "Unknown error"}`,
          variant: "destructive"
        });
      }
    }
    
    // Update with new URLs if any successful uploads
    if (newUrls.length > 0) {
      onChange([...values, ...newUrls]);
      toast({
        title: "Upload successful",
        description: `${newUrls.length} image(s) uploaded successfully`
      });
    }
    
    setIsLoading(false);
  };

  const removeImage = async (index: number) => {
    const imageUrl = values[index];
    
    try {
      // Extract file path from URL
      const fileNameWithPath = imageUrl.split('/').pop();
      
      if (fileNameWithPath) {
        // Remove from Supabase Storage
        const { error } = await supabase.storage
          .from('images')
          .remove([fileNameWithPath]);
        
        if (error) {
          console.error('Error removing image from storage:', error);
        }
      }
      
      // Remove from array regardless of storage success
      onChange(values.filter((_, i) => i !== index));
      
      toast({
        title: "Image removed",
        description: "The image has been deleted"
      });
    } catch (error) {
      console.error('Error removing image:', error);
      // Still remove from array
      onChange(values.filter((_, i) => i !== index));
      toast({
        title: "Warning",
        description: "Image reference removed, but file deletion may have failed",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {values.map((image, index) => (
        <div key={index} className="relative aspect-video rounded-md overflow-hidden border border-gray-200">
          <img 
            src={image} 
            alt={`Image ${index + 1}`} 
            className="w-full h-full object-cover" 
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 rounded-full"
            onClick={() => removeImage(index)}
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      {values.length < max && (
        <div className={`flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md aspect-video ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}>
          <label className={`flex flex-col items-center justify-center w-full h-full ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            {isLoading ? (
              <Loader2 className="h-8 w-8 text-gray-400 mb-2 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
            )}
            <span className="text-sm text-gray-500 font-medium text-center">
              {isLoading ? 'Uploading...' : 'Add Images'}
            </span>
            <span className="text-xs text-gray-400 mt-1 text-center">
              Max size: 5MB each
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              disabled={isLoading || disabled}
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};
