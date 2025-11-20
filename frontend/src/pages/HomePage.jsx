import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const features = [
    {
      title: "Nhật ký Cá nhân",
      description: "Viết ra những suy nghĩ, trút bỏ gánh nặng trong lòng.",
      link: "/journal",
      btnText: "Viết Nhật ký",
      emoji: "📔"
    },
    {
      title: "Theo dõi Cảm xúc",
      description: "Ghi lại tâm trạng mỗi ngày để thấu hiểu bản thân hơn.",
      link: "/mood",
      btnText: "Check-in Cảm xúc",
      emoji: "😊"
    },
    {
      title: "Thư viện Chữa lành",
      description: "Tìm kiếm sự bình yên qua các bài viết và âm nhạc.",
      link: "/library",
      btnText: "Khám phá ngay",
      emoji: "🌿"
    }
  ];

  return (
    <div className="space-y-8 py-8">
      {/* Phần Chào mừng */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-text tracking-tight">
          Chào mừng bạn trở lại! ✨
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Đây là không gian an toàn của bạn. Hãy thả lỏng, hít thở sâu và bắt đầu hành trình chữa lành.
        </p>
      </section>

      {/* Phần Trích dẫn (Quote) */}
      <Card className="bg-brand-lavender/20 border-none shadow-none">
        <CardContent className="pt-6 text-center italic text-gray-700 text-lg">
          "Hạnh phúc không phải là đích đến, mà là hành trình chúng ta đang đi."
        </CardContent>
      </Card>

      {/* Grid các tính năng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-brand-lavender hover:-translate-y-1 bg-white">
            <CardHeader>
              <div className="text-4xl mb-2">{feature.emoji}</div>
              <CardTitle className="text-xl text-brand-text">{feature.title}</CardTitle>
              <CardDescription className="text-gray-500 h-12">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={feature.link}>
                <Button className="w-full bg-brand-sage text-brand-text hover:bg-brand-sage/90">
                  {feature.btnText}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;