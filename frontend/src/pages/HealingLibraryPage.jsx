import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const HealingLibraryPage = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // API này là công khai, không cần gửi token
        const response = await axios.get('http://localhost:5001/api/content');
        setContentList(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Không thể tải nội dung:', err);
        setError('Không thể tải nội dung. Vui lòng thử lại.');
        setLoading(false);
      }
    };

    fetchContent();
  }, []); // Chạy 1 lần khi tải trang

  // Hàm để lấy icon cho từng loại nội dung
  const getTypeIcon = (type) => {
    if (type === 'Article') return '📄'; // Emoji bài báo
    if (type === 'Podcast') return '🎧'; // Emoji tai nghe
    if (type === 'Video') return '📺'; // Emoji TV
    return '🔗';
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button variant="outline" asChild className="mb-4">
        <Link to="/">Quay lại Nhật ký</Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">Thư viện Chữa lành</h1>

      {loading && <p>Đang tải nội dung...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && contentList.map((item) => (
          <Card key={item._id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{getTypeIcon(item.type)}</span>
                {item.title}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* (Tùy chọn) Hiển thị ảnh bìa nếu có */}
              {item.thumbnailUrl && (
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title} 
                  className="rounded-md mb-4 w-full h-32 object-cover"
                />
              )}
            </CardContent>
            <CardFooter>
              {/* Dùng <a> để mở link trong tab mới */}
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full">
                  {item.type === 'Article' ? 'Đọc bài viết' : 'Xem/Nghe ngay'}
                </Button>
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HealingLibraryPage;