import { useEffect, useRef, useState } from 'react';

type UseInViewOnceOptions = {
  threshold?: number;
  rootMargin?: string;
};

const useInViewOnce = (options: UseInViewOnceOptions = {}) => {
  const { threshold = 0.2, rootMargin = '0px 0px -10% 0px' } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setIsVisible(true);
          observer.unobserve(entry.target);
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, isVisible };
};

export default useInViewOnce;
