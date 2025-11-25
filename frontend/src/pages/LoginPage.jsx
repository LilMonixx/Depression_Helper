import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login", 
        { email, password }
      );

      if (response.data.token) {
        // 1. Lưu Token
        localStorage.setItem("token", response.data.token);
        
        // 2. LƯU THÔNG TIN USER (QUAN TRỌNG CHO ADMIN)
        // Server trả về { _id, displayName, email, isAdmin, token }
        localStorage.setItem("userInfo", JSON.stringify(response.data)); 
        
        navigate("/");
      }

    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-bg">
      <Card className="w-[350px] border-brand-lavender shadow-sm">
        <CardHeader>
          <CardTitle>Chào mừng trở lại</CardTitle>
          <CardDescription>Đăng nhập để tiếp tục hành trình của bạn.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" placeholder="Mật khẩu của bạn" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" className="w-full bg-brand-sage text-brand-text hover:bg-brand-sage/90">Đăng nhập</Button>
            <p className="text-sm text-center w-full">
              Chưa có tài khoản? <Link to="/register" className="font-semibold text-blue-600 hover:underline">Đăng ký ngay</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;