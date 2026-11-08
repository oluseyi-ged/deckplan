'use client';

import type { SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';

export default function DrumRiserObject({ obj }: { obj: SceneObject<'drumRiser'> }) {
  const { width, depth, height } = obj.dimensions;

  return (
    <ObjectShell obj={obj}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={obj.color} />
      </mesh>
    </ObjectShell>
  );
}
