
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Plus, Edit, Trash2, Quote, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const TestimonialsPage = () => {
  const { testimonials, deleteTestimonial, loadingTestimonials } = useAdmin();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleteId) {
      setIsDeleting(true);
      try {
        await deleteTestimonial(deleteId);
        toast({
          title: "Testimonial deleted",
          description: "Testimonial has been successfully removed",
        });
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setDeleteId(null);
        setIsDeleting(false);
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading skeleton UI
  if (loadingTestimonials) {
    return (
      <AdminLayout title="Testimonials">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">Manage client testimonials</p>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" /> Add Testimonial
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Testimonials">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Manage client testimonials</p>
        <Button asChild>
          <Link to="/admin/testimonials/add">
            <Plus className="h-4 w-4 mr-2" /> Add Testimonial
          </Link>
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <h3 className="text-lg font-medium text-gray-500 mb-2">No testimonials added yet</h3>
          <Button asChild variant="outline">
            <Link to="/admin/testimonials/add">
              <Plus className="h-4 w-4 mr-2" /> Add Your First Testimonial
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{testimonial.name}</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Quote className="h-6 w-6 text-gray-300 absolute -top-2 -left-1" />
                  <p className="pl-7 text-gray-700">{testimonial.description}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link to={`/admin/testimonials/edit/${testimonial.id}`}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Link>
                </Button>
                <AlertDialog open={deleteId === testimonial.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" onClick={() => setDeleteId(testimonial.id)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this testimonial from {testimonial.name}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete} 
                        disabled={isDeleting}
                        className={isDeleting ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default TestimonialsPage;
