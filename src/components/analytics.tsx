import { useEffect, useRef } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { getAnalyticsId } from '@/lib/analytics.functions';

declare global { interface Window { dataLayer: unknown[]; gtag?: (...a: unknown[]) => void } }

export function Analytics() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const idRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAnalyticsId().then((id) => {
      if (cancelled || !id || window.gtag) return;
      idRef.current = id;
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', id);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (idRef.current && window.gtag) window.gtag('event', 'page_view', { page_path: path });
  }, [path]);

  return null;
}
