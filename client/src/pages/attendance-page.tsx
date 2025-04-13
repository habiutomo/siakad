import React, { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Eye, 
  Edit, 
  CheckSquare,
  Calendar,
  Clock,
  User,
  Plus,
  Filter
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Attendance Record form schema
const attendanceRecordFormSchema = z.object({
  sectionId: z.number(),
  date: z.string()
});

// Student Attendance form schema
const studentAttendanceFormSchema = z.object({
  attendanceRecordId: z.number(),
  studentId: z.number(),
  status: z.string(),
  notes: z.string().optional()
});

interface AttendanceRecord {
  id: number;
  sectionId: number;
  date: string;
  section: {
    id: number;
    sectionCode: string;
    courseOffering: {
      id: number;
      course: {
        id: number;
        code: string;
        name: string;
      }
    }
  };
  attendance: {
    id: number;
    studentId: number;
    status: string;
    notes: string | null;
    student: {
      id: number;
      studentId: string;
      name: string;
    }
  }[];
}

export default function AttendancePage() {
  const [semesterId, setSemesterId] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [isAddRecordDialogOpen, setIsAddRecordDialogOpen] = useState(false);
  const [isEditAttendanceDialogOpen, setIsEditAttendanceDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<{
    recordId: number;
    studentId: number;
    status: string;
    notes?: string;
  } | null>(null);
  
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

  // Fetch course sections for selected semester
  const { data: sections, isLoading: isLoadingSections } = useQuery({
    queryKey: ['/api/course-sections', semesterId],
    queryFn: async () => {
      if (!semesterId) return [];
      // This is a simplified approach - in a real app, you would fetch sections for the selected semester
      return [
        { id: 1, code: 'A', course: { code: 'CS101', name: 'Algoritma dan Pemrograman' } },
        { id: 2, code: 'B', course: { code: 'CS102', name: 'Basis Data' } },
        { id: 3, code: 'A', course: { code: 'CS103', name: 'Jaringan Komputer' } },
      ];
    },
    enabled: !!semesterId,
  });

  // Fetch attendance records for the selected section and date
  const { data: attendanceRecords, isLoading: isLoadingRecords } = useQuery({
    queryKey: ['/api/attendance-records', selectedSection, selectedDate],
    queryFn: async () => {
      if (!selectedSection) return null;
      
      // In a real implementation, fetch from API with proper params
      // For now, return mock data that matches the expected structure
      return {
        id: 1,
        sectionId: parseInt(selectedSection),
        date: selectedDate,
        section: {
          id: parseInt(selectedSection),
          sectionCode: 'A',
          courseOffering: {
            id: 1,
            course: {
              id: 1,
              code: 'CS101',
              name: 'Algoritma dan Pemrograman'
            }
          }
        },
        attendance: [
          {
            id: 1,
            studentId: 1,
            status: 'present',
            notes: null,
            student: {
              id: 1,
              studentId: '20230001',
              name: 'Budi Santoso'
            }
          },
          {
            id: 2,
            studentId: 2,
            status: 'present',
            notes: null,
            student: {
              id: 2,
              studentId: '20230002',
              name: 'Siti Nurhaliza'
            }
          },
          {
            id: 3,
            studentId: 3,
            status: 'absent',
            notes: 'Sakit',
            student: {
              id: 3,
              studentId: '20230003',
              name: 'Ahmad Rizki'
            }
          },
          {
            id: 4,
            studentId: 4,
            status: 'late',
            notes: 'Terlambat 15 menit',
            student: {
              id: 4,
              studentId: '20230004',
              name: 'Dewi Lestari'
            }
          },
          {
            id: 5,
            studentId: 5,
            status: 'present',
            notes: null,
            student: {
              id: 5,
              studentId: '20230005',
              name: 'Rudi Hermawan'
            }
          }
        ]
      };
    },
    enabled: !!selectedSection && !!selectedDate,
  });

  // Setup form for creating attendance record
  const recordForm = useForm<z.infer<typeof attendanceRecordFormSchema>>({
    resolver: zodResolver(attendanceRecordFormSchema),
    defaultValues: {
      sectionId: 0,
      date: format(new Date(), 'yyyy-MM-dd')
    },
  });

  // Setup form for editing student attendance
  const attendanceForm = useForm<z.infer<typeof studentAttendanceFormSchema>>({
    resolver: zodResolver(studentAttendanceFormSchema),
    defaultValues: {
      attendanceRecordId: 0,
      studentId: 0,
      status: 'present',
      notes: ''
    },
  });

  // Handle record form submission
  const onRecordSubmit = async (values: z.infer<typeof attendanceRecordFormSchema>) => {
    try {
      await apiRequest('POST', '/api/attendance-records', values);
      
      // Close dialog and refresh data
      setIsAddRecordDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/attendance-records'] });
      
      // Set the selected section and date to the newly created record
      setSelectedSection(values.sectionId.toString());
      setSelectedDate(values.date);
      
      recordForm.reset();
    } catch (error) {
      console.error('Failed to create attendance record:', error);
    }
  };

  // Handle attendance form submission
  const onAttendanceSubmit = async (values: z.infer<typeof studentAttendanceFormSchema>) => {
    try {
      await apiRequest('POST', '/api/student-attendance', values);
      
      // Close dialog and refresh data
      setIsEditAttendanceDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/attendance-records'] });
      
      attendanceForm.reset();
    } catch (error) {
      console.error('Failed to update attendance:', error);
    }
  };

  // Get status display info
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'present':
        return { text: 'Hadir', variant: 'success' as const };
      case 'absent':
        return { text: 'Tidak Hadir', variant: 'error' as const };
      case 'excused':
        return { text: 'Izin', variant: 'warning' as const };
      case 'late':
        return { text: 'Terlambat', variant: 'warning' as const };
      default:
        return { text: status, variant: 'info' as const };
    }
  };

  // Calculate attendance statistics
  const getAttendanceStats = () => {
    if (!attendanceRecords) return { present: 0, absent: 0, excused: 0, late: 0, total: 0 };
    
    const total = attendanceRecords.attendance.length;
    const present = attendanceRecords.attendance.filter(a => a.status === 'present').length;
    const absent = attendanceRecords.attendance.filter(a => a.status === 'absent').length;
    const excused = attendanceRecords.attendance.filter(a => a.status === 'excused').length;
    const late = attendanceRecords.attendance.filter(a => a.status === 'late').length;
    
    return { present, absent, excused, late, total };
  };

  // Get attendance stats
  const stats = getAttendanceStats();

  return (
    <AppLayout
      title="Manajemen Absensi"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Absensi' }
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
          
          <Dialog open={isAddRecordDialogOpen} onOpenChange={setIsAddRecordDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 items-center">
                <Plus size={16} />
                <span>Buat Absensi</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Buat Rekaman Absensi Baru</DialogTitle>
                <DialogDescription>
                  Pilih kelas dan tanggal untuk membuat rekaman absensi baru.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...recordForm}>
                <form onSubmit={recordForm.handleSubmit(onRecordSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={recordForm.control}
                    name="sectionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kelas</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Kelas" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sections?.map((section: any) => (
                              <SelectItem key={section.id} value={section.id.toString()}>
                                {section.course.code} - {section.course.name} (Seksi {section.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={recordForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Buat</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <Select 
            value={selectedSection} 
            onValueChange={setSelectedSection}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              {sections?.map((section: any) => (
                <SelectItem key={section.id} value={section.id.toString()}>
                  {section.course.code} - {section.course.name} (Seksi {section.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
      
      {/* Attendance Stats */}
      {attendanceRecords && (
        <div className="mb-6">
          <Card className="shadow-sm border border-neutral-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                {attendanceRecords.section.courseOffering.course.code} - {attendanceRecords.section.courseOffering.course.name} 
                <span className="ml-2 text-sm font-normal text-neutral-500">
                  (Seksi {attendanceRecords.section.sectionCode})
                </span>
              </CardTitle>
              <p className="text-sm text-neutral-500">
                Tanggal: {format(new Date(attendanceRecords.date), 'EEEE, dd MMMM yyyy', { locale: id })}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center p-3 bg-success/10 rounded-lg">
                  <span className="text-2xl font-bold text-success">{stats.present}</span>
                  <span className="text-sm text-neutral-600">Hadir</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-error/10 rounded-lg">
                  <span className="text-2xl font-bold text-error">{stats.absent}</span>
                  <span className="text-sm text-neutral-600">Tidak Hadir</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-warning/10 rounded-lg">
                  <span className="text-2xl font-bold text-warning">{stats.late}</span>
                  <span className="text-sm text-neutral-600">Terlambat</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-info/10 rounded-lg">
                  <span className="text-2xl font-bold text-info">{stats.excused}</span>
                  <span className="text-sm text-neutral-600">Izin</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Attendance Table */}
      {attendanceRecords ? (
        <Card className="shadow-sm border border-neutral-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Daftar Kehadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm data-table">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-600">
                    <th className="px-4 py-3 text-left font-semibold">NIM</th>
                    <th className="px-4 py-3 text-left font-semibold">Nama</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Keterangan</th>
                    <th className="px-4 py-3 text-left font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.attendance.map((attendance) => {
                    const status = getStatusDisplay(attendance.status);
                    return (
                      <tr key={attendance.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                        <td className="px-4 py-3">{attendance.student.studentId}</td>
                        <td className="px-4 py-3 font-medium">{attendance.student.name}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={status.text} variant={status.variant} />
                        </td>
                        <td className="px-4 py-3">{attendance.notes || '-'}</td>
                        <td className="px-4 py-3">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedAttendance({
                                recordId: attendanceRecords.id,
                                studentId: attendance.student.id,
                                status: attendance.status,
                                notes: attendance.notes || undefined
                              });
                              attendanceForm.reset({
                                attendanceRecordId: attendanceRecords.id,
                                studentId: attendance.student.id,
                                status: attendance.status,
                                notes: attendance.notes || ''
                              });
                              setIsEditAttendanceDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-neutral-200 rounded-lg bg-white">
          <CheckSquare className="h-12 w-12 text-neutral-300 mb-4" />
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">Tidak Ada Data Absensi</h3>
          <p className="text-neutral-500 text-center max-w-md mb-6">
            Pilih kelas dan tanggal untuk melihat data absensi, atau buat rekaman absensi baru.
          </p>
          <Button
            onClick={() => setIsAddRecordDialogOpen(true)}
            className="flex gap-2 items-center"
          >
            <Plus size={16} />
            <span>Buat Absensi Baru</span>
          </Button>
        </div>
      )}
      
      {/* Edit Attendance Dialog */}
      <Dialog open={isEditAttendanceDialogOpen} onOpenChange={setIsEditAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Kehadiran</DialogTitle>
            <DialogDescription>
              Ubah status kehadiran dan keterangan mahasiswa.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...attendanceForm}>
            <form onSubmit={attendanceForm.handleSubmit(onAttendanceSubmit)} className="space-y-4 py-4">
              <FormField
                control={attendanceForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Kehadiran</FormLabel>
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
                        <SelectItem value="present">Hadir</SelectItem>
                        <SelectItem value="absent">Tidak Hadir</SelectItem>
                        <SelectItem value="excused">Izin</SelectItem>
                        <SelectItem value="late">Terlambat</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={attendanceForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan keterangan jika diperlukan"
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
    </AppLayout>
  );
}
