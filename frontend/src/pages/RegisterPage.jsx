import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Leaf, Loader2 } from "lucide-react";
import heroBg from '@/assets/image/hero-bg.jpg';

const RegisterPage = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/api/auth/register", {
        displayName,
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        toast.success("Tạo tài khoản thành công!");
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng ký thất bại.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      
      {/* --- CỘT TRÁI: HÌNH ẢNH & THÔNG ĐIỆP --- */}
      <div className="hidden lg:flex relative h-full flex-col bg-muted text-white p-10 dark:border-r">
        <div className="absolute inset-0 z-0">
           <img src={heroBg} alt="Background" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-brand-text/50 mix-blend-multiply"></div>
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
              &ldquo;Hành trình vạn dặm bắt đầu từ một bước chân. Cảm ơn bạn đã dũng cảm bắt đầu hành trình chữa lành cùng chúng tôi.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* --- CỘT PHẢI: FORM ĐĂNG KÝ --- */}
      <div className="flex items-center justify-center py-12 bg-brand-bg">
        <div className="mx-auto grid w-[350px] gap-6">
          
          <Link to="/" className="absolute top-8 right-8 md:top-8 md:left-auto">
             <Button variant="ghost" className="text-gray-500 hover:text-brand-sage">
                <ArrowLeft className="w-4 h-4 mr-2" /> Trang chủ
             </Button>
          </Link>

          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-brand-text">Tạo tài khoản mới</h1>
            <p className="text-gray-500 text-sm">
              Nhập thông tin bên dưới để bắt đầu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên hiển thị</Label>
              <Input
                id="name"
                placeholder="Tên của bạn"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-white border-brand-lavender focus-visible:ring-brand-sage"
                required
              />
            </div>
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
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ít nhất 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-brand-lavender focus-visible:ring-brand-sage"
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-brand-sage hover:bg-[#8BC4A0] text-white font-bold h-10 transition-all" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Tạo tài khoản"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <Link to="/login" className="underline font-semibold text-brand-sage hover:text-brand-text">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;