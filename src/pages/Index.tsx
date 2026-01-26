import Header from "@/layout/Header";
import Hero from "@/components/Hero";
import AboutHero from "@/components/AboutHero";
import ValueProps from "@/components/ValueProps";
import Cultivation from "@/components/Cultivation";
import AnimatedStatistics from "@/components/AnimatedStatistics";
import FranchiseCTA from "@/components/FranchiseCTA";
import News from "@/components/News";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import BackToTop from "@/components/BackToTop";
import SEOHead from "@/components/SEOHead";
import PullToRefresh from "@/components/PullToRefresh";
import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [scrollFade, setScrollFade] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Calculate fade opacity based on scroll position
      // Starts fading at 100px, reaches full opacity at 300px
      const fadeValue = Math.min(scrollY / 300, 1);
      setScrollFade(fadeValue);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    // Simulate refresh with a brief delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // Force re-render by updating key
    setRefreshKey(prev => prev + 1);
  }, []);

  const pageContent = (
    <PageTransition>
      <SEOHead 
        title="Healing Buds Global | Pioneering Medical Cannabis Solutions"
        description="Pioneering tomorrow's medical cannabis solutions with EU GMP-certified products, blockchain traceability, and global distribution across UK, South Africa, Thailand, and Portugal."
        canonical="/"
      />
      <div className="min-h-screen bg-background app-container" key={refreshKey}>
        <Header />
        {/* Dynamic scroll-based fade overlay from hero bottom */}
        <div 
          className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/30 via-background/15 to-transparent z-30 pointer-events-none transition-opacity duration-500 ease-out"
          style={{ opacity: scrollFade * 0.4 }}
        />
        <main className="app-main">
          <Hero />
          <AboutHero />
          <ValueProps />
          <AnimatedStatistics />
          <Cultivation />
          <FranchiseCTA />
          <News />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );

  // Only enable pull-to-refresh on mobile
  if (isMobile) {
    return (
      <PullToRefresh onRefresh={handleRefresh}>
        {pageContent}
      </PullToRefresh>
    );
  }

  return pageContent;
};

export default Index;
