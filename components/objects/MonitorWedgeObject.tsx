'use client';

import type { SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';

export default function MonitorWedgeObject({ obj }: { obj: SceneObject<'monitorWedge'> }) {
  const { width, depth, height } = obj.dimensions;

  return (
    <ObjectShell obj={obj}>
      <mesh castShadow receiveShadow rotation={[Math.PI / 7, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={obj.color} />
      </mesh>
    </ObjectShell>
  );
}
