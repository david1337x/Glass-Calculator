import { Calculator } from '@/components/calculator/Calculator';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Image / Mesh gradient */}
      <div 
        className="absolute inset-0 z-0 opacity-40 dark:opacity-80 mix-blend-screen transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-mesh.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Animated glowing orbs for extra depth */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 dark:bg-primary/20 rounded-full blur-[80px] pointer-events-none z-0"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1 
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/30 dark:bg-accent/20 rounded-full blur-[100px] pointer-events-none z-0"
      />

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center gap-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground/90"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Calculator
        </motion.h1>

        <Calculator />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="text-sm text-muted-foreground/70 tracking-wide"
        >
          &copy; David 2026. All Rights Reserved.
        </motion.p>
      </div>
    </div>
  );
}
