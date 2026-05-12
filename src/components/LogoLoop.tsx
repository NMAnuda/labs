import React from 'react';

type LogoLoopProps = {
  logoSrc: string;
  reducedMotion?: boolean;
};

const LogoLoop: React.FC<LogoLoopProps> = ({ logoSrc, reducedMotion = false }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      color: string;
      speed: number;
    }> = [];

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(2, 2);
    };

    const extractPixels = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      const size = 200;
      tempCanvas.width = size;
      tempCanvas.height = size;

      const scale = Math.min(size / img.width, size / img.height);
      const x = (size - img.width * scale) / 2;
      const y = (size - img.height * scale) / 2;

      tempCtx.drawImage(img, x, y, img.width * scale, img.height * scale);
      const imageData = tempCtx.getImageData(0, 0, size, size);

      particles = [];
      const step = 3;

      for (let y = 0; y < size; y += step) {
        for (let x = 0; x < size; x += step) {
          const i = (y * size + x) * 4;
          const alpha = imageData.data[i + 3];

          if (alpha > 128) {
            const centerX = canvas.width / 4;
            const centerY = canvas.height / 4;
            const targetX = (x / size) * (canvas.width / 2) + centerX / 2;
            const targetY = (y / size) * (canvas.height / 2) + centerY / 2;

            particles.push({
              x: centerX + (Math.random() - 0.5) * 400,
              y: centerY + (Math.random() - 0.5) * 400,
              targetX,
              targetY,
              size: 2 + Math.random() * 2,
              color: `rgba(164, 194, 255, ${0.6 + Math.random() * 0.4})`,
              speed: 0.02 + Math.random() * 0.03,
            });
          }
        }
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(3, 6, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

      particles.forEach((p) => {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;

        p.x += dx * p.speed;
        p.y += dy * p.speed;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    img.onload = () => {
      resize();
      extractPixels();
      animate();
    };

    img.src = logoSrc;

    window.addEventListener('resize', () => {
      resize();
      extractPixels();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [logoSrc, reducedMotion]);

  if (reducedMotion) {
    return (
      <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
        <img src={logoSrc} alt="Logo" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default LogoLoop;
