import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://laryssafinizola.vercel.app/', changeFrequency: 'monthly', priority: 1 }];
}
