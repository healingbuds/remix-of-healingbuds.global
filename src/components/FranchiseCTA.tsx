import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Globe, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const FranchiseCTA = () => {
  const { t } = useTranslation('common');

  const features = [
    { icon: Building2, labelKey: "franchiseCTA.feature1" },
    { icon: Globe, labelKey: "franchiseCTA.feature2" },
    { icon: Award, labelKey: "franchiseCTA.feature3" },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background with gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.95) 0%, hsl(var(--secondary) / 0.9) 50%, hsl(178 35% 18%) 100%)'
        }}
      />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-white/90">{t('franchiseCTA.badge')}</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-jakarta font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-6 leading-tight"
          >
            {t('franchiseCTA.headline')}
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
          >
            {t('franchiseCTA.subheadline')}
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12"
          >
            {features.map(({ icon: Icon, labelKey }, index) => (
              <div key={index} className="flex items-center gap-2 text-white/90">
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-body text-sm md:text-base">{t(labelKey)}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button - Enhanced for mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="px-4 sm:px-0"
          >
            <Link
              to="/franchise-opportunities"
              className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white text-primary font-semibold rounded-full shadow-lg hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 active:scale-[0.98] touch-manipulation min-h-[56px]"
            >
              {t('franchiseCTA.cta')}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FranchiseCTA;
