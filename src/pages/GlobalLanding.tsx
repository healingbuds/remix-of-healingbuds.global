import { motion } from "framer-motion";
import { ArrowRight, Globe, Shield, Eye, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import hbLogoWhite from "@/assets/hb-logo-white-new.png";
import hbLogoIcon from "@/assets/hb-logo-icon.png";
import drGreenLogo from "@/assets/drgreen-nft-logo.png";
import TestRegionSwitcher from "@/components/TestRegionSwitcher";
import { useTestRegion, testRegionOptions } from "@/context/TestRegionContext";

export default function GlobalLanding() {
  const { selectedRegion, isTestMode } = useTestRegion();
  
  // Filter out GLOBAL from region cards, map to display format
  const regions = testRegionOptions
    .filter(r => r.code !== 'GLOBAL')
    .map(r => ({
      code: r.code.toLowerCase(),
      name: r.label,
      url: r.url,
      flag: r.flag,
      status: r.status,
    }));
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(178,48%,15%)] via-[hsl(178,48%,18%)] to-[hsl(175,35%,12%)] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16"
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 backdrop-blur-sm p-3">
              <img 
                src={hbLogoIcon} 
                alt="Healing Buds" 
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-4"
          >
            <img 
              src={hbLogoWhite} 
              alt="Healing Buds" 
              className="h-16 md:h-20 mx-auto object-contain"
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-white/70 font-light mb-12 max-w-2xl mx-auto"
          >
            Pioneering tomorrow's medical cannabis solutions across the globe
          </motion.p>
        </div>

        {/* Global Card - Featured */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full max-w-2xl mx-auto mb-10"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-md border-primary/40 shadow-xl shadow-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <CardContent className="p-8 text-center relative">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-semibold text-white">Global Network</h3>
              </div>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Access the full Healing Buds experience — explore our medical cannabis solutions, research, and global operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                  asChild
                >
                  <Link to="/home">
                    Continue to Site
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  asChild
                >
                  <Link to="/franchise-opportunities">
                    <Building2 className="mr-2 w-4 h-4" />
                    Franchise Opportunities
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="flex items-center gap-4 mb-8 w-full max-w-xl mx-auto"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="text-white/40 text-sm font-medium uppercase tracking-wider">Regional Sites</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>

        {/* Region Cards */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl mx-auto mb-16"
        >
          {regions.map((region, i) => {
            const isSelected = selectedRegion.toLowerCase() === region.code;
            return (
              <motion.div
                key={region.code}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                whileHover={region.status === "live" ? { y: -6, scale: 1.02 } : {}}
                className={region.status === "live" ? "cursor-pointer" : ""}
              >
                <Card 
                  className={`relative overflow-hidden bg-gradient-to-br from-white/8 via-white/5 to-transparent backdrop-blur-md transition-all duration-300 ${
                    isSelected 
                      ? "border-primary border-2 shadow-lg shadow-primary/20" 
                      : "border-white/10 hover:border-white/20"
                  } ${
                    region.status === "live" 
                      ? "hover:shadow-lg hover:shadow-primary/10" 
                      : "opacity-60"
                  }`}
                  onClick={() => region.status === "live" && window.open(region.url, "_blank")}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  <CardContent className="p-5 text-center relative">
                    {isSelected && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full uppercase tracking-wider">
                        Selected
                      </div>
                    )}
                    <span className="text-4xl mb-3 block">{region.flag}</span>
                    <h3 className="text-lg font-semibold text-white mb-3">{region.name}</h3>
                    <div className="flex flex-col gap-2">
                      {/* Preview Button */}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full group border-white/20 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/30"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link to={`/preview/${region.code}`}>
                          <Eye className="mr-2 w-4 h-4" />
                          Preview
                        </Link>
                      </Button>
                      
                      {/* Visit Site Button */}
                      {region.status === "live" ? (
                        <Button 
                          size="sm"
                          className={`w-full group ${
                            isSelected 
                              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                              : "bg-primary/80 text-primary-foreground hover:bg-primary"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(region.url, "_blank");
                          }}
                        >
                          Visit Site 
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      ) : (
                        <span className="inline-block px-3 py-1.5 text-xs text-white/50 bg-white/5 rounded-full text-center border border-white/10">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Shield className="w-5 h-5 text-primary" />
            <span>EU GMP Regulated</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Globe className="w-5 h-5 text-primary" />
            <span>Global Network</span>
          </div>
        </motion.div>

        {/* Powered by Dr. Green */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-0 right-0"
        >
          <div className="flex items-center justify-center gap-2 opacity-50">
            <span className="text-white/50 text-xs">Powered by</span>
            <img 
              src={drGreenLogo} 
              alt="Dr. Green Digital Key" 
              className="h-4 w-auto object-contain"
            />
          </div>
        </motion.div>

        {/* Test Region Switcher */}
        <TestRegionSwitcher />
      </motion.div>
    </div>
  );
}
