'use client';

import type { SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';
import { darken } from '@/lib/color';

const DECK_THICKNESS = 0.15;
const SKIRT_INSET = 0.08;

export default function StageObject({ obj }: { obj: SceneObject<'stage'> }) {
  const { width, depth, height } = obj.dimensions;
  const deckThickness = Math.min(DECK_THICKNESS, height * 0.5);
  const skirtHeight = height - deckThickness;

  return (
    <ObjectShell obj={obj}>
      <mesh castShadow receiveShadow position={[0, height / 2 - deckThickness / 2, 0]}>
        <boxGeometry args={[width, deckThickness, depth]} />
        <meshStandardMaterial color={obj.color} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        position={[0, -deckThickness / 2, 0]}
      >
        <boxGeometry args={[width - SKIRT_INSET * 2, skirtHeight, depth - SKIRT_INSET * 2]} />
        <meshStandardMaterial color={darken(obj.color, 0.4)} />
      </mesh>
    </ObjectShell>
  );
}
