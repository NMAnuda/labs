import React from 'react';

type LogoDisintegrationSource = {
  src: string;
  targetRef: React.RefObject<HTMLElement | null>;
};

type LogoDisintegrationFieldProps = {
  className?: string;
  logoSources: readonly LogoDisintegrationSource[];
  progressRef: React.RefObject<number>;
  particleCount?: number;
  minPixelSize?: number;
  maxPixelSize?: number;
  color?: string;
  glowColor?: string;
  reducedMotion?: boolean;
};

type PixelPoint = {
  sourceX: number;
  sourceY: number;
  driftX: number;
  driftY: number;
  phase: number;
  depth: number;
  size: number;
};

type RectBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DrawSource = {
  image: HTMLImageElement;
  rect: RectBounds;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const mapRange = (value: number, start: number, end: number) => {
  if (end <= start) return 0;
  return clamp((value - start) / (end - start), 0, 1);
};
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

const getUnionBounds = (rects: RectBounds[]): RectBounds => {
  const first = rects[0];
  let left = first.x;
  let top = first.y;
  let right = first.x + first.width;
  let bottom = first.y + first.height;

  for (let index = 1; index < rects.length; index += 1) {
    const rect = rects[index];
    left = Math.min(left, rect.x);
    top = Math.min(top, rect.y);
    right = Math.max(right, rect.x + rect.width);
    bottom = Math.max(bottom, rect.y + rect.height);
  }

  return {
    x: left,
    y: top,
    width: Math.max(1, right - left),
    height: Math.max(1, bottom - top),
  };
};

const LogoDisintegrationField: React.FC<LogoDisintegrationFieldProps> = ({
  className = '',
  logoSources,
  progressRef,
  particleCount = 360,
  minPixelSize = 1.6,
  maxPixelSize = 3.2,
  color = '#f2f5ff',
  glowColor = 'rgba(242, 245, 255, 0.18)',
  reducedMotion = false,
}) => {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || logoSources.length === 0) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;
    let disposed = false;
    let points: PixelPoint[] = [];
    let imagesBySrc = new Map<string, HTMLImageElement>();
    const startedAt = performance.now();

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

    const getRectInHostSpace = (element: HTMLElement): RectBounds => {
      const hostRect = host.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left - hostRect.left,
        y: rect.top - hostRect.top,
        width: rect.width,
        height: rect.height,
      };
    };

    const getDrawSources = (): DrawSource[] => {
      const sources: DrawSource[] = [];
      for (const source of logoSources) {
        const image = imagesBySrc.get(source.src);
        const target = source.targetRef.current;
        if (!image || !target) continue;
        const rect = getRectInHostSpace(target);
        if (rect.width < 1 || rect.height < 1) continue;
        sources.push({ image, rect });
      }
      return sources;
    };

    const buildPointMap = (drawSources: DrawSource[]) => {
      if (drawSources.length === 0) {
        points = [];
        return;
      }

      const union = getUnionBounds(drawSources.map((source) => source.rect));
      const centerX = union.x + union.width * 0.5;
      const centerY = union.y + union.height * 0.5;
      const candidates: PixelPoint[] = [];

      for (const source of drawSources) {
        const sampleWidth = Math.max(56, Math.floor(source.rect.width / 3));
        const sampleHeight = Math.max(18, Math.floor(source.rect.height / 3));
        const offscreen = document.createElement('canvas');
        offscreen.width = sampleWidth;
        offscreen.height = sampleHeight;
        const offscreenCtx = offscreen.getContext('2d');
        if (!offscreenCtx) continue;

        offscreenCtx.clearRect(0, 0, sampleWidth, sampleHeight);
        offscreenCtx.drawImage(source.image, 0, 0, sampleWidth, sampleHeight);
        const data = offscreenCtx.getImageData(0, 0, sampleWidth, sampleHeight).data;

        for (let y = 0; y < sampleHeight; y += 1) {
          for (let x = 0; x < sampleWidth; x += 1) {
            const index = (y * sampleWidth + x) * 4;
            const alpha = data[index + 3];
            if (alpha < 58) continue;

            const sourceX = source.rect.x + (x + 0.5) * (source.rect.width / sampleWidth);
            const sourceY = source.rect.y + (y + 0.5) * (source.rect.height / sampleHeight);
            const ux = (sourceX - centerX) / Math.max(1, union.width * 0.5);
            const uy = (sourceY - centerY) / Math.max(1, union.height * 0.5);
            const radial = Math.hypot(ux, uy) || 1;
            const directionX = ux / radial;
            const directionY = uy / radial;
            const edgeBias = clamp(radial * 1.06, 0, 1);

            const driftDistance = 8 + edgeBias * 18 + Math.random() * 9;
            const driftX = directionX * driftDistance + (Math.random() - 0.5) * 6;
            const driftY = directionY * driftDistance * 0.76 + 4 + (Math.random() - 0.5) * 6;

            candidates.push({
              sourceX,
              sourceY,
              driftX,
              driftY,
              phase: clamp((1 - edgeBias) * 0.45 + Math.random() * 0.55, 0, 1),
              depth: 0.6 + Math.random() * 1.2,
              size: minPixelSize + Math.random() * (maxPixelSize - minPixelSize),
            });
          }
        }
      }

      if (candidates.length === 0) {
        points = [];
        return;
      }

      const target = Math.max(110, Math.floor(width < 768 ? particleCount * 0.62 : particleCount));
      if (candidates.length <= target) {
        points = candidates;
        return;
      }

      const stride = candidates.length / target;
      const reduced: PixelPoint[] = [];
      for (let index = 0; index < target; index += 1) {
        reduced.push(candidates[Math.floor(index * stride)]);
      }
      points = reduced;
    };

    const rebuild = () => {
      buildPointMap(getDrawSources());
    };

    const render = (now: number) => {
      if (disposed) return;
      context.clearRect(0, 0, width, height);

      if (reducedMotion || points.length === 0) {
        rafId = window.requestAnimationFrame(render);
        return;
      }

      const progress = clamp(progressRef.current, 0, 1);
      const split = easeOutCubic(mapRange(progress, 0.08, 0.78));
      const ghost = mapRange(progress, 0.92, 1);
      const elapsed = now - startedAt;

      for (const point of points) {
        const local = clamp((split - point.phase * 0.44) / 0.56, 0, 1);
        if (local < 0.015) continue;

        const eased = easeOutCubic(local);
        const driftScale = eased * (0.84 + point.depth * 0.12);
        const depthFactor = 1 / point.depth;
        const wave = (1 - local * 0.64) * 1.6 * depthFactor;

        const x =
          point.sourceX +
          point.driftX * driftScale +
          Math.sin(elapsed * (0.001 + point.depth * 0.00018) + point.phase * 7.2) * wave;
        const y =
          point.sourceY +
          point.driftY * driftScale +
          Math.cos(elapsed * (0.0011 + point.depth * 0.00016) + point.phase * 6.4) * wave;

        const alpha = clamp((local - 0.04) * 0.74 - ghost * 0.22, 0, 0.68);
        if (alpha <= 0.01) continue;

        context.globalAlpha = alpha;
        context.fillStyle = color;
        context.shadowColor = glowColor;
        context.shadowBlur = 1 + (1 - local) * 1.8;
        context.fillRect(x - point.size * 0.5, y - point.size * 0.5, point.size, point.size);
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      rafId = window.requestAnimationFrame(render);
    };

    resizeCanvas();

    const loadImage = (src: string) =>
      new Promise<[string, HTMLImageElement | null]>((resolve) => {
        const image = new Image();
        image.decoding = 'async';
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve([src, image]);
        image.onerror = () => resolve([src, null]);
        image.src = src;
      });

    const isLoadedEntry = (
      entry: [string, HTMLImageElement | null],
    ): entry is [string, HTMLImageElement] => entry[1] !== null;

    const loadSources = async () => {
      const uniqueSources = Array.from(
        new Set(
          logoSources
            .map((source) => source.src.trim())
            .filter((source) => source.length > 0),
        ),
      );
      const entries = await Promise.all(uniqueSources.map((src) => loadImage(src)));
      if (disposed) return;
      imagesBySrc = new Map(entries.filter(isLoadedEntry));
      rebuild();
    };

    void loadSources();

    const resizeObserver = new ResizeObserver(() => {
      if (disposed) return;
      resizeCanvas();
      rebuild();
    });
    resizeObserver.observe(host);
    for (const source of logoSources) {
      const node = source.targetRef.current;
      if (node) resizeObserver.observe(node);
    }

    rafId = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [
    color,
    glowColor,
    logoSources,
    maxPixelSize,
    minPixelSize,
    particleCount,
    progressRef,
    reducedMotion,
  ]);

  return (
    <div ref={hostRef} className={`madlabs-logo-disintegrate ${className}`.trim()}>
      <canvas ref={canvasRef} className="madlabs-logo-disintegrate-canvas" aria-hidden />
    </div>
  );
};

export default LogoDisintegrationField;
