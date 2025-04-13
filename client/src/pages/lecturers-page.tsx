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
import { insertLecturerSchema } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Define lecturer form schema
const lecturerFormSchema = insertLecturerSchema.pick({
  userId: true,
  lecturerId: true,
  departmentId: true,
  position: true,
  employmentStatus: true,
  educationLevel: true,
  expertise: true,
}).extend({
  userId: z.number().optional(),
});

// Lecturer type definition based on API response
interface Lecturer {
  lecturer: {
    id: number;
    userId: number;
    lecturerId: string;
    departmentId: number;
    position: string;
    employmentStatus: string;
    educationLevel: string;
    expertise: string;
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
  department: {
    id: number;
    name: string;
    code: string;
  };
}

export default function LecturersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Fetch lecturers data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/lecturers', page, search, departmentFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      
      if (search) params.append('search', search);
      if (departmentFilter) params.append('departmentId', departmentFilter);
      
      const response = await fetch(`/api/lecturers?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lecturers');
      }
      return response.json();
    },
  });

  // Fetch departments for filter/form
  const { data: departments } = useQuery({
    queryKey: ['/api/departments'],
    queryFn: async () => {
      const response = await fetch('/api/departments');
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      return response.json();
    },
  });

  // Setup form for adding new lecturer
  const form = useForm<z.infer<typeof lecturerFormSchema>>({
    resolver: zodResolver(lecturerFormSchema),
    defaultValues: {
      lecturerId: '',
      departmentId: 0,
      position: '',
      employmentStatus: 'full-time',
      educationLevel: '',
      expertise: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof lecturerFormSchema>) => {
    try {
      // In a real implementation, you'd typically:
      // 1. Create a user first or select an existing user
      // 2. Then create a lecturer record with that userId
      
      const response = await apiRequest('POST', '/api/lecturers', values);
      
      // Close dialog and invalidate cache to refresh list
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/lecturers'] });
      
      form.reset();
    } catch (error) {
      console.error('Failed to add lecturer:', error);
    }
  };

  // Define table columns
  const columns = [
    {
      header: 'NIDN',
      accessorKey: 'lecturer.lecturerId',
    },
    {
      header: 'Nama',
      accessorKey: 'user.fullName',
      cell: (data: Lecturer) => (
        <span className="font-medium">{data.user.fullName}</span>
      ),
    },
    {
      header: 'Departemen',
      accessorKey: 'department.name',
    },
    {
      header: 'Jabatan',
      accessorKey: 'lecturer.position',
    },
    {
      header: 'Status',
      accessorKey: 'lecturer.employmentStatus',
      cell: (data: Lecturer) => {
        const status = data.lecturer.employmentStatus;
        let variant: 'success' | 'warning' = 'success';
        let displayText = 'Full-time';
        
        if (status === 'part-time') {
          variant = 'warning';
          displayText = 'Part-time';
        }
        
        return <StatusBadge status={displayText} variant={variant} />;
      },
    },
    {
      header: 'Pendidikan',
      accessorKey: 'lecturer.educationLevel',
    },
    {
      header: 'Aksi',
      accessorKey: 'lecturer.id',
      cell: (data: Lecturer) => (
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
      title="Manajemen Dosen"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Dosen' }
      ]}
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2 items-center">
              <UserPlus size={16} />
              <span>Tambah Dosen</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>Tambah Dosen Baru</DialogTitle>
              <DialogDescription>
                Tambahkan data dosen baru ke dalam sistem.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lecturerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIDN</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan NIDN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departemen</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Departemen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments?.map((dept: any) => (
                              <SelectItem
                                key={dept.id}
                                value={dept.id.toString()}
                              >
                                {dept.name}
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
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jabatan</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Jabatan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="employmentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Kepegawaian</FormLabel>
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
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="educationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenjang Pendidikan</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Jenjang" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="S1">S1</SelectItem>
                            <SelectItem value="S2">S2</SelectItem>
                            <SelectItem value="S3">S3</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expertise"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bidang Keahlian</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Bidang Keahlian" {...field} />
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
          key: "Departemen",
          options: departments?.map((dept: any) => ({ 
            label: dept.name, 
            value: dept.id.toString() 
          })) || [],
          onChange: setDepartmentFilter
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
