import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewsArticle } from "@/data/newsArticles";

interface FeaturedArticleCarouselProps {
  articles: NewsArticle[];
  autoplayDelay?: number;
}

const FeaturedArticleCarousel = ({
  articles,
  autoplayDelay = 5000,
}: FeaturedArticleCarouselProps) => {
  const { t } = useTranslation("theWire");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const autoplayPlugin = Autoplay({
    delay: autoplayDelay,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    
    onSelect();
    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  // Single article - render without carousel
  if (articles.length === 1) {
    const article = articles[0];
    return (
      <Link to={`/the-wire/${article.id}`}>
        <Card className="group overflow-hidden rounded-3xl border-border/50 hover:shadow-2xl transition-all duration-500">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-muted">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 font-semibold">
                  {t("featured")}
                </Badge>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center bg-card">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-secondary/60 text-secondary bg-secondary/10 rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h2 className="font-pharma text-2xl sm:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              <p className="font-geist text-muted-foreground mb-6 line-clamp-3">
                {article.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-geist">
                  {article.date}
                </span>
                <Button variant="link" className="p-0 text-primary font-semibold">
                  {t("readArticle")}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Carousel
        setApi={setApi}
        plugins={[autoplayPlugin]}
        opts={{ loop: true, align: "start" }}
        className="w-full"
      >
        <CarouselContent>
          {articles.map((article, index) => (
            <CarouselItem key={article.id}>
              <Link to={`/the-wire/${article.id}`}>
                <Card className="group overflow-hidden rounded-3xl border-border/50 hover:shadow-2xl transition-all duration-500">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-muted">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 font-semibold">
                          {t("featured")}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center bg-card">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="outline"
                            className="border-secondary/60 text-secondary bg-secondary/10 rounded-full"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h2 className="font-pharma text-2xl sm:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      <p className="font-geist text-muted-foreground mb-6 line-clamp-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-geist">
                          {article.date}
                        </span>
                        <Button variant="link" className="p-0 text-primary font-semibold">
                          {t("readArticle")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-background shadow-lg" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-background shadow-lg" />
      </Carousel>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50",
              current === index
                ? "w-8 bg-primary"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Pause indicator */}
      {isPaused && articles.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-muted-foreground">
          Paused
        </div>
      )}
    </div>
  );
};

export default FeaturedArticleCarousel;
