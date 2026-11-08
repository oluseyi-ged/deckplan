'use client';

import AddObjectPalette from './AddObjectPalette';
import Outliner from './Outliner';
import PropertiesPanel from './PropertiesPanel';

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-neutral-800 bg-neutral-900">
      <AddObjectPalette />
      <div className="max-h-48 overflow-y-auto">
        <Outliner />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PropertiesPanel />
      </div>
    </div>
  );
}
