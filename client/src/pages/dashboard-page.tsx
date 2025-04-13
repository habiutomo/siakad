import React, { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Users, 
  BookOpen, 
  Database, 
  UserPlus, 
  RefreshCw, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Wifi 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest } from '@/lib/queryClient';

// Type definitions
type DashboardStats = {
  totalStudents: number;
  totalLecturers: number;
  totalCourses: number;
  activeCourses: number;
  activeSemester: {
    id: number;
    name: string;
    academicYear: string;
  } | null;
  pddiktiStatus: {
    status: string;
    lastSync?: string;
  };
};

type RecentActivity = {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
};

export default function DashboardPage() {
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  
  // Fetch dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  // Fetch recent activities
  const { data: activities, isLoading: isLoadingActivities } = useQuery<RecentActivity[]>({
    queryKey: ['/api/dashboard/recent-activities'],
  });

  // Fetch semesters for dropdown
  const { data: semesters } = useQuery({
    queryKey: ['/api/semesters'],
  });

  // Handler for starting PDDikti sync
  const handleSyncPDDikti = async () => {
    try {
      await apiRequest('POST', '/api/pddikti/sync', { entity: 'all' });
    } catch (error) {
      console.error('Failed to sync with PDDikti:', error);
    }
  };

  // Map icon names to Lucide React components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'user-add': return <UserPlus className="text-info" />;
      case 'database-2': return <Database className="text-success" />;
      case 'error-warning': return <AlertTriangle className="text-warning" />;
      case 'calendar-event': return <Calendar className="text-warning" />;
      default: return <Database className="text-primary" />;
    }
  };

  return (
    <AppLayout
      title="Dashboard Akademik"
      breadcrumbs={[{ label: 'Dashboard' }]}
      actions={
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Semester Aktif:</span>
          <Select 
            value={selectedSemester} 
            onValueChange={setSelectedSemester}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={stats?.activeSemester?.name || "Pilih Semester"} />
            </SelectTrigger>
            <SelectContent>
              {semesters?.map((semester: any) => (
                <SelectItem key={semester.id} value={semester.id.toString()}>
                  {semester.name} {semester.academicYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoadingStats ? (
          // Skeleton loaders for stats cards
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="shadow-sm border border-neutral-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Actual stats cards
          <>
            <DashboardCard
              title="Total Mahasiswa"
              value={stats?.totalStudents.toLocaleString() || '0'}
              icon={<User className="text-xl text-primary" />}
              iconBgColor="bg-primary/10"
              trend={{ value: "5.2% dari semester lalu", direction: "up" }}
            />
            
            <DashboardCard
              title="Total Dosen"
              value={stats?.totalLecturers.toLocaleString() || '0'}
              icon={<Users className="text-xl text-secondary" />}
              iconBgColor="bg-secondary/10"
              trend={{ value: "2.4% dari semester lalu", direction: "up" }}
            />
            
            <DashboardCard
              title="Mata Kuliah Aktif"
              value={stats?.activeCourses.toLocaleString() || '0'}
              icon={<BookOpen className="text-xl text-accent" />}
              iconBgColor="bg-accent/10"
            >
              <p className="text-xs text-neutral-500 flex items-center mt-1">
                <span>{stats?.activeSemester?.name || 'Tidak ada semester aktif'}</span>
              </p>
            </DashboardCard>
            
            <DashboardCard
              title="Status PDDikti"
              value=""
              icon={<Database className="text-xl text-success" />}
              iconBgColor="bg-success/10"
            >
              <h3 className="text-lg font-bold mt-1 flex items-center text-success">
                <CheckCircle className="mr-2" size={18} />
                <span>{stats?.pddiktiStatus?.status === 'completed' ? 'Tersinkronisasi' : 'Perlu Sinkronisasi'}</span>
              </h3>
              <p className="text-xs text-neutral-500 flex items-center mt-1">
                <span>
                  {stats?.pddiktiStatus?.lastSync 
                    ? `Terakhir: ${new Date(stats.pddiktiStatus.lastSync).toLocaleString('id-ID')}`
                    : 'Belum pernah disinkronisasi'}
                </span>
              </p>
            </DashboardCard>
          </>
        )}
      </div>
      
      {/* Analytics & Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart Section */}
        <Card className="shadow-sm border border-neutral-200 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold">Kehadiran Mahasiswa</CardTitle>
              <Select defaultValue="week">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tampilkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Minggu Ini</SelectItem>
                  <SelectItem value="month">Bulan Ini</SelectItem>
                  <SelectItem value="semester">Semester Ini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {/* Placeholder for chart - in a real implementation, use Chart.js or similar */}
            <div className="h-64 bg-neutral-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-neutral-400">
                <Database className="h-12 w-12 mx-auto mb-2" />
                <p>Chart: Persentase Kehadiran Mahasiswa</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activities */}
        <Card className="shadow-sm border border-neutral-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold">Aktivitas Terbaru</CardTitle>
              <Button variant="link" className="text-primary p-0">Lihat Semua</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingActivities ? (
                // Skeleton loaders for activities
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start pb-3 border-b border-neutral-100">
                    <Skeleton className="h-8 w-8 rounded-full mr-3" />
                    <div className="w-full">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))
              ) : (
                // Actual activities
                activities?.map((activity, index) => (
                  <div key={index} className="flex items-start pb-3 border-b border-neutral-100">
                    <div className={`bg-${activity.type === 'enrollment' ? 'info' : activity.type === 'sync' && activity.description.includes('completed') ? 'success' : 'warning'}/10 p-2 rounded-full mr-3`}>
                      {getIconComponent(activity.icon)}
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.title}</span> {activity.description}
                      </p>
                      <span className="text-xs text-neutral-500">
                        {new Date(activity.timestamp).toLocaleString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* PDDikti Integration Status */}
      <Card className="shadow-sm border border-neutral-200 mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Status Integrasi PDDikti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Sync Status Card */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="p-2 bg-success/10 rounded-lg mr-3">
                  <RefreshCw className="text-xl text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800">Sinkronisasi Data</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    {stats?.pddiktiStatus?.lastSync 
                      ? `Terakhir: ${new Date(stats.pddiktiStatus.lastSync).toLocaleString('id-ID')}`
                      : 'Belum pernah disinkronisasi'}
                  </p>
                  <p className="text-xs text-success mt-1">
                    {stats?.pddiktiStatus?.status === 'completed' 
                      ? 'Semua data tersinkronisasi' 
                      : 'Perlu sinkronisasi'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Validation Status Card */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="p-2 bg-warning/10 rounded-lg mr-3">
                  <AlertTriangle className="text-xl text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800">Validasi Data</h3>
                  <p className="text-sm text-neutral-500 mt-1">5 peringatan validasi</p>
                  <p className="text-xs text-warning mt-1">Perlu tindakan segera</p>
                </div>
              </div>
            </div>
            
            {/* API Status Card */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="p-2 bg-success/10 rounded-lg mr-3">
                  <Wifi className="text-xl text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800">Status API</h3>
                  <p className="text-sm text-neutral-500 mt-1">Terhubung ke Neo Feeder</p>
                  <p className="text-xs text-success mt-1">Semua layanan berjalan normal</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Validation Issues */}
          <div className="border border-neutral-100 rounded-lg overflow-hidden mb-4">
            <div className="bg-neutral-50 p-3 border-b border-neutral-100">
              <h3 className="font-medium">Masalah Validasi Terdeteksi</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-start p-3 border border-warning/30 bg-warning/5 rounded-lg">
                  <AlertTriangle className="text-warning mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Data mahasiswa tidak lengkap</p>
                    <p className="text-xs text-neutral-600 mt-1">3 mahasiswa tidak memiliki data NIK yang valid sesuai ketentuan PDDikti</p>
                    <Button variant="link" className="text-xs text-primary p-0 mt-2">Perbaiki Sekarang</Button>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border border-warning/30 bg-warning/5 rounded-lg">
                  <AlertTriangle className="text-warning mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Format tanggal lahir tidak sesuai</p>
                    <p className="text-xs text-neutral-600 mt-1">2 mahasiswa memiliki format tanggal lahir yang tidak sesuai dengan ketentuan PDDikti</p>
                    <Button variant="link" className="text-xs text-primary p-0 mt-2">Perbaiki Sekarang</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sync Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              className="flex items-center gap-2 bg-primary text-white"
              onClick={handleSyncPDDikti}
            >
              <RefreshCw size={16} />
              <span>Sinkronisasi Sekarang</span>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 text-primary border-primary">
              <Database size={16} />
              <span>Riwayat Sinkronisasi</span>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Pengaturan PDDikti</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
