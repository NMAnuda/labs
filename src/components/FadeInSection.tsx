import React from 'react';
import useInViewOnce from '../hooks/useInViewOnce';

type FadeInSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
};

const FadeInSection: React.FC<FadeInSectionProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.12,
  rootMargin = '0px 0px -6% 0px',
}) => {
  const { ref, isVisible } = useInViewOnce({ threshold, rootMargin });

  return (
    <div
      ref={ref}
      className={`madlabs-reveal ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
