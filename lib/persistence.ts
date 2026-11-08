import type { AnySceneObject } from '@/types/scene';

const STORAGE_KEY = 'deckplan.scene.v1';

type SerializedScene = { version: 1; objects: unknown };

function isVec3(v: unknown): boolean {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.x === 'number' && typeof o.y === 'number' && typeof o.z === 'number';
}

function isDimensions(v: unknown): boolean {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.width === 'number' && typeof o.depth === 'number' && typeof o.height === 'number';
}

function isSceneObject(v: unknown): v is AnySceneObject {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.type === 'string' &&
    typeof o.name === 'string' &&
    typeof o.rotationY === 'number' &&
    typeof o.color === 'string' &&
    isVec3(o.position) &&
    isDimensions(o.dimensions) &&
    typeof o.props === 'object' &&
    o.props !== null
  );
}

function extractObjects(raw: string): AnySceneObject[] | null {
  let parsed: SerializedScene;
  try {
    parsed = JSON.parse(raw) as SerializedScene;
  } catch {
    return null;
  }
  if (!Array.isArray(parsed.objects)) return null;
  return parsed.objects.filter(isSceneObject);
}

export function saveToLocalStorage(objects: AnySceneObject[]): void {
  try {
    const payload: { version: 1; objects: AnySceneObject[] } = { version: 1, objects };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Autosave is best-effort; private browsing or quota limits shouldn't break the editor.
  }
}

export function loadFromLocalStorage(): AnySceneObject[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? extractObjects(raw) : null;
  } catch {
    return null;
  }
}

export function exportSceneJson(objects: AnySceneObject[]): string {
  return JSON.stringify({ version: 1, objects }, null, 2);
}

export function parseSceneJson(raw: string): AnySceneObject[] | null {
  return extractObjects(raw);
}
