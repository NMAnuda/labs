import React from 'react';

type UseScrollSceneProgressOptions = {
  sceneRef: React.RefObject<HTMLElement | null>;
  reducedMotion: boolean;
  onProgress?: (progress: number) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const useScrollSceneProgress = ({
  sceneRef,
  reducedMotion,
  onProgress,
}: UseScrollSceneProgressOptions) => {
  const progressRef = React.useRef(0);

  React.useEffect(() => {
    const sceneNode = sceneRef.current;
    if (!sceneNode) return;

    if (reducedMotion) {
      progressRef.current = 0;
      onProgress?.(0);
      return;
    }

    let rafId = 0;
    let previous = -1;

    const measure = () => {
      const rect = sceneNode.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const maxScroll = Math.max(1, rect.height - viewport);
      const progress = clamp(-rect.top / maxScroll, 0, 1);

      progressRef.current = progress;
      if (Math.abs(progress - previous) > 0.0015) {
        onProgress?.(progress);
        previous = progress;
      }
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        measure();
      });
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [onProgress, reducedMotion, sceneRef]);

  return progressRef;
};

export default useScrollSceneProgress;
