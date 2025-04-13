import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertUserSchema } from '@shared/schema';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, BookOpen, Database, Users, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userRoles } from '@shared/schema';

// Login schema
const loginSchema = z.object({
  username: z.string().min(3, {
    message: 'Username harus minimal 3 karakter',
  }),
  password: z.string().min(6, {
    message: 'Password harus minimal 6 karakter',
  }),
});

// Registration schema (extending the insertUserSchema)
const registrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, {
    message: 'Konfirmasi password harus minimal 6 karakter',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password dan konfirmasi password tidak cocok',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect to dashboard if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Registration form
  const registrationForm = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      fullName: '',
      role: 'student',
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegistrationFormData) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-50">
      {/* Left side - Auth forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md shadow-lg border-neutral-200">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-6">
              <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white mr-3">
                <span className="font-bold text-xl">SI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">SIAKAD</h1>
                <p className="text-sm text-neutral-500">PDDikti Integrated</p>
              </div>
            </div>
            
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Masukkan password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memproses...
                        </>
                      ) : 'Login'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register" className="mt-4">
                <Form {...registrationForm}>
                  <form onSubmit={registrationForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registrationForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nama lengkap" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registrationForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Masukkan email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registrationForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registrationForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peran</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih peran" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={userRoles.STUDENT}>Mahasiswa</SelectItem>
                              <SelectItem value={userRoles.FACULTY}>Dosen</SelectItem>
                              <SelectItem value={userRoles.STAFF}>Staff</SelectItem>
                              <SelectItem value={userRoles.ADMIN}>Administrator</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registrationForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Masukkan password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registrationForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Konfirmasi Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Konfirmasi password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memproses...
                        </>
                      ) : 'Daftar'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
      
      {/* Right side - Hero section */}
      <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center p-8">
        <div className="max-w-lg text-white">
          <h1 className="text-4xl font-bold mb-4">SIAKAD</h1>
          <h2 className="text-2xl font-semibold mb-6">Sistem Informasi Akademik Terintegrasi dengan PDDikti</h2>
          <p className="mb-8 text-white/80">
            Manajemen akademik yang efisien dengan integrasi penuh ke sistem PDDikti untuk
            perguruan tinggi di Indonesia. Kelola mahasiswa, dosen, mata kuliah, dan semua kebutuhan
            akademik dalam satu platform terpadu.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-white/10 p-2 rounded-lg mr-3">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Manajemen Mahasiswa</h3>
                <p className="text-sm text-white/70">Pencatatan dan pemantauan data mahasiswa</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/10 p-2 rounded-lg mr-3">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Manajemen Dosen</h3>
                <p className="text-sm text-white/70">Pengelolaan data dan aktivitas dosen</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/10 p-2 rounded-lg mr-3">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Kurikulum & Mata Kuliah</h3>
                <p className="text-sm text-white/70">Pengelolaan mata kuliah dan jadwal</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/10 p-2 rounded-lg mr-3">
                <Database size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Integrasi PDDikti</h3>
                <p className="text-sm text-white/70">Sinkronisasi dengan database nasional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
