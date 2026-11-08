'use client';

import { Info } from 'lucide-react';
import type { ObjectCategory } from '@/components/objects/registry';
import { CATEGORY_ICON, OBJECT_REGISTRY, OBJECT_TYPES } from '@/components/objects/registry';
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
    <div data-tour="add-object" className="max-h-[48vh] overflow-y-auto border-b border-neutral-800 p-3.5">
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
        Add object
      </h2>

      {selectedIsTruss && (
        <div className="mb-3 flex items-start gap-1.5 rounded-md border border-sky-900/60 bg-sky-500/10 px-2.5 py-2 text-[11px] leading-snug text-sky-300">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <span>Truss selected — LED walls and moving heads will hang below it.</span>
        </div>
      )}

      <div className="space-y-4">
        {CATEGORY_ORDER.map((category) => {
          const types = OBJECT_TYPES.filter((type) => OBJECT_REGISTRY[type].category === category);
          if (types.length === 0) return null;
          const CategoryIcon = CATEGORY_ICON[category];
          return (
            <div key={category}>
              <h3 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                <CategoryIcon className="h-3 w-3" strokeWidth={2} />
                {CATEGORY_LABELS[category]}
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {types.map((type) => {
                  const { label, icon: Icon } = OBJECT_REGISTRY[type];
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => addObject(type)}
                      className="flex items-center gap-1.5 rounded-md border border-neutral-800 bg-panel-raised px-2 py-1.5 text-left text-xs text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-100"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-neutral-500" strokeWidth={1.75} />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
