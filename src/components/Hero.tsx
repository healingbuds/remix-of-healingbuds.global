import React from "react";
import hbLogoSquare from "@/assets/hb-logo-square.png";
import heroVideoBg from "@/assets/hero-video-bg.jpg";
import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTranslation } from "react-i18next";
import ParticleField from "./ParticleField";
import MagneticButton from "./MagneticButton";
import SplitText from "./SplitText";

const Hero = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLElement>(null);
  const { t } = useTranslation('home');
  const [videoEnded, setVideoEnded] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Smoother spring-based parallax
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 100 });
  
  // Reduced parallax for mobile to prevent overflow
  const videoY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  const videoScale = useTransform(smoothProgress, [0, 1], [1, 1.02]);
  const contentY = useTransform(smoothProgress, [0, 1], ["0%", "25%"]);
  const logoY = useTransform(smoothProgress, [0, 1], ["0%", "10%"]);
  const logoScale = useTransform(smoothProgress, [0, 0.5], [1, 1.05]);
  const opacity = useTransform(smoothProgress, [0, 0.6], [1, 0]);
  const blur = useTransform(smoothProgress, [0, 0.5], [0, 8]);

  React.useEffect(() => {
    setIsLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
        setVideoEnded(true);
      });
    }
  }, []);

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const welcomeText = t('hero.welcome');
  const brandText = t('hero.healingBuds');

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center overflow-hidden pt-28 sm:pt-36 md:pt-44 bg-background"
    >
      {/* Cinematic Video Background with Parallax */}
      <motion.div 
        style={{ 
          y: videoY,
          scale: videoScale,
        }}
        className="absolute left-0 right-0 top-20 sm:left-2 sm:right-2 sm:top-28 md:top-32 bottom-4 rounded-b-2xl sm:rounded-2xl md:rounded-3xl overflow-hidden z-0 shadow-2xl will-change-transform"
      >
        {/* Premium particle overlay */}
        <ParticleField particleCount={50} className="z-10" />
        
        {/* Static image fallback with Ken Burns effect - reduced scale for mobile */}
        <motion.img
          src={heroVideoBg}
          alt=""
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ 
            opacity: videoEnded ? 1 : 0, 
            scale: videoEnded ? 1 : 1.02 
          }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
        />
        
        {/* Video with smooth fade */}
        <motion.video 
          ref={videoRef}
          autoPlay 
          muted 
          playsInline
          onEnded={handleVideoEnded}
          initial={{ opacity: 0 }}
          animate={{ opacity: videoEnded ? 0 : 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </motion.video>
        
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F2A25]/75 via-[#13303D]/65 to-[#1F2A25]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        
        {/* Animated ambient light orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, hsla(164, 48%, 53%, 0.25) 0%, transparent 55%)',
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, hsla(178, 48%, 33%, 0.2) 0%, transparent 50%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </motion.div>
      
      {/* Hero Content with enhanced animations */}
      <motion.div 
        style={{ 
          y: contentY, 
          opacity,
          filter: useTransform(blur, (v) => `blur(${v}px)`),
        }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-24 md:py-32"
      >
        <div className="max-w-5xl text-left relative">
          {/* Welcome text with cinematic split reveal */}
          <motion.div 
            className="pb-2 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <SplitText
              type="words"
              animation="slideUp"
              delay={0.3}
              staggerDelay={0.08}
              className="font-pharma text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white mb-2 leading-[1.15] tracking-tight drop-shadow-lg"
              charClassName="drop-shadow-lg"
            >
              {welcomeText}
            </SplitText>
          </motion.div>
          
          {/* Brand name with character-level animation */}
          <motion.div 
            className="pb-4 mb-6 sm:mb-8 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SplitText
              type="chars"
              animation="fadeUp"
              delay={0.5}
              staggerDelay={0.025}
              className="font-pharma text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-[1.15] tracking-tight drop-shadow-lg"
              charClassName="drop-shadow-lg"
            >
              {brandText}
            </SplitText>
          </motion.div>
          
          {/* Floating logo with premium mosaic effect */}
          <div className="hidden md:block absolute right-0 md:right-8 lg:right-20 top-1/4 w-[280px] md:w-[340px] lg:w-[420px] h-[280px] md:h-[340px] lg:h-[420px] pointer-events-none">
            {/* Mosaic grid with smoother animation */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.6, 0.3, 0.6] }}
                  transition={{
                    duration: 5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative overflow-hidden"
                  style={{ clipPath: 'inset(0)' }}
                >
                  <motion.img
                    src={hbLogoSquare}
                    alt=""
                    className="absolute w-[280px] md:w-[340px] lg:w-[420px] h-[280px] md:h-[340px] lg:h-[420px] object-contain opacity-[0.04]"
                    style={{
                      top: `-${Math.floor(i / 4) * 25}%`,
                      left: `-${(i % 4) * 25}%`,
                    }}
                  />
                </motion.div>
              ))}
            </div>
            {/* Main logo with glow */}
            <motion.img 
              initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
              animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
              style={{ y: logoY, scale: logoScale }}
              transition={{ 
                duration: 1.8, 
                delay: 0.8, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              src={hbLogoSquare} 
              alt="" 
              className="absolute inset-0 w-full h-full object-contain origin-center mix-blend-soft-light"
            />
          </div>
          
          {/* Tagline with blur reveal */}
          <motion.p 
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ 
              duration: 1, 
              delay: 1.2, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="font-body text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl font-light leading-relaxed drop-shadow-md"
          >
            {t('hero.tagline')}
          </motion.p>
        </div>
      </motion.div>

      {/* Premium Scroll Indicator */}
      <MagneticButton
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        magneticStrength={0.5}
        onClick={scrollToContent}
      >
        <motion.button
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 1.5, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="text-white/80 hover:text-white transition-all duration-300 cursor-pointer p-4 group"
          aria-label="Scroll to content"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative"
          >
            {/* Glow ring on hover */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/10 -m-3"
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <ChevronDown className="w-8 h-8 relative z-10" />
          </motion.div>
        </motion.button>
      </MagneticButton>
    </section>
  );
};

export default Hero;
