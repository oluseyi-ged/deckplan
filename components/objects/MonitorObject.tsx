'use client';

import type { MonitorMountStyle, MonitorProps, SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';
import ImageUploadField from '@/components/editor/ImageUploadField';
import { useIconTexture } from '@/lib/useIconTexture';

export default function MonitorObject({ obj }: { obj: SceneObject<'monitor'> }) {
  const { width, depth, height } = obj.dimensions;
  const isStand = obj.props.mountStyle === 'stand';
  const screenHeight = isStand ? height * 0.75 : height;
  const screenY = isStand ? height / 2 - screenHeight / 2 : 0;
  const texture = useIconTexture(obj.props.imageDataUrl ?? '');
  const hasImage = Boolean(obj.props.imageDataUrl) && texture;

  return (
    <ObjectShell obj={obj}>
      <mesh castShadow receiveShadow position={[0, screenY, 0]}>
        <boxGeometry args={[width, screenHeight, depth]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0, screenY, depth / 2 + 0.005]}>
        <planeGeometry args={[width * 0.9, screenHeight * 0.85]} />
        {hasImage ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshStandardMaterial color={obj.color} emissive={obj.color} emissiveIntensity={0.3} />
        )}
      </mesh>
      {isStand && (
        <mesh castShadow position={[0, -height / 2 + (height - screenHeight) / 2 / 2, 0]}>
          <cylinderGeometry args={[0.03, 0.08, height - screenHeight, 12]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      )}
    </ObjectShell>
  );
}

const MOUNT_STYLES: { style: MonitorMountStyle; label: string }[] = [
  { style: 'stand', label: 'Stand' },
  { style: 'wall', label: 'Wall mount' },
];

export function MonitorFields({
  obj,
  onPropsChange,
}: {
  obj: SceneObject<'monitor'>;
  onPropsChange: (patch: Partial<MonitorProps>) => void;
}) {
  return (
    <div className="space-y-2">
      <ImageUploadField
        value={obj.props.imageDataUrl}
        onChange={(imageDataUrl) => onPropsChange({ imageDataUrl })}
      />
      <span className="mb-1 block text-xs text-neutral-400">Mount</span>
      <div className="grid grid-cols-2 gap-1">
        {MOUNT_STYLES.map(({ style, label }) => (
          <button
            key={style}
            type="button"
            onClick={() => onPropsChange({ mountStyle: style })}
            className={`rounded px-2 py-1 text-xs transition-colors ${
              obj.props.mountStyle === style
                ? 'bg-sky-700 text-white'
                : 'border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
