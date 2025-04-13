import React, { useState } from 'react';
import { LayoutWithSidebar } from '@/components/layout-with-sidebar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  Download, 
  Trash2,
  Pencil,
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Filter,
  CalendarDays,
  ArrowUpDown,
  Check,
  Upload
} from 'lucide-react';

// Interface untuk data jadwal
interface Schedule {
  id: number;
  courseId: number;
  courseName: string;
  courseCode: string;
  lecturerId: number;
  lecturerName: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  roomId: number;
  roomName: string;
  semester: string;
  academicYear: string;
  section: string;
  studentCount: number;
}

// Data contoh untuk jadwal
const demoSchedules: Schedule[] = [
  {
    id: 1,
    courseId: 1,
    courseName: 'Algoritma dan Pemrograman',
    courseCode: 'TI2044',
    lecturerId: 1,
    lecturerName: 'Dr. Budi Santoso, M.Kom.',
    day: 'monday',
    startTime: '08:00',
    endTime: '09:40',
    roomId: 1,
    roomName: 'R. 2.3',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    section: 'A',
    studentCount: 35,
  },
  {
    id: 2,
    courseId: 2,
    courseName: 'Struktur Data',
    courseCode: 'TI3045',
    lecturerId: 1,
    lecturerName: 'Dr. Budi Santoso, M.Kom.',
    day: 'monday',
    startTime: '10:00',
    endTime: '11:40',
    roomId: 1,
    roomName: 'R. 2.3',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    section: 'A',
    studentCount: 30,
  },
  {
    id: 3,
    courseId: 3,
    courseName: 'Basis Data',
    courseCode: 'SI2041',
    lecturerId: 2,
    lecturerName: 'Prof. Siti Rahayu, Ph.D.',
    day: 'tuesday',
    startTime: '13:00',
    endTime: '14:40',
    roomId: 2,
    roomName: 'Lab Database',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    section: 'A',
    studentCount: 28,
  },
  {
    id: 4,
    courseId: 4,
    courseName: 'Kecerdasan Buatan',
    courseCode: 'TI4051',
    lecturerId: 1,
    lecturerName: 'Dr. Budi Santoso, M.Kom.',
    day: 'wednesday',
    startTime: '08:00',
    endTime: '09:40',
    roomId: 3,
    roomName: 'Lab AI',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    section: 'A',
    studentCount: 22,
  },
  {
    id: 5,
    courseId: 5,
    courseName: 'Sistem Informasi Manajemen',
    courseCode: 'SI4023',
    lecturerId: 4,
    lecturerName: 'Dr. Rina Anggraini, M.T.',
    day: 'thursday',
    startTime: '10:00',
    endTime: '11:40',
    roomId: 4,
    roomName: 'R. 3.2',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    section: 'A',
    studentCount: 26,
  },
];

// Fungsi untuk mendapatkan nama hari dalam bahasa Indonesia
const getDayName = (day: Schedule['day']): string => {
  const dayMap: Record<Schedule['day'], string> = {
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
    sunday: 'Minggu',
  };
  return dayMap[day];
};

// Form untuk menambah atau mengedit jadwal
const ScheduleForm = ({
  schedule,
  onSubmit,
  onCancel,
}: {
  schedule?: Schedule;
  onSubmit: (data: Partial<Schedule>) => void;
  onCancel: () => void;
}) => {
  const isEditing = !!schedule;
  const [formData, setFormData] = useState<Partial<Schedule>>(
    schedule || {
      courseId: 0,
      courseName: '',
      courseCode: '',
      lecturerId: 0,
      lecturerName: '',
      day: 'monday',
      startTime: '08:00',
      endTime: '09:40',
      roomId: 0,
      roomName: '',
      semester: 'Ganjil',
      academicYear: '2024/2025',
      section: 'A',
      studentCount: 0,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Courses dan Lecturers dan Rooms adalah data contoh
  const courses = [
    { id: 1, name: 'Algoritma dan Pemrograman', code: 'TI2044' },
    { id: 2, name: 'Struktur Data', code: 'TI3045' },
    { id: 3, name: 'Basis Data', code: 'SI2041' },
    { id: 4, name: 'Kecerdasan Buatan', code: 'TI4051' },
    { id: 5, name: 'Sistem Informasi Manajemen', code: 'SI4023' },
  ];

  const lecturers = [
    { id: 1, name: 'Dr. Budi Santoso, M.Kom.' },
    { id: 2, name: 'Prof. Siti Rahayu, Ph.D.' },
    { id: 3, name: 'Dr. Ahmad Wijaya, M.Sc.' },
    { id: 4, name: 'Dr. Rina Anggraini, M.T.' },
    { id: 5, name: 'Dr. Hendro Kusuma, M.Kom.' },
  ];

  const rooms = [
    { id: 1, name: 'R. 2.3' },
    { id: 2, name: 'Lab Database' },
    { id: 3, name: 'Lab AI' },
    { id: 4, name: 'R. 3.2' },
    { id: 5, name: 'R. 4.1' },
  ];

  const handleCourseChange = (courseId: string) => {
    const id = parseInt(courseId, 10);
    const selectedCourse = courses.find((course) => course.id === id);
    if (selectedCourse) {
      setFormData((prev) => ({
        ...prev,
        courseId: id,
        courseName: selectedCourse.name,
        courseCode: selectedCourse.code,
      }));
    }
  };

  const handleLecturerChange = (lecturerId: string) => {
    const id = parseInt(lecturerId, 10);
    const selectedLecturer = lecturers.find((lecturer) => lecturer.id === id);
    if (selectedLecturer) {
      setFormData((prev) => ({
        ...prev,
        lecturerId: id,
        lecturerName: selectedLecturer.name,
      }));
    }
  };

  const handleRoomChange = (roomId: string) => {
    const id = parseInt(roomId, 10);
    const selectedRoom = rooms.find((room) => room.id === id);
    if (selectedRoom) {
      setFormData((prev) => ({
        ...prev,
        roomId: id,
        roomName: selectedRoom.name,
      }));
    }
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="course">Mata Kuliah</Label>
        <Select
          value={formData.courseId?.toString()}
          onValueChange={handleCourseChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih mata kuliah" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.code} - {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lecturer">Dosen</Label>
        <Select
          value={formData.lecturerId?.toString()}
          onValueChange={handleLecturerChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih dosen" />
          </SelectTrigger>
          <SelectContent>
            {lecturers.map((lecturer) => (
              <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                {lecturer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="day">Hari</Label>
          <Select
            value={formData.day}
            onValueChange={(value) => handleSelectChange('day', value as Schedule['day'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih hari" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monday">Senin</SelectItem>
              <SelectItem value="tuesday">Selasa</SelectItem>
              <SelectItem value="wednesday">Rabu</SelectItem>
              <SelectItem value="thursday">Kamis</SelectItem>
              <SelectItem value="friday">Jumat</SelectItem>
              <SelectItem value="saturday">Sabtu</SelectItem>
              <SelectItem value="sunday">Minggu</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="room">Ruangan</Label>
          <Select
            value={formData.roomId?.toString()}
            onValueChange={handleRoomChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih ruangan" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id.toString()}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Waktu Mulai</Label>
          <Input
            id="startTime"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">Waktu Selesai</Label>
          <Input
            id="endTime"
            name="endTime"
            type="time"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="academicYear">Tahun Akademik</Label>
          <Select
            value={formData.academicYear}
            onValueChange={(value) => handleSelectChange('academicYear', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tahun akademik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024/2025">2024/2025</SelectItem>
              <SelectItem value="2023/2024">2023/2024</SelectItem>
              <SelectItem value="2022/2023">2022/2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Select
            value={formData.semester}
            onValueChange={(value) => handleSelectChange('semester', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ganjil">Ganjil</SelectItem>
              <SelectItem value="Genap">Genap</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="section">Kelas</Label>
          <Select
            value={formData.section}
            onValueChange={(value) => handleSelectChange('section', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="studentCount">Jumlah Mahasiswa</Label>
          <Input
            id="studentCount"
            name="studentCount"
            type="number"
            placeholder="Jumlah mahasiswa"
            value={formData.studentCount}
            onChange={handleChange}
            min={0}
          />
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          {isEditing ? 'Simpan Perubahan' : 'Tambah Jadwal'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default function SchedulesPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>(demoSchedules);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState('all');
  const [dayFilter, setDayFilter] = useState<Schedule['day'] | 'all'>('all');

  // Filter jadwal berdasarkan pencarian dan hari
  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.roomName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDay = dayFilter === 'all' || schedule.day === dayFilter;

    return matchesSearch && matchesDay;
  });

  // Sorting berdasarkan hari dan waktu
  filteredSchedules.sort((a, b) => {
    const dayOrder: Record<Schedule['day'], number> = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7,
    };

    if (dayOrder[a.day] !== dayOrder[b.day]) {
      return dayOrder[a.day] - dayOrder[b.day];
    }

    return a.startTime.localeCompare(b.startTime);
  });

  // Menambahkan jadwal baru
  const handleAddSchedule = (scheduleData: Partial<Schedule>) => {
    const newSchedule: Schedule = {
      id: schedules.length + 1,
      courseId: scheduleData.courseId || 0,
      courseName: scheduleData.courseName || '',
      courseCode: scheduleData.courseCode || '',
      lecturerId: scheduleData.lecturerId || 0,
      lecturerName: scheduleData.lecturerName || '',
      day: scheduleData.day || 'monday',
      startTime: scheduleData.startTime || '08:00',
      endTime: scheduleData.endTime || '09:40',
      roomId: scheduleData.roomId || 0,
      roomName: scheduleData.roomName || '',
      semester: scheduleData.semester || 'Ganjil',
      academicYear: scheduleData.academicYear || '2024/2025',
      section: scheduleData.section || 'A',
      studentCount: scheduleData.studentCount || 0,
    };

    setSchedules([...schedules, newSchedule]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Jadwal berhasil ditambahkan',
      description: `Jadwal untuk ${newSchedule.courseName} telah berhasil disimpan.`,
    });
  };

  // Mengedit jadwal
  const handleEditSchedule = (scheduleData: Partial<Schedule>) => {
    if (!editingSchedule) return;

    const updatedSchedules = schedules.map((schedule) =>
      schedule.id === editingSchedule.id ? { ...schedule, ...scheduleData } : schedule
    );

    setSchedules(updatedSchedules);
    setEditingSchedule(undefined);
    toast({
      title: 'Jadwal diperbarui',
      description: `Jadwal untuk ${scheduleData.courseName} telah berhasil diperbarui.`,
    });
  };

  // Menghapus jadwal
  const handleDeleteSchedule = (id: number) => {
    const updatedSchedules = schedules.filter((schedule) => schedule.id !== id);
    setSchedules(updatedSchedules);
    toast({
      title: 'Jadwal dihapus',
      description: 'Jadwal telah berhasil dihapus dari sistem.',
      variant: 'destructive',
    });
  };

  // Export jadwal (simulasi)
  const handleExportSchedules = () => {
    toast({
      title: 'Jadwal diekspor',
      description: 'File Excel berhasil diunduh.',
    });
  };

  // Generate jadwal otomatis (simulasi)
  const handleGenerateSchedules = () => {
    toast({
      title: 'Generate jadwal',
      description: 'Jadwal otomatis berhasil dibuat.',
    });
  };

  // Sinkronisasi data (simulasi)
  const handleSyncToPDDikti = () => {
    toast({
      title: 'Sinkronisasi ke PDDikti',
      description: 'Data jadwal berhasil disinkronkan dengan PDDikti.',
    });
  };

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Jadwal</h1>
            <p className="text-muted-foreground">
              Kelola jadwal perkuliahan, ruangan, dan waktu
            </p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setDayFilter('all')}>
                Semua Hari
              </TabsTrigger>
              <TabsTrigger value="monday" onClick={() => setDayFilter('monday')}>
                Senin
              </TabsTrigger>
              <TabsTrigger value="tuesday" onClick={() => setDayFilter('tuesday')}>
                Selasa
              </TabsTrigger>
              <TabsTrigger value="wednesday" onClick={() => setDayFilter('wednesday')}>
                Rabu
              </TabsTrigger>
              <TabsTrigger value="thursday" onClick={() => setDayFilter('thursday')}>
                Kamis
              </TabsTrigger>
              <TabsTrigger value="friday" onClick={() => setDayFilter('friday')}>
                Jumat
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
                    placeholder="Cari jadwal..."
                    className="w-[250px] pl-8 rounded-l-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" /> Tambah Jadwal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Tambah Jadwal Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan informasi untuk menambahkan jadwal perkuliahan baru.
                    </DialogDescription>
                  </DialogHeader>
                  <ScheduleForm
                    onSubmit={handleAddSchedule}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={!!editingSchedule} onOpenChange={(open) => !open && setEditingSchedule(undefined)}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Jadwal</DialogTitle>
                    <DialogDescription>
                      Perbarui informasi jadwal perkuliahan yang sudah ada.
                    </DialogDescription>
                  </DialogHeader>
                  {editingSchedule && (
                    <ScheduleForm
                      schedule={editingSchedule}
                      onSubmit={handleEditSchedule}
                      onCancel={() => setEditingSchedule(undefined)}
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
                  <DropdownMenuItem onClick={handleExportSchedules}>
                    <Download className="mr-2 h-4 w-4" /> Export Jadwal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGenerateSchedules}>
                    <CalendarDays className="mr-2 h-4 w-4" /> Generate Otomatis
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSyncToPDDikti}>
                    <Upload className="mr-2 h-4 w-4" /> Sinkronisasi PDDikti
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value={selectedTab} className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Hari</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Mata Kuliah</TableHead>
                      <TableHead>Dosen</TableHead>
                      <TableHead className="w-[100px]">Ruangan</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedules.length > 0 ? (
                      filteredSchedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">{getDayName(schedule.day)}</TableCell>
                          <TableCell>
                            {schedule.startTime} - {schedule.endTime}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{schedule.courseName}</div>
                              <div className="text-xs text-muted-foreground">{schedule.courseCode}</div>
                            </div>
                          </TableCell>
                          <TableCell>{schedule.lecturerName}</TableCell>
                          <TableCell>{schedule.roomName}</TableCell>
                          <TableCell>
                            <div>
                              <div>{schedule.section}</div>
                              <div className="text-xs text-muted-foreground">
                                {schedule.studentCount} mahasiswa
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
                                <DropdownMenuItem
                                  onClick={() => window.open(`/jadwal/${schedule.id}`, '_blank')}
                                >
                                  <Calendar className="mr-2 h-4 w-4" /> Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditingSchedule(schedule)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/jadwal/${schedule.id}/peserta`, '_blank')}
                                >
                                  <User className="mr-2 h-4 w-4" /> Lihat Peserta
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteSchedule(schedule.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          Tidak ada jadwal yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredSchedules.length} dari {schedules.length} jadwal
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