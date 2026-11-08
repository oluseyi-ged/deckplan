'use client';

import * as THREE from 'three';
import type { Mesh } from 'three';
import type { MovingHeadLightProps, SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';
import NumberField from '@/components/editor/NumberField';
import { HELPER_LAYER } from '@/lib/layers';

export default function MovingHeadLightObject({ obj }: { obj: SceneObject<'movingHeadLight'> }) {
  const { width, depth, height } = obj.dimensions;
  const { tiltSide, tiltForward, beamAngle, beamLength, beamColor, beamOn } = obj.props;
  const beamRadius = beamLength * Math.tan(THREE.MathUtils.degToRad(beamAngle / 2));

  return (
    <ObjectShell obj={obj}>
      <mesh castShadow position={[0, height / 2 - height * 0.15, 0]}>
        <boxGeometry args={[width, height * 0.3, depth]} />
        <meshStandardMaterial color={obj.color} />
      </mesh>
      {/* Beam aims via two independent perpendicular tilts (not pan/tilt gimbal order) so each axis stays visible regardless of the other's value. */}
      <group rotation={[THREE.MathUtils.degToRad(tiltForward), 0, THREE.MathUtils.degToRad(tiltSide)]}>
        <mesh castShadow position={[0, height * 0.15, 0]}>
          <boxGeometry args={[width * 0.8, height * 0.5, depth * 0.8]} />
          <meshStandardMaterial color={obj.color} />
        </mesh>
        {beamOn && (
          <mesh
            ref={(m: Mesh | null) => m?.layers.set(HELPER_LAYER)}
            position={[0, height * 0.15 - height * 0.25 - beamLength / 2, 0]}
          >
            <coneGeometry args={[beamRadius, beamLength, 24, 1, true]} />
            <meshBasicMaterial color={beamColor} transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        )}
      </group>
    </ObjectShell>
  );
}

export function MovingHeadLightFields({
  obj,
  onPropsChange,
}: {
  obj: SceneObject<'movingHeadLight'>;
  onPropsChange: (patch: Partial<MovingHeadLightProps>) => void;
}) {
  const { tiltSide, tiltForward, beamAngle, beamLength, beamColor, beamOn } = obj.props;
  return (
    <div className="space-y-2">
      <NumberField
        label="Tilt fwd/back"
        value={tiltForward}
        step={5}
        onChange={(v) => onPropsChange({ tiltForward: v })}
      />
      <NumberField
        label="Tilt left/right"
        value={tiltSide}
        step={5}
        onChange={(v) => onPropsChange({ tiltSide: v })}
      />
      <NumberField
        label="Beam angle"
        value={beamAngle}
        step={1}
        min={1}
        onChange={(v) => onPropsChange({ beamAngle: v })}
      />
      <NumberField
        label="Beam length"
        value={beamLength}
        step={0.5}
        min={0.5}
        onChange={(v) => onPropsChange({ beamLength: v })}
      />
      <label className="flex items-center justify-between text-xs text-neutral-400">
        Beam color
        <input
          type="color"
          value={beamColor}
          onChange={(e) => onPropsChange({ beamColor: e.target.value })}
          className="h-6 w-10 rounded border border-neutral-700 bg-neutral-800"
        />
      </label>
      <label className="flex items-center justify-between text-xs text-neutral-400">
        Beam on
        <input
          type="checkbox"
          checked={beamOn}
          onChange={(e) => onPropsChange({ beamOn: e.target.checked })}
          className="accent-sky-600"
        />
      </label>
    </div>
  );
}
