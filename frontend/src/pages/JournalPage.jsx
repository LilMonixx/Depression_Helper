import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import UI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HomePage = () => {
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // State cho việc chỉnh sửa
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentJournal, setCurrentJournal] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchJournals = async () => {
    if (!token) return navigate('/login');
    try {
      const response = await axios.get('http://localhost:5001/api/journal', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchJournals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return toast.error('Vui lòng nhập đủ thông tin');

    try {
      await axios.post('http://localhost:5001/api/journal', 
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Đã tạo bài viết mới');
      setTitle('');
      setContent('');
      fetchJournals();
    } catch (err) {
      toast.error('Lỗi khi tạo bài viết');
    }
  };

  const handleDelete = async (journalId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/journal/${journalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Đã xóa bài viết');
      fetchJournals();
    } catch (err) {
      toast.error('Lỗi khi xóa bài viết');
    }
  };

  const openEditDialog = (journal) => {
    setCurrentJournal(journal);
    setEditTitle(journal.title);
    setEditContent(journal.content);
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editTitle || !editContent) return toast.error('Vui lòng nhập đủ thông tin');

    try {
      await axios.put(`http://localhost:5001/api/journal/${currentJournal._id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Đã cập nhật bài viết');
      setIsDialogOpen(false);
      fetchJournals();
    } catch (err) {
      toast.error('Lỗi khi cập nhật');
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Viết bài */}
      <Card className="bg-white shadow-sm border-brand-lavender">
        <CardHeader>
          <CardTitle>Viết bài mới</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Hôm nay thế nào..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Nội dung</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Chia sẻ suy nghĩ của bạn..." />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="bg-brand-sage text-brand-text hover:bg-brand-sage/90">Lưu bài viết</Button>
          </CardFooter>
        </form>
      </Card>

      {/* Danh sách bài viết */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-brand-text">Các bài viết cũ</h2>
        {journals.length === 0 ? <p className="text-gray-500 italic">Chưa có bài viết nào.</p> : journals.map((journal) => (
          <Card key={journal._id} className="bg-white/80 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-xl">
                <span>{journal.title}</span>
                <span className="text-sm font-normal text-gray-400">
                  {new Date(journal.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{journal.content}</p>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end border-t pt-4">
              <Button variant="outline" size="sm" onClick={() => openEditDialog(journal)}>Sửa</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(journal._id)}>Xóa</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Dialog Sửa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
            <DialogDescription>Thay đổi nội dung và nhấn Lưu.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Tiêu đề</Label>
              <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Nội dung</Label>
              <Textarea id="edit-content" value={editContent} onChange={(e) => setEditContent(e.target.value)} className="h-40"/>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdate} className="bg-brand-sage text-brand-text">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;