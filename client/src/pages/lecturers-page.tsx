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
  Check,
  Filter,
  BookOpen
} from 'lucide-react';

// Interface untuk data dosen
interface Lecturer {
  id: number;
  lecturerId: string;
  name: string;
  email: string;
  department: string;
  specialization: string;
  position: string;
  status: 'active' | 'inactive' | 'retired' | 'sabbatical';
  phoneNumber?: string;
  photoUrl?: string;
}

// Data contoh untuk dosen
const demoLecturers: Lecturer[] = [
  {
    id: 1,
    lecturerId: 'DSN001',
    name: 'Dr. Budi Santoso, M.Kom.',
    email: 'budi.santoso@example.com',
    department: 'Teknik Informatika',
    specialization: 'Kecerdasan Buatan',
    position: 'Dosen Tetap',
    status: 'active',
    phoneNumber: '081234567890',
  },
  {
    id: 2,
    lecturerId: 'DSN002',
    name: 'Prof. Siti Rahayu, Ph.D.',
    email: 'siti.rahayu@example.com',
    department: 'Sistem Informasi',
    specialization: 'Data Mining',
    position: 'Guru Besar',
    status: 'active',
    phoneNumber: '081234567891',
  },
  {
    id: 3,
    lecturerId: 'DSN003',
    name: 'Dr. Ahmad Wijaya, M.Sc.',
    email: 'ahmad.wijaya@example.com',
    department: 'Teknik Komputer',
    specialization: 'Jaringan Komputer',
    position: 'Dosen Tetap',
    status: 'sabbatical',
    phoneNumber: '081234567892',
  },
  {
    id: 4,
    lecturerId: 'DSN004',
    name: 'Dr. Rina Anggraini, M.T.',
    email: 'rina.anggraini@example.com',
    department: 'Teknik Informatika',
    specialization: 'Rekayasa Perangkat Lunak',
    position: 'Dosen Tetap',
    status: 'active',
    phoneNumber: '081234567893',
  },
  {
    id: 5,
    lecturerId: 'DSN005',
    name: 'Dr. Hendro Kusuma, M.Kom.',
    email: 'hendro.kusuma@example.com',
    department: 'Sistem Informasi',
    specialization: 'Keamanan Informasi',
    position: 'Dosen Tetap',
    status: 'active',
    phoneNumber: '081234567894',
  },
];

// Komponen status badge
const StatusBadge = ({ status }: { status: Lecturer['status'] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'retired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'sabbatical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
      case 'retired':
        return 'Pensiun';
      case 'sabbatical':
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

// Form untuk menambah atau mengedit dosen
const LecturerForm = ({
  lecturer,
  onSubmit,
  onCancel,
}: {
  lecturer?: Lecturer;
  onSubmit: (data: Partial<Lecturer>) => void;
  onCancel: () => void;
}) => {
  const isEditing = !!lecturer;
  const [formData, setFormData] = useState<Partial<Lecturer>>(
    lecturer || {
      lecturerId: '',
      name: '',
      email: '',
      department: '',
      specialization: '',
      position: 'Dosen Tetap',
      status: 'active',
      phoneNumber: '',
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

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="lecturerId">ID Dosen</Label>
        <Input
          id="lecturerId"
          name="lecturerId"
          placeholder="Masukkan ID dosen"
          value={formData.lecturerId}
          onChange={handleChange}
          disabled={isEditing}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          name="name"
          placeholder="Masukkan nama lengkap dosen"
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
          placeholder="Masukkan email dosen"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Nomor Telepon</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Masukkan nomor telepon"
          value={formData.phoneNumber}
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
      <div className="space-y-2">
        <Label htmlFor="specialization">Bidang Keahlian</Label>
        <Input
          id="specialization"
          name="specialization"
          placeholder="Bidang keahlian"
          value={formData.specialization}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Jabatan</Label>
          <Select
            value={formData.position}
            onValueChange={(value) => handleSelectChange('position', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jabatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dosen Tetap">Dosen Tetap</SelectItem>
              <SelectItem value="Dosen Tidak Tetap">Dosen Tidak Tetap</SelectItem>
              <SelectItem value="Guru Besar">Guru Besar</SelectItem>
              <SelectItem value="Asisten Ahli">Asisten Ahli</SelectItem>
              <SelectItem value="Lektor">Lektor</SelectItem>
              <SelectItem value="Lektor Kepala">Lektor Kepala</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => 
              handleSelectChange('status', value as 'active' | 'inactive' | 'retired' | 'sabbatical')
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Non-aktif</SelectItem>
              <SelectItem value="retired">Pensiun</SelectItem>
              <SelectItem value="sabbatical">Cuti</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          {isEditing ? 'Simpan Perubahan' : 'Tambah Dosen'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default function LecturersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [lecturers, setLecturers] = useState<Lecturer[]>(demoLecturers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<Lecturer['status'] | 'all'>('all');

  // Filter dosen berdasarkan pencarian dan status
  const filteredLecturers = lecturers.filter((lecturer) => {
    const matchesSearch =
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.lecturerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lecturer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Menambahkan dosen baru
  const handleAddLecturer = (lecturerData: Partial<Lecturer>) => {
    const newLecturer: Lecturer = {
      id: lecturers.length + 1,
      lecturerId: lecturerData.lecturerId || '',
      name: lecturerData.name || '',
      email: lecturerData.email || '',
      department: lecturerData.department || '',
      specialization: lecturerData.specialization || '',
      position: lecturerData.position || 'Dosen Tetap',
      status: lecturerData.status || 'active',
      phoneNumber: lecturerData.phoneNumber,
    };

    setLecturers([...lecturers, newLecturer]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Dosen berhasil ditambahkan',
      description: `Data untuk ${newLecturer.name} telah berhasil disimpan.`,
    });
  };

  // Mengedit dosen
  const handleEditLecturer = (lecturerData: Partial<Lecturer>) => {
    if (!editingLecturer) return;

    const updatedLecturers = lecturers.map((lecturer) =>
      lecturer.id === editingLecturer.id ? { ...lecturer, ...lecturerData } : lecturer
    );

    setLecturers(updatedLecturers);
    setEditingLecturer(undefined);
    toast({
      title: 'Data dosen diperbarui',
      description: `Data untuk ${lecturerData.name} telah berhasil diperbarui.`,
    });
  };

  // Menghapus dosen
  const handleDeleteLecturer = (id: number) => {
    const updatedLecturers = lecturers.filter((lecturer) => lecturer.id !== id);
    setLecturers(updatedLecturers);
    toast({
      title: 'Dosen dihapus',
      description: 'Data dosen telah berhasil dihapus dari sistem.',
      variant: 'destructive',
    });
  };

  // Export data (simulasi)
  const handleExportData = () => {
    toast({
      title: 'Data dosen diekspor',
      description: 'File Excel berhasil diunduh.',
    });
  };

  // Import data (simulasi)
  const handleImportData = () => {
    toast({
      title: 'Data dosen diimpor',
      description: 'Data berhasil diimpor ke sistem.',
    });
  };

  // Sinkronisasi data ke PDDikti (simulasi)
  const handleSyncToPDDikti = () => {
    toast({
      title: 'Sinkronisasi ke PDDikti',
      description: 'Data dosen berhasil disinkronkan dengan PDDikti.',
    });
  };

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Dosen</h1>
            <p className="text-muted-foreground">
              Kelola data dosen, informasi akademik, dan bidang keahlian
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className="gap-1"
            >
              <User className="h-4 w-4" /> Semua
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('active')}
              className="gap-1"
            >
              <Check className="h-4 w-4" /> Aktif
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('inactive')}
              className="gap-1"
            >
              Tidak Aktif
            </Button>
            <Button
              variant={statusFilter === 'sabbatical' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('sabbatical')}
              className="gap-1"
            >
              Cuti
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari dosen..."
                className="w-[250px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" /> Tambah Dosen
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Dosen Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan informasi untuk menambahkan dosen baru ke sistem.
                  </DialogDescription>
                </DialogHeader>
                <LecturerForm
                  onSubmit={handleAddLecturer}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={!!editingLecturer} onOpenChange={(open) => !open && setEditingLecturer(undefined)}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Data Dosen</DialogTitle>
                  <DialogDescription>
                    Perbarui informasi data dosen yang sudah ada.
                  </DialogDescription>
                </DialogHeader>
                {editingLecturer && (
                  <LecturerForm
                    lecturer={editingLecturer}
                    onSubmit={handleEditLecturer}
                    onCancel={() => setEditingLecturer(undefined)}
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

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID Dosen</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead>Keahlian</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLecturers.length > 0 ? (
                  filteredLecturers.map((lecturer) => (
                    <TableRow key={lecturer.id}>
                      <TableCell className="font-medium">{lecturer.lecturerId}</TableCell>
                      <TableCell>
                        <div>
                          <div>{lecturer.name}</div>
                          <div className="text-xs text-muted-foreground">{lecturer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{lecturer.department}</TableCell>
                      <TableCell>{lecturer.specialization}</TableCell>
                      <TableCell>{lecturer.position}</TableCell>
                      <TableCell>
                        <StatusBadge status={lecturer.status} />
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
                              onClick={() => window.open(`/dosen/${lecturer.id}`, '_blank')}
                            >
                              <User className="mr-2 h-4 w-4" /> Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingLecturer(lecturer)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(`/dosen/${lecturer.id}/courses`, '_blank')}
                            >
                              <BookOpen className="mr-2 h-4 w-4" /> Lihat Mata Kuliah
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteLecturer(lecturer.id)}
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
                      Tidak ada data dosen yang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Menampilkan {filteredLecturers.length} dari {lecturers.length} dosen
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
      </div>
    </LayoutWithSidebar>
  );
}