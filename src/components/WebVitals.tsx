'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // We only log vitals in development, or we could send them to a real analytics endpoint.
    if (process.env.NODE_ENV !== 'production') {
      // Filter out noisy metrics unless they are core web vitals
      if (
        metric.name === 'FCP' ||
        metric.name === 'LCP' ||
        metric.name === 'CLS' ||
        metric.name === 'FID' ||
        metric.name === 'INP' ||
        metric.name === 'TTFB'
      ) {
        console.log(`[Web Vitals] ${metric.name}: ${Math.round(metric.value)}ms`);
      }
    }
  });

  return null;
}
