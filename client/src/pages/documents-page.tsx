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
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  MoreHorizontal,
  Plus,
  Download,
  Trash2,
  Pencil,
  FileText,
  FilePlus,
  FileCheck,
  FilePen,
  User,
  Filter,
  Eye,
  Share2,
  Upload,
  History,
  File,
  Clock,
  CheckCircle2,
  UserCheck,
  Printer,
  CalendarDays
} from 'lucide-react';

// Interface untuk data dokumen
interface Document {
  id: number;
  documentNumber: string;
  title: string;
  type: 'academic_transcript' | 'certificate' | 'letter' | 'thesis' | 'report' | 'other';
  category: 'student' | 'lecturer' | 'administrative' | 'research' | 'other';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  requesterId?: number;
  requesterName?: string;
  requesterType: 'student' | 'lecturer' | 'staff' | 'other';
  requesterId_identifier?: string; // NIM/NIDN/NIP
  content?: string;
  notes?: string;
  templateId?: number;
  filePath?: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  expiresAt?: string;
  isPublic: boolean;
  viewCount: number;
  downloadCount: number;
  tags: string[];
}

// Data contoh untuk dokumen
const demoDocuments: Document[] = [
  {
    id: 1,
    documentNumber: 'TR/2024/001',
    title: 'Transkrip Akademik - Ahmad Budi Cahyono',
    type: 'academic_transcript',
    category: 'student',
    status: 'published',
    requesterName: 'Ahmad Budi Cahyono',
    requesterType: 'student',
    requesterId_identifier: '2020103001',
    notes: 'Transkrip untuk keperluan magang',
    filePath: '/documents/transcripts/2020103001_transcript.pdf',
    fileUrl: 'https://example.com/documents/transcripts/2020103001_transcript.pdf',
    fileSize: 245000,
    fileType: 'application/pdf',
    createdAt: '2024-04-10T09:00:00Z',
    updatedAt: '2024-04-10T10:30:00Z',
    approvedAt: '2024-04-10T10:30:00Z',
    approvedBy: 'Dr. Rina Anggraini, M.T.',
    isPublic: false,
    viewCount: 5,
    downloadCount: 2,
    tags: ['transkrip', 'akademik', 'mahasiswa'],
  },
  {
    id: 2,
    documentNumber: 'SK/2024/001',
    title: 'Surat Keterangan Aktif Kuliah - Siti Nurhayati',
    type: 'letter',
    category: 'student',
    status: 'published',
    requesterName: 'Siti Nurhayati',
    requesterType: 'student',
    requesterId_identifier: '2020103002',
    content: 'Dengan ini kami menerangkan bahwa Siti Nurhayati adalah mahasiswa aktif...',
    notes: 'Untuk keperluan beasiswa',
    templateId: 1,
    filePath: '/documents/letters/sk_aktif_2020103002.pdf',
    fileUrl: 'https://example.com/documents/letters/sk_aktif_2020103002.pdf',
    fileSize: 120000,
    fileType: 'application/pdf',
    createdAt: '2024-04-12T13:45:00Z',
    updatedAt: '2024-04-12T14:30:00Z',
    approvedAt: '2024-04-12T14:30:00Z',
    approvedBy: 'Dr. Ahmad Wijaya, M.Sc.',
    expiresAt: '2024-10-12T14:30:00Z',
    isPublic: false,
    viewCount: 3,
    downloadCount: 1,
    tags: ['surat keterangan', 'aktif kuliah', 'mahasiswa'],
  },
  {
    id: 3,
    documentNumber: 'SRT/2024/003',
    title: 'Surat Pengantar Penelitian - Dr. Budi Santoso',
    type: 'letter',
    category: 'lecturer',
    status: 'approved',
    requesterName: 'Dr. Budi Santoso, M.Kom.',
    requesterType: 'lecturer',
    requesterId_identifier: '19870523001',
    content: 'Surat pengantar untuk penelitian di bidang Kecerdasan Buatan...',
    notes: 'Untuk penelitian dosen',
    templateId: 2,
    filePath: '/documents/letters/penelitian_19870523001.pdf',
    fileUrl: 'https://example.com/documents/letters/penelitian_19870523001.pdf',
    fileSize: 135000,
    fileType: 'application/pdf',
    createdAt: '2024-04-15T08:30:00Z',
    updatedAt: '2024-04-15T09:45:00Z',
    approvedAt: '2024-04-15T09:45:00Z',
    approvedBy: 'Prof. Dr. Bambang Suryadi, M.Sc.',
    isPublic: false,
    viewCount: 2,
    downloadCount: 1,
    tags: ['surat pengantar', 'penelitian', 'dosen'],
  },
  {
    id: 4,
    documentNumber: 'REP/2024/001',
    title: 'Laporan Kemajuan Studi - Rudi Hermawan',
    type: 'report',
    category: 'student',
    status: 'pending',
    requesterName: 'Rudi Hermawan',
    requesterType: 'student',
    requesterId_identifier: '2020103003',
    notes: 'Menunggu persetujuan pembimbing',
    filePath: '/documents/reports/progress_2020103003.pdf',
    fileUrl: 'https://example.com/documents/reports/progress_2020103003.pdf',
    fileSize: 1500000,
    fileType: 'application/pdf',
    createdAt: '2024-04-16T10:15:00Z',
    updatedAt: '2024-04-16T10:15:00Z',
    isPublic: false,
    viewCount: 1,
    downloadCount: 0,
    tags: ['laporan', 'kemajuan', 'studi', 'mahasiswa'],
  },
  {
    id: 5,
    documentNumber: 'THS/2024/001',
    title: 'Tesis - Diana Putri',
    type: 'thesis',
    category: 'student',
    status: 'draft',
    requesterName: 'Diana Putri',
    requesterType: 'student',
    requesterId_identifier: '2020103004',
    notes: 'Draft tesis, belum disetujui',
    filePath: '/documents/thesis/thesis_draft_2020103004.pdf',
    fileUrl: 'https://example.com/documents/thesis/thesis_draft_2020103004.pdf',
    fileSize: 3500000,
    fileType: 'application/pdf',
    createdAt: '2024-04-17T14:00:00Z',
    updatedAt: '2024-04-17T14:00:00Z',
    isPublic: false,
    viewCount: 0,
    downloadCount: 0,
    tags: ['tesis', 'draft', 'mahasiswa'],
  },
];

// Komponen badge untuk tipe dokumen
const DocumentTypeBadge = ({ type }: { type: Document['type'] }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'academic_transcript':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'certificate':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'letter':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'thesis':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'report':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'other':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'academic_transcript':
        return 'Transkrip';
      case 'certificate':
        return 'Sertifikat';
      case 'letter':
        return 'Surat';
      case 'thesis':
        return 'Tesis/Skripsi';
      case 'report':
        return 'Laporan';
      case 'other':
        return 'Lainnya';
      default:
        return type;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'academic_transcript':
        return <FileText className="h-3 w-3 mr-1" />;
      case 'certificate':
        return <FileCheck className="h-3 w-3 mr-1" />;
      case 'letter':
        return <File className="h-3 w-3 mr-1" />;
      case 'thesis':
        return <FilePen className="h-3 w-3 mr-1" />;
      case 'report':
        return <FileText className="h-3 w-3 mr-1" />;
      case 'other':
        return <File className="h-3 w-3 mr-1" />;
      default:
        return <File className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <span className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeStyles()}`}>
      {getTypeIcon()}
      {getTypeLabel()}
    </span>
  );
};

// Komponen badge untuk kategori dokumen
const DocumentCategoryBadge = ({ category }: { category: Document['category'] }) => {
  const getCategoryStyles = () => {
    switch (category) {
      case 'student':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lecturer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'administrative':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'research':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'other':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'student':
        return 'Mahasiswa';
      case 'lecturer':
        return 'Dosen';
      case 'administrative':
        return 'Administratif';
      case 'research':
        return 'Penelitian';
      case 'other':
        return 'Lainnya';
      default:
        return category;
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryStyles()}`}>
      {getCategoryLabel()}
    </span>
  );
};

// Komponen badge untuk status dokumen
const DocumentStatusBadge = ({ status }: { status: Document['status'] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'published':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'pending':
        return 'Menunggu';
      case 'approved':
        return 'Disetujui';
      case 'rejected':
        return 'Ditolak';
      case 'published':
        return 'Dipublikasi';
      default:
        return status;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'draft':
        return <Pencil className="h-3 w-3 mr-1" />;
      case 'pending':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'approved':
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case 'rejected':
        return <Trash2 className="h-3 w-3 mr-1" />;
      case 'published':
        return <FileCheck className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusIcon()}
      {getStatusLabel()}
    </span>
  );
};

// Format ukuran file dari bytes ke KB/MB
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Form untuk menambah atau mengedit dokumen
const DocumentForm = ({
  document,
  onSubmit,
  onCancel,
}: {
  document?: Document;
  onSubmit: (data: Partial<Document>) => void;
  onCancel: () => void;
}) => {
  const isEditing = !!document;
  const [formData, setFormData] = useState<Partial<Document>>(
    document || {
      documentNumber: `DOC/${new Date().getFullYear()}/`,
      title: '',
      type: 'letter',
      category: 'student',
      status: 'draft',
      requesterName: '',
      requesterType: 'student',
      requesterId_identifier: '',
      notes: '',
      isPublic: false,
      viewCount: 0,
      downloadCount: 0,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const [tagInput, setTagInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentNumber">Nomor Dokumen</Label>
          <Input
            id="documentNumber"
            name="documentNumber"
            placeholder="Contoh: DOC/2024/001"
            value={formData.documentNumber}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipe Dokumen</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange('type', value as Document['type'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe dokumen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic_transcript">Transkrip Akademik</SelectItem>
              <SelectItem value="certificate">Sertifikat</SelectItem>
              <SelectItem value="letter">Surat</SelectItem>
              <SelectItem value="thesis">Tesis/Skripsi</SelectItem>
              <SelectItem value="report">Laporan</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Judul Dokumen</Label>
        <Input
          id="title"
          name="title"
          placeholder="Judul dokumen"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange('category', value as Document['category'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Mahasiswa</SelectItem>
              <SelectItem value="lecturer">Dosen</SelectItem>
              <SelectItem value="administrative">Administratif</SelectItem>
              <SelectItem value="research">Penelitian</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value as Document['status'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
              <SelectItem value="published">Dipublikasi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="requesterName">Nama Pemohon</Label>
          <Input
            id="requesterName"
            name="requesterName"
            placeholder="Nama pemohon dokumen"
            value={formData.requesterName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="requesterType">Tipe Pemohon</Label>
          <Select
            value={formData.requesterType}
            onValueChange={(value) => handleSelectChange('requesterType', value as Document['requesterType'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe pemohon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Mahasiswa</SelectItem>
              <SelectItem value="lecturer">Dosen</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="requesterId_identifier">Identitas Pemohon (NIM/NIDN/NIP)</Label>
        <Input
          id="requesterId_identifier"
          name="requesterId_identifier"
          placeholder="Masukkan NIM/NIDN/NIP"
          value={formData.requesterId_identifier}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Catatan</Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Catatan tentang dokumen"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Tag</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Tambahkan tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <Button type="button" variant="outline" onClick={handleAddTag}>
            Tambah
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) => handleCheckboxChange('isPublic', e.target.checked)}
          className="rounded border-input h-4 w-4"
        />
        <Label htmlFor="isPublic" className="font-normal">Dapat diakses publik</Label>
      </div>

      <div className="space-y-2">
        <Label>File Dokumen</Label>
        <div className="border border-dashed border-input rounded-md p-6 text-center">
          <Input
            type="file"
            id="documentFile"
            className="hidden"
          />
          <Label htmlFor="documentFile" className="cursor-pointer flex flex-col items-center">
            <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
            <span className="text-sm font-medium">Klik untuk mengunggah file</span>
            <span className="text-xs text-muted-foreground mt-1">
              PDF, DOCX, JPG, PNG (Maks. 10MB)
            </span>
          </Label>
        </div>
        {formData.fileUrl && (
          <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm truncate max-w-[200px]">
                {formData.filePath?.split('/').pop()}
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                {formatFileSize(formData.fileSize)}
              </span>
            </div>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          {isEditing ? 'Simpan Perubahan' : 'Tambah Dokumen'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default function DocumentsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<Document[]>(demoDocuments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState<Document['type'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Document['status'] | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Document['category'] | 'all'>('all');

  // Filter dokumen berdasarkan pencarian, tipe, status, dan kategori
  const filteredDocuments = documents.filter((document) => {
    const matchesSearch =
      document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (document.requesterName && document.requesterName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (document.requesterId_identifier && document.requesterId_identifier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (document.tags && document.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesType = typeFilter === 'all' || document.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || document.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || document.category === categoryFilter;

    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  // Menambahkan dokumen baru
  const handleAddDocument = (documentData: Partial<Document>) => {
    const newDocument: Document = {
      id: documents.length + 1,
      documentNumber: documentData.documentNumber || `DOC/${new Date().getFullYear()}/${documents.length + 1}`,
      title: documentData.title || '',
      type: documentData.type || 'letter',
      category: documentData.category || 'student',
      status: documentData.status || 'draft',
      requesterName: documentData.requesterName,
      requesterType: documentData.requesterType || 'student',
      requesterId_identifier: documentData.requesterId_identifier,
      notes: documentData.notes,
      isPublic: documentData.isPublic || false,
      viewCount: 0,
      downloadCount: 0,
      tags: documentData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments([...documents, newDocument]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Dokumen berhasil ditambahkan',
      description: `Dokumen "${newDocument.title}" telah berhasil disimpan.`,
    });
  };

  // Mengedit dokumen
  const handleEditDocument = (documentData: Partial<Document>) => {
    if (!editingDocument) return;

    const updatedDocuments = documents.map((document) =>
      document.id === editingDocument.id ? { ...document, ...documentData, updatedAt: new Date().toISOString() } : document
    );

    setDocuments(updatedDocuments);
    setEditingDocument(undefined);
    toast({
      title: 'Dokumen diperbarui',
      description: `Dokumen "${documentData.title}" telah berhasil diperbarui.`,
    });
  };

  // Menghapus dokumen
  const handleDeleteDocument = (id: number) => {
    const documentToDelete = documents.find(document => document.id === id);
    const updatedDocuments = documents.filter((document) => document.id !== id);
    setDocuments(updatedDocuments);
    toast({
      title: 'Dokumen dihapus',
      description: `Dokumen "${documentToDelete?.title}" telah berhasil dihapus.`,
      variant: 'destructive',
    });
  };

  // Menyetujui dokumen
  const handleApproveDocument = (id: number) => {
    const updatedDocuments = documents.map((document) =>
      document.id === id
        ? {
            ...document,
            status: 'approved',
            approvedAt: new Date().toISOString(),
            approvedBy: 'Dr. Rina Anggraini, M.T.',
            updatedAt: new Date().toISOString(),
          }
        : document
    );

    setDocuments(updatedDocuments);
    toast({
      title: 'Dokumen disetujui',
      description: `Dokumen telah berhasil disetujui.`,
    });
  };

  // Menolak dokumen
  const handleRejectDocument = (id: number) => {
    const updatedDocuments = documents.map((document) =>
      document.id === id
        ? {
            ...document,
            status: 'rejected',
            updatedAt: new Date().toISOString(),
          }
        : document
    );

    setDocuments(updatedDocuments);
    toast({
      title: 'Dokumen ditolak',
      description: `Dokumen telah ditolak.`,
      variant: 'destructive',
    });
  };

  // Mempublikasikan dokumen
  const handlePublishDocument = (id: number) => {
    const updatedDocuments = documents.map((document) =>
      document.id === id
        ? {
            ...document,
            status: 'published',
            updatedAt: new Date().toISOString(),
          }
        : document
    );

    setDocuments(updatedDocuments);
    toast({
      title: 'Dokumen dipublikasikan',
      description: `Dokumen telah berhasil dipublikasikan.`,
    });
  };

  // Export dokumen (simulasi)
  const handleExportDocuments = () => {
    toast({
      title: 'Data dokumen diekspor',
      description: 'File Excel berhasil diunduh.',
    });
  };

  // Melihat dokumen (simulasi)
  const handleViewDocument = (id: number) => {
    const updatedDocuments = documents.map((document) =>
      document.id === id
        ? {
            ...document,
            viewCount: document.viewCount + 1,
          }
        : document
    );

    setDocuments(updatedDocuments);
    toast({
      title: 'Membuka dokumen',
      description: 'Dokumen dibuka di tab baru.',
    });
    window.open('#', '_blank');
  };

  // Mengunduh dokumen (simulasi)
  const handleDownloadDocument = (id: number) => {
    const updatedDocuments = documents.map((document) =>
      document.id === id
        ? {
            ...document,
            downloadCount: document.downloadCount + 1,
          }
        : document
    );

    setDocuments(updatedDocuments);
    toast({
      title: 'Mengunduh dokumen',
      description: 'Dokumen sedang diunduh.',
    });
  };

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Dokumen</h1>
            <p className="text-muted-foreground">
              Kelola dokumen akademik, surat, dan berkas penting lainnya
            </p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => {
                setTypeFilter('all');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}>
                Semua Dokumen
              </TabsTrigger>
              <TabsTrigger value="letter" onClick={() => {
                setTypeFilter('letter');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}>
                Surat
              </TabsTrigger>
              <TabsTrigger value="academic" onClick={() => {
                setTypeFilter('academic_transcript');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}>
                Transkrip
              </TabsTrigger>
              <TabsTrigger value="report" onClick={() => {
                setTypeFilter('report');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}>
                Laporan
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="flex">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-r-none border-r-0"
                  aria-label="Filter"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari dokumen..."
                    className="w-[250px] pl-8 rounded-l-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" /> Tambah Dokumen
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Tambah Dokumen Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan informasi untuk menambahkan dokumen baru.
                    </DialogDescription>
                  </DialogHeader>
                  <DocumentForm
                    onSubmit={handleAddDocument}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={!!editingDocument} onOpenChange={(open) => !open && setEditingDocument(undefined)}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Dokumen</DialogTitle>
                    <DialogDescription>
                      Perbarui informasi dokumen.
                    </DialogDescription>
                  </DialogHeader>
                  {editingDocument && (
                    <DocumentForm
                      document={editingDocument}
                      onSubmit={handleEditDocument}
                      onCancel={() => setEditingDocument(undefined)}
                    />
                  )}
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Lainnya <MoreHorizontal className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={handleExportDocuments}>
                    <Download className="mr-2 h-4 w-4" /> Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open('/dokumen/templates', '_blank')}>
                    <FilePlus className="mr-2 h-4 w-4" /> Kelola Template
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open('/dokumen/arsip', '_blank')}>
                    <History className="mr-2 h-4 w-4" /> Arsip Dokumen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <select
                className="text-sm border rounded-md border-input px-2 py-1"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Document['status'] | 'all')}
              >
                <option value="all">Semua</option>
                <option value="draft">Draft</option>
                <option value="pending">Menunggu</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
                <option value="published">Dipublikasi</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Kategori:</span>
              <select
                className="text-sm border rounded-md border-input px-2 py-1"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as Document['category'] | 'all')}
              >
                <option value="all">Semua</option>
                <option value="student">Mahasiswa</option>
                <option value="lecturer">Dosen</option>
                <option value="administrative">Administratif</option>
                <option value="research">Penelitian</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
          </div>

          <TabsContent value={selectedTab} className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Nomor</TableHead>
                      <TableHead>Judul Dokumen</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Pemohon</TableHead>
                      <TableHead>Tanggal Pembuatan</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Statistik</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell className="font-medium">{document.documentNumber}</TableCell>
                          <TableCell>
                            <div className="max-w-[300px]">
                              <div className="truncate">{document.title}</div>
                              {document.notes && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {document.notes}
                                </div>
                              )}
                              {document.tags && document.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {document.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {document.tags.length > 2 && (
                                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                                      +{document.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DocumentTypeBadge type={document.type} />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span>{document.requesterName}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {document.requesterId_identifier}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3 text-muted-foreground" />
                                <span>
                                  {new Date(document.createdAt).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                              {document.approvedAt && (
                                <div className="text-xs text-muted-foreground">
                                  Disetujui: {new Date(document.approvedAt).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <DocumentStatusBadge status={document.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {document.viewCount}
                              </div>
                              <div className="flex items-center">
                                <Download className="h-3 w-3 mr-1" />
                                {document.downloadCount}
                              </div>
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
                                <DropdownMenuItem onClick={() => handleViewDocument(document.id)}>
                                  <Eye className="mr-2 h-4 w-4" /> Lihat
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownloadDocument(document.id)}>
                                  <Download className="mr-2 h-4 w-4" /> Unduh
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditingDocument(document)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                {document.status === 'pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleApproveDocument(document.id)}>
                                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Setujui
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRejectDocument(document.id)}>
                                      <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Tolak
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {document.status === 'approved' && (
                                  <DropdownMenuItem onClick={() => handlePublishDocument(document.id)}>
                                    <FileCheck className="mr-2 h-4 w-4 text-blue-600" /> Publikasikan
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => window.open(`/dokumen/${document.id}/verifikasi`, '_blank')}>
                                  <UserCheck className="mr-2 h-4 w-4" /> Verifikasi
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(`/dokumen/${document.id}/cetak`, '_blank')}>
                                  <Printer className="mr-2 h-4 w-4" /> Cetak
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteDocument(document.id)} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          Tidak ada dokumen yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredDocuments.length} dari {documents.length} dokumen
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
        </Tabs>
      </div>
    </LayoutWithSidebar>
  );
}