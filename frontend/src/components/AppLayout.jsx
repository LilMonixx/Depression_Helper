import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner";
import { Leaf, Plus, LogOut, Shield } from 'lucide-react';
import Footer from './Footer';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path 
    ? "text-brand-text font-semibold" 
    : "text-gray-500 hover:text-brand-sage transition-colors";

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-text">
      
      {/* --- HEADER --- */}
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
            <Link to="/library" className={`text-sm font-medium ${isActive('/library')}`}>Prompts</Link>
             <Link to="/profile" className={`text-sm font-medium ${isActive('/profile')}`}>Profile</Link>
          </nav>

          <div className="flex items-center gap-3">
            {userInfo && userInfo.isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Shield className="w-4 h-4 mr-1" /> Admin
                </Button>
              </Link>
            )}

            <Link to="/journal">
              <Button className="bg-brand-sage hover:bg-[#8BC4A0] text-white rounded-full px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                <Plus className="w-4 h-4 mr-2" /> New Entry
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 hover:bg-transparent ml-2"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- NỘI DUNG CHÍNH (ĐÃ SỬA: Xóa container giới hạn) --- */}
      <main className="flex-1 w-full animate-in fade-in duration-500">
        <Outlet />
      </main>

      <Footer />
      <Toaster />
    </div>
  );
};

export default AppLayout;