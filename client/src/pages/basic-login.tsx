import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Database, Users, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
                    <label htmlFor="username" className="text-sm font-medium">
                      Username
                    </label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username Anda"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password Anda"
                      required
                    />
                  </div>
                  <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">
                      Nama Lengkap
                    </label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="regUsername" className="text-sm font-medium">
                      Username
                    </label>
                    <Input
                      id="regUsername"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="Username untuk login"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Anda"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      Peran
                    </label>
                    <select 
                      id="role" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="student">Mahasiswa</option>
                      <option value="faculty">Dosen</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="regPassword" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="regPassword"
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Password minimal 6 karakter"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Konfirmasi Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi password Anda"
                      required
                    />
                  </div>
                  <Button className="w-full mt-4" type="submit" disabled={isRegLoading}>
                    {isRegLoading ? 'Loading...' : 'Register'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Hero Image/Information */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-primary p-12 text-white">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold mb-6">Sistem Informasi Akademik</h1>
          <p className="text-lg mb-8">
            Platform lengkap untuk manajemen akademik perguruan tinggi dengan integrasi PDDikti.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start">
              <Users className="h-6 w-6 mr-2" />
              <div>
                <h3 className="font-medium">Manajemen Mahasiswa</h3>
                <p className="text-sm opacity-80">Kelola data mahasiswa dengan mudah</p>
              </div>
            </div>
            <div className="flex items-start">
              <User className="h-6 w-6 mr-2" />
              <div>
                <h3 className="font-medium">Data Dosen</h3>
                <p className="text-sm opacity-80">Administrasi dosen terintegrasi</p>
              </div>
            </div>
            <div className="flex items-start">
              <BookOpen className="h-6 w-6 mr-2" />
              <div>
                <h3 className="font-medium">Kurikulum</h3>
                <p className="text-sm opacity-80">Pengelolaan mata kuliah & jadwal</p>
              </div>
            </div>
            <div className="flex items-start">
              <Database className="h-6 w-6 mr-2" />
              <div>
                <h3 className="font-medium">Integrasi PDDikti</h3>
                <p className="text-sm opacity-80">Sinkronisasi data otomatis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}