import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner";

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Hàm kiểm tra link đang active để đổi màu
  const isActive = (path) => location.pathname === path 
    ? "bg-brand-sage text-brand-text font-semibold shadow-sm" 
    : "text-gray-600 hover:bg-brand-lavender hover:text-brand-text";

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-text">
      
      {/* --- HEADER / NAVBAR --- */}
      <header className="sticky top-0 z-50 w-full border-b border-brand-lavender bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo / Tên App */}
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-bold text-brand-text tracking-tight flex items-center gap-2">
              <span className="text-2xl">🌿</span> Depression Helper
            </Link>
          </div>

          {/* Menu điều hướng (Desktop) */}
          {/* Menu điều hướng (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Nút Trang chủ */}
            <Link to="/" className={`px-4 py-2 rounded-md transition-all ${isActive('/')}`}>
              Trang chủ
            </Link>
            {/* Nút Nhật ký */}
            <Link to="/journal" className={`px-4 py-2 rounded-md transition-all ${isActive('/journal')}`}>
              Nhật ký
            </Link>
            
            <Link to="/mood" className={`px-4 py-2 rounded-md transition-all ${isActive('/mood')}`}>
              Cảm xúc
            </Link>
            <Link to="/library" className={`px-4 py-2 rounded-md transition-all ${isActive('/library')}`}>
              Thư viện
            </Link>
          </nav>

          {/* Nút Đăng xuất */}
          <Button variant="ghost" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600 transition-colors">
            Đăng xuất
          </Button>
        </div>
      </header>

      {/* --- NỘI DUNG CHÍNH (Thay đổi theo trang) --- */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl animate-fade-in">
        <Outlet /> {/* Đây là nơi các trang con sẽ hiển thị */}
      </main>

      {/* Footer nhỏ */}
      <footer className="py-6 text-center text-sm text-gray-400">
        <p>© 2025 Depression Helper. Một không gian chữa lành.</p>
      </footer>

      <Toaster />
    </div>
  );
};

export default AppLayout;