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
      ['.desktop-nav > a[href="company.html"], .desktop-nav > a[href="./company.html"]', "<div class=\"product-menu-wrap company-menu-wrap\"><a href=\"company.html\">회사소개</a><div class=\"product-submenu\" aria-label=\"회사소개 하위 메뉴\"><a href=\"company.html\">회사소개</a><a href=\"company-history.html\">회사 연혁</a><a href=\"company-business.html\">사업 부문</a><a href=\"company-organization.html\">회사 조직도</a><a href=\"company-facilities.html\">공장 설비 시설</a><a href=\"company-certifications.html\">특허증</a><a href=\"company-design-registrations.html\">디자인등록증</a><a href=\"company-projects.html\">공사실적</a></div></div>"],
      ['#mobileMenu > a[href="company.html"], #mobileMenu > a[href="./company.html"]', "<div class=\"mobile-submenu-wrap\"><button class=\"mobile-submenu-toggle\" type=\"button\" aria-expanded=\"false\">회사소개 <span aria-hidden=\"true\">⌄</span></button><div class=\"mobile-submenu\"><a href=\"company.html\">회사소개</a><a href=\"company-history.html\">회사 연혁</a><a href=\"company-business.html\">사업 부문</a><a href=\"company-organization.html\">회사 조직도</a><a href=\"company-facilities.html\">공장 설비 시설</a><a href=\"company-certifications.html\">특허증</a><a href=\"company-design-registrations.html\">디자인등록증</a><a href=\"company-projects.html\">공사실적</a></div></div>"]
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

// A short red afterglow behind a moving mouse, independent of the cursor shape.
(function () {
  var enabled = window.matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)');
  var lifetime = 240;
  var points = [];
  var canvas, context, frame = 0, width = 0, height = 0, ratio = 1;

  function clear() {
    points.length = 0;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (context) context.clearRect(0, 0, width, height);
  }

  function resize() {
    if (!context) return;
    clear();
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * ratio);
    canvas.height = Math.ceil(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function render(now) {
    frame = 0;
    context.clearRect(0, 0, width, height);
    while (points.length && now - points[0].time >= lifetime) points.shift();
    if (!points.length) return;
    context.lineCap = 'round';
    for (var i = 1; i < points.length; i++) {
      var a = points[i - 1], b = points[i];
      var strength = Math.pow(Math.min(1, 1 - (now - a.time) / lifetime), 1.65);
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.lineWidth = 5 * strength;
      context.strokeStyle = 'rgba(255, 24, 55,' + (strength * 0.18) + ')';
      context.stroke();
      context.lineWidth = 2 * strength;
      context.strokeStyle = 'rgba(255, 23, 58,' + (strength * 0.9) + ')';
      context.stroke();
    }
    frame = requestAnimationFrame(render);
  }

  window.addEventListener('pointermove', function (event) {
    if (event.pointerType !== 'mouse' || !enabled.matches || !document.body) return;
    if (event.target instanceof Element && event.target.closest('#introVideo, a[href^="tel:"]')) {
      clear();
      return;
    }
    if (!canvas) {
      canvas = document.createElement('canvas');
      context = canvas.getContext('2d');
      if (!context) return;
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
      document.body.appendChild(canvas);
      resize();
    }
    if (!context) return;
    var now = performance.now();
    var previous = points[points.length - 1];
    if (previous && (now - previous.time > 100 ||
        Math.hypot(event.clientX - previous.x, event.clientY - previous.y) > 300)) points.length = 0;
    points.push({ x: event.clientX, y: event.clientY, time: now });
    if (points.length > 32) points.shift();
    if (!frame) frame = requestAnimationFrame(render);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', clear);
  document.addEventListener('visibilitychange', clear);
  window.addEventListener('blur', clear);
  window.addEventListener('resize', resize, { passive: true });
  if (enabled.addEventListener) enabled.addEventListener('change', clear);
})();

// Use the WELLCON mark as the native cursor.
(function () {
  if (document.getElementById('wellcon-red-cursor')) return;
  var logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAFlUlEQVR4nM2XXWxc1RHH/zPn7vU3jg1xEghr9iNO9q6toNqV2kIbEEpFAJVKJUg0Sh9oQQgeIgUEQa0SRVE/VLUSCCLx0CJeCB+makECESGIaEA84CAlJLv58G6yJjh21l5iee3seu+Z6YN3g7OsnU15gHm60p0zv5k5Z87MAb4joXqUFGACBACyYW+Hw7StqNLlEmUBPNM5nPhLtd6VhOuF7gL4q2jvKwxs91VPNJMhX5BUwfapaHwfACJAtA6bwBUiVmw2hEE77nmt7hwNOqDYlOpPA9CGZuJThRJihUAh304Nn4ho+kyLc9fNR47MVNb9XxErMA/t9lYGinivjfnOnC1uXZ069gWrXVZUBZFtv3F4+OyYFn/AoLbgjD80FupdQRi0is3mqsEKOATYbE/vOhj91GX+0aT1/RZjSrsAViIhAMrG7gK4Z3g4e3I2d6sBjzgsn58NreuZh8OpG1yG+l+Ge24JiH4G4N0psb80IMeKMburDs/u8v4PnDs32546usmA9jezOTwWWfdjAvzF4AvBdKAMHQ3H7upkd7+v+tKKdPIho5K20G/umSoBwCPh8HXZtWvbAEhH6thWX2VvI5mPspHYvYvBL4EV4NsBfzLiPdRpnLeF0ELQvQoQEdpqee2rMAAQN6831rx1MhpdDgBd6eQTJdUnm5j/k414D5fhl+35JTABdiLq7STQc3mRD0qqCug1BKgSLV2b6uebydy2XN33MsG+MAAsTyX+nre6pZH4hYmwt5OAyzJ2CXw+HPtbALTDF9k4y85vHCJSvgKw4rQaviC+dZnXtwfk/dHw2gEAWJlO7JsRu7GRacdYOPanmuAG5sfzor/rOp082Dg312VV62EuMERmWsQy4aYmcvZPROM/fx0wK9PJ9/Nit7Qa83RNcFHVbxI9qwALmyWLf3E4zEUR3xA6fZF//WxNX7cCbAgjc6pSpfv1txDceu/aRYXIXFRVJmrmkr+aALFCHVRVupcdcyVcXX4XYwPEANTgtfFwLEdAV2mJiBd6rYpv54QCUEWegCmAplHVFy4DW9X5urTWOAA5xFeddgJUAFWASPnXXenkTxS0NUBUG0yAMKigAAcMcgXV6ZJFy9WCRVVamQmKrCNO9gA2OBZUlKoMfl1ORI4SRQiQjnTiiznWe2BKYwCgRHWlXaC2ldmZE/mSWX6xLHM4czs+9AOQHrcq4kuHq6D6V5fpxYmol6fhxBs4lfxv5Z/6LGBZMu0K+O1snItiE1O++VUokzgOABMh775Gwy/PiN1TM+KuVOKpgurv28gMZiPrHgMA7e8PaPlQuMSBRaFEsoyNUxA9OOXTHaHM0eMAkIvGH21zzOCs2D+sSCV31gQrNptVqcSfc77/2xZ2np+MeHvo0KESAWqaNDmn+m+FNNYki23Jq31zzPHvDmUSYwAwGfH2NBHtvWDtg12p5B+rm0RVujY4ADAajm2ajsZLkxHvn5V/Rz3PzQT7OgBgfI1382QkrqOh+A8BIBMMdpyMRhsqurmI94/paLw0Go5tWmh3San0ztHw2oHpSHwqF4m/UzFaGeTGu+fB2XDvAAC8Xo7mQHd340TEezsfiU+NlJ1aDPqNC6TSuK9PnxgaVxkwrH3Xwv14xPM6a02RCvD9gB1Z7XWuD7QcdIn7ctD+4Oljn85PMx/6dYEr8AOAE00nT83aQr9RBNrnMHQm2BMiQMgRVgC+WEOAnAn2hK5poCEG3PPCA8FUYnh+WERNaJmxuJQX26FVq5pDzR1vuUT9RegtxZIv7QE3Oa22V9mXVnU/KUE/K8w03XPDuUOzlXVL2b7iS2LB64Amwt6rDtG9JeipRuLeiypHXdAaX/XN59KJB3aXt6KeDlfvE4aofOVlo7FHSGmbAt0EZJT02eXDyReq9b638j+N05SPNlsnYAAAAABJRU5ErkJggg==';
  var style = document.createElement('style');
  style.id = 'wellcon-red-cursor';
  style.textContent = '@media (hover: hover) and (pointer: fine) {' +
    'body, body *:not(#introVideo, #introVideo *, input, textarea, [contenteditable], [contenteditable] *) {' +
    'cursor:url("' + logo + '") 15 15, auto !important;' +
    '}}';
  document.head.appendChild(style);
})();
