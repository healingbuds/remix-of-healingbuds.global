import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TestRegion = 'GLOBAL' | 'ZA' | 'PT' | 'GB' | 'TH';

interface RegionOption {
  code: TestRegion;
  label: string;
  flag: string;
  url: string;
  status: 'live' | 'coming';
}

export const testRegionOptions: RegionOption[] = [
  { code: 'GLOBAL', label: 'Global', flag: '🌍', url: '/', status: 'live' },
  { code: 'ZA', label: 'South Africa', flag: '🇿🇦', url: 'https://healingbuds.co.za', status: 'live' },
  { code: 'PT', label: 'Portugal', flag: '🇵🇹', url: 'https://healingbuds.pt', status: 'coming' },
  { code: 'GB', label: 'United Kingdom', flag: '🇬🇧', url: 'https://healingbuds.co.uk', status: 'coming' },
  { code: 'TH', label: 'Thailand', flag: '🇹🇭', url: 'https://healingbuds.co.th', status: 'coming' },
];

const STORAGE_KEY = 'healing-buds-test-region';

interface TestRegionContextType {
  selectedRegion: TestRegion;
  setRegion: (code: TestRegion) => void;
  clearRegion: () => void;
  isTestMode: boolean;
  testRegionOptions: RegionOption[];
  currentOption: RegionOption;
}

const TestRegionContext = createContext<TestRegionContextType | undefined>(undefined);

export const TestRegionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRegion, setSelectedRegion] = useState<TestRegion>('GLOBAL');

  // Load saved region preference on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ['GLOBAL', 'ZA', 'PT', 'GB', 'TH'].includes(saved)) {
      setSelectedRegion(saved as TestRegion);
    }
  }, []);

  const setRegion = (code: TestRegion) => {
    setSelectedRegion(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  const clearRegion = () => {
    setSelectedRegion('GLOBAL');
    localStorage.removeItem(STORAGE_KEY);
  };

  const isTestMode = selectedRegion !== 'GLOBAL';

  const currentOption = testRegionOptions.find(r => r.code === selectedRegion) || testRegionOptions[0];

  const value = {
    selectedRegion,
    setRegion,
    clearRegion,
    isTestMode,
    testRegionOptions,
    currentOption,
  };

  return (
    <TestRegionContext.Provider value={value}>
      {children}
    </TestRegionContext.Provider>
  );
};

export const useTestRegion = () => {
  const context = useContext(TestRegionContext);
  if (context === undefined) {
    throw new Error('useTestRegion must be used within a TestRegionProvider');
  }
  return context;
};
