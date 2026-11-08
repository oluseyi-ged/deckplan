import type { AnySceneObject, Vec3 } from '@/types/scene';

/** Center of the main stage's top surface, or the origin at floor level if no stage exists. */
export function getStageCenter(objects: AnySceneObject[]): Vec3 {
  const stage = objects.find((obj) => obj.type === 'stage');
  if (!stage) return { x: 0, y: 1, z: 0 };
  return {
    x: stage.position.x,
    y: stage.position.y + stage.dimensions.height,
    z: stage.position.z,
  };
}
