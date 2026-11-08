'use client';

import type { SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';

export default function GuitarAmpObject({ obj }: { obj: SceneObject<'guitarAmp'> }) {
  const { width, depth, height } = obj.dimensions;
  const speakerRadius = Math.min(width, height) * 0.18;

  return (
    <ObjectShell obj={obj}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={obj.color} />
      </mesh>
      <mesh position={[-width * 0.22, 0, depth / 2 + 0.005]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[speakerRadius, speakerRadius, 0.01, 20]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[width * 0.22, 0, depth / 2 + 0.005]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[speakerRadius, speakerRadius, 0.01, 20]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </ObjectShell>
  );
}
