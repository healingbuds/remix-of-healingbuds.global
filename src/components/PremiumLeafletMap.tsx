import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RegionMarker {
  key: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
  status: 'LIVE' | 'NEXT' | 'UPCOMING';
}

const regions: RegionMarker[] = [
  { key: 'southAfrica', name: 'South Africa', coordinates: [-30.5595, 22.9375], status: 'LIVE' },
  { key: 'thailand', name: 'Thailand', coordinates: [15.8700, 100.9925], status: 'LIVE' },
  { key: 'uk', name: 'United Kingdom', coordinates: [55.3781, -3.4360], status: 'NEXT' },
  { key: 'portugal', name: 'Portugal', coordinates: [39.3999, -8.2245], status: 'UPCOMING' },
];

interface PremiumLeafletMapProps {
  selectedCountry: string | null;
  onCountrySelect: (countryKey: string) => void;
}

// Create custom marker icon based on status
const createMarkerIcon = (status: 'LIVE' | 'NEXT' | 'UPCOMING', isSelected: boolean) => {
  const size = isSelected ? 52 : 44;
  const colors = {
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
  };

  const { gradient, glow, border } = colors[status];
  const pulseAnimation = status === 'LIVE' ? `
    animation: marker-pulse 2s ease-in-out infinite;
    @keyframes marker-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  ` : '';

  return L.divIcon({
    className: 'premium-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `
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
    `,
  });
};

// Create popup content
const createPopupContent = (region: RegionMarker) => {
  const statusColors = {
    LIVE: { bg: 'hsl(175, 42%, 35%)', text: 'Live Now' },
    NEXT: { bg: 'hsl(45, 93%, 45%)', text: 'Coming Next' },
    UPCOMING: { bg: 'hsl(200, 15%, 45%)', text: 'Upcoming' },
  };

  const { bg, text } = statusColors[region.status];

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

export default function PremiumLeafletMap({ selectedCountry, onCountrySelect }: PremiumLeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // CartoDB Dark Matter tiles - enterprise-grade dark theme
    const darkTiles = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    );

    // Initialize map centered on Africa/Europe view
    const map = L.map(mapContainerRef.current, {
      center: [20, 20],
      zoom: 2.5,
      minZoom: 2,
      maxZoom: 8,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    });

    darkTiles.addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add attribution to bottom left with custom styling
    L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);

    mapRef.current = map;

    // Add markers for each region
    regions.forEach((region) => {
      const marker = L.marker(region.coordinates, {
        icon: createMarkerIcon(region.status, false),
      });

      // Create popup with custom styling
      const popup = L.popup({
        className: 'premium-popup',
        closeButton: false,
        offset: [0, -20],
      }).setContent(createPopupContent(region));

      marker.bindPopup(popup);

      // Event handlers
      marker.on('click', () => {
        onCountrySelect(region.key);
      });

      marker.on('mouseover', () => {
        marker.openPopup();
      });

      marker.on('mouseout', () => {
        marker.closePopup();
      });

      marker.addTo(map);
      markersRef.current.set(region.key, marker);
    });

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [onCountrySelect]);

  // Update marker icons when selection changes
  useEffect(() => {
    markersRef.current.forEach((marker, key) => {
      const region = regions.find(r => r.key === key);
      if (region) {
        const isSelected = key === selectedCountry;
        marker.setIcon(createMarkerIcon(region.status, isSelected));

        // Pan to selected marker
        if (isSelected && mapRef.current) {
          mapRef.current.flyTo(region.coordinates, 4, {
            duration: 0.8,
          });
        }
      }
    });
  }, [selectedCountry]);

  return (
    <div 
      ref={mapContainerRef} 
      className="absolute inset-0 w-full h-full"
      style={{ background: 'hsl(178, 48%, 6%)' }}
    />
  );
}
