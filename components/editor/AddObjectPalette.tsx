'use client';

import type { ObjectCategory } from '@/components/objects/registry';
import { OBJECT_REGISTRY, OBJECT_TYPES } from '@/components/objects/registry';
import { useSceneStore } from '@/store/sceneStore';

const CATEGORY_LABELS: Record<ObjectCategory, string> = {
  structure: 'Structure',
  av: 'AV & Backline',
  people: 'People',
  lighting: 'Lighting',
  camera: 'Camera',
};

const CATEGORY_ORDER: ObjectCategory[] = ['structure', 'av', 'people', 'lighting', 'camera'];

export default function AddObjectPalette() {
  const addObject = useSceneStore((s) => s.addObject);
  const selectedId = useSceneStore((s) => s.selectedId);
  const objects = useSceneStore((s) => s.objects);
  const selectedIsTruss = objects.find((o) => o.id === selectedId)?.type === 'trussSegment';

  return (
    <div className="max-h-[45vh] overflow-y-auto border-b border-neutral-800 p-3">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Add object
      </h2>
      {selectedIsTruss && (
        <p className="mb-2 text-xs text-sky-400">
          Truss selected — LED walls and moving heads will hang below it.
        </p>
      )}
      <div className="space-y-3">
        {CATEGORY_ORDER.map((category) => {
          const types = OBJECT_TYPES.filter((type) => OBJECT_REGISTRY[type].category === category);
          if (types.length === 0) return null;
          return (
            <div key={category}>
              <h3 className="mb-1 text-[10px] font-medium uppercase tracking-wide text-neutral-600">
                {CATEGORY_LABELS[category]}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addObject(type)}
                    className="rounded border border-neutral-700 bg-neutral-800 px-2 py-2 text-left text-xs text-neutral-200 hover:bg-neutral-700"
                  >
                    {OBJECT_REGISTRY[type].label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
