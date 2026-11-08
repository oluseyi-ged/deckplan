'use client';

import { useEffect, useMemo } from 'react';
import { Instance, Instances } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneObject, SeatingSectionProps } from '@/types/scene';
import ObjectShell from './ObjectShell';
import NumberField from '@/components/editor/NumberField';
import { createChairGeometry } from '@/lib/chairGeometry';
import { useSceneStore } from '@/store/sceneStore';
import { getStageCenter } from '@/lib/stageCenter';

const MAX_SEATS = 2000;

export default function SeatingSectionObject({ obj }: { obj: SceneObject<'seatingSection'> }) {
  const { rows, seatsPerRow, seatSpacing, rowSpacing, seatWidth, seatDepth } = obj.props;
  const { width, depth, height } = obj.dimensions;

  const objects = useSceneStore((s) => s.objects);
  const previewEyeHeight = useSceneStore((s) => s.previewEyeHeight);
  const setPreviewSource = useSceneStore((s) => s.setPreviewSource);
  const setCameraMode = useSceneStore((s) => s.setCameraMode);

  const geometry = useMemo(() => createChairGeometry(seatWidth, seatDepth), [seatWidth, seatDepth]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const seats = useMemo(() => {
    const list: { x: number; z: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < seatsPerRow; i++) {
        list.push({
          x: -width / 2 + seatSpacing * (i + 0.5),
          z: -depth / 2 + rowSpacing * (r + 0.5),
        });
      }
    }
    return list;
  }, [rows, seatsPerRow, seatSpacing, rowSpacing, width, depth]);

  const handleSeatClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const worldPosition = new THREE.Vector3();
    e.object.getWorldPosition(worldPosition);
    const eyeY = previewEyeHeight === 'standing' ? 1.6 : 1.2;
    setPreviewSource({
      position: { x: worldPosition.x, y: eyeY, z: worldPosition.z },
      lookAt: getStageCenter(objects),
    });
    setCameraMode('preview');
  };

  return (
    <ObjectShell obj={obj}>
      <Instances geometry={geometry} limit={MAX_SEATS} castShadow receiveShadow>
        <meshStandardMaterial color={obj.color} />
        {seats.map((seat, i) => (
          <Instance key={i} position={[seat.x, -height / 2, seat.z]} onClick={handleSeatClick} />
        ))}
      </Instances>
    </ObjectShell>
  );
}

export function SeatingSectionFields({
  obj,
  onPropsChange,
}: {
  obj: SceneObject<'seatingSection'>;
  onPropsChange: (patch: Partial<SeatingSectionProps>) => void;
}) {
  const { rows, seatsPerRow, seatSpacing, rowSpacing, seatWidth, seatDepth } = obj.props;

  return (
    <div className="space-y-2">
      <NumberField label="Rows" value={rows} step={1} min={1} onChange={(v) => onPropsChange({ rows: Math.round(v) })} />
      <NumberField
        label="Seats/row"
        value={seatsPerRow}
        step={1}
        min={1}
        onChange={(v) => onPropsChange({ seatsPerRow: Math.round(v) })}
      />
      <NumberField
        label="Seat spacing"
        value={seatSpacing}
        step={0.05}
        min={0.1}
        onChange={(seatSpacing) => onPropsChange({ seatSpacing })}
      />
      <NumberField
        label="Row spacing"
        value={rowSpacing}
        step={0.05}
        min={0.1}
        onChange={(rowSpacing) => onPropsChange({ rowSpacing })}
      />
      <NumberField
        label="Seat width"
        value={seatWidth}
        step={0.05}
        min={0.1}
        onChange={(seatWidth) => onPropsChange({ seatWidth })}
      />
      <NumberField
        label="Seat depth"
        value={seatDepth}
        step={0.05}
        min={0.1}
        onChange={(seatDepth) => onPropsChange({ seatDepth })}
      />
    </div>
  );
}
