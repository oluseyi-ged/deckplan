'use client';

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export default function NumberField({
  label,
  value,
  onChange,
  step = 0.1,
  min,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-xs text-neutral-400">
      <span className="w-20 shrink-0">{label}</span>
      <div className="flex flex-1 items-center overflow-hidden rounded border border-neutral-700 bg-neutral-800">
        <button
          type="button"
          onClick={() => onChange(round(value - step))}
          className="px-1.5 py-1 text-neutral-400 hover:text-white"
        >
          −
        </button>
        <input
          type="number"
          step={step}
          min={min}
          value={round(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full flex-1 bg-transparent px-1 py-1 text-center text-xs text-neutral-200 outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(round(value + step))}
          className="px-1.5 py-1 text-neutral-400 hover:text-white"
        >
          +
        </button>
      </div>
    </label>
  );
}
