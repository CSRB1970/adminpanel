
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
import { Skeleton } from "@/components/ui/skeleton";

const EmployeesPage = () => {
  const { employees, deleteEmployee, loadingEmployees } = useAdmin();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleteId) {
      setIsDeleting(true);
      try {
        await deleteEmployee(deleteId);
        toast({
          title: "Employee deleted",
          description: "Employee has been successfully removed",
        });
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setDeleteId(null);
        setIsDeleting(false);
      }
    }
  };

  // Loading skeleton UI
  if (loadingEmployees) {
    return (
      <AdminLayout title="Employees">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">Manage your team members</p>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" /> Add Employee
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="flex justify-between">
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
    <AdminLayout title="Employees">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Manage your team members</p>
        <Button asChild>
          <Link to="/admin/employees/add">
            <Plus className="h-4 w-4 mr-2" /> Add Employee
          </Link>
        </Button>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <h3 className="text-lg font-medium text-gray-500 mb-2">No employees added yet</h3>
          <Button asChild variant="outline">
            <Link to="/admin/employees/add">
              <Plus className="h-4 w-4 mr-2" /> Add Your First Employee
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <Card key={employee.id} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={employee.image} 
                  alt={employee.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{employee.name}</CardTitle>
                <p className="text-sm text-gray-500">{employee.designation}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 line-clamp-3">{employee.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to={`/admin/employees/edit/${employee.id}`}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Link>
                </Button>
                <AlertDialog open={deleteId === employee.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" onClick={() => setDeleteId(employee.id)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {employee.name}. This action cannot be undone.
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

export default EmployeesPage;
