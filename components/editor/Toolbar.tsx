'use client';

import { useRef } from 'react';
import type { CameraMode, TransformMode } from '@/types/scene';
import { useSceneStore } from '@/store/sceneStore';
import { exportSceneJson, parseSceneJson } from '@/lib/persistence';
import { createStarterScene } from '@/lib/starterScene';
import { captureScreenshot } from '@/lib/screenshot';

const CAMERA_MODES: { mode: CameraMode; label: string }[] = [
  { mode: 'orbit', label: 'Orbit' },
  { mode: 'iso', label: 'Isometric' },
  { mode: 'preview', label: 'Preview' },
];

const TRANSFORM_MODES: { mode: TransformMode; label: string }[] = [
  { mode: 'translate', label: 'Move' },
  { mode: 'translateY', label: 'Height' },
  { mode: 'rotate', label: 'Rotate' },
];

export default function Toolbar() {
  const cameraMode = useSceneStore((s) => s.cameraMode);
  const setCameraMode = useSceneStore((s) => s.setCameraMode);
  const transformMode = useSceneStore((s) => s.transformMode);
  const setTransformMode = useSceneStore((s) => s.setTransformMode);
  const snap = useSceneStore((s) => s.snap);
  const setSnap = useSceneStore((s) => s.setSnap);
  const previewEyeHeight = useSceneStore((s) => s.previewEyeHeight);
  const setPreviewEyeHeight = useSceneStore((s) => s.setPreviewEyeHeight);
  const viewportBackground = useSceneStore((s) => s.viewportBackground);
  const setViewportBackground = useSceneStore((s) => s.setViewportBackground);
  const floorColor = useSceneStore((s) => s.floorColor);
  const setFloorColor = useSceneStore((s) => s.setFloorColor);
  const objects = useSceneStore((s) => s.objects);
  const loadScene = useSceneStore((s) => s.loadScene);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewScene = () => {
    if (window.confirm('Start a new scene? This replaces the current layout.')) {
      loadScene(createStarterScene());
    }
  };

  const handleExport = () => {
    const blob = new Blob([exportSceneJson(objects)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deckplan-scene.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File) => {
    const text = await file.text();
    const imported = parseSceneJson(text);
    if (!imported) {
      window.alert('That file is not a valid DeckPlan scene.');
      return;
    }
    loadScene(imported);
  };

  return (
    <div className="flex h-12 items-center gap-2 border-b border-neutral-800 bg-neutral-900 px-4">
      <span className="text-sm font-medium text-neutral-400">DeckPlan</span>

      <div className="ml-6 flex gap-1 rounded-md bg-neutral-800 p-1">
        {CAMERA_MODES.map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            onClick={() => setCameraMode(mode)}
            className={`rounded px-3 py-1 text-sm transition-colors ${
              cameraMode === mode
                ? 'bg-neutral-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {cameraMode === 'preview' && (
        <div className="ml-2 flex gap-1 rounded-md bg-neutral-800 p-1">
          {(['seated', 'standing'] as const).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setPreviewEyeHeight(h)}
              className={`rounded px-3 py-1 text-sm capitalize transition-colors ${
                previewEyeHeight === h
                  ? 'bg-neutral-600 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      )}

      <div className="ml-2 flex gap-1 rounded-md bg-neutral-800 p-1">
        {TRANSFORM_MODES.map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            onClick={() => setTransformMode(mode)}
            className={`rounded px-3 py-1 text-sm transition-colors ${
              transformMode === mode
                ? 'bg-neutral-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="ml-2 flex items-center gap-2 rounded-md bg-neutral-800 px-2 py-1">
        <label className="flex items-center gap-1.5 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={snap.enabled}
            onChange={(e) => setSnap({ enabled: e.target.checked })}
            className="accent-sky-600"
          />
          Snap
        </label>
        <input
          type="number"
          step={0.1}
          min={0}
          value={snap.positionStep}
          onChange={(e) => setSnap({ positionStep: Number(e.target.value) })}
          title="Position snap (m)"
          className="w-14 rounded bg-neutral-900 px-1 py-0.5 text-xs text-neutral-200"
        />
        <input
          type="number"
          step={1}
          min={0}
          value={snap.rotationStepDeg}
          onChange={(e) => setSnap({ rotationStepDeg: Number(e.target.value) })}
          title="Rotation snap (deg)"
          className="w-14 rounded bg-neutral-900 px-1 py-0.5 text-xs text-neutral-200"
        />
      </div>

      <div className="ml-2 flex items-center gap-2 rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-400">
        <label className="flex items-center gap-1.5">
          Background
          <input
            type="color"
            value={viewportBackground}
            onChange={(e) => setViewportBackground(e.target.value)}
            className="h-6 w-8 rounded border border-neutral-700 bg-neutral-900"
          />
        </label>
        <label className="flex items-center gap-1.5">
          Floor
          <input
            type="color"
            value={floorColor}
            onChange={(e) => setFloorColor(e.target.value)}
            className="h-6 w-8 rounded border border-neutral-700 bg-neutral-900"
          />
        </label>
      </div>

      <div className="ml-auto flex gap-1">
        <button
          type="button"
          onClick={handleNewScene}
          className="rounded px-3 py-1 text-sm text-neutral-400 hover:text-white"
        >
          New
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="rounded px-3 py-1 text-sm text-neutral-400 hover:text-white"
        >
          Export
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded px-3 py-1 text-sm text-neutral-400 hover:text-white"
        >
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportFile(file);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => captureScreenshot()}
          className="rounded px-3 py-1 text-sm text-neutral-400 hover:text-white"
        >
          Screenshot
        </button>
      </div>
    </div>
  );
}
