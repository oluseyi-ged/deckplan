'use client';

import type { MicStandProps, MicStandStyle, SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';

const STAND_RADIUS = 0.025;

export default function MicStandObject({ obj }: { obj: SceneObject<'micStand'> }) {
  const { height } = obj.dimensions;
  const isBoom = obj.props.style === 'boom';
  const headY = height / 2 - 0.05;

  return (
    <ObjectShell obj={obj}>
      <mesh castShadow>
        <cylinderGeometry args={[STAND_RADIUS, STAND_RADIUS * 1.6, height, 12]} />
        <meshStandardMaterial color={obj.color} />
      </mesh>
      {isBoom && (
        <mesh castShadow position={[0.2, headY - 0.1, 0]} rotation={[0, 0, Math.PI / 5]}>
          <cylinderGeometry args={[STAND_RADIUS * 0.7, STAND_RADIUS * 0.7, 0.4, 8]} />
          <meshStandardMaterial color={obj.color} />
        </mesh>
      )}
      <mesh castShadow position={[isBoom ? 0.36 : 0, headY, 0]}>
        <capsuleGeometry args={[0.035, 0.1, 4, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </ObjectShell>
  );
}

export function MicStandFields({
  obj,
  onPropsChange,
}: {
  obj: SceneObject<'micStand'>;
  onPropsChange: (patch: Partial<MicStandProps>) => void;
}) {
  const styles: MicStandStyle[] = ['straight', 'boom'];
  return (
    <label className="flex items-center justify-between text-xs text-neutral-400">
      Style
      <select
        value={obj.props.style}
        onChange={(e) => onPropsChange({ style: e.target.value as MicStandStyle })}
        className="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-1 text-xs text-neutral-200"
      >
        {styles.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </label>
  );
}
