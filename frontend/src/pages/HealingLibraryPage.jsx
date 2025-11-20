import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const HealingLibraryPage = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/content');
        setContentList(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getTypeIcon = (type) => {
    if (type === 'Article') return '📄';
    if (type === 'Podcast') return '🎧';
    if (type === 'Video') return '📺';
    return '🔗';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-text mb-6">Thư viện Chữa lành</h1>

      {loading && <p className="text-center text-gray-500">Đang tải nội dung...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && contentList.map((item) => (
          <Card key={item._id} className="flex flex-col hover:shadow-lg transition-all duration-300 border-brand-lavender/50 bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-brand-text">
                <span>{getTypeIcon(item.type)}</span>
                <span className="truncate">{item.title}</span>
              </CardTitle>
              <CardDescription className="line-clamp-2">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              {item.thumbnailUrl && (
                <div className="w-full h-40 overflow-hidden">
                    <img 
                      src={item.thumbnailUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-4">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" className="w-full hover:bg-brand-lavender hover:text-brand-text border-brand-sage text-gray-600">
                  {item.type === 'Article' ? 'Đọc ngay' : 'Xem ngay'}
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