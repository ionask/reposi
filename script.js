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
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY * 0.18, 90);
    heroImage.style.transform = `scale(1.05) translateY(${y}px)`;
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
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
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
