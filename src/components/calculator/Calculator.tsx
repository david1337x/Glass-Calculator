import { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Volume2, VolumeX, Moon, Sun, Delete } from 'lucide-react';
import { Display } from './Display';
import { Button } from './Button';
import { HistoryPanel } from './HistoryPanel';
import { useCalculator } from '@/hooks/use-calculator';
import { useTheme } from '@/hooks/use-theme';
import { useAudio } from '@/hooks/use-audio';
import { useHistory } from '@/hooks/use-history';

export function Calculator() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const { isMuted, toggleMute } = useAudio();
  const { history, clearHistory } = useHistory();
  
  const {
    current,
    expression,
    error,
    handleDigit,
    handleOperator,
    handleEqual,
    handleClear,
    handleDelete,
    handlePercent,
    handleToggleSign,
    loadHistoryItem
  } = useCalculator();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="relative w-full max-w-[340px] sm:max-w-[380px] glass-panel rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 flex flex-col gap-4 mx-auto"
    >
      {/* Header / Controls */}
      <div className="flex items-center justify-between px-2 text-muted-foreground">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
            aria-label="Open history"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Display current={current} expression={expression} error={error} />

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-2">
        <Button onClick={handleClear} variant="action" className="text-destructive font-semibold">C</Button>
        <Button onClick={handleToggleSign} variant="action">+/-</Button>
        <Button onClick={handlePercent} variant="action">%</Button>
        <Button onClick={() => handleOperator('÷')} variant="operator">÷</Button>

        <Button onClick={() => handleDigit('7')}>7</Button>
        <Button onClick={() => handleDigit('8')}>8</Button>
        <Button onClick={() => handleDigit('9')}>9</Button>
        <Button onClick={() => handleOperator('×')} variant="operator">×</Button>

        <Button onClick={() => handleDigit('4')}>4</Button>
        <Button onClick={() => handleDigit('5')}>5</Button>
        <Button onClick={() => handleDigit('6')}>6</Button>
        <Button onClick={() => handleOperator('-')} variant="operator">-</Button>

        <Button onClick={() => handleDigit('1')}>1</Button>
        <Button onClick={() => handleDigit('2')}>2</Button>
        <Button onClick={() => handleDigit('3')}>3</Button>
        <Button onClick={() => handleOperator('+')} variant="operator">+</Button>

        <Button onClick={handleDelete} variant="action">
          <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <Button onClick={() => handleDigit('0')}>0</Button>
        <Button onClick={() => handleDigit('.')}>.</Button>
        <Button onClick={handleEqual} variant="equal">=</Button>
      </div>

      <HistoryPanel 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onClear={clearHistory}
        onItemClick={loadHistoryItem}
      />
    </motion.div>
  );
}
