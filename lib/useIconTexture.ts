'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';

/** Loads a static image (e.g. public/icons/*.png) as a texture for use on a billboard. */
export function useIconTexture(src: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(src, (tex) => {
      if (cancelled) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => () => texture?.dispose(), [texture]);

  return texture;
}
