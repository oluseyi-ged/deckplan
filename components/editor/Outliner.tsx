'use client';

import { useSceneStore } from '@/store/sceneStore';

export default function Outliner() {
  const objects = useSceneStore((s) => s.objects);
  const selectedId = useSceneStore((s) => s.selectedId);
  const selectObject = useSceneStore((s) => s.selectObject);

  return (
    <div className="p-3">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Scene
      </h2>
      {objects.length === 0 && (
        <p className="text-xs text-neutral-600">No objects yet.</p>
      )}
      <ul className="space-y-1">
        {objects.map((obj) => (
          <li key={obj.id}>
            <button
              type="button"
              onClick={() => selectObject(obj.id)}
              className={`w-full rounded px-2 py-1.5 text-left text-xs ${
                selectedId === obj.id
                  ? 'bg-sky-700 text-white'
                  : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              {obj.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
