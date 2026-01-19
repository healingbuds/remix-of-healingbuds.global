import { useState } from 'react';

interface PremiumFlagIconProps {
  regionCode: string;
  regionName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-6',
  md: 'w-12 h-9',
  lg: 'w-16 h-12',
};

// Flag color schemes for each region
const flagColors: Record<string, { primary: string; secondary: string; accent?: string }> = {
  za: { 
    primary: 'hsl(142, 76%, 36%)', 
    secondary: 'hsl(45, 93%, 47%)', 
    accent: 'hsl(0, 0%, 15%)' 
  },
  gb: { 
    primary: 'hsl(220, 82%, 35%)', 
    secondary: 'hsl(0, 82%, 45%)', 
    accent: 'hsl(0, 0%, 100%)' 
  },
  pt: { 
    primary: 'hsl(142, 76%, 30%)', 
    secondary: 'hsl(0, 82%, 45%)', 
    accent: 'hsl(45, 93%, 47%)' 
  },
  th: { 
    primary: 'hsl(0, 82%, 40%)', 
    secondary: 'hsl(220, 82%, 35%)', 
    accent: 'hsl(0, 0%, 100%)' 
  },
};

// Emoji fallback map
const flagEmojis: Record<string, string> = {
  za: '🇿🇦',
  gb: '🇬🇧',
  pt: '🇵🇹',
  th: '🇹🇭',
};

const PremiumFlagIcon = ({ regionCode, regionName, size = 'md', className = '' }: PremiumFlagIconProps) => {
  const [imageError, setImageError] = useState(false);
  const code = regionCode.toLowerCase();
  const colors = flagColors[code] || { primary: 'hsl(175, 42%, 35%)', secondary: 'hsl(175, 42%, 45%)' };
  
  // Try to use an image first, fall back to styled container
  if (!imageError) {
    return (
      <div 
        className={`${sizeMap[size]} rounded-sm overflow-hidden shadow-md border border-white/20 flex-shrink-0 ${className}`}
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        }}
      >
        <img
          src={`https://flagcdn.com/w80/${code === 'gb' ? 'gb' : code}.png`}
          alt={`${regionName} flag`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }
  
  // Fallback: Styled container with gradient and code
  return (
    <div 
      className={`${sizeMap[size]} rounded-md overflow-hidden shadow-lg border border-white/30 flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      }}
    >
      <span 
        className="text-white font-bold text-xs drop-shadow-md"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
      >
        {regionCode.toUpperCase()}
      </span>
    </div>
  );
};

// Simple emoji version for fallback use
export const FlagEmoji = ({ regionCode, className = '' }: { regionCode: string; className?: string }) => {
  const emoji = flagEmojis[regionCode.toLowerCase()] || '🏳️';
  return <span className={className}>{emoji}</span>;
};

export default PremiumFlagIcon;
