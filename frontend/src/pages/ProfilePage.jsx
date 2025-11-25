import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
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
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <p className="text-center mt-10">Đang tải thông tin...</p>;

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-brand-text">Hồ sơ của bạn</h1>

      {/* Thẻ Thông tin cá nhân */}
      <Card className="border-brand-lavender bg-white">
        <CardHeader>
          <CardTitle className="text-2xl">{profile.displayName}</CardTitle>
          <CardDescription>{profile.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Thành viên từ: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
          </p>
          {profile.isAdmin && (
            <span className="inline-block mt-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
              Quản trị viên (Admin)
            </span>
          )}
        </CardContent>
      </Card>

      {/* Thẻ Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-brand-bg border-brand-sage">
          <CardHeader>
            <CardTitle>📝 Nhật ký</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-brand-text">{profile.journalCount}</p>
            <p className="text-gray-500">Bài viết đã lưu</p>
            <Button variant="link" asChild className="p-0 mt-2 text-brand-sage">
                <Link to="/journal">Viết thêm ngay &rarr;</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-brand-bg border-brand-sage">
          <CardHeader>
            <CardTitle>😊 Cảm xúc</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-brand-text">{profile.moodCount}</p>
            <p className="text-gray-500">Lần check-in cảm xúc</p>
            <Button variant="link" asChild className="p-0 mt-2 text-brand-sage">
                <Link to="/mood">Ghi lại ngay &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;