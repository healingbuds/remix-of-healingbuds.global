import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/layout/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import BackToTop from "@/components/BackToTop";
import ScrollAnimation from "@/components/ScrollAnimation";
import TextReveal from "@/components/TextReveal";
import SplitText from "@/components/SplitText";
import { useSharedLayout } from "@/context/SharedLayoutContext";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import RegionSwitcher from "@/components/RegionSwitcher";
import FeaturedArticleCarousel from "@/components/FeaturedArticleCarousel";
import { useNewsRegion } from "@/hooks/useNewsRegion";

const TheWire = () => {
  const { t } = useTranslation("theWire");
  const [menuOpen, setMenuOpen] = useState(false);
  const { articles } = useNewsRegion();
  
  const featuredArticles = articles.filter((a) => a.featured);
  const otherArticles = articles.filter((a) => !a.featured);

  // Staggered card animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <PageTransition>
      <SEOHead 
        title="The Wire - News & Updates | Healing Buds Global"
        description="Stay updated with the latest news, research breakthroughs, and industry developments from Healing Buds Global. Expert insights on medical cannabis."
        canonical="/the-wire"
        keywords="cannabis news, medical cannabis updates, industry news, research breakthroughs, Healing Buds news"
      />
      <div className="min-h-screen bg-background">
        <Header onMenuStateChange={setMenuOpen} />
        <main className="pt-32 sm:pt-36 pb-20">
          {/* Breadcrumb */}
          <motion.div 
            className="container mx-auto px-4 sm:px-6 lg:px-8 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <PageBreadcrumb />
          </motion.div>

          {/* Hero Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="text-center mb-12">
              {/* Region Switcher */}
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <RegionSwitcher />
              </motion.div>
              
              <TextReveal delay={0.2} as="h1">
                <span className="font-pharma text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
                  {t("hero.title")}
                </span>
              </TextReveal>
              
              <motion.p 
                className="font-geist text-lg text-muted-foreground max-w-2xl mx-auto mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {t("hero.subtitle")}
              </motion.p>
            </div>

            {/* Featured Articles Carousel */}
            {featuredArticles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <FeaturedArticleCarousel articles={featuredArticles} />
              </motion.div>
            )}
          </section>

          {/* All Articles Grid */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation>
              <h2 className="font-pharma text-2xl sm:text-3xl font-semibold text-foreground mb-8">
                {t("latestUpdates")}
              </h2>
            </ScrollAnimation>

            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {otherArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <Link to={`/the-wire/${article.id}`}>
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-border/50 rounded-2xl cursor-pointer h-full flex flex-col bg-card">
                      {/* Shared Image Element */}
                      <motion.div 
                        className="relative h-56 overflow-hidden bg-muted"
                        layoutId={`article-image-${article.id}`}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <motion.img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        />
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className="font-geist border-secondary/60 text-secondary bg-secondary/10 rounded-full px-3 py-1 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {/* Shared Title Element */}
                        <motion.h3 
                          className="font-geist text-lg font-semibold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2"
                          layoutId={`article-title-${article.id}`}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          }}
                        >
                          {article.title}
                        </motion.h3>
                        <p className="font-geist text-muted-foreground text-sm line-clamp-3 leading-relaxed flex-grow">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                          <span className="text-xs text-muted-foreground font-geist">
                            {article.date}
                          </span>
                          <span className="text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1">
                            {t("readMore")}
                            <motion.span
                              className="inline-block"
                              initial={{ x: 0 }}
                              whileHover={{ x: 4 }}
                            >
                              →
                            </motion.span>
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default TheWire;
