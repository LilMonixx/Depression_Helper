import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-2xl bg-white border border-brand-lavender/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brand-sage/50"
    >
      <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center mb-4 text-brand-sage ring-1 ring-brand-lavender">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold text-brand-text mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;