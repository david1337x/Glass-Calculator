import { useState, useEffect, useCallback } from "react";

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("calc_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("calc_history", JSON.stringify(history));
  }, [history]);

  const addHistoryItem = useCallback((expression: string, result: string) => {
    setHistory(prev => {
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        expression,
        result,
        timestamp: Date.now()
      };
      // Keep only last 50 items
      return [newItem, ...prev].slice(0, 50);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addHistoryItem, clearHistory };
}
