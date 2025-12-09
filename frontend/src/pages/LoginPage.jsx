import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Leaf, Loader2 } from "lucide-react";
import heroBg from '@/assets/image/hero-bg.jpg';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- LOGIC HỨNG TOKEN TỪ GOOGLE / FACEBOOK ---
  useEffect(() => {
    // Kiểm tra URL xem có ?token=... không
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // 1. Lưu token vào localStorage
      localStorage.setItem("token", token);
      
      // 2. Gọi API lấy thông tin user để lưu vào localStorage
      axios.get('http://localhost:5001/api/users/profile', {
         headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
         localStorage.setItem("userInfo", JSON.stringify(res.data));
         toast.success("Đăng nhập thành công!");
         navigate("/"); // Chuyển về trang chủ
      }).catch(err => {
         console.error(err);
         toast.error("Lỗi khi xác thực tài khoản.");
      });
    }
  }, []);
  // ---------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        toast.success("Đăng nhập thành công! Chào mừng bạn trở lại.");
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng nhập thất bại.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      
      {/* CỘT TRÁI: ẢNH & QUOTE */}
      <div className="hidden lg:flex relative h-full flex-col bg-muted text-white p-10 dark:border-r">
        <div className="absolute inset-0 z-0">
           <img src={heroBg} alt="Background" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-brand-text/40 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mr-2">
             <Leaf className="w-4 h-4 text-white" />
          </div>
          Depression Helper
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-light leading-relaxed">
              &ldquo;Hạnh phúc không phải là không có vấn đề, mà là khả năng đối phó với chúng. Hãy để chúng tôi đồng hành cùng bạn.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* CỘT PHẢI: FORM */}
      <div className="flex items-center justify-center py-12 bg-brand-bg">
        <div className="mx-auto grid w-[350px] gap-6">
          
          <Link to="/" className="absolute top-8 right-8 md:top-8 md:left-auto">
             <Button variant="ghost" className="text-gray-500 hover:text-brand-sage">
                <ArrowLeft className="w-4 h-4 mr-2" /> Trang chủ
             </Button>
          </Link>

          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-brand-text">Chào mừng trở lại</h1>
            <p className="text-gray-500 text-sm">
              Nhập email hoặc sử dụng tài khoản xã hội
            </p>
          </div>

          {/* FORM ĐĂNG NHẬP THƯỜNG */}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ten@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-brand-lavender focus-visible:ring-brand-sage"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link to="#" className="ml-auto inline-block text-xs underline text-gray-400 hover:text-brand-sage">
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-brand-lavender focus-visible:ring-brand-sage"
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-brand-sage hover:bg-[#8BC4A0] text-white font-bold h-10 transition-all" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Đăng nhập"}
            </Button>
          </form>

          {/* PHÂN CÁCH */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-brand-bg px-2 text-gray-500">Hoặc tiếp tục với</span>
            </div>
          </div>

          {/* CÁC NÚT SOCIAL LOGIN */}
          <div className="grid gap-2">
            
            {/* Nút Google */}
            <a href="http://localhost:5001/api/auth/google" className="w-full">
              <Button variant="outline" type="button" className="w-full border-brand-lavender bg-white hover:bg-gray-50 text-gray-700 h-10 font-medium">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
            </a>

            {/* Nút Facebook */}
            <a href="http://localhost:5001/api/auth/facebook" className="w-full">
              <Button variant="outline" type="button" className="w-full border-[#1877F2] bg-[#1877F2] hover:bg-[#166fe5] text-white h-10 font-medium">
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.416h3.918l-.577 3.629h-3.341v7.933h-4.845z"/>
                </svg>
                Facebook
              </Button>
            </a>

          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="underline font-semibold text-brand-sage hover:text-brand-text">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;