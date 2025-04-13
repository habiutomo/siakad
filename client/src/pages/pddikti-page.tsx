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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Search as SearchIcon,
  MoreHorizontal,
  Download as DownloadIcon,
  Upload as UploadIcon,
  RefreshCw as RefreshCwIcon,
  Check as CheckIcon,
  X as XIcon,
  Clock as ClockIcon,
  ArrowUpDown as ArrowUpDownIcon,
  Database as DatabaseIcon,
  FileText as FileTextIcon,
  Users as UsersIcon,
  User as UserIcon,
  BookOpen as BookOpenIcon,
  Briefcase as BriefcaseIcon,
  Calendar as CalendarIcon,
  List as ListIcon,
  Settings as SettingsIcon,
  AlertCircle as AlertCircleIcon,
  HelpCircle as HelpCircleIcon,
  Info as InfoIcon,
  Filter as FilterIcon,
  Globe as GlobeIcon,
  Server as ServerIcon,
  RefreshCcw as SyncIcon,
} from 'lucide-react';

// Interface untuk data sinkronisasi
interface SyncData {
  id: number;
  entityType: 'students' | 'lecturers' | 'courses' | 'study_programs' | 'activities' | 'publications' | 'achievements';
  operation: 'push' | 'pull' | 'validate';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  totalRecords: number;
  processedRecords: number;
  successRecords: number;
  failedRecords: number;
  errorMessage?: string;
  user: string;
  details?: string;
}

// Interface untuk log sinkronisasi
interface SyncLog {
  id: number;
  syncId: number;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
}

// Interface untuk error sinkronisasi
interface SyncError {
  id: number;
  syncId: number;
  entityId: string;
  entityType: string;
  errorCode: string;
  errorMessage: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

// Data contoh untuk sinkronisasi
const demoSyncData: SyncData[] = [
  {
    id: 1,
    entityType: 'students',
    operation: 'push',
    status: 'completed',
    startTime: '2024-04-01T10:00:00Z',
    endTime: '2024-04-01T10:05:00Z',
    totalRecords: 150,
    processedRecords: 150,
    successRecords: 148,
    failedRecords: 2,
    user: 'admin',
    details: 'Sinkronisasi data mahasiswa ke PDDikti',
  },
  {
    id: 2,
    entityType: 'lecturers',
    operation: 'push',
    status: 'completed',
    startTime: '2024-04-01T10:10:00Z',
    endTime: '2024-04-01T10:12:00Z',
    totalRecords: 25,
    processedRecords: 25,
    successRecords: 25,
    failedRecords: 0,
    user: 'admin',
    details: 'Sinkronisasi data dosen ke PDDikti',
  },
  {
    id: 3,
    entityType: 'courses',
    operation: 'push',
    status: 'completed',
    startTime: '2024-04-01T10:15:00Z',
    endTime: '2024-04-01T10:18:00Z',
    totalRecords: 45,
    processedRecords: 45,
    successRecords: 42,
    failedRecords: 3,
    user: 'admin',
    details: 'Sinkronisasi data mata kuliah ke PDDikti',
  },
  {
    id: 4,
    entityType: 'study_programs',
    operation: 'pull',
    status: 'completed',
    startTime: '2024-04-01T10:20:00Z',
    endTime: '2024-04-01T10:22:00Z',
    totalRecords: 10,
    processedRecords: 10,
    successRecords: 10,
    failedRecords: 0,
    user: 'admin',
    details: 'Mengambil data program studi dari PDDikti',
  },
  {
    id: 5,
    entityType: 'students',
    operation: 'validate',
    status: 'in_progress',
    startTime: '2024-04-15T09:00:00Z',
    totalRecords: 155,
    processedRecords: 78,
    successRecords: 75,
    failedRecords: 3,
    user: 'admin',
    details: 'Validasi data mahasiswa dengan PDDikti',
  },
];

// Data contoh untuk log sinkronisasi
const demoSyncLogs: SyncLog[] = [
  {
    id: 1,
    syncId: 1,
    timestamp: '2024-04-01T10:00:00Z',
    level: 'info',
    message: 'Memulai sinkronisasi data mahasiswa',
    details: 'Sinkronisasi batch 150 data mahasiswa',
  },
  {
    id: 2,
    syncId: 1,
    timestamp: '2024-04-01T10:02:00Z',
    level: 'info',
    message: 'Memproses data mahasiswa',
    details: 'Memproses 75/150 data',
  },
  {
    id: 3,
    syncId: 1,
    timestamp: '2024-04-01T10:03:00Z',
    level: 'warning',
    message: 'Data mahasiswa tidak lengkap',
    details: 'Mahasiswa dengan NIM 2020103099 tidak memiliki data alamat',
  },
  {
    id: 4,
    syncId: 1,
    timestamp: '2024-04-01T10:04:00Z',
    level: 'error',
    message: 'Gagal sinkronisasi data mahasiswa',
    details: 'Mahasiswa dengan NIM 2020103100 memiliki format data yang tidak valid',
  },
  {
    id: 5,
    syncId: 1,
    timestamp: '2024-04-01T10:05:00Z',
    level: 'success',
    message: 'Sinkronisasi selesai',
    details: '148 sukses, 2 gagal',
  },
];

// Data contoh untuk error sinkronisasi
const demoSyncErrors: SyncError[] = [
  {
    id: 1,
    syncId: 1,
    entityId: '2020103099',
    entityType: 'students',
    errorCode: 'MISSING_DATA',
    errorMessage: 'Data alamat mahasiswa tidak lengkap',
    timestamp: '2024-04-01T10:03:00Z',
    resolved: true,
    resolvedAt: '2024-04-02T09:00:00Z',
    resolvedBy: 'admin',
    resolution: 'Data alamat telah dilengkapi',
  },
  {
    id: 2,
    syncId: 1,
    entityId: '2020103100',
    entityType: 'students',
    errorCode: 'INVALID_FORMAT',
    errorMessage: 'Format data tempat lahir tidak valid',
    timestamp: '2024-04-01T10:04:00Z',
    resolved: false,
  },
  {
    id: 3,
    syncId: 3,
    entityId: 'TI2044',
    entityType: 'courses',
    errorCode: 'DUPLICATE_ENTRY',
    errorMessage: 'Mata kuliah dengan kode yang sama sudah ada di PDDikti',
    timestamp: '2024-04-01T10:16:00Z',
    resolved: true,
    resolvedAt: '2024-04-02T11:00:00Z',
    resolvedBy: 'admin',
    resolution: 'Kode mata kuliah diperbarui',
  },
  {
    id: 4,
    syncId: 3,
    entityId: 'SI2041',
    entityType: 'courses',
    errorCode: 'MISSING_DATA',
    errorMessage: 'Data SKS mata kuliah tidak lengkap',
    timestamp: '2024-04-01T10:17:00Z',
    resolved: false,
  },
  {
    id: 5,
    syncId: 3,
    entityId: 'TI4051',
    entityType: 'courses',
    errorCode: 'INVALID_REFERENCE',
    errorMessage: 'Referensi program studi tidak valid',
    timestamp: '2024-04-01T10:17:30Z',
    resolved: false,
  },
];

// Komponen badge untuk status sinkronisasi
const SyncStatusBadge = ({ status }: { status: SyncData['status'] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'in_progress':
        return 'Berjalan';
      case 'completed':
        return 'Selesai';
      case 'failed':
        return 'Gagal';
      default:
        return status;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-3 w-3 mr-1" />;
      case 'in_progress':
        return <RefreshCwIcon className="h-3 w-3 mr-1" />;
      case 'completed':
        return <CheckIcon className="h-3 w-3 mr-1" />;
      case 'failed':
        return <XIcon className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusIcon()}
      {getStatusLabel()}
    </span>
  );
};

// Komponen badge untuk tipe operasi
const OperationBadge = ({ operation }: { operation: SyncData['operation'] }) => {
  const getOperationStyles = () => {
    switch (operation) {
      case 'push':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pull':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'validate':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOperationLabel = () => {
    switch (operation) {
      case 'push':
        return 'Kirim';
      case 'pull':
        return 'Ambil';
      case 'validate':
        return 'Validasi';
      default:
        return operation;
    }
  };

  const getOperationIcon = () => {
    switch (operation) {
      case 'push':
        return <UploadIcon className="h-3 w-3 mr-1" />;
      case 'pull':
        return <DownloadIcon className="h-3 w-3 mr-1" />;
      case 'validate':
        return <CheckIcon className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOperationStyles()}`}>
      {getOperationIcon()}
      {getOperationLabel()}
    </span>
  );
};

// Komponen badge untuk tipe entitas
const EntityTypeBadge = ({ entityType }: { entityType: SyncData['entityType'] }) => {
  const getEntityStyles = () => {
    switch (entityType) {
      case 'students':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lecturers':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'courses':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'study_programs':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'activities':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'publications':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'achievements':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEntityLabel = () => {
    switch (entityType) {
      case 'students':
        return 'Mahasiswa';
      case 'lecturers':
        return 'Dosen';
      case 'courses':
        return 'Mata Kuliah';
      case 'study_programs':
        return 'Program Studi';
      case 'activities':
        return 'Aktivitas';
      case 'publications':
        return 'Publikasi';
      case 'achievements':
        return 'Prestasi';
      default:
        return entityType;
    }
  };

  const getEntityIcon = () => {
    switch (entityType) {
      case 'students':
        return <UsersIcon className="h-3 w-3 mr-1" />;
      case 'lecturers':
        return <UserIcon className="h-3 w-3 mr-1" />;
      case 'courses':
        return <BookOpenIcon className="h-3 w-3 mr-1" />;
      case 'study_programs':
        return <BriefcaseIcon className="h-3 w-3 mr-1" />;
      case 'activities':
        return <CalendarIcon className="h-3 w-3 mr-1" />;
      case 'publications':
        return <FileTextIcon className="h-3 w-3 mr-1" />;
      case 'achievements':
        return <CheckIcon className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEntityStyles()}`}>
      {getEntityIcon()}
      {getEntityLabel()}
    </span>
  );
};

// Komponen badge untuk level log
const LogLevelBadge = ({ level }: { level: SyncLog['level'] }) => {
  const getLevelStyles = () => {
    switch (level) {
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelIcon = () => {
    switch (level) {
      case 'info':
        return <InfoIcon className="h-3 w-3 mr-1" />;
      case 'warning':
        return <AlertCircleIcon className="h-3 w-3 mr-1" />;
      case 'error':
        return <XIcon className="h-3 w-3 mr-1" />;
      case 'success':
        return <CheckIcon className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getLevelStyles()}`}>
      {getLevelIcon()}
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

// Form untuk melakukan sinkronisasi
const SyncForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    entityType: 'students',
    operation: 'push',
    includeAll: false,
    filterStartDate: '',
    filterEndDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="entityType">Tipe Entitas</Label>
        <Select
          value={formData.entityType}
          onValueChange={(value) => handleSelectChange('entityType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe entitas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="students">Mahasiswa</SelectItem>
            <SelectItem value="lecturers">Dosen</SelectItem>
            <SelectItem value="courses">Mata Kuliah</SelectItem>
            <SelectItem value="study_programs">Program Studi</SelectItem>
            <SelectItem value="activities">Aktivitas</SelectItem>
            <SelectItem value="publications">Publikasi</SelectItem>
            <SelectItem value="achievements">Prestasi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="operation">Operasi</Label>
        <Select
          value={formData.operation}
          onValueChange={(value) => handleSelectChange('operation', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih operasi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="push">Kirim ke PDDikti</SelectItem>
            <SelectItem value="pull">Ambil dari PDDikti</SelectItem>
            <SelectItem value="validate">Validasi dengan PDDikti</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          id="includeAll"
          name="includeAll"
          checked={formData.includeAll}
          onChange={handleChange}
          className="rounded border-input h-4 w-4"
        />
        <Label htmlFor="includeAll" className="font-normal">
          Sinkronisasi semua data
        </Label>
      </div>

      {!formData.includeAll && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filterStartDate">Tanggal Mulai</Label>
            <Input
              id="filterStartDate"
              name="filterStartDate"
              type="date"
              value={formData.filterStartDate}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterEndDate">Tanggal Akhir</Label>
            <Input
              id="filterEndDate"
              name="filterEndDate"
              type="date"
              value={formData.filterEndDate}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      <div className="pt-4">
        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
          <div className="flex items-center">
            <InfoIcon className="h-4 w-4 mr-2" />
            <div>
              <p className="font-medium">Petunjuk Sinkronisasi</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>
                  Pastikan data sudah terverifikasi sebelum melakukan sinkronisasi
                </li>
                <li>
                  Operasi "Validasi" hanya akan mengecek kecocokan data tanpa melakukan perubahan
                </li>
                <li>
                  Sinkronisasi sebaiknya dilakukan di luar jam sibuk untuk kinerja optimal
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={() => onSubmit(formData)} className="gap-1">
          <SyncIcon className="h-4 w-4" /> Mulai Sinkronisasi
        </Button>
      </DialogFooter>
    </div>
  );
};

// Form untuk menyelesaikan error
const ResolveErrorForm = ({
  error,
  onSubmit,
  onCancel,
}: {
  error: SyncError;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const [resolution, setResolution] = useState('');

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <div className="rounded-md bg-red-50 p-3 mb-4 text-sm text-red-800">
          <div className="flex">
            <AlertCircleIcon className="h-4 w-4 mr-2" />
            <div>
              <p className="font-medium">Error: {error.errorCode}</p>
              <p>{error.errorMessage}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <Label className="text-xs text-muted-foreground">Entitas</Label>
            <div>{error.entityType} ({error.entityId})</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Waktu Error</Label>
            <div>{new Date(error.timestamp).toLocaleString()}</div>
          </div>
        </div>

        <Label htmlFor="resolution">Resolusi</Label>
        <textarea
          id="resolution"
          rows={4}
          className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan tindakan yang dilakukan untuk menyelesaikan error"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
        />
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button 
          onClick={() => onSubmit({ errorId: error.id, resolution })} 
          disabled={!resolution.trim()}
        >
          Tandai Sebagai Terselesaikan
        </Button>
      </DialogFooter>
    </div>
  );
};

export default function PDDiktiPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('history');
  const [syncData, setSyncData] = useState<SyncData[]>(demoSyncData);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(demoSyncLogs);
  const [syncErrors, setSyncErrors] = useState<SyncError[]>(demoSyncErrors);
  const [isStartSyncDialogOpen, setIsStartSyncDialogOpen] = useState(false);
  const [selectedSyncId, setSelectedSyncId] = useState<number | null>(null);
  const [resolvingError, setResolvingError] = useState<SyncError | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter sync data berdasarkan pencarian dan filter
  const filteredSyncData = syncData.filter((sync) => {
    const matchesSearch =
      sync.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sync.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sync.entityType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEntityType = entityTypeFilter === 'all' || sync.entityType === entityTypeFilter;
    const matchesStatus = statusFilter === 'all' || sync.status === statusFilter;

    return matchesSearch && matchesEntityType && matchesStatus;
  });

  // Filter sync errors berdasarkan resolusi
  const [resolvedFilter, setResolvedFilter] = useState<string>('all');
  const filteredSyncErrors = syncErrors.filter((error) => {
    const matchesResolved =
      resolvedFilter === 'all' ||
      (resolvedFilter === 'resolved' && error.resolved) ||
      (resolvedFilter === 'unresolved' && !error.resolved);

    return matchesResolved;
  });

  // Filter sync logs berdasarkan sync ID
  const filteredSyncLogs = selectedSyncId
    ? syncLogs.filter((log) => log.syncId === selectedSyncId)
    : syncLogs;

  // Mulai sinkronisasi
  const handleStartSync = (formData: any) => {
    const newSyncId = syncData.length + 1;
    const newSync: SyncData = {
      id: newSyncId,
      entityType: formData.entityType,
      operation: formData.operation,
      status: 'in_progress',
      startTime: new Date().toISOString(),
      totalRecords: 
        formData.entityType === 'students' 
          ? 155 
          : formData.entityType === 'lecturers' 
            ? 25 
            : formData.entityType === 'courses' 
              ? 45 
              : 10,
      processedRecords: 0,
      successRecords: 0,
      failedRecords: 0,
      user: 'admin',
      details: `Sinkronisasi data ${formData.entityType} ${formData.operation === 'push' ? 'ke' : formData.operation === 'pull' ? 'dari' : 'dengan'} PDDikti`,
    };

    setSyncData([newSync, ...syncData]);
    setIsStartSyncDialogOpen(false);
    toast({
      title: 'Sinkronisasi dimulai',
      description: `Sinkronisasi ${newSync.entityType} sedang berjalan.`,
    });

    // Simulasi progress sinkronisasi
    const interval = setInterval(() => {
      setSyncData((prev) => {
        const updated = prev.map((sync) => {
          if (sync.id === newSyncId) {
            const newProcessed = Math.min(sync.processedRecords + 10, sync.totalRecords);
            const isComplete = newProcessed === sync.totalRecords;
            return {
              ...sync,
              processedRecords: newProcessed,
              successRecords: newProcessed - 1,
              failedRecords: isComplete ? 1 : 0,
              status: isComplete ? 'completed' : 'in_progress',
              endTime: isComplete ? new Date().toISOString() : undefined,
            };
          }
          return sync;
        });
        return updated;
      });

      // Tambahkan log
      setSyncLogs((prev) => {
        const syncItem = syncData.find((s) => s.id === newSyncId);
        if (syncItem && syncItem.processedRecords < syncItem.totalRecords) {
          return [
            {
              id: prev.length + 1,
              syncId: newSyncId,
              timestamp: new Date().toISOString(),
              level: 'info',
              message: `Memproses data ${syncItem.entityType}`,
              details: `Memproses ${syncItem.processedRecords}/${syncItem.totalRecords} data`,
            },
            ...prev,
          ];
        }
        return prev;
      });

      // Cek apakah sudah selesai
      const currentSync = syncData.find((s) => s.id === newSyncId);
      if (currentSync && currentSync.processedRecords >= currentSync.totalRecords - 10) {
        clearInterval(interval);
        
        // Tambahkan log selesai
        setSyncLogs((prev) => [
          {
            id: prev.length + 1,
            syncId: newSyncId,
            timestamp: new Date().toISOString(),
            level: 'success',
            message: 'Sinkronisasi selesai',
            details: `${currentSync.successRecords} sukses, 1 gagal`,
          },
          ...prev,
        ]);

        // Tambahkan error
        setSyncErrors((prev) => [
          {
            id: prev.length + 1,
            syncId: newSyncId,
            entityId: formData.entityType === 'students' ? '2020103150' : formData.entityType === 'lecturers' ? 'DSN123' : 'MK123',
            entityType: formData.entityType,
            errorCode: 'VALIDATION_ERROR',
            errorMessage: `Data ${formData.entityType} tidak valid: field wajib kosong`,
            timestamp: new Date().toISOString(),
            resolved: false,
          },
          ...prev,
        ]);

        toast({
          title: 'Sinkronisasi selesai',
          description: `Sinkronisasi data ${currentSync.entityType} telah selesai dengan 1 error.`,
        });
      }
    }, 500);
  };

  // Menyelesaikan error
  const handleResolveError = (data: { errorId: number; resolution: string }) => {
    const updatedErrors = syncErrors.map((error) =>
      error.id === data.errorId
        ? {
            ...error,
            resolved: true,
            resolvedAt: new Date().toISOString(),
            resolvedBy: 'admin',
            resolution: data.resolution,
          }
        : error
    );

    setSyncErrors(updatedErrors);
    setResolvingError(null);
    toast({
      title: 'Error terselesaikan',
      description: 'Error telah ditandai sebagai terselesaikan.',
    });
  };

  // Sinkronisasi ulang
  const handleRetrySync = (syncId: number) => {
    const syncToRetry = syncData.find((sync) => sync.id === syncId);
    if (!syncToRetry) return;

    const newSyncId = syncData.length + 1;
    const newSync: SyncData = {
      ...syncToRetry,
      id: newSyncId,
      status: 'in_progress',
      startTime: new Date().toISOString(),
      endTime: undefined,
      processedRecords: 0,
      successRecords: 0,
      failedRecords: 0,
      details: `Sinkronisasi ulang: ${syncToRetry.details}`,
    };

    setSyncData([newSync, ...syncData]);
    toast({
      title: 'Sinkronisasi ulang dimulai',
      description: `Sinkronisasi ulang ${newSync.entityType} sedang berjalan.`,
    });

    // Simulasi progress
    setTimeout(() => {
      setSyncData((prev) =>
        prev.map((sync) =>
          sync.id === newSyncId
            ? {
                ...sync,
                status: 'completed',
                processedRecords: sync.totalRecords,
                successRecords: sync.totalRecords,
                failedRecords: 0,
                endTime: new Date().toISOString(),
              }
            : sync
        )
      );

      setSyncLogs((prev) => [
        {
          id: prev.length + 1,
          syncId: newSyncId,
          timestamp: new Date().toISOString(),
          level: 'success',
          message: 'Sinkronisasi ulang selesai',
          details: `${syncToRetry.totalRecords} sukses, 0 gagal`,
        },
        ...prev,
      ]);

      toast({
        title: 'Sinkronisasi ulang selesai',
        description: `Sinkronisasi ulang data ${syncToRetry.entityType} telah berhasil diselesaikan.`,
      });
    }, 2000);
  };

  // Lihat detail sinkronisasi
  const handleViewSyncDetail = (syncId: number) => {
    setSelectedSyncId(syncId);
    setActiveTab('logs');
  };

  // Ekspor log (simulasi)
  const handleExportLogs = () => {
    toast({
      title: 'Log diekspor',
      description: 'File CSV berhasil diunduh.',
    });
  };

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Integrasi PDDikti</h1>
            <p className="text-muted-foreground">
              Sinkronisasi data dengan Neo Feeder PDDikti
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Status Koneksi</CardTitle>
              <CardDescription>Koneksi dengan server PDDikti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <ServerIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    Status Koneksi
                  </span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckIcon className="h-3 w-3 mr-1" /> Terhubung
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <GlobeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    Endpoint
                  </span>
                  <span className="text-sm">api.pddikti.kemdikbud.go.id</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    Last Sync
                  </span>
                  <span className="text-sm">
                    {new Date(syncData[0]?.startTime).toLocaleString() || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <DatabaseIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    Sinkronisasi Aktif
                  </span>
                  <Badge variant="outline" className={syncData.some(s => s.status === 'in_progress') ? "bg-blue-50 text-blue-700" : "bg-gray-50"}>
                    {syncData.filter(s => s.status === 'in_progress').length} sinkronisasi
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => setIsStartSyncDialogOpen(true)} 
                className="w-full gap-1"
              >
                <SyncIcon className="h-4 w-4" /> Mulai Sinkronisasi
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Status Data</CardTitle>
              <CardDescription>Status sinkronisasi data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Mahasiswa
                    </span>
                    <span className="text-green-600 font-medium">98% sinkron</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-2 text-green-600" />
                      Dosen
                    </span>
                    <span className="text-green-600 font-medium">100% sinkron</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <BookOpenIcon className="h-4 w-4 mr-2 text-purple-600" />
                      Mata Kuliah
                    </span>
                    <span className="text-orange-600 font-medium">93% sinkron</span>
                  </div>
                  <Progress value={93} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <BriefcaseIcon className="h-4 w-4 mr-2 text-yellow-600" />
                      Program Studi
                    </span>
                    <span className="text-green-600 font-medium">100% sinkron</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab('errors')}>
                <AlertCircleIcon className="h-4 w-4 mr-2" />
                {syncErrors.filter(e => !e.resolved).length} Error Belum Terselesaikan
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Konfigurasi PDDikti</CardTitle>
              <CardDescription>Pengaturan integrasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-md bg-gray-50 p-3">
                  <h3 className="text-sm font-medium flex items-center">
                    <SettingsIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    Pengaturan API
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">API Key</div>
                    <div>•••••••••••••••</div>
                    <div className="text-muted-foreground">Institusi</div>
                    <div>042001</div>
                    <div className="text-muted-foreground">User</div>
                    <div>admin@kampus.ac.id</div>
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Sinkronisasi Otomatis</span>
                    <Badge>Aktif</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Jadwal</span>
                    <span>Setiap hari, 01:00 WIB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mode Validasi</span>
                    <span>Ketat</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.open('/settings/pddikti', '_blank')}>
                <SettingsIcon className="h-4 w-4 mr-2" /> Konfigurasi
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="history">Riwayat Sinkronisasi</TabsTrigger>
            <TabsTrigger value="logs">Log</TabsTrigger>
            <TabsTrigger value="errors">Error</TabsTrigger>
          </TabsList>

          {/* Tab Riwayat Sinkronisasi */}
          <TabsContent value="history" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Entitas:</span>
                  <select
                    className="text-sm border rounded-md border-input px-2 py-1"
                    value={entityTypeFilter}
                    onChange={(e) => setEntityTypeFilter(e.target.value)}
                  >
                    <option value="all">Semua</option>
                    <option value="students">Mahasiswa</option>
                    <option value="lecturers">Dosen</option>
                    <option value="courses">Mata Kuliah</option>
                    <option value="study_programs">Program Studi</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <select
                    className="text-sm border rounded-md border-input px-2 py-1"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Semua</option>
                    <option value="pending">Menunggu</option>
                    <option value="in_progress">Berjalan</option>
                    <option value="completed">Selesai</option>
                    <option value="failed">Gagal</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari..."
                    className="w-[200px] pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Dialog open={isStartSyncDialogOpen} onOpenChange={setIsStartSyncDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-1">
                      <SyncIcon className="h-4 w-4" /> Mulai Sinkronisasi
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Mulai Sinkronisasi PDDikti</DialogTitle>
                      <DialogDescription>
                        Pilih entitas dan operasi sinkronisasi yang ingin dilakukan.
                      </DialogDescription>
                    </DialogHeader>
                    <SyncForm
                      onSubmit={handleStartSync}
                      onCancel={() => setIsStartSyncDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Lainnya <MoreHorizontal className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem onClick={handleExportLogs}>
                      <DownloadIcon className="mr-2 h-4 w-4" /> Export Riwayat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open('/pddikti/laporan', '_blank')}>
                      <FileTextIcon className="mr-2 h-4 w-4" /> Laporan Sinkronisasi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open('/pddikti/validator', '_blank')}>
                      <CheckIcon className="mr-2 h-4 w-4" /> Validasi Data
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Waktu</TableHead>
                      <TableHead>Tipe Entitas</TableHead>
                      <TableHead>Operasi</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Progress</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSyncData.length > 0 ? (
                      filteredSyncData.map((sync) => (
                        <TableRow key={sync.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {new Date(sync.startTime).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(sync.startTime).toLocaleTimeString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <EntityTypeBadge entityType={sync.entityType} />
                          </TableCell>
                          <TableCell>
                            <OperationBadge operation={sync.operation} />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{sync.details}</div>
                              <div className="text-xs text-muted-foreground">
                                Oleh: {sync.user}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <SyncStatusBadge status={sync.status} />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>
                                  {sync.processedRecords}/{sync.totalRecords} records
                                </span>
                                <span>
                                  {Math.round((sync.processedRecords / sync.totalRecords) * 100)}%
                                </span>
                              </div>
                              <Progress
                                value={(sync.processedRecords / sync.totalRecords) * 100}
                                className="h-2"
                              />
                              {sync.status === 'completed' && (
                                <div className="flex justify-between text-xs">
                                  <span className="text-green-600">
                                    {sync.successRecords} sukses
                                  </span>
                                  {sync.failedRecords > 0 && (
                                    <span className="text-red-600">
                                      {sync.failedRecords} gagal
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewSyncDetail(sync.id)}>
                                  <ListIcon className="mr-2 h-4 w-4" /> Lihat Log
                                </DropdownMenuItem>
                                {(sync.status === 'completed' || sync.status === 'failed') && (
                                  <DropdownMenuItem onClick={() => handleRetrySync(sync.id)}>
                                    <RefreshCwIcon className="mr-2 h-4 w-4" /> Sinkronisasi Ulang
                                  </DropdownMenuItem>
                                )}
                                {sync.failedRecords > 0 && sync.status === 'completed' && (
                                  <DropdownMenuItem onClick={() => {
                                    setActiveTab('errors');
                                  }}>
                                    <AlertCircleIcon className="mr-2 h-4 w-4 text-red-600" /> Lihat Error
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => window.open(`/pddikti/sync/${sync.id}/detail`, '_blank')}
                                >
                                  <FileTextIcon className="mr-2 h-4 w-4" /> Export Laporan
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          Tidak ada data sinkronisasi yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredSyncData.length} dari {syncData.length} sinkronisasi
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Sebelumnya
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Selanjutnya
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Tab Log */}
          <TabsContent value="logs" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                {selectedSyncId && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setSelectedSyncId(null)}>
                      <ArrowUpDownIcon className="h-4 w-4 mr-2" /> Semua Log
                    </Button>
                    <span className="ml-2 text-sm text-muted-foreground">
                      Menampilkan log untuk sinkronisasi #{selectedSyncId}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={handleExportLogs}>
                  <DownloadIcon className="h-4 w-4" /> Export Log
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-3">
                <div className="space-y-2">
                  {filteredSyncLogs.length > 0 ? (
                    filteredSyncLogs.map((log) => (
                      <div key={log.id} className="border-b pb-2 last:border-0">
                        <div className="flex items-start gap-2">
                          <LogLevelBadge level={log.level} />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">{log.message}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </div>
                            </div>
                            {log.details && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {log.details}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      Tidak ada log yang ditemukan.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Error */}
          <TabsContent value="errors" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <select
                    className="text-sm border rounded-md border-input px-2 py-1"
                    value={resolvedFilter}
                    onChange={(e) => setResolvedFilter(e.target.value)}
                  >
                    <option value="all">Semua</option>
                    <option value="unresolved">Belum Terselesaikan</option>
                    <option value="resolved">Terselesaikan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-red-600"
                  onClick={() => window.open('/pddikti/validator', '_blank')}
                >
                  <AlertCircleIcon className="h-4 w-4" /> Validasi Data
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Waktu</TableHead>
                      <TableHead>Entitas</TableHead>
                      <TableHead>Kode Error</TableHead>
                      <TableHead>Pesan Error</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSyncErrors.length > 0 ? (
                      filteredSyncErrors.map((error) => (
                        <TableRow key={error.id}>
                          <TableCell>
                            {new Date(error.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <EntityTypeBadge entityType={error.entityType as SyncData['entityType']} />
                              <div className="text-xs mt-1">{error.entityId}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {error.errorCode}
                          </TableCell>
                          <TableCell>{error.errorMessage}</TableCell>
                          <TableCell className="text-center">
                            {error.resolved ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                <CheckIcon className="h-3 w-3 mr-1" /> Terselesaikan
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700">
                                <XIcon className="h-3 w-3 mr-1" /> Belum Terselesaikan
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog open={resolvingError?.id === error.id} onOpenChange={(open) => !open && setResolvingError(null)}>
                              {!error.resolved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setResolvingError(error)}
                                >
                                  Selesaikan
                                </Button>
                              )}
                              <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                  <DialogTitle>Selesaikan Error</DialogTitle>
                                  <DialogDescription>
                                    Masukkan tindakan yang dilakukan untuk menyelesaikan error.
                                  </DialogDescription>
                                </DialogHeader>
                                {resolvingError && (
                                  <ResolveErrorForm
                                    error={resolvingError}
                                    onSubmit={handleResolveError}
                                    onCancel={() => setResolvingError(null)}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Tidak ada error yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutWithSidebar>
  );
}