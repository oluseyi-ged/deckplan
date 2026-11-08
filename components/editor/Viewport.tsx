'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import FloorGrid from './FloorGrid';
import CameraRig from './CameraRig';
import { useSceneStore } from '@/store/sceneStore';
import ObjectRenderer from '@/components/objects/ObjectRenderer';
import { registerCanvas } from '@/lib/screenshot';

export default function Viewport() {
  const objects = useSceneStore((s) => s.objects);
  const selectObject = useSceneStore((s) => s.selectObject);
  const cameraMode = useSceneStore((s) => s.cameraMode);
  const viewportBackground = useSceneStore((s) => s.viewportBackground);
  const floorColor = useSceneStore((s) => s.floorColor);
  const [fading, setFading] = useState(false);
  const prevModeRef = useRef(cameraMode);

  useEffect(() => {
    const prevMode = prevModeRef.current;
    prevModeRef.current = cameraMode;
    if (prevMode === cameraMode) return;
    if (prevMode === 'iso' || cameraMode === 'iso') {
      setFading(true);
      const timeout = setTimeout(() => setFading(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [cameraMode]);

  useEffect(() => () => registerCanvas(null), []);

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}
        onCreated={(state) => registerCanvas(state.gl.domElement)}
        onPointerMissed={() => selectObject(null)}
      >
        <color attach="background" args={[viewportBackground]} />
        <CameraRig />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[12, 18, 8]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-radius={3}
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          onClick={() => selectObject(null)}
        >
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color={floorColor} />
        </mesh>
        <FloorGrid />
        {objects.map((obj) => (
          <ObjectRenderer key={obj.id} obj={obj} />
        ))}
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-150"
        style={{ opacity: fading ? 1 : 0, backgroundColor: viewportBackground }}
      />
    </div>
  );
}
