'use client';

import type { PerformerProps, PerformerRole, SceneObject } from '@/types/scene';
import ObjectShell from './ObjectShell';
import IconBillboard from './IconBillboard';

const ROLE_ICON: Record<PerformerRole, string> = {
  vocalist: '/icons/performer-vocalist.png',
  guitarist: '/icons/performer-guitarist.png',
  keyboardist: '/icons/performer-keyboardist.png',
  drummer: '/icons/performer-drummer.png',
  choir: '/icons/performer-choir.png',
};

export default function PerformerObject({ obj }: { obj: SceneObject<'performer'> }) {
  const { height } = obj.dimensions;
  return (
    <ObjectShell obj={obj}>
      <IconBillboard src={ROLE_ICON[obj.props.role]} height={height} />
    </ObjectShell>
  );
}

const ROLES: PerformerRole[] = ['vocalist', 'guitarist', 'keyboardist', 'drummer', 'choir'];

export function PerformerFields({
  obj,
  onPropsChange,
}: {
  obj: SceneObject<'performer'>;
  onPropsChange: (patch: Partial<PerformerProps>) => void;
}) {
  return (
    <label className="flex items-center justify-between text-xs text-neutral-400">
      Role
      <select
        value={obj.props.role}
        onChange={(e) => onPropsChange({ role: e.target.value as PerformerRole })}
        className="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-1 text-xs text-neutral-200"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </label>
  );
}
