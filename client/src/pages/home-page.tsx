import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, User, BookOpen, Calendar, GraduationCap, 
  FileText, CreditCard, Database, LogOut
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
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

  const modules = [
    { name: 'Data Mahasiswa', icon: <Users className="h-6 w-6 mb-2" />, path: '/mahasiswa' },
    { name: 'Data Dosen', icon: <User className="h-6 w-6 mb-2" />, path: '/dosen' },
    { name: 'Mata Kuliah', icon: <BookOpen className="h-6 w-6 mb-2" />, path: '/mata-kuliah' },
    { name: 'Jadwal Perkuliahan', icon: <Calendar className="h-6 w-6 mb-2" />, path: '/jadwal' },
    { name: 'Nilai Mahasiswa', icon: <GraduationCap className="h-6 w-6 mb-2" />, path: '/nilai' },
    { name: 'Absensi', icon: <FileText className="h-6 w-6 mb-2" />, path: '/absensi' },
    { name: 'Keuangan', icon: <CreditCard className="h-6 w-6 mb-2" />, path: '/keuangan' },
    { name: 'Dokumen', icon: <FileText className="h-6 w-6 mb-2" />, path: '/dokumen' },
    { name: 'PDDikti', icon: <Database className="h-6 w-6 mb-2" />, path: '/pddikti' },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard SIAKAD</h1>
          <p className="text-muted-foreground">Selamat datang, {user.fullName}</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          Logout
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ringkasan</CardTitle>
          <CardDescription>Statistik dan informasi penting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-secondary p-4 rounded-lg flex items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Mahasiswa</p>
                <p className="text-2xl font-bold">1,203</p>
              </div>
            </div>
            <div className="bg-secondary p-4 rounded-lg flex items-center gap-4">
              <User className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Dosen</p>
                <p className="text-2xl font-bold">87</p>
              </div>
            </div>
            <div className="bg-secondary p-4 rounded-lg flex items-center gap-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Mata Kuliah Aktif</p>
                <p className="text-2xl font-bold">142</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modul Sistem</CardTitle>
          <CardDescription>Akses semua fitur sistem akademik</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {modules.map((module) => (
              <Button
                key={module.path}
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center"
                onClick={() => navigate(module.path)}
              >
                {module.icon}
                <span>{module.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}