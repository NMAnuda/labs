import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type WordmarkScrollStageProps = {
  reducedMotion?: boolean;
};

const wordmarkLogoSrc = `${import.meta.env.BASE_URL}brand/asset-1-2x.png`;

const WordmarkScrollStage: React.FC<WordmarkScrollStageProps> = ({ reducedMotion = false }) => {
  const stageRef = React.useRef<HTMLElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (reducedMotion) return;
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;

    const ctx = gsap.context(() => {
      // Scale up from slightly small as it enters viewport
      gsap.fromTo(
        card,
        { scale: 0.94, filter: 'blur(10px)', opacity: 0 },
        {
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          ease: 'power3.out',
          duration: 1,
          scrollTrigger: {
            trigger: stage,
            start: 'top 88%',
            end: 'top 30%',
            scrub: false,
            once: true,
          },
        }
      );

      // Subtle parallax on the logo image
      const logo = card.querySelector<HTMLElement>('.ml-wordmark-logo-image');
      if (logo) {
        gsap.to(logo, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        });
      }

      // Stagger nav links in
      const navLinks = card.querySelectorAll<HTMLElement>('.ml-wordmark-nav a');
      gsap.fromTo(
        navLinks,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.055,
          ease: 'power2.out',
          duration: 0.6,
          scrollTrigger: {
            trigger: stage,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, stage);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="identity" ref={stageRef} className="ml-wordmark-stage" aria-labelledby="ml-wordmark-title">
      <div className="ml-wordmark-sticky">
        <div ref={cardRef} className={`ml-wordmark-card ${reducedMotion ? 'is-reduced' : ''}`}>
          <div className="ml-wordmark-head">
            <div className="ml-wordmark-intro">
              <h2 id="ml-wordmark-title" className="ml-wordmark-title">
                Technology that scales
              </h2>
            </div>
            <div className="ml-wordmark-nav-wrap">
              <nav className="ml-wordmark-nav" aria-label="Identity links">
                <a href="#capabilities">Cloud Services</a>
                <a href="#capabilities">DevOps</a>
                <a href="#capabilities">AI/ML</a>
                <a href="#process">Security</a>
                <a href="#process">Consulting</a>
                <a href="#cta">Case Studies</a>
              </nav>
              <nav className="ml-wordmark-nav" aria-label="Use cases links">
                <a href="#systems">Resources</a>
                <a href="#cta">Pricing</a>
                <a href="#systems">Industries</a>
              </nav>
            </div>
          </div>

          <div className="ml-wordmark-display" aria-label="MAD LABS identity wordmark">
            <img src={wordmarkLogoSrc} alt="MAD LABS logo" className="ml-wordmark-logo-image" />
          </div>

          <div className="ml-wordmark-foot">
            <p className="ml-wordmark-foot-brand">MAD LABS</p>
            <div className="ml-wordmark-foot-links">
              <a href="#process">About Us</a>
              <a href="#capabilities">Services</a>
              <a href="#systems">Privacy Policy</a>
              <a href="#cta">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WordmarkScrollStage;
