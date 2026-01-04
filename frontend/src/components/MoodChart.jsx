import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';

const MoodChart = ({ moodData }) => {
  
  // 1. Xử lý dữ liệu: Lấy 7 ngày gần nhất & Map sang format cho biểu đồ
  const chartData = useMemo(() => {
    // Tạo mảng 7 ngày gần nhất (để ngày nào không có mood thì điểm = 0 hoặc null)
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return format(d, 'yyyy-MM-dd');
    });

    return last7Days.map(dateStr => {
      // Tìm mood trong ngày đó (Lấy cái mới nhất nếu có nhiều cái)
      const entry = moodData.find(m => {
          const mDate = m.createdAt || m.logDate; // check cả 2 trường hợp
          return mDate && mDate.startsWith(dateStr);
      });

      return {
        date: format(parseISO(dateStr), 'dd/MM'), // Hiển thị trục hoành: 02/01
        fullDate: dateStr,
        score: entry ? entry.moodLevel : null, // Nếu không có mood thì null (để đứt nét)
        label: entry ? entry.mood : '',
      };
    });
  }, [moodData]);

  // Custom Tooltip khi rê chuột vào
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
          <p className="text-xs text-gray-400 font-bold mb-1">{label}</p>
          <p className="text-sm font-bold text-emerald-600">
            {payload[0].payload.label || 'Không có dữ liệu'}
          </p>
          <p className="text-xs text-gray-500">
            Điểm số: {payload[0].value}/5
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-lg font-bold text-gray-700">Biểu đồ tâm trạng (7 ngày)</h3>
         <div className="text-xs font-medium bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
            Xu hướng tuần
         </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#9CA3AF', fontSize: 12}} 
            dy={10}
          />
          
          <YAxis 
            hide domain={[0, 6]} // Ẩn trục Y cho gọn, range từ 0-6 để chart thoáng
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            type="monotone" // Đường cong mềm mại
            dataKey="score" 
            stroke="#10B981" // Màu xanh emerald chủ đạo
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorScore)" 
            connectNulls={true} // Nối các điểm lại dù có ngày nghỉ viết
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;