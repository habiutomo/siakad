import React, { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Eye, 
  Plus, 
  Download,
  DollarSign,
  CreditCard,
  Receipt,
  BarChart3,
  ArrowUp,
  ArrowDown,
  FileText
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Transaction form schema
const transactionFormSchema = z.object({
  accountId: z.number(),
  amount: z.number().positive(),
  type: z.string(),
  description: z.string().min(3),
  paymentMethod: z.string().optional(),
  referenceNumber: z.string().optional(),
});

// Mock types for finance data
interface Account {
  id: number;
  studentId: number;
  balance: number;
  lastPaymentDate: string | null;
  student: {
    id: number;
    studentId: string;
    name: string;
  };
}

interface Transaction {
  id: number;
  accountId: number;
  amount: number;
  type: 'payment' | 'charge' | 'refund';
  description: string;
  paymentMethod: string | null;
  referenceNumber: string | null;
  transactionDate: string;
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<string>('accounts');
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] = useState(false);
  
  // Fetch students for account selection
  const { data: students } = useQuery({
    queryKey: ['/api/students'],
    queryFn: async () => {
      const response = await fetch('/api/students?limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      return response.json();
    },
  });

  // Fetch accounts
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['/api/accounts', page, search],
    queryFn: async () => {
      // In a real app, this would fetch from API with proper pagination and search
      // For now, return mock data
      return {
        data: [
          {
            id: 1,
            studentId: 1,
            balance: 2500000,
            lastPaymentDate: '2023-09-01T10:30:00Z',
            student: {
              id: 1,
              studentId: '20230001',
              name: 'Budi Santoso'
            }
          },
          {
            id: 2,
            studentId: 2,
            balance: 1750000,
            lastPaymentDate: '2023-08-15T14:20:00Z',
            student: {
              id: 2,
              studentId: '20230002',
              name: 'Siti Nurhaliza'
            }
          },
          {
            id: 3,
            studentId: 3,
            balance: -500000,
            lastPaymentDate: '2023-07-20T09:15:00Z',
            student: {
              id: 3,
              studentId: '20230003',
              name: 'Ahmad Rizki'
            }
          },
          {
            id: 4,
            studentId: 4,
            balance: 0,
            lastPaymentDate: '2023-09-10T16:45:00Z',
            student: {
              id: 4,
              studentId: '20230004',
              name: 'Dewi Lestari'
            }
          },
          {
            id: 5,
            studentId: 5,
            balance: 1250000,
            lastPaymentDate: '2023-08-28T11:30:00Z',
            student: {
              id: 5,
              studentId: '20230005',
              name: 'Rudi Hermawan'
            }
          }
        ],
        pagination: {
          total: 5,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      };
    },
  });

  // Fetch transactions for selected account
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['/api/transactions', selectedAccountId],
    queryFn: async () => {
      if (!selectedAccountId) return [];
      
      // In a real app, fetch from API with proper params
      // For now, return mock data
      return [
        {
          id: 1,
          accountId: parseInt(selectedAccountId),
          amount: 2500000,
          type: 'payment',
          description: 'Pembayaran SPP Semester Ganjil 2023/2024',
          paymentMethod: 'Bank Transfer',
          referenceNumber: 'TRX-2023-00001',
          transactionDate: '2023-09-01T10:30:00Z'
        },
        {
          id: 2,
          accountId: parseInt(selectedAccountId),
          amount: 3500000,
          type: 'charge',
          description: 'Tagihan SPP Semester Ganjil 2023/2024',
          paymentMethod: null,
          referenceNumber: 'INV-2023-00001',
          transactionDate: '2023-08-01T00:00:00Z'
        },
        {
          id: 3,
          accountId: parseInt(selectedAccountId),
          amount: 500000,
          type: 'charge',
          description: 'Tagihan Praktikum',
          paymentMethod: null,
          referenceNumber: 'INV-2023-00002',
          transactionDate: '2023-08-05T00:00:00Z'
        },
        {
          id: 4,
          accountId: parseInt(selectedAccountId),
          amount: 250000,
          type: 'refund',
          description: 'Pengembalian kelebihan pembayaran',
          paymentMethod: 'Bank Transfer',
          referenceNumber: 'REF-2023-00001',
          transactionDate: '2023-08-20T15:45:00Z'
        }
      ];
    },
    enabled: !!selectedAccountId,
  });

  // Calculate financial summary
  const getFinancialSummary = () => {
    const totalAccounts = accounts?.data?.length || 0;
    const totalBalance = accounts?.data?.reduce((sum, account) => sum + account.balance, 0) || 0;
    const accountsWithPositiveBalance = accounts?.data?.filter(account => account.balance > 0).length || 0;
    const accountsWithNegativeBalance = accounts?.data?.filter(account => account.balance < 0).length || 0;
    
    return {
      totalAccounts,
      totalBalance,
      accountsWithPositiveBalance,
      accountsWithNegativeBalance
    };
  };

  // Get financial summary
  const summary = getFinancialSummary();

  // Setup form for adding transaction
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      accountId: selectedAccountId ? parseInt(selectedAccountId) : 0,
      amount: 0,
      type: 'payment',
      description: '',
      paymentMethod: '',
      referenceNumber: '',
    },
  });

  // Update form when selected account changes
  React.useEffect(() => {
    if (selectedAccountId) {
      form.setValue('accountId', parseInt(selectedAccountId));
    }
  }, [selectedAccountId, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof transactionFormSchema>) => {
    try {
      await apiRequest('POST', '/api/transactions', values);
      
      // Close dialog and refresh data
      setIsAddTransactionDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      
      form.reset();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  // Define accounts table columns
  const accountColumns = [
    {
      header: 'NIM',
      accessorKey: 'student.studentId',
    },
    {
      header: 'Nama Mahasiswa',
      accessorKey: 'student.name',
      cell: (data: Account) => (
        <span className="font-medium">{data.student.name}</span>
      ),
    },
    {
      header: 'Saldo',
      accessorKey: 'balance',
      cell: (data: Account) => {
        const balance = data.balance;
        const isNegative = balance < 0;
        
        return (
          <span className={isNegative ? 'text-error' : 'text-success'}>
            Rp {Math.abs(balance).toLocaleString('id-ID')}
            {isNegative && ' (Tunggakan)'}
          </span>
        );
      },
    },
    {
      header: 'Pembayaran Terakhir',
      accessorKey: 'lastPaymentDate',
      cell: (data: Account) => (
        <span>
          {data.lastPaymentDate 
            ? format(new Date(data.lastPaymentDate), 'dd MMM yyyy', { locale: id })
            : '-'}
        </span>
      ),
    },
    {
      header: 'Aksi',
      accessorKey: 'id',
      cell: (data: Account) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedAccountId(data.id.toString())}
          >
            <Eye className="h-4 w-4 mr-2" />
            Transaksi
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedAccountId(data.id.toString());
              setIsAddTransactionDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Transaksi
          </Button>
        </div>
      ),
    },
  ];

  // Define transactions table columns
  const transactionColumns = [
    {
      header: 'Tanggal',
      accessorKey: 'transactionDate',
      cell: (data: Transaction) => (
        <span>
          {format(new Date(data.transactionDate), 'dd MMM yyyy', { locale: id })}
        </span>
      ),
    },
    {
      header: 'Deskripsi',
      accessorKey: 'description',
    },
    {
      header: 'Tipe',
      accessorKey: 'type',
      cell: (data: Transaction) => {
        let variant: 'success' | 'error' | 'info' = 'info';
        let text = 'Pengembalian';
        
        if (data.type === 'payment') {
          variant = 'success';
          text = 'Pembayaran';
        } else if (data.type === 'charge') {
          variant = 'error';
          text = 'Tagihan';
        }
        
        return <StatusBadge status={text} variant={variant} />;
      },
    },
    {
      header: 'Jumlah',
      accessorKey: 'amount',
      cell: (data: Transaction) => (
        <span className={data.type === 'charge' ? 'text-error' : 'text-success'}>
          {data.type === 'charge' ? '-' : '+'} Rp {data.amount.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      header: 'Metode Pembayaran',
      accessorKey: 'paymentMethod',
      cell: (data: Transaction) => (
        <span>{data.paymentMethod || '-'}</span>
      ),
    },
    {
      header: 'Referensi',
      accessorKey: 'referenceNumber',
      cell: (data: Transaction) => (
        <span>{data.referenceNumber || '-'}</span>
      ),
    },
    {
      header: 'Aksi',
      accessorKey: 'id',
      cell: (data: Transaction) => (
        <Button variant="ghost" size="icon" title="Lihat Detail">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  // Select the currently viewed account
  const selectedAccount = accounts?.data?.find(account => account.id.toString() === selectedAccountId);

  return (
    <AppLayout
      title="Manajemen Keuangan"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Keuangan' }
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex gap-2 items-center">
            <FileText size={16} />
            <span>Laporan Keuangan</span>
          </Button>
          
          <Dialog open={isAddTransactionDialogOpen} onOpenChange={setIsAddTransactionDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 items-center">
                <Plus size={16} />
                <span>Transaksi Baru</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tambah Transaksi Baru</DialogTitle>
                <DialogDescription>
                  Tambahkan pembayaran, tagihan, atau pengembalian dana untuk mahasiswa.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mahasiswa</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Mahasiswa" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accounts?.data?.map((account: Account) => (
                              <SelectItem key={account.id} value={account.id.toString()}>
                                {account.student.studentId} - {account.student.name}
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
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe Transaksi</FormLabel>
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
                            <SelectItem value="payment">Pembayaran</SelectItem>
                            <SelectItem value="charge">Tagihan</SelectItem>
                            <SelectItem value="refund">Pengembalian</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah (Rp)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Masukkan jumlah"
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan deskripsi transaksi"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('type') !== 'charge' && (
                    <>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Metode Pembayaran</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih Metode" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Bank Transfer">Transfer Bank</SelectItem>
                                <SelectItem value="Cash">Tunai</SelectItem>
                                <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                                <SelectItem value="Credit Card">Kartu Kredit</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="referenceNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Referensi</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan nomor referensi (opsional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
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
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-500 text-sm">Total Akun</p>
                <h3 className="text-2xl font-bold mt-1">{summary.totalAccounts}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-lg">
                <DollarSign className="text-xl text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-500 text-sm">Total Saldo</p>
                <h3 className="text-2xl font-bold mt-1">Rp {summary.totalBalance.toLocaleString('id-ID')}</h3>
              </div>
              <div className="bg-success/10 p-2 rounded-lg">
                <CreditCard className="text-xl text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-500 text-sm">Mahasiswa Lunas</p>
                <h3 className="text-2xl font-bold mt-1">{summary.accountsWithPositiveBalance}</h3>
                <p className="text-xs text-success flex items-center mt-1">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span>Lunas atau kelebihan saldo</span>
                </p>
              </div>
              <div className="bg-success/10 p-2 rounded-lg">
                <ArrowUp className="text-xl text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-500 text-sm">Mahasiswa Tunggak</p>
                <h3 className="text-2xl font-bold mt-1">{summary.accountsWithNegativeBalance}</h3>
                <p className="text-xs text-error flex items-center mt-1">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  <span>Memiliki tunggakan pembayaran</span>
                </p>
              </div>
              <div className="bg-error/10 p-2 rounded-lg">
                <ArrowDown className="text-xl text-error" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Tabs: Accounts and Transactions */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="accounts">Akun Keuangan</TabsTrigger>
          <TabsTrigger value="transactions">Riwayat Transaksi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts">
          <DataTable
            data={accounts?.data || []}
            columns={accountColumns}
            totalItems={accounts?.pagination?.total || 0}
            currentPage={page}
            pageSize={10}
            onPageChange={setPage}
            searchable={true}
            onSearch={setSearch}
            exportable={true}
            onExport={() => {
              console.log("Exporting accounts data...");
              // Implementation for exporting data
            }}
            isLoading={isLoadingAccounts}
          />
        </TabsContent>
        
        <TabsContent value="transactions">
          {selectedAccount ? (
            <div className="mb-6 space-y-6">
              <Card className="shadow-sm border border-neutral-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Detail Akun</CardTitle>
                  <CardDescription>
                    Informasi akun dan riwayat transaksi untuk mahasiswa terpilih.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-500">Mahasiswa</p>
                      <p className="text-lg font-medium">{selectedAccount.student.name}</p>
                      <p className="text-sm text-neutral-600">{selectedAccount.student.studentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Saldo</p>
                      <p className={`text-lg font-medium ${selectedAccount.balance < 0 ? 'text-error' : 'text-success'}`}>
                        Rp {Math.abs(selectedAccount.balance).toLocaleString('id-ID')}
                        {selectedAccount.balance < 0 ? ' (Tunggakan)' : ''}
                      </p>
                      <p className="text-sm text-neutral-600">
                        Pembayaran terakhir: {selectedAccount.lastPaymentDate 
                          ? format(new Date(selectedAccount.lastPaymentDate), 'dd MMMM yyyy', { locale: id })
                          : 'Belum ada pembayaran'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Riwayat Transaksi</h3>
                <Button 
                  onClick={() => setIsAddTransactionDialogOpen(true)}
                  className="flex gap-2 items-center"
                >
                  <Plus size={16} />
                  <span>Transaksi Baru</span>
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm data-table">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-600">
                      <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                      <th className="px-4 py-3 text-left font-semibold">Deskripsi</th>
                      <th className="px-4 py-3 text-left font-semibold">Tipe</th>
                      <th className="px-4 py-3 text-left font-semibold">Jumlah</th>
                      <th className="px-4 py-3 text-left font-semibold">Metode</th>
                      <th className="px-4 py-3 text-left font-semibold">Referensi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingTransactions ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-center">Loading...</td>
                      </tr>
                    ) : transactions?.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-center">Tidak ada transaksi</td>
                      </tr>
                    ) : (
                      transactions?.map((transaction: Transaction) => {
                        let statusVariant: 'success' | 'error' | 'info' = 'info';
                        let statusText = 'Pengembalian';
                        
                        if (transaction.type === 'payment') {
                          statusVariant = 'success';
                          statusText = 'Pembayaran';
                        } else if (transaction.type === 'charge') {
                          statusVariant = 'error';
                          statusText = 'Tagihan';
                        }
                        
                        return (
                          <tr key={transaction.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                            <td className="px-4 py-3">
                              {format(new Date(transaction.transactionDate), 'dd MMM yyyy', { locale: id })}
                            </td>
                            <td className="px-4 py-3 font-medium">{transaction.description}</td>
                            <td className="px-4 py-3">
                              <StatusBadge status={statusText} variant={statusVariant} />
                            </td>
                            <td className="px-4 py-3">
                              <span className={transaction.type === 'charge' ? 'text-error' : 'text-success'}>
                                {transaction.type === 'charge' ? '-' : '+'} Rp {transaction.amount.toLocaleString('id-ID')}
                              </span>
                            </td>
                            <td className="px-4 py-3">{transaction.paymentMethod || '-'}</td>
                            <td className="px-4 py-3">{transaction.referenceNumber || '-'}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-neutral-200 rounded-lg bg-white">
              <Receipt className="h-12 w-12 text-neutral-300 mb-4" />
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Pilih Akun Mahasiswa</h3>
              <p className="text-neutral-500 text-center max-w-md mb-6">
                Silakan pilih akun mahasiswa untuk melihat riwayat transaksi.
              </p>
              <Select
                value={selectedAccountId}
                onValueChange={setSelectedAccountId}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Pilih Mahasiswa" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.data?.map((account: Account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.student.studentId} - {account.student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
