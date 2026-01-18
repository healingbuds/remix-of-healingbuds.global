import plantDecoration1 from "@/assets/plant-decoration-1.png";
import { motion } from "framer-motion";

// Custom SVG icons matching the reference design (line-art style)
const SproutIcon = () => (
  <svg 
    width="40" 
    height="40" 
    viewBox="0 0 40 40" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="text-white"
  >
    <path d="M20 35V22" />
    <path d="M20 22c0-6 4-10 10-10-6 0-10 4-10 10" />
    <path d="M20 22c0-6-4-10-10-10 6 0 10 4 10 10" />
    <circle cx="20" cy="8" r="2" />
  </svg>
);

const AccessIcon = () => (
  <svg 
    width="40" 
    height="40" 
    viewBox="0 0 40 40" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="text-white"
  >
    <circle cx="20" cy="10" r="5" />
    <circle cx="10" cy="16" r="3" />
    <circle cx="30" cy="16" r="3" />
    <path d="M20 15v4" />
    <path d="M16 23c-4 1-8 4-8 8h24c0-4-4-7-8-8" />
  </svg>
);

const FlaskIcon = () => (
  <svg 
    width="40" 
    height="40" 
    viewBox="0 0 40 40" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="text-white"
  >
    <path d="M15 5h10" />
    <path d="M17 5v10l-7 14a2 2 0 002 2h16a2 2 0 002-2l-7-14V5" />
    <path d="M10 25h20" />
  </svg>
);

const values = [
  {
    icon: SproutIcon,
    title: "Superior Quality",
    description: "Every stage from cultivation through extraction to final production is meticulously managed with unwavering attention to detail. Our EU GMP-certified products meet the highest international standards, earning trust across borders.",
  },
  {
    icon: AccessIcon,
    title: "Expanding Access",
    description: "Our mission is to ensure medical cannabis reaches those who need it most. Through evidence-based advocacy and education, we are reducing barriers, challenging misconceptions, and creating pathways to safe, legal access.",
  },
  {
    icon: FlaskIcon,
    title: "Research-Driven Innovation",
    description: "Collaborating with world-class research institutions including Imperial College London and University of Pennsylvania, we advance scientific knowledge of cannabis therapeutics. Research excellence is the foundation of everything we pursue.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  },
};

// Subtle leaf decoration - cropped into bottom right corner with gradient fade
const leafDecorations = [
  { 
    src: plantDecoration1, 
    className: "absolute -bottom-20 -right-20 w-80 md:w-96 opacity-20 dark:opacity-15 rotate-12 brightness-150 contrast-75",
    style: { 
      maskImage: "radial-gradient(ellipse 80% 80% at 100% 100%, black 30%, transparent 85%)",
      WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 100% 100%, black 30%, transparent 85%)"
    }
  },
];

const ValueProps = () => {
  return (
    <div className="px-2 my-8 md:my-12">
      <motion.section 
        className="py-20 sm:py-24 md:py-28 rounded-2xl sm:rounded-3xl relative overflow-hidden bg-[hsl(178_48%_21%)] dark:bg-[hsl(175_35%_18%)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
      >
        {/* Scattered cannabis leaf decorations */}
        {leafDecorations.map((leaf, index) => (
          <motion.img
            key={index}
            src={leaf.src}
            alt=""
            className={`${leaf.className} pointer-events-none select-none`}
            style={leaf.style}
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 * index, ease: "easeOut" }}
            aria-hidden="true"
          />
        ))}
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16 sm:mb-20" variants={headerVariants}>
            <h2 className="font-jakarta text-3xl sm:text-4xl md:text-5xl font-semibold text-white px-4" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              Growing more than medicine
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-12 sm:gap-14 md:gap-16 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div 
                  key={index} 
                  className="text-center group"
                  variants={cardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.3 } }}
                >
                  {/* Icon - clean line style without background */}
                  <motion.div 
                    className="flex justify-center mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <IconComponent />
                  </motion.div>
                  
                  <h3 className="font-jakarta text-lg sm:text-xl font-semibold text-white mb-4 tracking-tight">
                    {value.title}
                  </h3>
                  
                  <p className="font-jakarta text-white/70 leading-relaxed text-sm sm:text-[15px]">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ValueProps;
