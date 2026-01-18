import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { buildBreadcrumbTrail } from "@/config/breadcrumbConfig";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items?: BreadcrumbItemData[];
  showHome?: boolean;
  className?: string;
  currentPageLabel?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 }
};

const PageBreadcrumb = ({ 
  items, 
  showHome = true, 
  className = "",
  currentPageLabel 
}: PageBreadcrumbProps) => {
  const location = useLocation();
  const { t } = useTranslation('common');

  // Auto-generate breadcrumb trail from current route if no items provided
  const breadcrumbItems = items || (() => {
    const trail = buildBreadcrumbTrail(location.pathname);
    return trail.map((item, index) => ({
      label: t(item.labelKey),
      href: index < trail.length - 1 ? item.path : undefined,
    }));
  })();

  // Handle current page label override
  const finalItems = currentPageLabel 
    ? [...breadcrumbItems.slice(0, -1), { label: currentPageLabel }]
    : breadcrumbItems;

  // Filter based on showHome
  const displayItems = showHome ? finalItems : finalItems.filter((_, i) => i > 0);

  if (displayItems.length <= 1) {
    return null;
  }

  return (
    <motion.nav
      className={`py-4 ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      aria-label="Breadcrumb navigation"
    >
      <Breadcrumb>
        <BreadcrumbList className="text-sm">
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            const isHome = index === 0 && showHome;

            return (
              <motion.div 
                key={`${item.label}-${index}`} 
                variants={itemVariants}
                className="contents"
              >
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-semibold text-foreground relative">
                      <span className="relative">
                        {item.label}
                        {/* Gradient underline for current page */}
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-primary/80 to-transparent rounded-full" />
                      </span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={item.href || '/'} 
                        className="group flex items-center gap-1.5 text-muted-foreground relative py-1"
                      >
                        {isHome && (
                          <Home className="w-3.5 h-3.5 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                        )}
                        <span className="relative overflow-hidden">
                          {item.label}
                          {/* Animated gradient underline on hover */}
                          <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 rounded-full" />
                        </span>
                        {/* Subtle glow effect on hover */}
                        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md blur-sm" />
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    <motion.div
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                    </motion.div>
                  </BreadcrumbSeparator>
                )}
              </motion.div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </motion.nav>
  );
};

export default PageBreadcrumb;
