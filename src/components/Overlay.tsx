import React from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LogoLoop from './LogoLoop';
import LogoLoopComponent from './LogoLoopComponent';
import LightRays from './LightRays';
import FadeInSection from './FadeInSection';
import TypewriterText from './TypewriterText';
import WordmarkScrollStage from './WordmarkScrollStage';
import CustomCursor from './CustomCursor';
import ThemeToggle from './ThemeToggle';
import Prism from './Prism';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const techLogos = [
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', alt: 'AWS', title: 'AWS' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', alt: 'Kubernetes', title: 'Kubernetes' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', alt: 'Docker', title: 'Docker' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', alt: 'React', title: 'React' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', alt: 'Python', title: 'Python' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', alt: 'TensorFlow', title: 'TensorFlow' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', alt: 'PostgreSQL', title: 'PostgreSQL' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', alt: 'Redis', title: 'Redis' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg', alt: 'GraphQL', title: 'GraphQL' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', alt: 'TypeScript', title: 'TypeScript' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', alt: 'Node.js', title: 'Node.js' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg', alt: 'Terraform', title: 'Terraform' },
];

const typedLines = [
  'We design and engineer products from idea to launch.',
  'Web platforms, internal tools, and AI-enabled workflows.',
  'Fast delivery. Clean architecture. Real outcomes.',
  'Built for growing teams that move fast.',
];

const capabilities = [
  {
    title: 'Web & Product Engineering',
    detail: 'Full-stack web apps, internal tools, and SaaS platforms built to ship fast and scale further.',
  },
  {
    title: 'AI-Enabled Workflows',
    detail: 'Practical AI integrations - document processing, intelligent search, and workflow automation.',
  },
  {
    title: 'Cloud & Infrastructure',
    detail: 'AWS-native deployments, containerized services, and CI/CD pipelines that reduce ops overhead.',
  },
  {
    title: 'Product Design & UX',
    detail: 'Interface design grounded in user research. Prototypes to production-ready design systems.',
  },
];

const processSteps = [
  {
    title: 'Discovery',
    detail: 'Understand the problem, the users, and the constraints before writing a line of code.',
  },
  {
    title: 'Design',
    detail: 'Wireframes, architecture decisions, and a delivery plan agreed before build begins.',
  },
  {
    title: 'Build',
    detail: 'Iterative development with weekly demos. No black-box sprints.',
  },
  {
    title: 'Launch',
    detail: 'Staged rollout, monitoring, and a handover that leaves your team self-sufficient.',
  },
  {
    title: 'Support',
    detail: 'Ongoing retainer or ad-hoc. We stay available after go-live.',
  },
];

const systems = [
  {
    title: 'React & Next.js',
    detail: 'Fast, accessible frontends with server-side rendering and edge delivery.',
  },
  {
    title: 'AWS & Terraform',
    detail: 'Infrastructure as code. Reproducible, auditable, cost-optimized cloud environments.',
  },
  {
    title: 'Python & Node.js',
    detail: 'Backend services, REST and GraphQL APIs, background workers, and data pipelines.',
  },
  {
    title: 'PostgreSQL & Redis',
    detail: 'Relational data modeling, caching strategies, and search built for production load.',
  },
];

const footerLinks = [
  { label: 'Services', href: '#capabilities' },
  { label: 'Process', href: '#process' },
  { label: 'Stack', href: '#systems' },
  { label: 'Start a Project', href: '#cta' },
];

type ThemeMode = 'dark' | 'light';

const getThemeMode = (): ThemeMode => {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
};

const Overlay: React.FC = () => {
  const [navScrolled, setNavScrolled] = React.useState(false);
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(getThemeMode);
  const prefersReducedMotion = usePrefersReducedMotion();
  const heroRef = React.useRef<HTMLElement>(null);
  const heroTextRef = React.useRef<HTMLDivElement>(null);
  const heroBadgeRef = React.useRef<HTMLDivElement>(null);
  const pageRef = React.useRef<HTMLDivElement>(null);
  const isLightTheme = themeMode === 'light';

  React.useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setThemeMode(getThemeMode());

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('storage', syncTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', syncTheme);
    };
  }, []);

  React.useEffect(() => {
    let rafId = 0;

    const update = () => {
      const next = window.scrollY > 12;
      setNavScrolled((prev) => (prev === next ? prev : next));

      if (!prefersReducedMotion) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
        document.documentElement.style.setProperty('--scroll-progress', String(progress.toFixed(4)));
      }
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const page = pageRef.current;
    if (!page) return;

    const onMouseMove = (e: MouseEvent) => {
      const cards = page.querySelectorAll<HTMLElement>('.ml-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const rotateX = ((mouseY - centerY) / centerY) * -3;
        const rotateY = ((mouseX - centerX) / centerX) * 3;

        if (mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height) {
          card.style.transform = `translateY(-4px) scale(1.008) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        }
      });
    };

    const onMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('ml-card')) {
        target.style.transform = '';
      }
    };

    page.addEventListener('mousemove', onMouseMove);
    page.addEventListener('mouseleave', onMouseLeave, true);
    return () => {
      page.removeEventListener('mousemove', onMouseMove);
      page.removeEventListener('mouseleave', onMouseLeave, true);
    };
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const badge = heroBadgeRef.current;
    if (!badge) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = badge.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      const shell = badge.querySelector<HTMLElement>('.ml-hero-badge-shell');
      if (shell) {
        shell.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    };

    const onMouseLeave = () => {
      const shell = badge.querySelector<HTMLElement>('.ml-hero-badge-shell');
      if (shell) {
        shell.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }
    };

    badge.addEventListener('mousemove', onMouseMove);
    badge.addEventListener('mouseleave', onMouseLeave);

    return () => {
      badge.removeEventListener('mousemove', onMouseMove);
      badge.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [prefersReducedMotion]);

  React.useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const context = gsap.context(() => {
      const text = heroTextRef.current;
      const badge = heroBadgeRef.current;
      if (!text || !badge) return;

      const parts = Array.from(text.querySelectorAll('[data-hero-part]'));
      gsap.set(parts, { opacity: 0, y: 22, filter: 'blur(8px)' });
      gsap.set(badge, { opacity: 0, y: 28, scale: 0.96, filter: 'blur(8px)' });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(parts, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.84,
        stagger: 0.1,
      }).to(
        badge,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.96,
        },
        '-=0.55'
      );
    }, heroRef);

    return () => context.revert();
  }, [prefersReducedMotion]);

  React.useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      const sections = page.querySelectorAll<HTMLElement>('.ml-section');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              once: true,
            },
          }
        );

        const muted = section.classList.contains('ml-section-muted');
        if (muted) {
          gsap.to(section, {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }
      });
    }, page);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={pageRef} className="ml-page" data-nav-scrolled={navScrolled ? 'true' : 'false'}>
      {!prefersReducedMotion && <CustomCursor />}
      {!prefersReducedMotion && <div className="ml-scroll-indicator" aria-hidden />}
      {!prefersReducedMotion && (
        <LightRays
          raysOrigin="top-center"
          raysColor="#a4c2ff"
          raysSpeed={0.8}
          lightSpread={0.6}
          rayLength={2.5}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0.05}
          distortion={0.02}
          fadeDistance={1.2}
          saturation={0.9}
        />
      )}
      <div className="ml-bg-layer ml-bg-glow" aria-hidden />
      <div className="ml-bg-layer ml-bg-grid" aria-hidden />
      <div className="ml-bg-layer ml-bg-vignette" aria-hidden />
      {!prefersReducedMotion && (
        <>
          <div className="ml-ambient-orb ml-ambient-orb-a" aria-hidden />
          <div className="ml-ambient-orb ml-ambient-orb-b" aria-hidden />
          <div className="ml-ambient-orb ml-ambient-orb-c" aria-hidden />
        </>
      )}

      <header className="ml-nav-wrap">
        <div className="ml-nav-shell">
          <Link to="/" className="ml-brand" aria-label="MAD LABS home">
            <img src="/brand/asset-7-custom-2x.png" alt="" className="ml-brand-mark" />
            <img src="/brand/asset-1-wordmark-2x.png" alt="MAD LABS" className="ml-brand-wordmark" />
          </Link>

          <nav className="ml-nav-links" aria-label="Primary">
            <a href="#capabilities" className="ml-nav-link">Services</a>
            <a href="#process" className="ml-nav-link">Process</a>
            <a href="#cta" className="ml-nav-link">Careers</a>
            <a href="#systems" className="ml-nav-link">Contact</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ThemeToggle />
            <Link to="/login" className="ml-nav-cta">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="ml-main">
        <section id="hero" ref={heroRef} className="ml-hero ml-chain-section" data-chain-index="0" aria-labelledby="ml-hero-title">
          <div className="ml-container ml-hero-grid">
            <div ref={heroTextRef} className="ml-hero-copy">
              <p className="ml-eyebrow" data-hero-part>SOFTWARE STUDIO</p>
              <h1 id="ml-hero-title" className="ml-hero-title" data-hero-part>
                We build fast, scalable digital products.
              </h1>
              <div className="ml-hero-type" data-hero-part>
                <TypewriterText
                  lines={typedLines}
                  reducedMotion={prefersReducedMotion}
                  typingSpeed={30}
                  deletingSpeed={20}
                  pauseMs={1900}
                  gapMs={380}
                />
              </div>
              <div className="ml-hero-actions" data-hero-part>
                <a href="#cta" className="ml-btn ml-btn-primary">Start a Project</a>
                <a href="#capabilities" className="ml-btn ml-btn-ghost">Our Services</a>
              </div>
            </div>

            <div ref={heroBadgeRef} className="ml-hero-visual">
              <div className="ml-hero-badge-halo" aria-hidden />
              <div className="ml-hero-badge-shell">
                <LogoLoop logoSrc="/brand/asset-7-custom-2x.png" reducedMotion={prefersReducedMotion} />
              </div>
            </div>
          </div>
          {!prefersReducedMotion && (
            <div className="ml-scroll-hint" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
              <span>Scroll to explore</span>
            </div>
          )}
        </section>

        <div className="ml-logo-ribbon">
          <LogoLoopComponent
            logos={techLogos}
            speed={80}
            direction="left"
            logoHeight={40}
            gap={48}
            hoverSpeed={20}
            scaleOnHover
            fadeOut
            ariaLabel="Technology stack"
          />
        </div>

        <section id="capabilities" className="ml-section ml-chain-section" data-chain-index="1">
          <div className="ml-container">
            <FadeInSection className="ml-section-head">
              <p className="ml-section-eyebrow">What We Do</p>
              <h2 className="ml-section-title">End-to-end product delivery.</h2>
              <p className="ml-section-bridge">From a rough brief to a shipped product - we cover design, engineering, and infrastructure under one roof.</p>
            </FadeInSection>

            <div className="ml-cap-grid">
              {capabilities.map((item, index) => (
                <FadeInSection key={item.title} delay={index * 90} className="ml-card ml-cap-card">
                  <p className="ml-card-index">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="ml-card-title">{item.title}</h3>
                  <p className="ml-card-copy">{item.detail}</p>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="ml-section ml-section-muted ml-chain-section" data-chain-index="2">
          <div className="ml-container">
            <FadeInSection className="ml-section-head">
              <p className="ml-section-eyebrow">How We Work</p>
              <h2 className="ml-section-title">No surprises. Just delivery.</h2>
              <p className="ml-section-bridge">A transparent process that keeps you informed at every stage - from first call to go-live.</p>
            </FadeInSection>

            <div className="ml-process-grid">
              {processSteps.map((step, index) => (
                <FadeInSection key={step.title} delay={index * 80} className="ml-card ml-process-card">
                  <p className="ml-card-index">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="ml-card-title">{step.title}</h3>
                  <p className="ml-card-copy">{step.detail}</p>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        <section id="systems" className="ml-section ml-chain-section" data-chain-index="3">
          <div className="ml-container">
            <FadeInSection className="ml-section-head">
              <p className="ml-section-eyebrow">Our Stack</p>
              <h2 className="ml-section-title">Boring tech that ships.</h2>
              <p className="ml-section-bridge">We choose proven tools over hype. Every technology in our stack has a reason to be there.</p>
            </FadeInSection>

            <div className="ml-systems-grid">
              {systems.map((item, index) => (
                <FadeInSection key={item.title} delay={index * 100} className="ml-card ml-system-card">
                  <h3 className="ml-card-title">{item.title}</h3>
                  <p className="ml-card-copy">{item.detail}</p>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="ml-section ml-section-muted ml-final-cta-wrap ml-chain-section" data-chain-index="4">
          <div className="ml-container">
            <FadeInSection className="ml-final-cta">
              {!prefersReducedMotion && (
                <div className={`ml-final-cta-prism ${isLightTheme ? 'is-light' : 'is-dark'}`} aria-hidden>
                  <Prism
                    animationType="rotate"
                    timeScale={isLightTheme ? 0.34 : 0.5}
                    height={isLightTheme ? 3.1 : 3.5}
                    baseWidth={5.5}
                    scale={isLightTheme ? 3.05 : 3.6}
                    hueShift={isLightTheme ? -0.22 : 0}
                    colorFrequency={isLightTheme ? 1.18 : 1}
                    noise={0}
                    glow={isLightTheme ? 0.72 : 1}
                    bloom={isLightTheme ? 0.74 : 1}
                    suspendWhenOffscreen
                  />
                </div>
              )}
              <div className="ml-final-cta-content">
                <p className="ml-section-eyebrow">Start a Project</p>
                <h2 className="ml-final-title">Got something to build?</h2>
                <p className="ml-final-copy">
                  Tell us what you're working on. We'll respond within one business day with a clear next step.
                </p>
                <Link to="/login" className="ml-btn ml-btn-primary">Book a Discovery Call</Link>
              </div>
            </FadeInSection>
          </div>
        </section>

        <WordmarkScrollStage reducedMotion={prefersReducedMotion} />
      </main>

      <footer className="ml-footer">
        <div className="ml-container ml-footer-inner">
          <div>
            <p className="ml-footer-brand">MAD LABS</p>
            <p className="ml-footer-line">Software studio. Design, engineering, and cloud - under one roof.</p>
          </div>
          <div className="ml-footer-links">
            {footerLinks.map((item) => (
              <a key={item.label} href={item.href}>{item.label}</a>
            ))}
          </div>
          <p className="ml-footer-copy">&copy; {new Date().getFullYear()} MAD LABS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Overlay;