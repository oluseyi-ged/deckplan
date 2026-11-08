'use client';

import { Grid } from '@react-three/drei';

export default function FloorGrid() {
  return (
    <>
      <Grid
        args={[200, 200]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#3a3a3a"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#6a6a6a"
        fadeDistance={60}
        fadeStrength={1}
        infiniteGrid
      />
      {/* Origin marker */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.22, 32]} />
        <meshBasicMaterial color="#e11d48" />
      </mesh>
    </>
  );
}
