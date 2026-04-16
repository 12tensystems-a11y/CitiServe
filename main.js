// ── Nav opacity on scroll
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('opaque', window.scrollY > 80);
    }, { passive: true });

    // ── Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    document.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
    hamburger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') hamburger.click();
    });

    // ── Active nav link on scroll
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));

    // ── Count-up animation
    function animateCount(el) {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.textContent.startsWith('£') ? '£' : '';
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(step);
    }

    const statEls = document.querySelectorAll('[data-count]');
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCount(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statObserver.observe(el));

    // ── Contact form validation
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      function setError(inputId, errorId, msg) {
        const input = document.getElementById(inputId);
        const errEl = document.getElementById(errorId);
        if (msg) {
          input.classList.add('error');
          errEl.textContent = msg;
          valid = false;
        } else {
          input.classList.remove('error');
          errEl.textContent = '';
        }
      }

      const name = document.getElementById('name').value.trim();
      setError('name', 'nameError', name ? '' : 'Please enter your name.');

      const email = document.getElementById('email').value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setError('email', 'emailError', emailRe.test(email) ? '' : 'Please enter a valid email address.');

      const enquiry = document.getElementById('enquiry').value;
      setError('enquiry', 'enquiryError', enquiry ? '' : 'Please select an enquiry type.');

      const message = document.getElementById('message').value.trim();
      setError('message', 'messageError', message ? '' : 'Please enter a message.');

      if (valid) {
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';
        setTimeout(() => {
          form.style.opacity = '';
          form.style.pointerEvents = '';
          form.reset();
          document.getElementById('formSuccess').classList.add('visible');
          setTimeout(() => document.getElementById('formSuccess').classList.remove('visible'), 6000);
        }, 800);
      }
    });

    // ── Clear field errors on input
    document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select').forEach(el => {
      el.addEventListener('input', () => el.classList.remove('error'));
    });
