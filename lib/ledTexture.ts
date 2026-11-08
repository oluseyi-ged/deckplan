import * as THREE from 'three';

const PX_PER_METER = 64;
const TEST_BARS = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff', '#af52de', '#ffffff'];

/** Draws an image into a w x h region, cropping to fill (like CSS object-fit: cover). */
function drawImageCover(ctx: CanvasRenderingContext2D, image: CanvasImageSource, w: number, h: number) {
  const imgW = 'naturalWidth' in image ? image.naturalWidth : (image as HTMLCanvasElement).width;
  const imgH = 'naturalHeight' in image ? image.naturalHeight : (image as HTMLCanvasElement).height;
  const scale = Math.max(w / imgW, h / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  ctx.drawImage(image, (w - drawW) / 2, (h - drawH) / 2, drawW, drawH);
}

export function createLedWallTexture({
  widthM,
  heightM,
  tileSizeM,
  baseColor,
  testPattern,
  image,
}: {
  widthM: number;
  heightM: number;
  tileSizeM: number;
  baseColor: string;
  testPattern: boolean;
  image?: HTMLImageElement | null;
}): THREE.CanvasTexture {
  const w = Math.max(2, Math.round(widthM * PX_PER_METER));
  const h = Math.max(2, Math.round(heightM * PX_PER_METER));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, w, h);

    if (image) {
      drawImageCover(ctx, image, w, h);
    } else if (testPattern) {
      const barWidth = w / TEST_BARS.length;
      TEST_BARS.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(i * barWidth, 0, barWidth + 1, h * 0.7);
      });
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, h * 0.7, w, h * 0.3);
    }

    const tilePx = Math.max(4, tileSizeM * PX_PER_METER);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += tilePx) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += tilePx) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
