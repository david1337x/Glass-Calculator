import { useState, useCallback, useEffect } from 'react';
import { useHistory } from './use-history';
import { useAudio } from './use-audio';

export type Operator = '+' | '-' | '×' | '÷';

const MAX_DIGITS = 15;

export function useCalculator() {
  const [current, setCurrent] = useState('0');
  const [previous, setPrevious] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expression, setExpression] = useState<string>('');

  const { addHistoryItem } = useHistory();
  const { playClickSound } = useAudio();

  const formatNumber = (numStr: string) => {
    if (numStr === 'Error' || numStr === 'NaN' || numStr === 'Infinity') return 'Error';
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const calculate = useCallback((a: string, b: string, op: Operator): string => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    
    if (isNaN(numA) || isNaN(numB)) return 'Error';

    let result = 0;
    switch (op) {
      case '+': result = numA + numB; break;
      case '-': result = numA - numB; break;
      case '×': result = numA * numB; break;
      case '÷': 
        if (numB === 0) return 'Error';
        result = numA / numB; 
        break;
    }

    // Fix floating point precision issues
    return parseFloat(result.toFixed(10)).toString();
  }, []);

  const handleDigit = useCallback((digit: string) => {
    playClickSound('normal');
    if (error) setError(null);

    if (waitingForNewValue) {
      setCurrent(digit === '.' ? '0.' : digit);
      setWaitingForNewValue(false);
    } else {
      if (digit === '.' && current.includes('.')) return;
      if (current === '0' && digit !== '.') {
        setCurrent(digit);
      } else {
        if (current.replace(/[^0-9]/g, '').length < MAX_DIGITS) {
          setCurrent(current + digit);
        }
      }
    }
  }, [current, waitingForNewValue, error, playClickSound]);

  const handleOperator = useCallback((nextOperator: Operator) => {
    playClickSound('operator');
    if (error) setError(null);

    if (operator && !waitingForNewValue && previous) {
      const result = calculate(previous, current, operator);
      if (result === 'Error') {
        setError('Error');
        setCurrent('Error');
        setPrevious(null);
        setOperator(null);
        setExpression('');
      } else {
        setCurrent(result);
        setPrevious(result);
        setOperator(nextOperator);
        setExpression(`${formatNumber(result)} ${nextOperator}`);
        setWaitingForNewValue(true);
      }
    } else {
      setPrevious(current);
      setOperator(nextOperator);
      setExpression(`${formatNumber(current)} ${nextOperator}`);
      setWaitingForNewValue(true);
    }
  }, [current, operator, previous, waitingForNewValue, error, calculate, playClickSound]);

  const handleEqual = useCallback(() => {
    playClickSound('action');
    if (!operator || !previous || waitingForNewValue) return;

    const result = calculate(previous, current, operator);
    
    if (result === 'Error') {
      setError('Error');
      setCurrent('Error');
    } else {
      const fullExpression = `${formatNumber(previous)} ${operator} ${formatNumber(current)} =`;
      setCurrent(result);
      addHistoryItem(fullExpression, formatNumber(result));
    }
    
    setExpression('');
    setPrevious(null);
    setOperator(null);
    setWaitingForNewValue(true);
  }, [current, operator, previous, waitingForNewValue, calculate, addHistoryItem, playClickSound]);

  const handleClear = useCallback(() => {
    playClickSound('action');
    setCurrent('0');
    setPrevious(null);
    setOperator(null);
    setExpression('');
    setWaitingForNewValue(false);
    setError(null);
  }, [playClickSound]);

  const handleDelete = useCallback(() => {
    playClickSound('action');
    if (waitingForNewValue || error) return;
    
    setCurrent(prev => {
      if (prev.length === 1 || (prev.length === 2 && prev.startsWith('-'))) return '0';
      return prev.slice(0, -1);
    });
  }, [waitingForNewValue, error, playClickSound]);

  const handlePercent = useCallback(() => {
    playClickSound('action');
    if (error) return;
    const val = parseFloat(current);
    if (!isNaN(val)) {
      setCurrent(parseFloat((val / 100).toFixed(10)).toString());
      setWaitingForNewValue(true);
    }
  }, [current, error, playClickSound]);

  const handleToggleSign = useCallback(() => {
    playClickSound('action');
    if (error) return;
    if (current !== '0') {
      setCurrent(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
    }
  }, [current, error, playClickSound]);

  // Load from history
  const loadHistoryItem = useCallback((result: string) => {
    playClickSound('action');
    setCurrent(result.replace(/,/g, ''));
    setPrevious(null);
    setOperator(null);
    setExpression('');
    setWaitingForNewValue(true);
    setError(null);
  }, [playClickSound]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      if (e.key === '.') handleDigit('.');
      if (e.key === '+' || e.key === '-') handleOperator(e.key as Operator);
      if (e.key === '*') handleOperator('×');
      if (e.key === '/') handleOperator('÷');
      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEqual();
      }
      if (e.key === 'Escape') handleClear();
      if (e.key === 'Backspace') handleDelete();
      if (e.key === '%') handlePercent();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEqual, handleClear, handleDelete, handlePercent]);

  return {
    current: formatNumber(current),
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
  };
}
