import React from 'react';

type LogoAssemblyFieldProps = {
  className?: string;
  logoSrc: string;
  progressRef: React.RefObject<HTMLElement | null>;
  particleCount?: number;
  pixelSize?: number;
  color?: string;
  glowColor?: string;
  noiseOpacity?: number;
  reducedMotion?: boolean;
};

type AssemblyPoint = {
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  phase: number;
  size: number;
  depth: number;
  anchor: boolean;
  driftRadius: number;
  driftSpeed: number;
  driftPhase: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const mapRange = (value: number, start: number, end: number) => {
  if (end <= start) return 0;
  return clamp((value - start) / (end - start), 0, 1);
};

const LogoAssemblyField: React.FC<LogoAssemblyFieldProps> = ({
  className = '',
  logoSrc,
  progressRef,
  particleCount = 560,
  pixelSize = 6,
  color = '#eeeeee',
  glowColor = 'rgba(238, 238, 238, 0.2)',
  noiseOpacity = 0.04,
  reducedMotion = false,
}) => {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const pointerRef = React.useRef<PointerState>({ x: 0, y: 0, active: false });

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerleave', onPointerLeave);

    return () => {
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  React.useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let disposed = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let points: AssemblyPoint[] = [];
    const startTime = performance.now();

    const resizeCanvas = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const getProgress = () => {
      if (reducedMotion) return 1;

      const sceneNode = progressRef.current;
      if (!sceneNode) return 0;

      const rect = sceneNode.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const maxScroll = Math.max(1, rect.height - viewport);
      return clamp(-rect.top / maxScroll, 0, 1);
    };

    const createPointsFromLogo = (image: HTMLImageElement) => {
      const sampleWidth = Math.max(80, Math.floor(width / pixelSize));
      const sampleHeight = Math.max(40, Math.floor(height / pixelSize));
      const offscreen = document.createElement('canvas');
      offscreen.width = sampleWidth;
      offscreen.height = sampleHeight;
      const offscreenCtx = offscreen.getContext('2d');
      if (!offscreenCtx) return;

      offscreenCtx.clearRect(0, 0, sampleWidth, sampleHeight);

      const drawScale = Math.min(sampleWidth / image.naturalWidth, sampleHeight / image.naturalHeight) * 0.9;
      const drawWidth = image.naturalWidth * drawScale;
      const drawHeight = image.naturalHeight * drawScale;
      const drawX = (sampleWidth - drawWidth) * 0.5;
      const drawY = (sampleHeight - drawHeight) * 0.5;
      offscreenCtx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

      const imageData = offscreenCtx.getImageData(0, 0, sampleWidth, sampleHeight).data;

      const mappedPoints: AssemblyPoint[] = [];

      for (let y = 0; y < sampleHeight; y += 1) {
        for (let x = 0; x < sampleWidth; x += 1) {
          const index = (y * sampleWidth + x) * 4;
          const alphaChannel = imageData[index + 3];
          if (alphaChannel < 56) continue;

          const targetX = (x + 0.5) * pixelSize;
          const targetY = (y + 0.5) * pixelSize;
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.min(width, height) * (0.32 + Math.random() * 0.78);

          mappedPoints.push({
            targetX,
            targetY,
            startX: width * 0.5 + Math.cos(angle) * radius,
            startY: height * 0.5 + Math.sin(angle) * radius,
            phase: Math.random(),
            size: pixelSize * (0.72 + Math.random() * 0.42),
            depth: 0.52 + Math.random() * 1.32,
            anchor: Math.random() < 0.42,
            driftRadius: 6 + Math.random() * 28,
            driftSpeed: 0.0012 + Math.random() * 0.0022,
            driftPhase: Math.random() * Math.PI * 2,
          });
        }
      }

      if (mappedPoints.length > particleCount) {
        const reduced: AssemblyPoint[] = [];
        const stride = mappedPoints.length / particleCount;
        for (let index = 0; index < particleCount; index += 1) {
          reduced.push(mappedPoints[Math.floor(index * stride)]);
        }
        points = reduced;
      } else {
        points = mappedPoints;
      }
    };

    const render = (now: number) => {
      if (disposed) return;
      context.clearRect(0, 0, width, height);

      const elapsed = now - startTime;
      const progress = getProgress();
      const assemble = mapRange(progress, 0.2, 0.65);
      const hold = mapRange(progress, 0.9, 1);
      const pointer = pointerRef.current;

      for (const point of points) {
        const localPhase = clamp((assemble - point.phase * 0.42) / 0.58, 0, 1);
        const baseAttach = point.anchor ? 0.4 : 0.06;
        const attach = reducedMotion ? 1 : clamp(baseAttach + localPhase * (1 - baseAttach), 0, 1);
        const magnetic = attach * attach;
        const depthFactor = 1 / point.depth;

        const idleX =
          point.startX +
          Math.sin(elapsed * point.driftSpeed + point.driftPhase) * point.driftRadius * depthFactor;
        const idleY =
          point.startY +
          Math.cos(elapsed * point.driftSpeed * 0.82 + point.driftPhase) * point.driftRadius * 0.72 * depthFactor;

        let x = idleX + (point.targetX - idleX) * magnetic;
        let y = idleY + (point.targetY - idleY) * magnetic;

        const directionalFlow = mapRange(progress, 0.05, 0.6) * 12;
        x += directionalFlow * depthFactor * (1 - attach);

        if (pointer.active && !reducedMotion) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 78 && distance > 0.0001) {
            const force = Math.pow(1 - distance / 78, 2) * 14 * depthFactor * (1 - attach * 0.7);
            x += (dx / distance) * force;
            y += (dy / distance) * force;
          }
        }

        const alpha = clamp(0.12 + attach * 0.88, 0, 1);
        const size = point.size * (0.86 + magnetic * 0.24);

        context.globalAlpha = alpha;
        context.fillStyle = color;
        context.shadowColor = glowColor;
        context.shadowBlur = (1 - attach) * 9 + hold * 8;
        context.fillRect(x - size * 0.5, y - size * 0.5, size, size);
      }

      if (!reducedMotion && noiseOpacity > 0.002) {
        context.shadowBlur = 0;
        context.globalAlpha = noiseOpacity;
        context.fillStyle = color;
        for (let index = 0; index < 16; index += 1) {
          context.fillRect(Math.random() * width, Math.random() * height, 1, 1);
        }
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      rafId = window.requestAnimationFrame(render);
    };

    resizeCanvas();

    const image = new Image();
    image.decoding = 'async';
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (disposed) return;
      createPointsFromLogo(image);
      if (!rafId) {
        rafId = window.requestAnimationFrame(render);
      }
    };
    image.src = logoSrc;

    const resizeObserver = new ResizeObserver(() => {
      if (disposed) return;
      resizeCanvas();
      if (image.complete && image.naturalWidth > 0) {
        createPointsFromLogo(image);
      }
    });
    resizeObserver.observe(host);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [
    color,
    glowColor,
    logoSrc,
    noiseOpacity,
    particleCount,
    pixelSize,
    progressRef,
    reducedMotion,
  ]);

  return (
    <div ref={hostRef} className={`madlabs-logo-assembly ${className}`.trim()}>
      <canvas ref={canvasRef} className="madlabs-logo-assembly-canvas" aria-hidden />
    </div>
  );
};

export default LogoAssemblyField;
