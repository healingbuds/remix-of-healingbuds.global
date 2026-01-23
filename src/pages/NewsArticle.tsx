import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { motion } from "framer-motion";
import Header from "@/layout/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import BackToTop from "@/components/BackToTop";
import ReadingProgress from "@/components/ReadingProgress";
import ImageReveal from "@/components/ImageReveal";
import TextReveal from "@/components/TextReveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, ExternalLink, MapPin } from "lucide-react";
import { useNewsRegion, regionOptions } from "@/hooks/useNewsRegion";
import { findArticleById, getRelatedArticles } from "@/data/newsArticles";
import ScrollAnimation from "@/components/ScrollAnimation";

const NewsArticle = () => {
  const { t } = useTranslation("theWire");
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { currentRegionOption } = useNewsRegion();
  const articleRef = useRef<HTMLElement>(null);
  
  // Find article across all regions (not just current region)
  const article = articleId ? findArticleById(articleId) : undefined;
  const relatedArticles = articleId ? getRelatedArticles(articleId, 2) : [];
  
  // Get the article's region info for display
  const articleRegion = article?.region || 'GLOBAL';
  const articleRegionOption = regionOptions.find(r => 
    r.code === articleRegion || (articleRegion === 'ALL' && r.code === 'GLOBAL')
  ) || regionOptions[0];

  if (!article) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-32 pb-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-pharma text-4xl mb-4">{t("articleNotFound.title")}</h1>
              <p className="text-muted-foreground mb-8">
                {t("articleNotFound.description")}
              </p>
              <Button onClick={() => navigate("/the-wire")}>
                {t("articleNotFound.backButton")}
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Reading Progress Bar */}
        <ReadingProgress color="gradient" />
        
        <Header />
        <main ref={articleRef} className="pt-32 sm:pt-36 pb-20">
          {/* Breadcrumb with Region Badge */}
          <motion.div 
            className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/the-wire"
                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-geist"
              >
                <motion.span
                  className="inline-flex"
                  whileHover={{ x: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </motion.span>
                {t("backToWire")}
              </Link>
              <Badge 
                variant="outline" 
                className="px-3 py-1.5 text-sm font-medium border-primary/30 bg-primary/5 text-foreground gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-base">{articleRegionOption.flag}</span>
                {articleRegionOption.label}
              </Badge>
            </div>
          </motion.div>

          {/* Hero Image with Ken Burns - Shared Element */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <motion.div 
              className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-3xl overflow-hidden"
              layoutId={`article-image-${articleId}`}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              <ImageReveal
                src={article.image}
                alt={article.title}
                effect="zoom"
                kenBurns
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
                aspectRatio="auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                <motion.div 
                  className="flex flex-wrap gap-2 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {article.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-primary/90 text-primary-foreground rounded-full px-4 py-1 backdrop-blur-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </motion.div>
                {/* Shared Title Element */}
                <motion.h1
                  className="font-pharma text-2xl sm:text-4xl md:text-5xl text-white font-bold leading-tight max-w-4xl"
                  layoutId={`article-title-${articleId}`}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {article.title}
                </motion.h1>
              </div>
            </motion.div>
          </div>

          {/* Article Meta & Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <article className="max-w-3xl mx-auto">
              {/* Meta Info */}
              <motion.div 
                className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="font-geist">{article.author}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="font-geist">{article.date}</span>
                </div>
              </motion.div>

              {/* Content with Drop Cap & Enhanced Typography */}
              <motion.div
                className="prose prose-lg max-w-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {article.content.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.7 + index * 0.1, 
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className={`font-geist text-foreground/90 leading-[1.8] mb-6 text-lg ${
                      index === 0 ? 'first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none' : ''
                    }`}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>

              {/* Read Original */}
              <ScrollAnimation delay={0.3}>
                <div className="mt-12 pt-8 border-t border-border">
                  <Button
                    size="lg"
                    className="rounded-full gap-2 group"
                    onClick={() => window.open(article.externalLink, "_blank")}
                  >
                    {t("readOriginal")}
                    <motion.span
                      className="inline-flex"
                      whileHover={{ x: 4, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.span>
                  </Button>
                </div>
              </ScrollAnimation>

              {/* Related Articles */}
              <ScrollAnimation delay={0.4}>
                <div className="mt-16">
                  <h3 className="font-pharma text-2xl font-semibold mb-6">
                    {t("moreFromWire")}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {relatedArticles.map((relatedArticle, index) => (
                      <motion.div
                        key={relatedArticle.id}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Link
                          to={`/the-wire/${relatedArticle.id}`}
                          className="group flex gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card"
                        >
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={relatedArticle.image}
                              alt={relatedArticle.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div>
                            <h4 className="font-geist font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {relatedArticle.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {relatedArticle.date}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            </article>
          </div>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default NewsArticle;
