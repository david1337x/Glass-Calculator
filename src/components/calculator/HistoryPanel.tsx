import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Clock } from 'lucide-react';
import { HistoryItem } from '@/hooks/use-history';
import { cn } from '@/lib/utils';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClear: () => void;
  onItemClick: (result: string) => void;
}

export function HistoryPanel({ isOpen, onClose, history, onClear, onItemClick }: HistoryPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-background/20 backdrop-blur-sm rounded-3xl"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 z-50 w-3/4 sm:w-2/3 glass-panel rounded-l-3xl rounded-r-3xl sm:rounded-r-none border-l border-white/20 dark:border-white/10 flex flex-col overflow-hidden shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 dark:border-white/5">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Clock className="w-4 h-4 text-primary" />
                History
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-3">
                  <Clock className="w-10 h-10 mb-2" />
                  <p className="text-sm">No history yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {history.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        onItemClick(item.result);
                        onClose();
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full text-right p-3 sm:p-4 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-colors group relative"
                    >
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1 font-medium tracking-wide">
                        {item.expression}
                      </div>
                      <div className="text-lg sm:text-xl text-foreground font-display font-medium group-hover:text-primary transition-colors">
                        {item.result}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {history.length > 0 && (
              <div className="p-4 border-t border-white/10 dark:border-white/5">
                <button
                  onClick={onClear}
                  className="w-full py-3 flex items-center justify-center gap-2 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
