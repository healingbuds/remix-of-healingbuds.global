import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg",
        outline: "border-2 border-border bg-transparent text-foreground hover:bg-muted hover:border-primary/30 hover:shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-lg",
        ghost: "hover:bg-muted hover:text-foreground transition-colors active:bg-muted/80",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        accent: "bg-primary/90 text-primary-foreground hover:bg-primary hover:shadow-xl hover:shadow-primary/30",
        glass: "backdrop-blur-2xl bg-gradient-to-br from-white/30 via-white/20 to-white/10 dark:from-white/20 dark:via-white/10 dark:to-white/5 border border-white/40 text-white hover:border-white/60 hover:from-white/40 hover:via-white/30 hover:to-white/20 hover:shadow-xl",
        "glass-secondary": "backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 dark:from-white/15 dark:via-white/10 dark:to-white/5 border border-white/30 text-white hover:border-white/50 hover:from-white/30 hover:via-white/25 hover:to-white/20 hover:shadow-lg",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-base font-semibold",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  magnetic?: boolean;
}

// Ripple effect component
const Ripple = ({ x, y }: { x: number; y: number }) => (
  <motion.span
    className="absolute rounded-full bg-white/30 pointer-events-none"
    style={{
      left: x,
      top: y,
      width: 10,
      height: 10,
      transform: "translate(-50%, -50%)",
    }}
    initial={{ scale: 0, opacity: 0.5 }}
    animate={{ scale: 20, opacity: 0 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    onAnimationComplete={() => {}}
  />
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, magnetic = false, children, onClick, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
    const rippleId = React.useRef(0);
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Add ripple effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const id = rippleId.current++;
      setRipples((prev) => [...prev, { x, y, id }]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 700);
      
      // Call original onClick
      onClick?.(e);
    };
    
    if (asChild) {
      return <Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>{children}</Slot>;
    }
    
    const buttonContent = (
      <>
        {ripples.map((ripple) => (
          <Ripple key={ripple.id} x={ripple.x} y={ripple.y} />
        ))}
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </>
    );
    
    // Destructure conflicting event handlers
    const { 
      onAnimationStart, 
      onDrag, 
      onDragEnd, 
      onDragStart, 
      ...restProps 
    } = props;
    
    // Motion button with hover/tap animations
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={handleClick}
        whileHover={{ scale: variant === 'link' || variant === 'ghost' ? 1 : 1.02 }}
        whileTap={{ scale: variant === 'link' || variant === 'ghost' ? 1 : 0.97 }}
        transition={{ 
          duration: 0.2, 
          ease: [0.16, 1, 0.3, 1] as const,
        }}
        data-magnetic={magnetic ? "true" : undefined}
        {...restProps}
      >
        {buttonContent}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
