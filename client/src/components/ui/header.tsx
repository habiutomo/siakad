import React from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './dropdown-menu';

interface HeaderProps {
  user: {
    fullName: string;
    role: string;
  };
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-card px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 lg:gap-4 w-full">
        <form className="hidden md:flex-1 md:flex max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari di sistem..."
              className="w-full bg-background pl-8"
            />
          </div>
        </form>
        <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  3
                </span>
                <span className="sr-only">Notifikasi</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-auto">
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start py-3">
                  <div className="font-medium">Mata Kuliah Baru</div>
                  <div className="text-sm text-muted-foreground">Mata kuliah Algoritma & Pemrograman telah ditambahkan</div>
                  <div className="text-xs text-muted-foreground mt-1">Baru saja</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start py-3">
                  <div className="font-medium">Jadwal Diperbarui</div>
                  <div className="text-sm text-muted-foreground">Jadwal Kalkulus II telah diubah ke ruangan 3.2</div>
                  <div className="text-xs text-muted-foreground mt-1">30 menit yang lalu</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start py-3">
                  <div className="font-medium">Sinkronisasi PDDikti</div>
                  <div className="text-sm text-muted-foreground">Data mahasiswa berhasil disinkronkan ke PDDikti</div>
                  <div className="text-xs text-muted-foreground mt-1">2 jam yang lalu</div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-center text-primary">
                Lihat Semua Notifikasi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                <UserCircle className="h-6 w-6" />
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="font-medium">{user.fullName}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profil</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Pengaturan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-500" onClick={onLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}