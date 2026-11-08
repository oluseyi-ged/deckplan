'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';

const CHORD_RADIUS = 0.02;
const BRACE_RADIUS = 0.012;
const BRACE_SPACING = 0.5;
const MAX_BRACES = 24;

export default function TrussSegmentObject({ obj }: { obj: SceneObject<'trussSegment'> }) {
  const { width, depth, height } = obj.dimensions;
  const halfY = height / 2 - CHORD_RADIUS;
  const halfZ = depth / 2 - CHORD_RADIUS;

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: obj.color, metalness: 0.6, roughness: 0.4 }),
    [obj.color]
  );
  useEffect(() => () => material.dispose(), [material]);

  const corners: [number, number][] = [
    [halfY, halfZ],
    [halfY, -halfZ],
    [-halfY, halfZ],
    [-halfY, -halfZ],
  ];

  const braceCount = Math.min(MAX_BRACES, Math.max(2, Math.floor(width / BRACE_SPACING)));
  const braces = useMemo(
    () => Array.from({ length: braceCount + 1 }, (_, i) => -width / 2 + (i * width) / braceCount),
    [braceCount, width]
  );

  return (
    <ObjectShell obj={obj}>
      {corners.map(([y, z], i) => (
        <mesh key={i} castShadow rotation={[0, 0, Math.PI / 2]} position={[0, y, z]} material={material}>
          <cylinderGeometry args={[CHORD_RADIUS, CHORD_RADIUS, width, 8]} />
        </mesh>
      ))}
      {braces.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]} material={material}>
            <cylinderGeometry args={[BRACE_RADIUS, BRACE_RADIUS, depth - CHORD_RADIUS * 2, 6]} />
          </mesh>
          <mesh castShadow material={material}>
            <boxGeometry args={[BRACE_RADIUS * 2, height - CHORD_RADIUS * 2, BRACE_RADIUS * 2]} />
          </mesh>
        </group>
      ))}
    </ObjectShell>
  );
}
