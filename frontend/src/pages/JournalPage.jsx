import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion"; // <-- Import thư viện Animation
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import { Plus, Save, Trash2, Edit2, Book, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const JournalPage = () => {
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentJournal, setCurrentJournal] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const token = localStorage.getItem('token');

  const fetchJournals = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/journal', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(res.data);
    } catch (err) { 
      console.error(err); 
      toast.error("Không thể tải nhật ký");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if(token) fetchJournals(); }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return toast.error('Vui lòng nhập đủ thông tin');
    try {
      await axios.post('http://localhost:5001/api/journal', { title, content }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Đã lưu nhật ký'); 
      setTitle(''); 
      setContent(''); 
      fetchJournals();
    } catch (err) { toast.error('Lỗi khi lưu'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa bài viết này?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/journal/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Đã xóa'); 
      // Cập nhật state trực tiếp để thấy hiệu ứng xóa ngay lập tức
      setJournals(journals.filter(j => j._id !== id));
    } catch (err) { toast.error('Lỗi khi xóa'); }
  };

  const openEdit = (journal) => {
    setCurrentJournal(journal); setEditTitle(journal.title); setEditContent(journal.content); setIsDialogOpen(true);
  };
  
  const handleUpdate = async () => {
     try {
      await axios.put(`http://localhost:5001/api/journal/${currentJournal._id}`, 
        { title: editTitle, content: editContent }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Đã cập nhật'); setIsDialogOpen(false); fetchJournals();
    } catch (err) { toast.error('Lỗi khi cập nhật'); }
  };

  // --- Cấu hình Animation ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Hiệu ứng xuất hiện lần lượt
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* --- CỘT TRÁI: DANH SÁCH BÀI VIẾT --- */}
      <div className="lg:col-span-1 space-y-4 h-fit sticky top-24">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
              <Book className="w-5 h-5 text-brand-sage" /> Bài viết cũ
            </h2>
            <span className="text-xs font-medium bg-brand-lavender/50 px-2 py-1 rounded-md text-brand-text">{journals.length} bài</span>
        </div>
        
        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-sage" /></div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                <AnimatePresence mode='popLayout'>
                  {journals.map((journal) => (
                      <motion.div 
                          key={journal._id} 
                          variants={itemVariants}
                          layout // Giúp danh sách tự sắp xếp lại mượt mà khi có mục bị xóa
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                          className="bg-white p-4 rounded-xl border border-gray-100 hover:border-brand-sage/50 shadow-sm hover:shadow-md transition-all group cursor-pointer relative"
                      >
                          <h3 className="font-bold text-gray-800 line-clamp-1">{journal.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{new Date(journal.createdAt).toLocaleDateString('vi-VN')}</p>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{journal.content}</p>
                          
                          {/* Actions (chỉ hiện khi hover) */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/80 backdrop-blur-sm rounded-lg p-1">
                              <button onClick={(e) => {e.stopPropagation(); openEdit(journal)}} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"><Edit2 className="w-3 h-3"/></button>
                              <button onClick={(e) => {e.stopPropagation(); handleDelete(journal._id)}} className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors"><Trash2 className="w-3 h-3"/></button>
                          </div>
                      </motion.div>
                  ))}
                </AnimatePresence>
                {journals.length === 0 && (
                   <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 text-sm py-4">Chưa có bài viết nào.</motion.p>
                )}
              </motion.div>
            )}
        </div>
      </div>

      {/* --- CỘT PHẢI: TRÌNH SOẠN THẢO LỚN --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2"
      >
        <div className="bg-white rounded-[2rem] shadow-xl shadow-brand-lavender/10 border border-white p-8 min-h-[75vh] flex flex-col relative overflow-hidden">
            {/* Thanh trang trí gradient */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-lavender via-brand-sage to-brand-lavender"></div>
            
            <h2 className="text-2xl font-bold text-brand-text mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6 text-brand-sage" /> Viết trang mới
            </h2>

            <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-6">
                <div>
                    <Input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Tiêu đề ngày hôm nay..." 
                        className="text-2xl font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-gray-300 h-auto py-2 bg-transparent"
                    />
                    <div className="h-[1px] w-full bg-gray-100"></div>
                </div>
                
                <Textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Hãy để dòng suy nghĩ của bạn tuôn chảy..." 
                    className="flex-grow border-none px-0 shadow-none focus-visible:ring-0 resize-none text-lg leading-relaxed text-gray-600 placeholder:text-gray-200 bg-transparent"
                />

                <div className="flex justify-end pt-4 border-t border-gray-50">
                    <Button type="submit" className="bg-brand-sage hover:bg-[#8BC4A0] text-white rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                        <Save className="w-5 h-5 mr-2" /> Lưu Nhật Ký
                    </Button>
                </div>
            </form>
        </div>
      </motion.div>

      {/* --- DIALOG CHỈNH SỬA --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader><DialogTitle className="text-xl">Chỉnh sửa bài viết</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="font-bold text-lg border-gray-200 focus-visible:ring-brand-sage"/>
                <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="h-64 text-base border-gray-200 focus-visible:ring-brand-sage resize-none"/>
            </div>
            <DialogFooter>
                <Button onClick={handleUpdate} className="bg-brand-sage text-white hover:bg-[#8BC4A0] rounded-full px-6">Lưu thay đổi</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default JournalPage;