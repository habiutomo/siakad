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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  MoreHorizontal,
  Plus,
  Clock,
  Download,
  ChevronRight,
  Calendar,
  User,
  Edit,
  ClipboardList,
  CheckCircle,
  XCircle,
  UserCheck,
  Filter,
  ArrowUpDown,
  History,
  CheckCircle2,
  Upload,
  BookOpen,
  Trash2,
} from 'lucide-react';

// Interface untuk data kehadiran
interface AttendanceRecord {
  id: number;
  date: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  scheduleId: number;
  startTime: string;
  endTime: string;
  lecturerId: number;
  lecturerName: string;
  roomName: string;
  description?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  permissionCount: number;
}

// Data contoh untuk record kehadiran
const demoAttendanceRecords: AttendanceRecord[] = [
  {
    id: 1,
    date: '2024-04-15',
    courseId: 1,
    courseName: 'Algoritma dan Pemrograman',
    courseCode: 'TI2044',
    scheduleId: 1,
    startTime: '08:00',
    endTime: '09:40',
    lecturerId: 1,
    lecturerName: 'Dr. Budi Santoso, M.Kom.',
    roomName: 'R. 2.3',
    description: 'Pertemuan 1: Pengenalan Algoritma',
    status: 'completed',
    totalStudents: 35,
    presentCount: 32,
    absentCount: 1,
    lateCount: 2,
    permissionCount: 0,
  },
  {
    id: 2,
    date: '2024-04-22',
    courseId: 1,
    courseName: 'Algoritma dan Pemrograman',
    courseCode: 'TI2044',
    scheduleId: 1,
    startTime: '08:00',
    endTime: '09:40',
    lecturerId: 1,
    lecturerName: 'Dr. Budi Santoso, M.Kom.',
    roomName: 'R. 2.3',
    description: 'Pertemuan 2: Konsep Dasar Pemrograman',
    status: 'completed',
    totalStudents: 35,
    presentCount: 30,
    absentCount: 3,
    lateCount: 1,
    permissionCount: 1,
  },
  {
    id: 3,
    date: '2024-04-29',
    courseId: 1,
    courseName: 'Algoritma dan Pemrograman',
    courseCode: 'TI2044',
    scheduleId: 1,
    startTime: '08:00',
    endTime: '09:40',
    lecturerId: 1,
    lecturerName: 'Dr. Budi Santoso, M.Kom.',
    roomName: 'R. 2.3',
    description: 'Pertemuan 3: Struktur Kontrol',
    status: 'scheduled',
    totalStudents: 35,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    permissionCount: 0,
  },
  {
    id: 4,
    date: '2024-04-16',
    courseId: 2,
    courseName: 'Struktur Data',
    courseCode: 'TI3045',
    scheduleId: 2,
    startTime: '10:00',
    endTime: '11:40',
    lecturerId: 1,
    lecturerName: 'Dr. Budi Santoso, M.Kom.',
    roomName: 'R. 2.3',
    description: 'Pertemuan 1: Pengenalan Struktur Data',
    status: 'completed',
    totalStudents: 30,
    presentCount: 28,
    absentCount: 1,
    lateCount: 1,
    permissionCount: 0,
  },
  {
    id: 5,
    date: '2024-04-23',
    courseId: 2,
    courseName: 'Struktur Data',
    courseCode: 'TI3045',
    scheduleId: 2,
    startTime: '10:00',
    endTime: '11:40',
    lecturerId: 1,
    lecturerName: 'Dr. Budi Santoso, M.Kom.',
    roomName: 'R. 2.3',
    description: 'Pertemuan 2: Array dan Linked List',
    status: 'scheduled',
    totalStudents: 30,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    permissionCount: 0,
  },
];

// Interface untuk data kehadiran mahasiswa
interface StudentAttendance {
  id: number;
  recordId: number;
  studentId: number;
  studentName: string;
  nim: string;
  status: 'present' | 'absent' | 'late' | 'permission';
  entryTime?: string;
  note?: string;
}

// Data contoh untuk kehadiran mahasiswa
const demoStudentAttendances: StudentAttendance[] = [
  {
    id: 1,
    recordId: 1,
    studentId: 1,
    studentName: 'Ahmad Budi Cahyono',
    nim: '2020103001',
    status: 'present',
    entryTime: '07:55',
  },
  {
    id: 2,
    recordId: 1,
    studentId: 2,
    studentName: 'Siti Nurhayati',
    nim: '2020103002',
    status: 'present',
    entryTime: '07:58',
  },
  {
    id: 3,
    recordId: 1,
    studentId: 3,
    studentName: 'Rudi Hermawan',
    nim: '2020103003',
    status: 'late',
    entryTime: '08:10',
    note: 'Terlambat karena macet',
  },
  {
    id: 4,
    recordId: 1,
    studentId: 4,
    studentName: 'Diana Putri',
    nim: '2020103004',
    status: 'present',
    entryTime: '07:50',
  },
  {
    id: 5,
    recordId: 1,
    studentId: 5,
    studentName: 'Joko Susanto',
    nim: '2020103005',
    status: 'absent',
    note: 'Tanpa keterangan',
  },
];

// Komponen status attendance record
const StatusBadge = ({ status }: { status: AttendanceRecord['status'] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'scheduled':
        return 'Dijadwalkan';
      case 'ongoing':
        return 'Berlangsung';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusLabel()}
    </span>
  );
};

// Komponen status kehadiran mahasiswa
const AttendanceStatusBadge = ({ status }: { status: StudentAttendance['status'] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'permission':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'present':
        return 'Hadir';
      case 'absent':
        return 'Tidak Hadir';
      case 'late':
        return 'Terlambat';
      case 'permission':
        return 'Izin';
      default:
        return status;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 mr-1 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 mr-1 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 mr-1 text-yellow-600" />;
      case 'permission':
        return <UserCheck className="h-4 w-4 mr-1 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusIcon()}
      {getStatusLabel()}
    </div>
  );
};

// Form untuk menambah atau mengedit record kehadiran
const AttendanceRecordForm = ({
  record,
  onSubmit,
  onCancel,
}: {
  record?: AttendanceRecord;
  onSubmit: (data: Partial<AttendanceRecord>) => void;
  onCancel: () => void;
}) => {
  const isEditing = !!record;
  const [formData, setFormData] = useState<Partial<AttendanceRecord>>(
    record || {
      date: new Date().toISOString().split('T')[0],
      courseId: 0,
      courseName: '',
      courseCode: '',
      scheduleId: 0,
      startTime: '08:00',
      endTime: '09:40',
      lecturerId: 0,
      lecturerName: '',
      roomName: '',
      description: '',
      status: 'scheduled',
      totalStudents: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      permissionCount: 0,
    }
  );

  // Data contoh untuk dropdown
  const schedules = [
    { 
      id: 1, 
      courseId: 1, 
      courseName: 'Algoritma dan Pemrograman', 
      courseCode: 'TI2044',
      lecturerId: 1,
      lecturerName: 'Dr. Budi Santoso, M.Kom.',
      startTime: '08:00',
      endTime: '09:40',
      roomName: 'R. 2.3',
      totalStudents: 35,
    },
    { 
      id: 2, 
      courseId: 2, 
      courseName: 'Struktur Data', 
      courseCode: 'TI3045',
      lecturerId: 1,
      lecturerName: 'Dr. Budi Santoso, M.Kom.',
      startTime: '10:00',
      endTime: '11:40',
      roomName: 'R. 2.3',
      totalStudents: 30,
    },
    { 
      id: 3, 
      courseId: 3, 
      courseName: 'Basis Data', 
      courseCode: 'SI2041',
      lecturerId: 2,
      lecturerName: 'Prof. Siti Rahayu, Ph.D.',
      startTime: '13:00',
      endTime: '14:40',
      roomName: 'Lab Database',
      totalStudents: 28,
    },
  ];

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

  const handleScheduleChange = (scheduleId: string) => {
    const id = parseInt(scheduleId, 10);
    const selectedSchedule = schedules.find((schedule) => schedule.id === id);
    if (selectedSchedule) {
      setFormData((prev) => ({
        ...prev,
        scheduleId: id,
        courseId: selectedSchedule.courseId,
        courseName: selectedSchedule.courseName,
        courseCode: selectedSchedule.courseCode,
        lecturerId: selectedSchedule.lecturerId,
        lecturerName: selectedSchedule.lecturerName,
        startTime: selectedSchedule.startTime,
        endTime: selectedSchedule.endTime,
        roomName: selectedSchedule.roomName,
        totalStudents: selectedSchedule.totalStudents,
      }));
    }
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Tanggal</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="schedule">Jadwal Kuliah</Label>
          <Select
            value={formData.scheduleId?.toString()}
            onValueChange={handleScheduleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jadwal" />
            </SelectTrigger>
            <SelectContent>
              {schedules.map((schedule) => (
                <SelectItem key={schedule.id} value={schedule.id.toString()}>
                  {schedule.courseCode} - {schedule.courseName} ({schedule.startTime})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="course">Mata Kuliah</Label>
        <Input
          id="course"
          name="course"
          value={`${formData.courseCode || ''} - ${formData.courseName || ''}`}
          disabled
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lecturer">Dosen</Label>
          <Input
            id="lecturer"
            name="lecturer"
            value={formData.lecturerName || ''}
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="room">Ruangan</Label>
          <Input
            id="room"
            name="room"
            value={formData.roomName || ''}
            disabled
          />
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

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi/Materi</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Deskripsi pertemuan atau materi yang dibahas"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange('status', value as AttendanceRecord['status'])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Dijadwalkan</SelectItem>
            <SelectItem value="ongoing">Berlangsung</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          {isEditing ? 'Simpan Perubahan' : 'Tambah Record Kehadiran'}
        </Button>
      </DialogFooter>
    </div>
  );
};

// Form untuk mengisi kehadiran mahasiswa
const RecordAttendanceForm = ({
  recordId,
  students,
  onSubmit,
  onCancel,
}: {
  recordId: number;
  students: StudentAttendance[];
  onSubmit: (data: StudentAttendance[]) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<StudentAttendance[]>(students);

  const handleStatusChange = (id: number, status: StudentAttendance['status']) => {
    setFormData((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status, entryTime: status === 'present' ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : undefined } : student
      )
    );
  };

  const handleNoteChange = (id: number, note: string) => {
    setFormData((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, note } : student
      )
    );
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="border rounded overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">NIM</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Waktu Masuk</TableHead>
              <TableHead>Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formData.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.nim}</TableCell>
                <TableCell>{student.studentName}</TableCell>
                <TableCell>
                  <Select
                    value={student.status}
                    onValueChange={(value) => handleStatusChange(student.id, value as StudentAttendance['status'])}
                  >
                    <SelectTrigger className="w-[120px] mx-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Hadir</SelectItem>
                      <SelectItem value="absent">Tidak Hadir</SelectItem>
                      <SelectItem value="late">Terlambat</SelectItem>
                      <SelectItem value="permission">Izin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {(student.status === 'present' || student.status === 'late') && (
                    <Input
                      type="time"
                      value={student.entryTime}
                      onChange={(e) => {
                        setFormData((prev) =>
                          prev.map((s) =>
                            s.id === student.id ? { ...s, entryTime: e.target.value } : s
                          )
                        );
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Catatan (opsional)"
                    value={student.note || ''}
                    onChange={(e) => handleNoteChange(student.id, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          Simpan Kehadiran
        </Button>
      </DialogFooter>
    </div>
  );
};

// Komponen untuk menampilkan detail kehadiran mahasiswa dalam dialog
const StudentAttendanceList = ({
  recordId,
  onClose,
}: {
  recordId: number;
  onClose: () => void;
}) => {
  // Filter kehadiran mahasiswa berdasarkan recordId
  const attendances = demoStudentAttendances.filter(
    (attendance) => attendance.recordId === recordId
  );

  const record = demoAttendanceRecords.find((record) => record.id === recordId);

  return (
    <div className="space-y-4 py-2 pb-4">
      {record && (
        <div className="bg-muted rounded-md p-4 mb-4">
          <h3 className="font-medium mb-2">{record.courseName} ({record.courseCode})</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Tanggal:</div>
              <div>{new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Waktu:</div>
              <div>{record.startTime} - {record.endTime}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Dosen:</div>
              <div>{record.lecturerName}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Ruangan:</div>
              <div>{record.roomName}</div>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">NIM</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Waktu Masuk</TableHead>
              <TableHead>Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendances.map((attendance) => (
              <TableRow key={attendance.id}>
                <TableCell className="font-medium">{attendance.nim}</TableCell>
                <TableCell>{attendance.studentName}</TableCell>
                <TableCell className="text-center">
                  <AttendanceStatusBadge status={attendance.status} />
                </TableCell>
                <TableCell>{attendance.entryTime || '-'}</TableCell>
                <TableCell>{attendance.note || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between mt-4">
        <div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span>Hadir: {attendances.filter((a) => a.status === 'present').length}</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              <span>Tidak Hadir: {attendances.filter((a) => a.status === 'absent').length}</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>Terlambat: {attendances.filter((a) => a.status === 'late').length}</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Izin: {attendances.filter((a) => a.status === 'permission').length}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </div>
  );
};

export default function AttendancePage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<AttendanceRecord[]>(demoAttendanceRecords);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | undefined>(undefined);
  const [viewingRecordId, setViewingRecordId] = useState<number | null>(null);
  const [recordingAttendanceId, setRecordingAttendanceId] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState<AttendanceRecord['status'] | 'all'>('all');

  // Filter record kehadiran berdasarkan pencarian dan status
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.description && record.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Menambahkan record kehadiran
  const handleAddRecord = (recordData: Partial<AttendanceRecord>) => {
    const newRecord: AttendanceRecord = {
      id: records.length + 1,
      date: recordData.date || new Date().toISOString().split('T')[0],
      courseId: recordData.courseId || 0,
      courseName: recordData.courseName || '',
      courseCode: recordData.courseCode || '',
      scheduleId: recordData.scheduleId || 0,
      startTime: recordData.startTime || '',
      endTime: recordData.endTime || '',
      lecturerId: recordData.lecturerId || 0,
      lecturerName: recordData.lecturerName || '',
      roomName: recordData.roomName || '',
      description: recordData.description,
      status: recordData.status || 'scheduled',
      totalStudents: recordData.totalStudents || 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      permissionCount: 0,
    };

    setRecords([...records, newRecord]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Record kehadiran berhasil ditambahkan',
      description: `Record untuk ${newRecord.courseName} pada tanggal ${new Date(newRecord.date).toLocaleDateString()} telah berhasil disimpan.`,
    });
  };

  // Mengedit record kehadiran
  const handleEditRecord = (recordData: Partial<AttendanceRecord>) => {
    if (!editingRecord) return;

    const updatedRecords = records.map((record) =>
      record.id === editingRecord.id ? { ...record, ...recordData } : record
    );

    setRecords(updatedRecords);
    setEditingRecord(undefined);
    toast({
      title: 'Record kehadiran diperbarui',
      description: `Record untuk ${recordData.courseName} pada tanggal ${new Date(recordData.date || '').toLocaleDateString()} telah berhasil diperbarui.`,
    });
  };

  // Menghapus record kehadiran
  const handleDeleteRecord = (id: number) => {
    const recordToDelete = records.find(record => record.id === id);
    const updatedRecords = records.filter((record) => record.id !== id);
    setRecords(updatedRecords);
    toast({
      title: 'Record kehadiran dihapus',
      description: `Record untuk ${recordToDelete?.courseName} pada tanggal ${new Date(recordToDelete?.date || '').toLocaleDateString()} telah berhasil dihapus.`,
      variant: 'destructive',
    });
  };

  // Menyimpan kehadiran mahasiswa
  const handleSaveAttendance = (studentAttendances: StudentAttendance[]) => {
    if (!recordingAttendanceId) return;

    // Menghitung jumlah kehadiran berdasarkan status
    const presentCount = studentAttendances.filter((a) => a.status === 'present').length;
    const absentCount = studentAttendances.filter((a) => a.status === 'absent').length;
    const lateCount = studentAttendances.filter((a) => a.status === 'late').length;
    const permissionCount = studentAttendances.filter((a) => a.status === 'permission').length;

    // Update status record dan jumlah kehadiran
    const updatedRecords = records.map((record) =>
      record.id === recordingAttendanceId
        ? {
            ...record,
            status: 'completed',
            presentCount,
            absentCount,
            lateCount,
            permissionCount,
          }
        : record
    );

    setRecords(updatedRecords);
    setRecordingAttendanceId(null);
    toast({
      title: 'Kehadiran berhasil disimpan',
      description: `Data kehadiran mahasiswa telah berhasil disimpan.`,
    });
  };

  // Export kehadiran (simulasi)
  const handleExportAttendance = () => {
    toast({
      title: 'Data kehadiran diekspor',
      description: 'File Excel berhasil diunduh.',
    });
  };

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Kehadiran</h1>
            <p className="text-muted-foreground">
              Kelola kehadiran mahasiswa dan dosen
            </p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>
                Semua Status
              </TabsTrigger>
              <TabsTrigger value="scheduled" onClick={() => setStatusFilter('scheduled')}>
                Dijadwalkan
              </TabsTrigger>
              <TabsTrigger value="ongoing" onClick={() => setStatusFilter('ongoing')}>
                Berlangsung
              </TabsTrigger>
              <TabsTrigger value="completed" onClick={() => setStatusFilter('completed')}>
                Selesai
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
                    placeholder="Cari kehadiran..."
                    className="w-[250px] pl-8 rounded-l-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" /> Tambah Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Tambah Record Kehadiran</DialogTitle>
                    <DialogDescription>
                      Masukkan informasi untuk menambahkan record kehadiran baru.
                    </DialogDescription>
                  </DialogHeader>
                  <AttendanceRecordForm
                    onSubmit={handleAddRecord}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(undefined)}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Record Kehadiran</DialogTitle>
                    <DialogDescription>
                      Perbarui informasi record kehadiran.
                    </DialogDescription>
                  </DialogHeader>
                  {editingRecord && (
                    <AttendanceRecordForm
                      record={editingRecord}
                      onSubmit={handleEditRecord}
                      onCancel={() => setEditingRecord(undefined)}
                    />
                  )}
                </DialogContent>
              </Dialog>

              <Dialog open={viewingRecordId !== null} onOpenChange={(open) => !open && setViewingRecordId(null)}>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Detail Kehadiran Mahasiswa</DialogTitle>
                    <DialogDescription>
                      Informasi kehadiran mahasiswa untuk pertemuan ini.
                    </DialogDescription>
                  </DialogHeader>
                  {viewingRecordId !== null && (
                    <StudentAttendanceList
                      recordId={viewingRecordId}
                      onClose={() => setViewingRecordId(null)}
                    />
                  )}
                </DialogContent>
              </Dialog>

              <Dialog
                open={recordingAttendanceId !== null}
                onOpenChange={(open) => !open && setRecordingAttendanceId(null)}
              >
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Isi Kehadiran Mahasiswa</DialogTitle>
                    <DialogDescription>
                      Masukkan status kehadiran untuk setiap mahasiswa.
                    </DialogDescription>
                  </DialogHeader>
                  {recordingAttendanceId !== null && (
                    <RecordAttendanceForm
                      recordId={recordingAttendanceId}
                      students={demoStudentAttendances.filter(
                        (attendance) => attendance.recordId === 1
                      )} // Menggunakan data contoh
                      onSubmit={handleSaveAttendance}
                      onCancel={() => setRecordingAttendanceId(null)}
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
                  <DropdownMenuItem onClick={handleExportAttendance}>
                    <Download className="mr-2 h-4 w-4" /> Export Kehadiran
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open('/laporan-kehadiran', '_blank')}>
                    <ClipboardList className="mr-2 h-4 w-4" /> Laporan Kehadiran
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
                      <TableHead className="w-[120px]">Tanggal</TableHead>
                      <TableHead>Mata Kuliah</TableHead>
                      <TableHead>Dosen</TableHead>
                      <TableHead className="w-[120px] text-center">Waktu</TableHead>
                      <TableHead className="w-[100px] text-center">Ruangan</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Kehadiran</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {new Date(record.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{record.courseName}</div>
                              <div className="text-xs text-muted-foreground">{record.courseCode}</div>
                            </div>
                          </TableCell>
                          <TableCell>{record.lecturerName}</TableCell>
                          <TableCell className="text-center">
                            {record.startTime} - {record.endTime}
                          </TableCell>
                          <TableCell className="text-center">{record.roomName}</TableCell>
                          <TableCell className="text-center">
                            <StatusBadge status={record.status} />
                          </TableCell>
                          <TableCell>
                            {record.status === 'completed' ? (
                              <div className="flex items-center justify-center gap-2 text-xs">
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                                  <span>{record.presentCount}</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                                  <span>{record.absentCount}</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                                  <span>{record.lateCount}</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                                  <span>{record.permissionCount}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-muted-foreground text-xs">
                                -
                              </div>
                            )}
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
                                {record.status === 'scheduled' && (
                                  <DropdownMenuItem onClick={() => setRecordingAttendanceId(record.id)}>
                                    <UserCheck className="mr-2 h-4 w-4" /> Isi Kehadiran
                                  </DropdownMenuItem>
                                )}
                                {record.status === 'completed' && (
                                  <DropdownMenuItem onClick={() => setViewingRecordId(record.id)}>
                                    <ClipboardList className="mr-2 h-4 w-4" /> Lihat Detail
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => setEditingRecord(record)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/kehadiran/${record.id}/mahasiswa`, '_blank')}
                                >
                                  <User className="mr-2 h-4 w-4" /> Data Mahasiswa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/kehadiran/${record.id}/summary`, '_blank')}
                                >
                                  <BookOpen className="mr-2 h-4 w-4" /> Ringkasan Materi
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteRecord(record.id)}
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
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          Tidak ada record kehadiran yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredRecords.length} dari {records.length} record kehadiran
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