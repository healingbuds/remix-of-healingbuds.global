import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Leaf, Users, FlaskConical, CheckCircle, Shield, Microscope } from "lucide-react";

// Import AI-generated photography assets
import qualityImage from "@/assets/value-quality.jpg";
import accessImage from "@/assets/value-access.jpg";
import researchImage from "@/assets/value-research.jpg";

// Hero Quality Card with Photography
const QualityCard = ({ isInView }: { isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative md:col-span-2 rounded-2xl md:rounded-3xl overflow-hidden group"
    >
      {/* Background Image with Ken Burns effect */}
      <motion.div 
        className="absolute inset-0"
        animate={isInView ? { scale: [1, 1.05] } : {}}
        transition={{ duration: 20, ease: "linear" }}
      >
        <img 
          src={qualityImage}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col justify-end h-full min-h-[320px] sm:min-h-[360px] md:min-h-[400px]">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-4 md:mb-6 border border-primary/30"
        >
          <Leaf className="w-6 h-6 md:w-7 md:h-7 text-primary" />
        </motion.div>
        
        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-3 md:mb-4"
        >
          Superior Quality
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mb-5 md:mb-6"
        >
          Every stage from cultivation through extraction to final production is meticulously managed. Our EU GMP-certified products meet the highest international standards.
        </motion.p>
        
        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 sm:gap-4"
        >
          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-white/60 bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.08]">
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
            EU GMP Certified
          </span>
          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-white/60 bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.08]">
            <Shield className="w-3.5 h-3.5 text-primary" />
            Pharmaceutical Grade
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Access Card with Photo Background
const AccessCard = ({ isInView }: { isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative rounded-2xl overflow-hidden group"
    >
      {/* Photo Background */}
      <div className="absolute inset-0">
        <img 
          src={accessImage} 
          alt=""
          loading="lazy"
          className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(178_48%_21%)]/90 to-[hsl(178_48%_15%)]/95" />
      </div>
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl" />
      
      <div className="relative z-10 p-5 sm:p-6 md:p-7 min-h-[200px] md:min-h-[220px] flex flex-col">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-3 md:mb-4 border border-primary/20">
          <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        
        <motion.h3
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 150 }}
          className="text-xl sm:text-2xl font-bold text-white mb-2"
        >
          Expanding Access
        </motion.h3>
        
        <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
          Ensuring medical cannabis reaches those who need it most through evidence-based advocacy and education.
        </p>
        
        <div className="mt-auto flex items-center gap-2 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-primary" />
            Reducing barriers
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-primary" />
            Safe access
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Research Card with Photo Background
const ResearchCard = ({ isInView }: { isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative rounded-2xl overflow-hidden group"
    >
      {/* Photo Background */}
      <div className="absolute inset-0">
        <img 
          src={researchImage} 
          alt=""
          loading="lazy"
          className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(178_48%_21%)]/90 to-[hsl(178_48%_15%)]/95" />
      </div>
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl" />
      
      <div className="relative z-10 p-5 sm:p-6 md:p-7 min-h-[200px] md:min-h-[220px] flex flex-col">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-3 md:mb-4 border border-primary/20">
          <FlaskConical className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        
        <motion.h3
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.35, duration: 0.5, type: "spring", stiffness: 150 }}
          className="text-xl sm:text-2xl font-bold text-white mb-2"
        >
          Research-Driven
        </motion.h3>
        
        <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
          Collaborating with world-class institutions including Imperial College London and University of Pennsylvania.
        </p>
        
        <div className="mt-auto flex items-center gap-2 text-xs text-white/50">
          <Microscope className="w-3 h-3 text-primary" />
          <span>50+ research partners</span>
        </div>
      </div>
    </motion.div>
  );
};

// Mission Banner
const MissionBanner = ({ isInView }: { isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className="md:col-span-3 relative rounded-2xl overflow-hidden"
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl" />
      
      <div className="relative z-10 p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        {/* Main message */}
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/15 flex items-center justify-center border border-primary/20"
            animate={isInView ? { 
              scale: [1, 1.08, 1],
              boxShadow: [
                "0 0 0 0 hsl(var(--primary) / 0)",
                "0 0 0 8px hsl(var(--primary) / 0.1)",
                "0 0 0 0 hsl(var(--primary) / 0)"
              ]
            } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </motion.div>
          <div>
            <motion.span 
              className="text-xl sm:text-2xl font-bold text-white block"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              Growing more than medicine
            </motion.span>
            <p className="text-white/60 text-sm sm:text-base">Building trust through quality, access, and innovation</p>
          </div>
        </div>
        
        {/* Values summary */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/50 text-xs sm:text-sm">
          <motion.span 
            className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06]"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6 }}
          >
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            Seed-to-Sale Excellence
          </motion.span>
          <motion.span 
            className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06]"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7 }}
          >
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            Patient-First Approach
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

interface ValuePropsProps {
  className?: string;
}

const ValueProps = ({ className = "" }: ValuePropsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <div className={`px-2 my-8 md:my-12 ${className}`}>
      <section 
        ref={sectionRef}
        className="py-16 sm:py-20 md:py-28 rounded-2xl sm:rounded-3xl relative overflow-hidden"
        style={{ backgroundColor: 'hsl(178 48% 21%)' }}
      >
        {/* Subtle background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4 sm:mb-6"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs sm:text-sm text-white/60 font-medium tracking-wide uppercase">Our Values</span>
            </motion.div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 sm:mb-4">
              Growing more than{" "}
              <span className="text-primary">medicine</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
              Quality, access, and innovation at the heart of everything we do
            </p>
          </motion.div>
          
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto">
            {/* Hero quality card - spans 2 columns on desktop */}
            <QualityCard isInView={isInView} />
            
            {/* Secondary cards - stacked on right */}
            <AccessCard isInView={isInView} />
            <ResearchCard isInView={isInView} />
            
            {/* Mission banner - full width */}
            <MissionBanner isInView={isInView} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ValueProps;
