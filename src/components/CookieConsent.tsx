import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = "healing-buds-cookie-consent";
const COOKIE_PREFERENCES_KEY = "healing-buds-cookie-preferences";

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  functional: false,
};

const CookieConsent = () => {
  const { t } = useTranslation('common');
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay for better UX - let page load first
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
  };

  const acceptNecessaryOnly = () => {
    saveConsent(defaultPreferences);
  };

  const saveCustomPreferences = () => {
    saveConsent(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't toggle necessary cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieCategories = [
    {
      key: 'necessary' as const,
      icon: Shield,
      title: t('cookies.necessary', 'Necessary'),
      description: t('cookies.necessaryDesc', 'Essential for the website to function. Cannot be disabled.'),
      required: true,
    },
    {
      key: 'functional' as const,
      icon: Settings,
      title: t('cookies.functional', 'Functional'),
      description: t('cookies.functionalDesc', 'Enable personalized features and remember your preferences.'),
      required: false,
    },
    {
      key: 'analytics' as const,
      icon: Cookie,
      title: t('cookies.analytics', 'Analytics'),
      description: t('cookies.analyticsDesc', 'Help us understand how visitors interact with our website.'),
      required: false,
    },
    {
      key: 'marketing' as const,
      icon: Cookie,
      title: t('cookies.marketing', 'Marketing'),
      description: t('cookies.marketingDesc', 'Used to deliver relevant ads and track campaign effectiveness.'),
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              
              {/* Close button */}
              <button
                onClick={acceptNecessaryOnly}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              <div className="p-6 md:p-8">
                {!showSettings ? (
                  // Main Banner View
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Cookie className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {t('cookies.title', 'We Value Your Privacy')}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('cookies.description', 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies in accordance with our')}{' '}
                        <a href="/privacy-policy" className="text-primary hover:underline">
                          {t('cookies.privacyPolicy', 'Privacy Policy')}
                        </a>.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
                      <Button
                        variant="outline"
                        onClick={() => setShowSettings(true)}
                        className="order-3 sm:order-1"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {t('cookies.customize', 'Customize')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={acceptNecessaryOnly}
                        className="order-2"
                      >
                        {t('cookies.rejectOptional', 'Necessary Only')}
                      </Button>
                      <Button
                        onClick={acceptAll}
                        className="order-1 sm:order-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {t('cookies.acceptAll', 'Accept All')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Settings View
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={() => setShowSettings(false)}
                        className="p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <h3 className="text-lg font-semibold text-foreground">
                        {t('cookies.customizeTitle', 'Cookie Preferences')}
                      </h3>
                    </div>

                    <div className="space-y-4 mb-6">
                      {cookieCategories.map((category) => (
                        <div
                          key={category.key}
                          className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/30"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <category.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{category.title}</h4>
                              {category.required && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  {t('cookies.required', 'Required')}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <Switch
                              checked={preferences[category.key]}
                              onCheckedChange={() => togglePreference(category.key)}
                              disabled={category.required}
                              className="data-[state=checked]:bg-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={acceptNecessaryOnly}
                      >
                        {t('cookies.rejectOptional', 'Necessary Only')}
                      </Button>
                      <Button
                        onClick={saveCustomPreferences}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {t('cookies.savePreferences', 'Save Preferences')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;