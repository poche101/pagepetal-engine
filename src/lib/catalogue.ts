import { queryOptions, useQuery } from '@tanstack/react-query';
import { getContent } from './site.functions';
import { products } from './site-data';

export const contentQuery = queryOptions({ queryKey: ['site-content'], queryFn: () => getContent() });

type Product = (typeof products)[number];
type Row = { key: string; title: string; body: string; category: string };

export function applyOverrides(list: Product[], rows: Row[] | undefined) {
  return list
    .map((p) => {
      const o = rows?.find((r) => r.key === `product:${p.slug}`);
      if (!o) return p;
      if (o.category === 'hidden') return null;
      return { ...p, name: o.title || p.name, description: o.body || p.description };
    })
    .filter((p): p is Product => p !== null);
}

export function useCatalogue() {
  const { data } = useQuery(contentQuery);
  return applyOverrides(products, data);
}
