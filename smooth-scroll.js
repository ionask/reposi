(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  if (reduceMotion) return;

  document.documentElement.classList.add('smooth-scroll-ready');

  let current = window.scrollY;
  let target = current;
  let velocity = 0;
  let raf = null;
  let lastTime = performance.now();

  const ease = 0.075;
  const maxDelta = 120;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const animate = (time) => {
    const dt = Math.min((time - lastTime) / 16.67, 2);
    lastTime = time;
    target += (current - target) * Math.min(1, ease * dt);
    velocity += (target - window.scrollY) * 0.08;
    velocity *= 0.82;
    const next = window.scrollY + (target - window.scrollY) * Math.min(1, 0.12 * dt);
    window.scrollTo(0, next);
    if (Math.abs(target - next) > 0.08 || Math.abs(velocity) > 0.05) raf = requestAnimationFrame(animate);
    else { raf = null; window.scrollTo(0, target); }
  };

  const requestSmooth = () => {
    if (!raf) {
      lastTime = performance.now();
      raf = requestAnimationFrame(animate);
    }
  };

  window.addEventListener('wheel', (event) => {
    if (event.ctrlKey) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const delta = clamp(event.deltaY, -maxDelta, maxDelta);
    current = clamp(current + delta, 0, maxScroll);
    event.preventDefault();
    requestSmooth();
  }, { passive: false });

  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - target) < 2) target = window.scrollY;
  }, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const destination = document.querySelector(id);
      if (!destination) return;
      event.preventDefault();
      const offset = document.querySelector('.site-header')?.offsetHeight || 0;
      const destinationY = Math.max(0, destination.getBoundingClientRect().top + window.scrollY - offset);
      current = destinationY;
      target = destinationY;
      requestSmooth();
    });
  });

  // Subtle velocity-driven skew gives the page a premium editorial feel.
  if (finePointer) {
    const sections = [...document.querySelectorAll('main section')];
    let previousY = window.scrollY;
    let skew = 0;
    let skewRaf = null;

    const updateSkew = () => {
      const delta = window.scrollY - previousY;
      previousY = window.scrollY;
      skew += (clamp(delta * -0.012, -0.35, 0.35) - skew) * 0.18;
      sections.forEach((section) => { section.style.setProperty('--scroll-skew', `${skew}deg`); });
      skewRaf = null;
    };

    window.addEventListener('scroll', () => {
      if (!skewRaf) skewRaf = requestAnimationFrame(updateSkew);
    }, { passive: true });
  }
})();
