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
  BookOpen,
  Clock,
  User,
  Calendar,
  Check,
  Filter,
  BarChart3
} from 'lucide-react';

// Interface untuk data mata kuliah
interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  department: string;
  type: 'mandatory' | 'elective';
  level: 'undergraduate' | 'graduate';
  description?: string;
  semester: string;
  prerequisiteCourses?: string[];
  totalStudents?: number;
}

// Data contoh untuk mata kuliah
const demoCourses: Course[] = [
  {
    id: 1,
    code: 'TI2044',
    name: 'Algoritma dan Pemrograman',
    credits: 3,
    department: 'Teknik Informatika',
    type: 'mandatory',
    level: 'undergraduate',
    description: 'Pengenalan konsep dasar algoritma dan pemrograman',
    semester: '1',
    totalStudents: 120,
  },
  {
    id: 2,
    code: 'TI3045',
    name: 'Struktur Data',
    credits: 3,
    department: 'Teknik Informatika',
    type: 'mandatory',
    level: 'undergraduate',
    description: 'Konsep struktur data dan implementasinya',
    semester: '2',
    prerequisiteCourses: ['TI2044'],
    totalStudents: 110,
  },
  {
    id: 3,
    code: 'SI2041',
    name: 'Basis Data',
    credits: 4,
    department: 'Sistem Informasi',
    type: 'mandatory',
    level: 'undergraduate',
    description: 'Konsep basis data dan implementasinya',
    semester: '3',
    totalStudents: 95,
  },
  {
    id: 4,
    code: 'TI4051',
    name: 'Kecerdasan Buatan',
    credits: 3,
    department: 'Teknik Informatika',
    type: 'elective',
    level: 'undergraduate',
    description: 'Pengenalan konsep kecerdasan buatan',
    semester: '5',
    prerequisiteCourses: ['TI3045'],
    totalStudents: 45,
  },
  {
    id: 5,
    code: 'SI4023',
    name: 'Sistem Informasi Manajemen',
    credits: 3,
    department: 'Sistem Informasi',
    type: 'mandatory',
    level: 'undergraduate',
    description: 'Konsep dasar sistem informasi manajemen',
    semester: '4',
    totalStudents: 80,
  },
];

// Komponen badge untuk tipe mata kuliah
const TypeBadge = ({ type }: { type: Course['type'] }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'mandatory':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'elective':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'mandatory':
        return 'Wajib';
      case 'elective':
        return 'Pilihan';
      default:
        return type;
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeStyles()}`}>
      {getTypeLabel()}
    </span>
  );
};

// Komponen badge untuk level mata kuliah
const LevelBadge = ({ level }: { level: Course['level'] }) => {
  const getLevelStyles = () => {
    switch (level) {
      case 'undergraduate':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'graduate':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelLabel = () => {
    switch (level) {
      case 'undergraduate':
        return 'S1';
      case 'graduate':
        return 'S2/S3';
      default:
        return level;
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelStyles()}`}>
      {getLevelLabel()}
    </span>
  );
};

// Form untuk menambah atau mengedit mata kuliah
const CourseForm = ({
  course,
  onSubmit,
  onCancel,
}: {
  course?: Course;
  onSubmit: (data: Partial<Course>) => void;
  onCancel: () => void;
}) => {
  const isEditing = !!course;
  const [formData, setFormData] = useState<Partial<Course>>(
    course || {
      code: '',
      name: '',
      credits: 3,
      department: '',
      type: 'mandatory',
      level: 'undergraduate',
      description: '',
      semester: '1',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value, 10) : value,
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Kode Mata Kuliah</Label>
          <Input
            id="code"
            name="code"
            placeholder="Contoh: TI2044"
            value={formData.code}
            onChange={handleChange}
            disabled={isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credits">SKS</Label>
          <Input
            id="credits"
            name="credits"
            type="number"
            min={1}
            max={6}
            placeholder="Jumlah SKS"
            value={formData.credits}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nama Mata Kuliah</Label>
        <Input
          id="name"
          name="name"
          placeholder="Nama lengkap mata kuliah"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Departemen/Jurusan</Label>
        <Select
          value={formData.department}
          onValueChange={(value) => handleSelectChange('department', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih departemen" />
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
          <Label htmlFor="type">Tipe</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange('type', value as 'mandatory' | 'elective')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mandatory">Wajib</SelectItem>
              <SelectItem value="elective">Pilihan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={formData.level}
            onValueChange={(value) => handleSelectChange('level', value as 'undergraduate' | 'graduate')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="undergraduate">S1</SelectItem>
              <SelectItem value="graduate">S2/S3</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <SelectItem key={sem} value={sem.toString()}>
                Semester {sem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Deskripsi singkat mata kuliah"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          {isEditing ? 'Simpan Perubahan' : 'Tambah Mata Kuliah'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default function CoursesPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>(demoCourses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Filter mata kuliah berdasarkan pencarian dan departemen
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDepartment = departmentFilter === 'all' || course.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // Menambahkan mata kuliah baru
  const handleAddCourse = (courseData: Partial<Course>) => {
    const newCourse: Course = {
      id: courses.length + 1,
      code: courseData.code || '',
      name: courseData.name || '',
      credits: courseData.credits || 3,
      department: courseData.department || '',
      type: courseData.type || 'mandatory',
      level: courseData.level || 'undergraduate',
      description: courseData.description,
      semester: courseData.semester || '1',
      totalStudents: 0,
    };

    setCourses([...courses, newCourse]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Mata kuliah berhasil ditambahkan',
      description: `Data untuk ${newCourse.name} telah berhasil disimpan.`,
    });
  };

  // Mengedit mata kuliah
  const handleEditCourse = (courseData: Partial<Course>) => {
    if (!editingCourse) return;

    const updatedCourses = courses.map((course) =>
      course.id === editingCourse.id ? { ...course, ...courseData } : course
    );

    setCourses(updatedCourses);
    setEditingCourse(undefined);
    toast({
      title: 'Data mata kuliah diperbarui',
      description: `Data untuk ${courseData.name} telah berhasil diperbarui.`,
    });
  };

  // Menghapus mata kuliah
  const handleDeleteCourse = (id: number) => {
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);
    toast({
      title: 'Mata kuliah dihapus',
      description: 'Data mata kuliah telah berhasil dihapus dari sistem.',
      variant: 'destructive',
    });
  };

  // Export data (simulasi)
  const handleExportData = () => {
    toast({
      title: 'Data mata kuliah diekspor',
      description: 'File Excel berhasil diunduh.',
    });
  };

  // Import data (simulasi)
  const handleImportData = () => {
    toast({
      title: 'Data mata kuliah diimpor',
      description: 'Data berhasil diimpor ke sistem.',
    });
  };

  // Sinkronisasi data ke PDDikti (simulasi)
  const handleSyncToPDDikti = () => {
    toast({
      title: 'Sinkronisasi ke PDDikti',
      description: 'Data mata kuliah berhasil disinkronkan dengan PDDikti.',
    });
  };

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Mata Kuliah</h1>
            <p className="text-muted-foreground">
              Kelola data mata kuliah, prasyarat, dan distribusi semester
            </p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setDepartmentFilter('all')}>
                Semua Jurusan
              </TabsTrigger>
              <TabsTrigger
                value="ti"
                onClick={() => setDepartmentFilter('Teknik Informatika')}
              >
                Teknik Informatika
              </TabsTrigger>
              <TabsTrigger
                value="si"
                onClick={() => setDepartmentFilter('Sistem Informasi')}
              >
                Sistem Informasi
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
                    placeholder="Cari mata kuliah..."
                    className="w-[250px] pl-8 rounded-l-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" /> Tambah Mata Kuliah
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Tambah Mata Kuliah Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan informasi untuk menambahkan mata kuliah baru ke sistem.
                    </DialogDescription>
                  </DialogHeader>
                  <CourseForm
                    onSubmit={handleAddCourse}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={!!editingCourse} onOpenChange={(open) => !open && setEditingCourse(undefined)}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Data Mata Kuliah</DialogTitle>
                    <DialogDescription>
                      Perbarui informasi data mata kuliah yang sudah ada.
                    </DialogDescription>
                  </DialogHeader>
                  {editingCourse && (
                    <CourseForm
                      course={editingCourse}
                      onSubmit={handleEditCourse}
                      onCancel={() => setEditingCourse(undefined)}
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
                      <TableHead className="w-[100px]">Kode</TableHead>
                      <TableHead>Nama Mata Kuliah</TableHead>
                      <TableHead>Departemen</TableHead>
                      <TableHead className="w-[60px] text-center">SKS</TableHead>
                      <TableHead className="text-center">Semester</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.code}</TableCell>
                          <TableCell>
                            <div>
                              <div>{course.name}</div>
                              {course.description && (
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {course.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{course.department}</TableCell>
                          <TableCell className="text-center">{course.credits}</TableCell>
                          <TableCell className="text-center">{course.semester}</TableCell>
                          <TableCell>
                            <TypeBadge type={course.type} />
                          </TableCell>
                          <TableCell>
                            <LevelBadge level={course.level} />
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
                                  onClick={() => window.open(`/mata-kuliah/${course.id}`, '_blank')}
                                >
                                  <BookOpen className="mr-2 h-4 w-4" /> Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditingCourse(course)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/mata-kuliah/${course.id}/jadwal`, '_blank')}
                                >
                                  <Calendar className="mr-2 h-4 w-4" /> Lihat Jadwal
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/mata-kuliah/${course.id}/peserta`, '_blank')}
                                >
                                  <User className="mr-2 h-4 w-4" /> Lihat Peserta
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCourse(course.id)}
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
                          Tidak ada data mata kuliah yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredCourses.length} dari {courses.length} mata kuliah
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