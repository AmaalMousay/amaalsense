import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  CreditCard
} from 'lucide-react';

interface UserMenuProps {
  isRTL?: boolean;
}

export function UserMenu({ isRTL = false }: UserMenuProps) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const isAdmin = user.role === 'admin';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 px-2 py-1 h-auto"
        >
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/20 text-primary text-sm">
              {getInitials(user.name || 'U')}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate">
            {user.name}
          </span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isRTL ? "start" : "end"} 
        className="w-56"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.openId?.slice(0, 20)}...
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <Link href="/user-dashboard">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <LayoutDashboard className="w-4 h-4" />
            <span>{isRTL ? 'لوحة التحكم' : 'Dashboard'}</span>
          </DropdownMenuItem>
        </Link>
        
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <User className="w-4 h-4" />
            <span>{isRTL ? 'الملف الشخصي' : 'Profile'}</span>
          </DropdownMenuItem>
        </Link>
        
        <Link href="/pricing">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <CreditCard className="w-4 h-4" />
            <span>{isRTL ? 'الاشتراك' : 'Subscription'}</span>
          </DropdownMenuItem>
        </Link>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <Link href="/admin">
              <DropdownMenuItem className="cursor-pointer gap-2 text-primary">
                <Shield className="w-4 h-4" />
                <span>{isRTL ? 'لوحة الإدارة' : 'Admin Panel'}</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>{isRTL ? 'تسجيل الخروج' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
