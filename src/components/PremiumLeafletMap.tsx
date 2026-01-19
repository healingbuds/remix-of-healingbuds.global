import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useIsMobile } from '@/hooks/use-mobile';

interface RegionMarker {
  key: string;
  name: string;
  coordinates: [number, number];
  status: 'LIVE' | 'NEXT' | 'UPCOMING';
}

const regions: RegionMarker[] = [
  { key: 'southAfrica', name: 'South Africa', coordinates: [-30.5595, 22.9375], status: 'LIVE' },
  { key: 'thailand', name: 'Thailand', coordinates: [15.8700, 100.9925], status: 'LIVE' },
  { key: 'uk', name: 'United Kingdom', coordinates: [55.3781, -3.4360], status: 'NEXT' },
  { key: 'portugal', name: 'Portugal', coordinates: [39.3999, -8.2245], status: 'UPCOMING' },
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
  NEXT: {
    gradient: 'linear-gradient(135deg, hsl(45, 93%, 55%), hsl(38, 80%, 50%))',
    glow: 'hsl(45, 93%, 50%)',
    border: 'rgba(255, 255, 255, 0.9)',
  },
  UPCOMING: {
    gradient: 'linear-gradient(135deg, hsl(200, 15%, 50%), hsl(200, 15%, 40%))',
    glow: 'hsl(200, 15%, 45%)',
    border: 'rgba(255, 255, 255, 0.7)',
  },
} as const;

const STATUS_LABELS = {
  LIVE: { bg: 'hsl(175, 42%, 35%)', text: 'Live Now' },
  NEXT: { bg: 'hsl(45, 93%, 45%)', text: 'Coming Next' },
  UPCOMING: { bg: 'hsl(200, 15%, 45%)', text: 'Upcoming' },
} as const;

// Create custom marker icon based on status with ripple effects for LIVE markers
const createMarkerIcon = (status: 'LIVE' | 'NEXT' | 'UPCOMING', isSelected: boolean, isMobile: boolean) => {
  const baseSize = isMobile ? 36 : 44;
  const size = isSelected ? baseSize * 1.2 : baseSize;
  const rippleSize = size * 1.8;
  const { gradient, glow, border } = MARKER_COLORS[status];
  
  const pulseAnimation = status === 'LIVE' ? 'animation: marker-pulse 2s ease-in-out infinite;' : '';
  
  // Add ripple rings for LIVE markers
  const rippleHtml = status === 'LIVE' ? `
    <div class="marker-ripple" style="
      position: absolute;
      top: 50%;
      left: 50%;
      width: ${rippleSize}px;
      height: ${rippleSize}px;
      transform: translate(-50%, -50%);
    "></div>
    <div class="marker-ripple-2" style="
      position: absolute;
      top: 50%;
      left: 50%;
      width: ${rippleSize}px;
      height: ${rippleSize}px;
      transform: translate(-50%, -50%);
    "></div>
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
    
    // Cleanup existing map if any
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markersRef.current.clear();
      polylinesRef.current = [];
    }

    // CartoDB Dark Matter tiles
    const darkTiles = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    );

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

    darkTiles.addTo(map);

    // Add zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add minimal attribution
    L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);

    mapRef.current = map;

    // Add animated connection lines FIRST (so they render behind markers)
    connections.forEach(([fromKey, toKey], index) => {
      const fromRegion = regions.find(r => r.key === fromKey);
      const toRegion = regions.find(r => r.key === toKey);
      
      if (fromRegion && toRegion) {
        const latlngs = createCurvedPath(fromRegion.coordinates, toRegion.coordinates);
        
        // Background glow line
        const glowLine = L.polyline(latlngs, {
          color: 'hsl(175, 42%, 40%)',
          weight: isMobile ? 2 : 3,
          opacity: 0.15,
          smoothFactor: 1,
          className: 'flight-path-glow',
        });
        glowLine.addTo(map);
        polylinesRef.current.push(glowLine);
        
        // Animated dashed line
        const dashLine = L.polyline(latlngs, {
          color: 'hsl(175, 42%, 50%)',
          weight: isMobile ? 1 : 1.5,
          opacity: 0.6,
          dashArray: '8, 12',
          smoothFactor: 1,
          className: `flight-path flight-path-${index}`,
        });
        dashLine.addTo(map);
        polylinesRef.current.push(dashLine);
      }
    });

    // Add markers
    regions.forEach((region) => {
      const marker = L.marker(region.coordinates, {
        icon: createMarkerIcon(region.status, false, isMobile),
      });

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
  }, [isMobile, mapConfig]);

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

  return (
    <div className="absolute inset-0 w-full h-full">
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full touch-pan-x touch-pan-y"
        style={{ background: 'hsl(178, 48%, 6%)' }}
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
