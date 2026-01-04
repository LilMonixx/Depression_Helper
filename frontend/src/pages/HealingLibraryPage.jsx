import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // <-- QUAN TRỌNG: Để đọc URL
import axios from 'axios';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Headphones, Video, Link as LinkIcon, 
  Sparkles, Loader2, Search, ImageOff 
} from 'lucide-react';
import API_URL from '@/utils/apiConfig';

const HealingLibraryPage = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- 1. XỬ LÝ URL QUERY PARAMS ---
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('type') || 'All'; 
  
  const [filter, setFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 2. LẮNG NGHE KHI URL THAY ĐỔI (để cập nhật bộ lọc) ---
  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl) {
      setFilter(typeFromUrl);
    }
  }, [searchParams]);

  // --- 3. TẢI DỮ LIỆU ---
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/content`);
        setContentList(response.data);
      } catch (err) {
        console.error("Lỗi tải nội dung:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Hàm chuẩn hóa chuỗi
  const normalize = (str) => {
    return str ? str.toString().toLowerCase().trim() : '';
  };

  const getTypeConfig = (type) => {
    const normType = normalize(type);
    switch (normType) {
      case 'article':
        return { icon: BookOpen, label: 'Bài viết', color: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' };
      case 'podcast':
        return { icon: Headphones, label: 'Podcast', color: 'bg-purple-100 text-purple-600', border: 'border-purple-200' };
      case 'video':
        return { icon: Video, label: 'Video', color: 'bg-rose-100 text-rose-600', border: 'border-rose-200' };
      default:
        return { icon: LinkIcon, label: 'Khác', color: 'bg-gray-100 text-gray-600', border: 'border-gray-200' };
    }
  };

  // Logic lọc dữ liệu
  const filteredContent = contentList.filter(item => {
    const typeInDb = normalize(item.type);
    const typeSelected = normalize(filter);
    const searchLower = normalize(searchTerm);

    const matchesType = typeSelected === 'all' ? true : typeInDb === typeSelected;
    const matchesSearch = normalize(item.title).includes(searchLower) || 
                          normalize(item.description).includes(searchLower);
    
    return matchesType && matchesSearch;
  });

  const filters = [
    { id: 'All', label: 'Tất cả' },
    { id: 'Article', label: 'Bài Viết' },
    { id: 'Podcast', label: 'Podcast' },
    { id: 'Video', label: 'Video' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-10 pb-20">
      
      {/* HEADER */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-lavender/30 text-brand-text text-sm font-medium tracking-wide">
          <Sparkles className="w-4 h-4 text-brand-sage" />
          <span>Góc bình yên</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-text tracking-tight">
          Thư viện Chữa lành
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Tuyển tập những bài viết, âm nhạc và video giúp bạn tìm lại sự cân bằng.
        </p>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 p-2 rounded-2xl backdrop-blur-sm border border-white/20 shadow-sm">
        <div className="flex gap-2 flex-wrap justify-center md:justify-start">
            {filters.map((f) => (
            <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border
                ${normalize(filter) === normalize(f.id)
                    ? 'bg-brand-sage text-white border-brand-sage shadow-md scale-105' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-brand-sage/50 hover:text-brand-sage'
                }`}
            >
                {f.label}
            </button>
            ))}
        </div>

        <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
                placeholder="Tìm kiếm nội dung..." 
                className="pl-9 bg-white border-gray-200 focus:border-brand-sage rounded-full h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* DANH SÁCH */}
      {loading ? (
         <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-brand-sage" />
         </div>
      ) : (
        <motion.div 
          key={filter + searchTerm} 
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
                    
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {item.thumbnailUrl ? (
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100" style={{ display: item.thumbnailUrl ? 'none' : 'flex' }}>
                         <ImageOff className="w-8 h-8 text-gray-300" />
                      </div>
                      <div className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${color} backdrop-blur-md shadow-sm z-10`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                            variant="outline" 
                            className={`${color} border-0 bg-opacity-20 hover:bg-opacity-30 cursor-pointer transition-colors`}
                            onClick={() => setFilter(item.type)} 
                        >
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
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" className="w-full rounded-xl border-gray-200 text-gray-600 hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-all h-12 font-medium">
                          {normalize(item.type) === 'article' ? 'Đọc ngay' : normalize(item.type) === 'podcast' ? 'Nghe ngay' : 'Xem ngay'}
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
                <Search className="w-10 h-10 text-brand-sage/50" />
              </div>
              <p className="text-gray-500 text-lg">Không tìm thấy nội dung phù hợp.</p>
              <Button variant="link" onClick={() => {setFilter('All'); setSearchTerm('')}} className="text-brand-sage">
                Xóa bộ lọc & Tìm kiếm
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default HealingLibraryPage;