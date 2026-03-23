/* ============================================================
   OPSDIV — main.js
   ============================================================ */

// ── NAV scroll behavior ──────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.style.background = 'rgba(11,15,26,0.96)';
  } else {
    nav.style.background = 'rgba(11,15,26,0.82)';
  }
});

// ── Hamburger / mobile menu ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  // Animate hamburger to X
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Scroll reveal ────────────────────────────────────────────
const revealElements = document.querySelectorAll(
  '.service-item, .problem-card, .expertise-card, .step, .section-header, .about-text, .about-accent, .contact-text, .contact-form-wrap, .hero-stats, .hero-eyebrow, .hero-headline, .hero-sub, .hero-actions'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger children in grids
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => observer.observe(el));

// ── Stagger grid children ────────────────────────────────────
document.querySelectorAll('.services-layout, .problem-grid, .expertise-grid').forEach(grid => {
  const children = grid.children;
  Array.from(children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 60}ms`;
  });
});

// ── Smooth active nav highlight ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--offwhite)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Contact form ─────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// ── Contact form — Formspree submission ──────────────────────
// Steps to activate:
// 1. Sign up at https://formspree.io (free)
// 2. Create a form pointed at hello@opsdiv.com
// 3. Replace YOUR_FORMSPREE_ID below with your form's ID (e.g. "xpzgkqla")
const FORMSPREE_ID = 'mnjgkzjg';

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = new FormData(contactForm);

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactForm.style.display = 'none';
        formSuccess.classList.add('visible');
      } else {
        const json = await res.json();
        const msg = json.errors?.map(e => e.message).join(', ') || 'Something went wrong. Please email hello@opsdiv.com directly.';
        alert(msg);
        btn.textContent = originalText;
        btn.disabled = false;
      }
    } catch (err) {
      alert('Unable to send. Please email hello@opsdiv.com directly.');
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

// ── Cursor accent dot (optional ambient effect) ──────────────
const cursorDot = document.createElement('div');
cursorDot.style.cssText = `
  position: fixed;
  width: 6px;
  height: 6px;
  background: var(--amber, #e8a020);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.3s;
  transform: translate(-50%, -50%);
`;
document.body.appendChild(cursorDot);

let cursorVisible = false;
document.addEventListener('mousemove', (e) => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
  if (!cursorVisible) {
    cursorDot.style.opacity = '0.6';
    cursorVisible = true;
  }
});
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity = '0';
  cursorVisible = false;
});

// Enlarge on interactive elements
document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(3)';
    cursorDot.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorDot.style.opacity = '0.6';
  });
});
