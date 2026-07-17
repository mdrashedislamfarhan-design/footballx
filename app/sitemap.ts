import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://anistreambd.vercel.app';
  const now = new Date();

  const staticRoutes = [
    { url: base, priority: 1.0 },
    { url: `${base}/live`, priority: 0.9 },
    { url: `${base}/watch`, priority: 0.9 },
    { url: `${base}/schedule`, priority: 0.8 },
    { url: `${base}/leagues`, priority: 0.8 },
    { url: `${base}/search`, priority: 0.7 },
    { url: `${base}/about`, priority: 0.5 },
    { url: `${base}/contact`, priority: 0.5 },
    { url: `${base}/privacy`, priority: 0.4 },
    { url: `${base}/terms`, priority: 0.4 },
  ].map(r => ({
    ...r,
    lastModified: now,
    changeFrequency: 'daily' as const,
  }));

  return staticRoutes;
}
