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
  UserPlus,
  Download,
  Filter
} from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertStudentSchema } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Define student form schema
const studentFormSchema = insertStudentSchema.pick({
  userId: true,
  studentId: true,
  studyProgramId: true,
  entranceYear: true,
  status: true,
  gender: true,
  birthDate: true,
  birthPlace: true,
  nik: true,
  familyCardNumber: true,
  parentName: true,
  parentPhone: true,
}).extend({
  birthDate: z.string().optional(),
  userId: z.number().optional(),
});

// Student type definition based on API response
interface Student {
  student: {
    id: number;
    userId: number;
    studentId: string;
    studyProgramId: number;
    entranceYear: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
  };
  studyProgram: {
    id: number;
    name: string;
    code: string;
  };
}

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [studyProgramFilter, setStudyProgramFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Fetch students data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/students', page, search, studyProgramFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      
      if (search) params.append('search', search);
      if (studyProgramFilter) params.append('studyProgramId', studyProgramFilter);
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await fetch(`/api/students?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      return response.json();
    },
  });

  // Fetch study programs for filter/form
  const { data: studyPrograms } = useQuery({
    queryKey: ['/api/study-programs'],
    queryFn: async () => {
      const response = await fetch('/api/study-programs');
      if (!response.ok) {
        throw new Error('Failed to fetch study programs');
      }
      return response.json();
    },
  });

  // Setup form for adding new student
  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      studentId: '',
      studyProgramId: 0,
      entranceYear: new Date().getFullYear(),
      status: 'active',
      gender: '',
      birthPlace: '',
      nik: '',
      familyCardNumber: '',
      parentName: '',
      parentPhone: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof studentFormSchema>) => {
    try {
      // In a real implementation, you'd typically:
      // 1. Create a user first or select an existing user
      // 2. Then create a student record with that userId
      
      const response = await apiRequest('POST', '/api/students', values);
      
      // Close dialog and invalidate cache to refresh list
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/students'] });
      
      form.reset();
    } catch (error) {
      console.error('Failed to add student:', error);
    }
  };

  // Define table columns
  const columns = [
    {
      header: 'NIM',
      accessorKey: 'student.studentId',
    },
    {
      header: 'Nama',
      accessorKey: 'user.fullName',
      cell: (data: Student) => (
        <span className="font-medium">{data.user.fullName}</span>
      ),
    },
    {
      header: 'Program Studi',
      accessorKey: 'studyProgram.name',
    },
    {
      header: 'Angkatan',
      accessorKey: 'student.entranceYear',
    },
    {
      header: 'Status',
      accessorKey: 'student.status',
      cell: (data: Student) => {
        const status = data.student.status;
        let variant: 'success' | 'error' | 'warning' = 'success';
        let displayText = 'Aktif';
        
        if (status === 'inactive') {
          variant = 'error';
          displayText = 'Non-Aktif';
        } else if (status === 'on_leave') {
          variant = 'warning';
          displayText = 'Cuti';
        }
        
        return <StatusBadge status={displayText} variant={variant} />;
      },
    },
    {
      header: 'Aksi',
      accessorKey: 'student.id',
      cell: (data: Student) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Lihat Detail">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Edit Data">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Hapus Data">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout
      title="Manajemen Mahasiswa"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Mahasiswa' }
      ]}
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2 items-center">
              <UserPlus size={16} />
              <span>Tambah Mahasiswa</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>Tambah Mahasiswa Baru</DialogTitle>
              <DialogDescription>
                Tambahkan data mahasiswa baru ke dalam sistem.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIM</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan NIM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="entranceYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tahun Masuk</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Tahun Masuk"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="studyProgramId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Studi</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Program Studi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {studyPrograms?.map((program: any) => (
                              <SelectItem
                                key={program.id}
                                value={program.id.toString()}
                              >
                                {program.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                            <SelectItem value="inactive">Non-Aktif</SelectItem>
                            <SelectItem value="on_leave">Cuti</SelectItem>
                            <SelectItem value="graduated">Lulus</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Kelamin</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Jenis Kelamin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="L">Laki-laki</SelectItem>
                            <SelectItem value="P">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="birthPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempat Lahir</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Tempat Lahir" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nik"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIK</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan NIK" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="familyCardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Kartu Keluarga</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Nomor KK" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="parentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Orang Tua</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Nama Orang Tua" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="parentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telepon Orang Tua</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Nomor Telepon" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
      <DataTable
        data={data?.data || []}
        columns={columns}
        totalItems={data?.pagination?.total || 0}
        currentPage={page}
        pageSize={10}
        onPageChange={setPage}
        searchable={true}
        onSearch={setSearch}
        filterableBy={{
          key: "Program Studi",
          options: studyPrograms?.map((program: any) => ({ 
            label: program.name, 
            value: program.id.toString() 
          })) || [],
          onChange: setStudyProgramFilter
        }}
        exportable={true}
        onExport={() => {
          console.log("Exporting data...");
          // Implementation for exporting data
        }}
        isLoading={isLoading}
      />
    </AppLayout>
  );
}
