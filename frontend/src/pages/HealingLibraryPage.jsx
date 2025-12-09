import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion"; // <-- Import thư viện Animation
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Headphones, Video, Link as LinkIcon, 
  Sparkles, Coffee, Loader2 
} from 'lucide-react';

const HealingLibraryPage = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/content');
        setContentList(response.data);
      } catch (err) {
        console.error("Lỗi tải nội dung:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getTypeConfig = (type) => {
    switch (type) {
      case 'Article':
        return { icon: BookOpen, label: 'Bài viết', color: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' };
      case 'Podcast':
        return { icon: Headphones, label: 'Podcast', color: 'bg-purple-100 text-purple-600', border: 'border-purple-200' };
      case 'Video':
        return { icon: Video, label: 'Video', color: 'bg-rose-100 text-rose-600', border: 'border-rose-200' };
      default:
        return { icon: LinkIcon, label: 'Khác', color: 'bg-gray-100 text-gray-600', border: 'border-gray-200' };
    }
  };

  const filteredContent = filter === 'All' 
    ? contentList 
    : contentList.filter(item => item.type === filter);

  const filters = [
    { id: 'All', label: 'Tất cả' },
    { id: 'Article', label: 'Bài Viết' },
    { id: 'Podcast', label: 'Podcast' },
    { id: 'Video', label: 'Video' },
  ];

  // --- Cấu hình Animation ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Các phần tử con sẽ hiện ra cách nhau 0.1s
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Bắt đầu: ẩn và nằm thấp hơn 20px
    show: { opacity: 1, y: 0 }     // Kết thúc: hiện và về vị trí gốc
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-12 pb-20">
      
      {/* 1. Header Section (Có hiệu ứng Fade In) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 pt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-lavender/30 text-brand-text text-sm font-medium tracking-wide">
          <Sparkles className="w-4 h-4 text-brand-sage" />
          <span>Góc bình yên</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-text tracking-tight">
          Thư viện Chữa lành
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Tuyển tập những bài viết, âm nhạc và video giúp bạn tìm lại sự cân bằng và nuôi dưỡng tâm hồn.
        </p>
      </motion.div>

      {/* 2. Bộ lọc (Tabs) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-2 flex-wrap"
      >
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border
              ${filter === f.id 
                ? 'bg-brand-sage text-white border-brand-sage shadow-md scale-105' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-brand-sage/50 hover:text-brand-sage'
              }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* 3. Danh sách nội dung (Có hiệu ứng Stagger) */}
      {loading ? (
         <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-brand-sage" />
         </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredContent.length > 0 ? (
            filteredContent.map((item) => {
              const { icon: Icon, label, color, border } = getTypeConfig(item.type);
              
              return (
                <motion.div key={item._id} variants={itemVariants}>
                  <Card className={`group flex flex-col overflow-hidden border-2 ${border} bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-[2rem] h-full`}>
                    
                    {/* Phần Ảnh bìa */}
                    <div className="relative h-48 w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                      {item.thumbnailUrl ? (
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.style.display = 'none';
                            e.target.parentNode.classList.add('bg-brand-bg');
                          }}
                        />
                      ) : null}
                      
                      <div className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${color} backdrop-blur-md shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={`${color} border-0 bg-opacity-20 hover:bg-opacity-30`}>
                          {label}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-brand-sage transition-colors">
                        {item.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-grow">
                      <CardDescription className="line-clamp-3 text-gray-500 leading-relaxed">
                        {item.description}
                      </CardDescription>
                    </CardContent>

                    <CardFooter className="pt-0 pb-6 px-6">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full rounded-xl border-gray-200 text-gray-600 hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-all h-12 font-medium">
                          {item.type === 'Article' ? 'Đọc ngay' : item.type === 'Podcast' ? 'Nghe ngay' : 'Xem ngay'}
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <motion.div variants={itemVariants} className="col-span-full text-center py-20">
              <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-10 h-10 text-brand-sage/50" />
              </div>
              <p className="text-gray-500 text-lg">Chưa có nội dung nào cho mục này.</p>
              <Button variant="link" onClick={() => setFilter('All')} className="text-brand-sage">
                Xem tất cả
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default HealingLibraryPage;