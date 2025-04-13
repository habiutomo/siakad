import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Users, User, BookOpen, Calendar, GraduationCap, 
  FileText, CreditCard, Database, BarChart3, 
  LayoutDashboard, ArrowRight, ArrowUpRight, Clock, 
  Bell, Activity, CheckCircle, Layers, School
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/ui/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  // Format date for welcome message
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('id-ID', options);

  // Upcoming classes (demo data)
  const upcomingClasses = [
    { 
      id: 1, 
      name: 'Algoritma & Pemrograman', 
      time: '10:00 - 11:40', 
      location: 'Ruang 2.3', 
      lecturer: 'Dr. Budi Santoso' 
    },
    { 
      id: 2, 
      name: 'Kalkulus II', 
      time: '13:00 - 14:40', 
      location: 'Ruang 3.2', 
      lecturer: 'Prof. Siti Rahayu' 
    }
  ];

  // Recent activities (demo data)
  const recentActivities = [
    { 
      id: 1, 
      title: 'Nilai telah diperbarui', 
      description: 'Nilai mata kuliah Basis Data telah diperbarui', 
      time: '30 menit yang lalu', 
      icon: <CheckCircle className="h-5 w-5 text-green-500" /> 
    },
    { 
      id: 2, 
      title: 'Jadwal baru ditambahkan', 
      description: 'Jadwal UAS semester genap telah dipublish', 
      time: '2 jam yang lalu', 
      icon: <Calendar className="h-5 w-5 text-blue-500" /> 
    },
    { 
      id: 3, 
      title: 'Sinkronisasi PDDikti', 
      description: 'Data mahasiswa berhasil disinkronkan', 
      time: '1 hari yang lalu', 
      icon: <Database className="h-5 w-5 text-purple-500" /> 
    }
  ];

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
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,203</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+21</span> dari bulan lalu
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+4</span> dari bulan lalu
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Mata Kuliah Aktif</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">142</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+12</span> dari semester lalu
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Program Studi</CardTitle>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    Dari 5 fakultas
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-6">
              <Card className="md:col-span-4">
                <CardHeader>
                  <CardTitle>Ringkasan Akademik</CardTitle>
                  <CardDescription>Visualisasi data akademik semester berjalan</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[300px] flex items-center justify-center">
                  <div className="text-muted-foreground text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-primary/70" />
                    <p>Data statistik dan visualisasi grafik akan ditampilkan di sini</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Status PDDikti</CardTitle>
                  <CardDescription>Sinkronisasi dengan Neo Feeder</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Mahasiswa</span>
                      </div>
                      <span className="text-sm text-muted-foreground">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Dosen</span>
                      </div>
                      <span className="text-sm text-muted-foreground">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <span>Mata Kuliah</span>
                      </div>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span>Nilai</span>
                      </div>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full" 
                    onClick={() => navigate('/pddikti')}
                  >
                    Lihat Detail
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Jadwal Hari Ini</CardTitle>
                  <CardDescription>Mata kuliah yang akan berlangsung</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingClasses.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingClasses.map((cls) => (
                        <div 
                          key={cls.id} 
                          className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="rounded-full p-2 bg-primary/10 text-primary">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between">
                              <p className="font-medium">{cls.name}</p>
                              <span className="text-sm text-muted-foreground">{cls.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{cls.location}</p>
                            <p className="text-sm text-muted-foreground">
                              Dosen: {cls.lecturer}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Tidak ada jadwal perkuliahan hari ini</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate('/jadwal')}
                  >
                    Lihat Semua Jadwal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>Update dan notifikasi sistem</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="rounded-full p-2 bg-primary/10">
                          {activity.icon}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    Lihat Semua Aktivitas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}