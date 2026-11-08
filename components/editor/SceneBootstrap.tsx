'use client';

import { useEffect, useRef } from 'react';
import { useSceneStore } from '@/store/sceneStore';
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/persistence';
import { createStarterScene } from '@/lib/starterScene';

export default function SceneBootstrap() {
  const loadScene = useSceneStore((s) => s.loadScene);
  const objects = useSceneStore((s) => s.objects);
  const bootstrapped = useRef(false);

  useEffect(() => {
    bootstrapped.current = true;
    const saved = loadFromLocalStorage();
    loadScene(saved && saved.length > 0 ? saved : createStarterScene());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!bootstrapped.current) return;
    const timeout = setTimeout(() => saveToLocalStorage(objects), 500);
    return () => clearTimeout(timeout);
  }, [objects]);

  return null;
}
