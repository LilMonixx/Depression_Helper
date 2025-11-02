import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner"; // Import toast

// Định nghĩa các mức độ cảm xúc
const moodLevels = [
  { level: 1, emoji: '😞', label: 'Rất tệ' },
  { level: 2, emoji: '😕', label: 'Tệ' },
  { level: 3, emoji: '😐', label: 'Bình thường' },
  { level: 4, emoji: '😊', label: 'Tốt' },
  { level: 5, emoji: '😄', label: 'Rất tốt' },
];

const MoodPage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [pastMoods, setPastMoods] = useState([]);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // --- 1. LẤY LỊCH SỬ CẢM XÚC ---
  const fetchMoods = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.get('http://localhost:5001/api/mood', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPastMoods(res.data);
    } catch (err) {
      console.error('Không thể tải lịch sử cảm xúc:', err);
    }
  };

  // --- 2. GỌI API KHI TẢI TRANG ---
  useEffect(() => {
    fetchMoods();
  }, []); // Dấu [] nghĩa là chỉ chạy 1 lần duy nhất

  // --- 3. HÀM GỬI CẢM XÚC (ĐÃ CẬP NHẬT) ---
  const handleSubmit = async () => {
    if (!selectedMood) {
      setError('Vui lòng chọn một cảm xúc.');
      return;
    }
    setError('');

    // KHÔNG cần lấy ngày hôm nay nữa

    try {
      await axios.post(
        'http://localhost:5001/api/mood',
        {
          // Chỉ gửi 2 trường này
          moodLevel: selectedMood.level,
          note: note,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      toast.success(`Đã lưu cảm xúc: ${selectedMood.label}`);
      
      // Tải lại lịch sử để hiển thị bản ghi mới
      fetchMoods();
      
      // Reset form
      setSelectedMood(null);
      setNote('');

    } catch (err) {
      console.error('Lỗi khi lưu cảm xúc:', err);
      setError('Không thể lưu cảm xúc. Vui lòng thử lại.');
      toast.error('Lỗi! Không thể lưu cảm xúc.');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button variant="outline" asChild className="mb-4">
         <Link to="/">Quay lại Nhật ký</Link>
      </Button>
      
      {/* Card để ghi cảm xúc hôm nay */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bạn cảm thấy thế nào ngay lúc này?</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 5 Nút chọn cảm xúc */}
          <div className="flex justify-around mb-4">
            {moodLevels.map((mood) => (
              <Button
                key={mood.level}
                variant={selectedMood?.level === mood.level ? 'default' : 'outline'}
                size="lg"
                className="flex flex-col h-24 w-24"
                onClick={() => setSelectedMood(mood)}
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </Button>
            ))}
          </div>
          
          {/* Ô ghi chú */}
          <Textarea
            placeholder="Thêm một vài ghi chú (không bắt buộc)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-4"
          />
          
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          
          {/* Nút lưu */}
          <Button onClick={handleSubmit} className="w-full" disabled={!selectedMood}>
            Lưu cảm xúc
          </Button>
        </CardContent>
      </Card>
      
      {/* Lịch sử cảm xúc (ĐÃ CẬP NHẬT) */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Lịch sử của bạn</h2>
        {pastMoods.length === 0 ? (
          <p>Bạn chưa có ghi chép nào.</p>
        ) : (
          pastMoods.map((mood) => {
            // Lấy emoji tương ứng
            const moodEmoji = moodLevels.find(m => m.level === mood.moodLevel)?.emoji;
            
            // Tạo đối tượng Date từ createdAt (đây là mốc thời gian)
            const entryTime = new Date(mood.createdAt);
            
            return (
              <Card key={mood._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {/* Nhóm bên trái: Emoji và Ngày */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{moodEmoji}</span>
                      <span className="text-lg">
                        {entryTime.toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {/* Nhóm bên phải: Mốc thời gian (Giờ:Phút) */}
                    <span className="text-sm font-medium text-gray-500">
                      {entryTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </CardTitle>
                </CardHeader>
                {mood.note && (
                  <CardContent>
                    <p className="italic">"{mood.note}"</p>
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  );
};

export default MoodPage;