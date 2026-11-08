'use client';

import * as THREE from 'three';
import type { Object3D } from 'three';
import type { PlacedCameraProps, PlacedCameraType, SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';
import IconBillboard from './IconBillboard';
import NumberField from '@/components/editor/NumberField';
import { useSceneStore } from '@/store/sceneStore';
import { getStageCenter } from '@/lib/stageCenter';
import { HELPER_LAYER } from '@/lib/layers';

function markAsHelper(node: Object3D | null) {
  node?.traverse((child) => child.layers.set(HELPER_LAYER));
}

const FOV_CONE_LENGTH = 4;

const RIG_ICON: Partial<Record<PlacedCameraType, string>> = {
  static: '/icons/camera-static.png',
  jib: '/icons/camera-jib.png',
};

function CameraBody({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.18, 0.18, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow position={[0, 0, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.14, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
}

export default function PlacedCameraObject({ obj }: { obj: SceneObject<'placedCamera'> }) {
  const { height } = obj.dimensions;
  const { cameraType, fov, jibHeight } = obj.props;
  const fovRadius = FOV_CONE_LENGTH * Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const headY = height / 2 - 0.15;
  const icon = RIG_ICON[cameraType];

  return (
    <ObjectShell obj={obj}>
      <group ref={markAsHelper}>
        {icon ? (
          <IconBillboard src={icon} height={height} y={0} />
        ) : (
          <group position={[0, headY, 0]}>
            <CameraBody color={obj.color} />
          </group>
        )}
        <mesh
          position={[0, cameraType === 'jib' ? jibHeight - height / 2 : headY, -0.3 - FOV_CONE_LENGTH / 2]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[fovRadius, FOV_CONE_LENGTH, 20, 1, true]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </ObjectShell>
  );
}

const CAMERA_TYPES: { type: PlacedCameraType; label: string }[] = [
  { type: 'static', label: 'Static' },
  { type: 'ptz', label: 'PTZ' },
  { type: 'jib', label: 'Crane (Jib)' },
];

export function PlacedCameraFields({
  obj,
  onPropsChange,
}: {
  obj: SceneObject<'placedCamera'>;
  onPropsChange: (patch: Partial<PlacedCameraProps>) => void;
}) {
  const objects = useSceneStore((s) => s.objects);
  const setPreviewSource = useSceneStore((s) => s.setPreviewSource);
  const setCameraMode = useSceneStore((s) => s.setCameraMode);
  const { cameraType, fov, jibHeight, jibReach } = obj.props;

  const handlePreview = () => {
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      THREE.MathUtils.degToRad(obj.rotationY)
    );
    const eyeY =
      cameraType === 'jib' ? obj.position.y + jibHeight : obj.position.y + obj.dimensions.height * 0.85;
    const eyeX = obj.position.x + (cameraType === 'jib' ? forward.x * -jibReach : 0);
    const eyeZ = obj.position.z + (cameraType === 'jib' ? forward.z * -jibReach : 0);
    const stageCenter = getStageCenter(objects);
    const lookAt =
      cameraType === 'ptz'
        ? stageCenter
        : { x: eyeX + forward.x * 20, y: eyeY + forward.y * 20, z: eyeZ + forward.z * 20 };
    setPreviewSource({ position: { x: eyeX, y: eyeY, z: eyeZ }, lookAt });
    setCameraMode('preview');
  };

  return (
    <div className="space-y-2">
      <div>
        <span className="mb-1 block text-xs text-neutral-400">Type</span>
        <div className="grid grid-cols-3 gap-1">
          {CAMERA_TYPES.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => onPropsChange({ cameraType: type })}
              className={`rounded px-1.5 py-1 text-[11px] transition-colors ${
                cameraType === type
                  ? 'bg-sky-700 text-white'
                  : 'border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <NumberField label="FOV" value={fov} step={1} min={5} onChange={(v) => onPropsChange({ fov: v })} />
      {cameraType === 'jib' && (
        <>
          <NumberField
            label="Jib height"
            value={jibHeight}
            step={0.1}
            min={0.5}
            onChange={(v) => onPropsChange({ jibHeight: v })}
          />
          <NumberField
            label="Jib reach"
            value={jibReach}
            step={0.1}
            min={0}
            onChange={(v) => onPropsChange({ jibReach: v })}
          />
        </>
      )}
      <button
        type="button"
        onClick={handlePreview}
        className="w-full rounded bg-sky-800 px-2 py-1.5 text-xs text-sky-100 hover:bg-sky-700"
      >
        Preview this camera
      </button>
    </div>
  );
}
