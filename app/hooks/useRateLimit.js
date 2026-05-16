'use client';

import { useState, useCallback } from 'react';

/**
 * Shared rate limiter hook for free tools.
 * Uses localStorage with daily reset. SSR-safe.
 *
 * @param {string} toolKey - Unique tool identifier (e.g., 'claudemd', 'resume')
 * @param {number} dailyLimit - Max uses per day
 * @returns {{ allowed, remaining, limitReached, recordUse, checkLimit }}
 */
export function useRateLimit(toolKey, dailyLimit) {
  const storageKey = `lo_${toolKey}_uses`;
  const [limitReached, setLimitReached] = useState(false);

  const getState = useCallback(() => {
    if (typeof window === 'undefined') return { count: 0, date: '' };
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{"count":0,"date":""}');
    } catch {
      return { count: 0, date: '' };
    }
  }, [storageKey]);

  const checkLimit = useCallback(() => {
    if (typeof window === 'undefined') return { allowed: true, remaining: dailyLimit };
    const stored = getState();
    const today = new Date().toISOString().split('T')[0];
    if (stored.date !== today) return { allowed: true, remaining: dailyLimit };
    const remaining = Math.max(0, dailyLimit - stored.count);
    return { allowed: remaining > 0, remaining };
  }, [dailyLimit, getState]);

  const recordUse = useCallback(() => {
    if (typeof window === 'undefined') return;
    const today = new Date().toISOString().split('T')[0];
    const stored = getState();
    const newCount = stored.date === today ? stored.count + 1 : 1;
    localStorage.setItem(storageKey, JSON.stringify({ count: newCount, date: today }));
    if (newCount >= dailyLimit) setLimitReached(true);
  }, [dailyLimit, storageKey, getState]);

  const { allowed, remaining } = checkLimit();

  return { allowed, remaining, limitReached, recordUse, checkLimit };
}
