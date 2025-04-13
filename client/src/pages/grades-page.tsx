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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  Download, 
  Upload, 
  Trash2,
  Pencil,
  ClipboardList,
  FileText,
  User,
  BookOpen,
  ArrowUpDown,
  Filter,
  History,
  Check
} from 'lucide-react';

// Interface untuk data nilai
interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  nim: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  semester: string;
  academicYear: string;
  assignment: number;
  midExam: number;
  finalExam: number;
  practicum?: number;
  finalGrade: number;
  gradeValue: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'E';
  status: 'passed' | 'failed' | 'incomplete';
  lecturer: string;
  updatedAt: string;
}

// Data contoh untuk nilai
const demoGrades: Grade[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Ahmad Budi Cahyono',
    nim: '2020103001',
    courseId: 1,
    courseName: 'Algoritma dan Pemrograman',
    courseCode: 'TI2044',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    assignment: 85,
    midExam: 78,
    finalExam: 88,
    practicum: 90,
    finalGrade: 85.1,
    gradeValue: 'A',
    status: 'passed',
    lecturer: 'Dr. Budi Santoso, M.Kom.',
    updatedAt: '2024-04-01',
  },
  {
    id: 2,
    studentId: 1,
    studentName: 'Ahmad Budi Cahyono',
    nim: '2020103001',
    courseId: 2,
    courseName: 'Struktur Data',
    courseCode: 'TI3045',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    assignment: 75,
    midExam: 72,
    finalExam: 76,
    practicum: 80,
    finalGrade: 75.6,
    gradeValue: 'B+',
    status: 'passed',
    lecturer: 'Dr. Budi Santoso, M.Kom.',
    updatedAt: '2024-04-02',
  },
  {
    id: 3,
    studentId: 2,
    studentName: 'Siti Nurhayati',
    nim: '2020103002',
    courseId: 1,
    courseName: 'Algoritma dan Pemrograman',
    courseCode: 'TI2044',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    assignment: 92,
    midExam: 88,
    finalExam: 95,
    practicum: 92,
    finalGrade: 91.8,
    gradeValue: 'A',
    status: 'passed',
    lecturer: 'Dr. Budi Santoso, M.Kom.',
    updatedAt: '2024-04-01',
  },
  {
    id: 4,
    studentId: 3,
    studentName: 'Rudi Hermawan',
    nim: '2020103003',
    courseId: 2,
    courseName: 'Struktur Data',
    courseCode: 'TI3045',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    assignment: 65,
    midExam: 58,
    finalExam: 45,
    practicum: 70,
    finalGrade: 58.1,
    gradeValue: 'D',
    status: 'failed',
    lecturer: 'Dr. Budi Santoso, M.Kom.',
    updatedAt: '2024-04-02',
  },
  {
    id: 5,
    studentId: 4,
    studentName: 'Diana Putri',
    nim: '2020103004',
    courseId: 3,
    courseName: 'Basis Data',
    courseCode: 'SI2041',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    assignment: 82,
    midExam: 75,
    finalExam: 80,
    practicum: 85,
    finalGrade: 80.3,
    gradeValue: 'A-',
    status: 'passed',
    lecturer: 'Prof. Siti Rahayu, Ph.D.',
    updatedAt: '2024-04-03',
  },
];

// Komponen badge untuk nilai
const GradeBadge = ({ gradeValue }: { gradeValue: Grade['gradeValue'] }) => {
  const getGradeStyles = () => {
    switch (gradeValue) {
      case 'A':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'A-':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'B+':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'B':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'B-':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'C+':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'C':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'D':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'E':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeStyles()}`}>
      {gradeValue}
    </span>
  );
};

// Komponen badge untuk status kelulusan
const StatusBadge = ({ status }: { status: Grade['status'] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'passed':
        return 'Lulus';
      case 'failed':
        return 'Tidak Lulus';
      case 'incomplete':
        return 'Belum Lengkap';
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

// Form untuk menambah atau mengedit nilai
const GradeForm = ({
  grade,
  onSubmit,
  onCancel,
}: {
  grade?: Grade;
  onSubmit: (data: Partial<Grade>) => void;
  onCancel: () => void;
}) => {
  const isEditing = !!grade;
  const [formData, setFormData] = useState<Partial<Grade>>(
    grade || {
      studentId: 0,
      studentName: '',
      nim: '',
      courseId: 0,
      courseName: '',
      courseCode: '',
      semester: 'Ganjil',
      academicYear: '2024/2025',
      assignment: 0,
      midExam: 0,
      finalExam: 0,
      practicum: 0,
      finalGrade: 0,
      gradeValue: 'E',
      status: 'incomplete',
      lecturer: '',
      updatedAt: new Date().toISOString().split('T')[0],
    }
  );

  // Data contoh untuk dropdown
  const students = [
    { id: 1, name: 'Ahmad Budi Cahyono', nim: '2020103001' },
    { id: 2, name: 'Siti Nurhayati', nim: '2020103002' },
    { id: 3, name: 'Rudi Hermawan', nim: '2020103003' },
    { id: 4, name: 'Diana Putri', nim: '2020103004' },
    { id: 5, name: 'Joko Susanto', nim: '2020103005' },
  ];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;
    
    // Parse nilai numerik
    if (['assignment', 'midExam', 'finalExam', 'practicum'].includes(name)) {
      parsedValue = parseFloat(value);
      // Batasi nilai antara 0-100
      if (parsedValue < 0) parsedValue = 0;
      if (parsedValue > 100) parsedValue = 100;
    }
    
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: parsedValue,
      };
      
      // Kalkulasi nilai akhir
      if (['assignment', 'midExam', 'finalExam', 'practicum'].includes(name)) {
        const assignment = updatedData.assignment || 0;
        const midExam = updatedData.midExam || 0;
        const finalExam = updatedData.finalExam || 0;
        const practicum = updatedData.practicum || 0;
        
        // Bobot: tugas 20%, UTS 30%, UAS 40%, praktikum 10%
        const finalGrade = (
          (assignment * 0.2) +
          (midExam * 0.3) +
          (finalExam * 0.4) +
          (practicum * 0.1)
        );
        
        updatedData.finalGrade = parseFloat(finalGrade.toFixed(1));
        
        // Tentukan nilai huruf
        let gradeValue: Grade['gradeValue'] = 'E';
        if (finalGrade >= 90) gradeValue = 'A';
        else if (finalGrade >= 85) gradeValue = 'A-';
        else if (finalGrade >= 80) gradeValue = 'B+';
        else if (finalGrade >= 75) gradeValue = 'B';
        else if (finalGrade >= 70) gradeValue = 'B-';
        else if (finalGrade >= 65) gradeValue = 'C+';
        else if (finalGrade >= 60) gradeValue = 'C';
        else if (finalGrade >= 50) gradeValue = 'D';
        else gradeValue = 'E';
        
        updatedData.gradeValue = gradeValue;
        
        // Tentukan status kelulusan
        let status: Grade['status'] = 'failed';
        if (['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'].includes(gradeValue)) {
          status = 'passed';
        } else {
          status = 'failed';
        }
        updatedData.status = status;
      }
      
      return updatedData;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentChange = (studentId: string) => {
    const id = parseInt(studentId, 10);
    const selectedStudent = students.find((student) => student.id === id);
    if (selectedStudent) {
      setFormData((prev) => ({
        ...prev,
        studentId: id,
        studentName: selectedStudent.name,
        nim: selectedStudent.nim,
      }));
    }
  };

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

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="student">Mahasiswa</Label>
        <Select
          value={formData.studentId?.toString()}
          onValueChange={handleStudentChange}
          disabled={isEditing}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih mahasiswa" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id.toString()}>
                {student.nim} - {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="course">Mata Kuliah</Label>
        <Select
          value={formData.courseId?.toString()}
          onValueChange={handleCourseChange}
          disabled={isEditing}
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
      
      <div className="space-y-2">
        <Label htmlFor="lecturer">Dosen Pengajar</Label>
        <Select
          value={formData.lecturer}
          onValueChange={(value) => handleSelectChange('lecturer', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih dosen pengajar" />
          </SelectTrigger>
          <SelectContent>
            {lecturers.map((lecturer) => (
              <SelectItem key={lecturer.id} value={lecturer.name}>
                {lecturer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assignment">Nilai Tugas (20%)</Label>
          <Input
            id="assignment"
            name="assignment"
            type="number"
            min={0}
            max={100}
            placeholder="0-100"
            value={formData.assignment}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="midExam">Nilai UTS (30%)</Label>
          <Input
            id="midExam"
            name="midExam"
            type="number"
            min={0}
            max={100}
            placeholder="0-100"
            value={formData.midExam}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="finalExam">Nilai UAS (40%)</Label>
          <Input
            id="finalExam"
            name="finalExam"
            type="number"
            min={0}
            max={100}
            placeholder="0-100"
            value={formData.finalExam}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="practicum">Nilai Praktikum (10%)</Label>
          <Input
            id="practicum"
            name="practicum"
            type="number"
            min={0}
            max={100}
            placeholder="0-100"
            value={formData.practicum}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="border rounded p-3 text-center">
          <div className="text-sm text-muted-foreground">Nilai Akhir</div>
          <div className="text-xl font-semibold mt-1">{formData.finalGrade?.toFixed(1)}</div>
        </div>
        <div className="border rounded p-3 text-center">
          <div className="text-sm text-muted-foreground">Nilai Huruf</div>
          <div className="text-xl font-semibold mt-1">{formData.gradeValue}</div>
        </div>
        <div className="border rounded p-3 text-center">
          <div className="text-sm text-muted-foreground">Status</div>
          <div className="text-xl font-semibold mt-1">
            {formData.status === 'passed' ? 'Lulus' : 'Tidak Lulus'}
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          {isEditing ? 'Simpan Perubahan' : 'Tambah Nilai'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default function GradesPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [grades, setGrades] = useState<Grade[]>(demoGrades);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');

  // Filter nilai berdasarkan pencarian dan filter
  const filteredGrades = grades.filter((grade) => {
    const matchesSearch =
      grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.courseCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = filterCourse === 'all' || grade.courseCode === filterCourse;

    return matchesSearch && matchesCourse;
  });

  // Menambahkan data nilai
  const handleAddGrade = (gradeData: Partial<Grade>) => {
    const newGrade: Grade = {
      id: grades.length + 1,
      studentId: gradeData.studentId || 0,
      studentName: gradeData.studentName || '',
      nim: gradeData.nim || '',
      courseId: gradeData.courseId || 0,
      courseName: gradeData.courseName || '',
      courseCode: gradeData.courseCode || '',
      semester: gradeData.semester || 'Ganjil',
      academicYear: gradeData.academicYear || '2024/2025',
      assignment: gradeData.assignment || 0,
      midExam: gradeData.midExam || 0,
      finalExam: gradeData.finalExam || 0,
      practicum: gradeData.practicum,
      finalGrade: gradeData.finalGrade || 0,
      gradeValue: gradeData.gradeValue || 'E',
      status: gradeData.status || 'incomplete',
      lecturer: gradeData.lecturer || '',
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setGrades([...grades, newGrade]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Nilai berhasil ditambahkan',
      description: `Nilai untuk ${newGrade.studentName} pada mata kuliah ${newGrade.courseName} telah berhasil disimpan.`,
    });
  };

  // Mengedit data nilai
  const handleEditGrade = (gradeData: Partial<Grade>) => {
    if (!editingGrade) return;

    const updatedGrades = grades.map((grade) =>
      grade.id === editingGrade.id ? { 
        ...grade, 
        ...gradeData,
        updatedAt: new Date().toISOString().split('T')[0]
      } : grade
    );

    setGrades(updatedGrades);
    setEditingGrade(undefined);
    toast({
      title: 'Nilai diperbarui',
      description: `Nilai untuk ${gradeData.studentName} pada mata kuliah ${gradeData.courseName} telah berhasil diperbarui.`,
    });
  };

  // Menghapus data nilai
  const handleDeleteGrade = (id: number) => {
    const gradeToDelete = grades.find(grade => grade.id === id);
    const updatedGrades = grades.filter((grade) => grade.id !== id);
    setGrades(updatedGrades);
    toast({
      title: 'Nilai dihapus',
      description: `Nilai untuk ${gradeToDelete?.studentName} pada mata kuliah ${gradeToDelete?.courseName} telah berhasil dihapus.`,
      variant: 'destructive',
    });
  };

  // Export nilai (simulasi)
  const handleExportGrades = () => {
    toast({
      title: 'Nilai diekspor',
      description: 'File Excel berhasil diunduh.',
    });
  };

  // Import nilai (simulasi)
  const handleImportGrades = () => {
    toast({
      title: 'Nilai diimpor',
      description: 'Data nilai berhasil diimpor ke sistem.',
    });
  };

  // Sinkronisasi data ke PDDikti (simulasi)
  const handleSyncToPDDikti = () => {
    toast({
      title: 'Sinkronisasi ke PDDikti',
      description: 'Data nilai berhasil disinkronkan dengan PDDikti.',
    });
  };

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Nilai</h1>
            <p className="text-muted-foreground">
              Kelola nilai mahasiswa, transkrip, dan konversi nilai
            </p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setFilterCourse('all')}>
                Semua Mata Kuliah
              </TabsTrigger>
              <TabsTrigger value="ti2044" onClick={() => setFilterCourse('TI2044')}>
                Algoritma & Pemrograman
              </TabsTrigger>
              <TabsTrigger value="ti3045" onClick={() => setFilterCourse('TI3045')}>
                Struktur Data
              </TabsTrigger>
              <TabsTrigger value="si2041" onClick={() => setFilterCourse('SI2041')}>
                Basis Data
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
                    placeholder="Cari nilai..."
                    className="w-[250px] pl-8 rounded-l-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" /> Tambah Nilai
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Tambah Nilai Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan informasi untuk menambahkan nilai mahasiswa.
                    </DialogDescription>
                  </DialogHeader>
                  <GradeForm
                    onSubmit={handleAddGrade}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={!!editingGrade} onOpenChange={(open) => !open && setEditingGrade(undefined)}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Nilai</DialogTitle>
                    <DialogDescription>
                      Perbarui informasi nilai mahasiswa.
                    </DialogDescription>
                  </DialogHeader>
                  {editingGrade && (
                    <GradeForm
                      grade={editingGrade}
                      onSubmit={handleEditGrade}
                      onCancel={() => setEditingGrade(undefined)}
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
                  <DropdownMenuItem onClick={handleExportGrades}>
                    <Download className="mr-2 h-4 w-4" /> Export Nilai
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleImportGrades}>
                    <Upload className="mr-2 h-4 w-4" /> Import Nilai
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSyncToPDDikti}>
                    <Check className="mr-2 h-4 w-4" /> Sinkronisasi PDDikti
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
                      <TableHead className="w-[120px]">NIM</TableHead>
                      <TableHead>Nama Mahasiswa</TableHead>
                      <TableHead>Mata Kuliah</TableHead>
                      <TableHead className="text-center w-[80px]">Tugas</TableHead>
                      <TableHead className="text-center w-[80px]">UTS</TableHead>
                      <TableHead className="text-center w-[80px]">UAS</TableHead>
                      <TableHead className="text-center w-[80px]">Nilai</TableHead>
                      <TableHead className="text-center w-[80px]">Grade</TableHead>
                      <TableHead className="text-center w-[120px]">Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.length > 0 ? (
                      filteredGrades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell className="font-medium">{grade.nim}</TableCell>
                          <TableCell>{grade.studentName}</TableCell>
                          <TableCell>
                            <div>
                              <div>{grade.courseName}</div>
                              <div className="text-xs text-muted-foreground">{grade.courseCode}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{grade.assignment}</TableCell>
                          <TableCell className="text-center">{grade.midExam}</TableCell>
                          <TableCell className="text-center">{grade.finalExam}</TableCell>
                          <TableCell className="text-center">{grade.finalGrade.toFixed(1)}</TableCell>
                          <TableCell className="text-center">
                            <GradeBadge gradeValue={grade.gradeValue} />
                          </TableCell>
                          <TableCell className="text-center">
                            <StatusBadge status={grade.status} />
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
                                <DropdownMenuItem onClick={() => setEditingGrade(grade)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit Nilai
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/nilai/${grade.id}/detail`, '_blank')}
                                >
                                  <ClipboardList className="mr-2 h-4 w-4" /> Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/mahasiswa/${grade.studentId}/transkrip`, '_blank')}
                                >
                                  <FileText className="mr-2 h-4 w-4" /> Transkrip
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/nilai/history/${grade.id}`, '_blank')}
                                >
                                  <History className="mr-2 h-4 w-4" /> Riwayat Perubahan
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteGrade(grade.id)}
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
                        <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                          Tidak ada data nilai yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredGrades.length} dari {grades.length} data nilai
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