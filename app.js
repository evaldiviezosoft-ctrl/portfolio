/* ════════════════════════════════════════
   PORTFOLIO APP.JS
════════════════════════════════════════ */

/* ── NAV: scroll effect + active link ── */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const updateNav = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);

  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });
};

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── MOBILE MENU ── */
const menuBtn = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  // animate hamburger → X
  const spans = menuBtn.querySelectorAll('span');
  if (open) {
    spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
    spans[1].style.cssText = 'opacity:0; transform:translateX(-8px)';
    spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuBtn.querySelectorAll('span').forEach(s => s.style.cssText = '');
  });
});

/* ── HERO PARTICLES ── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#6366f1','#8b5cf6','#06b6d4','#4ade80','#f59e0b'];

  for (let i = 0; i < 28; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    const duration = Math.random() * 14 + 10;
    const delay = Math.random() * 12;
    const left = Math.random() * 100;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      filter:blur(${Math.random() > 0.5 ? 1 : 0}px);
    `;
    container.appendChild(p);
  }
})();

/* ── SCROLL-REVEAL ANIMATION ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger sibling cards
      const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
      let delay = 0;
      siblings.forEach((el, idx) => {
        if (el === entry.target) delay = idx * 80;
      });
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => revealObserver.observe(el));

/* ── STAT COUNTER ANIMATION ── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = Math.min(now - start, duration);
    const progress = easeOut(elapsed / duration);
    el.textContent = Math.round(progress * target);
    if (elapsed < duration) requestAnimationFrame(tick);
    else el.textContent = target + (target >= 5 ? '+' : '');
  };

  requestAnimationFrame(tick);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ── TYPEWRITER HERO NAME ── */
(function typeHeroName() {
  const el = document.getElementById('typed-name');
  if (!el) return;
  const name = el.textContent;
  el.textContent = '';

  let idx = 0;
  const cursor = document.createElement('span');
  cursor.style.cssText = 'display:inline-block;width:3px;height:0.9em;background:currentColor;vertical-align:middle;margin-left:3px;animation:blink 1s step-end infinite;';
  el.parentElement.appendChild(cursor);

  const type = () => {
    if (idx <= name.length) {
      el.textContent = name.slice(0, idx);
      idx++;
      setTimeout(type, 90 + Math.random() * 50);
    } else {
      setTimeout(() => cursor.style.display = 'none', 1200);
    }
  };

  setTimeout(type, 600);
})();

/* ── CONTACT FORM ── */
function handleForm(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  const success = document.getElementById('formSuccess');

  btn.disabled = true;
  btn.textContent = 'Enviando…';

  // Simulate async send (replace with real fetch to your backend/Formspree)
  setTimeout(() => {
    btn.textContent = '¡Enviado! ✅';
    success.style.display = 'block';
    document.getElementById('contactForm').reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Enviar mensaje ✈️';
      success.style.display = 'none';
    }, 4000);
  }, 1400);
}

/* ── SMOOTH CARD TILT (subtle 3D) ── */
document.querySelectorAll('.project-card, .client-card, .stat-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) rotateX(${-dy * 3}deg) rotateY(${dx * 4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
});
