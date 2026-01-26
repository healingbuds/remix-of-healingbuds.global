import { useEffect, useRef, useMemo, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

interface RegionMarker {
  key: string;
  name: string;
  coordinates: [number, number];
  status: 'LIVE' | 'HQ' | 'PRODUCTION' | 'NEXT';
}

const regions: RegionMarker[] = [
  { key: 'southAfrica', name: 'South Africa', coordinates: [-30.5595, 22.9375], status: 'LIVE' },
  { key: 'thailand', name: 'Thailand', coordinates: [15.8700, 100.9925], status: 'PRODUCTION' },
  { key: 'portugal', name: 'Portugal', coordinates: [39.3999, -8.2245], status: 'HQ' },
  { key: 'uk', name: 'United Kingdom', coordinates: [55.3781, -3.4360], status: 'NEXT' },
];

// Define connections between regions (hub-and-spoke from Portugal as HQ)
const connections: [string, string][] = [
  ['portugal', 'uk'],
  ['portugal', 'southAfrica'],
  ['portugal', 'thailand'],
];

interface PremiumLeafletMapProps {
  selectedCountry: string | null;
  onCountrySelect: (countryKey: string) => void;
}

// Marker color configurations
const MARKER_COLORS = {
  LIVE: {
    gradient: 'linear-gradient(135deg, hsl(175, 42%, 45%), hsl(168, 38%, 35%))',
    glow: 'hsl(175, 42%, 40%)',
    border: 'rgba(255, 255, 255, 0.9)',
  },
  HQ: {
    gradient: 'linear-gradient(135deg, hsl(280, 60%, 55%), hsl(260, 50%, 45%))',
    glow: 'hsl(280, 55%, 50%)',
    border: 'rgba(255, 255, 255, 0.95)',
  },
  PRODUCTION: {
    gradient: 'linear-gradient(135deg, hsl(200, 70%, 50%), hsl(210, 60%, 40%))',
    glow: 'hsl(200, 65%, 45%)',
    border: 'rgba(255, 255, 255, 0.85)',
  },
  NEXT: {
    gradient: 'linear-gradient(135deg, hsl(45, 93%, 55%), hsl(38, 80%, 50%))',
    glow: 'hsl(45, 93%, 50%)',
    border: 'rgba(255, 255, 255, 0.9)',
  },
} as const;

const STATUS_LABELS = {
  LIVE: { bg: 'hsl(175, 42%, 35%)', text: 'Live Now' },
  HQ: { bg: 'hsl(280, 55%, 45%)', text: 'Headquarters' },
  PRODUCTION: { bg: 'hsl(200, 65%, 40%)', text: 'Production' },
  NEXT: { bg: 'hsl(45, 93%, 45%)', text: 'Coming Soon' },
} as const;

// Create custom marker icon based on status with ripple effects for LIVE/HQ/PRODUCTION markers
const createMarkerIcon = (status: 'LIVE' | 'HQ' | 'PRODUCTION' | 'NEXT', isSelected: boolean, isMobile: boolean) => {
  const baseSize = isMobile ? 36 : 44;
  const size = isSelected ? baseSize * 1.2 : baseSize;
  const rippleSize = size * 1.8;
  const { gradient, glow, border } = MARKER_COLORS[status];
  
  const pulseAnimation = (status === 'LIVE' || status === 'HQ' || status === 'PRODUCTION') ? 'animation: marker-pulse 2s ease-in-out infinite;' : '';
  
  // Add ripple rings for LIVE, HQ, and PRODUCTION markers
  const rippleColors: Record<string, string> = {
    LIVE: 'hsl(175, 42%, 50%)',
    HQ: 'hsl(280, 55%, 55%)',
    PRODUCTION: 'hsl(200, 65%, 50%)',
    NEXT: 'hsl(45, 93%, 50%)',
  };
  const rippleColor = rippleColors[status];
  const showRipple = status === 'LIVE' || status === 'HQ' || status === 'PRODUCTION';
  
  const rippleHtml = showRipple ? `
    <div class="marker-ripple" style="
      position: absolute;
      top: 50%;
      left: 50%;
      width: ${rippleSize}px;
      height: ${rippleSize}px;
      transform: translate(-50%, -50%);
      border-color: ${rippleColor};
    "></div>
    <div class="marker-ripple-2" style="
      position: absolute;
      top: 50%;
      left: 50%;
      width: ${rippleSize}px;
      height: ${rippleSize}px;
      transform: translate(-50%, -50%);
      border-color: ${rippleColor};
    "></div>
  ` : '';
  
  // HQ badge for Portugal
  const hqBadge = status === 'HQ' ? `
    <div style="
      position: absolute;
      top: -8px;
      right: -8px;
      background: linear-gradient(135deg, hsl(45, 90%, 55%), hsl(38, 85%, 50%));
      color: hsl(0, 0%, 15%);
      font-size: 8px;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      z-index: 20;
    ">HQ</div>
  ` : '';

  // Production/Manufacturing badge for Thailand
  const productionBadge = status === 'PRODUCTION' ? `
    <div style="
      position: absolute;
      top: -8px;
      right: -8px;
      background: linear-gradient(135deg, hsl(200, 70%, 50%), hsl(210, 60%, 40%));
      color: white;
      font-size: 7px;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 4px;
      letter-spacing: 0.3px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 2px;
    ">
      <svg viewBox="0 0 24 24" width="8" height="8" fill="currentColor">
        <path d="M22 22H2v-2h20v2zM10 2H7v16h3V2zm7 6h-3v10h3V8z"/>
      </svg>
      MFG
    </div>
  ` : '';

  return L.divIcon({
    className: 'premium-marker',
    iconSize: [rippleSize, rippleSize],
    iconAnchor: [rippleSize / 2, rippleSize / 2],
    html: `
      <div style="
        position: relative;
        width: ${rippleSize}px;
        height: ${rippleSize}px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${rippleHtml}
        ${hqBadge}
        ${productionBadge}
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${gradient};
          border: 2.5px solid ${border};
          border-radius: 50%;
          box-shadow: 0 0 ${isSelected ? '30' : '20'}px ${glow},
                      0 4px 12px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 10;
          ${isSelected ? 'transform: scale(1.15);' : ''}
          ${pulseAnimation}
        ">
          <div style="
            width: ${size * 0.35}px;
            height: ${size * 0.35}px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
          "></div>
        </div>
      </div>
    `,
  });
};

// Create popup content
const createPopupContent = (region: RegionMarker) => {
  const { bg, text } = STATUS_LABELS[region.status];

  return `
    <div class="premium-popup-content">
      <h3 style="
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
        color: white;
      ">${region.name}</h3>
      <span style="
        display: inline-block;
        padding: 4px 10px;
        background: ${bg};
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        color: white;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      ">${text}</span>
    </div>
  `;
};

// Helper function to create a curved path between two points
function createCurvedPath(from: [number, number], to: [number, number]): [number, number][] {
  const points: [number, number][] = [];
  const numPoints = 50;
  
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  
  const dx = to[1] - from[1];
  const dy = to[0] - from[0];
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  const curveOffset = dist * 0.15;
  const offsetLat = midLat + (dx / dist) * curveOffset;
  const offsetLng = midLng - (dy / dist) * curveOffset;
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * offsetLat + t * t * to[0];
    const lng = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * offsetLng + t * t * to[1];
    points.push([lat, lng]);
  }
  
  return points;
}

// Create animated energy dots along a path using SVG overlay
function createEnergyFlowSVG(pathId: string, pathD: string): string {
  return `
    <svg class="energy-flow-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible;">
      <defs>
        <path id="${pathId}" d="${pathD}" fill="none" />
      </defs>
      <circle class="energy-dot energy-dot-1" r="3" fill="url(#energyGradient)">
        <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
          <mpath href="#${pathId}" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle class="energy-dot energy-dot-2" r="2.5" fill="url(#energyGradient)">
        <animateMotion dur="4s" repeatCount="indefinite" rotate="auto" begin="1.3s">
          <mpath href="#${pathId}" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" begin="1.3s" />
      </circle>
      <circle class="energy-dot energy-dot-3" r="2" fill="url(#energyGradient)">
        <animateMotion dur="4s" repeatCount="indefinite" rotate="auto" begin="2.6s">
          <mpath href="#${pathId}" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" begin="2.6s" />
      </circle>
    </svg>
  `;
}

export default function PremiumLeafletMap({ selectedCountry, onCountrySelect }: PremiumLeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const polylinesRef = useRef<L.Polyline[]>([]);
  const energyOverlayRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Animation state
  const [mapReady, setMapReady] = useState(false);
  const [markersAnimated, setMarkersAnimated] = useState(false);
  const [pathsAnimated, setPathsAnimated] = useState(false);

  // Memoized map config based on screen size
  const mapConfig = useMemo(() => ({
    center: isMobile ? [5, 40] as [number, number] : [15, 25] as [number, number],
    zoom: isMobile ? 2 : 2.5,
    minZoom: 2,
    maxZoom: 8,
    flyToZoom: isMobile ? 3.5 : 4,
  }), [isMobile]);

  // Stable callback ref to avoid recreation
  const onCountrySelectRef = useRef(onCountrySelect);
  onCountrySelectRef.current = onCountrySelect;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Reset animation + ready flags so downstream effects re-run on theme / layout changes
    setMapReady(false);
    setMarkersAnimated(false);
    setPathsAnimated(false);
    
    // Cleanup existing map if any
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markersRef.current.clear();
      polylinesRef.current = [];
    }

    // Theme-aware map tiles
    const tileUrl = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png';
    
    const tiles = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    });

    // World bounds to prevent infinite panning
    const worldBounds = L.latLngBounds(
      L.latLng(-60, -180),
      L.latLng(75, 180)
    );

    // Initialize map with smooth, stable settings
    const map = L.map(mapContainerRef.current, {
      center: mapConfig.center,
      zoom: mapConfig.zoom,
      minZoom: mapConfig.minZoom,
      maxZoom: mapConfig.maxZoom,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: false,
      preferCanvas: true,
      // Bounds restriction
      maxBounds: worldBounds,
      maxBoundsViscosity: 0.8,
      // Smooth zoom settings
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      wheelDebounceTime: 100,
      wheelPxPerZoomLevel: 120,
      // Smooth pan settings
      inertia: true,
      inertiaDeceleration: 3000,
      inertiaMaxSpeed: 1500,
      // Disable bouncy zoom
      bounceAtZoomLimits: false,
    });

    tiles.addTo(map);

    // Add zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add minimal attribution
    L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);

    mapRef.current = map;
    
    // Mark map as ready for animations
    setTimeout(() => setMapReady(true), 300);

    // Add animated connection lines FIRST (so they render behind markers)
    // These will be animated via CSS classes
    connections.forEach(([fromKey, toKey], index) => {
      const fromRegion = regions.find(r => r.key === fromKey);
      const toRegion = regions.find(r => r.key === toKey);
      
      if (fromRegion && toRegion) {
        const latlngs = createCurvedPath(fromRegion.coordinates, toRegion.coordinates);
        
        // Theme-aware line colors
        const glowColor = isDark ? 'hsl(175, 42%, 40%)' : 'hsl(175, 42%, 50%)';
        const lineColor = isDark ? 'hsl(175, 42%, 50%)' : 'hsl(175, 42%, 35%)';
        const glowOpacity = isDark ? 0.15 : 0.12;
        const lineOpacity = isDark ? 0.6 : 0.7;
        
        // Background glow line
        const glowLine = L.polyline(latlngs, {
          color: glowColor,
          weight: isMobile ? 2 : 3,
          opacity: glowOpacity,
          smoothFactor: 1,
          className: 'flight-path-glow',
        });
        glowLine.addTo(map);
        polylinesRef.current.push(glowLine);
        
        // Animated dashed line with 3D animation class
        const dashLine = L.polyline(latlngs, {
          color: lineColor,
          weight: isMobile ? 1 : 1.5,
          opacity: lineOpacity,
          dashArray: '8, 12',
          smoothFactor: 1,
          className: `flight-path flight-path-${index} flight-path-3d`,
        });
        dashLine.addTo(map);
        polylinesRef.current.push(dashLine);
      }
    });

    // Add markers with staggered entrance animations
    const markerDelays = {
      portugal: 0,      // HQ first
      southAfrica: 0.3, // Live second
      thailand: 0.5,    // Production third
      uk: 0.7,          // Coming Soon last
    };
    
    regions.forEach((region) => {
      const delay = markerDelays[region.key as keyof typeof markerDelays] || 0;
      
      // Create marker with entrance animation class
      const marker = L.marker(region.coordinates, {
        icon: createMarkerIcon(region.status, false, isMobile),
      });

      // Apply entrance animation with delay
      setTimeout(() => {
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.classList.add('marker-entrance', `marker-delay-${Math.floor(delay * 10)}`);
        }
      }, 100);

      const popup = L.popup({
        className: 'premium-popup',
        closeButton: false,
        offset: [0, -15],
        autoPan: false,
      }).setContent(createPopupContent(region));

      marker.bindPopup(popup);

      marker.on('click', () => {
        onCountrySelectRef.current(region.key);
      });

      // Only show popups on hover for non-touch devices
      if (!isMobile) {
        marker.on('mouseover', () => marker.openPopup());
        marker.on('mouseout', () => marker.closePopup());
      }

      marker.addTo(map);
      markersRef.current.set(region.key, marker);
    });
    
    // Trigger animations after markers are added
    setTimeout(() => setMarkersAnimated(true), 800);
    setTimeout(() => setPathsAnimated(true), 1500);

    // Handle resize
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.clear();
      polylinesRef.current = [];
    };
  }, [isMobile, mapConfig, isDark]);

  // Update marker icons when selection changes
  useEffect(() => {
    markersRef.current.forEach((marker, key) => {
      const region = regions.find(r => r.key === key);
      if (region) {
        const isSelected = key === selectedCountry;
        marker.setIcon(createMarkerIcon(region.status, isSelected, isMobile));

        if (isSelected && mapRef.current) {
          mapRef.current.flyTo(region.coordinates, mapConfig.flyToZoom, {
            duration: 1.2,
            easeLinearity: 0.5,
          });
        }
      }
    });
  }, [selectedCountry, isMobile, mapConfig.flyToZoom]);

  // Force map invalidation on mount/theme change to ensure tiles render (Leaflet can miss first paint
  // when the container is transitioning or when we recreate the map on theme toggle)
  useEffect(() => {
    if (mapRef.current && mapReady) {
      const t1 = window.setTimeout(() => mapRef.current?.invalidateSize(), 100);
      const t2 = window.setTimeout(() => mapRef.current?.invalidateSize(), 400);
      const t3 = window.setTimeout(() => mapRef.current?.invalidateSize(), 900);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.clearTimeout(t3);
      };
    }
  }, [mapReady]);

  // Theme-aware background
  const mapBg = isDark ? 'hsl(178, 48%, 6%)' : 'hsl(155, 12%, 97%)';
  
  return (
    <div className="absolute inset-0 w-full h-full">
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full touch-pan-x touch-pan-y"
        style={{ background: mapBg }}
      />
      {/* Energy flow SVG overlay */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="energyGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(175, 60%, 65%)" />
            <stop offset="50%" stopColor="hsl(175, 50%, 50%)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="energyGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
