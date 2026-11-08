'use client';

import { useEffect } from 'react';
import { useSceneStore } from '@/store/sceneStore';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
}

export function useKeyboardShortcuts() {
  const selectedId = useSceneStore((s) => s.selectedId);
  const selectObject = useSceneStore((s) => s.selectObject);
  const setTransformMode = useSceneStore((s) => s.setTransformMode);
  const removeObject = useSceneStore((s) => s.removeObject);
  const duplicateObject = useSceneStore((s) => s.duplicateObject);
  const undo = useSceneStore((s) => s.undo);
  const redo = useSceneStore((s) => s.redo);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;
      const cmd = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (e.key === 'Escape') {
        selectObject(null);
      } else if (!cmd && key === 'w') {
        setTransformMode('translate');
      } else if (!cmd && key === 'e') {
        setTransformMode('rotate');
      } else if (!cmd && key === 'q') {
        setTransformMode('translateY');
      } else if (!cmd && (e.key === 'Delete' || e.key === 'Backspace')) {
        if (selectedId) {
          e.preventDefault();
          removeObject(selectedId);
        }
      } else if (cmd && key === 'd') {
        if (selectedId) {
          e.preventDefault();
          duplicateObject(selectedId);
        }
      } else if (cmd && e.shiftKey && key === 'z') {
        e.preventDefault();
        redo();
      } else if (cmd && key === 'z') {
        e.preventDefault();
        undo();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectObject, setTransformMode, removeObject, duplicateObject, undo, redo]);
}
