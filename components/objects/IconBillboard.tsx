'use client';

import { Billboard } from '@react-three/drei';
import { useIconTexture } from '@/lib/useIconTexture';

export default function IconBillboard({ src, height, y = 0 }: { src: string; height: number; y?: number }) {
  const texture = useIconTexture(src);
  const image = texture?.image as HTMLImageElement | undefined;
  if (!image) return null;

  const aspect = image.width / image.height;
  const width = height * aspect;

  return (
    <Billboard position={[0, y, 0]}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.4} />
      </mesh>
    </Billboard>
  );
}
