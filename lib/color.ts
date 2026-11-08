import * as THREE from 'three';

/** Darkens a hex color by a 0-1 amount, e.g. darken('#8a8a8a', 0.35). */
export function darken(hex: string, amount: number): string {
  const color = new THREE.Color(hex);
  color.multiplyScalar(1 - amount);
  return `#${color.getHexString()}`;
}
