import { Link } from 'react-router-dom';
import { Leaf, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-bg border-t border-brand-sage/20 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Cột 1: Logo & Giới thiệu */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-text">
              <div className="w-8 h-8 bg-brand-sage rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              Depression Helper
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Người bạn đồng hành tin cậy trên hành trình tìm lại sự cân bằng và bình yên trong tâm hồn.
            </p>
          </div>

          {/* Cột 2: Điều hướng nhanh */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-brand-text text-lg mb-1">Menu</h3>
            <Link to="/" className="text-gray-600 hover:text-brand-sage transition-colors">Trang chủ</Link>
            <Link to="/journal" className="text-gray-600 hover:text-brand-sage transition-colors">Nhật ký</Link>
            <Link to="/mood" className="text-gray-600 hover:text-brand-sage transition-colors">Cảm xúc</Link>
            <Link to="/profile" className="text-gray-600 hover:text-brand-sage transition-colors">Hồ sơ</Link>
          </div>

          {/* Cột 3: Khám phá (ĐÃ GẮN QUERY PARAM) */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-brand-text text-lg mb-1">Khám phá</h3>
            
            {/* LINK NÀY SẼ LỌC BÀI VIẾT */}
            <Link to="/library?type=Article" className="text-gray-600 hover:text-brand-sage transition-colors">
              Bài viết
            </Link>

            {/* LINK NÀY SẼ LỌC PODCAST */}
            <Link to="/library?type=Podcast" className="text-gray-600 hover:text-brand-sage transition-colors">
              Podcast
            </Link>

            {/* LINK NÀY SẼ LỌC VIDEO */}
            <Link to="/library?type=Video" className="text-gray-600 hover:text-brand-sage transition-colors">
              Video
            </Link>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-brand-text text-lg mb-1">Liên hệ</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-brand-sage" />
              <span className="text-sm">support@serenity.com</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-brand-sage" />
              <span className="text-sm">+84 123 456 789</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-brand-sage" />
              <span className="text-sm">Đà Nẵng, Việt Nam</span>
            </div>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Depression Helper. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-sage hover:border-brand-sage transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-sage hover:border-brand-sage transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-sage hover:border-brand-sage transition-all">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;