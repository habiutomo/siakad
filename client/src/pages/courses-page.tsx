import React, { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { 
  Eye, 
  Edit, 
  Trash2, 
  BookOpen,
  Plus,
  Download
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertCourseSchema } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { StatusBadge } from '@/components/ui/status-badge';

// Define course form schema
const courseFormSchema = insertCourseSchema.extend({
  description: z.string().optional(),
});

// Course type definition based on API response
interface Course {
  course: {
    id: number;
    code: string;
    name: string;
    description: string | null;
    credits: number;
    studyProgramId: number;
    semester: number;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
  studyProgram: {
    id: number;
    name: string;
    code: string;
  };
}

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [studyProgramFilter, setStudyProgramFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Fetch courses data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/courses', page, search, studyProgramFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      
      if (search) params.append('search', search);
      if (studyProgramFilter) params.append('studyProgramId', studyProgramFilter);
      
      const response = await fetch(`/api/courses?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
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

  // Setup form for adding new course
  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      credits: 3,
      studyProgramId: 0,
      semester: 1,
      type: 'mandatory',
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof courseFormSchema>) => {
    try {
      const response = await apiRequest('POST', '/api/courses', values);
      
      // Close dialog and invalidate cache to refresh list
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      
      form.reset();
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  // Define table columns
  const columns = [
    {
      header: 'Kode',
      accessorKey: 'course.code',
    },
    {
      header: 'Nama Mata Kuliah',
      accessorKey: 'course.name',
      cell: (data: Course) => (
        <span className="font-medium">{data.course.name}</span>
      ),
    },
    {
      header: 'Program Studi',
      accessorKey: 'studyProgram.name',
    },
    {
      header: 'SKS',
      accessorKey: 'course.credits',
    },
    {
      header: 'Semester',
      accessorKey: 'course.semester',
    },
    {
      header: 'Tipe',
      accessorKey: 'course.type',
      cell: (data: Course) => {
        const type = data.course.type;
        let variant: 'success' | 'info' = 'success';
        let displayText = 'Wajib';
        
        if (type === 'elective') {
          variant = 'info';
          displayText = 'Pilihan';
        }
        
        return <StatusBadge status={displayText} variant={variant} />;
      },
    },
    {
      header: 'Aksi',
      accessorKey: 'course.id',
      cell: (data: Course) => (
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
      title="Manajemen Mata Kuliah"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Mata Kuliah' }
      ]}
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2 items-center">
              <Plus size={16} />
              <span>Tambah Mata Kuliah</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>Tambah Mata Kuliah Baru</DialogTitle>
              <DialogDescription>
                Tambahkan data mata kuliah baru ke dalam sistem.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kode Mata Kuliah</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Kode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Mata Kuliah</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Nama" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKS</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Jumlah SKS"
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
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Semester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 8 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                Semester {i + 1}
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
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Tipe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mandatory">Wajib</SelectItem>
                            <SelectItem value="elective">Pilihan</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Masukkan deskripsi mata kuliah" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
