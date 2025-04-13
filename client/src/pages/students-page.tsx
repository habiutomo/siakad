import React, { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  Download, 
  Upload, 
  Trash2,
  Pencil,
  User,
  FileText,
  Check,
  Filter
} from 'lucide-react';

// Interface untuk data mahasiswa
interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  studyProgram: string;
  semester: number;
  status: 'active' | 'inactive' | 'graduate' | 'leave';
  photoUrl?: string;
}

// Data contoh untuk mahasiswa
const demoStudents: Student[] = [
  {
    id: 1,
    studentId: '20210001',
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    studyProgram: 'Teknik Informatika',
    semester: 4,
    status: 'active',
  },
  {
    id: 2,
    studentId: '20210002',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@example.com',
    studyProgram: 'Sistem Informasi',
    semester: 4,
    status: 'active',
  },
  {
    id: 3,
    studentId: '20210003',
    name: 'Ahmad Rasyid',
    email: 'ahmad.rasyid@example.com',
    studyProgram: 'Teknik Komputer',
    semester: 4,
    status: 'inactive',
  },
  {
    id: 4,
    studentId: '20190004',
    name: 'Putri Anggraini',
    email: 'putri.anggraini@example.com',
    studyProgram: 'Teknik Informatika',
    semester: 8,
    status: 'graduate',
  },
  {
    id: 5,
    studentId: '20210005',
    name: 'Rudi Hermawan',
    email: 'rudi.hermawan@example.com',
    studyProgram: 'Manajemen Informatika',
    semester: 4,
    status: 'active',
  },
];

// Komponen status badge
const StatusBadge = ({ status }: { status: Student['status'] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'graduate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'leave':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Non-aktif';
      case 'graduate':
        return 'Lulus';
      case 'leave':
        return 'Cuti';
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

// Form untuk menambah atau mengedit mahasiswa
const StudentForm = ({
  student,
  onSubmit,
  onCancel,
}: {
  student?: Student;
  onSubmit: (data: Partial<Student>) => void;
  onCancel: () => void;
}) => {
  const isEditing = !!student;
  const [formData, setFormData] = useState<Partial<Student>>(
    student || {
      studentId: '',
      name: '',
      email: '',
      studyProgram: '',
      semester: 1,
      status: 'active',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value, 10) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="studentId">NIM</Label>
        <Input
          id="studentId"
          name="studentId"
          placeholder="Masukkan NIM mahasiswa"
          value={formData.studentId}
          onChange={handleChange}
          disabled={isEditing}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          name="name"
          placeholder="Masukkan nama lengkap mahasiswa"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Masukkan email mahasiswa"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="studyProgram">Program Studi</Label>
        <Select
          value={formData.studyProgram}
          onValueChange={(value) => handleSelectChange('studyProgram', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih program studi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Teknik Informatika">Teknik Informatika</SelectItem>
            <SelectItem value="Sistem Informasi">Sistem Informasi</SelectItem>
            <SelectItem value="Teknik Komputer">Teknik Komputer</SelectItem>
            <SelectItem value="Manajemen Informatika">Manajemen Informatika</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Input
            id="semester"
            name="semester"
            type="number"
            min={1}
            max={14}
            placeholder="Semester"
            value={formData.semester}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => 
              handleSelectChange('status', value as 'active' | 'inactive' | 'graduate' | 'leave')
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Non-aktif</SelectItem>
              <SelectItem value="graduate">Lulus</SelectItem>
              <SelectItem value="leave">Cuti</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          {isEditing ? 'Simpan Perubahan' : 'Tambah Mahasiswa'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default function StudentsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>(demoStudents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState<Student['status'] | 'all'>('all');

  // Filter mahasiswa berdasarkan pencarian dan status
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studyProgram.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Menambahkan mahasiswa baru
  const handleAddStudent = (studentData: Partial<Student>) => {
    const newStudent: Student = {
      id: students.length + 1,
      studentId: studentData.studentId || '',
      name: studentData.name || '',
      email: studentData.email || '',
      studyProgram: studentData.studyProgram || '',
      semester: studentData.semester || 1,
      status: studentData.status || 'active',
    };

    setStudents([...students, newStudent]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Mahasiswa berhasil ditambahkan',
      description: `Data untuk ${newStudent.name} telah berhasil disimpan.`,
    });
  };

  // Mengedit mahasiswa
  const handleEditStudent = (studentData: Partial<Student>) => {
    if (!editingStudent) return;

    const updatedStudents = students.map((student) =>
      student.id === editingStudent.id ? { ...student, ...studentData } : student
    );

    setStudents(updatedStudents);
    setEditingStudent(undefined);
    toast({
      title: 'Data mahasiswa diperbarui',
      description: `Data untuk ${studentData.name} telah berhasil diperbarui.`,
    });
  };

  // Menghapus mahasiswa
  const handleDeleteStudent = (id: number) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
    toast({
      title: 'Mahasiswa dihapus',
      description: 'Data mahasiswa telah berhasil dihapus dari sistem.',
      variant: 'destructive',
    });
  };

  // Export data (simulasi)
  const handleExportData = () => {
    toast({
      title: 'Data mahasiswa diekspor',
      description: 'File Excel berhasil diunduh.',
    });
  };

  // Import data (simulasi)
  const handleImportData = () => {
    toast({
      title: 'Data mahasiswa diimpor',
      description: 'Data berhasil diimpor ke sistem.',
    });
  };

  // Sinkronisasi data ke PDDikti (simulasi)
  const handleSyncToPDDikti = () => {
    toast({
      title: 'Sinkronisasi ke PDDikti',
      description: 'Data mahasiswa berhasil disinkronkan dengan PDDikti.',
    });
  };

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Mahasiswa</h1>
            <p className="text-muted-foreground">
              Kelola data mahasiswa, aktifitas akademik, dan informasi pribadi
            </p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>
                Semua Mahasiswa
              </TabsTrigger>
              <TabsTrigger value="active" onClick={() => setStatusFilter('active')}>
                Aktif
              </TabsTrigger>
              <TabsTrigger value="inactive" onClick={() => setStatusFilter('inactive')}>
                Non-aktif
              </TabsTrigger>
              <TabsTrigger value="graduate" onClick={() => setStatusFilter('graduate')}>
                Lulus
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
                    placeholder="Cari mahasiswa..."
                    className="w-[250px] pl-8 rounded-l-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" /> Tambah Mahasiswa
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Tambah Mahasiswa Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan informasi untuk menambahkan mahasiswa baru ke sistem.
                    </DialogDescription>
                  </DialogHeader>
                  <StudentForm
                    onSubmit={handleAddStudent}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(undefined)}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Data Mahasiswa</DialogTitle>
                    <DialogDescription>
                      Perbarui informasi data mahasiswa yang sudah ada.
                    </DialogDescription>
                  </DialogHeader>
                  {editingStudent && (
                    <StudentForm
                      student={editingStudent}
                      onSubmit={handleEditStudent}
                      onCancel={() => setEditingStudent(undefined)}
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
                  <DropdownMenuItem onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" /> Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleImportData}>
                    <Upload className="mr-2 h-4 w-4" /> Import Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSyncToPDDikti}>
                    <Check className="mr-2 h-4 w-4" /> Sinkronisasi PDDikti
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">NIM</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Program Studi</TableHead>
                      <TableHead className="w-[100px]">Semester</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.studentId}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.studyProgram}</TableCell>
                          <TableCell>{student.semester}</TableCell>
                          <TableCell>
                            <StatusBadge status={student.status} />
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
                                  onClick={() => window.open(`/mahasiswa/${student.id}`, '_blank')}
                                >
                                  <User className="mr-2 h-4 w-4" /> Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditingStudent(student)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/mahasiswa/${student.id}/nilai`, '_blank')}
                                >
                                  <FileText className="mr-2 h-4 w-4" /> Lihat Nilai
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteStudent(student.id)}
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
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Tidak ada data mahasiswa yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredStudents.length} dari {students.length} mahasiswa
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

          <TabsContent value="active" className="mt-0">
            {/* Content sama dengan tab "all" tetapi sudah difilter oleh statusFilter */}
          </TabsContent>

          <TabsContent value="inactive" className="mt-0">
            {/* Content sama dengan tab "all" tetapi sudah difilter oleh statusFilter */}
          </TabsContent>

          <TabsContent value="graduate" className="mt-0">
            {/* Content sama dengan tab "all" tetapi sudah difilter oleh statusFilter */}
          </TabsContent>
        </Tabs>
      </div>
    </LayoutWithSidebar>
  );
}