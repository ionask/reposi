(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  document.documentElement.classList.add('smooth-scroll-ready');

  const header = document.querySelector('.site-header');
  if (header) {
    header.style.position = 'fixed'; header.style.top = '0'; header.style.left = '0'; header.style.right = '0'; header.style.zIndex = '500';
    header.style.backdropFilter = 'blur(14px)'; header.style.webkitBackdropFilter = 'blur(14px)';
    const updateHeader = () => { const s = window.scrollY > 20; header.style.background = s ? 'rgba(9,9,9,.88)' : 'rgba(9,9,9,.58)'; header.style.boxShadow = s ? '0 10px 40px rgba(0,0,0,.22)' : 'none'; };
    window.addEventListener('scroll', updateHeader, { passive: true }); updateHeader();
  }

  let current = window.scrollY, target = current, raf = null, lastTime = performance.now();
  const ease = 0.2, maxDelta = 220;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = null; current = target = window.scrollY; };
  const animate = (time) => {
    const dt = Math.min((time - lastTime) / 16.67, 2); lastTime = time;
    target += (current - target) * Math.min(1, ease * dt);
    const next = window.scrollY + (target - window.scrollY) * Math.min(1, .3 * dt);
    window.scrollTo(0, next);
    if (Math.abs(target - next) > .12) raf = requestAnimationFrame(animate); else { raf = null; window.scrollTo(0, target); }
  };
  const requestSmooth = () => { if (!raf) { lastTime = performance.now(); raf = requestAnimationFrame(animate); } };

  if (!reduceMotion) {
    window.addEventListener('wheel', e => { if (e.ctrlKey) return; const max = document.documentElement.scrollHeight - innerHeight; current = clamp(current + clamp(e.deltaY, -maxDelta, maxDelta), 0, max); e.preventDefault(); requestSmooth(); }, { passive: false });
    window.addEventListener('scroll', () => { if (Math.abs(scrollY - target) < 2) current = target = scrollY; }, { passive: true });
  }

  const transition = document.createElement('div'); transition.className = 'contact-transition'; transition.innerHTML = '<div class="contact-transition-line"></div><div class="contact-transition-label">INK VISION <span>CONTACT</span></div>'; document.body.appendChild(transition);
  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
  const active = id => links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  const updateActive = () => { const marker = scrollY + innerHeight * .35; let hit = sections[0]; sections.forEach(s => { if (s.offsetTop <= marker) hit = s; }); if (hit) active(hit.id); };

  const goTo = (destination, isContact) => {
    if (!destination) return; const offset = header?.offsetHeight || 0;
    const y = Math.max(0, destination.getBoundingClientRect().top + scrollY - offset + 1); stop();
    if (!isContact || reduceMotion) { if (reduceMotion) scrollTo({ top: y, behavior: 'smooth' }); else { current = target = y; requestSmooth(); } history.replaceState(null, '', `#${destination.id}`); return; }
    transition.classList.remove('is-closing'); transition.classList.add('is-active'); document.body.classList.add('contact-transition-lock');
    setTimeout(() => { scrollTo(0, y); current = target = y; history.replaceState(null, '', '#contact'); requestAnimationFrame(() => { transition.classList.add('is-closing'); setTimeout(() => { transition.classList.remove('is-active','is-closing'); document.body.classList.remove('contact-transition-lock'); updateActive(); }, 400); }); }, 320);
  };

  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', e => { const id = link.getAttribute('href'); if (!id || id === '#') return; const dest = document.querySelector(id); if (!dest) return; e.preventDefault(); goTo(dest, id === '#contact'); }));
  let activeRaf = null; window.addEventListener('scroll', () => { if (!activeRaf) activeRaf = requestAnimationFrame(() => { updateActive(); activeRaf = null; }); }, { passive: true }); updateActive();

  if (finePointer && !reduceMotion) {
    const all = [...document.querySelectorAll('main section')]; let previous = scrollY, skew = 0, skewRaf = null;
    const update = () => { const d = scrollY - previous; previous = scrollY; skew += (clamp(d * -.012, -.35, .35) - skew) * .18; all.forEach(s => s.style.setProperty('--scroll-skew', `${skew}deg`)); skewRaf = null; };
    window.addEventListener('scroll', () => { if (!skewRaf) skewRaf = requestAnimationFrame(update); }, { passive: true });
  }
})();
