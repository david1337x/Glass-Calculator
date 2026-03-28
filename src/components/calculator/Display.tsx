import { motion, AnimatePresence } from 'framer-motion';

interface DisplayProps {
  current: string;
  expression: string;
  error: string | null;
}

export function Display({ current, expression, error }: DisplayProps) {
  // Adjust font size based on length
  const getFontSize = (text: string) => {
    if (text.length > 12) return 'text-3xl sm:text-4xl';
    if (text.length > 9) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl';
  };

  return (
    <div className="flex flex-col items-end justify-end h-32 px-2 pb-2 overflow-hidden w-full relative">
      <div className="h-6 flex items-end justify-end w-full mb-1 opacity-70">
        <AnimatePresence mode="wait">
          {expression && (
            <motion.span
              key={expression}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-muted-foreground text-sm sm:text-base font-medium tracking-wide"
            >
              {expression}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      <div className={`w-full flex justify-end items-baseline overflow-hidden font-display font-light tracking-tight transition-all duration-200 ${
        error ? 'text-destructive neon-text-glow' : 'text-foreground'
      } ${getFontSize(current)}`}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={current}
            initial={{ opacity: 0.5, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="truncate pb-1"
          >
            {current}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
