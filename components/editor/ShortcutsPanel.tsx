'use client';

import { useState } from 'react';
import { ChevronDown, Keyboard } from 'lucide-react';

const SHORTCUTS: { keys: string[]; action: string }[] = [
  { keys: ['W'], action: 'Move' },
  { keys: ['Q'], action: 'Height' },
  { keys: ['E'], action: 'Rotate' },
  { keys: ['Delete'], action: 'Delete selection' },
  { keys: ['⌘', 'D'], action: 'Duplicate' },
  { keys: ['⌘', 'Z'], action: 'Undo' },
  { keys: ['⌘', '⇧', 'Z'], action: 'Redo' },
  { keys: ['Esc'], action: 'Deselect' },
];

function KeyBadge({ label }: { label: string }) {
  return (
    <kbd className="flex h-5 min-w-5 items-center justify-center rounded border border-neutral-700 bg-neutral-900 px-1 font-sans text-[10px] font-medium text-neutral-300">
      {label}
    </kbd>
  );
}

export default function ShortcutsPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-neutral-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3.5 py-2.5 text-left"
      >
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          <Keyboard className="h-3 w-3" strokeWidth={2} />
          Shortcuts
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-neutral-600 transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>
      {open && (
        <ul className="space-y-1.5 px-3.5 pb-3">
          {SHORTCUTS.map(({ keys, action }) => (
            <li key={action} className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">{action}</span>
              <span className="flex items-center gap-0.5">
                {keys.map((k) => (
                  <KeyBadge key={k} label={k} />
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
