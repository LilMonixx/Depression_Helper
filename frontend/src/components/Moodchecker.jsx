import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Sun, Heart, Moon, Zap, Cloud, CloudRain, Smile, Star, Frown } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';
import API_URL from '@/utils/apiConfig';

// Định nghĩa danh sách cảm xúc giống thiết kế Serenity
const moods = [
  { id: "happy", icon: Smile, label: "Hạnh phúc" },
  { id: "calm", icon: Sun, label: "Bình yên" },
  { id: "grateful", icon: Star, label: "Biết ơn" },
  { id: "loved", icon: Heart, label: "Được yêu" },
  { id: "stressed", icon: Cloud, label: "Căng thẳng" },
  { id: "sad", icon: Frown, label: "Buồn bã" },
  
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const token = localStorage.getItem('token');

  const handleMoodSelect = async (moodId) => {
    const mood = moods.find(m => m.id === moodId);
    setSelectedMood(moodId);
    
    // Gửi dữ liệu lên server ngay khi chọn (hoặc bạn có thể để nút Save riêng)
    try {
        // Map moodId sang moodLevel (1-5) để khớp với Backend hiện tại
        // Tạm thời map đơn giản, bạn có thể sửa backend để lưu string nếu muốn
        let level = 3;
        if (['happy','loved'].includes(moodId)) level = 5;
        if (['grateful'].includes(moodId)) level = 4;
        if (['calm'].includes(moodId)) level = 3;
        if (['stressed'].includes(moodId)) level = 2;
        if (['sad'].includes(moodId)) level = 1;

        await axios.post(`${API_URL}/api/mood`, 
          { moodLevel: level, note: mood.label }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`Đã ghi nhận: ${mood.label}`);
    } catch (err) {
        console.error(err);
        toast.error("Lỗi kết nối");
    }
  };

  return (
    <section className="py-12 px-6 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl shadow-brand-sage/5 my-8" data-testid="section-mood-tracker">
      <div className="max-w-5xl mx-auto text-center">
        
        {/* Tiêu đề */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-[#E8F3EE] text-[#437657] text-xs font-bold tracking-widest uppercase">
            Daily Check-in
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight text-gray-800">
            How are you feeling today?
          </h2>
          <p className="text-gray-500 mb-12 font-light">
            Take a moment to check in with yourself
          </p>
        </motion.div>

        {/* Danh sách Icon */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {moods.map((mood, index) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodSelect(mood.id)}
                className={`
                  flex flex-col items-center justify-center w-28 h-32 rounded-2xl transition-all duration-300 border-2
                  ${isSelected 
                    ? "bg-[#437657] border-[#437657] text-white shadow-lg shadow-[#437657]/30" 
                    : "bg-white border-transparent text-gray-400 hover:border-[#A0D6B4] hover:text-[#437657] hover:shadow-md"
                  }
                `}
              >
                <Icon className={`w-8 h-8 mb-3 ${isSelected ? "text-white" : "currentColor"}`} strokeWidth={1.5} />
                
                <span className={`text-xs font-bold tracking-wider uppercase ${isSelected ? "text-white" : "text-gray-400"}`}>
                  {mood.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Thông báo trạng thái */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <p className="text-sm text-gray-500">
              Bạn đã chọn: <span className="font-semibold text-[#437657] text-lg ml-1">
                {moods.find(m => m.id === selectedMood)?.label}
              </span>
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}