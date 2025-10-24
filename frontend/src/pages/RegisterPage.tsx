import { useState } from "react"; // <-- IMPORT 1
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
import { Link, useNavigate } from "react-router-dom"; // <-- IMPORT 2
import axios from "axios"; // <-- IMPORT 3

const RegisterPage = () => {
  // --- PHẦN LOGIC MỚI ---
  const [displayName, setDisplayName] = useState(""); // Thêm state cho tên
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra mật khẩu (ví dụ đơn giản)
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      // 1. Gọi API backend
      const response = await axios.post(
        "http://localhost:5001/api/auth/register", // URL của API đăng ký
        {
          displayName,
          email,
          password,
        }
      );

      // 2. Nếu thành công, lưu token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        // 3. Điều hướng về trang chủ
        navigate("/");
      }

    } catch (err) {
      // 4. Nếu lỗi (ví dụ: email đã tồn tại)
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };
  // --- KẾT THÚC PHẦN LOGIC MỚI ---

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Tạo tài khoản</CardTitle>
          <CardDescription>
            Bắt đầu hành trình chữa lành của bạn ngay hôm nay.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              {/* Ô nhập Tên hiển thị */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="displayName">Tên hiển thị</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Tên của bạn"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              {/* Ô nhập Email */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Ô nhập Mật khẩu */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Mật khẩu</Label> 
                   <Input
                  id="password"
                  type="password"
                  placeholder="Mật khẩu (ít nhất 6 ký tự)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Hiển thị lỗi nếu có */}
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" className="w-full">Tạo tài khoản</Button>
            {/* Link tới trang Đăng nhập */}
            <p className="text-sm text-center w-full">
              Đã có tài khoản?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;