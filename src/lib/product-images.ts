import type { SyntheticEvent } from 'react';
const localImages: Record<string,string> = { switchgear:'/products/switchgear.webp',cables:'/products/cables.webp',automation:'/products/automation.webp',lighting:'/products/lighting.webp',heaters:'/products/heaters.webp',connectors:'/products/connectors.webp','power-supplies':'/products/power-supplies.webp',pneumatics:'/products/pneumatics.webp' };
export const workshopImage = '/products/workshop.webp';
const images: Record<string,string> = localImages;
export const productFallbackImage = '/product-placeholder.svg';
export const productImage = (key: string, url?: string | null) => {
  return url || images[key] || localImages.connectors;
};
export const handleProductImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  const image = event.currentTarget;
  if (image.src.endsWith(productFallbackImage)) return;
  image.onerror = null;
  image.src = productFallbackImage;
};
