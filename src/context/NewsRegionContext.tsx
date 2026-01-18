import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { getNewsArticlesByRegion, NewsArticle } from '@/data/newsArticles';

export type NewsRegion = 'GLOBAL' | 'GB' | 'PT' | 'ZA' | 'TH';

interface RegionOption {
  code: NewsRegion;
  label: string;
  flag: string;
}

export const regionOptions: RegionOption[] = [
  { code: 'GLOBAL', label: 'Global', flag: '🌍' },
  { code: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
  { code: 'PT', label: 'Portugal', flag: '🇵🇹' },
  { code: 'ZA', label: 'South Africa', flag: '🇿🇦' },
  { code: 'TH', label: 'Thailand', flag: '🇹🇭' },
];

const STORAGE_KEY = 'healing-buds-news-region';

interface NewsRegionContextType {
  activeRegion: NewsRegion;
  setRegion: (code: NewsRegion) => void;
  clearRegionOverride: () => void;
  isManuallySelected: boolean;
  articles: NewsArticle[];
  regionOptions: RegionOption[];
  currentRegionOption: RegionOption;
}

const NewsRegionContext = createContext<NewsRegionContextType | undefined>(undefined);

export const NewsRegionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRegion, setSelectedRegion] = useState<NewsRegion | null>(null);

  // Load saved region preference on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ['GLOBAL', 'GB', 'PT', 'ZA', 'TH'].includes(saved)) {
      setSelectedRegion(saved as NewsRegion);
    }
  }, []);

  // The active region is either manually selected or defaults to Global
  const activeRegion: NewsRegion = selectedRegion || 'GLOBAL';

  const setRegion = (code: NewsRegion) => {
    setSelectedRegion(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  const clearRegionOverride = () => {
    setSelectedRegion(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isManuallySelected = selectedRegion !== null;

  const articles = useMemo(() => 
    getNewsArticlesByRegion(activeRegion), 
    [activeRegion]
  );

  const currentRegionOption = regionOptions.find(r => r.code === activeRegion) || regionOptions[0];

  const value = {
    activeRegion,
    setRegion,
    clearRegionOverride,
    isManuallySelected,
    articles,
    regionOptions,
    currentRegionOption,
  };

  return (
    <NewsRegionContext.Provider value={value}>
      {children}
    </NewsRegionContext.Provider>
  );
};

export const useNewsRegion = () => {
  const context = useContext(NewsRegionContext);
  if (context === undefined) {
    throw new Error('useNewsRegion must be used within a NewsRegionProvider');
  }
  return context;
};
