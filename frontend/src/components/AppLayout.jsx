import { useState, useEffect } from 'react'; // Import hooks
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner";
import { Leaf, Plus, LogOut, Shield } from 'lucide-react';
import Footer from './Footer';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Đảm bảo có AvatarImage

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- SỬA ĐỔI: Dùng state để lưu userInfo ---
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo') || '{}'));

  // Lắng nghe sự kiện "userInfoUpdated" từ các trang khác
  useEffect(() => {
    const handleUserInfoUpdate = () => {
      setUserInfo(JSON.parse(localStorage.getItem('userInfo') || '{}'));
    };

    window.addEventListener('userInfoUpdated', handleUserInfoUpdate);
    return () => window.removeEventListener('userInfoUpdated', handleUserInfoUpdate);
  }, []);
  // ------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path 
    ? "text-brand-text font-semibold" 
    : "text-gray-500 hover:text-brand-sage transition-colors";

  const userInitial = userInfo.displayName ? userInfo.displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-text">
      
      {/* HEADER */}
      <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-lavender/50 rounded-full flex items-center justify-center text-brand-sage group-hover:bg-brand-sage group-hover:text-white transition-all duration-300">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xl font-medium tracking-tight text-gray-700 group-hover:text-brand-text transition-colors">
              Depression Helper
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <Link to="/mood" className={`text-sm font-medium ${isActive('/mood')}`}>Mood Check</Link>
            <Link to="/journal" className={`text-sm font-medium ${isActive('/journal')}`}>Journal</Link>
            <Link to="/library" className={`text-sm font-medium ${isActive('/library')}`}>Library</Link>
          </nav>

          <div className="flex items-center gap-4">
             <Link to="/journal">
              <Button className="bg-brand-sage hover:bg-[#8BC4A0] text-white rounded-full px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 hidden sm:flex">
                <Plus className="w-4 h-4 mr-2" /> New Entry
              </Button>
            </Link>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-brand-lavender/50 hover:ring-brand-sage transition-all p-0">
                  <Avatar className="h-10 w-10">
                    {/* --- HIỂN THỊ ẢNH AVATAR NẾU CÓ --- */}
                    <AvatarImage src={userInfo.avatar} className="object-cover" />
                    <AvatarFallback className="bg-brand-bg text-brand-text font-bold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userInfo.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userInfo.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/profile">Hồ sơ cá nhân</Link>
                </DropdownMenuItem>
                {userInfo && userInfo.isAdmin && (
                  <DropdownMenuItem asChild className="cursor-pointer text-red-600">
                    <Link to="/admin">Trang Quản trị</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full animate-in fade-in duration-500">
        <Outlet />
      </main>

      <Footer />
      <Toaster />
    </div>
  );
};

export default AppLayout;