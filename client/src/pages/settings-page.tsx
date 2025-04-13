import React from 'react';
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
import {
  Settings,
  Database,
  UserCog,
  Globe,
  Server,
  Bell,
  Shield,
  Lock,
  Mail,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'wouter';

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: 'Pengaturan Umum',
      description: 'Konfigurasi umum aplikasi SIAKAD',
      icon: <Settings className="h-6 w-6 text-gray-500" />,
      link: '/settings/general',
    },
    {
      title: 'Pengaturan PDDikti',
      description: 'Konfigurasi integrasi dengan Neo Feeder PDDikti',
      icon: <Database className="h-6 w-6 text-blue-500" />,
      link: '/settings/pddikti',
    },
    {
      title: 'Pengaturan Pengguna',
      description: 'Manajemen pengguna dan hak akses',
      icon: <UserCog className="h-6 w-6 text-green-500" />,
      link: '/settings/users',
    },
    {
      title: 'Pengaturan Institusi',
      description: 'Informasi dasar dan branding institusi',
      icon: <Globe className="h-6 w-6 text-purple-500" />,
      link: '/settings/institution',
    },
    {
      title: 'Pengaturan Server',
      description: 'Konfigurasi server dan database',
      icon: <Server className="h-6 w-6 text-red-500" />,
      link: '/settings/server',
    },
    {
      title: 'Notifikasi',
      description: 'Pengaturan notifikasi email dan SMS',
      icon: <Bell className="h-6 w-6 text-yellow-500" />,
      link: '/settings/notifications',
    },
    {
      title: 'Keamanan',
      description: 'Pengaturan keamanan dan autentikasi',
      icon: <Shield className="h-6 w-6 text-orange-500" />,
      link: '/settings/security',
    },
    {
      title: 'Kontrol Akses',
      description: 'Manajemen peran dan izin',
      icon: <Lock className="h-6 w-6 text-indigo-500" />,
      link: '/settings/access',
    },
    {
      title: 'Email',
      description: 'Konfigurasi SMTP dan template email',
      icon: <Mail className="h-6 w-6 text-cyan-500" />,
      link: '/settings/email',
    },
    {
      title: 'Log Sistem',
      description: 'Lihat dan unduh log sistem',
      icon: <FileText className="h-6 w-6 text-gray-500" />,
      link: '/settings/logs',
    },
  ];

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan Sistem</h1>
          <p className="text-muted-foreground">
            Konfigurasi sistem SIAKAD dan integrasi eksternal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsCategories.map((category, index) => (
            <Link key={index} href={category.link}>
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">{category.title}</CardTitle>
                  {category.icon}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between">
                    Buka Pengaturan <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </LayoutWithSidebar>
  );
}