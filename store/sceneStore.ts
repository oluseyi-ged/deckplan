import { create } from 'zustand';
import type {
  AnySceneObject,
  CameraMode,
  ObjectType,
  PreviewEyeHeight,
  PreviewSource,
  SnapSettings,
  TransformMode,
  Vec3,
} from '@/types/scene';
import { DEFAULT_SNAP_POSITION_STEP, DEFAULT_SNAP_ROTATION_STEP_DEG } from '@/lib/units';
import { createId } from '@/lib/id';
import { findHangY, findPlacementPosition, findRigSlot, resolveRestingY, RIGGABLE_TYPES } from '@/lib/geometry';
import { createSceneObject } from '@/lib/createSceneObject';
import { OBJECT_REGISTRY } from '@/components/objects/registry';

const DEFAULT_RIG_HEIGHT = 7;

const HISTORY_LIMIT = 50;

type SceneState = {
  objects: AnySceneObject[];
  selectedId: string | null;
  cameraMode: CameraMode;
  transformMode: TransformMode;
  snap: SnapSettings;
  defaultPreviewPosition: Vec3;
  previewEyeHeight: PreviewEyeHeight;
  previewSource: PreviewSource | null;
  viewportBackground: string;
  floorColor: string;
  history: { past: AnySceneObject[][]; future: AnySceneObject[][] };

  addObject: (type: ObjectType) => void;
  updateObject: (
    id: string,
    patch: Partial<Omit<AnySceneObject, 'id' | 'type' | 'props'>> & { props?: Partial<Record<string, unknown>> }
  ) => void;
  updateObjectTransient: (id: string, patch: Partial<Pick<AnySceneObject, 'position' | 'rotationY'>>) => void;
  beginHistoryCheckpoint: () => void;
  transformDragging: boolean;
  setTransformDragging: (dragging: boolean) => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  setTransformMode: (mode: TransformMode) => void;
  setSnap: (snap: Partial<SnapSettings>) => void;
  setPreviewEyeHeight: (eyeHeight: PreviewEyeHeight) => void;
  setPreviewSource: (source: PreviewSource) => void;
  setViewportBackground: (color: string) => void;
  setFloorColor: (color: string) => void;
  loadScene: (objects: AnySceneObject[]) => void;
  undo: () => void;
  redo: () => void;
};

function commit(state: SceneState, nextObjects: AnySceneObject[]): Pick<SceneState, 'objects' | 'history'> {
  const past = [...state.history.past, state.objects].slice(-HISTORY_LIMIT);
  return { objects: nextObjects, history: { past, future: [] } };
}

export const useSceneStore = create<SceneState>((set, get) => ({
  objects: [],
  selectedId: null,
  cameraMode: 'orbit',
  transformMode: 'translate',
  snap: {
    enabled: true,
    positionStep: DEFAULT_SNAP_POSITION_STEP,
    rotationStepDeg: DEFAULT_SNAP_ROTATION_STEP_DEG,
  },
  defaultPreviewPosition: { x: 0, y: 0, z: 14 },
  previewEyeHeight: 'seated',
  previewSource: null,
  viewportBackground: '#ffffff',
  floorColor: '#d4d4d4',
  transformDragging: false,
  history: { past: [], future: [] },

  addObject: (type) => {
    const state = get();
    const def = OBJECT_REGISTRY[type];
    const selected = state.objects.find((o) => o.id === state.selectedId);

    if (RIGGABLE_TYPES.includes(type) && selected?.type === 'trussSegment') {
      const { x, z } = findRigSlot(state.objects, selected, def.defaultDimensions);
      const draft = createSceneObject(type, { x, y: 0, z });
      draft.position.y = findHangY(selected, draft.dimensions.height);
      set((s) => ({ ...commit(s, [...s.objects, draft]), selectedId: draft.id }));
      return;
    }

    const { x, z } = findPlacementPosition(state.objects, def.defaultDimensions);
    const draft = createSceneObject(type, { x, y: 0, z });
    draft.position.y = type === 'trussSegment' ? DEFAULT_RIG_HEIGHT : resolveRestingY(state.objects, draft);
    set((s) => ({ ...commit(s, [...s.objects, draft]), selectedId: draft.id }));
  },

  updateObject: (id, patch) => {
    set((s) => ({
      ...commit(
        s,
        s.objects.map((obj) => {
          if (obj.id !== id) return obj;
          const props = patch.props ? ({ ...obj.props, ...patch.props } as typeof obj.props) : obj.props;
          const derived = patch.props ? OBJECT_REGISTRY[obj.type].deriveDimensions?.(props as never) : undefined;
          return {
            ...obj,
            ...patch,
            props,
            dimensions: { ...obj.dimensions, ...patch.dimensions, ...derived },
          };
        })
      ),
    }));
  },

  updateObjectTransient: (id, patch) => {
    set((s) => ({
      objects: s.objects.map((obj) => (obj.id === id ? { ...obj, ...patch } : obj)),
    }));
  },

  beginHistoryCheckpoint: () => {
    set((s) => ({ history: { past: [...s.history.past, s.objects].slice(-HISTORY_LIMIT), future: [] } }));
  },

  setTransformDragging: (dragging) => set({ transformDragging: dragging }),

  removeObject: (id) => {
    set((s) => ({
      ...commit(s, s.objects.filter((obj) => obj.id !== id)),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
  },

  duplicateObject: (id) => {
    const state = get();
    const source = state.objects.find((obj) => obj.id === id);
    if (!source) return;
    const { x, z } = findPlacementPosition(state.objects, source.dimensions);
    const copy: AnySceneObject = {
      ...source,
      id: createId(),
      name: `${source.name} copy`,
      position: { ...source.position, x, z },
    };
    set((s) => ({ ...commit(s, [...s.objects, copy]), selectedId: copy.id }));
  },

  selectObject: (id) => set({ selectedId: id }),
  setCameraMode: (mode) => set((s) => ({ cameraMode: mode, selectedId: mode === 'preview' ? null : s.selectedId })),
  setTransformMode: (mode) => set({ transformMode: mode }),
  setSnap: (snap) => set((s) => ({ snap: { ...s.snap, ...snap } })),
  setPreviewEyeHeight: (eyeHeight) => set({ previewEyeHeight: eyeHeight }),
  setPreviewSource: (source) => set({ previewSource: source }),
  setViewportBackground: (color) => set({ viewportBackground: color }),
  setFloorColor: (color) => set({ floorColor: color }),

  loadScene: (objects) => set({ objects, selectedId: null, history: { past: [], future: [] } }),

  undo: () => {
    set((s) => {
      if (s.history.past.length === 0) return s;
      const previous = s.history.past[s.history.past.length - 1];
      const past = s.history.past.slice(0, -1);
      const future = [s.objects, ...s.history.future];
      return { objects: previous, history: { past, future } };
    });
  },

  redo: () => {
    set((s) => {
      if (s.history.future.length === 0) return s;
      const next = s.history.future[0];
      const future = s.history.future.slice(1);
      const past = [...s.history.past, s.objects];
      return { objects: next, history: { past, future } };
    });
  },
}));
