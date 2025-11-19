import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// Import các component UI chúng ta cần
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // <-- Component mới

const HomePage = () => {
  const [journals, setJournals] = useState([]); // State để lưu danh sách nhật ký
  const [title, setTitle] = useState(''); // State cho tiêu đề bài viết mới
  const [content, setContent] = useState(''); // State cho nội dung bài viết mới
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Lấy token từ localStorage
  const token = localStorage.getItem('token');

  // --- 1. HÀM LẤY TẤT CẢ NHẬT KÝ ---
  const fetchJournals = async () => {
    if (!token) {
      navigate('/login'); // Nếu không có token, đá về trang login
      return;
    }

    try {
      const response = await axios.get('http://localhost:5001/api/journal', {
        headers: {
          Authorization: `Bearer ${token}`, // <-- Gửi token để xác thực
        },
      });
      setJournals(response.data); // Lưu danh sách nhật ký vào state
    } catch (err) {
      console.error('Không thể lấy bài viết:', err);
      setError('Không thể tải nhật ký. Vui lòng thử đăng nhập lại.');
      if (err.response.status === 401) {
         localStorage.removeItem('token');
         navigate('/login');
      }
    }
  };

  // --- 2. HÀM TẠO BÀI VIẾT MỚI ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !content) {
      setError('Vui lòng nhập cả tiêu đề và nội dung.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5001/api/journal',
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` }, // Gửi token
        }
      );
      // Sau khi tạo thành công:
      setTitle(''); // Xóa ô input
      setContent(''); // Xóa ô textarea
      fetchJournals(); // Tải lại danh sách nhật ký để hiển thị bài mới
    } catch (err) {
      console.error('Lỗi khi tạo bài viết:', err);
      setError('Không thể tạo bài viết. Vui lòng thử lại.');
    }
  };

  // --- 3. HÀM XÓA BÀI VIẾT ---
  const handleDelete = async (journalId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/journal/${journalId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Gửi token
      });
      fetchJournals(); // Tải lại danh sách nhật ký
    } catch (err) {
      console.error('Lỗi khi xóa bài viết:', err);
      setError('Không thể xóa bài viết. Vui lòng thử lại.');
    }
  };

  // --- 4. HÀM ĐĂNG XUẤT ---
  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token
    navigate('/login'); // Quay về trang login
  };

  // --- 5. TỰ ĐỘNG GỌI API KHI TRANG ĐƯỢC TẢI ---
  useEffect(() => {
    fetchJournals();
  }, []); // Dấu [] nghĩa là chỉ chạy 1 lần duy nhất khi component được tải

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Nút Đăng xuất */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Nhật ký của bạn</h1>
        <div className="flex space-x-2"> {/* Optional: Group buttons */}
    {/* ADD THIS LINK */}
          <Link to="/library">
            <Button variant="outline">Thư viện Chữa lành</Button>
           </Link>
          <Link to="/mood">
              <Button variant="outline">Theo dõi Cảm xúc</Button>
          </Link>
              <Button variant="outline" onClick={handleLogout}>
                Đăng xuất
              </Button>
    </div>
</div>

      {/* Form tạo bài viết mới */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Viết bài mới</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                placeholder="Hôm nay của tôi..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Nội dung</Label>
              <Textarea
                id="content"
                placeholder="Hãy viết ra những suy nghĩ của bạn..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit">Lưu bài viết</Button>
          </CardFooter>
        </form>
      </Card>

      {/* Danh sách các bài viết đã lưu */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Các bài viết cũ</h2>
        {journals.length === 0 ? (
          <p>Bạn chưa có bài viết nào. Hãy viết bài đầu tiên!</p>
        ) : (
          journals.map((journal) => (
            <Card key={journal._id}>
              <CardHeader>
                <CardTitle>{journal.title}</CardTitle>
                <CardDescription>
                  {/* Định dạng lại ngày tháng cho dễ đọc */}
                  {new Date(journal.createdAt).toLocaleDateString('vi-VN')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Giữ nguyên định dạng xuống dòng của người dùng */}
                <p className="whitespace-pre-wrap">{journal.content}</p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(journal._id)}
                >
                  Xóa
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;