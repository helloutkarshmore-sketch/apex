import switchgear from '@/assets/switchgear.asset.json';
import cables from '@/assets/cables.asset.json';
import automation from '@/assets/automation.asset.json';
import lighting from '@/assets/lighting.asset.json';
import heaters from '@/assets/heaters.asset.json';
import connectors from '@/assets/connectors.asset.json';
import supplies from '@/assets/power-supplies.asset.json';
import pneumatics from '@/assets/pneumatics.asset.json';
import workshop from '@/assets/workshop.asset.json';
import type { SyntheticEvent } from 'react';
export const workshopImage = import.meta.env.DEV ? '/products/workshop.webp' : workshop.url;
const images: Record<string,string> = { switchgear:switchgear.url,cables:cables.url,automation:automation.url,lighting:lighting.url,heaters:heaters.url,connectors:connectors.url,'power-supplies':supplies.url,pneumatics:pneumatics.url };
const localImages: Record<string,string> = { switchgear:'/products/switchgear.webp',cables:'/products/cables.webp',automation:'/products/automation.webp',lighting:'/products/lighting.webp',heaters:'/products/heaters.webp',connectors:'/products/connectors.webp','power-supplies':'/products/power-supplies.webp',pneumatics:'/products/pneumatics.webp' };
export const productFallbackImage = '/product-placeholder.svg';
export const productImage = (key: string, url?: string | null) => {
  const selected = url || images[key] || connectors.url;
  return import.meta.env.DEV && !url ? localImages[key] || localImages.connectors : selected;
};
export const handleProductImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  const image = event.currentTarget;
  if (image.src.endsWith(productFallbackImage)) return;
  image.onerror = null;
  image.src = productFallbackImage;
};
