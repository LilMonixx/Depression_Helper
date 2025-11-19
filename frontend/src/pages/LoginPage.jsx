import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  // --- PHẦN LOGIC XỬ LÝ ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Để hiển thị lỗi
  const navigate = useNavigate(); // Để điều hướng sau khi đăng nhập

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form reload lại trang
    setError(""); // Xóa lỗi cũ

    try {
      // 1. Gọi API backend
      const response = await axios.post(
        "http://localhost:5001/api/auth/login", // URL của API đăng nhập
        {
          email,
          password,
        }
      );

      // 2. Nếu thành công, lưu token vào localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        
        // 3. Điều hướng về trang chủ
        navigate("/");
      }

    } catch (err) {
      // 4. Nếu lỗi, hiển thị thông báo
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };
  // --- KẾT THÚC PHẦN LOGIC ---

  return (
    // Sử dụng màu nền 'brand-bg' (Trắng ngà)
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Chào mừng trở lại</CardTitle>
          <CardDescription>
            Đăng nhập để tiếp tục hành trình của bạn.
          </CardDescription>
        </CardHeader>
        
        {/* Kết nối form với hàm handleSubmit */}
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email} // Kết nối state
                  onChange={(e) => setEmail(e.target.value)} // Cập nhật state
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mật khẩu của bạn"
                  value={password} // Kết nối state
                  onChange={(e) => setPassword(e.target.value)} // Cập nhật state
                />
              </div>
              
              {/* Hiển thị lỗi nếu có */}
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            {/* Sử dụng màu 'brand-sage' cho nút bấm */}
            <Button 
              type="submit" 
              className="w-full bg-brand-sage text-brand-text hover:bg-brand-sage/90"
            >
              Đăng nhập
            </Button>
            <p className="text-sm text-center w-full">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;