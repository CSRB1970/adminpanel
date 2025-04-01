
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Routes
import AdminDashboard from "./pages/admin/Dashboard";
import EmployeesPage from "./pages/admin/Employees";
import EmployeeForm from "./pages/admin/EmployeeForm";
import ProjectsPage from "./pages/admin/Projects";
import ProjectForm from "./pages/admin/ProjectForm";
import TestimonialsPage from "./pages/admin/Testimonials";
import TestimonialForm from "./pages/admin/TestimonialForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Employee routes */}
              <Route path="/admin/employees" element={
                <ProtectedRoute>
                  <EmployeesPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/employees/add" element={
                <ProtectedRoute>
                  <EmployeeForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/employees/edit/:id" element={
                <ProtectedRoute>
                  <EmployeeForm />
                </ProtectedRoute>
              } />
              
              {/* Project routes */}
              <Route path="/admin/projects" element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/projects/add" element={
                <ProtectedRoute>
                  <ProjectForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/projects/edit/:id" element={
                <ProtectedRoute>
                  <ProjectForm />
                </ProtectedRoute>
              } />
              
              {/* Testimonial routes */}
              <Route path="/admin/testimonials" element={
                <ProtectedRoute>
                  <TestimonialsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/testimonials/add" element={
                <ProtectedRoute>
                  <TestimonialForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/testimonials/edit/:id" element={
                <ProtectedRoute>
                  <TestimonialForm />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
