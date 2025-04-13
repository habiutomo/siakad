import React, { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Plus, MapPin, User } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
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

// Schedule form schema
const scheduleFormSchema = z.object({
  sectionId: z.number(),
  dayOfWeek: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  roomId: z.number().optional(),
  scheduleType: z.string(),
});

const DAYS_OF_WEEK = [
  { value: 0, label: 'Minggu' },
  { value: 1, label: 'Senin' },
  { value: 2, label: 'Selasa' },
  { value: 3, label: 'Rabu' },
  { value: 4, label: 'Kamis' },
  { value: 5, label: 'Jumat' },
  { value: 6, label: 'Sabtu' },
];

export default function SchedulesPage() {
  const [semesterId, setSemesterId] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
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

  // Fetch course offerings for selected semester
  const { data: courseOfferings, isLoading: isLoadingOfferings } = useQuery({
    queryKey: ['/api/course-offerings', semesterId],
    queryFn: async () => {
      if (!semesterId) return { offerings: [] };
      const response = await fetch(`/api/course-offerings?semesterId=${semesterId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course offerings');
      }
      return response.json();
    },
    enabled: !!semesterId,
  });

  // Fetch rooms
  const { data: rooms } = useQuery({
    queryKey: ['/api/rooms'],
    queryFn: async () => {
      const response = await fetch('/api/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      return response.json();
    },
  });

  // Setup form for adding new schedule
  const form = useForm<z.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      sectionId: 0,
      dayOfWeek: 1, // Monday
      startTime: '08:00',
      endTime: '09:40',
      scheduleType: 'lecture',
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof scheduleFormSchema>) => {
    try {
      const response = await apiRequest('POST', '/api/schedules', values);
      
      // Close dialog and invalidate cache to refresh schedules
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      
      form.reset();
    } catch (error) {
      console.error('Failed to add schedule:', error);
    }
  };

  // Mock schedules - in a real app, fetch this from API
  const schedules = [
    {
      id: 1,
      day: 1, // Monday
      startTime: '08:00',
      endTime: '09:40',
      course: {
        code: 'CS101',
        name: 'Algoritma dan Pemrograman',
      },
      section: 'A',
      room: 'R.3.01',
      lecturer: 'Dr. Budi Santoso',
      type: 'lecture',
    },
    {
      id: 2,
      day: 1, // Monday
      startTime: '10:00',
      endTime: '11:40',
      course: {
        code: 'CS102',
        name: 'Basis Data',
      },
      section: 'B',
      room: 'R.3.02',
      lecturer: 'Dr. Siti Nurhaliza',
      type: 'lecture',
    },
    {
      id: 3,
      day: 2, // Tuesday
      startTime: '13:00',
      endTime: '14:40',
      course: {
        code: 'CS103',
        name: 'Jaringan Komputer',
      },
      section: 'A',
      room: 'Lab.2.01',
      lecturer: 'Dr. Ahmad Rizki',
      type: 'lab',
    },
    {
      id: 4,
      day: 3, // Wednesday
      startTime: '08:00',
      endTime: '09:40',
      course: {
        code: 'CS104',
        name: 'Pemrograman Web',
      },
      section: 'C',
      room: 'R.3.03',
      lecturer: 'Dr. Dewi Lestari',
      type: 'lecture',
    },
    {
      id: 5,
      day: 4, // Thursday
      startTime: '10:00',
      endTime: '11:40',
      course: {
        code: 'CS105',
        name: 'Kecerdasan Buatan',
      },
      section: 'A',
      room: 'R.3.04',
      lecturer: 'Dr. Rudi Hermawan',
      type: 'lecture',
    },
  ];

  // Filter schedules by day if a specific day is selected
  const filteredSchedules = selectedDay === 'all' 
    ? schedules 
    : schedules.filter(schedule => schedule.day.toString() === selectedDay);

  return (
    <AppLayout
      title="Jadwal Kuliah"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Jadwal Kuliah' }
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
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 items-center">
                <Plus size={16} />
                <span>Tambah Jadwal</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Tambah Jadwal Baru</DialogTitle>
                <DialogDescription>
                  Tambahkan jadwal kuliah baru untuk semester ini.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="sectionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seksi Kelas</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Seksi Kelas" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* In a real app, you would fetch and map course sections */}
                            <SelectItem value="1">CS101 - Algoritma dan Pemrograman (A)</SelectItem>
                            <SelectItem value="2">CS102 - Basis Data (B)</SelectItem>
                            <SelectItem value="3">CS103 - Jaringan Komputer (A)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dayOfWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hari</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Hari" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DAYS_OF_WEEK.map(day => (
                                <SelectItem key={day.value} value={day.value.toString()}>
                                  {day.label}
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
                      name="roomId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ruangan</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Ruangan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {rooms?.map((room: any) => (
                                <SelectItem key={room.id} value={room.id.toString()}>
                                  {room.buildingName}.{room.roomNumber}
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
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Waktu Mulai</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Waktu Selesai</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="scheduleType"
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
                              <SelectItem value="lecture">Kuliah</SelectItem>
                              <SelectItem value="lab">Praktikum</SelectItem>
                              <SelectItem value="exam">Ujian</SelectItem>
                            </SelectContent>
                          </Select>
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
        </div>
      }
    >
      {/* Filter by day */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button 
          variant={selectedDay === 'all' ? 'default' : 'outline'} 
          onClick={() => setSelectedDay('all')}
        >
          Semua Hari
        </Button>
        {DAYS_OF_WEEK.map(day => (
          <Button
            key={day.value}
            variant={selectedDay === day.value.toString() ? 'default' : 'outline'}
            onClick={() => setSelectedDay(day.value.toString())}
          >
            {day.label}
          </Button>
        ))}
      </div>
      
      {/* Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchedules.map(schedule => (
          <Card key={schedule.id} className="shadow-sm border border-neutral-200">
            <CardHeader className={`pb-3 ${schedule.type === 'lab' ? 'bg-secondary/10' : schedule.type === 'exam' ? 'bg-error/10' : 'bg-primary/10'}`}>
              <CardTitle className="text-md font-semibold flex items-center justify-between">
                <span>{schedule.course.name}</span>
                <StatusBadge 
                  status={schedule.type === 'lab' ? 'Praktikum' : schedule.type === 'exam' ? 'Ujian' : 'Kuliah'} 
                  variant={schedule.type === 'lab' ? 'info' : schedule.type === 'exam' ? 'error' : 'success'} 
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                  <span>{DAYS_OF_WEEK.find(d => d.value === schedule.day)?.label}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-neutral-500" />
                  <span>{schedule.startTime} - {schedule.endTime}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-neutral-500" />
                  <span>{schedule.room}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-neutral-500" />
                  <span>{schedule.lecturer}</span>
                </div>

                <div className="pt-2 mt-2 border-t border-neutral-100 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">
                    {schedule.course.code} - Seksi {schedule.section}
                  </span>
                  <Button variant="outline" size="sm">
                    Detail
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredSchedules.length === 0 && (
          <div className="col-span-full py-8 text-center">
            <p className="text-neutral-500">Tidak ada jadwal untuk hari yang dipilih.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
