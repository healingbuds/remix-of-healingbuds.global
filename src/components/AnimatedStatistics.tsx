import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Leaf, Users, Globe, Award, CheckCircle } from "lucide-react";

// Import AI-generated photography assets
import cultivationImage from "@/assets/stats-cultivation-hero.jpg";
import researchLabImage from "@/assets/stats-research-lab.jpg";
import globalNetworkImage from "@/assets/stats-global-network.jpg";
import facilityDocsImage from "@/assets/stats-gmp-production.jpg";

// Animated counter hook
const useAnimatedCounter = (target: number, isInView: boolean, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isInView) return;
    
    const steps = 60;
    const stepValue = target / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(stepValue * currentStep));
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [isInView, target, duration]);
  
  return count;
};

// Hero Stat Card with Photography
const HeroStatCard = ({ isInView }: { isInView: boolean }) => {
  const count = useAnimatedCounter(18000, isInView);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative md:col-span-2 md:row-span-2 rounded-2xl md:rounded-3xl overflow-hidden group"
    >
      {/* Background Image with Ken Burns effect */}
      <motion.div 
        className="absolute inset-0"
        animate={isInView ? { scale: [1, 1.05] } : {}}
        transition={{ duration: 20, ease: "linear" }}
      >
        <img 
          src={cultivationImage}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-end h-full min-h-[280px] sm:min-h-[320px] md:min-h-[400px]">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-4 md:mb-6 border border-primary/30"
        >
          <Leaf className="w-6 h-6 md:w-7 md:h-7 text-primary" />
        </motion.div>
        
        {/* Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-2 md:mb-4"
        >
          <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter">
            {count.toLocaleString()}
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary ml-1">m²</span>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-white/90 text-lg md:text-xl mb-4 md:mb-6"
        >
          Cultivation Space
        </motion.p>
        
        {/* Progress Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-auto"
        >
          <div className="flex justify-between text-xs sm:text-sm text-white/60 mb-2">
            <span>Annual Production Capacity</span>
            <span className="text-primary font-medium">60,000 kg/year</span>
          </div>
          <div 
            className="h-2 md:h-2.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm"
            role="progressbar"
            aria-label="Production capacity"
            aria-valuenow={75}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-primary via-emerald-400 to-primary rounded-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: '75%' } : {}}
              transition={{ duration: 1.5, delay: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            />
          </div>
          <p className="text-xs text-white/40 mt-2">Powering EU GMP production at scale</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Secondary Stat Card with Photo Background
const ResearchCard = ({ isInView }: { isInView: boolean }) => {
  const count = useAnimatedCounter(50, isInView);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative rounded-2xl overflow-hidden group"
    >
      {/* Subtle Photo Background */}
      <div className="absolute inset-0">
        <img 
          src={researchLabImage} 
          alt=""
          loading="lazy"
          className="w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--section-color))]/95 to-[hsl(var(--section-color))]/98" />
      </div>
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl" />
      
      <div className="relative z-10 p-5 sm:p-6 md:p-7 min-h-[160px] md:min-h-[180px] flex flex-col">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-3 md:mb-4 border border-primary/20">
          <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 150 }}
        >
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{count}</span>
          <span className="text-xl sm:text-2xl font-bold text-primary">+</span>
        </motion.div>
        
        <p className="text-white/80 text-sm md:text-base font-medium mt-1">Research Partners</p>
        <p className="text-xs sm:text-sm text-white/40 mt-2">Imperial College, UPenn & more</p>
      </div>
    </motion.div>
  );
};

// Countries Card with Animated Map
const CountriesCard = ({ isInView }: { isInView: boolean }) => {
  const count = useAnimatedCounter(15, isInView);
  
  // Location coordinates for dots (relative to viewBox)
  const locations = [
    { name: 'UK', cx: 48, cy: 20 },
    { name: 'Portugal', cx: 42, cy: 28 },
    { name: 'Thailand', cx: 78, cy: 35 },
    { name: 'South Africa', cx: 55, cy: 52 },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative rounded-2xl overflow-hidden group"
    >
      {/* Global network background image */}
      <div className="absolute inset-0">
        <img 
          src={globalNetworkImage} 
          alt=""
          loading="lazy"
          className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--section-color))]/80 to-[hsl(var(--section-color))]/95" />
      </div>
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl" />
      <div className="absolute right-3 top-3 w-20 h-14 sm:w-24 sm:h-16 md:w-28 md:h-20 opacity-50">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          {/* Simplified continent outlines */}
          <path 
            d="M45,18 Q50,15 55,18 L58,22 Q55,28 50,25 Q45,22 45,18 M38,22 Q42,20 44,24 L42,30 Q38,28 36,25 Q36,23 38,22 M70,30 Q78,28 82,35 Q80,40 75,38 Q72,35 70,30 M48,42 Q55,40 60,48 L58,55 Q52,58 48,52 Q46,48 48,42"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-white/20"
          />
          
          {/* Pulsing location dots */}
          {locations.map((loc, i) => (
            <g key={loc.name}>
              {/* Pulse ring */}
              <motion.circle
                cx={loc.cx}
                cy={loc.cy}
                r="3"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
              {/* Dot */}
              <motion.circle
                cx={loc.cx}
                cy={loc.cy}
                r="2"
                fill="hsl(var(--primary))"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
              />
            </g>
          ))}
        </svg>
      </div>
      
      <div className="relative z-10 p-5 sm:p-6 md:p-7 min-h-[160px] md:min-h-[180px] flex flex-col">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-3 md:mb-4 border border-primary/20">
          <Globe className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.35, duration: 0.5, type: "spring", stiffness: 150 }}
        >
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{count}</span>
          <span className="text-xl sm:text-2xl font-bold text-primary">+</span>
        </motion.div>
        
        <p className="text-white/80 text-sm md:text-base font-medium mt-1">Countries Served</p>
        <p className="text-xs sm:text-sm text-white/40 mt-2">Global distribution network</p>
      </div>
    </motion.div>
  );
};

// Trust Banner with Certification
const TrustBanner = ({ isInView }: { isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className="md:col-span-3 relative rounded-2xl overflow-hidden"
    >
      {/* Background with photo */}
      <div className="absolute inset-0">
        <img 
          src={facilityDocsImage} 
          alt=""
          loading="lazy"
          className="w-full h-full object-cover opacity-15" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--section-color))]/95 via-[hsl(var(--section-color))]/90 to-[hsl(var(--section-color))]/95" />
      </div>
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl" />
      
      <div className="relative z-10 p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        {/* Main stat */}
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20"
            animate={isInView ? { 
              scale: [1, 1.08, 1],
              boxShadow: [
                "0 0 0 0 rgba(16, 185, 129, 0)",
                "0 0 0 8px rgba(16, 185, 129, 0.1)",
                "0 0 0 0 rgba(16, 185, 129, 0)"
              ]
            } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Award className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
          </motion.div>
          <div>
            <motion.span 
              className="text-2xl sm:text-3xl font-bold text-white block"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              100%
            </motion.span>
            <p className="text-white/80 text-sm sm:text-base">EU GMP Certified</p>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/50 text-xs sm:text-sm">
          <motion.span 
            className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06]"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6 }}
          >
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            Seed-to-Sale Traceability
          </motion.span>
          <motion.span 
            className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06]"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7 }}
          >
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            Blockchain Verified
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

interface AnimatedStatisticsProps {
  className?: string;
}

const AnimatedStatistics = ({ className = "" }: AnimatedStatisticsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section 
      ref={sectionRef}
      className={`py-16 sm:py-20 md:py-28 lg:py-32 relative overflow-hidden ${className}`}
      style={{ backgroundColor: 'hsl(var(--section-color))' }}
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
            <span className="text-xs sm:text-sm text-white/60 font-medium tracking-wide uppercase">Global Impact</span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 sm:mb-4">
            Our Impact in{" "}
            <span className="text-primary">Numbers</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
            Building the future of medical cannabis with precision and global reach
          </p>
        </motion.div>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto">
          {/* Hero stat - spans 2 columns and 2 rows on desktop */}
          <HeroStatCard isInView={isInView} />
          
          {/* Secondary stats - stacked on right */}
          <ResearchCard isInView={isInView} />
          <CountriesCard isInView={isInView} />
          
          {/* Trust banner - full width */}
          <TrustBanner isInView={isInView} />
        </div>
      </div>
    </section>
  );
};

export default AnimatedStatistics;
