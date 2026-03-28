import { useState, useRef, useCallback } from "react";

export function useAudio() {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("calc_muted");
    return saved === "true";
  });
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      localStorage.setItem("calc_muted", String(next));
      return next;
    });
  }, []);

  const playClickSound = useCallback((type: 'normal' | 'operator' | 'action' = 'normal') => {
    if (isMuted) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Different sound profiles based on button type
      if (type === 'operator') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
      } else if (type === 'action') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
      } else {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
      }

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  }, [isMuted]);

  return { isMuted, toggleMute, playClickSound };
}
