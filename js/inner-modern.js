(() => {
  const nav = document.querySelector('.navbar');
  const menu = document.getElementById('menu');
  const toggle = document.getElementById('menu-toggle');

  if (nav && menu) {
    const path = window.location.pathname.toLowerCase();
    let activeHref = '';

    if (path.includes('/blog/') || path.endsWith('/blog.html')) activeHref = 'blog.html';
    else if (path.includes('villa')) activeHref = 'villa.html';
    else if (path.includes('apartment')) activeHref = 'apartment.html';
    else if (path.includes('golf')) activeHref = 'golf.html';
    else if (path.includes('car-rental')) activeHref = 'car-rental.html';

    menu.querySelectorAll('a').forEach((link) => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      if (activeHref && link.getAttribute('href')?.endsWith(activeHref)) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  if (toggle && menu) {
    if (toggle.tagName !== 'BUTTON') {
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('tabindex', '0');
    }
    toggle.setAttribute('aria-label', '메뉴 열기');
    toggle.setAttribute('aria-controls', 'menu');
    toggle.setAttribute('aria-expanded', 'false');

    const setMenuOpen = (isOpen) => {
      menu.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    };

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setMenuOpen(!menu.classList.contains('active'));
    }, true);

    toggle.addEventListener('keydown', (event) => {
      if (toggle.tagName !== 'BUTTON' && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        toggle.click();
      }
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('click', (event) => {
      if (menu.classList.contains('active') && !nav?.contains(event.target)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) setMenuOpen(false);
    });
  }

  document.querySelectorAll('img').forEach((image, index) => {
    if (index > 1 && !image.closest('.gallery-main')) {
      image.loading = image.loading || 'lazy';
      image.decoding = image.decoding || 'async';
    }
  });
})();
