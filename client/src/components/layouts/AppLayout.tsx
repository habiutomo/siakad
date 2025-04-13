import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { 
  BarChart3,
  BookOpen,
  Calendar,
  CheckSquare,
  Database,
  FolderOpen,
  RefreshCw,
  Search,
  Settings,
  User,
  UserPlus,
  Users,
  BellRing,
  Menu,
  DollarSign,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  current: boolean;
};

function SidebarLink({ href, icon, children, current }: SidebarLinkProps) {
  return (
    <Link href={href}>
      <a className={cn(
        "flex items-center px-4 py-2 text-white",
        current ? "bg-primary-light" : "hover:bg-primary-light"
      )}>
        <span className="mr-3 text-lg">{icon}</span>
        <span>{children}</span>
      </a>
    </Link>
  );
}

type AppLayoutProps = {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
};

export function AppLayout({ children, title, breadcrumbs = [], actions }: AppLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Generate user initials from full name
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = user ? getUserInitials(user.fullName) : 'US';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className={cn(
        "bg-primary text-white",
        mobileMenuOpen ? "fixed inset-y-0 left-0 z-50 w-64" : "hidden md:flex md:flex-col md:w-64"
      )}>
        <div className="flex items-center justify-center p-4 border-b border-primary-light">
          <div className="h-10 w-10 bg-white rounded flex items-center justify-center mr-3">
            <span className="text-primary font-bold text-lg">SI</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">SIAKAD</h1>
            <p className="text-xs opacity-80">PDDikti Integrated</p>
          </div>
        </div>
        
        {/* User Profile Preview */}
        <div className="p-4 border-b border-primary-light">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold">
              <span>{userInitials}</span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">{user?.fullName}</p>
              <p className="text-xs opacity-70">{user?.role}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-accent uppercase tracking-wider">
            Menu Utama
          </div>
          <SidebarLink href="/" icon={<Home size={18} />} current={location === '/'}>
            Dashboard
          </SidebarLink>
          
          <div className="mt-4 px-4 mb-2 text-xs font-semibold text-accent uppercase tracking-wider">
            Akademik
          </div>
          <SidebarLink href="/mahasiswa" icon={<User size={18} />} current={location === '/mahasiswa'}>
            Mahasiswa
          </SidebarLink>
          <SidebarLink href="/dosen" icon={<Users size={18} />} current={location === '/dosen'}>
            Dosen
          </SidebarLink>
          <SidebarLink href="/mata-kuliah" icon={<BookOpen size={18} />} current={location === '/mata-kuliah'}>
            Mata Kuliah
          </SidebarLink>
          <SidebarLink href="/jadwal" icon={<Calendar size={18} />} current={location === '/jadwal'}>
            Jadwal Kuliah
          </SidebarLink>
          <SidebarLink href="/nilai" icon={<BarChart3 size={18} />} current={location === '/nilai'}>
            Nilai
          </SidebarLink>
          <SidebarLink href="/absensi" icon={<CheckSquare size={18} />} current={location === '/absensi'}>
            Absensi
          </SidebarLink>
          
          <div className="mt-4 px-4 mb-2 text-xs font-semibold text-accent uppercase tracking-wider">
            Administrasi
          </div>
          <SidebarLink href="/keuangan" icon={<DollarSign size={18} />} current={location === '/keuangan'}>
            Keuangan
          </SidebarLink>
          <SidebarLink href="/dokumen" icon={<FolderOpen size={18} />} current={location === '/dokumen'}>
            Dokumen
          </SidebarLink>
          
          <div className="mt-4 px-4 mb-2 text-xs font-semibold text-accent uppercase tracking-wider">
            PDDikti Integration
          </div>
          <SidebarLink href="/pddikti" icon={<Database size={18} />} current={location === '/pddikti'}>
            Neo Feeder
          </SidebarLink>
          
          <div className="mt-4 px-4 mb-2 text-xs font-semibold text-accent uppercase tracking-wider">
            Pengaturan
          </div>
          <SidebarLink href="/pengguna" icon={<UserPlus size={18} />} current={location === '/pengguna'}>
            Pengguna
          </SidebarLink>
          <SidebarLink href="/pengaturan" icon={<Settings size={18} />} current={location === '/pengaturan'}>
            Sistem
          </SidebarLink>
        </nav>
        
        {/* Version Info */}
        <div className="p-4 text-xs opacity-70 border-t border-primary-light">
          <p>SIAKAD v2.5.1</p>
          <p>© 2023 PDDikti Integrated</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header (Navbar) */}
        <header className="bg-white border-b border-neutral-200 py-2 px-4 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-neutral-600 p-2"
            onClick={toggleMobileMenu}
          >
            <Menu size={20} />
          </button>
          
          {/* Search Bar */}
          <div className="flex-1 mx-4 hidden md:block">
            <div className="relative max-w-lg">
              <Input
                type="text"
                className="w-full pl-10 pr-4 py-2"
                placeholder="Cari mahasiswa, dosen, mata kuliah..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-neutral-400" size={16} />
              </div>
            </div>
          </div>
          
          {/* Actions Area */}
          <div className="flex items-center gap-3">
            {/* Sync with PDDikti button */}
            <Button 
              variant="secondary" 
              size="sm" 
              className="hidden md:flex items-center gap-1 bg-accent text-white hover:bg-accent-dark"
            >
              <RefreshCw size={14} />
              <span>Sync PDDikti</span>
            </Button>
          
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full">
                <BellRing size={18} />
                <span className="absolute top-1 right-1 w-4 h-4 bg-error rounded-full text-white text-xs flex items-center justify-center">3</span>
              </button>
            </div>
            
            {/* User dropdown */}
            <div className="relative">
              <button 
                className="flex items-center text-neutral-600"
                onClick={handleLogout}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <span>{userInitials}</span>
                </div>
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4">
          {/* Page Header with Breadcrumbs */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-neutral-500 mb-2">
              <Link href="/">
                <a className="hover:text-primary">Home</a>
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <span className="mx-1">/</span>
                  {crumb.href ? (
                    <Link href={crumb.href}>
                      <a className="hover:text-primary">{crumb.label}</a>
                    </Link>
                  ) : (
                    <span className="text-neutral-800">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </div>
          
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-2 py-2 flex items-center justify-around z-50">
        <Link href="/">
          <a className="flex flex-col items-center p-2 text-primary">
            <Home size={18} />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
        </Link>
        <Link href="/mahasiswa">
          <a className={cn(
            "flex flex-col items-center p-2",
            location === '/mahasiswa' ? "text-primary" : "text-neutral-500"
          )}>
            <User size={18} />
            <span className="text-xs mt-1">Mahasiswa</span>
          </a>
        </Link>
        <Link href="/dosen">
          <a className={cn(
            "flex flex-col items-center p-2",
            location === '/dosen' ? "text-primary" : "text-neutral-500"
          )}>
            <Users size={18} />
            <span className="text-xs mt-1">Dosen</span>
          </a>
        </Link>
        <Link href="/mata-kuliah">
          <a className={cn(
            "flex flex-col items-center p-2",
            location === '/mata-kuliah' ? "text-primary" : "text-neutral-500"
          )}>
            <BookOpen size={18} />
            <span className="text-xs mt-1">Mata Kuliah</span>
          </a>
        </Link>
        <button onClick={toggleMobileMenu} className="flex flex-col items-center p-2 text-neutral-500">
          <Menu size={18} />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </nav>
    </div>
  );
}
