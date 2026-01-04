import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import MoodChart from "@/components/MoodChart";
import { 
  Smile, Heart, Cloud, Frown, Star, Sun, 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Sparkles, Loader2, CheckCircle2, Lock, Clock, Plus, History
} from "lucide-react";
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameDay, addMonths, subMonths, getDay, parseISO, 
  isAfter, startOfDay 
} from 'date-fns';
import { vi } from 'date-fns/locale';

// --- CẤU HÌNH MOOD ---
const MOODS_CONFIG = [
  { id: "happy", level: 5, icon: Smile, label: "Hạnh phúc", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", gradient: "from-emerald-400 to-emerald-600" },
  { id: "calm", level: 4, icon: Sun, label: "Bình yên", color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-200", gradient: "from-sky-400 to-sky-600" },
  { id: "grateful", level: 4, icon: Star, label: "Biết ơn", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", gradient: "from-purple-400 to-purple-600" },
  { id: "loved", level: 5, icon: Heart, label: "Được yêu", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", gradient: "from-rose-400 to-rose-600" },
  { id: "stressed", level: 2, icon: Cloud, label: "Căng thẳng", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", gradient: "from-amber-400 to-amber-600" },
  { id: "sad", level: 1, icon: Frown, label: "Buồn bã", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", gradient: "from-indigo-400 to-indigo-600" },
];

export default function MoodPage() {
  const [moodsData, setMoodsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Form State
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");

  const token = localStorage.getItem('token');
  const isFutureDate = isAfter(startOfDay(selectedDate), startOfDay(new Date()));

  // --- LOGIC MỚI: GROUP BY DATE (MỘT NGÀY CÓ NHIỀU MOOD) ---
  const moodMap = useMemo(() => {
    const map = {};
    moodsData.forEach(item => {
      const dateStr = format(parseISO(item.createdAt || item.logDate), 'yyyy-MM-dd');
      // Nếu chưa có mảng cho ngày này thì tạo mới
      if (!map[dateStr]) {
        map[dateStr] = [];
      }
      // Thêm mood vào mảng
      map[dateStr].push(item);
    });
    
    // Sắp xếp mood trong từng ngày theo thời gian (cũ nhất -> mới nhất)
    Object.keys(map).forEach(key => {
      map[key].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    return map;
  }, [moodsData]);

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
  }, [currentDate]);

  const startDayIndex = getDay(startOfMonth(currentDate));

  // --- API CALLS ---
  const fetchMoods = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5001/api/mood', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMoodsData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được dữ liệu lịch sử");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMoods(); }, []);

  // --- EFFECT: RESET FORM KHI ĐỔI NGÀY ---
  // (Không còn auto-fill đè lên nữa, mà reset để nhập mới)
  useEffect(() => {
    setSelectedMood(null);
    setNote("");
  }, [selectedDate]);

  const handleSave = async () => {
    if (isFutureDate) return; 

    if (!selectedMood) {
      toast.warning("Bạn chưa chọn cảm xúc nào!");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:5001/api/mood', 
        { 
          moodLevel: selectedMood.level, 
          note: note,
          logDate: selectedDate 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Đã thêm nhật ký thành công! 🎉");
      
      // Reset form sau khi lưu để người dùng có thể nhập tiếp nếu muốn
      setSelectedMood(null);
      setNote("");
      
      fetchMoods();
    } catch (err) {
      toast.error("Lỗi khi lưu cảm xúc");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper lấy dữ liệu của ngày đang chọn
  const currentDayMoods = moodMap[format(selectedDate, 'yyyy-MM-dd')] || [];

  return (
    <div className="min-h-screen bg-brand-bg p-4 md:p-8 font-sans pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-brand-lavender/50 mb-2 backdrop-blur-sm">
             <Sparkles className="w-4 h-4 text-brand-sage" />
             <span className="text-xs font-bold text-brand-text uppercase tracking-wider">Mood Tracker</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text flex items-center justify-center gap-3">
            Nhật Ký Cảm Xúc
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* === CỘT TRÁI: LỊCH === */}
          <div className="lg:col-span-7 space-y-6">
 
            <motion.div 
              className="bg-white rounded-[2rem] shadow-xl shadow-brand-lavender/10 overflow-hidden border border-white"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-gray-50/30">
                <h2 className="text-xl font-bold text-brand-text capitalize flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-brand-sage" />
                  {format(currentDate, 'MMMM yyyy', { locale: vi })}
                </h2>
                <div className="flex gap-1 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="h-8 w-8 rounded-full hover:bg-gray-100">
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="h-8 w-8 rounded-full hover:bg-gray-100">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-7 mb-4 text-center">
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                    <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wider">{day}</div>
                  ))}
                </div>

                {loading ? (
                   <div className="h-64 flex items-center justify-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin" />
                   </div>
                ) : (
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: startDayIndex }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}

                    {calendarDays.map((day) => {
                      const dateKey = format(day, 'yyyy-MM-dd');
                      const dailyMoods = moodMap[dateKey] || []; // Lấy danh sách mood của ngày đó
                      
                      // LOGIC HIỂN THỊ ICON TRÊN LỊCH:
                      // Lấy cái MỚI NHẤT (cái cuối cùng trong mảng) để hiển thị chính
                      const latestMoodEntry = dailyMoods.length > 0 ? dailyMoods[dailyMoods.length - 1] : null;
                      
                      const config = latestMoodEntry ? MOODS_CONFIG.find(m => m.level === latestMoodEntry.moodLevel) : null;
                      const Icon = config ? config.icon : null;
                      
                      const isSelected = isSameDay(day, selectedDate);
                      const isToday = isSameDay(day, new Date());
                      const isDayFuture = isAfter(startOfDay(day), startOfDay(new Date()));

                      return (
                        <motion.button
                          key={day.toString()}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDate(day)}
                          className={`
                            aspect-square rounded-2xl flex flex-col items-center justify-between p-1.5 transition-all relative group
                            ${isSelected ? 'ring-2 ring-brand-sage ring-offset-2 shadow-lg bg-white z-10' : 'hover:bg-gray-50 border border-transparent'}
                            ${config ? config.bg : 'bg-white'} 
                            ${!config && !isSelected ? 'border-gray-50' : ''}
                            ${isDayFuture && !isSelected ? 'opacity-50' : 'opacity-100'} 
                          `}
                        >
                          <span className={`text-xs ${isToday ? 'bg-brand-sage text-white px-1.5 rounded-full font-bold shadow-sm' : 'text-gray-400'}`}>
                            {format(day, 'd')}
                          </span>
                          
                          <div className="flex-1 flex items-center justify-center relative">
                            {Icon ? (
                              <>
                                <Icon className={`w-6 h-6 ${config.color}`} />
                                {/* Nếu có nhiều hơn 1 mood, hiện dấu + nhỏ */}
                                {dailyMoods.length > 1 && (
                                  <div className="absolute -top-1 -right-2 bg-white rounded-full border border-gray-100 shadow-sm w-4 h-4 flex items-center justify-center">
                                    <span className="text-[9px] font-bold text-gray-500">+{dailyMoods.length - 1}</span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-100 group-hover:bg-gray-200" />
                            )}
                          </div>
                          
                          {/* Dấu chấm báo hiệu có Note */}
                          {latestMoodEntry?.note && (
                             <div className="w-1 h-1 rounded-full bg-gray-400/50 mb-0.5" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* === CỘT PHẢI: FORM NHẬP & TIMELINE === */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              className="bg-white rounded-[2.5rem] shadow-xl shadow-brand-sage/5 border border-white sticky top-6 overflow-hidden min-h-[600px] flex flex-col"
            >
              {/* Header Ngày */}
              <div className={`p-6 text-center border-b border-gray-50 ${isSameDay(selectedDate, new Date()) ? 'bg-brand-sage/5' : 'bg-gray-50/50'}`}>
                 <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Dòng thời gian</p>
                 <h3 className={`text-xl font-bold ${isSameDay(selectedDate, new Date()) ? 'text-brand-sage' : 'text-gray-700'}`}>
                    {isSameDay(selectedDate, new Date()) ? 'Hôm nay' : format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi })}
                 </h3>
              </div>
              
              {isFutureDate ? (
                // --- GIAO DIỆN KHÓA ---
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6 opacity-0 animate-fade-in" style={{opacity: 1}}>
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center relative">
                        <Clock className="w-10 h-10 text-gray-300" />
                        <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm">
                            <Lock className="w-5 h-5 text-brand-sage" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-700 mb-2">Chưa đến ngày này</h4>
                        <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                            Hãy sống trọn vẹn hôm nay trước nhé. Tương lai vẫn đang chờ bạn phía trước.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedDate(new Date())} className="rounded-full border-brand-lavender text-brand-sage hover:bg-brand-sage/5">
                        Quay về Hôm nay
                    </Button>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  
                  {/* --- PHẦN 1: DANH SÁCH CÁC CẢM XÚC ĐÃ GHI (TIMELINE) --- */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[400px] custom-scrollbar">
                    {currentDayMoods.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">
                        <p className="mb-2">Ngày này chưa có ghi chép nào.</p>
                        <p className="text-sm">Hãy bắt đầu dòng đầu tiên nhé!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         {currentDayMoods.map((entry, idx) => {
                           const config = MOODS_CONFIG.find(m => m.level === entry.moodLevel);
                           const Icon = config ? config.icon : Smile;
                           const timeStr = format(parseISO(entry.createdAt), 'HH:mm');
                           
                           return (
                             <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex gap-4 items-start group"
                             >
                               {/* Cột mốc thời gian */}
                               <div className="flex flex-col items-center mt-1">
                                  <span className="text-xs font-bold text-gray-400 mb-1">{timeStr}</span>
                                  <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${config?.bg || 'bg-gray-200'}`}></div>
                                  {idx !== currentDayMoods.length - 1 && <div className="w-0.5 h-full bg-gray-100 mt-1 min-h-[20px]"></div>}
                               </div>
                               
                               {/* Thẻ nội dung */}
                               <div className={`flex-1 p-4 rounded-2xl border ${config?.border || 'border-gray-100'} ${config?.bg || 'bg-gray-50'} bg-opacity-30 hover:bg-opacity-100 transition-all`}>
                                  <div className="flex items-center gap-2 mb-2">
                                     <Icon className={`w-4 h-4 ${config?.color}`} />
                                     <span className={`text-sm font-bold ${config?.color}`}>{config?.label || 'Cảm xúc'}</span>
                                  </div>
                                  {entry.note && (
                                    <p className="text-sm text-gray-600 italic">"{entry.note}"</p>
                                  )}
                               </div>
                             </motion.div>
                           )
                         })}
                      </div>
                    )}
                  </div>

                  {/* --- PHẦN 2: FORM NHẬP MỚI (ADD NEW) --- */}
                  <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-10">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                      <Plus className="w-3 h-3" /> Thêm cảm xúc mới
                    </p>
                    
                    <div className="space-y-4">
                      {/* Chọn Mood Compact */}
                      <div className="flex justify-between gap-1 overflow-x-auto pb-2">
                        {MOODS_CONFIG.map((mood) => {
                          const Icon = mood.icon;
                          const isSelected = selectedMood?.id === mood.id;
                          return (
                            <button
                              key={mood.id}
                              onClick={() => setSelectedMood(mood)}
                              className={`
                                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all
                                ${isSelected ? `bg-gradient-to-br ${mood.gradient} text-white shadow-md scale-110` : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}
                              `}
                              title={mood.label}
                            >
                              <Icon className="w-5 h-5" />
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Tên mood đang chọn */}
                      {selectedMood && (
                         <p className={`text-center text-xs font-bold ${selectedMood.color}`}>
                           Đang chọn: {selectedMood.label}
                         </p>
                      )}

                      {/* Input Note Compact */}
                      <div className="relative">
                        <Textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Cập nhật trạng thái hiện tại..."
                          className="min-h-[60px] pr-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-brand-sage/20 text-sm"
                        />
                        <Button 
                          size="sm"
                          onClick={handleSave}
                          disabled={submitting}
                          className="absolute bottom-2 right-2 h-8 w-8 rounded-lg p-0 bg-brand-sage hover:bg-brand-sage/90"
                        >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Plus className="w-5 h-5 text-white" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}