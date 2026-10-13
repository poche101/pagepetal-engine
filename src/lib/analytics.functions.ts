import { createServerFn } from '@tanstack/react-start';

// GA measurement IDs are public by design; exposed to the browser intentionally.
export const getAnalyticsId = createServerFn({ method: 'GET' }).handler(async () => {
  const id = (process.env['GOOGLE_ANALYTICS_MEASUREMENT_ID'] ?? '').trim();
  return /^G-[A-Z0-9]+$/i.test(id) ? id : null;
});
