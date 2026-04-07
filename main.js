/* =========================================================
   [COMPANY NAME] — main.js
   ========================================================= */

(function () {
  'use strict';

  /* --- NAV SCROLL EFFECT --- */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
  }, { passive: true });

  /* --- MOBILE HAMBURGER --- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // Animate the three bars
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity  = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity  = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });

  /* --- SMOOTH ANCHOR SCROLL (with nav offset) --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --- SCROLL REVEAL --- */
  function addRevealClasses() {
    // Sections to animate — add reveal + optional delay
    const targets = [
      { sel: '.metrics-band .metric',         delay: true  },
      { sel: '.about-left',                    delay: false },
      { sel: '.about-right',                   delay: false },
      { sel: '.feature-list li',              delay: true  },
      { sel: '.risk-item',                     delay: true  },
      { sel: '.offering-card',                 delay: true  },
      { sel: '.sponsor-left',                  delay: false },
      { sel: '.sponsor-stat',                  delay: true  },
      { sel: '.step',                          delay: true  },
      { sel: '.digital-item',                  delay: true  },
      { sel: '.contact-inner',                 delay: false },
    ];

    targets.forEach(({ sel, delay }) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        if (delay && i < 4) {
          el.classList.add(`reveal-delay-${i + 1}`);
        }
      });
    });
  }

  function observeReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  addRevealClasses();

  if ('IntersectionObserver' in window) {
    observeReveal();
  } else {
    // Fallback: make everything visible
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* --- ACTIVE NAV LINK HIGHLIGHT --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links li a:not(.nav-cta)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* --- METRICS COUNTER ANIMATION --- */
  function animateCounters() {
    const metricValues = document.querySelectorAll('.metric-value');
    metricValues.forEach(el => {
      const text = el.textContent.trim();
      // Only animate if numeric
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return;
      const suffix = text.replace(/[0-9.]/g, '');
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = (num * eased).toFixed(num % 1 !== 0 ? 1 : 0);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }

  // Trigger counter animation when metrics band enters view
  const metricsSection = document.querySelector('.metrics-band');
  if (metricsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    }, { threshold: 0.5 });
    counterObserver.observe(metricsSection);
  }

})();
