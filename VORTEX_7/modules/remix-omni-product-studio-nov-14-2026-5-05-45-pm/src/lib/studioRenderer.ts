// Local Ultra Cinema & Cinemax 4K HDR Renderer
// Renders high-dynamic-range, tone-mapped showcase reels directly in the browser via HTML5 Canvas & MediaRecorder.
// 100% self-contained, offline-capable, zero external APIs or third-party servers.

export type ResolutionKey = '720p' | '1080p' | '4k_uhd' | 'cinemax_4k';
export type HDRGradeKey = 'standard' | 'hdr_cinema' | 'ultra_cinemax';

export interface ResolutionSpec {
  key: ResolutionKey;
  label: string;
  tag: string;
  width: number;
  height: number;
  aspectDesc: string;
  bitrate: number;
  fps: number;
}

export const RESOLUTION_PRESETS: ResolutionSpec[] = [
  {
    key: '720p',
    label: '720p HD',
    tag: '1280×720',
    width: 1280,
    height: 720,
    aspectDesc: '16:9 HD',
    bitrate: 8_000_000,
    fps: 30,
  },
  {
    key: '1080p',
    label: '1080p Cinema',
    tag: '1920×1080',
    width: 1920,
    height: 1080,
    aspectDesc: '16:9 FHD',
    bitrate: 14_000_000,
    fps: 30,
  },
  {
    key: '4k_uhd',
    label: '4K UHD HDR',
    tag: '3840×2160',
    width: 3840,
    height: 2160,
    aspectDesc: '16:9 4K',
    bitrate: 28_000_000,
    fps: 24,
  },
  {
    key: 'cinemax_4k',
    label: 'Cinemax 4K',
    tag: '4096×1716',
    width: 4096,
    height: 1716,
    aspectDesc: '2.39:1 Scope',
    bitrate: 32_000_000,
    fps: 24,
  },
];

export const HDR_GRADE_PRESETS: { key: HDRGradeKey; label: string; desc: string }[] = [
  { key: 'standard', label: 'Rec.709 Std', desc: 'Balanced' },
  { key: 'hdr_cinema', label: 'High HDR', desc: '10-bit Tone' },
  { key: 'ultra_cinemax', label: 'Ultra Cinema', desc: 'Anamorphic Bloom' },
];

interface RenderOptions {
  productUrl: string;
  atmosphereUrl: string;
  durationSec: number;
  resolution?: ResolutionKey;
  hdrGrade?: HDRGradeKey;
  watermarkEnabled?: boolean;
  instructions?: string;
  onProgress?: (progress: number, logMessage: string) => void;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image asset for rendering'));
    img.src = src;
  });
}

function createSoftShadowSprite(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const gctx = c.getContext('2d')!;
  const grad = gctx.createRadialGradient(w / 2, h / 2, w * 0.08, w / 2, h / 2, w * 0.48);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.82)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.42)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  gctx.save();
  gctx.translate(w / 2, h / 2);
  gctx.scale(1, h / w);
  gctx.translate(-w / 2, -h / 2);
  gctx.fillStyle = grad;
  gctx.beginPath();
  gctx.arc(w / 2, h / 2, w * 0.48, 0, Math.PI * 2);
  gctx.fill();
  gctx.restore();
  return c;
}

function createAnamorphicFlareSprite(w: number, h: number, primary: string, secondary: string): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const fctx = c.getContext('2d')!;
  const streak = fctx.createLinearGradient(0, h / 2, w, h / 2);
  streak.addColorStop(0, 'rgba(0,0,0,0)');
  streak.addColorStop(0.35, secondary);
  streak.addColorStop(0.5, primary);
  streak.addColorStop(0.65, secondary);
  streak.addColorStop(1, 'rgba(0,0,0,0)');
  fctx.fillStyle = streak;
  fctx.fillRect(0, h * 0.46, w, h * 0.08);

  const core = fctx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, h * 0.48);
  core.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
  core.addColorStop(0.35, primary);
  core.addColorStop(1, 'rgba(0,0,0,0)');
  fctx.fillStyle = core;
  fctx.fillRect(0, 0, w, h);
  return c;
}

export async function renderCinematicReel(
  options: RenderOptions
): Promise<{ videoUrl: string; blob: Blob; mimeType: string; width: number; height: number }> {
  const {
    productUrl,
    atmosphereUrl,
    durationSec,
    resolution = '4k_uhd',
    hdrGrade = 'ultra_cinemax',
    watermarkEnabled = false,
    instructions,
    onProgress,
  } = options;

  const spec = RESOLUTION_PRESETS.find((r) => r.key === resolution) ?? RESOLUTION_PRESETS[2];

  onProgress?.(5, 'Loading source assets into local optical buffer...');
  const [productImg, atmoImg, watermarkImg] = await Promise.all([
    loadImage(productUrl),
    loadImage(atmosphereUrl),
    watermarkEnabled ? loadImage('/assets/aistudio/image_1a575009.png').catch(() => null) : Promise.resolve(null),
  ]);

  const width = spec.width;
  const height = spec.height;
  const fps = spec.fps;
  const totalFrames = Math.max(fps * 3, Math.round(durationSec * fps));

  onProgress?.(14, `Calibrating ${spec.label} (${width}×${height} · ${spec.aspectDesc}) wide-gamut canvas…`);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext('2d', { alpha: false, colorSpace: 'display-p3' } as any) as CanvasRenderingContext2D | null;
  } catch {
    ctx = null;
  }
  if (!ctx) {
    ctx = canvas.getContext('2d', { alpha: false })!;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const shadowSprite = createSoftShadowSprite(Math.round(width * 0.42), Math.round(height * 0.14));
  const lowerInstructions = (instructions || '').toLowerCase();
  const isWarmer = lowerInstructions.includes('warm') || lowerInstructions.includes('golden') || lowerInstructions.includes('sun');
  const isCooler = lowerInstructions.includes('cool') || lowerInstructions.includes('blue') || lowerInstructions.includes('silver');
  const isDramatic = lowerInstructions.includes('dramatic') || lowerInstructions.includes('contrast') || lowerInstructions.includes('dark');
  const isFast = lowerInstructions.includes('fast') || lowerInstructions.includes('rapid') || lowerInstructions.includes('quick');

  const flarePrimary = isWarmer
    ? 'rgba(255, 210, 140, 0.45)'
    : isCooler
    ? 'rgba(100, 235, 255, 0.48)'
    : 'rgba(0, 229, 255, 0.36)';
  const flareSecondary = isWarmer
    ? 'rgba(255, 120, 60, 0.2)'
    : 'rgba(230, 57, 155, 0.22)';
  const flareSprite = createAnamorphicFlareSprite(Math.round(width * 0.72), Math.round(height * 0.22), flarePrimary, flareSecondary);

  // For >1080p 4K streams, prefer VP9 first because Baseline AVC1 fails >1080p in many browsers
  const mimeTypes = width > 1920
    ? [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4;codecs=avc1',
        'video/mp4',
      ]
    : [
        'video/mp4;codecs=avc1',
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
      ];

  let selectedMime = '';
  for (const m of mimeTypes) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
      selectedMime = m;
      break;
    }
  }

  const stream = canvas.captureStream(fps);
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, {
      ...(selectedMime ? { mimeType: selectedMime } : {}),
      videoBitsPerSecond: spec.bitrate,
    });
  } catch {
    recorder = selectedMime
      ? new MediaRecorder(stream, { mimeType: selectedMime })
      : new MediaRecorder(stream);
  }
  const actualMime = recorder.mimeType || selectedMime || 'video/webm';

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: actualMime }));
    };
    recorder.onerror = (e) => reject((e as any).error || new Error('MediaRecorder error'));
  });

  recorder.start();

  const gradeLabel = HDR_GRADE_PRESETS.find((g) => g.key === hdrGrade)?.label || hdrGrade;
  onProgress?.(24, `Rendering ${gradeLabel} HDR tone pipeline (${fps} fps)…`);

  const frameIntervalMs = 1000 / fps;
  let currentFrame = 0;
  const isHDR = hdrGrade !== 'standard';
  const isUltra = hdrGrade === 'ultra_cinemax';

  return new Promise((resolve, reject) => {
    function renderNext() {
      if (currentFrame >= totalFrames) {
        onProgress?.(95, `Encoding final ${spec.label} master stream…`);
        recorder.stop();
        recordingPromise
          .then((blob) => {
            const videoUrl = URL.createObjectURL(blob);
            onProgress?.(100, `${spec.label} (${width}×${height}) master complete.`);
            resolve({ videoUrl, blob, mimeType: actualMime, width, height });
          })
          .catch(reject);
        return;
      }

      const t = currentFrame / totalFrames;

      // Multi-beat Cinema Camera Choreography
      let camScale = 1.0;
      let camOffsetX = 0;
      let camOffsetY = 0;
      const lightAngle = t * Math.PI * 2 * (isFast ? 2 : 1);

      if (t < 0.4) {
        const p1 = t / 0.4;
        const ease = 1 - Math.pow(1 - p1, 3);
        camScale = 1.04 + 0.13 * ease;
        camOffsetX = Math.sin(p1 * Math.PI) * (width * 0.018);
        camOffsetY = Math.cos(p1 * Math.PI * 0.5) * (height * 0.014);
      } else if (t < 0.72) {
        const p2 = (t - 0.4) / 0.32;
        camScale = 1.17 + 0.07 * Math.sin(p2 * Math.PI);
        camOffsetX = (p2 - 0.5) * (width * 0.032);
        camOffsetY = -(height * 0.018) + Math.sin(p2 * Math.PI) * (height * 0.018);
      } else {
        const p3 = (t - 0.72) / 0.28;
        camScale = 1.17 - 0.07 * p3;
        camOffsetX = Math.sin(p3 * Math.PI * 2) * (width * 0.006);
        camOffsetY = 0;
      }

      ctx!.save();
      ctx!.fillStyle = '#050609';
      ctx!.fillRect(0, 0, width, height);

      // 1. Background Atmosphere with Cinema Parallax & Tone Curve
      ctx!.save();
      if (isHDR) {
        ctx!.filter = isUltra
          ? 'contrast(1.14) saturate(1.18) brightness(1.03)'
          : 'contrast(1.09) saturate(1.12)';
      }
      ctx!.translate(width / 2, height / 2);
      ctx!.scale(camScale * 1.05, camScale * 1.05);
      ctx!.translate(-width / 2 + camOffsetX * 0.28, -height / 2 + camOffsetY * 0.28);

      const atmoAspect = atmoImg.naturalWidth / atmoImg.naturalHeight;
      const canvasAspect = width / height;
      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;

      if (atmoAspect > canvasAspect) {
        drawW = height * atmoAspect;
        drawX = (width - drawW) / 2;
      } else {
        drawH = width / atmoAspect;
        drawY = (height - drawH) / 2;
      }
      ctx!.drawImage(atmoImg, drawX, drawY, drawW, drawH);
      ctx!.restore();

      // 2. HDR Ambient Backlight Halo behind Hero Subject
      if (isHDR) {
        ctx!.save();
        ctx!.globalCompositeOperation = 'screen';
        const haloX = width / 2 + camOffsetX * 0.5;
        const haloY = height * 0.48 + camOffsetY * 0.5;
        const halo = ctx!.createRadialGradient(haloX, haloY, width * 0.03, haloX, haloY, width * 0.42);
        halo.addColorStop(0, isWarmer ? 'rgba(255, 195, 130, 0.26)' : 'rgba(0, 229, 255, 0.22)');
        halo.addColorStop(0.55, isUltra ? 'rgba(230, 57, 155, 0.14)' : 'rgba(255, 255, 255, 0.06)');
        halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx!.fillStyle = halo;
        ctx!.fillRect(0, 0, width, height);
        ctx!.restore();
      }

      // 3. Pre-baked Ground Contact Shadow Sprite (fast 4K performance)
      ctx!.save();
      const shadowOsc = 1 + 0.04 * Math.sin(t * Math.PI * 4);
      const sw = shadowSprite.width * shadowOsc;
      const sh = shadowSprite.height * shadowOsc;
      const sx = width / 2 + camOffsetX * 0.85 - sw / 2;
      const sy = height * 0.80 + camOffsetY * 0.85 - sh / 2;
      ctx!.drawImage(shadowSprite, sx, sy, sw, sh);
      ctx!.restore();

      // 4. Hero Subject Foreground with High-Res Interpolation & Rim Depth
      ctx!.save();
      if (isHDR) {
        ctx!.filter = isUltra
          ? 'contrast(1.12) saturate(1.16) brightness(1.06)'
          : 'contrast(1.07) saturate(1.10) brightness(1.03)';
      }
      ctx!.translate(width / 2, height / 2);
      ctx!.scale(camScale, camScale);
      ctx!.translate(-width / 2 + camOffsetX, -height / 2 + camOffsetY);

      const prodAspect = productImg.naturalWidth / productImg.naturalHeight;
      const maxProdH = height * 0.70;
      const maxProdW = width * 0.52;
      let pW = maxProdW;
      let pH = maxProdW / prodAspect;
      if (pH > maxProdH) {
        pH = maxProdH;
        pW = maxProdH * prodAspect;
      }
      const pX = (width - pW) / 2;
      const pY = (height - pH) / 2 + height * 0.015 + Math.sin(t * Math.PI * 2) * (height * 0.008);

      ctx!.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx!.shadowBlur = Math.round(height * 0.035);
      ctx!.shadowOffsetY = Math.round(height * 0.018);
      ctx!.drawImage(productImg, pX, pY, pW, pH);
      ctx!.restore();

      // 5. Volumetric Key Light Sweep & HDR Specular Bloom
      ctx!.save();
      const lx = width * 0.5 + Math.cos(lightAngle) * width * 0.42;
      const ly = height * 0.34 + Math.sin(lightAngle) * height * 0.32;
      const lightGrad = ctx!.createRadialGradient(lx, ly, width * 0.015, lx, ly, width * 0.62);

      if (isWarmer) {
        lightGrad.addColorStop(0, isHDR ? 'rgba(255, 224, 178, 0.34)' : 'rgba(254, 215, 170, 0.26)');
        lightGrad.addColorStop(0.45, 'rgba(234, 88, 12, 0.14)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.38)');
      } else if (isCooler) {
        lightGrad.addColorStop(0, isHDR ? 'rgba(186, 240, 255, 0.34)' : 'rgba(186, 230, 253, 0.26)');
        lightGrad.addColorStop(0.45, 'rgba(0, 229, 255, 0.14)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.42)');
      } else {
        lightGrad.addColorStop(0, isHDR ? 'rgba(255, 255, 255, 0.30)' : 'rgba(255, 255, 255, 0.20)');
        lightGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.07)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.36)');
      }
      ctx!.fillStyle = lightGrad;
      ctx!.fillRect(0, 0, width, height);
      ctx!.restore();

      // 6. Anamorphic Cinemax Optical Flare Pass (Ultra Cinema Mode)
      if (isUltra) {
        ctx!.save();
        ctx!.globalCompositeOperation = 'screen';
        ctx!.globalAlpha = 0.55 + 0.25 * Math.sin(t * Math.PI * 3);
        const fx = lx - flareSprite.width / 2;
        const fy = ly - flareSprite.height / 2;
        ctx!.drawImage(flareSprite, fx, fy);
        ctx!.restore();
      }

      // 6b. Optional User Studio Watermark Overlay (KNOCKSSTUDiOS pattern)
      if (watermarkEnabled && watermarkImg && watermarkImg.naturalWidth > 0) {
        ctx!.save();
        ctx!.globalCompositeOperation = 'screen';
        ctx!.globalAlpha = 0.14;
        const wmAspect = watermarkImg.naturalWidth / watermarkImg.naturalHeight;
        const cAspect = width / height;
        let wmW = width;
        let wmH = height;
        let wmX = 0;
        let wmY = 0;
        if (wmAspect > cAspect) {
          wmW = height * wmAspect;
          wmX = (width - wmW) / 2;
        } else {
          wmH = width / wmAspect;
          wmY = (height - wmH) / 2;
        }
        ctx!.drawImage(watermarkImg, wmX, wmY, wmW, wmH);
        ctx!.restore();
      }

      // 7. Cinema Edge Vignette
      ctx!.save();
      const vigGrad = ctx!.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.30,
        width / 2,
        height / 2,
        width * 0.72
      );
      vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vigGrad.addColorStop(1, isDramatic || isUltra ? 'rgba(0,0,0,0.68)' : 'rgba(0,0,0,0.42)');
      ctx!.fillStyle = vigGrad;
      ctx!.fillRect(0, 0, width, height);
      ctx!.restore();

      // 8. Subtle Cinema Sensor Micro-Grain
      ctx!.save();
      ctx!.fillStyle = currentFrame % 2 === 0 ? 'rgba(255, 255, 255, 0.012)' : 'rgba(0, 0, 0, 0.012)';
      ctx!.fillRect(0, 0, width, height);
      ctx!.restore();

      ctx!.restore();

      currentFrame++;
      if (currentFrame % Math.max(8, Math.round(fps * 0.45)) === 0) {
        const percent = 24 + Math.round((currentFrame / totalFrames) * 68);
        onProgress?.(
          percent,
          `Rendering ${spec.label} frame ${currentFrame}/${totalFrames} (${Math.round((currentFrame / fps) * 10) / 10}s)…`
        );
      }

      setTimeout(renderNext, frameIntervalMs);
    }

    renderNext();
  });
}
