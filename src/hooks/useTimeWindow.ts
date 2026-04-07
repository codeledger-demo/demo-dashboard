'use client';

import { useState, useMemo } from 'react';
import type { TimeWindow, TimeRange } from '@/types/dashboard';

const windowToDays: Record<Exclude<TimeWindow, 'custom'>, number> = {
  '30d': 30,
  '60d': 60,
  '90d': 90,
  '1y': 365,
};

export function useTimeWindow(initial: TimeWindow = '30d') {
  const [window, setWindow] = useState<TimeWindow>(initial);

  const range: TimeRange = useMemo(() => {
    const end = new Date();
    const days = window === 'custom' ? 30 : windowToDays[window];
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    return { start, end, window };
  }, [window]);

  return { window, setWindow, range } as const;
}
