import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Header from "@/layout/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import BackToTop from "@/components/BackToTop";
import ScrollAnimation from "@/components/ScrollAnimation";

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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <PageBreadcrumb />
          </div>

          {/* Hero Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <ScrollAnimation>
              <div className="text-center mb-12">
                {/* Region Switcher */}
                <div className="flex justify-center mb-6">
                  <RegionSwitcher />
                </div>
                <h1 className="font-pharma text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
                  {t("hero.title")}
                </h1>
                <p className="font-geist text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t("hero.subtitle")}
                </p>
              </div>
            </ScrollAnimation>

            {/* Featured Articles Carousel */}
            {featuredArticles.length > 0 && (
              <ScrollAnimation delay={0.1}>
                <FeaturedArticleCarousel articles={featuredArticles} />
              </ScrollAnimation>
            )}
          </section>

          {/* All Articles Grid */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation>
              <h2 className="font-pharma text-2xl sm:text-3xl font-semibold text-foreground mb-8">
                {t("latestUpdates")}
              </h2>
            </ScrollAnimation>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {otherArticles.map((article, index) => (
                <ScrollAnimation key={article.id} delay={index * 0.1}>
                  <Link to={`/the-wire/${article.id}`}>
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 rounded-2xl cursor-pointer hover:-translate-y-2 h-full flex flex-col">
                      <div className="relative h-56 overflow-hidden bg-muted">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
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
                        <h3 className="font-geist text-lg font-semibold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="font-geist text-muted-foreground text-sm line-clamp-3 leading-relaxed flex-grow">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                          <span className="text-xs text-muted-foreground font-geist">
                            {article.date}
                          </span>
                          <Button
                            variant="link"
                            className="p-0 text-primary font-semibold text-sm"
                          >
                            {t("readMore")}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          </section>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default TheWire;