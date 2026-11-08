'use client';

import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import Viewport from './Viewport';
import SceneBootstrap from './SceneBootstrap';
import OnboardingTour from './OnboardingTour';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

export default function Editor() {
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-950">
      <SceneBootstrap />
      <Toolbar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Viewport />
        </div>
      </div>
      <OnboardingTour />
    </div>
  );
}
