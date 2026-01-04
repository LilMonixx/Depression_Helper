  import { useState, useEffect } from 'react';
  import axios from 'axios';
  import { Link } from 'react-router-dom';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
  import { Skeleton } from '@/components/ui/skeleton';
  import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
  import Moodchecker from '@/components/Moodchecker'; 
  import FeaturesSection from '@/components/FeaturesSection';
  import heroBg from '@/assets/image/hero-bg.jpg'; 
  import API_URL from '@/utils/apiConfig';

  const HomePage = () => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
      const fetchJournals = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/journal`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJournals(response.data.slice(0, 3)); 
        } catch (err) {
          console.error("Lỗi khi tải nhật ký:", err);
        } finally {
          setLoading(false);
        }
      };
      if (token) fetchJournals();
    }, [token]);

    return (
      <div className="flex flex-col min-h-screen">
        
        {/* --- HERO SECTION TRÀN VIỀN --- */}
        <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden mb-12">
          <div className="absolute inset-0 z-0">
            <img 
              src={heroBg} 
              alt="Sanctuary Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>
            {/* Gradient mờ dần xuống dưới để hòa vào nền trắng */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-bg to-transparent"></div>
          </div>

          <div className="relative z-10 text-center max-w-4xl px-6 mt-10">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/50 px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4 text-brand-sage" />
              <span>Chào mừng, {userInfo.displayName || 'Bạn'}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
              A Sanctuary for Your <br />
              <span className="text-[#437657]">Emotional Wellness</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              Lắng nghe cảm xúc, ghi lại hành trình và tìm thấy sự bình an qua từng trang viết.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
              <Link to="/journal">
                  <Button className="bg-[#437657] hover:bg-[#356146] text-white rounded-md px-8 py-6 text-lg font-medium shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                    Viết Nhật Ký Ngay <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
              </Link>
              <Link to="/library">
                  <Button variant="outline" className="bg-white/80 border-white text-gray-700 hover:bg-white rounded-md px-8 py-6 text-lg font-medium shadow-md hover:shadow-lg transition-all">
                    Thư Viện
                  </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* --- CÁC PHẦN CÒN LẠI (Căn giữa bằng Container) --- */}
        <div className="container mx-auto px-4 space-y-16 pb-20">
          
          {/* MOOD TRACKER */}
          <div className="max-w-5xl mx-auto -mt-24 relative z-20">
            <Moodchecker />
          </div>

          {/* NHẬT KÝ GẦN ĐÂY */}
          <section className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-3xl font-bold text-brand-text flex items-center gap-3">
                <div className="p-2 bg-brand-lavender/30 rounded-lg">
                    <BookOpen className="h-6 w-6 text-brand-sage" />
                </div>
                Nhật ký gần đây
              </h2>
              <Link to="/journal" className="text-sm font-medium text-gray-500 hover:text-brand-sage flex items-center transition-colors group">
                Xem tất cả <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : journals.length > 0 ? (
                journals.map((journal) => (
                  <Card key={journal._id} className="border-brand-lavender/30 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center text-xl border border-brand-sage/20">
                          📝
                        </div>
                        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                          {new Date(journal.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-[#437657] transition-colors">
                        {journal.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {journal.content}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-gray-50">
                      <Link to="/journal" className="text-xs font-bold text-[#437657] flex items-center hover:underline w-full">
                          ĐỌC TIẾP <ArrowRight className="ml-auto h-3 w-3" />
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-16 bg-brand-bg/50 rounded-3xl border-2 border-dashed border-brand-lavender">
                  <p className="text-gray-500 mb-6 font-medium text-lg">Hành trình của bạn bắt đầu từ trang viết đầu tiên.</p>
                  <Link to="/journal">
                    <Button className="bg-[#437657] hover:bg-[#356146] text-white">
                      Bắt đầu viết ngay
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* FEATURES SECTION */}
          <FeaturesSection />

        </div>
      </div>
    );
  };

  export default HomePage;