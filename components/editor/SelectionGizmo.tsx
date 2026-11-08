'use client';

import { useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import type { TransformControls as TransformControlsImpl } from 'three-stdlib';
import type { Object3D } from 'three';
import * as THREE from 'three';
import type { AnySceneObject } from '@/types/scene';
import { useSceneStore } from '@/store/sceneStore';
import { resolveRestingY } from '@/lib/geometry';

export default function SelectionGizmo({ obj, target }: { obj: AnySceneObject; target: Object3D }) {
  const transformMode = useSceneStore((s) => s.transformMode);
  const snap = useSceneStore((s) => s.snap);
  const objects = useSceneStore((s) => s.objects);
  const updateObjectTransient = useSceneStore((s) => s.updateObjectTransient);
  const beginHistoryCheckpoint = useSceneStore((s) => s.beginHistoryCheckpoint);
  const setTransformDragging = useSceneStore((s) => s.setTransformDragging);

  const controlsRef = useRef<TransformControlsImpl | null>(null);

  const handleObjectChange = () => {
    if (transformMode === 'translate') {
      const candidate = { ...obj, position: { x: target.position.x, y: obj.position.y, z: target.position.z } };
      const y = resolveRestingY(objects, candidate);
      updateObjectTransient(obj.id, { position: { ...candidate.position, y } });
    } else if (transformMode === 'translateY') {
      const y = target.position.y - obj.dimensions.height / 2;
      updateObjectTransient(obj.id, { position: { ...obj.position, y } });
    } else {
      const deg = THREE.MathUtils.radToDeg(target.rotation.y);
      updateObjectTransient(obj.id, { rotationY: ((deg % 360) + 360) % 360 });
    }
  };

  return (
    <TransformControls
      ref={controlsRef}
      object={target}
      mode={transformMode === 'rotate' ? 'rotate' : 'translate'}
      space="world"
      showX={transformMode === 'translate'}
      showY={transformMode === 'translateY' || transformMode === 'rotate'}
      showZ={transformMode === 'translate'}
      translationSnap={snap.enabled ? snap.positionStep : null}
      rotationSnap={snap.enabled ? THREE.MathUtils.degToRad(snap.rotationStepDeg) : null}
      onMouseDown={() => {
        beginHistoryCheckpoint();
        setTransformDragging(true);
      }}
      onMouseUp={() => setTransformDragging(false)}
      onObjectChange={handleObjectChange}
    />
  );
}
