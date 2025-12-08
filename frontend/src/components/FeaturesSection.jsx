import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import { BookOpen, BarChart3, Shield, Sparkles, Bell, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Nhật Ký Có Hướng Dẫn",
    description: "Những câu hỏi gợi mở giúp bạn khám phá cảm xúc và nuôi dưỡng sự tự nhận thức mỗi ngày.",
  },
  {
    icon: BarChart3,
    title: "Phân Tích Cảm Xúc",
    description: "Trực quan hóa biểu đồ tâm trạng của bạn theo thời gian để thấu hiểu bản thân hơn.",
  },
  {
    icon: Shield,
    title: "Riêng Tư & Bảo Mật",
    description: "Suy nghĩ của bạn là quý giá. Dữ liệu của bạn được bảo vệ an toàn tuyệt đối.",
  },
  {
    icon: Sparkles,
    title: "Thông Điệp Mỗi Ngày",
    description: "Bắt đầu ngày mới với những lời khẳng định tích cực được cá nhân hóa cho bạn.",
  },
  {
    icon: Bell,
    title: "Lời Nhắc Nhẹ Nhàng",
    description: "Thiết lập thông báo để duy trì thói quen viết nhật ký và chăm sóc bản thân.",
  },
  {
    icon: Users,
    title: "Cộng Đồng Hỗ Trợ",
    description: "Kết nối với những người bạn đồng hành trên con đường chữa lành tâm hồn.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-brand-bg/50" data-testid="section-features">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-brand-text">
            Công Cụ Cho Sức Khỏe Tinh Thần
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Mọi thứ bạn cần để nuôi dưỡng sức khỏe cảm xúc và tìm lại sự bình yên trong tâm hồn.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}