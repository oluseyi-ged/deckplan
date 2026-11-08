let canvasElement: HTMLCanvasElement | null = null;

export function registerCanvas(canvas: HTMLCanvasElement | null): void {
  canvasElement = canvas;
}

export function captureScreenshot(filename = 'deckplan-scene.png'): void {
  if (!canvasElement) return;
  const link = document.createElement('a');
  link.href = canvasElement.toDataURL('image/png');
  link.download = filename;
  link.click();
}
