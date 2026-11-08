'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useSceneStore } from '@/store/sceneStore';
import { getStageCenter } from '@/lib/stageCenter';
import { HELPER_LAYER } from '@/lib/layers';

const ORBIT_DEFAULT_POSITION = new THREE.Vector3(14, 10, 14);
const ORBIT_DEFAULT_TARGET = new THREE.Vector3(0, 1, 0);
const ISO_DIRECTION = new THREE.Vector3(1, 1, 1).normalize();
const ISO_DISTANCE = 30;
const TRANSITION_SECONDS = 0.6;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function CameraRig() {
  const cameraMode = useSceneStore((s) => s.cameraMode);
  const objects = useSceneStore((s) => s.objects);
  const defaultPreviewPosition = useSceneStore((s) => s.defaultPreviewPosition);
  const previewEyeHeight = useSceneStore((s) => s.previewEyeHeight);
  const previewSource = useSceneStore((s) => s.previewSource);
  const transformDragging = useSceneStore((s) => s.transformDragging);

  const perspRef = useRef<THREE.PerspectiveCamera>(null);
  const orbitControlsRef = useRef<OrbitControlsImpl | null>(null);
  const isoControlsRef = useRef<OrbitControlsImpl | null>(null);
  const orthoRef = useRef<THREE.OrthographicCamera>(null);

  const prevModeRef = useRef(cameraMode);
  const [transitioning, setTransitioning] = useState(false);
  const transitionRef = useRef({
    active: false,
    t: 0,
    fromPos: new THREE.Vector3(),
    fromTarget: new THREE.Vector3(),
    toPos: new THREE.Vector3(),
    toTarget: new THREE.Vector3(),
  });

  const stageCenter = getStageCenter(objects);
  const eyeY = previewEyeHeight === 'standing' ? 1.6 : 1.2;
  const previewPos = previewSource
    ? previewSource.position
    : { x: defaultPreviewPosition.x, y: eyeY, z: defaultPreviewPosition.z };
  const previewTarget = previewSource ? previewSource.lookAt : stageCenter;

  const startTransition = (toPos: THREE.Vector3, toTarget: THREE.Vector3) => {
    const cam = perspRef.current;
    const controls = orbitControlsRef.current;
    if (!cam || !controls) return;
    transitionRef.current = {
      active: true,
      t: 0,
      fromPos: cam.position.clone(),
      fromTarget: controls.target.clone(),
      toPos,
      toTarget,
    };
    setTransitioning(true);
  };

  useEffect(() => {
    const prevMode = prevModeRef.current;
    prevModeRef.current = cameraMode;
    if (prevMode === cameraMode) return;

    const perspModes: Array<typeof cameraMode> = ['orbit', 'preview'];
    if (!perspModes.includes(prevMode) || !perspModes.includes(cameraMode)) return;

    if (cameraMode === 'orbit') {
      startTransition(ORBIT_DEFAULT_POSITION.clone(), ORBIT_DEFAULT_TARGET.clone());
    } else {
      startTransition(
        new THREE.Vector3(previewPos.x, previewPos.y, previewPos.z),
        new THREE.Vector3(previewTarget.x, previewTarget.y, previewTarget.z)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraMode]);

  useEffect(() => {
    orthoRef.current?.layers.enable(HELPER_LAYER);
  }, []);

  useEffect(() => {
    if (cameraMode === 'preview') {
      perspRef.current?.layers.disable(HELPER_LAYER);
    } else {
      perspRef.current?.layers.enable(HELPER_LAYER);
    }
  }, [cameraMode]);

  useEffect(() => {
    if (cameraMode !== 'preview') return;
    startTransition(
      new THREE.Vector3(previewPos.x, previewPos.y, previewPos.z),
      new THREE.Vector3(previewTarget.x, previewTarget.y, previewTarget.z)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewSource]);

  useFrame((_, delta) => {
    const tr = transitionRef.current;
    if (!tr.active) {
      if (cameraMode === 'preview' && perspRef.current) {
        perspRef.current.position.set(previewPos.x, previewPos.y, previewPos.z);
        perspRef.current.lookAt(previewTarget.x, previewTarget.y, previewTarget.z);
      }
      return;
    }
    const cam = perspRef.current;
    const controls = orbitControlsRef.current;
    if (!cam || !controls) {
      tr.active = false;
      return;
    }
    tr.t = Math.min(1, tr.t + delta / TRANSITION_SECONDS);
    const eased = easeOutCubic(tr.t);
    cam.position.lerpVectors(tr.fromPos, tr.toPos, eased);
    const target = tr.fromTarget.clone().lerp(tr.toTarget, eased);
    cam.lookAt(target);
    controls.target.copy(target);
    if (tr.t >= 1) {
      tr.active = false;
      setTransitioning(false);
    }
  });

  const isoPosition = ISO_DIRECTION.clone().multiplyScalar(ISO_DISTANCE);
  const orbitTargetArray = useMemo<[number, number, number]>(
    () => [ORBIT_DEFAULT_TARGET.x, ORBIT_DEFAULT_TARGET.y, ORBIT_DEFAULT_TARGET.z],
    []
  );
  const isoTargetArray = useMemo<[number, number, number]>(
    () => [stageCenter.x, stageCenter.y, stageCenter.z],
    [stageCenter.x, stageCenter.y, stageCenter.z]
  );

  return (
    <>
      <PerspectiveCamera
        ref={perspRef}
        makeDefault={cameraMode !== 'iso'}
        fov={50}
        near={0.1}
        far={500}
        position={[ORBIT_DEFAULT_POSITION.x, ORBIT_DEFAULT_POSITION.y, ORBIT_DEFAULT_POSITION.z]}
      />
      <OrthographicCamera
        ref={orthoRef}
        makeDefault={cameraMode === 'iso'}
        position={[isoPosition.x, isoPosition.y, isoPosition.z]}
        zoom={40}
        near={0.1}
        far={500}
      />
      <OrbitControls
        ref={orbitControlsRef}
        makeDefault={cameraMode === 'orbit'}
        enabled={cameraMode === 'orbit' && !transitioning && !transformDragging}
        enableDamping
        dampingFactor={0.08}
        target={orbitTargetArray}
      />
      <OrbitControls
        ref={isoControlsRef}
        makeDefault={cameraMode === 'iso'}
        enabled={cameraMode === 'iso' && !transformDragging}
        enableRotate={false}
        enableDamping
        dampingFactor={0.08}
        target={isoTargetArray}
      />
    </>
  );
}
