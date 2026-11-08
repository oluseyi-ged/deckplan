export type TourPlacement = 'right' | 'below' | 'top-center';

export type TourStep = {
  target: string;
  title: string;
  body: string;
  placement: TourPlacement;
};

export const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="camera-modes"]',
    title: 'See it from every angle',
    body: 'Switch between Orbit, Isometric, and Preview to check your layout.',
    placement: 'below',
  },
  {
    target: '[data-tour="add-object"]',
    title: 'Build your rig',
    body: 'Add stages, rigging, AV gear, people, and cameras — grouped by category.',
    placement: 'right',
  },
  {
    target: '[data-tour="outliner"]',
    title: 'Everything in one list',
    body: 'Every object in the scene. Click a row to select it.',
    placement: 'right',
  },
  {
    target: '[data-tour="properties"]',
    title: 'Dial it in',
    body: 'Position, size, color, and type-specific details for whatever is selected.',
    placement: 'right',
  },
  {
    target: '[data-tour="shortcuts"]',
    title: 'Keep moving fast',
    body: 'Keyboard shortcuts live here — click to expand any time.',
    placement: 'right',
  },
  {
    target: '[data-tour="viewport"]',
    title: 'Now place things',
    body: 'Drag objects right in the scene, or use the gizmo to move, raise, and rotate them.',
    placement: 'top-center',
  },
];

export const TOUR_STORAGE_KEY = 'deckplan.onboarded';
