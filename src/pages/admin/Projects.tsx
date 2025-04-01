
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
import { Plus, Edit, Trash2, Image, Video, Film } from 'lucide-react';
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
import { VideoEmbed } from '@/components/admin/VideoEmbed';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectsPage = () => {
  const { projects, deleteProject, loadingProjects } = useAdmin();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [videoDialog, setVideoDialog] = useState<{open: boolean, url: string}>({
    open: false,
    url: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleteId) {
      setIsDeleting(true);
      try {
        await deleteProject(deleteId);
        toast({
          title: "Project deleted",
          description: "Project has been successfully removed",
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
  if (loadingProjects) {
    return (
      <AdminLayout title="Projects">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">Manage your portfolio projects</p>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" /> Add Project
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
    <AdminLayout title="Projects">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Manage your portfolio projects</p>
        <Button asChild>
          <Link to="/admin/projects/add">
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <h3 className="text-lg font-medium text-gray-500 mb-2">No projects added yet</h3>
          <Button asChild variant="outline">
            <Link to="/admin/projects/add">
              <Plus className="h-4 w-4 mr-2" /> Add Your First Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="aspect-video overflow-hidden bg-gray-100 relative">
                {project.images.length > 0 ? (
                  <img 
                    src={project.images[0]} 
                    alt={project.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <Image className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {project.images.length} {project.images.length === 1 ? 'image' : 'images'}
                </div>
                {project.videoUrl && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute top-2 right-2 rounded-full bg-black/70 hover:bg-black/90"
                    onClick={() => setVideoDialog({open: true, url: project.videoUrl || ''})}
                  >
                    <Film className="h-4 w-4 text-white" />
                    <span className="sr-only">Play Video</span>
                  </Button>
                )}
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {project.name}
                  {project.videoUrl && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Film className="h-3 w-3 mr-1" /> Video
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 line-clamp-3">{project.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to={`/admin/projects/edit/${project.id}`}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Link>
                </Button>
                <AlertDialog open={deleteId === project.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" onClick={() => setDeleteId(project.id)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this project. This action cannot be undone.
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

      {/* Video Dialog */}
      <Dialog 
        open={videoDialog.open} 
        onOpenChange={(open) => setVideoDialog(prev => ({...prev, open}))}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Project Video</DialogTitle>
            <DialogDescription>
              Watch the video presentation for this project
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <VideoEmbed url={videoDialog.url} />
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ProjectsPage;
