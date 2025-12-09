import { useState, useEffect } from 'react';
import axios from 'axios';
// ... (giữ nguyên các import UI cũ) ...
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Mail, Calendar, Shield, BookOpen, Smile, 
  ArrowRight, Sparkles, Camera, Edit
} from 'lucide-react';
import defaultHeroBg from '@/assets/image/hero-bg.jpg'; 

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  
  // State lưu đường dẫn ảnh (để gửi lên server Update Profile)
  const [editAvatar, setEditAvatar] = useState('');
  const [editCover, setEditCover] = useState('');
  
  // State loading khi đang upload ảnh
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('token');

  // ... (giữ nguyên hàm fetchProfile) ...
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setEditName(res.data.displayName);
        setEditAvatar(res.data.avatar || '');
        setEditCover(res.data.coverImage || '');
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải thông tin.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // --- HÀM XỬ LÝ UPLOAD FILE ---
  const uploadFileHandler = async (e, type) => {
    const file = e.target.files[0]; // Lấy file người dùng chọn
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file); // 'image' phải trùng với backend: upload.single('image')
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // Gửi file lên API upload
      const { data } = await axios.post('http://localhost:5001/api/upload', formData, config);

      // Backend trả về đường dẫn (ví dụ: /uploads/image-123.jpg)
      // Chúng ta cần thêm domain backend vào trước
      const fullPath = `http://localhost:5001${data}`;

      if (type === 'avatar') {
        setEditAvatar(fullPath);
        toast.success('Đã tải ảnh đại diện lên!');
      } else {
        setEditCover(fullPath);
        toast.success('Đã tải ảnh bìa lên!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải ảnh lên server');
    } finally {
      setUploading(false);
    }
  };
  // -----------------------------

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put('http://localhost:5001/api/users/profile', 
        { 
          displayName: editName,
          avatar: editAvatar,
          coverImage: editCover
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setProfile(res.data);
      setIsEditDialogOpen(false);
      toast.success("Cập nhật hồ sơ thành công!");
      window.dispatchEvent(new Event("userInfoUpdated")); 
    } catch (err) {
      toast.error("Lỗi khi cập nhật hồ sơ.");
    }
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (!profile) return <div className="text-center py-20">Lỗi.</div>;

  return (
    <div className="container mx-auto px-4 max-w-4xl pb-20">
      
      {/* ... (Phần hiển thị Profile giữ nguyên) ... */}
       <div className="relative mb-12 group">
        <div className="h-56 w-full rounded-3xl overflow-hidden relative shadow-md bg-gray-100">
          <img 
            src={profile.coverImage || defaultHeroBg} 
            alt="Cover" 
            className="w-full h-full object-cover"
            onError={(e) => {e.target.src = defaultHeroBg}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Camera className="w-4 h-4 mr-2" /> Đổi ảnh bìa
          </Button>
        </div>

        <div className="px-8 relative -mt-16 flex flex-col md:flex-row items-end gap-6">
          <div className="relative group/avatar">
            <div className="w-36 h-36 rounded-full bg-white p-1.5 shadow-xl">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : null}
              <div 
                className="w-full h-full rounded-full bg-brand-sage flex items-center justify-center text-5xl font-bold text-white uppercase shadow-inner"
                style={{display: profile.avatar ? 'none' : 'flex'}}
              >
                {profile.displayName?.charAt(0) || 'U'}
              </div>
            </div>
            <button 
              onClick={() => setIsEditDialogOpen(true)}
              className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-brand-sage hover:scale-110 transition-all"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 mb-2 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
              {profile.displayName}
              {profile.isAdmin && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full border border-red-200 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </h1>
             <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2 sm:gap-6 mt-2 text-gray-500 text-sm">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {profile.email}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Tham gia: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* ... (Phần Thống kê giữ nguyên) ... */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-brand-lavender/50 bg-white">
          <CardHeader className="pb-2"><CardTitle className="text-gray-500 text-sm uppercase">Nhật ký đã viết</CardTitle></CardHeader>
          <CardContent><span className="text-5xl font-bold text-brand-text">{profile.journalCount}</span></CardContent>
        </Card>
        <Card className="border-brand-lavender/50 bg-white">
          <CardHeader className="pb-2"><CardTitle className="text-gray-500 text-sm uppercase">Lần check-in cảm xúc</CardTitle></CardHeader>
          <CardContent><span className="text-5xl font-bold text-brand-text">{profile.moodCount}</span></CardContent>
        </Card>
      </div>

      {/* --- DIALOG CHỈNH SỬA (ĐÃ NÂNG CẤP UPLOAD) --- */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cập nhật hồ sơ</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            
            {/* Tên hiển thị */}
            <div className="grid gap-2">
              <Label htmlFor="name">Tên hiển thị</Label>
              <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>

            {/* Upload Avatar */}
            <div className="grid gap-2">
              <Label>Ảnh đại diện</Label>
              <div className="flex items-center gap-4">
                {/* Xem trước ảnh */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border">
                    {editAvatar ? <img src={editAvatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">N/A</div>}
                </div>
                <Input 
                    type="file" 
                    onChange={(e) => uploadFileHandler(e, 'avatar')} 
                    accept="image/*"
                    className="cursor-pointer"
                />
              </div>
            </div>

            {/* Upload Ảnh bìa */}
            <div className="grid gap-2">
              <Label>Ảnh bìa</Label>
              <div className="flex items-center gap-4">
                 <div className="w-20 h-10 rounded-md overflow-hidden bg-gray-100 border">
                    {editCover ? <img src={editCover} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">N/A</div>}
                </div>
                <Input 
                    type="file" 
                    onChange={(e) => uploadFileHandler(e, 'cover')} 
                    accept="image/*"
                    className="cursor-pointer"
                />
              </div>
            </div>

            {uploading && <p className="text-sm text-blue-500 animate-pulse">Đang tải ảnh lên server...</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateProfile} className="bg-brand-sage text-white" disabled={uploading}>
                Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ProfilePage;