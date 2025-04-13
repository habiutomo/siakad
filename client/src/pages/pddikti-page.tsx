import React, { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation } from '@tanstack/react-query';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Database,
  Clock,
  Calendar,
  User,
  Users,
  BookOpen,
  Settings, 
  Wifi,
  History,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Mock types for PDDikti related data
interface SyncStatus {
  students?: {
    status: string;
    lastSync?: string;
    itemsProcessed?: number;
    itemsSuccessful?: number;
    itemsFailed?: number;
  };
  lecturers?: {
    status: string;
    lastSync?: string;
    itemsProcessed?: number;
    itemsSuccessful?: number;
    itemsFailed?: number;
  };
  courses?: {
    status: string;
    lastSync?: string;
    itemsProcessed?: number;
    itemsSuccessful?: number;
    itemsFailed?: number;
  };
  lastSync?: {
    status: string;
    startTime: string;
    endTime?: string;
    syncType: string;
  };
}

interface SyncLog {
  id: number;
  syncType: string;
  startTime: string;
  endTime: string | null;
  status: string;
  itemsProcessed: number;
  itemsSuccessful: number;
  itemsFailed: number;
  errors: any[] | null;
}

interface ValidationIssue {
  id: string;
  type: string;
  message: string;
  details: string;
  affectedItems: number;
  severity: 'high' | 'medium' | 'low';
}

export default function PDDiktiPage() {
  const [activeTab, setActiveTab] = useState<string>("status");
  const { toast } = useToast();
  
  // Fetch PDDikti sync status
  const { data: syncStatus, isLoading: isLoadingStatus } = useQuery<SyncStatus>({
    queryKey: ['/api/pddikti/status'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/pddikti/status');
        if (!response.ok) {
          throw new Error('Failed to fetch PDDikti status');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching PDDikti status:', error);
        return {
          students: { status: 'never_synced' },
          lecturers: { status: 'never_synced' },
          courses: { status: 'never_synced' }
        };
      }
    },
  });

  // Fetch sync logs
  const { data: syncLogs, isLoading: isLoadingLogs } = useQuery<SyncLog[]>({
    queryKey: ['/api/pddikti/sync-logs'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/pddikti/sync-logs');
        if (!response.ok) {
          throw new Error('Failed to fetch sync logs');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching sync logs:', error);
        return [];
      }
    },
  });

  // Mock validation issues - this would typically come from the API
  const validationIssues: ValidationIssue[] = [
    {
      id: '1',
      type: 'student_data',
      message: 'Data mahasiswa tidak lengkap',
      details: '3 mahasiswa tidak memiliki data NIK yang valid sesuai ketentuan PDDikti',
      affectedItems: 3,
      severity: 'high'
    },
    {
      id: '2',
      type: 'date_format',
      message: 'Format tanggal lahir tidak sesuai',
      details: '2 mahasiswa memiliki format tanggal lahir yang tidak sesuai dengan ketentuan PDDikti',
      affectedItems: 2,
      severity: 'medium'
    },
    {
      id: '3',
      type: 'course_data',
      message: 'Informasi mata kuliah tidak lengkap',
      details: '5 mata kuliah tidak memiliki data lengkap sesuai standar PDDikti',
      affectedItems: 5,
      severity: 'medium'
    },
    {
      id: '4',
      type: 'lecturer_data',
      message: 'Data NIDN dosen tidak valid',
      details: '1 dosen memiliki NIDN yang tidak sesuai dengan format PDDikti',
      affectedItems: 1,
      severity: 'high'
    }
  ];

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: async (entity: string) => {
      const response = await apiRequest('POST', '/api/pddikti/sync', { entity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pddikti/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pddikti/sync-logs'] });
      toast({
        title: 'Sinkronisasi dimulai',
        description: 'Proses sinkronisasi sedang berjalan di latar belakang.',
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Sinkronisasi gagal',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Function to get appropriate icon for sync status
  const getSyncStatusInfo = (status?: string) => {
    if (!status || status === 'never_synced') {
      return { 
        icon: <AlertCircle className="text-warning" />, 
        text: 'Belum Pernah Disinkronisasi',
        variant: 'warning' as const
      };
    }
    
    switch (status) {
      case 'completed':
        return { 
          icon: <CheckCircle className="text-success" />, 
          text: 'Tersinkronisasi',
          variant: 'success' as const
        };
      case 'in_progress':
        return { 
          icon: <RefreshCw className="text-info animate-spin" />, 
          text: 'Sedang Proses',
          variant: 'info' as const
        };
      case 'failed':
        return { 
          icon: <AlertTriangle className="text-error" />, 
          text: 'Gagal',
          variant: 'error' as const
        };
      default:
        return { 
          icon: <AlertCircle className="text-warning" />, 
          text: 'Status Tidak Diketahui',
          variant: 'warning' as const
        };
    }
  };

  // Get sync entities
  const entities = [
    { 
      key: 'students', 
      name: 'Mahasiswa', 
      icon: <User className="text-xl text-primary" />, 
      status: syncStatus?.students?.status 
    },
    { 
      key: 'lecturers', 
      name: 'Dosen', 
      icon: <Users className="text-xl text-secondary" />, 
      status: syncStatus?.lecturers?.status 
    },
    { 
      key: 'courses', 
      name: 'Mata Kuliah', 
      icon: <BookOpen className="text-xl text-accent" />, 
      status: syncStatus?.courses?.status 
    }
  ];

  return (
    <AppLayout
      title="Integrasi PDDikti"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'PDDikti' }
      ]}
      actions={
        <Button 
          className="flex gap-2 items-center"
          onClick={() => syncMutation.mutate('all')}
          disabled={syncMutation.isPending}
        >
          <RefreshCw size={16} className={syncMutation.isPending ? 'animate-spin' : ''} />
          <span>Sinkronisasi Semua</span>
        </Button>
      }
    >
      {/* Status Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Sync Status Card */}
        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 bg-success/10 rounded-lg mr-3">
                <RefreshCw className="text-xl text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">Sinkronisasi Data</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {syncStatus?.lastSync
                    ? `Terakhir: ${format(new Date(syncStatus.lastSync.startTime), 'dd MMM yyyy, HH:mm', { locale: id })}`
                    : 'Belum pernah disinkronisasi'}
                </p>
                <p className="text-xs text-success mt-1">
                  {syncStatus?.lastSync?.status === 'completed'
                    ? 'Semua data tersinkronisasi'
                    : 'Perlu sinkronisasi'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Validation Status Card */}
        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 bg-warning/10 rounded-lg mr-3">
                <AlertTriangle className="text-xl text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">Validasi Data</h3>
                <p className="text-sm text-neutral-500 mt-1">{validationIssues.length} peringatan validasi</p>
                <p className="text-xs text-warning mt-1">Perlu tindakan segera</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* API Status Card */}
        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="status" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="validation">Validasi</TabsTrigger>
          <TabsTrigger value="history">Riwayat Sinkronisasi</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
        </TabsList>
        
        {/* Status Tab */}
        <TabsContent value="status">
          <div className="space-y-6">
            <Card className="shadow-sm border border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Status Integrasi PDDikti</CardTitle>
                <CardDescription>
                  Berikut adalah status integrasi antara SIAKAD dan sistem PDDikti.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {entities.map(entity => {
                    const statusInfo = getSyncStatusInfo(entity.status);
                    const entityStatus = syncStatus?.[entity.key as keyof typeof syncStatus] as any;
                    
                    return (
                      <div key={entity.key} className="border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="p-2 bg-primary/10 rounded-lg mr-3">
                              {entity.icon}
                            </div>
                            <h3 className="font-semibold">{entity.name}</h3>
                          </div>
                          {statusInfo.icon}
                        </div>
                        
                        <StatusBadge status={statusInfo.text} variant={statusInfo.variant} />
                        
                        {entityStatus?.lastSync && (
                          <p className="text-xs text-neutral-500 mt-3">
                            Terakhir: {format(new Date(entityStatus.lastSync), 'dd MMM yyyy, HH:mm', { locale: id })}
                          </p>
                        )}
                        
                        {entityStatus?.itemsProcessed && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Berhasil: {entityStatus.itemsSuccessful}/{entityStatus.itemsProcessed}</span>
                              <span className="text-error">Gagal: {entityStatus.itemsFailed}</span>
                            </div>
                            <Progress 
                              value={(entityStatus.itemsSuccessful / entityStatus.itemsProcessed) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4"
                          onClick={() => syncMutation.mutate(entity.key)}
                          disabled={syncMutation.isPending || entity.status === 'in_progress'}
                        >
                          <RefreshCw size={14} className="mr-2" /> Sinkronisasi {entity.name}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Masalah Validasi Terdeteksi</CardTitle>
                <CardDescription>
                  Berikut adalah masalah validasi yang perlu diselesaikan agar data dapat disinkronisasi dengan PDDikti.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {validationIssues.slice(0, 2).map(issue => (
                    <div 
                      key={issue.id} 
                      className="flex items-start p-3 border border-warning/30 bg-warning/5 rounded-lg"
                    >
                      <AlertTriangle className="text-warning mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{issue.message}</p>
                        <p className="text-xs text-neutral-600 mt-1">{issue.details}</p>
                        <Button variant="link" size="sm" className="h-7 px-0 text-xs text-primary mt-1">
                          Perbaiki Sekarang
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={() => setActiveTab('validation')}
                >
                  Lihat Semua Masalah Validasi
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Validation Tab */}
        <TabsContent value="validation">
          <Card className="shadow-sm border border-neutral-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Validasi Data PDDikti</CardTitle>
              <CardDescription>
                Daftar lengkap masalah validasi yang terdeteksi pada data. Validasi data diperlukan untuk memastikan kompatibilitas dengan sistem PDDikti.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {validationIssues.map(issue => (
                  <Accordion type="single" collapsible key={issue.id}>
                    <AccordionItem value={issue.id} className="border border-neutral-200 rounded-lg">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center">
                          <div className={`p-1.5 rounded-full mr-3 ${
                            issue.severity === 'high' ? 'bg-error/10' : 
                            issue.severity === 'medium' ? 'bg-warning/10' : 
                            'bg-info/10'
                          }`}>
                            <AlertTriangle className={`h-4 w-4 ${
                              issue.severity === 'high' ? 'text-error' : 
                              issue.severity === 'medium' ? 'text-warning' : 
                              'text-info'
                            }`} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-sm">{issue.message}</p>
                            <p className="text-xs text-neutral-500">
                              {issue.affectedItems} item terpengaruh
                            </p>
                          </div>
                          <StatusBadge 
                            status={
                              issue.severity === 'high' ? 'Tinggi' : 
                              issue.severity === 'medium' ? 'Sedang' : 
                              'Rendah'
                            } 
                            variant={
                              issue.severity === 'high' ? 'error' : 
                              issue.severity === 'medium' ? 'warning' : 
                              'info'
                            }
                          />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-0">
                        <div className="pl-10 border-l-2 border-neutral-200 ml-2">
                          <h4 className="font-medium text-sm mb-2">Detail Masalah:</h4>
                          <p className="text-sm text-neutral-600 mb-3">{issue.details}</p>
                          
                          <h4 className="font-medium text-sm mb-2">Langkah Perbaikan:</h4>
                          <ol className="text-sm text-neutral-600 list-decimal pl-5 mb-4 space-y-1">
                            <li>Buka menu yang sesuai ({
                              issue.type === 'student_data' ? 'Mahasiswa' : 
                              issue.type === 'lecturer_data' ? 'Dosen' : 
                              issue.type === 'course_data' ? 'Mata Kuliah' : 
                              'Data terkait'
                            })</li>
                            <li>Gunakan filter untuk menemukan data yang bermasalah</li>
                            <li>Perbaiki data sesuai dengan standar PDDikti</li>
                            <li>Simpan perubahan dan validasi kembali</li>
                          </ol>
                          
                          <div className="flex gap-2">
                            <Button size="sm">
                              Perbaiki Data
                            </Button>
                            <Button variant="outline" size="sm">
                              Abaikan
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-neutral-200 p-4">
              <p className="text-sm text-neutral-500">
                Total {validationIssues.length} masalah validasi terdeteksi
              </p>
              <Button className="flex items-center gap-2">
                <RefreshCw size={16} />
                <span>Validasi Ulang</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history">
          <Card className="shadow-sm border border-neutral-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Riwayat Sinkronisasi</CardTitle>
              <CardDescription>
                Riwayat sinkronisasi data antara SIAKAD dan sistem PDDikti.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <div className="py-8 text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                  <p className="text-neutral-500">Memuat riwayat sinkronisasi...</p>
                </div>
              ) : syncLogs?.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-neutral-200 rounded-lg">
                  <History className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-neutral-800 mb-2">Belum Ada Riwayat</p>
                  <p className="text-neutral-500 text-center mx-auto max-w-md mb-6">
                    Belum ada sinkronisasi data yang dilakukan dengan PDDikti.
                  </p>
                  <Button 
                    onClick={() => syncMutation.mutate('all')}
                    disabled={syncMutation.isPending}
                  >
                    <RefreshCw size={16} className="mr-2" /> Mulai Sinkronisasi
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {syncLogs?.map((log) => {
                    const statusInfo = getSyncStatusInfo(log.status);
                    const isExpanded = log.status === 'failed';
                    
                    return (
                      <Accordion type="single" collapsible key={log.id} defaultValue={isExpanded ? log.id.toString() : undefined}>
                        <AccordionItem value={log.id.toString()} className="border border-neutral-200 rounded-lg">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-center w-full">
                              <div className="mr-3">
                                {statusInfo.icon}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="font-medium text-sm">
                                  Sinkronisasi {
                                    log.syncType === 'students' ? 'Mahasiswa' : 
                                    log.syncType === 'lecturers' ? 'Dosen' : 
                                    log.syncType === 'courses' ? 'Mata Kuliah' : 
                                    'Data'
                                  }
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {format(new Date(log.startTime), 'dd MMM yyyy, HH:mm', { locale: id })}
                                </p>
                              </div>
                              <StatusBadge 
                                status={statusInfo.text} 
                                variant={statusInfo.variant}
                              />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-0">
                            <div className="space-y-3 pl-10">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-neutral-500">Waktu Mulai</p>
                                  <p className="text-sm">
                                    {format(new Date(log.startTime), 'dd MMM yyyy, HH:mm:ss', { locale: id })}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-neutral-500">Waktu Selesai</p>
                                  <p className="text-sm">
                                    {log.endTime 
                                      ? format(new Date(log.endTime), 'dd MMM yyyy, HH:mm:ss', { locale: id })
                                      : '-'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-neutral-500">Jumlah Diproses</p>
                                  <p className="text-sm font-medium">{log.itemsProcessed}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-neutral-500">Hasil</p>
                                  <p className="text-sm">
                                    <span className="text-success">{log.itemsSuccessful} berhasil</span>
                                    {log.itemsFailed > 0 && (
                                      <span className="text-error ml-2">{log.itemsFailed} gagal</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              
                              {log.errors && log.errors.length > 0 && (
                                <div>
                                  <Separator className="my-3" />
                                  <p className="text-sm font-medium text-error mb-2">Errors:</p>
                                  <div className="bg-error/5 border border-error/20 rounded-lg p-3 text-sm">
                                    <pre className="whitespace-pre-wrap text-neutral-800 text-xs">
                                      {JSON.stringify(log.errors, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="shadow-sm border border-neutral-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Pengaturan PDDikti</CardTitle>
              <CardDescription>
                Konfigurasi koneksi ke sistem Neo Feeder PDDikti dan pengaturan sinkronisasi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-3">Kredensial API PDDikti</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="pddikti-url" className="text-sm font-medium">URL Endpoint</label>
                      <div className="flex">
                        <input 
                          id="pddikti-url" 
                          type="text"
                          value="https://api.pddikti.kemdikbud.go.id"
                          className="w-full border border-neutral-200 rounded-l-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                          disabled
                        />
                        <Button variant="outline" size="sm" className="rounded-l-none">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="pddikti-username" className="text-sm font-medium">Username</label>
                      <div className="flex">
                        <input 
                          id="pddikti-username" 
                          type="text"
                          value="user_kampus"
                          className="w-full border border-neutral-200 rounded-l-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                          disabled
                        />
                        <Button variant="outline" size="sm" className="rounded-l-none">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="pddikti-password" className="text-sm font-medium">Password</label>
                      <div className="flex">
                        <input 
                          id="pddikti-password" 
                          type="password"
                          value="********"
                          className="w-full border border-neutral-200 rounded-l-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                          disabled
                        />
                        <Button variant="outline" size="sm" className="rounded-l-none">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="pddikti-token" className="text-sm font-medium">Token</label>
                      <div className="flex">
                        <input 
                          id="pddikti-token" 
                          type="text"
                          value="eyJhbGciOiJIUzI1NiIsInR5..."
                          className="w-full border border-neutral-200 rounded-l-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                          disabled
                        />
                        <Button variant="outline" size="sm" className="rounded-l-none">Refresh</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-md font-medium mb-3">Pengaturan Sinkronisasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="sync-schedule" className="text-sm font-medium">Jadwal Sinkronisasi Otomatis</label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="sync-schedule">
                          <SelectValue placeholder="Pilih Jadwal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Setiap Jam</SelectItem>
                          <SelectItem value="daily">Setiap Hari</SelectItem>
                          <SelectItem value="weekly">Setiap Minggu</SelectItem>
                          <SelectItem value="monthly">Setiap Bulan</SelectItem>
                          <SelectItem value="manual">Manual (Tidak Otomatis)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="sync-time" className="text-sm font-medium">Waktu Sinkronisasi</label>
                      <input 
                        id="sync-time" 
                        type="time"
                        defaultValue="01:00"
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="sync-batch-size" className="text-sm font-medium">Ukuran Batch</label>
                      <Select defaultValue="100">
                        <SelectTrigger id="sync-batch-size">
                          <SelectValue placeholder="Pilih Ukuran Batch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50 item per batch</SelectItem>
                          <SelectItem value="100">100 item per batch</SelectItem>
                          <SelectItem value="200">200 item per batch</SelectItem>
                          <SelectItem value="500">500 item per batch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="sync-retry-count" className="text-sm font-medium">Jumlah Percobaan Ulang</label>
                      <Select defaultValue="3">
                        <SelectTrigger id="sync-retry-count">
                          <SelectValue placeholder="Pilih Jumlah Percobaan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 kali</SelectItem>
                          <SelectItem value="3">3 kali</SelectItem>
                          <SelectItem value="5">5 kali</SelectItem>
                          <SelectItem value="10">10 kali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-info/5 border border-info/20 rounded-lg flex items-start">
                  <AlertCircle className="text-info mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral-800">Verifikasi Koneksi</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Koneksi ke PDDikti terakhir diverifikasi pada {format(new Date(), 'dd MMMM yyyy, HH:mm', { locale: id })}.
                      Status koneksi: <span className="text-success font-medium">Terhubung</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-neutral-200 p-4">
              <Button variant="outline">Reset ke Default</Button>
              <Button>Simpan Pengaturan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
