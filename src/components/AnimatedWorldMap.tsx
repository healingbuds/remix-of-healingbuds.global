import { motion } from "framer-motion";

interface Region {
  id: string;
  name: string;
  x: number;
  y: number;
  status: "live" | "coming-soon";
}

const regions: Region[] = [
  { id: "za", name: "South Africa", x: 560, y: 380, status: "live" },
  { id: "pt", name: "Portugal", x: 450, y: 200, status: "coming-soon" },
  { id: "uk", name: "United Kingdom", x: 470, y: 160, status: "coming-soon" },
  { id: "th", name: "Thailand", x: 720, y: 280, status: "coming-soon" },
];

// Connection lines between regions (from South Africa hub to others)
const connections = [
  { from: "za", to: "pt" },
  { from: "za", to: "uk" },
  { from: "za", to: "th" },
];

const AnimatedWorldMap = () => {
  const getRegionCoords = (id: string) => {
    const region = regions.find((r) => r.id === id);
    return region ? { x: region.x, y: region.y } : { x: 0, y: 0 };
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 900 500"
        className="w-full h-full opacity-20"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradient for connection lines */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(164, 48%, 53%)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(164, 48%, 53%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(164, 48%, 53%)" stopOpacity="0.3" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Animated dash pattern */}
          <pattern id="movingDots" width="20" height="1" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="0.5" r="1.5" fill="hsl(164, 48%, 53%)">
              <animate
                attributeName="cx"
                from="0"
                to="20"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </pattern>
        </defs>

        {/* Simplified world map outline */}
        <path
          d="M120,180 Q180,150 240,160 Q280,140 320,150 Q360,130 400,140 Q440,120 480,130 L520,140 Q560,130 600,150 Q640,140 680,160 Q720,150 760,170 L780,190
             M100,200 Q140,190 180,200 Q220,180 260,190 Q300,170 340,180 Q380,160 420,170 L460,180 Q500,170 540,190 Q580,180 620,200 Q660,190 700,210 Q740,200 780,220
             M80,250 Q120,240 160,250 Q200,230 240,240 Q280,220 320,230 Q360,210 400,220 L440,230 Q480,220 520,240 Q560,230 600,250 Q640,240 680,260 Q720,250 760,270 L800,280
             M120,300 Q160,290 200,300 Q240,280 280,290 Q320,270 360,280 L400,290 Q440,280 480,300 Q520,290 560,310 Q600,300 640,320 Q680,310 720,330 L760,340
             M180,350 Q220,340 260,350 Q300,330 340,340 Q380,320 420,330 L460,340 Q500,330 540,350 Q580,340 620,360 Q660,350 700,370 L720,380
             M200,390 Q240,380 280,390 Q320,370 360,380 L400,390 Q440,380 480,400 Q520,390 560,410 Q600,400 640,420"
          fill="none"
          stroke="hsl(164, 48%, 53%)"
          strokeWidth="0.5"
          strokeOpacity="0.4"
        />

        {/* Continental shapes - simplified */}
        {/* Europe */}
        <ellipse cx="500" cy="170" rx="80" ry="40" fill="hsl(164, 48%, 53%)" fillOpacity="0.08" />
        {/* Africa */}
        <ellipse cx="520" cy="320" rx="70" ry="90" fill="hsl(164, 48%, 53%)" fillOpacity="0.08" />
        {/* Asia */}
        <ellipse cx="700" cy="220" rx="120" ry="80" fill="hsl(164, 48%, 53%)" fillOpacity="0.08" />

        {/* Connection lines with animation */}
        {connections.map((conn, index) => {
          const from = getRegionCoords(conn.from);
          const to = getRegionCoords(conn.to);
          
          // Create curved path
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2 - 30;
          const path = `M${from.x},${from.y} Q${midX},${midY} ${to.x},${to.y}`;
          
          return (
            <g key={`${conn.from}-${conn.to}`}>
              {/* Base line */}
              <motion.path
                d={path}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 2,
                  delay: index * 0.3,
                  ease: "easeInOut",
                }}
              />
              
              {/* Animated pulse along path */}
              <motion.circle
                r="3"
                fill="hsl(164, 48%, 53%)"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 3,
                  delay: index * 0.3 + 1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${index * 0.3 + 1}s`}
                  path={path}
                />
              </motion.circle>
            </g>
          );
        })}

        {/* Region markers */}
        {regions.map((region, index) => (
          <g key={region.id}>
            {/* Outer pulse ring for live regions */}
            {region.status === "live" && (
              <motion.circle
                cx={region.x}
                cy={region.y}
                r="12"
                fill="none"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth="2"
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            )}
            
            {/* Main marker */}
            <motion.circle
              cx={region.x}
              cy={region.y}
              r="6"
              fill={region.status === "live" ? "hsl(142, 76%, 36%)" : "hsl(45, 93%, 47%)"}
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2 + 0.5,
                type: "spring",
              }}
            />
            
            {/* Inner highlight */}
            <motion.circle
              cx={region.x - 1.5}
              cy={region.y - 1.5}
              r="2"
              fill="white"
              fillOpacity="0.4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.2 + 0.7,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default AnimatedWorldMap;
