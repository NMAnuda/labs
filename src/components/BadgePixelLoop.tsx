import React from 'react';

type BadgePixelLoopProps = {
  badgeSrc: string;
  className?: string;
  reducedMotion?: boolean;
  particleCount?: number;
  minPixelSize?: number;
  maxPixelSize?: number;
  durationMs?: number;
};

type Particle = {
  ox: number;
  oy: number;
  tx: number;
  ty: number;
  size: number;
  delay: number;
  phase: number;
  wobble: number;
  speed: number;
  drift: number;
  color: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const mapRange = (value: number, start: number, end: number) => {
  if (end <= start) return 0;
  return clamp((value - start) / (end - start), 0, 1);
};

const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

const easeInOutSine = (value: number) => -(Math.cos(Math.PI * value) - 1) * 0.5;
const snap = (value: number, step: number) => Math.round(value / step) * step;

const fitRect = (sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number) => {
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  const x = (targetWidth - width) * 0.5;
  const y = (targetHeight - height) * 0.5;
  return { x, y, width, height };
};

const BadgePixelLoop: React.FC<BadgePixelLoopProps> = ({
  badgeSrc,
  className = '',
  reducedMotion = false,
  particleCount = 2200,
  minPixelSize = 1.6,
  maxPixelSize = 2.9,
  durationMs = 7600,
}) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let disposed = false;
    let rafId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const startTime = performance.now();
    let width = 0;
    let height = 0;
    let image: HTMLImageElement | null = null;
    let particles: Particle[] = [];
    let particleBudget = particleCount;

    const resolveParticleBudget = () => {
      const viewportWidth = window.innerWidth || width;
      if (viewportWidth <= 640) return Math.max(420, Math.floor(particleCount * 0.36));
      if (viewportWidth <= 960) return Math.max(740, Math.floor(particleCount * 0.62));
      return particleCount;
    };

    const setCanvasSize = () => {
      const rect = root.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particleBudget = resolveParticleBudget();
    };

    const buildParticles = () => {
      if (!image) return;

      type RawPoint = {
        px: number;
        py: number;
        nx: number;
        ny: number;
        txPerp: number;
        tyPerp: number;
        edgeWeight: number;
      };

      const sampleSize = Math.max(140, Math.floor(Math.min(width, height) * 0.86));
      const sample = document.createElement('canvas');
      sample.width = sampleSize;
      sample.height = sampleSize;
      const sampleCtx = sample.getContext('2d');
      if (!sampleCtx) return;

      sampleCtx.clearRect(0, 0, sampleSize, sampleSize);
      const fitted = fitRect(image.width, image.height, sampleSize, sampleSize);
      sampleCtx.drawImage(image, fitted.x, fitted.y, fitted.width, fitted.height);

      const imageData = sampleCtx.getImageData(0, 0, sampleSize, sampleSize).data;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const rawPoints: RawPoint[] = [];
      const quantStep = clamp(Math.min(width, height) / 180, 1.8, 2.6);
      let minX = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;

      for (let y = 0; y < sampleSize; y += 1) {
        for (let x = 0; x < sampleSize; x += 1) {
          const index = (y * sampleSize + x) * 4;
          const alpha = imageData[index + 3];
          if (alpha < 48) continue;

          const px = (x + 0.5) * (width / sampleSize);
          const py = (y + 0.5) * (height / sampleSize);
          const ux = (px - centerX) / Math.max(1, width * 0.5);
          const uy = (py - centerY) / Math.max(1, height * 0.5);
          const radial = Math.hypot(ux, uy) || 1;
          const nx = ux / radial;
          const ny = uy / radial;
          const txPerp = -ny;
          const tyPerp = nx;
          const edgeWeight = clamp(radial, 0, 1);

          rawPoints.push({ px, py, nx, ny, txPerp, tyPerp, edgeWeight });
          minX = Math.min(minX, px);
          maxX = Math.max(maxX, px);
          minY = Math.min(minY, py);
          maxY = Math.max(maxY, py);
        }
      }

      if (rawPoints.length === 0) {
        particles = [];
        return;
      }

      const boundsWidth = Math.max(1, maxX - minX);
      const boundsHeight = Math.max(1, maxY - minY);
      const cloudInset = Math.max(4, Math.floor(Math.min(width, height) * 0.02));
      const cloudMinX = cloudInset;
      const cloudMaxX = width - cloudInset;
      const cloudMinY = cloudInset;
      const cloudMaxY = height - cloudInset;
      const candidates: Particle[] = [];
      const clusterCount = 34;
      const clusters = Array.from({ length: clusterCount }, () => {
        const cx = lerp(cloudMinX, cloudMaxX, Math.random());
        const bottomBias = 1 - Math.pow(Math.random(), 1.6);
        const cy = lerp(cloudMinY, cloudMaxY, bottomBias);
        return { x: cx, y: cy };
      });

      for (const raw of rawPoints) {
        const normX = (raw.px - minX) / boundsWidth;
        const normY = (raw.py - minY) / boundsHeight;

        const spread = 22 + raw.edgeWeight * 44 + Math.random() * 28;
        const tangent = (Math.random() - 0.5) * (26 + raw.edgeWeight * 26);
        const localTargetX = raw.px + raw.nx * spread + raw.txPerp * tangent;
        const localTargetY =
          raw.py + raw.ny * spread * 0.84 + raw.tyPerp * tangent * 0.54 + (Math.random() - 0.5) * 7;

        const clusterIndex = Math.floor(
          clamp(normX * (clusterCount - 1) + (Math.random() - 0.5) * 4, 0, clusterCount - 1)
        );
        const cluster = clusters[clusterIndex];
        const clusterBlend = 0.18 + normY * 0.22 + (Math.random() < 0.45 ? 0.24 : 0);
        const bottomPull = 0.1 + normY * 0.26 + raw.edgeWeight * 0.16;
        const roamChance = 0.35 + raw.edgeWeight * 0.28;

        let targetX = clamp(lerp(localTargetX, cluster.x, clusterBlend), cloudMinX, cloudMaxX);
        let targetY = clamp(lerp(localTargetY, cluster.y, clusterBlend + bottomPull * 0.25), cloudMinY, cloudMaxY);

        if (Math.random() < roamChance) {
          const roamX = lerp(cloudMinX, cloudMaxX, Math.random());
          const roamY = lerp(cloudMinY, cloudMaxY, 1 - Math.pow(Math.random(), 1.55));
          targetX = lerp(targetX, roamX, 0.55 + Math.random() * 0.25);
          targetY = lerp(targetY, roamY, 0.58 + Math.random() * 0.24);
        }

        const tone = 228 + Math.floor(Math.random() * 18);

        candidates.push({
          ox: raw.px,
          oy: raw.py,
          tx: snap(targetX, quantStep),
          ty: snap(targetY, quantStep),
          size: minPixelSize + Math.random() * (maxPixelSize - minPixelSize),
          delay: clamp(Math.random() * 0.21 + (1 - raw.edgeWeight) * 0.1, 0, 0.6),
          phase: Math.random() * Math.PI * 2,
          wobble: 0.9 + Math.random() * 2.4,
          speed: 0.00074 + Math.random() * 0.00074,
          drift: 2 + Math.random() * 6.4,
          color: `rgb(${tone}, ${tone + 3}, ${Math.min(tone + 11, 255)})`,
        });
      }

      if (candidates.length <= particleBudget) {
        particles = candidates;
        return;
      }

      const stride = candidates.length / particleBudget;
      const reduced: Particle[] = [];
      for (let i = 0; i < particleBudget; i += 1) {
        reduced.push(candidates[Math.floor(i * stride)]);
      }
      particles = reduced;
    };

    const getSplitProgress = (t: number) => {
      if (t < 0.16) return 0;
      if (t < 0.5) return easeInOutCubic(mapRange(t, 0.16, 0.5));
      if (t < 0.84) return 1 - easeInOutCubic(mapRange(t, 0.5, 0.84));
      return 0;
    };

    const getSwimProgress = (t: number) => {
      if (t < 0.22) return 0;
      if (t < 0.46) return easeInOutSine(mapRange(t, 0.22, 0.46));
      if (t < 0.78) return 1;
      if (t < 0.92) return 1 - easeInOutSine(mapRange(t, 0.78, 0.92));
      return 0;
    };

    const getImageOpacity = (t: number) => {
      if (t < 0.16) return 1;
      if (t < 0.3) return 1 - easeInOutSine(mapRange(t, 0.16, 0.3));
      if (t < 0.78) return 0;
      if (t < 0.92) return easeInOutSine(mapRange(t, 0.78, 0.92));
      return 1;
    };

    const render = (now: number) => {
      if (disposed) return;
      context.clearRect(0, 0, width, height);

      if (reducedMotion) {
        root.style.setProperty('--ml-badge-image-opacity', '1');
        return;
      }

      if (particles.length === 0) {
        root.style.setProperty('--ml-badge-image-opacity', '1');
        rafId = window.requestAnimationFrame(render);
        return;
      }

      const elapsed = now - startTime;
      const t = (elapsed % durationMs) / durationMs;
      const split = getSplitProgress(t);
      const swim = getSwimProgress(t);
      root.style.setProperty('--ml-badge-image-opacity', getImageOpacity(t).toFixed(3));

      context.shadowColor = 'rgba(236, 243, 255, 0.2)';

      for (const particle of particles) {
        const local = clamp((split - particle.delay * 0.42) / Math.max(0.2, 1 - particle.delay * 0.34), 0, 1);
        if (local <= 0.002) continue;

        const travel = easeInOutSine(local);
        const swimWeight = swim * (0.8 + local * 1.2);
        const orbitX =
          Math.sin(elapsed * particle.speed * 1.48 + particle.phase + particle.oy * 0.018) *
          particle.wobble *
          2.6 *
          swimWeight;
        const orbitY =
          Math.cos(elapsed * particle.speed * 1.22 + particle.phase * 1.33 + particle.ox * 0.014) *
          particle.wobble *
          2.4 *
          swimWeight;
        const tideX = Math.sin(elapsed * particle.speed * 0.55 + particle.phase * 0.64) * particle.drift * swim * 0.85;
        const tideY = Math.cos(elapsed * particle.speed * 0.5 + particle.phase * 0.72) * particle.drift * swim * 0.9;
        const flowX = Math.sin(elapsed * 0.00042 + particle.phase * 0.5) * swim * 2.1;
        const flowY = Math.cos(elapsed * 0.00034 + particle.phase * 0.65) * swim * 2.3;

        let x =
          lerp(particle.ox, particle.tx, travel) +
          orbitX +
          tideX +
          flowX;
        let y =
          lerp(particle.oy, particle.ty, travel) +
          orbitY +
          tideY +
          flowY;

        x = clamp(x, 2, width - 2);
        y = clamp(y, 2, height - 2);

        const alpha = clamp(local * 0.95 + swim * 0.09, 0, 0.95);
        const size = particle.size * (0.94 + local * 0.18 + swim * 0.06);

        context.globalAlpha = alpha;
        context.fillStyle = particle.color;
        context.shadowBlur = 0.14 + swim * 0.72;
        context.fillRect(x - size * 0.5, y - size * 0.5, size, size);
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      rafId = window.requestAnimationFrame(render);
    };

    setCanvasSize();

    image = new Image();
    image.decoding = 'async';
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (disposed) return;
      buildParticles();
      if (!reducedMotion && !rafId) {
        rafId = window.requestAnimationFrame(render);
      }
    };
    image.src = badgeSrc;

    const resizeObserver = new ResizeObserver(() => {
      if (disposed) return;
      setCanvasSize();
      buildParticles();
    });
    resizeObserver.observe(root);

    if (reducedMotion) {
      root.style.setProperty('--ml-badge-image-opacity', '1');
      context.clearRect(0, 0, width, height);
    } else {
      rafId = window.requestAnimationFrame(render);
    }

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [badgeSrc, durationMs, maxPixelSize, minPixelSize, particleCount, reducedMotion]);

  return (
    <div ref={rootRef} className={`madlabs-badge-loop ${reducedMotion ? 'is-reduced' : ''} ${className}`.trim()}>
      <img src={badgeSrc} alt="MAD LABS badge" className="madlabs-badge-image" />
      <canvas ref={canvasRef} className="madlabs-badge-canvas" aria-hidden />
    </div>
  );
};

export default BadgePixelLoop;
