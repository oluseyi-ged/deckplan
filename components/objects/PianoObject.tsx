'use client';

import type { SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';
import { darken } from '@/lib/color';

export default function PianoObject({ obj }: { obj: SceneObject<'piano'> }) {
  const { width, depth, height } = obj.dimensions;
  const bodyHeight = height * 0.55;
  const lidHeight = height * 0.45;

  return (
    <ObjectShell obj={obj}>
      <mesh castShadow receiveShadow position={[0, -height / 2 + bodyHeight / 2, 0]}>
        <boxGeometry args={[width, bodyHeight, depth]} />
        <meshStandardMaterial color={obj.color} />
      </mesh>
      <mesh
        castShadow
        position={[0, -height / 2 + bodyHeight + Math.sin(Math.PI / 6) * lidHeight * 0.5, -depth * 0.15]}
        rotation={[-Math.PI / 6, 0, 0]}
      >
        <boxGeometry args={[width * 0.95, 0.03, depth * 0.7]} />
        <meshStandardMaterial color={darken(obj.color, 0.15)} />
      </mesh>
    </ObjectShell>
  );
}
