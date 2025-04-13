import React, { useState } from 'react';
import { LayoutWithSidebar } from '@/components/layout-with-sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Users,
  UserPlus,
  Download,
  Calendar,
  PieChart,
  BarChart,
  BookOpen,
  BookOpen as Academic,
  GraduationCap,
  DollarSign,
  BarChart2,
  FileBarChart,
  ListFilter,
  Search,
  Printer,
  ExternalLink,
  Mail,
  Share2,
  Eye,
  RefreshCw,
  Filter,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

// Komponen pemilih periode laporan
const ReportPeriodSelector = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Tanggal Mulai</Label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onSelect={setStartDate}
            placeholder="Pilih tanggal mulai"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Tanggal Akhir</Label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onSelect={setEndDate}
            placeholder="Pilih tanggal akhir"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="period">Periode</Label>
          <Select defaultValue="semester_current">
            <SelectTrigger>
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semester_current">Semester Berjalan</SelectItem>
              <SelectItem value="semester_previous">Semester Sebelumnya</SelectItem>
              <SelectItem value="academic_year">Tahun Akademik</SelectItem>
              <SelectItem value="calendar_year">Tahun Kalender</SelectItem>
              <SelectItem value="custom">Kustom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="format">Format</Label>
          <Select defaultValue="pdf">
            <SelectTrigger>
              <SelectValue placeholder="Pilih format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="web">Web</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

// Komponen pemilih opsi laporan
const ReportOptionsSelector = ({ type }: { type: string }) => {
  // Opsi berdasarkan tipe laporan
  const getOptions = () => {
    switch (type) {
      case 'academic':
        return [
          { id: 'student_count', label: 'Jumlah Mahasiswa' },
          { id: 'gender_distribution', label: 'Distribusi Gender' },
          { id: 'year_distribution', label: 'Distribusi Angkatan' },
          { id: 'study_program_distribution', label: 'Distribusi Program Studi' },
          { id: 'gpa_distribution', label: 'Distribusi IPK' },
          { id: 'gpa_average', label: 'Rata-rata IPK' },
          { id: 'course_popularity', label: 'Popularitas Mata Kuliah' },
          { id: 'graduation_rate', label: 'Tingkat Kelulusan' },
        ];
      case 'attendance':
        return [
          { id: 'attendance_rate', label: 'Tingkat Kehadiran' },
          { id: 'absence_rate', label: 'Tingkat Ketidakhadiran' },
          { id: 'course_attendance', label: 'Kehadiran per Mata Kuliah' },
          { id: 'student_attendance', label: 'Kehadiran per Mahasiswa' },
          { id: 'lecturer_attendance', label: 'Kehadiran Dosen' },
          { id: 'attendance_trends', label: 'Tren Kehadiran' },
        ];
      case 'financial':
        return [
          { id: 'revenue_summary', label: 'Ringkasan Pendapatan' },
          { id: 'payment_status', label: 'Status Pembayaran' },
          { id: 'payment_method', label: 'Metode Pembayaran' },
          { id: 'tuition_trends', label: 'Tren Pembayaran Kuliah' },
          { id: 'outstanding_balance', label: 'Saldo Tertunggak' },
          { id: 'scholarship_distribution', label: 'Distribusi Beasiswa' },
        ];
      case 'pddikti':
        return [
          { id: 'sync_status', label: 'Status Sinkronisasi' },
          { id: 'error_summary', label: 'Ringkasan Error' },
          { id: 'data_completeness', label: 'Kelengkapan Data' },
          { id: 'activity_log', label: 'Log Aktivitas' },
          { id: 'validation_results', label: 'Hasil Validasi' },
        ];
      default:
        return [];
    }
  };

  const options = getOptions();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Pilih data yang akan ditampilkan:</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox id={option.id} defaultChecked />
            <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

// Komponen filter entitas untuk laporan
const ReportEntityFilter = ({ type }: { type: string }) => {
  // Entitas berdasarkan tipe laporan
  const getEntities = () => {
    switch (type) {
      case 'academic':
        return [
          { id: 'study_program', label: 'Program Studi', options: ['Semua', 'Teknik Informatika', 'Sistem Informasi', 'Manajemen Informatika'] },
          { id: 'academic_year', label: 'Tahun Akademik', options: ['Semua', '2024/2025', '2023/2024', '2022/2023'] },
          { id: 'semester', label: 'Semester', options: ['Semua', 'Ganjil', 'Genap'] },
        ];
      case 'attendance':
        return [
          { id: 'course', label: 'Mata Kuliah', options: ['Semua', 'Algoritma dan Pemrograman', 'Basis Data', 'Jaringan Komputer'] },
          { id: 'lecturer', label: 'Dosen', options: ['Semua', 'Dr. Budi Santoso, M.Kom.', 'Prof. Siti Rahayu, Ph.D.', 'Eko Prasetyo, M.Eng.'] },
          { id: 'class', label: 'Kelas', options: ['Semua', 'TI-2A', 'TI-2B', 'SI-2A'] },
        ];
      case 'financial':
        return [
          { id: 'payment_type', label: 'Jenis Pembayaran', options: ['Semua', 'SPP', 'Praktikum', 'Ujian', 'Wisuda'] },
          { id: 'batch', label: 'Angkatan', options: ['Semua', '2024', '2023', '2022', '2021'] },
          { id: 'status', label: 'Status', options: ['Semua', 'Lunas', 'Belum Lunas', 'Menunggak'] },
        ];
      case 'pddikti':
        return [
          { id: 'entity_type', label: 'Tipe Entitas', options: ['Semua', 'Mahasiswa', 'Dosen', 'Mata Kuliah', 'Program Studi'] },
          { id: 'sync_status', label: 'Status Sinkronisasi', options: ['Semua', 'Sukses', 'Gagal', 'Pending'] },
          { id: 'validation_status', label: 'Status Validasi', options: ['Semua', 'Valid', 'Invalid', 'Warning'] },
        ];
      default:
        return [];
    }
  };

  const entities = getEntities();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Filter:</h3>
      <div className="space-y-3">
        {entities.map((entity) => (
          <div key={entity.id} className="space-y-2">
            <Label htmlFor={entity.id}>{entity.label}</Label>
            <Select defaultValue={entity.options[0]}>
              <SelectTrigger id={entity.id}>
                <SelectValue placeholder={`Pilih ${entity.label}`} />
              </SelectTrigger>
              <SelectContent>
                {entity.options.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
};

// Report Generator Component
const ReportGenerator = ({ type }: { type: string }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulasi proses pembuatan laporan
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          toast({
            title: "Laporan berhasil dibuat",
            description: "Klik tombol unduh untuk mendapatkan laporan Anda",
          });
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  // Icon berdasarkan tipe laporan
  const getIcon = () => {
    switch (type) {
      case 'academic':
        return <Academic className="h-5 w-5 text-indigo-500" />;
      case 'attendance':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'financial':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'pddikti':
        return <FileBarChart className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Judul berdasarkan tipe laporan
  const getTitle = () => {
    switch (type) {
      case 'academic':
        return 'Laporan Akademik';
      case 'attendance':
        return 'Laporan Kehadiran';
      case 'financial':
        return 'Laporan Keuangan';
      case 'pddikti':
        return 'Laporan PDDikti';
      default:
        return 'Laporan';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          {getTitle()}
        </CardTitle>
        <CardDescription>
          Buat laporan {getTitle().toLowerCase()} berdasarkan periode dan filter yang dipilih
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="period" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="period">Periode</TabsTrigger>
            <TabsTrigger value="options">Opsi</TabsTrigger>
            <TabsTrigger value="filter">Filter</TabsTrigger>
          </TabsList>
          <TabsContent value="period" className="mt-4">
            <ReportPeriodSelector />
          </TabsContent>
          <TabsContent value="options" className="mt-4">
            <ReportOptionsSelector type={type} />
          </TabsContent>
          <TabsContent value="filter" className="mt-4">
            <ReportEntityFilter type={type} />
          </TabsContent>
        </Tabs>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Memproses laporan...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={isGenerating}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <div className="flex gap-2">
          {progress === 100 ? (
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Unduh Laporan
            </Button>
          ) : (
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Buat Laporan
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// Komponen kartu ringkasan laporan
const ReportSummaryCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color,
}: { 
  title: string; 
  value: string; 
  change: number; 
  icon: any; 
  color: string;
}) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between pt-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% dibanding periode sebelumnya
          </p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </CardContent>
    </Card>
  );
};

// Komponen riwayat laporan
const ReportHistoryItem = ({ 
  title, 
  date, 
  type, 
  format, 
  status 
}: { 
  title: string; 
  date: string; 
  type: string; 
  format: string; 
  status: 'completed' | 'failed' | 'processing' 
}) => {
  // Status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case 'failed':
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>;
      case 'processing':
        return <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>;
      default:
        return null;
    }
  };

  // Format icon
  const getFormatIcon = () => {
    switch (format) {
      case 'PDF':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'Excel':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'CSV':
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-4">
        {getFormatIcon()}
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">
            {date} • {type}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {getStatusIcon()}
          <span className="text-sm">
            {status === 'completed' ? 'Selesai' : status === 'failed' ? 'Gagal' : 'Diproses'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {status === 'completed' && (
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('academic');

  // Data ringkasan untuk dashboard
  const summaryData = [
    { 
      title: 'Total Mahasiswa', 
      value: '1,234', 
      change: 5.2, 
      icon: Users, 
      color: 'blue' 
    },
    { 
      title: 'Tingkat Kehadiran', 
      value: '85%', 
      change: -2.1, 
      icon: Calendar, 
      color: 'green'
    },
    { 
      title: 'Rata-rata IPK', 
      value: '3.42', 
      change: 1.8, 
      icon: GraduationCap, 
      color: 'purple'
    },
    { 
      title: 'Pendapatan Bulan Ini', 
      value: 'Rp 450jt', 
      change: 12.5, 
      icon: DollarSign, 
      color: 'amber'
    },
  ];

  // Data riwayat laporan
  const reportHistory = [
    { 
      title: 'Laporan Akademik Semester Ganjil 2023/2024', 
      date: '15 Apr 2024', 
      type: 'Akademik', 
      format: 'PDF', 
      status: 'completed' as const
    },
    { 
      title: 'Laporan Keuangan Q1 2024', 
      date: '10 Apr 2024', 
      type: 'Keuangan', 
      format: 'Excel', 
      status: 'completed' as const
    },
    { 
      title: 'Laporan Kehadiran Bulan Maret 2024', 
      date: '05 Apr 2024', 
      type: 'Kehadiran', 
      format: 'PDF', 
      status: 'completed' as const
    },
    { 
      title: 'Laporan PDDikti Semester Ganjil 2023/2024', 
      date: '01 Apr 2024', 
      type: 'PDDikti', 
      format: 'CSV', 
      status: 'completed' as const
    },
    { 
      title: 'Laporan Akademik Tahun 2023', 
      date: '20 Mar 2024', 
      type: 'Akademik', 
      format: 'PDF', 
      status: 'completed' as const
    },
  ];

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Laporan</h1>
            <p className="text-muted-foreground">
              Buat dan kelola laporan akademik, kehadiran, keuangan, dan PDDikti
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" /> Cetak
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" /> Bagikan
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" /> Laporan Baru
            </Button>
          </div>
        </div>

        {/* Dashboard Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {summaryData.map((summary, i) => (
            <ReportSummaryCard
              key={i}
              title={summary.title}
              value={summary.value}
              change={summary.change}
              icon={summary.icon}
              color={summary.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="academic">
                  <Academic className="h-4 w-4 mr-2" /> Akademik
                </TabsTrigger>
                <TabsTrigger value="attendance">
                  <Calendar className="h-4 w-4 mr-2" /> Kehadiran
                </TabsTrigger>
                <TabsTrigger value="financial">
                  <DollarSign className="h-4 w-4 mr-2" /> Keuangan
                </TabsTrigger>
                <TabsTrigger value="pddikti">
                  <FileBarChart className="h-4 w-4 mr-2" /> PDDikti
                </TabsTrigger>
              </TabsList>

              <TabsContent value="academic">
                <ReportGenerator type="academic" />
              </TabsContent>

              <TabsContent value="attendance">
                <ReportGenerator type="attendance" />
              </TabsContent>

              <TabsContent value="financial">
                <ReportGenerator type="financial" />
              </TabsContent>

              <TabsContent value="pddikti">
                <ReportGenerator type="pddikti" />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Riwayat Laporan
                </CardTitle>
                <CardDescription>
                  Laporan yang baru-baru ini dibuat
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] px-6">
                  <div className="space-y-2">
                    {reportHistory.map((report, i) => (
                      <React.Fragment key={i}>
                        <ReportHistoryItem
                          title={report.title}
                          date={report.date}
                          type={report.type}
                          format={report.format}
                          status={report.status}
                        />
                        {i < reportHistory.length - 1 && <Separator />}
                      </React.Fragment>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="justify-center pt-4">
                <Button variant="ghost" className="w-full">
                  Lihat Semua Laporan <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}