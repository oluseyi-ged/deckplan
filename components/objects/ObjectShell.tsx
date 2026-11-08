'use client';

import { useState, type ReactNode } from 'react';
import type { Group } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import type { AnySceneObject } from '@/types/scene';
import { toRenderPosition } from '@/lib/geometry';
import { useSceneStore } from '@/store/sceneStore';
import SelectionGizmo from '@/components/editor/SelectionGizmo';

export default function ObjectShell({
  obj,
  children,
}: {
  obj: AnySceneObject;
  children: ReactNode;
}) {
  const selected = useSceneStore((s) => s.selectedId === obj.id);
  const selectObject = useSceneStore((s) => s.selectObject);
  const center = toRenderPosition(obj);
  const [node, setNode] = useState<Group | null>(null);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectObject(obj.id);
  };

  return (
    <>
      <group
        ref={setNode}
        position={[center.x, center.y, center.z]}
        rotation={[0, (obj.rotationY * Math.PI) / 180, 0]}
        onClick={handleClick}
      >
        {children}
        {selected && (
          <mesh scale={1.02}>
            <boxGeometry args={[obj.dimensions.width, obj.dimensions.height, obj.dimensions.depth]} />
            <meshBasicMaterial visible={false} />
            <Edges color="#38bdf8" lineWidth={2} />
          </mesh>
        )}
      </group>
      {selected && node && <SelectionGizmo obj={obj} target={node} />}
    </>
  );
}
