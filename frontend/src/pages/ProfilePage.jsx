import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, Mail, Calendar, Shield, BookOpen, Smile, 
  ArrowRight, Sparkles, LogOut 
} from 'lucide-react';
import heroBg from '@/assets/image/hero-bg.jpg';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 max-w-4xl py-10 space-y-6">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!profile) return <div className="text-center py-20">Không thể tải thông tin.</div>;

  return (
    <div className="container mx-auto px-4 max-w-4xl pb-20">
      
      {/* --- 1. PROFILE HEADER CARD --- */}
      <div className="relative mb-10 group">
        {/* Ảnh bìa */}
        <div className="h-48 w-full rounded-t-3xl overflow-hidden relative">
          <img src={heroBg} alt="Cover" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Thông tin cá nhân (Nổi lên trên ảnh bìa) */}
        <div className="bg-white rounded-b-3xl shadow-xl p-6 relative border border-t-0 border-brand-lavender/50">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
            
            {/* Avatar (Chữ cái đầu) */}
            <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-xl z-10">
              <div className="w-full h-full rounded-full bg-brand-sage flex items-center justify-center text-5xl font-bold text-white uppercase shadow-inner">
                {profile.displayName?.charAt(0) || 'U'}
              </div>
            </div>

            {/* Tên & Email */}
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                {profile.displayName}
                {profile.isAdmin && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full border border-red-200 flex items-center gap-1" title="Quản trị viên">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-gray-500 text-sm">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" /> {profile.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> 
                  Thành viên từ: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Nút hành động (Ví dụ: Chỉnh sửa - chưa có tính năng này nhưng để UI cho đẹp) */}
            <Button variant="outline" className="hidden md:flex border-brand-sage text-brand-sage hover:bg-brand-sage hover:text-white">
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        </div>
      </div>

      {/* --- 2. STATS SECTION (Thống kê) --- */}
      <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand-sage" /> Hành trình của bạn
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Thẻ Thống kê Nhật ký */}
        <Card className="border-brand-lavender/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BookOpen className="w-24 h-24 text-brand-sage" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 font-medium text-sm uppercase tracking-wider">Nhật ký đã viết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-brand-text">{profile.journalCount}</span>
              <span className="text-gray-400">trang</span>
            </div>
            <p className="text-sm text-gray-500 mt-4 mb-6">
              Mỗi dòng nhật ký là một bước đi trên hành trình thấu hiểu bản thân.
            </p>
            <Link to="/journal">
              <Button className="w-full bg-brand-sage hover:bg-[#8BC4A0] text-white">
                Viết bài mới <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Thẻ Thống kê Cảm xúc */}
        <Card className="border-brand-lavender/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Smile className="w-24 h-24 text-brand-lavender" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 font-medium text-sm uppercase tracking-wider">Lần check-in cảm xúc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-brand-text">{profile.moodCount}</span>
              <span className="text-gray-400">lần</span>
            </div>
            <p className="text-sm text-gray-500 mt-4 mb-6">
              Theo dõi cảm xúc giúp bạn nhận diện và cân bằng tâm trạng tốt hơn.
            </p>
            <Link to="/mood">
              <Button variant="outline" className="w-full border-brand-sage text-brand-sage hover:bg-brand-sage hover:text-white">
                Ghi lại cảm xúc <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ProfilePage;