import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin user từ localStorage để kiểm tra quyền Admin
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const handleLogout = () => {
    // Xóa token và thông tin user khi đăng xuất
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  // Hàm kiểm tra link đang active để đổi màu (Highlight)
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
          <nav className="hidden md:flex items-center gap-1">
            {/* Link Trang chủ (Dashboard) */}
            <Link to="/" className={`px-4 py-2 rounded-md transition-all ${isActive('/')}`}>
              Trang chủ
            </Link>

            {/* Link Nhật ký */}
            <Link to="/journal" className={`px-4 py-2 rounded-md transition-all ${isActive('/journal')}`}>
              Nhật ký
            </Link>

            {/* Link Cảm xúc */}
            <Link to="/mood" className={`px-4 py-2 rounded-md transition-all ${isActive('/mood')}`}>
              Cảm xúc
            </Link>

            {/* Link Thư viện */}
            <Link to="/library" className={`px-4 py-2 rounded-md transition-all ${isActive('/library')}`}>
              Thư viện
            </Link>
            {/* Link Hồ sơ cá nhân */}
            <Link to="/profile" className={`px-4 py-2 rounded-md transition-all ${isActive('/profile')}`}>
              Hồ sơ
            </Link>

            {/* Link Admin - CHỈ HIỆN KHI LÀ ADMIN */}
            {userInfo && userInfo.isAdmin && (
              <Link to="/admin" className={`px-4 py-2 rounded-md transition-all ${isActive('/admin')} text-red-500 font-bold hover:bg-red-50`}>
                Admin
              </Link>
            )}
          </nav>

          {/* Nút Đăng xuất */}
          <Button variant="ghost" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600 transition-colors">
            Đăng xuất
          </Button>
        </div>
      </header>

      {/* --- NỘI DUNG CHÍNH (Thay đổi theo trang) --- */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl animate-fade-in">
        <Outlet /> {/* Đây là nơi các trang con (Home, Journal, Mood...) sẽ hiển thị */}
      </main>

      {/* Footer nhỏ */}
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-brand-lavender/30 mt-auto">
        <p>© 2025 Depression Helper. Một không gian chữa lành dành cho bạn.</p>
      </footer>

    </div>
  );
};

export default AppLayout;