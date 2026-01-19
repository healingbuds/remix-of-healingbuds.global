import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import RouteProgress from "@/components/RouteProgress";
import CursorFollower from "@/components/CursorFollower";
import PageLoadingSkeleton from "@/components/PageLoadingSkeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import SkipLinks from "@/components/SkipLinks";
import CookieConsent from "@/components/CookieConsent";
import { CursorProvider } from "@/context/CursorContext";
import { NewsRegionProvider } from "@/context/NewsRegionContext";
import { TestRegionProvider } from "@/context/TestRegionContext";
import { useKeyboardUser } from "@/hooks/useKeyboardUser";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const WhatWeDo = lazy(() => import("./pages/WhatWeDo"));
const TheWire = lazy(() => import("./pages/TheWire"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));
const CultivatingProcessing = lazy(() => import("./pages/CultivatingProcessing"));
const ManufactureDistribution = lazy(() => import("./pages/ManufactureDistribution"));
const Conditions = lazy(() => import("./pages/Conditions"));
const ConditionRouter = lazy(() => import("./pages/conditions/ConditionRouter"));
const MedicalClinics = lazy(() => import("./pages/MedicalClinics"));
const OnlinePharmacy = lazy(() => import("./pages/OnlinePharmacy"));
const Research = lazy(() => import("./pages/Research"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const BlockchainTechnology = lazy(() => import("./pages/BlockchainTechnology"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FranchiseOpportunities = lazy(() => import("./pages/FranchiseOpportunities"));
const Dispensaries = lazy(() => import("./pages/Dispensaries"));
const GlobalLanding = lazy(() => import("./pages/GlobalLanding"));
const RegionalPreview = lazy(() => import("./pages/RegionalPreview"));
const RegionalRegistration = lazy(() => import("./pages/RegionalRegistration"));
const DesignSystem = lazy(() => import("./pages/DesignSystem"));
const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<PageLoadingSkeleton variant="hero" />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<GlobalLanding />} />
          <Route path="/home" element={<Index />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/cultivating-processing" element={<CultivatingProcessing />} />
          <Route path="/manufacture-distribution" element={<ManufactureDistribution />} />
          <Route path="/conditions" element={<Conditions />} />
          <Route path="/conditions/:conditionId" element={<ConditionRouter />} />
          <Route path="/medical-clinics" element={<MedicalClinics />} />
          <Route path="/online-pharmacy" element={<OnlinePharmacy />} />
          <Route path="/research" element={<Research />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/blockchain-technology" element={<BlockchainTechnology />} />
          <Route path="/the-wire" element={<TheWire />} />
          <Route path="/the-wire/:articleId" element={<NewsArticle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/franchise-opportunities" element={<FranchiseOpportunities />} />
          <Route path="/dispensaries" element={<Dispensaries />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="/preview/:regionCode" element={<RegionalPreview />} />
          <Route path="/register/:regionCode" element={<RegionalRegistration />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

// Keyboard detection wrapper component
const KeyboardUserDetector = ({ children }: { children: React.ReactNode }) => {
  useKeyboardUser();
  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider defaultTheme="dark" storageKey="healing-buds-theme">
      <CursorProvider>
        <NewsRegionProvider>
          <TestRegionProvider>
            <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <CursorFollower>
                <KeyboardUserDetector>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <SkipLinks />
                    <ScrollToTop />
                    <RouteProgress />
                    <main id="main-content" className="outline-none" tabIndex={-1}>
                      <AnimatedRoutes />
                    </main>
                    <CookieConsent />
                  </BrowserRouter>
                </KeyboardUserDetector>
              </CursorFollower>
            </TooltipProvider>
            </QueryClientProvider>
          </TestRegionProvider>
        </NewsRegionProvider>
      </CursorProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
