import React, { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { 
  Eye, 
  Edit, 
  BarChart3,
  Download,
  Filter,
  Plus
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { apiRequest, queryClient } from '@/lib/queryClient';

// Grade form schema
const gradeFormSchema = z.object({
  enrollmentId: z.number(),
  midtermScore: z.number().min(0).max(100),
  assignmentScore: z.number().min(0).max(100),
  finalScore: z.number().min(0).max(100),
  grade: z.string().optional(),
  gradePoints: z.number().optional(),
});

// Mock enrollment data for grades
interface EnrollmentWithGrade {
  id: number;
  studentId: number;
  sectionId: number;
  status: string;
  grade: string | null;
  gradePoints: number | null;
  finalScore: number | null;
  midtermScore: number | null;
  assignmentScore: number | null;
  student: {
    id: number;
    studentId: string;
    name: string;
  };
  section: {
    id: number;
    sectionCode: string;
    course: {
      id: number;
      code: string;
      name: string;
    };
  };
}

export default function GradesPage() {
  const [semesterId, setSemesterId] = useState<string>("");
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isAddGradeDialogOpen, setIsAddGradeDialogOpen] = useState(false);
  
  // Fetch active semester
  const { data: activeSemester } = useQuery({
    queryKey: ['/api/active-semester'],
    queryFn: async () => {
      const response = await fetch('/api/active-semester');
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch active semester');
      }
      return response.json();
    },
  });

  // Fetch all semesters
  const { data: semesters } = useQuery({
    queryKey: ['/api/semesters'],
    queryFn: async () => {
      const response = await fetch('/api/semesters');
      if (!response.ok) {
        throw new Error('Failed to fetch semesters');
      }
      return response.json();
    },
  });

  // Set the default semester to active
  React.useEffect(() => {
    if (activeSemester && !semesterId) {
      setSemesterId(activeSemester.id.toString());
    }
  }, [activeSemester]);

  // Mock enrollments with grades data - in a real app, fetch from API
  const enrollments: EnrollmentWithGrade[] = [
    {
      id: 1,
      studentId: 1,
      sectionId: 1,
      status: 'enrolled',
      grade: 'A',
      gradePoints: 4,
      finalScore: 90,
      midtermScore: 85,
      assignmentScore: 95,
      student: {
        id: 1,
        studentId: '20230001',
        name: 'Budi Santoso',
      },
      section: {
        id: 1,
        sectionCode: 'A',
        course: {
          id: 1,
          code: 'CS101',
          name: 'Algoritma dan Pemrograman',
        },
      },
    },
    {
      id: 2,
      studentId: 2,
      sectionId: 1,
      status: 'enrolled',
      grade: 'B+',
      gradePoints: 3.5,
      finalScore: 85,
      midtermScore: 80,
      assignmentScore: 90,
      student: {
        id: 2,
        studentId: '20230002',
        name: 'Siti Nurhaliza',
      },
      section: {
        id: 1,
        sectionCode: 'A',
        course: {
          id: 1,
          code: 'CS101',
          name: 'Algoritma dan Pemrograman',
        },
      },
    },
    {
      id: 3,
      studentId: 3,
      sectionId: 2,
      status: 'enrolled',
      grade: 'C',
      gradePoints: 2,
      finalScore: 70,
      midtermScore: 65,
      assignmentScore: 75,
      student: {
        id: 3,
        studentId: '20230003',
        name: 'Ahmad Rizki',
      },
      section: {
        id: 2,
        sectionCode: 'B',
        course: {
          id: 2,
          code: 'CS102',
          name: 'Basis Data',
        },
      },
    },
    {
      id: 4,
      studentId: 4,
      sectionId: 2,
      status: 'enrolled',
      grade: null,
      gradePoints: null,
      finalScore: null,
      midtermScore: 75,
      assignmentScore: 80,
      student: {
        id: 4,
        studentId: '20230004',
        name: 'Dewi Lestari',
      },
      section: {
        id: 2,
        sectionCode: 'B',
        course: {
          id: 2,
          code: 'CS102',
          name: 'Basis Data',
        },
      },
    },
    {
      id: 5,
      studentId: 5,
      sectionId: 3,
      status: 'enrolled',
      grade: 'A-',
      gradePoints: 3.7,
      finalScore: 87,
      midtermScore: 88,
      assignmentScore: 86,
      student: {
        id: 5,
        studentId: '20230005',
        name: 'Rudi Hermawan',
      },
      section: {
        id: 3,
        sectionCode: 'A',
        course: {
          id: 3,
          code: 'CS103',
          name: 'Jaringan Komputer',
        },
      },
    },
  ];

  // Filter enrollments by course if a course filter is selected
  const filteredEnrollments = courseFilter 
    ? enrollments.filter(enrollment => enrollment.section.course.id.toString() === courseFilter)
    : enrollments;

  // Setup form for adding/editing grade
  const form = useForm<z.infer<typeof gradeFormSchema>>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      enrollmentId: 0,
      midtermScore: 0,
      assignmentScore: 0,
      finalScore: 0,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof gradeFormSchema>) => {
    try {
      const response = await apiRequest('PUT', `/api/enrollments/${values.enrollmentId}`, values);
      
      // Close dialog and invalidate cache to refresh list
      setIsAddGradeDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/enrollments'] });
      
      form.reset();
    } catch (error) {
      console.error('Failed to update grade:', error);
    }
  };

  // Define table columns
  const columns = [
    {
      header: 'NIM',
      accessorKey: 'student.studentId',
    },
    {
      header: 'Nama Mahasiswa',
      accessorKey: 'student.name',
      cell: (data: EnrollmentWithGrade) => (
        <span className="font-medium">{data.student.name}</span>
      ),
    },
    {
      header: 'Mata Kuliah',
      accessorKey: 'section.course.name',
      cell: (data: EnrollmentWithGrade) => (
        <div>
          <div>{data.section.course.name}</div>
          <div className="text-xs text-neutral-500">
            {data.section.course.code} - Seksi {data.section.sectionCode}
          </div>
        </div>
      ),
    },
    {
      header: 'Tugas',
      accessorKey: 'assignmentScore',
      cell: (data: EnrollmentWithGrade) => (
        <span>{data.assignmentScore !== null ? data.assignmentScore : '-'}</span>
      ),
    },
    {
      header: 'UTS',
      accessorKey: 'midtermScore',
      cell: (data: EnrollmentWithGrade) => (
        <span>{data.midtermScore !== null ? data.midtermScore : '-'}</span>
      ),
    },
    {
      header: 'UAS',
      accessorKey: 'finalScore',
      cell: (data: EnrollmentWithGrade) => (
        <span>{data.finalScore !== null ? data.finalScore : '-'}</span>
      ),
    },
    {
      header: 'Nilai',
      accessorKey: 'grade',
      cell: (data: EnrollmentWithGrade) => (
        <span className="font-bold">{data.grade || '-'}</span>
      ),
    },
    {
      header: 'Bobot',
      accessorKey: 'gradePoints',
      cell: (data: EnrollmentWithGrade) => (
        <span>{data.gradePoints !== null ? data.gradePoints.toFixed(1) : '-'}</span>
      ),
    },
    {
      header: 'Aksi',
      accessorKey: 'id',
      cell: (data: EnrollmentWithGrade) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Lihat Detail">
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            title="Edit Nilai"
            onClick={() => {
              form.reset({
                enrollmentId: data.id,
                midtermScore: data.midtermScore || 0,
                assignmentScore: data.assignmentScore || 0,
                finalScore: data.finalScore || 0,
                grade: data.grade || undefined,
                gradePoints: data.gradePoints || undefined,
              });
              setIsAddGradeDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Mock courses for filter
  const courses = [
    { id: 1, code: 'CS101', name: 'Algoritma dan Pemrograman' },
    { id: 2, code: 'CS102', name: 'Basis Data' },
    { id: 3, code: 'CS103', name: 'Jaringan Komputer' },
  ];

  return (
    <AppLayout
      title="Manajemen Nilai"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Nilai' }
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Select 
            value={semesterId} 
            onValueChange={setSemesterId}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Semester" />
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
      {/* Grade statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm border border-neutral-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Jumlah Mahasiswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-neutral-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Rata-rata Nilai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82.3</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-neutral-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Nilai Tertinggi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-neutral-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Nilai Terendah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Course filter */}
      <div className="mb-6">
        <Select 
          value={courseFilter} 
          onValueChange={setCourseFilter}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Filter berdasarkan Mata Kuliah" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Mata Kuliah</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.code} - {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Grades Table */}
      <DataTable
        data={filteredEnrollments}
        columns={columns}
        totalItems={filteredEnrollments.length}
        currentPage={page}
        pageSize={10}
        onPageChange={setPage}
        searchable={true}
        onSearch={setSearch}
        exportable={true}
        onExport={() => {
          console.log("Exporting grades data...");
          // Implementation for exporting data
        }}
        isLoading={false}
      />
      
      {/* Grade Input Dialog */}
      <Dialog open={isAddGradeDialogOpen} onOpenChange={setIsAddGradeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Input Nilai</DialogTitle>
            <DialogDescription>
              Masukkan nilai untuk mahasiswa.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assignmentScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nilai Tugas</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="midtermScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nilai UTS</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="finalScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nilai UAS</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nilai Huruf</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Nilai" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="C+">C+</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit">Simpan Nilai</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
