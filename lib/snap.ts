export function snapValue(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

export function snapAngleDeg(angleDeg: number, step: number): number {
  if (step <= 0) return angleDeg;
  return Math.round(angleDeg / step) * step;
}
