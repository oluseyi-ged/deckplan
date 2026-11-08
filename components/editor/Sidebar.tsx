'use client';

import AddObjectPalette from './AddObjectPalette';
import Outliner from './Outliner';
import PropertiesPanel from './PropertiesPanel';
import ShortcutsPanel from './ShortcutsPanel';

export default function Sidebar() {
  return (
    <div className="flex h-full w-72 flex-col border-r border-neutral-800 bg-panel">
      <AddObjectPalette />
      <div data-tour="outliner" className="max-h-44 overflow-y-auto">
        <Outliner />
      </div>
      <div data-tour="properties" className="min-h-0 flex-1 overflow-y-auto">
        <PropertiesPanel />
      </div>
      <div data-tour="shortcuts">
        <ShortcutsPanel />
      </div>
    </div>
  );
}
