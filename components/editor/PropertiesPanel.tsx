'use client';

import { Copy, Trash2 } from 'lucide-react';
import { useSceneStore } from '@/store/sceneStore';
import { OBJECT_REGISTRY } from '@/components/objects/registry';
import { resolveRestingY } from '@/lib/geometry';
import NumberField from './NumberField';

export default function PropertiesPanel() {
  const selectedId = useSceneStore((s) => s.selectedId);
  const objects = useSceneStore((s) => s.objects);
  const updateObject = useSceneStore((s) => s.updateObject);
  const duplicateObject = useSceneStore((s) => s.duplicateObject);
  const removeObject = useSceneStore((s) => s.removeObject);

  const obj = objects.find((o) => o.id === selectedId);
  if (!obj) {
    return (
      <div className="border-t border-neutral-800 p-3.5">
        <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          Properties
        </h2>
        <p className="text-xs text-neutral-600">Nothing selected.</p>
      </div>
    );
  }

  const { PropertiesFields, icon: Icon, label: typeLabel } = OBJECT_REGISTRY[obj.type];

  return (
    <div className="space-y-3.5 overflow-y-auto border-t border-neutral-800 p-3.5">
      <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
        <Icon className="h-3 w-3" strokeWidth={2} />
        {typeLabel}
      </h2>

      <input
        type="text"
        value={obj.name}
        onChange={(e) => updateObject(obj.id, { name: e.target.value })}
        className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-sm text-neutral-200 outline-none focus:border-sky-600"
      />

      <div className="space-y-2">
        <NumberField
          label="X"
          value={obj.position.x}
          onChange={(x) => {
            const candidate = { ...obj, position: { ...obj.position, x } };
            updateObject(obj.id, { position: { ...candidate.position, y: resolveRestingY(objects, candidate) } });
          }}
        />
        <NumberField
          label="Z"
          value={obj.position.z}
          onChange={(z) => {
            const candidate = { ...obj, position: { ...obj.position, z } };
            updateObject(obj.id, { position: { ...candidate.position, y: resolveRestingY(objects, candidate) } });
          }}
        />
        <NumberField
          label="Height offset"
          value={obj.position.y}
          onChange={(y) => updateObject(obj.id, { position: { ...obj.position, y } })}
        />
        <NumberField
          label="Rotation"
          value={obj.rotationY}
          step={15}
          onChange={(rotationY) => updateObject(obj.id, { rotationY: ((rotationY % 360) + 360) % 360 })}
        />
      </div>

      <div className="space-y-2 border-t border-neutral-800 pt-3">
        <NumberField
          label="Width"
          value={obj.dimensions.width}
          min={0.1}
          onChange={(width) => updateObject(obj.id, { dimensions: { ...obj.dimensions, width } })}
        />
        <NumberField
          label="Depth"
          value={obj.dimensions.depth}
          min={0.1}
          onChange={(depth) => updateObject(obj.id, { dimensions: { ...obj.dimensions, depth } })}
        />
        <NumberField
          label="Height"
          value={obj.dimensions.height}
          min={0.1}
          onChange={(height) => updateObject(obj.id, { dimensions: { ...obj.dimensions, height } })}
        />
        <label className="flex items-center justify-between text-xs text-neutral-400">
          Color
          <input
            type="color"
            value={obj.color}
            onChange={(e) => updateObject(obj.id, { color: e.target.value })}
            className="h-6 w-10 rounded border border-neutral-700 bg-neutral-800"
          />
        </label>
      </div>

      {PropertiesFields && (
        <div className="border-t border-neutral-800 pt-3">
          <PropertiesFields
            obj={obj as never}
            onPropsChange={(patch) => updateObject(obj.id, { props: patch })}
          />
        </div>
      )}

      <div className="flex gap-2 border-t border-neutral-800 pt-3">
        <button
          type="button"
          onClick={() => duplicateObject(obj.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-neutral-800 px-2 py-1.5 text-xs text-neutral-200 transition-colors hover:bg-neutral-700"
        >
          <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
          Duplicate
        </button>
        <button
          type="button"
          onClick={() => removeObject(obj.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-red-950/60 px-2 py-1.5 text-xs text-red-300 transition-colors hover:bg-red-900/60"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          Delete
        </button>
      </div>
    </div>
  );
}
