import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Users, User, BookOpen, Calendar, GraduationCap, 
  FileText, CreditCard, BarChart3, Database, LogOut,
  LayoutDashboard, ChevronLeft, Menu, Settings
} from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { ScrollArea } from './scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'Mahasiswa', href: '/mahasiswa', icon: <Users className="h-5 w-5" /> },
  { name: 'Dosen', href: '/dosen', icon: <User className="h-5 w-5" /> },
  { name: 'Mata Kuliah', href: '/mata-kuliah', icon: <BookOpen className="h-5 w-5" /> },
  { name: 'Jadwal', href: '/jadwal', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Nilai', href: '/nilai', icon: <GraduationCap className="h-5 w-5" /> },
  { name: 'Absensi', href: '/absensi', icon: <FileText className="h-5 w-5" /> },
];

const secondaryNavItems: NavItem[] = [
  { name: 'Keuangan', href: '/keuangan', icon: <CreditCard className="h-5 w-5" /> },
  { name: 'Dokumen', href: '/dokumen', icon: <FileText className="h-5 w-5" /> },
  { name: 'PDDikti', href: '/pddikti', icon: <Database className="h-5 w-5" /> },
  { name: 'Laporan', href: '/laporan', icon: <BarChart3 className="h-5 w-5" /> },
  { name: 'Pengaturan', href: '/pengaturan', icon: <Settings className="h-5 w-5" /> },
];

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = location === item.href;

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href}>
              <Button 
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 px-3",
                  collapsed ? "h-10 w-10 justify-center p-0" : "",
                  isActive ? "bg-primary text-primary-foreground" : ""
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">
              {item.name}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div 
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300", 
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-bold">SIAKAD</h2>
          </div>
        )}
        <Button 
          variant="ghost" 
          className={cn("h-8 w-8 p-0", collapsed && "mx-auto")} 
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <div className="px-3 py-2">
          {!collapsed && (
            <div className="mb-2">
              <h3 className="px-4 text-xs font-semibold text-muted-foreground">
                Menu Utama
              </h3>
            </div>
          )}
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </div>
          
          {!collapsed && (
            <div className="mt-6 mb-2">
              <h3 className="px-4 text-xs font-semibold text-muted-foreground">
                Menu Lainnya
              </h3>
            </div>
          )}
          {collapsed && <div className="my-6 border-t mx-2"></div>}
          <div className="space-y-1">
            {secondaryNavItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto p-3 border-t">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start gap-3 px-3 text-red-500 hover:text-red-600 hover:bg-red-50",
                  collapsed ? "h-10 w-10 justify-center p-0" : ""
                )}
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5" />
                {!collapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}