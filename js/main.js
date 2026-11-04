(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById('themeToggle');
  var themeMeta = document.getElementById('themeColor');
  var themeColors = { light: '#F2F5F8', dark: '#0F1B31' };

  function storedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', themeColors[theme]);
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  }

  // Follow the system theme until the visitor picks one themselves.
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  if (darkQuery.addEventListener) {
    darkQuery.addEventListener('change', function (event) {
      if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light', false);
    });
  }

  /* ---------- Mobile navigation ---------- */
  var nav = document.getElementById('nav');
  var navBtn = document.getElementById('navToggle');

  function setNav(open) {
    if (!nav || !navBtn) return;
    nav.setAttribute('data-open', String(open));
    navBtn.setAttribute('aria-expanded', String(open));
  }

  if (nav && navBtn) {
    navBtn.addEventListener('click', function () {
      setNav(nav.getAttribute('data-open') !== 'true');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setNav(false);
    });

    window.matchMedia('(min-width: 761px)').addEventListener('change', function (event) {
      if (event.matches) setNav(false);
    });
  }

  /* ---------- Highlight the current section in the nav ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var linkById = {};
  links.forEach(function (link) {
    linkById[link.getAttribute('href').slice(1)] = link;
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.removeAttribute('aria-current'); });
        var active = linkById[entry.target.id];
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    var ids = Object.keys(linkById).concat('top');
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
