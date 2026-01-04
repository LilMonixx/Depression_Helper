import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Plus, Trash2, LayoutDashboard, FileText, 
  Video, Headphones, Link as LinkIcon, Search,
  Image as ImageIcon, Loader2, Edit // <-- Thêm icon Edit
} from 'lucide-react';
import API_URL from '@/utils/apiConfig';

const AdminPage = () => {
  const [contents, setContents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // State quản lý chế độ Sửa
  const [currentId, setCurrentId] = useState(null); // Nếu null -> Thêm mới, Có ID -> Sửa

  const [formData, setFormData] = useState({
    title: '', description: '', type: 'Article', url: '', thumbnailUrl: ''
  });

  const token = localStorage.getItem('token');

  // 1. LẤY DỮ LIỆU
  const fetchContents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/content`);
      setContents(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải dữ liệu");
    }
  };

  useEffect(() => { fetchContents(); }, []);

  // 2. UPLOAD ẢNH
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post(`${API_URL}/api/upload`, formDataUpload, config);
      const fullPath = `${API_URL}${data}`;
      setFormData(prev => ({ ...prev, thumbnailUrl: fullPath }));
      toast.success('Tải ảnh thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Lỗi tải ảnh');
    } finally {
      setUploading(false);
    }
  };

  // 3. CHUẨN BỊ FORM (Reset hoặc Đổ dữ liệu)
  const openAddDialog = () => {
    setCurrentId(null); // Chế độ thêm
    setFormData({ title: '', description: '', type: 'Article', url: '', thumbnailUrl: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setCurrentId(item._id); // Chế độ sửa (lưu ID bài viết)
    setFormData({
        title: item.title,
        description: item.description,
        type: item.type,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl || ''
    });
    setIsDialogOpen(true);
  };

  // 4. XỬ LÝ LƯU (QUYẾT ĐỊNH THÊM HAY SỬA)
  const handleSubmit = async () => {
    if (!formData.title || !formData.url) return toast.error("Vui lòng nhập đủ thông tin");

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (currentId) {
        // --- LOGIC SỬA (PUT) ---
        await axios.put(`${API_URL}/api/content/${currentId}`, formData, config);
        toast.success('Đã cập nhật nội dung');
      } else {
        // --- LOGIC THÊM (POST) ---
        await axios.post(`${API_URL}/api/content`, formData, config);
        toast.success('Đã thêm nội dung mới');
      }

      setIsDialogOpen(false);
      fetchContents();
    } catch (err) {
      toast.error('Lỗi khi lưu dữ liệu');
    }
  };

  // 5. XỬ LÝ XÓA
  const handleDelete = async (id) => {
    if(!window.confirm('Bạn chắc chắn muốn xóa?')) return;
    try {
      await axios.delete(`${API_URL}/api/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Đã xóa');
      fetchContents();
    } catch (err) {
      toast.error('Lỗi khi xóa');
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'Article') return <FileText className="w-4 h-4" />;
    if (type === 'Podcast') return <Headphones className="w-4 h-4" />;
    if (type === 'Video') return <Video className="w-4 h-4" />;
    return <LinkIcon className="w-4 h-4" />;
  };

  const filteredContents = contents.filter(c => 
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-text flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-brand-sage" /> Quản Trị Viên
          </h1>
          <p className="text-gray-500 mt-1">Quản lý nội dung Thư viện Chữa lành</p>
        </div>
        
        {/* Nút mở Dialog Thêm mới */}
        <Button onClick={openAddDialog} className="bg-brand-sage hover:bg-[#8BC4A0] text-white rounded-full shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-5 h-5 mr-2" /> Thêm Nội Dung Mới
        </Button>

        {/* --- DIALOG FORM (DÙNG CHUNG CHO THÊM VÀ SỬA) --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              {/* Đổi tiêu đề dựa trên chế độ */}
              <DialogTitle>{currentId ? 'Cập nhật nội dung' : 'Thêm tài nguyên mới'}</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tiêu đề <span className="text-red-500">*</span></Label>
                  <Input 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loại</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Article">Bài viết</option>
                    <option value="Podcast">Podcast</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả ngắn</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Link nội dung (URL) <span className="text-red-500">*</span></Label>
                  <Input 
                    value={formData.url} 
                    onChange={(e) => setFormData({...formData, url: e.target.value})} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ảnh bìa</Label>
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-16 rounded-md overflow-hidden bg-gray-100 border flex-shrink-0 flex items-center justify-center">
                        {formData.thumbnailUrl ? (
                          <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover"/>
                        ) : (
                          <ImageIcon className="text-gray-300 w-6 h-6" />
                        )}
                    </div>
                    
                    <div className="flex-1">
                      <Input 
                          type="file" 
                          onChange={uploadFileHandler} 
                          accept="image/*"
                          className="cursor-pointer"
                          disabled={uploading}
                      />
                      {uploading && <p className="text-xs text-brand-sage mt-1 flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Đang tải lên...</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSubmit} className="bg-brand-sage text-white w-full sm:w-auto" disabled={uploading}>
                {uploading ? 'Đang xử lý...' : (currentId ? 'Lưu thay đổi' : 'Xác nhận thêm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardHeader className="pb-2"><CardTitle className="text-emerald-600 text-sm uppercase font-bold">Bài Viết</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-bold text-emerald-800">{contents.filter(c => c.type === 'Article').length}</div></CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardHeader className="pb-2"><CardTitle className="text-purple-600 text-sm uppercase font-bold">Podcast</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-bold text-purple-800">{contents.filter(c => c.type === 'Podcast').length}</div></CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-100">
          <CardHeader className="pb-2"><CardTitle className="text-rose-600 text-sm uppercase font-bold">Video</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-bold text-rose-800">{contents.filter(c => c.type === 'Video').length}</div></CardContent>
        </Card>
      </div>

      {/* DANH SÁCH NỘI DUNG */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-text">Danh sách tài nguyên</h2>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Tìm kiếm..." 
              className="pl-9 bg-white border-brand-lavender" 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((item) => (
            <Card key={item._id} className="group overflow-hidden border-brand-lavender/50 hover:shadow-lg transition-all bg-white flex flex-col h-full">
              {/* Ảnh bìa */}
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                 {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-brand-bg">Không có ảnh</div>
                 )}
                 <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                    {getTypeIcon(item.type)} {item.type}
                 </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1" title={item.title}>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                <div className="mt-3 text-xs text-gray-400 truncate bg-gray-50 p-1.5 rounded border border-gray-100">
                  {item.url}
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-gray-100 p-4 bg-gray-50/50 flex justify-end gap-2">
                <span className="text-xs text-gray-400 mr-auto flex items-center">
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </span>
                
                {/* --- NÚT SỬA --- */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 border-gray-200 hover:text-brand-sage hover:border-brand-sage"
                  onClick={() => openEditDialog(item)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Sửa
                </Button>

                {/* --- NÚT XÓA --- */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-white hover:bg-red-500 h-8"
                  onClick={() => handleDelete(item._id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Xóa
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredContents.length === 0 && (
          <div className="text-center py-12 text-gray-400 italic">Không tìm thấy nội dung nào.</div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;