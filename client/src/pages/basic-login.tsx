import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Database, Users, User, GraduationCap, 
  School, CheckCircle2, Calendar, FileText 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BasicLoginPage() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Registration form state
  const [fullName, setFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isRegLoading, setIsRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Validasi gagal",
        description: "Username dan password harus diisi",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login gagal');
      }
      
      const user = await response.json();
      
      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${user.fullName}`,
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !regUsername || !email || !regPassword || !confirmPassword) {
      toast({
        title: "Validasi gagal",
        description: "Semua field harus diisi",
        variant: "destructive"
      });
      return;
    }
    
    if (regPassword !== confirmPassword) {
      toast({
        title: "Validasi gagal",
        description: "Password dan konfirmasi password tidak cocok",
        variant: "destructive"
      });
      return;
    }
    
    setIsRegLoading(true);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          username: regUsername,
          email,
          password: regPassword,
          role
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registrasi gagal');
      }
      
      const user = await response.json();
      
      toast({
        title: "Registrasi berhasil",
        description: `Akun Anda berhasil dibuat, ${user.fullName}`,
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Registrasi gagal",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRegLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login/Register Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === 'login' ? 'Login ke Sistem' : 'Buat Akun Baru'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'login'
                ? 'Masuk ke sistem akademik untuk akses penuh'
                : 'Daftar untuk mendapatkan akun sistem akademik'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username Anda"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Lupa Password?
                      </a>
                    </div>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password Anda"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Memproses...' : 'Masuk ke Sistem'}
                  </Button>
                </form>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>Belum memiliki akun? <span 
                    className="text-primary font-medium hover:underline cursor-pointer"
                    onClick={() => setActiveTab('register')}
                  >
                    Daftar Sekarang
                  </span></p>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nama lengkap Anda"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regUsername">Username</Label>
                    <div className="relative">
                      <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="regUsername"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="Username untuk login"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Anda"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Peran</Label>
                    <Select 
                      value={role} 
                      onValueChange={setRole}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih peran Anda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Mahasiswa</SelectItem>
                        <SelectItem value="faculty">Dosen</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regPassword">Password</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="regPassword"
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Password minimal 6 karakter"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <div className="relative">
                      <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Konfirmasi password Anda"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    type="submit" 
                    disabled={isRegLoading}
                  >
                    {isRegLoading ? 'Memproses...' : 'Daftar Akun Baru'}
                  </Button>
                </form>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>Sudah memiliki akun? <span 
                    className="text-primary font-medium hover:underline cursor-pointer"
                    onClick={() => setActiveTab('login')}
                  >
                    Login Sekarang
                  </span></p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Hero Image/Information */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-primary to-blue-700 p-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center mb-6">
            <School className="h-10 w-10 mr-4 text-white" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              SIAKAD PDDikti
            </h1>
          </div>
          
          <p className="text-xl mb-10 font-light">
            Platform komprehensif untuk manajemen akademik perguruan tinggi dengan integrasi lengkap PDDikti.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 mb-8">
            <h3 className="text-lg font-medium mb-4">Fitur Utama</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 mr-3">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Manajemen Data Terpadu</h4>
                  <p className="text-sm opacity-80">Kelola mahasiswa, dosen, dan mata kuliah</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 mr-3">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Penjadwalan & Kehadiran</h4>
                  <p className="text-sm opacity-80">Sistem absensi dan jadwal otomatis</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 mr-3">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Administrasi Akademik</h4>
                  <p className="text-sm opacity-80">Nilai, transkip, dan kelengkapan dokumen</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 mr-3">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Sinkronisasi PDDikti</h4>
                  <p className="text-sm opacity-80">Terintegrasi langsung dengan Neo Feeder</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-light">
              © 2025 SIAKAD PDDikti • Solusi Terdepan untuk Perguruan Tinggi Indonesia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}