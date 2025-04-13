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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  MoreHorizontal,
  Plus,
  Download,
  Trash2,
  Pencil,
  FileText,
  Receipt,
  Banknote,
  CreditCard,
  CircleDollarSign,
  CheckCircle2,
  XCircle,
  Calendar,
  Info,
  Filter,
  User,
  History,
  Send,
  AlertCircle,
} from 'lucide-react';

// Interface untuk data transaksi keuangan
interface Transaction {
  id: number;
  studentId: number;
  studentName: string;
  nim: string;
  amount: number;
  category: 'tuition' | 'registration' | 'laboratory' | 'exam' | 'graduation' | 'other';
  type: 'payment' | 'refund' | 'charge';
  method: 'cash' | 'transfer' | 'card' | 'virtual_account';
  reference?: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  semester: string;
  academicYear: string;
  transactionDate: string;
  dueDate?: string;
  paymentDate?: string;
  createdBy: string;
}

// Interface untuk data tagihan mahasiswa
interface Invoice {
  id: number;
  studentId: number;
  studentName: string;
  nim: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  category: 'tuition' | 'registration' | 'laboratory' | 'exam' | 'graduation' | 'other';
  description?: string;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  semester: string;
  academicYear: string;
  dueDate: string;
  createdDate: string;
  lastPaymentDate?: string;
  paymentCount: number;
}

// Data contoh untuk transaksi
const demoTransactions: Transaction[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Ahmad Budi Cahyono',
    nim: '2020103001',
    amount: 2500000,
    category: 'tuition',
    type: 'payment',
    method: 'transfer',
    reference: 'TRF/20240415/001',
    description: 'Pembayaran SPP Semester Ganjil 2024/2025',
    status: 'completed',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    transactionDate: '2024-04-15',
    paymentDate: '2024-04-15',
    createdBy: 'Admin Keuangan',
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Siti Nurhayati',
    nim: '2020103002',
    amount: 2500000,
    category: 'tuition',
    type: 'payment',
    method: 'virtual_account',
    reference: 'VA/20240416/002',
    description: 'Pembayaran SPP Semester Ganjil 2024/2025',
    status: 'completed',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    transactionDate: '2024-04-16',
    paymentDate: '2024-04-16',
    createdBy: 'Sistem',
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Rudi Hermawan',
    nim: '2020103003',
    amount: 500000,
    category: 'laboratory',
    type: 'payment',
    method: 'cash',
    reference: 'CSH/20240417/003',
    description: 'Pembayaran Praktikum Semester Ganjil 2024/2025',
    status: 'completed',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    transactionDate: '2024-04-17',
    paymentDate: '2024-04-17',
    createdBy: 'Admin Keuangan',
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'Diana Putri',
    nim: '2020103004',
    amount: 2500000,
    category: 'tuition',
    type: 'payment',
    method: 'transfer',
    reference: 'TRF/20240418/004',
    description: 'Pembayaran SPP Semester Ganjil 2024/2025',
    status: 'pending',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    transactionDate: '2024-04-18',
    dueDate: '2024-04-25',
    createdBy: 'Admin Keuangan',
  },
  {
    id: 5,
    studentId: 5,
    studentName: 'Joko Susanto',
    nim: '2020103005',
    amount: 150000,
    category: 'other',
    type: 'refund',
    method: 'transfer',
    reference: 'RFD/20240419/005',
    description: 'Pengembalian Kelebihan Pembayaran',
    status: 'completed',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    transactionDate: '2024-04-19',
    paymentDate: '2024-04-19',
    createdBy: 'Admin Keuangan',
  },
];

// Data contoh untuk tagihan
const demoInvoices: Invoice[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Ahmad Budi Cahyono',
    nim: '2020103001',
    amount: 2500000,
    paidAmount: 2500000,
    remainingAmount: 0,
    category: 'tuition',
    description: 'SPP Semester Ganjil 2024/2025',
    status: 'paid',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    dueDate: '2024-04-30',
    createdDate: '2024-04-01',
    lastPaymentDate: '2024-04-15',
    paymentCount: 1,
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Siti Nurhayati',
    nim: '2020103002',
    amount: 2500000,
    paidAmount: 2500000,
    remainingAmount: 0,
    category: 'tuition',
    description: 'SPP Semester Ganjil 2024/2025',
    status: 'paid',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    dueDate: '2024-04-30',
    createdDate: '2024-04-01',
    lastPaymentDate: '2024-04-16',
    paymentCount: 1,
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Rudi Hermawan',
    nim: '2020103003',
    amount: 2500000,
    paidAmount: 1250000,
    remainingAmount: 1250000,
    category: 'tuition',
    description: 'SPP Semester Ganjil 2024/2025',
    status: 'partial',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    dueDate: '2024-04-30',
    createdDate: '2024-04-01',
    lastPaymentDate: '2024-04-10',
    paymentCount: 1,
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'Diana Putri',
    nim: '2020103004',
    amount: 2500000,
    paidAmount: 0,
    remainingAmount: 2500000,
    category: 'tuition',
    description: 'SPP Semester Ganjil 2024/2025',
    status: 'unpaid',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    dueDate: '2024-04-30',
    createdDate: '2024-04-01',
    paymentCount: 0,
  },
  {
    id: 5,
    studentId: 5,
    studentName: 'Joko Susanto',
    nim: '2020103005',
    amount: 2500000,
    paidAmount: 0,
    remainingAmount: 2500000,
    category: 'tuition',
    description: 'SPP Semester Ganjil 2024/2025',
    status: 'overdue',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    dueDate: '2024-03-31',
    createdDate: '2024-03-01',
    paymentCount: 0,
  },
];

// Komponen badge untuk status transaksi
const TransactionStatusBadge = ({ status }: { status: Transaction['status'] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'pending':
        return 'Menunggu';
      case 'failed':
        return 'Gagal';
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

// Komponen badge untuk status tagihan
const InvoiceStatusBadge = ({ status }: { status: Invoice['status'] }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'paid':
        return 'Lunas';
      case 'partial':
        return 'Sebagian';
      case 'unpaid':
        return 'Belum Dibayar';
      case 'overdue':
        return 'Terlambat';
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

// Komponen badge untuk kategori pembayaran
const CategoryBadge = ({ category, size = 'default' }: { category: Transaction['category'] | Invoice['category'], size?: 'sm' | 'default' }) => {
  const getCategoryStyles = () => {
    switch (category) {
      case 'tuition':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'registration':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'laboratory':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'exam':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'graduation':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'other':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'tuition':
        return 'SPP';
      case 'registration':
        return 'Pendaftaran';
      case 'laboratory':
        return 'Praktikum';
      case 'exam':
        return 'Ujian';
      case 'graduation':
        return 'Wisuda';
      case 'other':
        return 'Lainnya';
      default:
        return category;
    }
  };

  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span className={`rounded-full ${sizeClass} font-medium ${getCategoryStyles()}`}>
      {getCategoryLabel()}
    </span>
  );
};

// Komponen badge untuk metode pembayaran
const PaymentMethodBadge = ({ method }: { method: Transaction['method'] }) => {
  const getMethodStyles = () => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'transfer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'card':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'virtual_account':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMethodLabel = () => {
    switch (method) {
      case 'cash':
        return 'Tunai';
      case 'transfer':
        return 'Transfer';
      case 'card':
        return 'Kartu';
      case 'virtual_account':
        return 'Virtual Account';
      default:
        return method;
    }
  };

  const getMethodIcon = () => {
    switch (method) {
      case 'cash':
        return <Banknote className="h-3 w-3 mr-1" />;
      case 'transfer':
        return <Receipt className="h-3 w-3 mr-1" />;
      case 'card':
        return <CreditCard className="h-3 w-3 mr-1" />;
      case 'virtual_account':
        return <CircleDollarSign className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMethodStyles()}`}>
      {getMethodIcon()}
      {getMethodLabel()}
    </span>
  );
};

// Form untuk menambah atau mengedit transaksi
const TransactionForm = ({
  transaction,
  onSubmit,
  onCancel,
}: {
  transaction?: Transaction;
  onSubmit: (data: Partial<Transaction>) => void;
  onCancel: () => void;
}) => {
  const isEditing = !!transaction;
  const [formData, setFormData] = useState<Partial<Transaction>>(
    transaction || {
      studentId: 0,
      studentName: '',
      nim: '',
      amount: 0,
      category: 'tuition',
      type: 'payment',
      method: 'cash',
      reference: '',
      description: '',
      status: 'pending',
      semester: 'Ganjil',
      academicYear: '2024/2025',
      transactionDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      paymentDate: '',
      createdBy: 'Admin Keuangan',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
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

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="student">Mahasiswa</Label>
        <Select
          value={formData.studentId?.toString()}
          onValueChange={handleStudentChange}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Kategori Pembayaran</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange('category', value as Transaction['category'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tuition">SPP</SelectItem>
              <SelectItem value="registration">Pendaftaran</SelectItem>
              <SelectItem value="laboratory">Praktikum</SelectItem>
              <SelectItem value="exam">Ujian</SelectItem>
              <SelectItem value="graduation">Wisuda</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipe Transaksi</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange('type', value as Transaction['type'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payment">Pembayaran</SelectItem>
              <SelectItem value="refund">Pengembalian</SelectItem>
              <SelectItem value="charge">Biaya Tambahan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Jumlah (Rp)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min={0}
            placeholder="Jumlah pembayaran"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="method">Metode Pembayaran</Label>
          <Select
            value={formData.method}
            onValueChange={(value) => handleSelectChange('method', value as Transaction['method'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih metode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Tunai</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
              <SelectItem value="card">Kartu</SelectItem>
              <SelectItem value="virtual_account">Virtual Account</SelectItem>
            </SelectContent>
          </Select>
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
          <Label htmlFor="transactionDate">Tanggal Transaksi</Label>
          <Input
            id="transactionDate"
            name="transactionDate"
            type="date"
            value={formData.transactionDate}
            onChange={handleChange}
          />
        </div>
        {formData.type === 'payment' && (
          <div className="space-y-2">
            <Label htmlFor="paymentDate">Tanggal Pembayaran</Label>
            <Input
              id="paymentDate"
              name="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Nomor Referensi</Label>
        <Input
          id="reference"
          name="reference"
          placeholder="Nomor referensi transaksi"
          value={formData.reference}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Deskripsi transaksi"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange('status', value as Transaction['status'])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="failed">Gagal</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          {isEditing ? 'Simpan Perubahan' : 'Tambah Transaksi'}
        </Button>
      </DialogFooter>
    </div>
  );
};

// Form untuk menambah atau mengedit tagihan
const InvoiceForm = ({
  invoice,
  onSubmit,
  onCancel,
}: {
  invoice?: Invoice;
  onSubmit: (data: Partial<Invoice>) => void;
  onCancel: () => void;
}) => {
  const isEditing = !!invoice;
  const [formData, setFormData] = useState<Partial<Invoice>>(
    invoice || {
      studentId: 0,
      studentName: '',
      nim: '',
      amount: 0,
      paidAmount: 0,
      remainingAmount: 0,
      category: 'tuition',
      description: '',
      status: 'unpaid',
      semester: 'Ganjil',
      academicYear: '2024/2025',
      dueDate: '',
      createdDate: new Date().toISOString().split('T')[0],
      paymentCount: 0,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = type === 'number' ? parseFloat(value) : value;
    
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: parsedValue,
      };
      
      // Update remaining amount if amount or paidAmount changes
      if (name === 'amount' || name === 'paidAmount') {
        const amount = name === 'amount' ? parsedValue : (prev.amount || 0);
        const paidAmount = name === 'paidAmount' ? parsedValue : (prev.paidAmount || 0);
        
        updatedData.remainingAmount = amount - paidAmount;
        
        // Determine status based on payment status
        if (paidAmount === 0) {
          updatedData.status = 'unpaid';
        } else if (paidAmount < amount) {
          updatedData.status = 'partial';
        } else {
          updatedData.status = 'paid';
        }
        
        // Check if overdue
        const dueDate = new Date(prev.dueDate || new Date());
        const today = new Date();
        if (dueDate < today && paidAmount < amount) {
          updatedData.status = 'overdue';
        }
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

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="student">Mahasiswa</Label>
        <Select
          value={formData.studentId?.toString()}
          onValueChange={handleStudentChange}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Kategori Pembayaran</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange('category', value as Invoice['category'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tuition">SPP</SelectItem>
              <SelectItem value="registration">Pendaftaran</SelectItem>
              <SelectItem value="laboratory">Praktikum</SelectItem>
              <SelectItem value="exam">Ujian</SelectItem>
              <SelectItem value="graduation">Wisuda</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Jumlah Tagihan (Rp)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min={0}
            placeholder="Jumlah tagihan"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paidAmount">Jumlah Terbayar (Rp)</Label>
          <Input
            id="paidAmount"
            name="paidAmount"
            type="number"
            min={0}
            max={formData.amount}
            placeholder="Jumlah terbayar"
            value={formData.paidAmount}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="remainingAmount">Sisa Tagihan (Rp)</Label>
          <Input
            id="remainingAmount"
            name="remainingAmount"
            type="number"
            value={formData.remainingAmount}
            disabled
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
          <Label htmlFor="createdDate">Tanggal Pembuatan</Label>
          <Input
            id="createdDate"
            name="createdDate"
            type="date"
            value={formData.createdDate}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Tanggal Jatuh Tempo</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Deskripsi tagihan"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          {isEditing ? 'Simpan Perubahan' : 'Tambah Tagihan'}
        </Button>
      </DialogFooter>
    </div>
  );
};

// Komponen utama halaman Keuangan
export default function FinancePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk transaksi
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<Transaction['status'] | 'all'>('all');
  
  // State untuk tagihan
  const [invoices, setInvoices] = useState<Invoice[]>(demoInvoices);
  const [isAddInvoiceDialogOpen, setIsAddInvoiceDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(undefined);
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<Invoice['status'] | 'all'>('all');

  // Filter transaksi berdasarkan pencarian dan status
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.reference && transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = transactionStatusFilter === 'all' || transaction.status === transactionStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filter tagihan berdasarkan pencarian dan status
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.description && invoice.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = invoiceStatusFilter === 'all' || invoice.status === invoiceStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Menambahkan transaksi baru
  const handleAddTransaction = (transactionData: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      studentId: transactionData.studentId || 0,
      studentName: transactionData.studentName || '',
      nim: transactionData.nim || '',
      amount: transactionData.amount || 0,
      category: transactionData.category || 'tuition',
      type: transactionData.type || 'payment',
      method: transactionData.method || 'cash',
      reference: transactionData.reference,
      description: transactionData.description,
      status: transactionData.status || 'pending',
      semester: transactionData.semester || 'Ganjil',
      academicYear: transactionData.academicYear || '2024/2025',
      transactionDate: transactionData.transactionDate || new Date().toISOString().split('T')[0],
      dueDate: transactionData.dueDate,
      paymentDate: transactionData.paymentDate,
      createdBy: transactionData.createdBy || 'Admin Keuangan',
    };

    setTransactions([...transactions, newTransaction]);
    setIsAddTransactionDialogOpen(false);
    toast({
      title: 'Transaksi berhasil ditambahkan',
      description: `Transaksi untuk ${newTransaction.studentName} telah berhasil disimpan.`,
    });

    // Update tagihan jika ini adalah pembayaran
    if (newTransaction.type === 'payment' && newTransaction.status === 'completed') {
      const relatedInvoices = invoices.filter(
        (invoice) => 
          invoice.studentId === newTransaction.studentId && 
          invoice.category === newTransaction.category &&
          invoice.semester === newTransaction.semester &&
          invoice.academicYear === newTransaction.academicYear &&
          (invoice.status === 'unpaid' || invoice.status === 'partial' || invoice.status === 'overdue')
      );

      if (relatedInvoices.length > 0) {
        const invoice = relatedInvoices[0];
        const updatedInvoice = { 
          ...invoice,
          paidAmount: Math.min(invoice.amount, invoice.paidAmount + newTransaction.amount),
          paymentCount: invoice.paymentCount + 1,
          lastPaymentDate: newTransaction.paymentDate || new Date().toISOString().split('T')[0],
        };
        
        updatedInvoice.remainingAmount = updatedInvoice.amount - updatedInvoice.paidAmount;
        
        if (updatedInvoice.remainingAmount <= 0) {
          updatedInvoice.status = 'paid';
        } else {
          updatedInvoice.status = 'partial';
        }

        const updatedInvoices = invoices.map((inv) =>
          inv.id === invoice.id ? updatedInvoice : inv
        );

        setInvoices(updatedInvoices);
      }
    }
  };

  // Mengedit transaksi
  const handleEditTransaction = (transactionData: Partial<Transaction>) => {
    if (!editingTransaction) return;

    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === editingTransaction.id ? { ...transaction, ...transactionData } : transaction
    );

    setTransactions(updatedTransactions);
    setEditingTransaction(undefined);
    toast({
      title: 'Transaksi diperbarui',
      description: `Transaksi untuk ${transactionData.studentName} telah berhasil diperbarui.`,
    });
  };

  // Menghapus transaksi
  const handleDeleteTransaction = (id: number) => {
    const transactionToDelete = transactions.find(transaction => transaction.id === id);
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(updatedTransactions);
    toast({
      title: 'Transaksi dihapus',
      description: `Transaksi untuk ${transactionToDelete?.studentName} telah berhasil dihapus.`,
      variant: 'destructive',
    });
  };

  // Menambahkan tagihan baru
  const handleAddInvoice = (invoiceData: Partial<Invoice>) => {
    const newInvoice: Invoice = {
      id: invoices.length + 1,
      studentId: invoiceData.studentId || 0,
      studentName: invoiceData.studentName || '',
      nim: invoiceData.nim || '',
      amount: invoiceData.amount || 0,
      paidAmount: invoiceData.paidAmount || 0,
      remainingAmount: (invoiceData.amount || 0) - (invoiceData.paidAmount || 0),
      category: invoiceData.category || 'tuition',
      description: invoiceData.description,
      status: invoiceData.status || 'unpaid',
      semester: invoiceData.semester || 'Ganjil',
      academicYear: invoiceData.academicYear || '2024/2025',
      dueDate: invoiceData.dueDate || new Date().toISOString().split('T')[0],
      createdDate: invoiceData.createdDate || new Date().toISOString().split('T')[0],
      lastPaymentDate: invoiceData.lastPaymentDate,
      paymentCount: invoiceData.paymentCount || 0,
    };

    setInvoices([...invoices, newInvoice]);
    setIsAddInvoiceDialogOpen(false);
    toast({
      title: 'Tagihan berhasil ditambahkan',
      description: `Tagihan untuk ${newInvoice.studentName} telah berhasil disimpan.`,
    });
  };

  // Mengedit tagihan
  const handleEditInvoice = (invoiceData: Partial<Invoice>) => {
    if (!editingInvoice) return;

    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === editingInvoice.id ? { ...invoice, ...invoiceData } : invoice
    );

    setInvoices(updatedInvoices);
    setEditingInvoice(undefined);
    toast({
      title: 'Tagihan diperbarui',
      description: `Tagihan untuk ${invoiceData.studentName} telah berhasil diperbarui.`,
    });
  };

  // Menghapus tagihan
  const handleDeleteInvoice = (id: number) => {
    const invoiceToDelete = invoices.find(invoice => invoice.id === id);
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
    setInvoices(updatedInvoices);
    toast({
      title: 'Tagihan dihapus',
      description: `Tagihan untuk ${invoiceToDelete?.studentName} telah berhasil dihapus.`,
      variant: 'destructive',
    });
  };

  // Export data (simulasi)
  const handleExportData = () => {
    toast({
      title: 'Data keuangan diekspor',
      description: 'File Excel berhasil diunduh.',
    });
  };

  // Kirim notifikasi tagihan (simulasi)
  const handleSendInvoiceReminder = (invoiceId: number) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (invoice) {
      toast({
        title: 'Notifikasi tagihan terkirim',
        description: `Pengingat tagihan untuk ${invoice.studentName} telah berhasil dikirim.`,
      });
    }
  };

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Keuangan</h1>
            <p className="text-muted-foreground">
              Kelola transaksi keuangan, tagihan, dan laporan
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="transactions">Transaksi</TabsTrigger>
            <TabsTrigger value="invoices">Tagihan</TabsTrigger>
            <TabsTrigger value="reports">Laporan</TabsTrigger>
          </TabsList>

          {/* Tab Transaksi */}
          <TabsContent value="transactions" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Button
                  variant={transactionStatusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTransactionStatusFilter('all')}
                >
                  Semua
                </Button>
                <Button
                  variant={transactionStatusFilter === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTransactionStatusFilter('completed')}
                >
                  Selesai
                </Button>
                <Button
                  variant={transactionStatusFilter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTransactionStatusFilter('pending')}
                >
                  Menunggu
                </Button>
                <Button
                  variant={transactionStatusFilter === 'failed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTransactionStatusFilter('failed')}
                >
                  Gagal
                </Button>
              </div>

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
                      placeholder="Cari transaksi..."
                      className="w-[250px] pl-8 rounded-l-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Dialog open={isAddTransactionDialogOpen} onOpenChange={setIsAddTransactionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-1">
                      <Plus className="h-4 w-4" /> Tambah Transaksi
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Tambah Transaksi Baru</DialogTitle>
                      <DialogDescription>
                        Masukkan informasi untuk menambahkan transaksi baru.
                      </DialogDescription>
                    </DialogHeader>
                    <TransactionForm
                      onSubmit={handleAddTransaction}
                      onCancel={() => setIsAddTransactionDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(undefined)}>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Transaksi</DialogTitle>
                      <DialogDescription>
                        Perbarui informasi transaksi.
                      </DialogDescription>
                    </DialogHeader>
                    {editingTransaction && (
                      <TransactionForm
                        transaction={editingTransaction}
                        onSubmit={handleEditTransaction}
                        onCancel={() => setEditingTransaction(undefined)}
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
                      <Download className="mr-2 h-4 w-4" /> Export Transaksi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open('/keuangan/laporan-transaksi', '_blank')}>
                      <FileText className="mr-2 h-4 w-4" /> Laporan Transaksi
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
                      <TableHead className="w-[120px]">Tanggal</TableHead>
                      <TableHead>Mahasiswa</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Metode</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {new Date(transaction.transactionDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{transaction.studentName}</div>
                              <div className="text-xs text-muted-foreground">{transaction.nim}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <HoverCard>
                              <HoverCardTrigger>
                                <span className="line-clamp-1 max-w-[200px]">
                                  {transaction.description || 'Tidak ada deskripsi'}
                                </span>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold">Detail Transaksi</h4>
                                  <div className="text-sm">
                                    <p><span className="font-medium">Deskripsi:</span> {transaction.description}</p>
                                    <p><span className="font-medium">Referensi:</span> {transaction.reference}</p>
                                    <p><span className="font-medium">Tahun/Semester:</span> {transaction.academicYear} - {transaction.semester}</p>
                                    <p><span className="font-medium">Dibuat oleh:</span> {transaction.createdBy}</p>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </TableCell>
                          <TableCell>
                            <CategoryBadge category={transaction.category} />
                          </TableCell>
                          <TableCell>
                            <PaymentMethodBadge method={transaction.method} />
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`font-medium ${transaction.type === 'refund' ? 'text-red-600' : 'text-green-600'}`}>
                              {transaction.type === 'refund' ? '-' : ''}
                              {transaction.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <TransactionStatusBadge status={transaction.status} />
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
                                <DropdownMenuItem onClick={() => window.open(`/keuangan/transaksi/${transaction.id}`, '_blank')}>
                                  <Receipt className="mr-2 h-4 w-4" /> Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditingTransaction(transaction)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/keuangan/transaksi/${transaction.id}/cetak`, '_blank')}
                                >
                                  <FileText className="mr-2 h-4 w-4" /> Cetak Kuitansi
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteTransaction(transaction.id)}
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
                          Tidak ada transaksi yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
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

          {/* Tab Tagihan */}
          <TabsContent value="invoices" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Button
                  variant={invoiceStatusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInvoiceStatusFilter('all')}
                >
                  Semua
                </Button>
                <Button
                  variant={invoiceStatusFilter === 'unpaid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInvoiceStatusFilter('unpaid')}
                >
                  Belum Dibayar
                </Button>
                <Button
                  variant={invoiceStatusFilter === 'partial' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInvoiceStatusFilter('partial')}
                >
                  Sebagian
                </Button>
                <Button
                  variant={invoiceStatusFilter === 'paid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInvoiceStatusFilter('paid')}
                >
                  Lunas
                </Button>
                <Button
                  variant={invoiceStatusFilter === 'overdue' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInvoiceStatusFilter('overdue')}
                >
                  Terlambat
                </Button>
              </div>

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
                      placeholder="Cari tagihan..."
                      className="w-[250px] pl-8 rounded-l-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Dialog open={isAddInvoiceDialogOpen} onOpenChange={setIsAddInvoiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-1">
                      <Plus className="h-4 w-4" /> Tambah Tagihan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Tambah Tagihan Baru</DialogTitle>
                      <DialogDescription>
                        Masukkan informasi untuk menambahkan tagihan baru.
                      </DialogDescription>
                    </DialogHeader>
                    <InvoiceForm
                      onSubmit={handleAddInvoice}
                      onCancel={() => setIsAddInvoiceDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={!!editingInvoice} onOpenChange={(open) => !open && setEditingInvoice(undefined)}>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Tagihan</DialogTitle>
                      <DialogDescription>
                        Perbarui informasi tagihan.
                      </DialogDescription>
                    </DialogHeader>
                    {editingInvoice && (
                      <InvoiceForm
                        invoice={editingInvoice}
                        onSubmit={handleEditInvoice}
                        onCancel={() => setEditingInvoice(undefined)}
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
                      <Download className="mr-2 h-4 w-4" /> Export Tagihan
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open('/keuangan/laporan-tagihan', '_blank')}>
                      <FileText className="mr-2 h-4 w-4" /> Laporan Tagihan
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const overdueInvoices = invoices.filter(i => i.status === 'overdue');
                        if (overdueInvoices.length > 0) {
                          toast({
                            title: 'Notifikasi terkirim',
                            description: `Pengingat tagihan telah dikirimkan ke ${overdueInvoices.length} mahasiswa.`,
                          });
                        } else {
                          toast({
                            title: 'Tidak ada tagihan terlambat',
                            description: 'Semua tagihan sudah dibayar tepat waktu.',
                          });
                        }
                      }}
                    >
                      <Send className="mr-2 h-4 w-4" /> Kirim Pengingat Massal
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
                      <TableHead className="w-[120px]">Jatuh Tempo</TableHead>
                      <TableHead>Mahasiswa</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Terbayar</TableHead>
                      <TableHead className="text-right">Sisa</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className={`font-medium ${invoice.status === 'overdue' ? 'text-red-600' : ''}`}>
                            {new Date(invoice.dueDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{invoice.studentName}</div>
                              <div className="text-xs text-muted-foreground">{invoice.nim}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <HoverCard>
                              <HoverCardTrigger>
                                <span className="line-clamp-1 max-w-[200px]">
                                  {invoice.description || 'Tidak ada deskripsi'}
                                </span>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold">Detail Tagihan</h4>
                                  <div className="text-sm">
                                    <p><span className="font-medium">Deskripsi:</span> {invoice.description}</p>
                                    <p><span className="font-medium">Tahun/Semester:</span> {invoice.academicYear} - {invoice.semester}</p>
                                    <p><span className="font-medium">Tanggal dibuat:</span> {new Date(invoice.createdDate).toLocaleDateString('id-ID')}</p>
                                    {invoice.lastPaymentDate && (
                                      <p><span className="font-medium">Pembayaran terakhir:</span> {new Date(invoice.lastPaymentDate).toLocaleDateString('id-ID')}</p>
                                    )}
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </TableCell>
                          <TableCell>
                            <CategoryBadge category={invoice.category} />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {invoice.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {invoice.paidAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                          </TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            {invoice.remainingAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                          </TableCell>
                          <TableCell className="text-center">
                            <InvoiceStatusBadge status={invoice.status} />
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
                                  onClick={() => {
                                    setIsAddTransactionDialogOpen(true);
                                    // Pre-fill transaction data based on invoice
                                    // This would be implemented with state management
                                  }}
                                >
                                  <Banknote className="mr-2 h-4 w-4" /> Catat Pembayaran
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditingInvoice(invoice)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit Tagihan
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/keuangan/tagihan/${invoice.id}/detail`, '_blank')}
                                >
                                  <FileText className="mr-2 h-4 w-4" /> Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => window.open(`/keuangan/tagihan/${invoice.id}/cetak`, '_blank')}
                                >
                                  <FileText className="mr-2 h-4 w-4" /> Cetak Tagihan
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleSendInvoiceReminder(invoice.id)}
                                >
                                  <Send className="mr-2 h-4 w-4" /> Kirim Pengingat
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteInvoice(invoice.id)}
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
                        <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                          Tidak ada tagihan yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredInvoices.length} dari {invoices.length} tagihan
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

          {/* Tab Laporan */}
          <TabsContent value="reports" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ringkasan Keuangan</CardTitle>
                  <CardDescription>Semester Ganjil 2024/2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Total Tagihan</div>
                      <div className="font-medium">Rp 12.500.000</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Total Terbayar</div>
                      <div className="font-medium text-green-600">Rp 8.750.000</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Sisa Tagihan</div>
                      <div className="font-medium text-red-600">Rp 3.750.000</div>
                    </div>
                    <div className="pt-2">
                      <div className="text-sm font-medium mb-1">Progres Pembayaran</div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">70% terkumpul</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" /> Lihat Laporan Lengkap
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Status Tagihan</CardTitle>
                  <CardDescription>Ringkasan status pembayaran</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <div className="text-sm">Lunas</div>
                      </div>
                      <div className="font-medium">2 mahasiswa</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <div className="text-sm">Sebagian</div>
                      </div>
                      <div className="font-medium">1 mahasiswa</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="text-sm">Belum Dibayar</div>
                      </div>
                      <div className="font-medium">1 mahasiswa</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="text-sm">Terlambat</div>
                      </div>
                      <div className="font-medium">1 mahasiswa</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="h-4 w-4 mr-2" /> Lihat Detail Mahasiswa
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
                  <CardDescription>5 transaksi terakhir</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center py-1 px-2 rounded hover:bg-muted">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium">{transaction.studentName}</div>
                          <div className="flex items-center gap-1">
                            <div className="text-xs text-muted-foreground">
                              {new Date(transaction.transactionDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })}
                            </div>
                            <CategoryBadge category={transaction.category} size="sm" />
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${transaction.type === 'refund' ? 'text-red-600' : 'text-green-600'}`}>
                          {transaction.type === 'refund' ? '-' : '+'}
                          {transaction.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <History className="h-4 w-4 mr-2" /> Lihat Semua Transaksi
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Laporan Keuangan</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Laporan Bulanan</CardTitle>
                    <CardDescription>Laporan keuangan berdasarkan bulan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="font-medium">Januari 2024</div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Unduh
                        </Button>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="font-medium">Februari 2024</div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Unduh
                        </Button>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="font-medium">Maret 2024</div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Unduh
                        </Button>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="font-medium">April 2024</div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Unduh
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Laporan Semester</CardTitle>
                    <CardDescription>Laporan keuangan berdasarkan semester</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="font-medium">Genap 2022/2023</div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Unduh
                        </Button>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="font-medium">Ganjil 2023/2024</div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Unduh
                        </Button>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="font-medium">Genap 2023/2024</div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Unduh
                        </Button>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="font-medium">Ganjil 2024/2025</div>
                        <Badge variant="outline" className="ml-2">Aktif</Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Unduh
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutWithSidebar>
  );
}