// Sort product models by letter prefix, then by numeric model number.
(function () {
  var collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base', ignorePunctuation: true });
  function modelName(card) {
    var title = card.querySelector('h3');
    return title ? title.textContent.trim().normalize('NFKC') : '';
  }
  function modelPrefix(name) {
    return name.split(/[0-9]/, 1)[0].replace(/[\s._-]+$/g, '');
  }
  function sortProducts() {
    document.querySelectorAll('main .catalog-grid, main .product-grid').forEach(function (grid) {
      var entries = Array.from(grid.children).filter(function (card) {
        return card.matches('.catalog-card, .product-card') && modelName(card);
      }).map(function (card) {
        var name = modelName(card);
        return { card: card, name: name, prefix: modelPrefix(name) };
      });
      if (entries.length < 2) return;
      var sorted = entries.slice().sort(function (a, b) {
        return collator.compare(a.prefix, b.prefix) || collator.compare(a.name, b.name);
      });
      if (sorted.every(function (item, i) { return item === entries[i]; })) return;
      var slots = entries.map(function (item) {
        var slot = document.createComment('product order');
        item.card.replaceWith(slot);
        return slot;
      });
      sorted.forEach(function (item, i) { slots[i].replaceWith(item.card); });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sortProducts, { once: true });
  } else {
    sortProducts();
  }
})();

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

// Keep the expansion-joint category available in the shared product menus.
(function () {
  function addExpansionJoint() {
    document.querySelectorAll('.product-submenu, .mobile-submenu').forEach(function (menu) {
      var anchor = menu.querySelector('a[href="metal-other-fence.html"]');
      if (!anchor || menu.querySelector('a[href="expansion-joint.html"]')) return;
      var link = document.createElement('a');
      link.href = 'expansion-joint.html';
      link.textContent = '신축이음장치';
      if (location.pathname.split('/').pop() === 'expansion-joint.html') {
        link.setAttribute('aria-current', 'page');
      }
      anchor.insertAdjacentElement('afterend', link);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addExpansionJoint, { once: true });
  } else {
    addExpansionJoint();
  }
})();

// Show product categories only within the product section.
(function () {
  function insertProductBar() {
    if (location.pathname.endsWith('/') || /(?:^|\/)index\.html$/i.test(location.pathname)) return;
    if (document.body.classList.contains('home-landing') || document.querySelector('.cp-page-nav')) return;
    var header = document.querySelector('header.site-header');
    var main = document.querySelector('main');
    if (!header || !main) return;
    var menu = header.querySelector('.desktop-nav .product-menu-wrap:not(.company-menu-wrap) .product-submenu');
    if (!menu) return;
    var sections = Array.from(menu.querySelectorAll('a[href]')).filter(function (link) {
      return link.origin === location.origin && /\.html$/i.test(link.pathname) && !link.hash;
    });
    if (!sections.some(function (link) { return link.pathname === location.pathname; })) return;
    var nav = document.createElement('nav');
    nav.className = 'cp-page-nav wc-company-bar';
    nav.setAttribute('aria-label', '제품 분류');
    var list = document.createElement('ul');
    sections.forEach(function (section) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = section.getAttribute('href');
      link.textContent = section.textContent.trim();
      if (section.pathname === location.pathname) link.setAttribute('aria-current', 'page');
      item.appendChild(link);
      list.appendChild(item);
    });
    nav.appendChild(list);
    main.prepend(nav);
    function positionBar() {
      var rect = header.getBoundingClientRect();
      var fixed = window.getComputedStyle(header).position === 'fixed';
      var mainTop = main.getBoundingClientRect().top + window.scrollY;
      var mobile = window.matchMedia('(max-width: 640px)').matches;
      // Match the company bar's first row at 110px (90px on mobile),
      // while preserving clearance if a product page has a taller header.
      var firstRow = Math.max(mobile ? 90 : 110,
                              rect.bottom + (fixed ? 0 : window.scrollY) + (mobile ? 14 : 18));
      nav.style.setProperty('--wc-company-bar-offset', Math.max(0, firstRow - mainTop) + 'px');
    }
    positionBar();
    window.addEventListener('resize', positionBar, { passive: true });
    window.addEventListener('load', positionBar, { once: true });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertProductBar, { once: true });
  } else {
    insertProductBar();
  }
})();

// Share the company dropdown with pages that still have an ordinary company link.
(function () {
  function installCompanyDropdowns() {
    var header = document.querySelector('header.site-header');
    if (!header) return;
    var menus = [
      ['.desktop-nav > a[href="company.html"], .desktop-nav > a[href="./company.html"]', "<div class=\"product-menu-wrap company-menu-wrap\"><a href=\"company.html\">회사소개</a><div class=\"product-submenu\" aria-label=\"회사소개 하위 메뉴\"><a href=\"company.html\">회사소개</a><a href=\"company-history.html\">회사 연혁</a><a href=\"company-business.html\">사업 부문</a><a href=\"company-organization.html\">회사 조직도</a><a href=\"company-facilities.html\">공장 설비 시설</a><a href=\"company-certifications.html\">인증 및 등록</a><a href=\"company-projects.html\">공사실적</a></div></div>"],
      ['#mobileMenu > a[href="company.html"], #mobileMenu > a[href="./company.html"]', "<div class=\"mobile-submenu-wrap\"><button class=\"mobile-submenu-toggle\" type=\"button\" aria-expanded=\"false\">회사소개 <span aria-hidden=\"true\">⌄</span></button><div class=\"mobile-submenu\"><a href=\"company.html\">회사소개</a><a href=\"company-history.html\">회사 연혁</a><a href=\"company-business.html\">사업 부문</a><a href=\"company-organization.html\">회사 조직도</a><a href=\"company-facilities.html\">공장 설비 시설</a><a href=\"company-certifications.html\">인증 및 등록</a><a href=\"company-projects.html\">공사실적</a></div></div>"]
    ];
    menus.forEach(function (entry) {
      var link = header.querySelector(entry[0]);
      if (link) link.outerHTML = entry[1];
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installCompanyDropdowns, { once: true });
  } else {
    installCompanyDropdowns();
  }
})();
