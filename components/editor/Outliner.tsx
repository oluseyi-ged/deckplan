'use client';

import { OBJECT_REGISTRY } from '@/components/objects/registry';
import { useSceneStore } from '@/store/sceneStore';

export default function Outliner() {
  const objects = useSceneStore((s) => s.objects);
  const selectedId = useSceneStore((s) => s.selectedId);
  const selectObject = useSceneStore((s) => s.selectObject);

  return (
    <div className="p-3.5">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
        Scene
      </h2>
      {objects.length === 0 && <p className="text-xs text-neutral-600">No objects yet.</p>}
      <ul className="space-y-0.5">
        {objects.map((obj) => {
          const Icon = OBJECT_REGISTRY[obj.type].icon;
          const selected = selectedId === obj.id;
          return (
            <li key={obj.id}>
              <button
                type="button"
                onClick={() => selectObject(obj.id)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                  selected
                    ? 'bg-sky-600 text-white'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${selected ? 'text-sky-200' : 'text-neutral-500'}`}
                  strokeWidth={1.75}
                />
                <span className="truncate">{obj.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
