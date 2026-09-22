// WELLCON shared mobile navigation — capture-phase version.
// Using capture prevents older page-specific click handlers from toggling the menu twice.
(function () {
  function closeAllSubmenus(menu) {
    menu.querySelectorAll('.mobile-submenu-wrap.open').forEach(function (wrap) {
      wrap.classList.remove('open');
      var btn = wrap.querySelector('.mobile-submenu-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function setMenu(open) {
    var menuBtn = document.getElementById('menuBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    if (!menuBtn || !mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.documentElement.classList.toggle('mobile-nav-open', open);
    if (!open) closeAllSubmenus(mobileMenu);
  }

  document.addEventListener('click', function (e) {
    var menuBtn = e.target.closest('#menuBtn');
    if (menuBtn) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var mobileMenu = document.getElementById('mobileMenu');
      if (!mobileMenu) return;
      setMenu(!mobileMenu.classList.contains('open'));
      return;
    }

    var submenuBtn = e.target.closest('.mobile-submenu-toggle');
    if (submenuBtn) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var menu = submenuBtn.closest('#mobileMenu');
      var wrap = submenuBtn.closest('.mobile-submenu-wrap');
      if (!menu || !wrap) return;
      var shouldOpen = !wrap.classList.contains('open');
      menu.querySelectorAll('.mobile-submenu-wrap.open').forEach(function (other) {
        if (other !== wrap) {
          other.classList.remove('open');
          var otherBtn = other.querySelector('.mobile-submenu-toggle');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });
      wrap.classList.toggle('open', shouldOpen);
      submenuBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      return;
    }

    var menuLink = e.target.closest('#mobileMenu a');
    if (menuLink) {
      setMenu(false);
      return;
    }

    var openMenu = document.querySelector('#mobileMenu.open');
    if (openMenu && !e.target.closest('#mobileMenu')) setMenu(false);
  }, true);

  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) setMenu(false);
  });
})();
