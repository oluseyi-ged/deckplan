export type Vec3 = { x: number; y: number; z: number };

export type Dimensions = { width: number; depth: number; height: number };

export type ObjectType =
  | 'stage'
  | 'drumRiser'
  | 'ledWall'
  | 'seatingSection'
  | 'micStand'
  | 'piano'
  | 'guitarAmp'
  | 'monitorWedge'
  | 'trussSegment'
  | 'performer'
  | 'movingHeadLight'
  | 'placedCamera'
  | 'monitor';

export type StageProps = Record<string, never>;

export type DrumRiserProps = Record<string, never>;

export type LedWallProps = {
  testPattern: boolean;
  tileSize: number;
  imageDataUrl?: string;
};

export type SeatingSectionProps = {
  rows: number;
  seatsPerRow: number;
  seatSpacing: number;
  rowSpacing: number;
  seatWidth: number;
  seatDepth: number;
};

export type MicStandStyle = 'straight' | 'boom';

export type MicStandProps = {
  style: MicStandStyle;
};

export type PianoProps = Record<string, never>;

export type GuitarAmpProps = Record<string, never>;

export type MonitorWedgeProps = Record<string, never>;

export type TrussSegmentProps = Record<string, never>;

export type PerformerRole = 'vocalist' | 'guitarist' | 'keyboardist' | 'drummer' | 'choir';

export type PerformerProps = {
  role: PerformerRole;
};

export type MovingHeadLightProps = {
  tiltSide: number;
  tiltForward: number;
  beamAngle: number;
  beamLength: number;
  beamColor: string;
  beamOn: boolean;
};

export type PlacedCameraType = 'static' | 'ptz' | 'jib';

export type PlacedCameraProps = {
  cameraType: PlacedCameraType;
  fov: number;
  jibHeight: number;
  jibReach: number;
};

export type MonitorMountStyle = 'stand' | 'wall';

export type MonitorProps = {
  mountStyle: MonitorMountStyle;
  imageDataUrl?: string;
};

export type PropsForType = {
  stage: StageProps;
  drumRiser: DrumRiserProps;
  ledWall: LedWallProps;
  seatingSection: SeatingSectionProps;
  micStand: MicStandProps;
  piano: PianoProps;
  guitarAmp: GuitarAmpProps;
  monitorWedge: MonitorWedgeProps;
  trussSegment: TrussSegmentProps;
  performer: PerformerProps;
  movingHeadLight: MovingHeadLightProps;
  placedCamera: PlacedCameraProps;
  monitor: MonitorProps;
};

export type SceneObject<T extends ObjectType = ObjectType> = {
  id: string;
  type: T;
  name: string;
  position: Vec3;
  rotationY: number;
  dimensions: Dimensions;
  color: string;
  props: PropsForType[T];
};

export type AnySceneObject = SceneObject<ObjectType>;

export type CameraMode = 'orbit' | 'iso' | 'preview';

export type TransformMode = 'translate' | 'translateY' | 'rotate';

export type SnapSettings = {
  enabled: boolean;
  positionStep: number;
  rotationStepDeg: number;
};

export type PreviewEyeHeight = 'seated' | 'standing';

export type PreviewSource = {
  position: Vec3;
  lookAt: Vec3;
};
