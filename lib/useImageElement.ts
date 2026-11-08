'use client';

import { useEffect, useState } from 'react';

/** Loads a data URL (or any image URL) as a plain HTMLImageElement, e.g. to draw into a canvas. */
export function useImageElement(src: string | undefined): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setImage(img);
    };
    img.src = src;
    return () => {
      cancelled = true;
      setImage(null);
    };
  }, [src]);

  return image;
}
