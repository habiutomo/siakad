import React, { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  FolderOpen,
  Upload,
  Download,
  Calendar,
  Plus,
  ExternalLink
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Document form schema
const documentFormSchema = z.object({
  studentId: z.number(),
  documentType: z.string(),
  documentNumber: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  status: z.string(),
  description: z.string().optional(),
  documentUrl: z.string().optional(),
});

// Mock types for document data
interface Document {
  id: number;
  studentId: number;
  documentType: string;
  documentNumber: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  status: string;
  description: string | null;
  documentUrl: string | null;
  student: {
    id: number;
    studentId: string;
    name: string;
  };
}

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isAddDocumentDialogOpen, setIsAddDocumentDialogOpen] = useState(false);
  
  // Fetch students for document filtering
  const { data: students } = useQuery({
    queryKey: ['/api/students'],
    queryFn: async () => {
      const response = await fetch('/api/students?limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      return response.json();
    },
  });

  // Fetch documents with filters
  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['/api/documents', activeTab, selectedStudentId, page, search],
    queryFn: async () => {
      // In a real app, fetch from API with proper params
      // For now, return mock data
      const mockDocuments = [
        {
          id: 1,
          studentId: 1,
          documentType: 'transcript',
          documentNumber: 'TRN-2023-001',
          issueDate: '2023-06-15T00:00:00Z',
          expiryDate: null,
          status: 'active',
          description: 'Transkrip Nilai Sementara',
          documentUrl: 'https://example.com/documents/transcript-001.pdf',
          student: {
            id: 1,
            studentId: '20230001',
            name: 'Budi Santoso'
          }
        },
        {
          id: 2,
          studentId: 1,
          documentType: 'id_card',
          documentNumber: 'ID-2023-001',
          issueDate: '2023-02-10T00:00:00Z',
          expiryDate: '2027-02-10T00:00:00Z',
          status: 'active',
          description: 'Kartu Mahasiswa',
          documentUrl: null,
          student: {
            id: 1,
            studentId: '20230001',
            name: 'Budi Santoso'
          }
        },
        {
          id: 3,
          studentId: 2,
          documentType: 'transcript',
          documentNumber: 'TRN-2023-002',
          issueDate: '2023-06-15T00:00:00Z',
          expiryDate: null,
          status: 'active',
          description: 'Transkrip Nilai Sementara',
          documentUrl: 'https://example.com/documents/transcript-002.pdf',
          student: {
            id: 2,
            studentId: '20230002',
            name: 'Siti Nurhaliza'
          }
        },
        {
          id: 4,
          studentId: 3,
          documentType: 'certificate',
          documentNumber: 'CERT-2023-001',
          issueDate: '2023-05-20T00:00:00Z',
          expiryDate: null,
          status: 'active',
          description: 'Sertifikat Kegiatan',
          documentUrl: 'https://example.com/documents/certificate-001.pdf',
          student: {
            id: 3,
            studentId: '20230003',
            name: 'Ahmad Rizki'
          }
        },
        {
          id: 5,
          studentId: 4,
          documentType: 'id_card',
          documentNumber: 'ID-2023-002',
          issueDate: '2023-02-15T00:00:00Z',
          expiryDate: '2023-05-15T00:00:00Z',
          status: 'expired',
          description: 'Kartu Mahasiswa (Sudah Kadaluarsa)',
          documentUrl: null,
          student: {
            id: 4,
            studentId: '20230004',
            name: 'Dewi Lestari'
          }
        }
      ];
      
      // Apply filters
      let filtered = [...mockDocuments];
      
      if (activeTab !== 'all') {
        filtered = filtered.filter(doc => doc.documentType === activeTab);
      }
      
      if (selectedStudentId) {
        filtered = filtered.filter(doc => doc.studentId.toString() === selectedStudentId);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(doc => 
          doc.student.name.toLowerCase().includes(searchLower) || 
          doc.student.studentId.toLowerCase().includes(searchLower) || 
          doc.documentNumber?.toLowerCase().includes(searchLower) ||
          doc.description?.toLowerCase().includes(searchLower)
        );
      }
      
      return {
        data: filtered,
        pagination: {
          total: filtered.length,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(filtered.length / 10)
        }
      };
    },
  });

  // Setup form for adding document
  const form = useForm<z.infer<typeof documentFormSchema>>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      studentId: selectedStudentId ? parseInt(selectedStudentId) : 0,
      documentType: 'transcript',
      documentNumber: '',
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'active',
      description: '',
    },
  });

  // Update form when selected student changes
  React.useEffect(() => {
    if (selectedStudentId) {
      form.setValue('studentId', parseInt(selectedStudentId));
    }
  }, [selectedStudentId, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof documentFormSchema>) => {
    try {
      await apiRequest('POST', '/api/documents', values);
      
      // Close dialog and refresh data
      setIsAddDocumentDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      form.reset();
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  // Define document table columns
  const documentColumns = [
    {
      header: 'NIM',
      accessorKey: 'student.studentId',
    },
    {
      header: 'Nama Mahasiswa',
      accessorKey: 'student.name',
      cell: (data: Document) => (
        <span className="font-medium">{data.student.name}</span>
      ),
    },
    {
      header: 'Jenis Dokumen',
      accessorKey: 'documentType',
      cell: (data: Document) => {
        let displayName = 'Dokumen Lainnya';
        
        switch (data.documentType) {
          case 'transcript':
            displayName = 'Transkrip Nilai';
            break;
          case 'certificate':
            displayName = 'Sertifikat';
            break;
          case 'id_card':
            displayName = 'Kartu Mahasiswa';
            break;
        }
        
        return <span>{displayName}</span>;
      },
    },
    {
      header: 'Nomor Dokumen',
      accessorKey: 'documentNumber',
      cell: (data: Document) => (
        <span>{data.documentNumber || '-'}</span>
      ),
    },
    {
      header: 'Tanggal Terbit',
      accessorKey: 'issueDate',
      cell: (data: Document) => (
        <span>
          {data.issueDate 
            ? format(new Date(data.issueDate), 'dd MMM yyyy', { locale: id })
            : '-'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (data: Document) => {
        let variant: 'success' | 'error' | 'warning' = 'success';
        let displayText = 'Aktif';
        
        if (data.status === 'expired') {
          variant = 'error';
          displayText = 'Kadaluarsa';
        } else if (data.status === 'revoked') {
          variant = 'error';
          displayText = 'Dicabut';
        }
        
        return <StatusBadge status={displayText} variant={variant} />;
      },
    },
    {
      header: 'Aksi',
      accessorKey: 'id',
      cell: (data: Document) => (
        <div className="flex items-center gap-2">
          {data.documentUrl && (
            <Button 
              variant="ghost" 
              size="icon" 
              title="Lihat Dokumen"
              onClick={() => {
                if (data.documentUrl) {
                  window.open(data.documentUrl, '_blank');
                }
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" title="Edit Dokumen">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Hapus Dokumen">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Get counts by document type
  const getDocumentTypeCounts = () => {
    const allDocs = documents?.data || [];
    
    return {
      all: allDocs.length,
      transcript: allDocs.filter(doc => doc.documentType === 'transcript').length,
      certificate: allDocs.filter(doc => doc.documentType === 'certificate').length,
      id_card: allDocs.filter(doc => doc.documentType === 'id_card').length,
      other: allDocs.filter(doc => !['transcript', 'certificate', 'id_card'].includes(doc.documentType)).length
    };
  };

  const counts = getDocumentTypeCounts();

  return (
    <AppLayout
      title="Manajemen Dokumen"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Dokumen' }
      ]}
      actions={
        <Dialog open={isAddDocumentDialogOpen} onOpenChange={setIsAddDocumentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2 items-center">
              <Plus size={16} />
              <span>Tambah Dokumen</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>Tambah Dokumen Baru</DialogTitle>
              <DialogDescription>
                Tambahkan dokumen baru untuk mahasiswa.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mahasiswa</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Mahasiswa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students?.data?.map((student: any) => (
                            <SelectItem key={student.student.id} value={student.student.id.toString()}>
                              {student.student.studentId} - {student.user.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Dokumen</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Jenis" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="transcript">Transkrip Nilai</SelectItem>
                            <SelectItem value="certificate">Sertifikat</SelectItem>
                            <SelectItem value="id_card">Kartu Mahasiswa</SelectItem>
                            <SelectItem value="other">Dokumen Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="documentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Dokumen</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan nomor dokumen"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Terbit</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Kadaluarsa (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="expired">Kadaluarsa</SelectItem>
                            <SelectItem value="revoked">Dicabut</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="documentUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Dokumen (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan URL dokumen"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Masukkan deskripsi dokumen"
                          className="resize-none"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Dokumen
                  </h4>
                  <p className="text-xs text-neutral-500 mb-3">
                    Fitur upload belum tersedia. Gunakan URL dokumen untuk menyediakan tautan ke dokumen.
                  </p>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Document Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card 
          className={`shadow-sm cursor-pointer border ${activeTab === 'all' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
          onClick={() => setActiveTab('all')}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <FolderOpen className={`h-8 w-8 ${activeTab === 'all' ? 'text-primary' : 'text-neutral-500'} mb-2`} />
            <span className={`text-lg font-bold ${activeTab === 'all' ? 'text-primary' : 'text-neutral-800'}`}>
              {counts.all}
            </span>
            <span className="text-sm text-neutral-600">Semua Dokumen</span>
          </CardContent>
        </Card>
        
        <Card 
          className={`shadow-sm cursor-pointer border ${activeTab === 'transcript' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
          onClick={() => setActiveTab('transcript')}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <FileText className={`h-8 w-8 ${activeTab === 'transcript' ? 'text-primary' : 'text-neutral-500'} mb-2`} />
            <span className={`text-lg font-bold ${activeTab === 'transcript' ? 'text-primary' : 'text-neutral-800'}`}>
              {counts.transcript}
            </span>
            <span className="text-sm text-neutral-600">Transkrip</span>
          </CardContent>
        </Card>
        
        <Card 
          className={`shadow-sm cursor-pointer border ${activeTab === 'certificate' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
          onClick={() => setActiveTab('certificate')}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <FileText className={`h-8 w-8 ${activeTab === 'certificate' ? 'text-primary' : 'text-neutral-500'} mb-2`} />
            <span className={`text-lg font-bold ${activeTab === 'certificate' ? 'text-primary' : 'text-neutral-800'}`}>
              {counts.certificate}
            </span>
            <span className="text-sm text-neutral-600">Sertifikat</span>
          </CardContent>
        </Card>
        
        <Card 
          className={`shadow-sm cursor-pointer border ${activeTab === 'id_card' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
          onClick={() => setActiveTab('id_card')}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <FileText className={`h-8 w-8 ${activeTab === 'id_card' ? 'text-primary' : 'text-neutral-500'} mb-2`} />
            <span className={`text-lg font-bold ${activeTab === 'id_card' ? 'text-primary' : 'text-neutral-800'}`}>
              {counts.id_card}
            </span>
            <span className="text-sm text-neutral-600">Kartu Mahasiswa</span>
          </CardContent>
        </Card>
        
        <Card 
          className={`shadow-sm cursor-pointer border ${activeTab === 'other' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
          onClick={() => setActiveTab('other')}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <FileText className={`h-8 w-8 ${activeTab === 'other' ? 'text-primary' : 'text-neutral-500'} mb-2`} />
            <span className={`text-lg font-bold ${activeTab === 'other' ? 'text-primary' : 'text-neutral-800'}`}>
              {counts.other}
            </span>
            <span className="text-sm text-neutral-600">Dokumen Lainnya</span>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <Select 
            value={selectedStudentId} 
            onValueChange={setSelectedStudentId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter berdasarkan Mahasiswa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Mahasiswa</SelectItem>
              {students?.data?.map((student: any) => (
                <SelectItem key={student.student.id} value={student.student.id.toString()}>
                  {student.student.studentId} - {student.user.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2 relative">
          <Input
            type="text"
            placeholder="Cari dokumen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Eye className="text-neutral-400" size={16} />
          </div>
        </div>
      </div>
      
      {/* Documents Table */}
      <DataTable
        data={documents?.data || []}
        columns={documentColumns}
        totalItems={documents?.pagination?.total || 0}
        currentPage={page}
        pageSize={10}
        onPageChange={setPage}
        searchable={false} // We're using custom search input
        exportable={true}
        onExport={() => {
          console.log("Exporting documents data...");
          // Implementation for exporting data
        }}
        isLoading={isLoadingDocuments}
      />
    </AppLayout>
  );
}
