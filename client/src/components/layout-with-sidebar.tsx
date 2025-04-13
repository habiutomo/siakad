import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/ui/header';
import { useToast } from '@/hooks/use-toast';

interface LayoutWithSidebarProps {
  children: React.ReactNode;
}

export function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Redirect to login if not authenticated
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast({
          title: "Logout berhasil",
          description: "Anda telah keluar dari sistem"
        });
        navigate('/auth');
      }
    } catch (error) {
      toast({
        title: "Logout gagal",
        description: "Terjadi kesalahan saat logout",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col">
        <Header 
          user={{
            fullName: user.fullName,
            role: user.role 
          }} 
          onLogout={handleLogout}
        />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}