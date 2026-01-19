/**
 * useMapKeyboardNavigation Hook
 * 
 * Provides keyboard navigation support for the interactive map.
 * - Arrow keys (Left/Right): Navigate between regions
 * - Enter/Space: Open selected region panel
 * - Escape: Close panel and return focus to map
 */

import { useEffect, useCallback, useRef } from 'react';

interface Region {
  key: string;
  name: string;
}

interface UseMapKeyboardNavigationProps {
  regions: Region[];
  selectedCountry: string | null;
  onCountrySelect: (countryKey: string) => void;
  isPanelOpen: boolean;
  onPanelClose: () => void;
  isEnabled?: boolean;
}

export const useMapKeyboardNavigation = ({
  regions,
  selectedCountry,
  onCountrySelect,
  isPanelOpen,
  onPanelClose,
  isEnabled = true,
}: UseMapKeyboardNavigationProps) => {
  const focusedIndexRef = useRef<number>(selectedCountry 
    ? regions.findIndex(r => r.key === selectedCountry) 
    : 0
  );
  const announcerRef = useRef<HTMLDivElement | null>(null);

  // Announce region changes for screen readers
  const announceRegion = useCallback((regionName: string, index: number, total: number) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = `${regionName}, ${index + 1} of ${total} regions. Press Enter to open details.`;
    }
  }, []);

  // Navigate to next/previous region
  const navigateRegion = useCallback((direction: 'next' | 'prev') => {
    const currentIndex = focusedIndexRef.current;
    let newIndex: number;

    if (direction === 'next') {
      newIndex = currentIndex >= regions.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex <= 0 ? regions.length - 1 : currentIndex - 1;
    }

    focusedIndexRef.current = newIndex;
    const region = regions[newIndex];
    onCountrySelect(region.key);
    announceRegion(region.name, newIndex, regions.length);
  }, [regions, onCountrySelect, announceRegion]);

  // Handle keyboard events
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          if (!isPanelOpen) {
            navigateRegion('next');
          }
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          if (!isPanelOpen) {
            navigateRegion('prev');
          }
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (selectedCountry && !isPanelOpen) {
            // Re-trigger selection to open panel
            onCountrySelect(selectedCountry);
          }
          break;

        case 'Escape':
          if (isPanelOpen) {
            e.preventDefault();
            onPanelClose();
          }
          break;

        case 'Home':
          e.preventDefault();
          if (!isPanelOpen && regions.length > 0) {
            focusedIndexRef.current = 0;
            const region = regions[0];
            onCountrySelect(region.key);
            announceRegion(region.name, 0, regions.length);
          }
          break;

        case 'End':
          e.preventDefault();
          if (!isPanelOpen && regions.length > 0) {
            const lastIndex = regions.length - 1;
            focusedIndexRef.current = lastIndex;
            const region = regions[lastIndex];
            onCountrySelect(region.key);
            announceRegion(region.name, lastIndex, regions.length);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, isPanelOpen, selectedCountry, regions, navigateRegion, onCountrySelect, onPanelClose, announceRegion]);

  // Sync focused index when selection changes externally
  useEffect(() => {
    if (selectedCountry) {
      const index = regions.findIndex(r => r.key === selectedCountry);
      if (index !== -1) {
        focusedIndexRef.current = index;
      }
    }
  }, [selectedCountry, regions]);

  // Create screen reader announcer element
  useEffect(() => {
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current);
        announcerRef.current = null;
      }
    };
  }, []);

  return {
    focusedIndex: focusedIndexRef.current,
    navigateNext: () => navigateRegion('next'),
    navigatePrev: () => navigateRegion('prev'),
  };
};

export default useMapKeyboardNavigation;
