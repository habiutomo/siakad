import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Database, Users, User } from 'lucide-react';

export default function SimpleAuthPage() {
  const [activeTab, setActiveTab] = React.useState('login');

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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Username
                    </label>
                    <Input
                      id="username"
                      placeholder="Username Anda"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password Anda"
                    />
                  </div>
                  <Button className="w-full mt-4">
                    Login
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="reg-fullname" className="text-sm font-medium">
                      Nama Lengkap
                    </label>
                    <Input
                      id="reg-fullname"
                      placeholder="Nama lengkap Anda"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reg-username" className="text-sm font-medium">
                      Username
                    </label>
                    <Input
                      id="reg-username"
                      placeholder="Username untuk login"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reg-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="Email Anda"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reg-password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Password minimal 6 karakter"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reg-confirm-password" className="text-sm font-medium">
                      Konfirmasi Password
                    </label>
                    <Input
                      id="reg-confirm-password"
                      type="password"
                      placeholder="Konfirmasi password Anda"
                    />
                  </div>
                  <Button className="w-full mt-4">
                    Register
                  </Button>
                </div>
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