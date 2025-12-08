import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf } from "lucide-react"; // Dùng icon Leaf cho hợp với logo 'Serenity'
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Xử lý logic đăng ký nhận tin (sau này)
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  // Danh sách các link (Bạn có thể sửa href thành link thật sau này)
  const links = {
    product: [
      { name: "Nhật ký", href: "/journal" },
      { name: "Cảm xúc", href: "/mood" },
      { name: "Thư viện", href: "/library" },
      { name: "Hồ sơ", href: "/profile" },
    ],
    resources: [
      { name: "Bài viết", href: "#" },
      { name: "Podcast", href: "#" },
      { name: "Video", href: "#" },
      { name: "Cộng đồng", href: "#" },
    ],
    company: [
      { name: "Về chúng tôi", href: "#" },
      { name: "Liên hệ", href: "#" },
      { name: "Tuyển dụng", href: "#" },
      { name: "Đối tác", href: "#" },
    ],
    legal: [
      { name: "Chính sách bảo mật", href: "#" },
      { name: "Điều khoản sử dụng", href: "#" },
      { name: "Cookie", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-brand-lavender/30 bg-white/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        
        {/* Phần trên: Logo, Mô tả & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          
          {/* Cột 1 (Lớn): Thông tin & Đăng ký */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-lavender/50 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-brand-sage" />
              </div>
              <span className="text-xl font-bold text-brand-text tracking-tight">Depression Helper</span>
            </div>
            <p className="text-gray-500 text-sm mb-6 max-w-xs leading-relaxed">
              Nơi trú ẩn kỹ thuật số cho sức khỏe cảm xúc và sự phản chiếu nội tâm của bạn.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex gap-2 flex-wrap">
              <Input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-[200px] bg-white border-brand-lavender focus-visible:ring-brand-sage"
              />
              <Button type="submit" className="bg-brand-sage text-brand-text hover:bg-brand-sage/90">
                Đăng ký
              </Button>
            </form>
          </div>

          {/* Các cột Link */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Cột Product */}
            <div>
              <h4 className="font-semibold mb-4 text-sm text-brand-text">Sản phẩm</h4>
              <ul className="space-y-3">
                {links.product.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-gray-500 text-sm hover:text-brand-sage transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cột Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-sm text-brand-text">Tài nguyên</h4>
              <ul className="space-y-3">
                {links.resources.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-500 text-sm hover:text-brand-sage transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cột Company */}
            <div>
              <h4 className="font-semibold mb-4 text-sm text-brand-text">Công ty</h4>
              <ul className="space-y-3">
                {links.company.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-500 text-sm hover:text-brand-sage transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cột Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-sm text-brand-text">Pháp lý</h4>
              <ul className="space-y-3">
                {links.legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-500 text-sm hover:text-brand-sage transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Phần dưới: Copyright */}
        <div className="pt-8 border-t border-brand-lavender/30 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Depression Helper. Bảo lưu mọi quyền.</p>
          <p>Được làm với ❤️ cho hành trình chữa lành của bạn.</p>
        </div>
      </div>
    </footer>
  );
}