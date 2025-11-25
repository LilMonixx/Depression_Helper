import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";

const AdminPage = () => {
  const [contents, setContents] = useState([]);
  // State cho form thêm mới
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Article');
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const token = localStorage.getItem('token');

  // 1. Lấy danh sách nội dung
  const fetchContents = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/content');
      setContents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchContents(); }, []);

  // 2. Xử lý Thêm mới
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/content', 
        { title, description, type, url, thumbnailUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Đã thêm nội dung mới');
      // Reset form
      setTitle(''); setDescription(''); setUrl(''); setThumbnailUrl('');
      fetchContents(); // Tải lại danh sách
    } catch (err) {
      toast.error('Lỗi khi thêm nội dung');
    }
  };

  // 3. Xử lý Xóa
  const handleDelete = async (id) => {
    if(!window.confirm('Bạn chắc chắn muốn xóa?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Đã xóa nội dung');
      fetchContents();
    } catch (err) {
      toast.error('Lỗi khi xóa');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-text">Trang Quản Trị (Admin)</h1>

      {/* Form Thêm nội dung */}
      <Card className="border-brand-sage">
        <CardHeader>
          <CardTitle>Thêm nội dung vào Thư viện</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tiêu đề</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ví dụ: Nhạc thiền..." />
              </div>
              <div>
                <Label>Loại (Article, Podcast, Video)</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Article">Bài viết</option>
                  <option value="Podcast">Podcast</option>
                  <option value="Video">Video</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Mô tả ngắn</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả nội dung..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Link nội dung (URL)</Label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>Link ảnh bìa (Thumbnail URL)</Label>
                <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <Button type="submit" className="bg-brand-sage text-brand-text hover:bg-brand-sage/90">Thêm nội dung</Button>
          </form>
        </CardContent>
      </Card>

      {/* Danh sách nội dung hiện có */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Danh sách nội dung hiện tại</h2>
        {contents.map((item) => (
          <Card key={item._id} className="flex justify-between items-center p-4">
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.type} - {item.description}</p>
            </div>
            <Button variant="destructive" onClick={() => handleDelete(item._id)}>Xóa</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;