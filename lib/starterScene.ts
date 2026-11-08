import type { AnySceneObject } from '@/types/scene';
import { createSceneObject } from './createSceneObject';
import { findSupportY } from './geometry';

export function createStarterScene(): AnySceneObject[] {
  const stage = createSceneObject('stage', { x: 0, y: 0, z: 0 });

  const riser = createSceneObject('drumRiser', { x: 3, y: 0, z: -2 });
  riser.position.y = findSupportY([stage], riser);

  const ledWall = createSceneObject('ledWall', { x: 0, y: 0, z: -5.5 });

  const seatingLeft = createSceneObject('seatingSection', { x: -4, y: 0, z: 7.5 }, 'Seating Section L');
  const seatingRight = createSceneObject('seatingSection', { x: 4, y: 0, z: 7.5 }, 'Seating Section R');

  return [stage, riser, ledWall, seatingLeft, seatingRight];
}
