import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Smile, Heart, Cloud, Frown, Star, Sun, 
  ArrowLeft, Calendar, TrendingUp, Sparkles,
  ChevronRight, Feather
} from "lucide-react";

// Định nghĩa danh sách cảm xúc với màu sắc và gradient đẹp mắt
const moods = [
  { id: "happy", icon: Smile, label: "Happy", color: "bg-emerald-100 text-emerald-600 border-emerald-200", gradient: "from-emerald-400 to-emerald-600", level: 5 },
  { id: "calm", icon: Sun, label: "Calm", color: "bg-sky-100 text-sky-600 border-sky-200", gradient: "from-sky-400 to-sky-600", level: 4 },
  { id: "loved", icon: Heart, label: "Loved", color: "bg-rose-100 text-rose-500 border-rose-200", gradient: "from-rose-400 to-rose-600", level: 5 },
  { id: "stressed", icon: Cloud, label: "Stressed", color: "bg-amber-100 text-amber-600 border-amber-200", gradient: "from-amber-400 to-amber-600", level: 2 },
  { id: "sad", icon: Frown, label: "Sad", color: "bg-indigo-100 text-indigo-500 border-indigo-200", gradient: "from-indigo-400 to-indigo-600", level: 1 },
  { id: "grateful", icon: Star, label: "Grateful", color: "bg-purple-100 text-purple-500 border-purple-200", gradient: "from-purple-400 to-purple-600", level: 4 },
];

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [step, setStep] = useState(1); // 1: Chọn Mood, 2: Ghi chú, 3: Thành công
  const [pastMoods, setPastMoods] = useState([]);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // --- 1. LẤY LỊCH SỬ CẢM XÚC ---
  const fetchMoods = async () => {
    if (!token) return navigate('/login');
    try {
      const res = await axios.get('http://localhost:5001/api/mood', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPastMoods(res.data);
    } catch (err) {
      console.error('Lỗi khi tải lịch sử:', err);
    }
  };

  useEffect(() => { fetchMoods(); }, []);

  // --- 2. XỬ LÝ CHỌN MOOD ---
  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
  };

  const handleContinue = () => {
    if (selectedMood) setStep(2);
  };

  // --- 3. LƯU CẢM XÚC (GỌI API) ---
  const handleSave = async () => {
    const moodData = moods.find(m => m.id === selectedMood);
    
    try {
      await axios.post('http://localhost:5001/api/mood',
        { 
          moodLevel: moodData.level, 
          note: note 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Đã lưu cảm xúc: ${moodData.label}`);
      setStep(3); // Chuyển sang màn hình thành công
      fetchMoods(); // Cập nhật danh sách lịch sử bên dưới

    } catch (err) {
      toast.error('Lỗi khi lưu cảm xúc.');
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setNote("");
    setStep(1);
  };

  const selectedMoodData = moods.find(m => m.id === selectedMood);

  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          
          {/* --- BƯỚC 1: CHỌN CẢM XÚC --- */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-lavender mb-6 shadow-sm">
                  <Sparkles className="w-4 h-4 text-brand-sage" />
                  <span className="text-sm text-brand-text font-medium">Check-in Hàng Ngày</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-4 tracking-tight">
                  Bạn đang cảm thấy thế nào?
                </h1>
                <p className="text-gray-500 max-w-lg mx-auto">
                  Hãy dành một chút thời gian để lắng nghe cảm xúc của mình. Không có cảm xúc nào là sai cả.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {moods.map((mood, index) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.id;
                  
                  return (
                    <motion.button
                      key={mood.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`flex flex-col items-center gap-4 p-6 rounded-3xl transition-all duration-300 border-2 shadow-sm ${
                        isSelected
                          ? `${mood.color} bg-white shadow-md`
                          : "bg-white border-transparent hover:border-brand-lavender hover:shadow-md"
                      }`}
                    >
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isSelected 
                            ? `bg-gradient-to-br ${mood.gradient} text-white shadow-lg scale-110` 
                            : "bg-brand-bg text-gray-400"
                        }`}
                      >
                        <Icon className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <span className={`text-sm font-bold tracking-wide uppercase ${
                        isSelected ? "text-current" : "text-gray-400"
                      }`}>
                        {mood.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="text-center">
                <Button 
                  size="lg" 
                  onClick={handleContinue}
                  disabled={!selectedMood}
                  className="min-w-[200px] rounded-full bg-brand-sage hover:bg-brand-sage/90 text-white font-bold h-12 text-lg shadow-lg shadow-brand-sage/20 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  Tiếp tục <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* --- BƯỚC 2: VIẾT GHI CHÚ --- */}
          {step === 2 && selectedMoodData && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-10">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center bg-gradient-to-br ${selectedMoodData.gradient} shadow-xl shadow-brand-sage/20`}
                >
                  <selectedMoodData.icon className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-text mb-2">
                  Bạn đang cảm thấy {selectedMoodData.label}
                </h2>
                <p className="text-gray-500">
                  Bạn có muốn chia sẻ thêm về lý do không?
                </p>
              </div>

              <Card className="p-6 mb-8 bg-white border-brand-lavender shadow-sm rounded-3xl">
                <Textarea
                  placeholder="Hôm nay có chuyện gì đặc biệt không? (Không bắt buộc)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[150px] resize-none border-0 bg-transparent text-lg focus-visible:ring-0 placeholder:text-gray-300"
                />
              </Card>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setStep(1)}
                  className="rounded-full border-gray-200 text-gray-500 hover:text-brand-text hover:bg-gray-50 h-12 px-8"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
                </Button>
                <Button 
                  size="lg" 
                  onClick={handleSave}
                  className="min-w-[200px] rounded-full bg-brand-sage hover:bg-brand-sage/90 text-white font-bold h-12 shadow-lg shadow-brand-sage/20 transition-all hover:scale-105"
                >
                  Lưu Cảm Xúc <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* --- BƯỚC 3: THÀNH CÔNG --- */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Sparkles className="w-12 h-12 text-green-600" />
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold text-brand-text mb-4">Đã lưu thành công!</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Làm tốt lắm! Theo dõi cảm xúc là bước đầu tiên để thấu hiểu bản thân.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleReset}
                  className="rounded-full h-12 px-8"
                >
                  Ghi thêm cảm xúc khác
                </Button>
                <Link to="/">
                  <Button size="lg" className="rounded-full bg-brand-text text-white h-12 px-8">
                    Về Trang Chủ
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- DANH SÁCH LỊCH SỬ (Chỉ hiện ở Bước 1) --- */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-10 border-t border-brand-lavender/30"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-brand-lavender/30 rounded-lg text-brand-sage">
                 <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-brand-text">Lịch sử gần đây</h3>
            </div>

            <div className="space-y-4">
              {pastMoods.length === 0 ? (
                 <p className="text-gray-400 italic text-center py-10">Chưa có ghi chép nào.</p>
              ) : (
                pastMoods.map((entry, index) => {
                  // Map từ moodLevel (1-5) sang mood object để lấy icon và label
                  // (Đây là logic mapping tạm thời, bạn có thể điều chỉnh cho khớp với backend)
                  let moodId = 'happy';
                  if (entry.moodLevel === 4) moodId = 'calm'; // Ví dụ
                  // ... logic map ...
                  
                  // Để đơn giản, ta dùng find tìm gần đúng hoặc mặc định
                  const moodData = moods.find(m => m.level === entry.moodLevel) || moods[0];
                  const Icon = moodData.icon;
                  const entryDate = new Date(entry.createdAt);

                  return (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="p-4 bg-white hover:shadow-md transition-all border-brand-lavender/40 flex items-center gap-5 rounded-2xl group cursor-default">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${moodData.color} bg-opacity-20`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-gray-800 text-lg">{moodData.label}</span>
                            <span className="text-xs text-gray-400 font-medium px-2 py-0.5 bg-gray-100 rounded-full">
                               {entryDate.toLocaleDateString('vi-VN')} • {entryDate.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          {entry.note && <p className="text-gray-500 truncate group-hover:text-gray-700 transition-colors">"{entry.note}"</p>}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}