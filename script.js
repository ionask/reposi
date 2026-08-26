const cursor = document.querySelector('.cursor-glow');

if (cursor && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursor.animate(
      { left: `${event.clientX}px`, top: `${event.clientY}px` },
      { duration: 500, fill: 'forwards', easing: 'cubic-bezier(.2,.75,.25,1)' }
    );
  }, { passive: true });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -30px' });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const heroImage = document.querySelector('[data-parallax]');
if (heroImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY * 0.14, 85);
      const scale = 1.065 + Math.min(window.scrollY / 9000, .025);
      heroImage.style.transform = `scale(${scale}) translate3d(0, ${y}px, 0)`;
      ticking = false;
    });
  }, { passive: true });
}

if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 3}deg) rotateX(${y * -3}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('mobile-open', !open);
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('mobile-open');
    });
  });
}

const style = document.createElement('style');
style.textContent = `
@media (max-width:900px){
  .desktop-nav.mobile-open{display:flex;position:absolute;top:76px;left:0;right:0;margin:0;padding:24px 7vw 30px;background:rgba(9,9,9,.98);border-bottom:1px solid rgba(255,255,255,.1);flex-direction:column;gap:12px;backdrop-filter:blur(16px);animation:menuIn .35s ease both}
  .desktop-nav.mobile-open a{font-size:12px;padding:12px 0}
}
@keyframes menuIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}

/* Cinematic hero */
.hero{isolation:isolate;background:#050505}
.hero-image{transform:scale(1.065);transition:transform 1.8s cubic-bezier(.16,1,.3,1),filter 1.8s ease;filter:saturate(.62) contrast(1.12) brightness(.72)}
.hero:before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(circle at 72% 48%,rgba(201,167,106,.10),transparent 26%),linear-gradient(180deg,rgba(0,0,0,.28),transparent 35%,rgba(0,0,0,.45))}
.hero-sheen{position:absolute;inset:-20%;z-index:1;pointer-events:none;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.055) 48%,transparent 58%);transform:translateX(-80%) rotate(0deg);animation:heroSheen 7s cubic-bezier(.2,.65,.2,1) 1.2s infinite;mix-blend-mode:screen}
.hero-cinematic{z-index:3}
.hero-eyebrow{opacity:0;transform:translateY(12px);animation:heroFadeUp 1s .35s cubic-bezier(.2,.75,.25,1) forwards}
.hero-eyebrow>span:first-child{width:0;animation:eyebrowLine 1s .75s cubic-bezier(.2,.75,.25,1) forwards}
.hero-line{display:block;overflow:hidden;height:.96em;padding-bottom:.06em}
.hero-line>span{display:inline-block;transform:translateY(115%);opacity:0;animation:titleRise 1.15s cubic-bezier(.16,1,.3,1) forwards}
.hero-line:nth-child(1)>span{animation-delay:.45s}
.hero-line:nth-child(2)>span{animation-delay:.57s}
.hero-line:nth-child(3)>span{animation-delay:.69s}
.hero-gold{color:var(--gold);font-style:italic}
.hero-subcopy{opacity:0;transform:translateY(14px);animation:heroFadeUp .9s .95s cubic-bezier(.2,.75,.25,1) forwards}
.hero-actions{opacity:0;transform:translateY(14px);animation:heroFadeUp .9s 1.1s cubic-bezier(.2,.75,.25,1) forwards}
.hero-actions .button-gold{box-shadow:0 0 0 rgba(201,167,106,0);animation:buttonGlow 2.8s 2.2s ease-in-out infinite}
.hero-meta{position:absolute;right:4vw;bottom:9%;z-index:3;display:flex;gap:18px;align-items:center;writing-mode:vertical-rl;color:rgba(255,255,255,.45);font-size:8px;letter-spacing:2px;opacity:0;animation:heroFadeIn 1s 1.35s ease forwards}
.hero-meta span+span:before{content:'·';margin-bottom:18px;color:var(--gold)}
.scroll-cue{z-index:3;animation:scrollCue 2.2s 1.6s ease-in-out infinite}
@keyframes titleRise{0%{transform:translateY(115%);opacity:0;filter:blur(8px)}60%{opacity:1}100%{transform:translateY(0);opacity:1;filter:blur(0)}}
@keyframes heroFadeUp{to{opacity:1;transform:translateY(0)}}
@keyframes heroFadeIn{to{opacity:1}}
@keyframes eyebrowLine{to{width:28px}}
@keyframes heroSheen{0%,58%{transform:translateX(-85%)}78%,100%{transform:translateX(85%)}}
@keyframes buttonGlow{0%,100%{box-shadow:0 0 0 rgba(201,167,106,0)}50%{box-shadow:0 0 34px rgba(201,167,106,.16)}}
@keyframes scrollCue{0%,100%{transform:translateY(0);opacity:.65}50%{transform:translateY(8px);opacity:1}}
.hero-content h1{perspective:800px;text-shadow:0 12px 40px rgba(0,0,0,.28)}
@media(max-width:900px){.hero-meta{display:none}.hero-sheen{animation-duration:9s}.hero-line{height:1em}.hero-image{filter:saturate(.58) contrast(1.1) brightness(.66)}}
@media(max-width:560px){.hero-cinematic{margin-top:20px}.hero-image{background-position:62% center}.hero-sheen{display:none}}
@media(prefers-reduced-motion:reduce){.hero-image{transform:none!important;transition:none}.hero-sheen{display:none}.hero-eyebrow,.hero-subcopy,.hero-actions,.hero-meta{opacity:1;transform:none;animation:none}.hero-line{overflow:visible}.hero-line>span{opacity:1;transform:none;animation:none;filter:none}.scroll-cue{animation:none}.hero-actions .button-gold{animation:none}}
`;
document.head.appendChild(style);

// Subtle active-section navigation state.
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.desktop-nav a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));
