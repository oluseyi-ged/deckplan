import type { ComponentType } from 'react';
import type { Dimensions, ObjectType, PropsForType, SceneObject } from '@/types/scene';
import StageObject from './StageObject';
import DrumRiserObject from './DrumRiserObject';
import LedWallObject, { LedWallFields } from './LedWallObject';
import SeatingSectionObject, { SeatingSectionFields } from './SeatingSectionObject';
import MicStandObject, { MicStandFields } from './MicStandObject';
import PianoObject from './PianoObject';
import GuitarAmpObject from './GuitarAmpObject';
import MonitorWedgeObject from './MonitorWedgeObject';
import TrussSegmentObject from './TrussSegmentObject';
import PerformerObject, { PerformerFields } from './PerformerObject';
import MovingHeadLightObject, { MovingHeadLightFields } from './MovingHeadLightObject';
import PlacedCameraObject, { PlacedCameraFields } from './PlacedCameraObject';
import MonitorObject, { MonitorFields } from './MonitorObject';

export type ObjectCategory = 'structure' | 'av' | 'people' | 'lighting' | 'camera';

export type ObjectDefinition<T extends ObjectType> = {
  type: T;
  label: string;
  category: ObjectCategory;
  defaultDimensions: Dimensions;
  defaultColor: string;
  defaultProps: PropsForType[T];
  Component: ComponentType<{ obj: SceneObject<T> }>;
  PropertiesFields?: ComponentType<{
    obj: SceneObject<T>;
    onPropsChange: (patch: Partial<PropsForType[T]>) => void;
  }>;
  /** Recomputes footprint dimensions from props, e.g. when seating rows/spacing change. */
  deriveDimensions?: (props: PropsForType[T]) => Partial<Dimensions>;
};

export const OBJECT_REGISTRY: { [K in ObjectType]: ObjectDefinition<K> } = {
  stage: {
    type: 'stage',
    label: 'Main Stage',
    category: 'structure',
    defaultDimensions: { width: 12, depth: 8, height: 1.2 },
    defaultColor: '#8a8a8a',
    defaultProps: {},
    Component: StageObject,
  },
  drumRiser: {
    type: 'drumRiser',
    label: 'Drum Riser',
    category: 'structure',
    defaultDimensions: { width: 2.4, depth: 2.4, height: 0.6 },
    defaultColor: '#6b6b6b',
    defaultProps: {},
    Component: DrumRiserObject,
  },
  ledWall: {
    type: 'ledWall',
    label: 'LED Wall',
    category: 'av',
    defaultDimensions: { width: 10, depth: 0.15, height: 5.6 },
    defaultColor: '#0a0a1a',
    defaultProps: { testPattern: true, tileSize: 0.5 },
    Component: LedWallObject,
    PropertiesFields: LedWallFields,
  },
  seatingSection: {
    type: 'seatingSection',
    label: 'Seating Section',
    category: 'people',
    defaultDimensions: { width: 5.5, depth: 4.8, height: 0.9 },
    defaultColor: '#3a4a6b',
    defaultProps: {
      rows: 6,
      seatsPerRow: 10,
      seatSpacing: 0.55,
      rowSpacing: 0.8,
      seatWidth: 0.45,
      seatDepth: 0.45,
    },
    Component: SeatingSectionObject,
    PropertiesFields: SeatingSectionFields,
    deriveDimensions: (props) => ({
      width: props.seatsPerRow * props.seatSpacing,
      depth: props.rows * props.rowSpacing,
    }),
  },
  micStand: {
    type: 'micStand',
    label: 'Mic Stand',
    category: 'av',
    defaultDimensions: { width: 0.3, depth: 0.3, height: 1.4 },
    defaultColor: '#2a2a2a',
    defaultProps: { style: 'straight' },
    Component: MicStandObject,
    PropertiesFields: MicStandFields,
  },
  piano: {
    type: 'piano',
    label: 'Piano',
    category: 'av',
    defaultDimensions: { width: 1.5, depth: 1.4, height: 1.0 },
    defaultColor: '#1c1917',
    defaultProps: {},
    Component: PianoObject,
  },
  guitarAmp: {
    type: 'guitarAmp',
    label: 'Guitar Amp',
    category: 'av',
    defaultDimensions: { width: 0.6, depth: 0.3, height: 0.6 },
    defaultColor: '#2e2a26',
    defaultProps: {},
    Component: GuitarAmpObject,
  },
  monitorWedge: {
    type: 'monitorWedge',
    label: 'Monitor Wedge',
    category: 'av',
    defaultDimensions: { width: 0.5, depth: 0.4, height: 0.3 },
    defaultColor: '#1a1a1a',
    defaultProps: {},
    Component: MonitorWedgeObject,
  },
  trussSegment: {
    type: 'trussSegment',
    label: 'Truss Segment',
    category: 'structure',
    defaultDimensions: { width: 3, depth: 0.3, height: 0.3 },
    defaultColor: '#9ca3af',
    defaultProps: {},
    Component: TrussSegmentObject,
  },
  performer: {
    type: 'performer',
    label: 'Performer',
    category: 'people',
    defaultDimensions: { width: 0.5, depth: 0.35, height: 1.7 },
    defaultColor: '#4b5563',
    defaultProps: { role: 'vocalist' },
    Component: PerformerObject,
    PropertiesFields: PerformerFields,
  },
  movingHeadLight: {
    type: 'movingHeadLight',
    label: 'Moving Head',
    category: 'lighting',
    defaultDimensions: { width: 0.3, depth: 0.3, height: 0.4 },
    defaultColor: '#1f2937',
    defaultProps: { tiltSide: 0, tiltForward: 0, beamAngle: 18, beamLength: 6, beamColor: '#60a5fa', beamOn: true },
    Component: MovingHeadLightObject,
    PropertiesFields: MovingHeadLightFields,
  },
  placedCamera: {
    type: 'placedCamera',
    label: 'Camera',
    category: 'camera',
    defaultDimensions: { width: 0.3, depth: 0.3, height: 1.5 },
    defaultColor: '#374151',
    defaultProps: { cameraType: 'static', fov: 50, jibHeight: 3, jibReach: 2 },
    Component: PlacedCameraObject,
    PropertiesFields: PlacedCameraFields,
  },
  monitor: {
    type: 'monitor',
    label: 'TV / Monitor',
    category: 'av',
    defaultDimensions: { width: 1.0, depth: 0.08, height: 0.6 },
    defaultColor: '#1e3a5f',
    defaultProps: { mountStyle: 'stand' },
    Component: MonitorObject,
    PropertiesFields: MonitorFields,
  },
};

export const OBJECT_TYPES = Object.keys(OBJECT_REGISTRY) as ObjectType[];
