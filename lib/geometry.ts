import type { AnySceneObject, ObjectType, Vec3 } from '@/types/scene';

type Aabb = { minX: number; maxX: number; minZ: number; maxZ: number };

export const RIGGABLE_TYPES: ObjectType[] = ['ledWall', 'movingHeadLight', 'monitor'];

/** Axis-aligned bounding box of the object's footprint, conservative under Y rotation. */
export function getFootprint(obj: AnySceneObject): Aabb {
  const { width, depth } = obj.dimensions;
  const rad = (obj.rotationY * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const halfW = (width * cos + depth * sin) / 2;
  const halfD = (width * sin + depth * cos) / 2;
  return {
    minX: obj.position.x - halfW,
    maxX: obj.position.x + halfW,
    minZ: obj.position.z - halfD,
    maxZ: obj.position.z + halfD,
  };
}

function aabbOverlap(a: Aabb, b: Aabb): boolean {
  return a.minX < b.maxX && a.maxX > b.minX && a.minZ < b.maxZ && a.maxZ > b.minZ;
}

/** Top surface height (world Y) of the highest stage-like object under the candidate's footprint, else 0 (floor). */
export function findSupportY(objects: AnySceneObject[], candidate: AnySceneObject): number {
  const footprint = getFootprint(candidate);
  let supportY = 0;
  for (const obj of objects) {
    if (obj.id === candidate.id || obj.type !== 'stage') continue;
    if (aabbOverlap(footprint, getFootprint(obj))) {
      const topY = obj.position.y + obj.dimensions.height;
      if (topY > supportY) supportY = topY;
    }
  }
  return supportY;
}

/** Bottom-center Y for an object of the given height hanging with its top flush against a truss's underside. */
export function findHangY(truss: AnySceneObject, objectHeight: number): number {
  return Math.max(0, truss.position.y - objectHeight);
}

/**
 * Resting Y for an object at its current X/Z: for riggable types (LED walls, moving heads,
 * monitors) hanging below the lowest overlapping truss, otherwise standing on the highest
 * overlapping stage (or the floor).
 */
export function resolveRestingY(objects: AnySceneObject[], candidate: AnySceneObject): number {
  if (RIGGABLE_TYPES.includes(candidate.type)) {
    const footprint = getFootprint(candidate);
    let lowestTruss: AnySceneObject | null = null;
    for (const obj of objects) {
      if (obj.id === candidate.id || obj.type !== 'trussSegment') continue;
      if (aabbOverlap(footprint, getFootprint(obj)) && (!lowestTruss || obj.position.y < lowestTruss.position.y)) {
        lowestTruss = obj;
      }
    }
    if (lowestTruss) return findHangY(lowestTruss, candidate.dimensions.height);
  }
  return findSupportY(objects, candidate);
}

/**
 * Finds a free X/Z slot along a truss's length for a new fixture, spreading outward from
 * the truss's center so fixtures rigged on the same truss land side by side instead of
 * stacked on top of each other.
 */
export function findRigSlot(
  objects: AnySceneObject[],
  truss: AnySceneObject,
  dimensions: { width: number; depth: number }
): { x: number; z: number } {
  const rad = (truss.rotationY * Math.PI) / 180;
  const dirX = Math.cos(rad);
  const dirZ = Math.sin(rad);
  const halfLength = truss.dimensions.width / 2;
  const step = Math.max(0.3, dimensions.width);

  const candidateAt = (offset: number) => ({
    x: truss.position.x + dirX * offset,
    z: truss.position.z + dirZ * offset,
  });
  const fits = (offset: number) => {
    const { x, z } = candidateAt(offset);
    const fp: Aabb = {
      minX: x - dimensions.width / 2,
      maxX: x + dimensions.width / 2,
      minZ: z - dimensions.depth / 2,
      maxZ: z + dimensions.depth / 2,
    };
    return objects.every((obj) => obj.type === 'trussSegment' || !aabbOverlap(fp, getFootprint(obj)));
  };

  if (fits(0)) return candidateAt(0);
  for (let offset = step; offset <= halfLength; offset += step) {
    if (fits(offset)) return candidateAt(offset);
    if (fits(-offset)) return candidateAt(-offset);
  }
  return candidateAt(0);
}

/** Converts a bottom-center scene position to a Three.js center-origin render position. */
export function toRenderPosition(obj: AnySceneObject): Vec3 {
  return {
    x: obj.position.x,
    y: obj.position.y + obj.dimensions.height / 2,
    z: obj.position.z,
  };
}

/** Finds an unoccupied spot near the origin for a new object, spiraling outward on a grid. */
export function findPlacementPosition(
  objects: AnySceneObject[],
  dimensions: { width: number; depth: number }
): { x: number; z: number } {
  const step = 1;
  const maxRings = 20;
  const candidateFootprint = (x: number, z: number): Aabb => ({
    minX: x - dimensions.width / 2,
    maxX: x + dimensions.width / 2,
    minZ: z - dimensions.depth / 2,
    maxZ: z + dimensions.depth / 2,
  });
  const fits = (x: number, z: number) => {
    const fp = candidateFootprint(x, z);
    return objects.every((obj) => !aabbOverlap(fp, getFootprint(obj)));
  };

  if (fits(0, 0)) return { x: 0, z: 0 };

  for (let ring = 1; ring <= maxRings; ring++) {
    const r = ring * step * Math.max(dimensions.width, dimensions.depth);
    const points = 8 * ring;
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const x = Math.round(Math.cos(angle) * r * 2) / 2;
      const z = Math.round(Math.sin(angle) * r * 2) / 2;
      if (fits(x, z)) return { x, z };
    }
  }
  return { x: 0, z: 0 };
}
