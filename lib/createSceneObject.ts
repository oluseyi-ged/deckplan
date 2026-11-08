import type { AnySceneObject, ObjectType, Vec3 } from '@/types/scene';
import { OBJECT_REGISTRY } from '@/components/objects/registry';
import { createId } from './id';

export function createSceneObject(type: ObjectType, position: Vec3, nameOverride?: string): AnySceneObject {
  const def = OBJECT_REGISTRY[type];
  return {
    id: createId(),
    type,
    name: nameOverride ?? def.label,
    position,
    rotationY: 0,
    dimensions: { ...def.defaultDimensions },
    color: def.defaultColor,
    props: { ...def.defaultProps },
  };
}
