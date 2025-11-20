import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

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
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchMoods = async () => {
    if (!token) return navigate('/login');
    try {
      const res = await axios.get('http://localhost:5001/api/mood', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPastMoods(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchMoods(); }, []);

  const handleSubmit = async () => {
    if (!selectedMood) return toast.error('Vui lòng chọn một cảm xúc.');

    try {
      await axios.post('http://localhost:5001/api/mood',
        { moodLevel: selectedMood.level, note: note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Đã lưu: ${selectedMood.label}`);
      fetchMoods();
      setSelectedMood(null);
      setNote('');
    } catch (err) {
      toast.error('Lỗi khi lưu cảm xúc.');
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-sm border-brand-lavender">
        <CardHeader>
          <CardTitle className="text-center text-xl">Bạn cảm thấy thế nào ngay lúc này?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around mb-6 flex-wrap gap-2">
            {moodLevels.map((mood) => (
              <Button
                key={mood.level}
                variant={selectedMood?.level === mood.level ? 'default' : 'outline'}
                className={`flex flex-col h-24 w-24 transition-all ${selectedMood?.level === mood.level ? 'bg-brand-lavender text-brand-text border-brand-sage ring-2 ring-brand-sage' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedMood(mood)}
              >
                <span className="text-4xl mb-1">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.label}</span>
              </Button>
            ))}
          </div>
          
          <Textarea
            placeholder="Ghi chú thêm về cảm xúc của bạn (tùy chọn)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-4"
          />
          
          <Button onClick={handleSubmit} className="w-full bg-brand-sage text-brand-text hover:bg-brand-sage/90" disabled={!selectedMood}>
            Lưu cảm xúc
          </Button>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-brand-text">Lịch sử cảm xúc</h2>
        {pastMoods.length === 0 ? <p className="text-gray-500 italic">Bạn chưa có ghi chép nào.</p> : (
          pastMoods.map((mood) => {
            const moodInfo = moodLevels.find(m => m.level === mood.moodLevel);
            const entryTime = new Date(mood.createdAt);
            
            return (
              <Card key={mood._id} className="bg-white/80 border-l-4 border-l-brand-sage">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{moodInfo?.emoji}</span>
                      <div className="flex flex-col">
                        <span className="text-base font-bold">{moodInfo?.label}</span>
                        <span className="text-xs text-gray-400 font-normal">
                           {entryTime.toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {entryTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </CardTitle>
                </CardHeader>
                {mood.note && (
                  <CardContent>
                    <p className="text-gray-600 italic border-l-2 pl-3 border-gray-200">"{mood.note}"</p>
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