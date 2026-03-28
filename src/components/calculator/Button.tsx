import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'default' | 'operator' | 'action' | 'equal';

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

export function Button({ onClick, children, variant = 'default', className }: ButtonProps) {
  const baseStyles = "relative flex items-center justify-center text-xl sm:text-2xl font-medium rounded-2xl sm:rounded-3xl select-none overflow-hidden outline-none transition-colors duration-300";
  
  const variants = {
    default: "glass-button text-foreground hover:bg-white/60 dark:hover:bg-white/10 active:bg-white/40 dark:active:bg-white/5",
    action: "glass-button text-foreground/80 hover:bg-white/60 dark:hover:bg-white/10 text-lg sm:text-xl",
    operator: "bg-primary/10 text-primary dark:text-primary-foreground border border-primary/20 dark:border-primary/40 hover:bg-primary/20 dark:hover:bg-primary/30",
    equal: "bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 neon-glow hover:brightness-110",
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.92 }}
      className={cn(baseStyles, variants[variant], className)}
    >
      {/* Ripple/Glow overlay layer */}
      <motion.div 
        className="absolute inset-0 bg-white opacity-0"
        whileTap={{ opacity: 0.2 }}
        transition={{ duration: 0.1 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
