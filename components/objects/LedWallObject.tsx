'use client';

import { useEffect, useMemo } from 'react';
import type { LedWallProps, SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';
import NumberField from '@/components/editor/NumberField';
import ImageUploadField from '@/components/editor/ImageUploadField';
import { createLedWallTexture } from '@/lib/ledTexture';
import { useImageElement } from '@/lib/useImageElement';

export default function LedWallObject({ obj }: { obj: SceneObject<'ledWall'> }) {
  const { width, depth, height } = obj.dimensions;
  const { testPattern, tileSize, imageDataUrl } = obj.props;
  const image = useImageElement(imageDataUrl);

  const texture = useMemo(
    () =>
      createLedWallTexture({
        widthM: width,
        heightM: height,
        tileSizeM: tileSize,
        baseColor: obj.color,
        testPattern,
        image,
      }),
    [width, height, tileSize, obj.color, testPattern, image]
  );

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <ObjectShell obj={obj}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
    </ObjectShell>
  );
}

export function LedWallFields({
  obj,
  onPropsChange,
}: {
  obj: SceneObject<'ledWall'>;
  onPropsChange: (patch: Partial<LedWallProps>) => void;
}) {
  return (
    <div className="space-y-2">
      <ImageUploadField
        value={obj.props.imageDataUrl}
        onChange={(imageDataUrl) => onPropsChange({ imageDataUrl })}
      />
      {!obj.props.imageDataUrl && (
        <label className="flex items-center justify-between text-xs text-neutral-400">
          Test pattern
          <input
            type="checkbox"
            checked={obj.props.testPattern}
            onChange={(e) => onPropsChange({ testPattern: e.target.checked })}
            className="accent-sky-600"
          />
        </label>
      )}
      <NumberField
        label="Tile size"
        value={obj.props.tileSize}
        step={0.1}
        min={0.1}
        onChange={(tileSize) => onPropsChange({ tileSize })}
      />
    </div>
  );
}
