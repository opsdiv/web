/* ============================================================
   OPSDIV — main.js
   ============================================================ */

// ── NAV scroll behavior (IntersectionObserver, no scroll event) ──
const nav = document.getElementById('nav');
const navSentinel = document.getElementById('nav-sentinel');

if (navSentinel) {
  new IntersectionObserver(([entry]) => {
    nav.classList.toggle('scrolled', !entry.isIntersecting);
  }).observe(navSentinel);
}

// ── Hamburger / mobile menu ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  hamburger.setAttribute('aria-expanded', String(menuOpen));

  // Animate hamburger to X
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    // Move focus into menu after transition starts
    setTimeout(() => {
      const firstLink = mobileMenu.querySelector('.mobile-link');
      if (firstLink) firstLink.focus();
    }, 50);
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    hamburger.focus();
  }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
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
const formError   = document.getElementById('formError');

const FORMSPREE_ID = 'mnjgkzjg';

function showFormError(msg) {
  if (formError) {
    formError.textContent = msg;
  }
}

function clearFormError() {
  if (formError) {
    formError.textContent = '';
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    const data = new FormData(contactForm);

    // Client-side validation before network call
    const nameVal = (data.get('name') || '').toString().trim();
    const emailVal = (data.get('email') || '').toString().trim();
    if (!nameVal) {
      showFormError('Please enter your name.');
      return;
    }
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      showFormError('Please enter a valid email address.');
      return;
    }

    btn.textContent = 'Sending...';
    btn.disabled = true;

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
        showFormError(msg);
        btn.textContent = originalText;
        btn.disabled = false;
      }
    } catch (err) {
      showFormError('Unable to send. Please email hello@opsdiv.com directly.');
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

// ── Cursor accent dot ─────────────────────────────────────────
const cursorDot = document.createElement('div');
cursorDot.style.cssText = `
  position: fixed;
  left: 0;
  top: 0;
  width: 6px;
  height: 6px;
  background: var(--amber, #e8a020);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.3s, transform 0.15s;
`;
document.body.appendChild(cursorDot);

let cursorVisible = false;
let cursorX = 0, cursorY = 0, rafPending = false, cursorScale = 1;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;

  if (!cursorVisible) {
    cursorDot.style.opacity = '0.6';
    cursorVisible = true;
  }

  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      cursorDot.style.transform = `translate(${cursorX - 3}px, ${cursorY - 3}px) scale(${cursorScale})`;
      rafPending = false;
    });
  }
});

document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity = '0';
  cursorVisible = false;
});

// Enlarge on interactive elements
document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorScale = 3;
    cursorDot.style.opacity = '0.3';
    cursorDot.style.transform = `translate(${cursorX - 3}px, ${cursorY - 3}px) scale(3)`;
  });
  el.addEventListener('mouseleave', () => {
    cursorScale = 1;
    cursorDot.style.opacity = '0.6';
    cursorDot.style.transform = `translate(${cursorX - 3}px, ${cursorY - 3}px) scale(1)`;
  });
});
