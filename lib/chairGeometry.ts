import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const SEAT_BLOCK_HEIGHT = 0.45;
const BACK_HEIGHT = 0.45;
const BACK_THICKNESS = 0.05;

/** A simple chair silhouette (seat block + backrest), bottom-aligned at local y=0. */
export function createChairGeometry(seatWidth: number, seatDepth: number): THREE.BufferGeometry {
  const seat = new THREE.BoxGeometry(seatWidth, SEAT_BLOCK_HEIGHT, seatDepth);
  seat.translate(0, SEAT_BLOCK_HEIGHT / 2, 0);

  const back = new THREE.BoxGeometry(seatWidth, BACK_HEIGHT, BACK_THICKNESS);
  back.translate(0, SEAT_BLOCK_HEIGHT + BACK_HEIGHT / 2, -seatDepth / 2 + BACK_THICKNESS / 2);

  const merged = mergeGeometries([seat, back]);
  seat.dispose();
  back.dispose();
  return merged ?? seat;
}
