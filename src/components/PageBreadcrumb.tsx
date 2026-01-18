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
                    <BreadcrumbPage className="font-medium text-foreground">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={item.href || '/'} 
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {isHome && <Home className="w-3.5 h-3.5" />}
                        <span>{item.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
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
