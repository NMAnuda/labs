import React from 'react';

type HeroParticleFieldProps = {
  className?: string;
  particleCount?: number;
  pixelSize?: number;
  speed?: number;
  opacity?: number;
  glowIntensity?: number;
  scrollSensitivity?: number;
  repelRadius?: number;
  repelForce?: number;
  color?: string;
  glowColor?: string;
  progressRef?: React.RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  depth: number;
  phase: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const HeroParticleField: React.FC<HeroParticleFieldProps> = ({
  className = '',
  particleCount = 160,
  pixelSize = 8,
  speed = 0.55,
  opacity = 0.18,
  glowIntensity = 0.6,
  scrollSensitivity = 1,
  repelRadius = 72,
  repelForce = 10,
  color = '#eeeeee',
  glowColor = 'rgba(238, 238, 238, 0.2)',
  progressRef,
  reducedMotion = false,
}) => {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const pointerRef = React.useRef<PointerState>({ x: 0, y: 0, active: false });

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };

    const onLeave = () => {
      pointerRef.current.active = false;
    };

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);

    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
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
    let particles: Particle[] = [];
    let startedAt = performance.now();

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() * 2 - 1) * 0.28,
      vy: (Math.random() * 2 - 1) * 0.22,
      size: pixelSize * (0.35 + Math.random() * 0.45),
      depth: 0.45 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
    });

    const resizeCanvas = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: particleCount }, createParticle);
    };

    const getScrollProgress = () => {
      if (reducedMotion) return 1;
      const node = progressRef?.current ?? host;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const sensitivity = Math.max(0.45, scrollSensitivity);
      const maxScroll = Math.max(1, rect.height - viewport * (1 - Math.min(0.85, sensitivity * 0.5)));
      return clamp(-rect.top / maxScroll, 0, 1);
    };

    const render = (now: number) => {
      if (disposed) return;

      const elapsed = now - startedAt;
      const scrollProgress = getScrollProgress();
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const depthFactor = 1 / particle.depth;

        const speedScale = reducedMotion ? 0.18 : speed;
        particle.x += particle.vx * speedScale * particle.depth + scrollProgress * 0.05 * depthFactor;
        particle.y += particle.vy * speedScale * particle.depth;

        if (particle.x < -24) particle.x = width + 24;
        if (particle.x > width + 24) particle.x = -24;
        if (particle.y < -24) particle.y = height + 24;
        if (particle.y > height + 24) particle.y = -24;

        let x =
          particle.x +
          Math.sin(elapsed * 0.00038 * particle.depth + particle.phase) * (2.2 * depthFactor) +
          scrollProgress * 10 * depthFactor;
        let y =
          particle.y +
          Math.cos(elapsed * 0.00033 * particle.depth + particle.phase) * (1.6 * depthFactor) +
          scrollProgress * (particle.depth - 1) * 4;

        const pointer = pointerRef.current;
        if (pointer.active && !reducedMotion) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < repelRadius && distance > 0.0001) {
            const force = Math.pow(1 - distance / repelRadius, 2) * repelForce * depthFactor;
            x += (dx / distance) * force;
            y += (dy / distance) * force;
          }
        }

        const alpha = opacity * (0.35 + depthFactor * 0.9) * (0.76 + scrollProgress * 0.24);
        context.globalAlpha = alpha;
        context.fillStyle = color;
        context.shadowColor = glowColor;
        context.shadowBlur = 10 * glowIntensity * depthFactor;

        const size = particle.size * (1 + scrollProgress * 0.06);
        context.fillRect(x - size * 0.5, y - size * 0.5, size, size);
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      rafId = window.requestAnimationFrame(render);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(host);
    rafId = window.requestAnimationFrame(render);

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
    glowIntensity,
    opacity,
    particleCount,
    pixelSize,
    progressRef,
    reducedMotion,
    repelForce,
    repelRadius,
    scrollSensitivity,
    speed,
  ]);

  return (
    <div ref={hostRef} className={`hero-particle-field ${className}`.trim()}>
      <canvas ref={canvasRef} className="hero-particle-canvas" aria-hidden />
    </div>
  );
};

export default HeroParticleField;
