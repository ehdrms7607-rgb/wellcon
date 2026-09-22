const modal=document.getElementById('searchModal');
document.getElementById('searchOpen').addEventListener('click',()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');setTimeout(()=>document.getElementById('searchInput').focus(),50)});
document.getElementById('searchClose').addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')});
modal.addEventListener('click',e=>{if(e.target===modal)document.getElementById('searchClose').click()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))document.getElementById('searchClose').click()});


const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));


// Main banner: 4 slides / autoplay / arrows / mouse drag / touch swipe
(() => {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const slides = [...slider.querySelectorAll('.hero-slide')];
  const currentEl = document.getElementById('slideCurrent');
  const progressEl = document.getElementById('sliderProgress');
  const pauseBtn = document.getElementById('sliderPause');

  let slideIndex = 0;
  let autoTimer = null;
  let isPaused = false;
  let pointerStartX = null;
  const slideDelay = 4500;

  function restartProgress() {
    if (!progressEl) return;
    progressEl.classList.remove('running');
    void progressEl.offsetWidth;
    if (!isPaused) progressEl.classList.add('running');
  }

  function scheduleNext() {
    clearTimeout(autoTimer);
    if (!isPaused) {
      autoTimer = setTimeout(() => {
        showSlide(slideIndex + 1, 1);
      }, slideDelay);
    }
  }

  function showSlide(next, direction = 1) {
    const old = slideIndex;
    slideIndex = (next + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'exit-left');
      if (i === old && old !== slideIndex && direction > 0) {
        slide.classList.add('exit-left');
      }
    });

    slides[slideIndex].classList.add('active');

    if (currentEl) {
      currentEl.textContent = String(slideIndex + 1).padStart(2, '0');
    }

    restartProgress();
    scheduleNext();
  }

  document.getElementById('sliderPrev')?.addEventListener('click', () => {
    showSlide(slideIndex - 1, -1);
  });

  document.getElementById('sliderNext')?.addEventListener('click', () => {
    showSlide(slideIndex + 1, 1);
  });

  pauseBtn?.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '▶' : 'Ⅱ';
    pauseBtn.setAttribute(
      'aria-label',
      isPaused ? '자동재생 시작' : '자동재생 일시정지'
    );

    if (isPaused) {
      clearTimeout(autoTimer);
      progressEl?.classList.remove('running');
    } else {
      restartProgress();
      scheduleNext();
    }
  });

  slider.addEventListener('pointerdown', (e) => {
    pointerStartX = e.clientX;
    if (slider.setPointerCapture) slider.setPointerCapture(e.pointerId);
  });

  slider.addEventListener('pointerup', (e) => {
    if (pointerStartX === null) return;
    const dx = e.clientX - pointerStartX;
    pointerStartX = null;

    if (Math.abs(dx) > 45) {
      showSlide(slideIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
  });

  // Autoplay should continue even while the mouse is over the banner.
  // Only the pause button stops automatic switching.
  restartProgress();
  scheduleNext();
})();

/* Product image search */
(() => {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('productSearchResults');
  if (!input || !results) return;

  const products = [
  {
    "name": "WC-111SW",
    "image": "assets/aluminum-bridge-product-001.jpg",
    "url": "bridge-railing.html",
    "id": "25446569"
  },
  {
    "name": "WC-140SW",
    "image": "assets/aluminum-bridge-product-002.jpg",
    "url": "bridge-railing.html",
    "id": "25484653"
  },
  {
    "name": "WC-203C",
    "image": "assets/aluminum-bridge-product-003.jpg",
    "url": "bridge-railing.html",
    "id": "22450768"
  },
  {
    "name": "WC-008C",
    "image": "assets/aluminum-bridge-product-004.jpg",
    "url": "bridge-railing.html",
    "id": "22617820"
  },
  {
    "name": "WC-130SW",
    "image": "assets/aluminum-bridge-product-005.jpg",
    "url": "bridge-railing.html",
    "id": "25484651"
  },
  {
    "name": "WC-108SW",
    "image": "assets/aluminum-bridge-product-006.jpg",
    "url": "bridge-railing.html",
    "id": "24567312"
  },
  {
    "name": "WC-201C",
    "image": "assets/aluminum-bridge-product-007.jpg",
    "url": "bridge-railing.html",
    "id": "24064457"
  },
  {
    "name": "WC-120SW",
    "image": "assets/aluminum-bridge-product-008.jpg",
    "url": "bridge-railing.html",
    "id": "25484654"
  },
  {
    "name": "WC-883H",
    "image": "assets/aluminum-bridge-product-009.jpg",
    "url": "bridge-railing.html",
    "id": "24057693"
  },
  {
    "name": "WC-229H",
    "image": "assets/aluminum-bridge-product-010.jpg",
    "url": "bridge-railing.html",
    "id": "22653642"
  },
  {
    "name": "WC-400C",
    "image": "assets/aluminum-bridge-product-011.jpg",
    "url": "bridge-railing.html",
    "id": "23689225"
  },
  {
    "name": "WC-247H",
    "image": "assets/aluminum-bridge-product-012.jpg",
    "url": "bridge-railing.html",
    "id": "23044956"
  },
  {
    "name": "WC-KWE-410SB4",
    "image": "assets/aluminum-bridge-product-013.jpg",
    "url": "bridge-railing.html",
    "id": "24764346"
  },
  {
    "name": "WC-205C",
    "image": "assets/aluminum-bridge-product-014.jpg",
    "url": "bridge-railing.html",
    "id": "26268219"
  },
  {
    "name": "WC-490H",
    "image": "assets/aluminum-bridge-product-015.jpg",
    "url": "bridge-railing.html",
    "id": "24567314"
  },
  {
    "name": "WC-291H",
    "image": "assets/aluminum-bridge-product-016.jpg",
    "url": "bridge-railing.html",
    "id": "23789639"
  },
  {
    "name": "WC-135H",
    "image": "assets/aluminum-bridge-product-017.jpg",
    "url": "bridge-railing.html",
    "id": "22249967"
  },
  {
    "name": "WC-419H",
    "image": "assets/aluminum-bridge-product-018.jpg",
    "url": "bridge-railing.html",
    "id": "24838585"
  },
  {
    "name": "WC-1003",
    "image": "assets/aluminum-bridge-product-019.jpg",
    "url": "bridge-railing.html",
    "id": "23683175"
  },
  {
    "name": "WC-204C",
    "image": "assets/aluminum-bridge-product-020.jpg",
    "url": "bridge-railing.html",
    "id": "26276482"
  },
  {
    "name": "WC-282H",
    "image": "assets/aluminum-bridge-product-021.jpg",
    "url": "bridge-railing.html",
    "id": "23558601"
  },
  {
    "name": "WC-006H",
    "image": "assets/aluminum-bridge-product-022.jpg",
    "url": "bridge-railing.html",
    "id": "21962124"
  },
  {
    "name": "WC-250H",
    "image": "assets/aluminum-bridge-product-023.jpg",
    "url": "bridge-railing.html",
    "id": "23098923"
  },
  {
    "name": "WF-005SW",
    "image": "assets/aluminum-bridge-product-024.jpg",
    "url": "bridge-railing.html",
    "id": "25510411"
  },
  {
    "name": "WC-5906H",
    "image": "assets/aluminum-bridge-product-025.jpg",
    "url": "bridge-railing.html",
    "id": "26045919"
  },
  {
    "name": "SANTA-400C",
    "image": "assets/aluminum-bridge-product-026.jpg",
    "url": "bridge-railing.html",
    "id": "25095854"
  },
  {
    "name": "WC-228H",
    "image": "assets/aluminum-bridge-product-027.jpg",
    "url": "bridge-railing.html",
    "id": "22653641"
  },
  {
    "name": "MAMMOS-475",
    "image": "assets/aluminum-bridge-product-028.jpg",
    "url": "bridge-railing.html",
    "id": "23005530"
  },
  {
    "name": "WC-5200H",
    "image": "assets/aluminum-bridge-product-029.jpg",
    "url": "bridge-railing.html",
    "id": "25192622"
  },
  {
    "name": "WC-600H",
    "image": "assets/aluminum-bridge-product-030.jpg",
    "url": "bridge-railing.html",
    "id": "26270525"
  },
  {
    "name": "ADAM-485",
    "image": "assets/aluminum-bridge-product-031.jpg",
    "url": "bridge-railing.html",
    "id": "23616567"
  },
  {
    "name": "WC-5281H",
    "image": "assets/aluminum-bridge-product-032.jpg",
    "url": "bridge-railing.html",
    "id": "25192627"
  },
  {
    "name": "WC-231H",
    "image": "assets/aluminum-bridge-product-033.jpg",
    "url": "bridge-railing.html",
    "id": "22667884"
  },
  {
    "name": "WC-244H",
    "image": "assets/aluminum-bridge-product-034.jpg",
    "url": "bridge-railing.html",
    "id": "22942358"
  },
  {
    "name": "WC-5105SW",
    "image": "assets/aluminum-bridge-product-035.jpg",
    "url": "bridge-railing.html",
    "id": "25192628"
  },
  {
    "name": "WC-903H",
    "image": "assets/aluminum-bridge-product-036.jpg",
    "url": "bridge-railing.html",
    "id": "24095773"
  },
  {
    "name": "WC-008HW",
    "image": "assets/aluminum-bridge-product-037.jpg",
    "url": "bridge-railing.html",
    "id": "21961768"
  },
  {
    "name": "CROWN-0808",
    "image": "assets/aluminum-bridge-product-038.jpg",
    "url": "bridge-railing.html",
    "id": "24092023"
  },
  {
    "name": "WC-333H",
    "image": "assets/aluminum-bridge-product-039.jpg",
    "url": "bridge-railing.html",
    "id": "26270524"
  },
  {
    "name": "SWF-009",
    "image": "assets/aluminum-bridge-product-040.jpg",
    "url": "bridge-railing.html",
    "id": "25089368"
  },
  {
    "name": "WC-107SW",
    "image": "assets/aluminum-bridge-WC-107SW.jpg",
    "url": "bridge-railing.html",
    "id": "24442831"
  },
  {
    "name": "WC-488H",
    "image": "assets/aluminum-bridge-product-041.jpg",
    "url": "bridge-railing.html",
    "id": "24567313"
  },
  {
    "name": "WC-283H-N",
    "image": "assets/aluminum-bridge-product-042.jpg",
    "url": "bridge-railing.html",
    "id": "26207599"
  },
  {
    "name": "ADAM-475",
    "image": "assets/aluminum-bridge-product-043.jpg",
    "url": "bridge-railing.html",
    "id": "23374540"
  },
  {
    "name": "WC-789H",
    "image": "assets/aluminum-bridge-product-044.jpg",
    "url": "bridge-railing.html",
    "id": "25737096"
  },
  {
    "name": "WC-222H",
    "image": "assets/aluminum-bridge-product-045.jpg",
    "url": "bridge-railing.html",
    "id": "22549597"
  },
  {
    "name": "MAMMOS-480",
    "image": "assets/aluminum-bridge-product-046.jpg",
    "url": "bridge-railing.html",
    "id": "22929440"
  },
  {
    "name": "WC-733H",
    "image": "assets/aluminum-bridge-product-047.jpg",
    "url": "bridge-railing.html",
    "id": "26038461"
  },
  {
    "name": "WC-223H",
    "image": "assets/aluminum-bridge-product-048.jpg",
    "url": "bridge-railing.html",
    "id": "22549598"
  },
  {
    "name": "WC-5905H",
    "image": "assets/aluminum-bridge-product-049.jpg",
    "url": "bridge-railing.html",
    "id": "25192724"
  },
  {
    "name": "WC-5808H",
    "image": "assets/aluminum-bridge-product-050.jpg",
    "url": "bridge-railing.html",
    "id": "25192633"
  },
  {
    "name": "MAMMOS-485",
    "image": "assets/aluminum-bridge-product-051.jpg",
    "url": "bridge-railing.html",
    "id": "22950038"
  },
  {
    "name": "WC-5035H",
    "image": "assets/aluminum-bridge-product-052.jpg",
    "url": "bridge-railing.html",
    "id": "25187586"
  },
  {
    "name": "WC-293H",
    "image": "assets/aluminum-bridge-product-053.jpg",
    "url": "bridge-railing.html",
    "id": "23929502"
  },
  {
    "name": "WC-103SW",
    "image": "assets/aluminum-bridge-product-054.jpg",
    "url": "bridge-railing.html",
    "id": "24030849"
  },
  {
    "name": "WC-1111H",
    "image": "assets/aluminum-bridge-product-055.jpg",
    "url": "bridge-railing.html",
    "id": "23808813"
  },
  {
    "name": "WC-077H",
    "image": "assets/aluminum-bridge-product-056.jpg",
    "url": "bridge-railing.html",
    "id": "23331110"
  },
  {
    "name": "WC-509H",
    "image": "assets/aluminum-bridge-product-057.jpg",
    "url": "bridge-railing.html",
    "id": "25224359"
  },
  {
    "name": "ROTA-001",
    "image": "assets/aluminum-bridge-product-058.jpg",
    "url": "bridge-railing.html",
    "id": "24667641"
  },
  {
    "name": "WC-701H",
    "image": "assets/aluminum-bridge-product-059.jpg",
    "url": "bridge-railing.html",
    "id": "24126675"
  },
  {
    "name": "WC-013B",
    "image": "assets/aluminum-bridge-product-060.jpg",
    "url": "bridge-railing.html",
    "id": "22437541"
  },
  {
    "name": "MAMMOS-485-A",
    "image": "assets/aluminum-bridge-product-061.jpg",
    "url": "bridge-railing.html",
    "id": "24481833"
  },
  {
    "name": "WC-080H",
    "image": "assets/aluminum-bridge-product-062.jpg",
    "url": "bridge-railing.html",
    "id": "26270526"
  },
  {
    "name": "WC-222H-H",
    "image": "assets/aluminum-bridge-product-063.jpg",
    "url": "bridge-railing.html",
    "id": "25705259"
  },
  {
    "name": "WC-1208H",
    "image": "assets/aluminum-bridge-product-064.jpg",
    "url": "bridge-railing.html",
    "id": "24817293"
  },
  {
    "name": "CROWN-0808-B",
    "image": "assets/aluminum-bridge-product-065.jpg",
    "url": "bridge-railing.html",
    "id": "24471704"
  },
  {
    "name": "WC-004PM",
    "image": "assets/aluminum-bridge-product-066.jpg",
    "url": "bridge-railing.html",
    "id": "23683171"
  },
  {
    "name": "WC-710H",
    "image": "assets/aluminum-bridge-product-067.jpg",
    "url": "bridge-railing.html",
    "id": "24817291"
  },
  {
    "name": "WC-155H",
    "image": "assets/aluminum-bridge-WC-155H.jpg",
    "url": "bridge-railing.html",
    "id": "22298503"
  },
  {
    "name": "WC-008GLS",
    "image": "assets/aluminum-bridge-product-068.jpg",
    "url": "bridge-railing.html",
    "id": "25599474"
  },
  {
    "name": "CAPTAIN-0315",
    "image": "assets/aluminum-bridge-product-069.jpg",
    "url": "bridge-railing.html",
    "id": "24655697"
  },
  {
    "name": "MAMMOS-485-C",
    "image": "assets/aluminum-bridge-product-070.jpg",
    "url": "bridge-railing.html",
    "id": "24481836"
  },
  {
    "name": "ADAM-JS-10",
    "image": "assets/aluminum-bridge-product-071.jpg",
    "url": "bridge-railing.html",
    "id": "24595004"
  },
  {
    "name": "WC-245H",
    "image": "assets/aluminum-bridge-product-072.jpg",
    "url": "bridge-railing.html",
    "id": "22990721"
  },
  {
    "name": "WC-5227H",
    "image": "assets/aluminum-bridge-product-073.jpg",
    "url": "bridge-railing.html",
    "id": "25192632"
  },
  {
    "name": "WC-606H",
    "image": "assets/aluminum-bridge-product-074.jpg",
    "url": "bridge-railing.html",
    "id": "25584997"
  },
  {
    "name": "WC-309H",
    "image": "assets/aluminum-bridge-product-075.jpg",
    "url": "bridge-railing.html",
    "id": "24149900"
  },
  {
    "name": "WC-308H",
    "image": "assets/aluminum-bridge-product-076.jpg",
    "url": "bridge-railing.html",
    "id": "23733442"
  },
  {
    "name": "WC-909H",
    "image": "assets/aluminum-bridge-product-077.jpg",
    "url": "bridge-railing.html",
    "id": "25124059"
  },
  {
    "name": "WC-5298H",
    "image": "assets/aluminum-bridge-WC-5298H.jpg",
    "url": "bridge-railing.html",
    "id": "25192630"
  },
  {
    "name": "WC-730H",
    "image": "assets/aluminum-bridge-product-078.jpg",
    "url": "bridge-railing.html",
    "id": "24817292"
  },
  {
    "name": "WC-284H",
    "image": "assets/aluminum-bridge-product-079.jpg",
    "url": "bridge-railing.html",
    "id": "23602544"
  },
  {
    "name": "GLS-01F",
    "image": "assets/aluminum-bridge-product-080.jpg",
    "url": "bridge-railing.html",
    "id": "26067770"
  },
  {
    "name": "WC-286H",
    "image": "assets/aluminum-bridge-product-081.jpg",
    "url": "bridge-railing.html",
    "id": "23602547"
  },
  {
    "name": "WC-512HW",
    "image": "assets/aluminum-bridge-product-082.jpg",
    "url": "bridge-railing.html",
    "id": "23270417"
  },
  {
    "name": "WC-294H",
    "image": "assets/aluminum-bridge-product-083.jpg",
    "url": "bridge-railing.html",
    "id": "23937802"
  },
  {
    "name": "WC-019GLS",
    "image": "assets/aluminum-bridge-product-084.jpg",
    "url": "bridge-railing.html",
    "id": "26170695"
  },
  {
    "name": "GLS-02F",
    "image": "assets/aluminum-bridge-product-085.jpg",
    "url": "bridge-railing.html",
    "id": "26207596"
  },
  {
    "name": "WC-702H-N",
    "image": "assets/aluminum-bridge-product-086.jpg",
    "url": "bridge-railing.html",
    "id": "25192722"
  },
  {
    "name": "WC-5803H",
    "image": "assets/aluminum-bridge-product-087.jpg",
    "url": "bridge-railing.html",
    "id": "25192626"
  },
  {
    "name": "WC-SJ-1250",
    "image": "assets/aluminum-bridge-product-088.jpg",
    "url": "bridge-railing.html",
    "id": "24796783"
  },
  {
    "name": "GLS-03F",
    "image": "assets/aluminum-bridge-product-089.jpg",
    "url": "bridge-railing.html",
    "id": "26207598"
  },
  {
    "name": "MAMMOS-JS-07",
    "image": "assets/aluminum-bridge-product-090.jpg",
    "url": "bridge-railing.html",
    "id": "22958994"
  },
  {
    "name": "WC-5888H",
    "image": "assets/aluminum-bridge-product-091.jpg",
    "url": "bridge-railing.html",
    "id": "25313007"
  },
  {
    "name": "WC-032H",
    "image": "assets/aluminum-bridge-product-092.jpg",
    "url": "bridge-railing.html",
    "id": "25124176"
  },
  {
    "name": "WC-1213H",
    "image": "assets/aluminum-bridge-product-093.jpg",
    "url": "bridge-railing.html",
    "id": "24030848"
  },
  {
    "name": "WC-234H",
    "image": "assets/aluminum-bridge-product-094.jpg",
    "url": "bridge-railing.html",
    "id": "22696758"
  },
  {
    "name": "MAMMOS-JS-20",
    "image": "assets/aluminum-bridge-product-095.jpg",
    "url": "bridge-railing.html",
    "id": "25563382"
  },
  {
    "name": "ADAM-JS-011",
    "image": "assets/aluminum-bridge-product-096.jpg",
    "url": "bridge-railing.html",
    "id": "25521147"
  },
  {
    "name": "WC-018GLS",
    "image": "assets/aluminum-bridge-product-097.jpg",
    "url": "bridge-railing.html",
    "id": "26065576"
  },
  {
    "name": "ADAM-JS-012",
    "image": "assets/aluminum-bridge-product-098.jpg",
    "url": "bridge-railing.html",
    "id": "25547510"
  },
  {
    "name": "WC-302H-NEW",
    "image": "assets/aluminum-bridge-product-099.jpg",
    "url": "bridge-railing.html",
    "id": "24064558"
  },
  {
    "name": "WC-142H",
    "image": "assets/aluminum-bridge-product-100.jpg",
    "url": "bridge-railing.html",
    "id": "22298526"
  },
  {
    "name": "WC-024H",
    "image": "assets/aluminum-bridge-product-101.jpg",
    "url": "bridge-railing.html",
    "id": "22044023"
  },
  {
    "name": "MAMMOS-JS-19",
    "image": "assets/aluminum-bridge-product-102.jpg",
    "url": "bridge-railing.html",
    "id": "24131114"
  },
  {
    "name": "WC-707H",
    "image": "assets/aluminum-bridge-product-103.jpg",
    "url": "bridge-railing.html",
    "id": "24645557"
  },
  {
    "name": "MAMMOS-JS-14",
    "image": "assets/aluminum-bridge-product-104.jpg",
    "url": "bridge-railing.html",
    "id": "23260796"
  },
  {
    "name": "ADAM-JS-01SZONE",
    "image": "assets/aluminum-bridge-product-105.jpg",
    "url": "bridge-railing.html",
    "id": "25088534"
  },
  {
    "name": "SWF-008",
    "image": "assets/aluminum-bridge-product-106.jpg",
    "url": "bridge-railing.html",
    "id": "25082942"
  },
  {
    "name": "ADAM-JS-17",
    "image": "assets/aluminum-bridge-product-107.jpg",
    "url": "bridge-railing.html",
    "id": "25192723"
  },
  {
    "name": "WC-1115H",
    "image": "assets/aluminum-bridge-product-108.jpg",
    "url": "bridge-railing.html",
    "id": "23816128"
  },
  {
    "name": "MAMMOS-JS-08",
    "image": "assets/aluminum-bridge-product-109.jpg",
    "url": "bridge-railing.html",
    "id": "22982048"
  },
  {
    "name": "WC-5140H",
    "image": "assets/aluminum-bridge-product-110.jpg",
    "url": "bridge-railing.html",
    "id": "25192629"
  },
  {
    "name": "WC-295H",
    "image": "assets/aluminum-bridge-product-111.jpg",
    "url": "bridge-railing.html",
    "id": "23996374"
  },
  {
    "name": "MAMMOS-JS-01",
    "image": "assets/aluminum-bridge-product-112.jpg",
    "url": "bridge-railing.html",
    "id": "22958990"
  },
  {
    "name": "WC-007PM",
    "image": "assets/aluminum-bridge-product-113.jpg",
    "url": "bridge-railing.html",
    "id": "23686656"
  },
  {
    "name": "ADAM-JS-08",
    "image": "assets/aluminum-bridge-ADAM-JS-08.jpg",
    "url": "bridge-railing.html",
    "id": "23994576"
  },
  {
    "name": "WC-255H",
    "image": "assets/aluminum-bridge-product-114.jpg",
    "url": "bridge-railing.html",
    "id": "23108815"
  },
  {
    "name": "WC-013GLS",
    "image": "assets/aluminum-bridge-product-115.jpg",
    "url": "bridge-railing.html",
    "id": "26057154"
  },
  {
    "name": "WC-001GLS",
    "image": "assets/aluminum-bridge-product-116.jpg",
    "url": "bridge-railing.html",
    "id": "24955444"
  },
  {
    "name": "ADAM-JS-04",
    "image": "assets/aluminum-bridge-product-117.jpg",
    "url": "bridge-railing.html",
    "id": "23551333"
  },
  {
    "name": "WC-5119H",
    "image": "assets/aluminum-bridge-product-118.jpg",
    "url": "bridge-railing.html",
    "id": "25192631"
  },
  {
    "name": "WC-002GLS",
    "image": "assets/aluminum-bridge-product-119.jpg",
    "url": "bridge-railing.html",
    "id": "24940221"
  },
  {
    "name": "WC-009GLS",
    "image": "assets/aluminum-bridge-product-120.jpg",
    "url": "bridge-railing.html",
    "id": "25628640"
  },
  {
    "name": "WC-003BIS",
    "image": "assets/aluminum-bridge-product-121.jpg",
    "url": "bridge-railing.html",
    "id": "25587011"
  },
  {
    "name": "WC-007GLS",
    "image": "assets/aluminum-bridge-product-122.jpg",
    "url": "bridge-railing.html",
    "id": "25436215"
  },
  {
    "name": "WC-006GLS",
    "image": "assets/aluminum-bridge-product-123.jpg",
    "url": "bridge-railing.html",
    "id": "25095316"
  },
  {
    "name": "SWF-003",
    "image": "assets/aluminum-bridge-product-124.jpg",
    "url": "bridge-railing.html",
    "id": "24874450"
  },
  {
    "name": "WD-001H",
    "image": "assets/aluminum-bridge-product-125.jpg",
    "url": "bridge-railing.html",
    "id": "26213869"
  },
  {
    "name": "SWF-002",
    "image": "assets/aluminum-bridge-product-126.jpg",
    "url": "bridge-railing.html",
    "id": "24430041"
  },
  {
    "name": "ARA-001SW",
    "image": "assets/aluminum-bridge-product-127.jpg",
    "url": "bridge-railing.html",
    "id": "24722295"
  },
  {
    "name": "WC-2800LIFE",
    "image": "assets/aluminum-bridge-product-128.jpg",
    "url": "bridge-railing.html",
    "id": "26294630"
  },
  {
    "name": "WC-2000LIFE",
    "image": "assets/aluminum-bridge-product-129.jpg",
    "url": "bridge-railing.html",
    "id": "25335174"
  },
  {
    "name": "WC-2500LIFE",
    "image": "assets/aluminum-bridge-product-130.jpg",
    "url": "bridge-railing.html",
    "id": "25335175"
  },
  {
    "name": "ARA-002SW",
    "image": "assets/aluminum-bridge-product-131.jpg",
    "url": "bridge-railing.html",
    "id": "24719588"
  },
  {
    "name": "WCF-01TV_낮",
    "image": "assets/aluminum-bridge-product-132.jpg",
    "url": "bridge-railing.html",
    "id": "24651509"
  },
  {
    "name": "WCF-07TV",
    "image": "assets/aluminum-bridge-product-133.jpg",
    "url": "bridge-railing.html",
    "id": "25563737"
  },
  {
    "name": "WCF-03TV_낮",
    "image": "assets/aluminum-bridge-product-134.jpg",
    "url": "bridge-railing.html",
    "id": "24651511"
  },
  {
    "name": "WCF-04TV_낮",
    "image": "assets/aluminum-bridge-product-135.jpg",
    "url": "bridge-railing.html",
    "id": "24651512"
  },
  {
    "name": "WCF-08TV",
    "image": "assets/aluminum-bridge-product-136.jpg",
    "url": "bridge-railing.html",
    "id": "25563738"
  },
  {
    "name": "WCF-02TV_낮",
    "image": "assets/aluminum-bridge-product-137.jpg",
    "url": "bridge-railing.html",
    "id": "24651510"
  },
  {
    "name": "WCF-06TV",
    "image": "assets/aluminum-bridge-product-138.jpg",
    "url": "bridge-railing.html",
    "id": "25563736"
  },
  {
    "name": "HANDAID-2000",
    "image": "assets/design-fence-new-001.jpg",
    "url": "design-fence.html",
    "id": "26073272"
  },
  {
    "name": "HANDAID-1500",
    "image": "assets/design-fence-new-002.jpg",
    "url": "design-fence.html",
    "id": "26073273"
  },
  {
    "name": "HANDAID-01",
    "image": "assets/design-fence-new-003.jpg",
    "url": "design-fence.html",
    "id": "23826915"
  },
  {
    "name": "XFEN-01",
    "image": "assets/design-fence-new-004.jpg",
    "url": "design-fence.html",
    "id": "25777091"
  },
  {
    "name": "WCF-002ROPE",
    "image": "assets/design-fence-new-005.jpg",
    "url": "design-fence.html",
    "id": "24774069"
  },
  {
    "name": "WCF-001ROPE",
    "image": "assets/design-fence-new-006.jpg",
    "url": "design-fence.html",
    "id": "24774068"
  },
  {
    "name": "WF-001",
    "image": "assets/design-fence-new-007.jpg",
    "url": "design-fence.html",
    "id": "24931675"
  },
  {
    "name": "WCF-303",
    "image": "assets/design-fence-new-008.jpg",
    "url": "design-fence.html",
    "id": "24149818"
  },
  {
    "name": "WCF-110",
    "image": "assets/design-fence-new-009.jpg",
    "url": "design-fence.html",
    "id": "23689195"
  },
  {
    "name": "WCF-702",
    "image": "assets/design-fence-new-010.jpg",
    "url": "design-fence.html",
    "id": "25672699"
  },
  {
    "name": "WCF-5001",
    "image": "assets/design-fence-new-011.jpg",
    "url": "design-fence.html",
    "id": "24972763"
  },
  {
    "name": "WCF-003",
    "image": "assets/design-fence-new-012.jpg",
    "url": "design-fence.html",
    "id": "23203449"
  },
  {
    "name": "WCF-056",
    "image": "assets/design-fence-new-013.jpg",
    "url": "design-fence.html",
    "id": "23449963"
  },
  {
    "name": "WCF-017",
    "image": "assets/design-fence-new-014.jpg",
    "url": "design-fence.html",
    "id": "23209422"
  },
  {
    "name": "XFEN-13",
    "image": "assets/design-fence-new-015.jpg",
    "url": "design-fence.html",
    "id": "26192218"
  },
  {
    "name": "WCF-339",
    "image": "assets/design-fence-new-016.jpg",
    "url": "design-fence.html",
    "id": "26103465"
  },
  {
    "name": "WCF-01THIN",
    "image": "assets/design-fence-new-017.jpg",
    "url": "design-fence.html",
    "id": "25599009"
  },
  {
    "name": "WCF-047",
    "image": "assets/design-fence-new-018.jpg",
    "url": "design-fence.html",
    "id": "23348709"
  },
  {
    "name": "WCF-248",
    "image": "assets/design-fence-new-019.jpg",
    "url": "design-fence.html",
    "id": "26103466"
  },
  {
    "name": "XFEN-11",
    "image": "assets/design-fence-new-020.jpg",
    "url": "design-fence.html",
    "id": "26192217"
  },
  {
    "name": "WCF-1011",
    "image": "assets/design-fence-new-021.jpg",
    "url": "design-fence.html",
    "id": "26030132"
  },
  {
    "name": "WCF-078",
    "image": "assets/design-fence-new-022.jpg",
    "url": "design-fence.html",
    "id": "23633850"
  },
  {
    "name": "WCF-1001",
    "image": "assets/design-fence-new-023.jpg",
    "url": "design-fence.html",
    "id": "26025667"
  },
  {
    "name": "WCF-109SW",
    "image": "assets/design-fence-new-024.jpg",
    "url": "design-fence.html",
    "id": "25419072"
  },
  {
    "name": "WCF-007WF",
    "image": "assets/design-fence-new-025.jpg",
    "url": "design-fence.html",
    "id": "26175091"
  },
  {
    "name": "WCF-071",
    "image": "assets/design-fence-new-026.jpg",
    "url": "design-fence.html",
    "id": "23562078"
  },
  {
    "name": "WCF-1014",
    "image": "assets/design-fence-new-027.jpg",
    "url": "design-fence.html",
    "id": "26038447"
  },
  {
    "name": "GP-007F",
    "image": "assets/design-fence-new-028.jpg",
    "url": "design-fence.html",
    "id": "26156051"
  },
  {
    "name": "WCF-315",
    "image": "assets/design-fence-new-029.jpg",
    "url": "design-fence.html",
    "id": "24833223"
  },
  {
    "name": "WCF-126",
    "image": "assets/design-fence-new-030.jpg",
    "url": "design-fence.html",
    "id": "23894184"
  },
  {
    "name": "WCF-102",
    "image": "assets/design-fence-new-031.jpg",
    "url": "design-fence.html",
    "id": "23656692"
  },
  {
    "name": "WCF-091",
    "image": "assets/design-fence-new-032.jpg",
    "url": "design-fence.html",
    "id": "23725769"
  },
  {
    "name": "WCF-076",
    "image": "assets/design-fence-new-033.jpg",
    "url": "design-fence.html",
    "id": "23635137"
  },
  {
    "name": "WCF-108",
    "image": "assets/design-fence-new-034.jpg",
    "url": "design-fence.html",
    "id": "23687598"
  },
  {
    "name": "WCF-054",
    "image": "assets/design-fence-new-035.jpg",
    "url": "design-fence.html",
    "id": "23449964"
  },
  {
    "name": "WCF-022",
    "image": "assets/design-fence-new-036.jpg",
    "url": "design-fence.html",
    "id": "23221451"
  },
  {
    "name": "WCF-228",
    "image": "assets/design-fence-new-037.jpg",
    "url": "design-fence.html",
    "id": "24831923"
  },
  {
    "name": "WCF-1017",
    "image": "assets/design-fence-new-038.jpg",
    "url": "design-fence.html",
    "id": "26153808"
  },
  {
    "name": "WCF-031",
    "image": "assets/design-fence-new-039.jpg",
    "url": "design-fence.html",
    "id": "23231873"
  },
  {
    "name": "WCF-1009",
    "image": "assets/design-fence-new-040.jpg",
    "url": "design-fence.html",
    "id": "26030131"
  },
  {
    "name": "WCF-1010",
    "image": "assets/design-fence-new-041.jpg",
    "url": "design-fence.html",
    "id": "26030133"
  },
  {
    "name": "WCF-703",
    "image": "assets/design-fence-new-042.jpg",
    "url": "design-fence.html",
    "id": "25679223"
  },
  {
    "name": "WCF-1008",
    "image": "assets/design-fence-new-043.jpg",
    "url": "design-fence.html",
    "id": "26030130"
  },
  {
    "name": "TWIN-001F",
    "image": "assets/design-fence-new-044.png",
    "url": "design-fence.html",
    "id": "25223655"
  },
  {
    "name": "WCF-369SW",
    "image": "assets/design-fence-new-045.jpg",
    "url": "design-fence.html",
    "id": "26122003"
  },
  {
    "name": "WCF-SW-1100",
    "image": "assets/design-fence-new-046.jpg",
    "url": "design-fence.html",
    "id": "24592154"
  },
  {
    "name": "WCF-698",
    "image": "assets/design-fence-new-047.png",
    "url": "design-fence.html",
    "id": "25647649"
  },
  {
    "name": "ALFEN-VC1500B",
    "image": "assets/design-fence-new-048.jpg",
    "url": "design-fence.html",
    "id": "25270249"
  },
  {
    "name": "WCF-023",
    "image": "assets/design-fence-new-049.jpg",
    "url": "design-fence.html",
    "id": "23222416"
  },
  {
    "name": "WCF-883",
    "image": "assets/design-fence-new-050.jpg",
    "url": "design-fence.html",
    "id": "24964483"
  },
  {
    "name": "WCF-884",
    "image": "assets/design-fence-new-051.jpg",
    "url": "design-fence.html",
    "id": "24964484"
  },
  {
    "name": "PJPD-02",
    "image": "assets/design-fence-new-052.jpg",
    "url": "design-fence.html",
    "id": "25610243"
  },
  {
    "name": "WCF-1007",
    "image": "assets/design-fence-new-053.jpg",
    "url": "design-fence.html",
    "id": "26030129"
  },
  {
    "name": "WCF-GJ-001",
    "image": "assets/design-fence-new-054.jpg",
    "url": "design-fence.html",
    "id": "25649571"
  },
  {
    "name": "WCF-222SW",
    "image": "assets/design-fence-new-055.jpg",
    "url": "design-fence.html",
    "id": "24447280"
  },
  {
    "name": "WCF-111SW",
    "image": "assets/design-fence-new-056.jpg",
    "url": "design-fence.html",
    "id": "24447281"
  },
  {
    "name": "WCF-1004",
    "image": "assets/design-fence-new-057.jpg",
    "url": "design-fence.html",
    "id": "25293070"
  },
  {
    "name": "WCF-117",
    "image": "assets/design-fence-new-058.jpg",
    "url": "design-fence.html",
    "id": "23811054"
  },
  {
    "name": "WCF-1005",
    "image": "assets/design-fence-new-059.jpg",
    "url": "design-fence.html",
    "id": "25419013"
  },
  {
    "name": "WCF-501GJ",
    "image": "assets/design-fence-new-060.jpg",
    "url": "design-fence.html",
    "id": "24774070"
  },
  {
    "name": "ALFEN-4C2000",
    "image": "assets/design-fence-new-061.jpg",
    "url": "design-fence.html",
    "id": "25220130"
  },
  {
    "name": "WCF-GJ-002",
    "image": "assets/design-fence-new-062.jpg",
    "url": "design-fence.html",
    "id": "25649572"
  },
  {
    "name": "PJPD-01",
    "image": "assets/design-fence-new-063.jpg",
    "url": "design-fence.html",
    "id": "25605330"
  },
  {
    "name": "WCF-503GJ",
    "image": "assets/design-fence-new-064.jpg",
    "url": "design-fence.html",
    "id": "25617412"
  },
  {
    "name": "WCF-204",
    "image": "assets/design-fence-new-065.jpg",
    "url": "design-fence.html",
    "id": "23637085"
  },
  {
    "name": "WCF-GJ-003",
    "image": "assets/design-fence-new-066.jpg",
    "url": "design-fence.html",
    "id": "25658317"
  },
  {
    "name": "WCF-202",
    "image": "assets/design-fence-new-067.jpg",
    "url": "design-fence.html",
    "id": "23637081"
  },
  {
    "name": "BARRICON-A",
    "image": "assets/design-fence-new-068.jpg",
    "url": "design-fence.html",
    "id": "26189610"
  },
  {
    "name": "BARRICON-A-01",
    "image": "assets/design-fence-new-069.jpg",
    "url": "design-fence.html",
    "id": "26189612"
  },
  {
    "name": "WCF-1018",
    "image": "assets/design-fence-new-070.jpg",
    "url": "design-fence.html",
    "id": "26153807"
  },
  {
    "name": "WCF-1088",
    "image": "assets/design-fence-new-071.jpg",
    "url": "design-fence.html",
    "id": "26373794"
  },
  {
    "name": "WCF-207",
    "image": "assets/design-fence-new-072.jpg",
    "url": "design-fence.html",
    "id": "23701876"
  },
  {
    "name": "BARRICON-A-02",
    "image": "assets/design-fence-new-073.jpg",
    "url": "design-fence.html",
    "id": "26189611"
  },
  {
    "name": "WCF-1016",
    "image": "assets/design-fence-new-074.jpg",
    "url": "design-fence.html",
    "id": "26144147"
  },
  {
    "name": "WCF-1015",
    "image": "assets/design-fence-new-075.jpg",
    "url": "design-fence.html",
    "id": "26107311"
  },
  {
    "name": "CHILDCAP-LV1",
    "image": "assets/design-fence-new-076.jpg",
    "url": "design-fence.html",
    "id": "25481794"
  },
  {
    "name": "CHILDCAP-LV1-A",
    "image": "assets/design-fence-new-077.jpg",
    "url": "design-fence.html",
    "id": "25481795"
  },
  {
    "name": "CHILDCAP-LV1-B",
    "image": "assets/design-fence-new-078.jpg",
    "url": "design-fence.html",
    "id": "25481796"
  },
  {
    "name": "WC-123MF",
    "image": "assets/design-fence-new-079.jpg",
    "url": "design-fence.html",
    "id": "25466505"
  },
  {
    "name": "WCF-88STONE",
    "image": "assets/design-fence-new-080.jpg",
    "url": "design-fence.html",
    "id": "26254003"
  },
  {
    "name": "ALFEN-VC2000",
    "image": "assets/design-fence-new-081.jpg",
    "url": "design-fence.html",
    "id": "25282744"
  },
  {
    "name": "WC-501H-B",
    "image": "assets/design-fence-new-082.jpg",
    "url": "design-fence.html",
    "id": "25132613"
  },
  {
    "name": "SANTA-475",
    "image": "assets/aluminum-median-barrier-new-001.jpg",
    "url": "aluminum-median-barrier.html",
    "id": "24782605"
  },
  {
    "name": "DONCARS-03",
    "image": "assets/lane-divider-new-001.jpg",
    "url": "lane-divider.html",
    "id": "24707717"
  },
  {
    "name": "DONCARS-02",
    "image": "assets/lane-divider-new-002.jpg",
    "url": "lane-divider.html",
    "id": "24707716"
  },
  {
    "name": "WC-009VF",
    "image": "assets/bar-fence-new-001.jpg",
    "url": "bar-fence.html",
    "id": "23681577"
  },
  {
    "name": "WC-27VF01",
    "image": "assets/bar-fence-new-002.png",
    "url": "bar-fence.html",
    "id": "24893176"
  },
  {
    "name": "WC-24VF01",
    "image": "assets/bar-fence-new-003.jpg",
    "url": "bar-fence.html",
    "id": "24964489"
  },
  {
    "name": "WC-27VF03",
    "image": "assets/bar-fence-new-004.jpg",
    "url": "bar-fence.html",
    "id": "25494932"
  },
  {
    "name": "WC-27VF05",
    "image": "assets/bar-fence-new-005.jpg",
    "url": "bar-fence.html",
    "id": "26157852"
  },
  {
    "name": "WCF-001STONE",
    "image": "assets/metal-other-fence-new-001.jpg",
    "url": "metal-other-fence.html",
    "id": "24047679"
  },
  {
    "name": "WCF-801",
    "image": "assets/metal-other-fence-new-002.jpg",
    "url": "metal-other-fence.html",
    "id": "24032892"
  },
  {
    "name": "WCF-805",
    "image": "assets/metal-other-fence-new-003.jpg",
    "url": "metal-other-fence.html",
    "id": "26213795"
  },
  {
    "name": "WCF-806",
    "image": "assets/metal-other-fence-new-004.jpg",
    "url": "metal-other-fence.html",
    "id": "26213796"
  },
  {
    "name": "WC-004-ST",
    "image": "assets/metal-other-fence-new-005.jpg",
    "url": "metal-other-fence.html",
    "id": "24032891"
  },
  {
    "name": "WCF-007STONE",
    "image": "assets/metal-other-fence-new-006.jpg",
    "url": "metal-other-fence.html",
    "id": "26216533"
  }
];

  // 주요제품명으로 검색해도 해당 카테고리의 제품이 함께 표시되도록 검색어를 확장합니다.
  const categoryAliases = {
    'bridge-railing.html': ['알루미늄제교량난간', '알루미늄교량난간', '교량난간', '보도난간'],
    'design-fence.html': ['디자인형울타리', '디자인울타리', '경관펜스', '디자인펜스'],
    'metal-other-fence.html': ['금속제기타울타리', '금속제기울타리', '기타울타리'],
    'aluminum-median-barrier.html': ['알루미늄제도로중앙분리대', '도로중앙분리대', '중앙분리대'],
    'lane-divider.html': ['차선분리대', '차선 분리대'],
    'bar-fence.html': ['창살형울타리', '창살 울타리']
  };

  const normalize = value => value.toLowerCase().replace(/[\s_\-/]/g, '');

  function render(query) {
    results.replaceChildren();
    const q = normalize(query.trim());

    if (!q) {
      const hint = document.createElement('p');
      hint.className = 'search-empty';
      hint.textContent = '제품명을 입력하면 제품 이미지가 표시됩니다.';
      results.appendChild(hint);
      return;
    }

    const matches = products.filter(p => {
      const searchable = [p.name, p.id || '', ...(categoryAliases[p.url] || [])]
        .map(normalize).join(' ');
      return searchable.includes(q);
    });

    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = '검색 결과가 없습니다.';
      results.appendChild(empty);
      return;
    }

    matches.slice(0, 12).forEach(product => {
      const card = document.createElement('a');
      card.className = 'product-search-card';
      card.href = product.url + '#product=' + encodeURIComponent(product.name);

      const img = document.createElement('img');
      img.src = product.image;
      img.alt = product.name;

      const name = document.createElement('strong');
      name.textContent = product.name;

      card.append(img, name);
      if (product.id) {
        const id = document.createElement('small');
        id.textContent = `식별번호 ${product.id}`;
        card.appendChild(id);
      }
      results.appendChild(card);
    });
  }

  input.addEventListener('input', e => render(e.target.value));
  input.addEventListener('search', e => render(e.target.value));
  document.getElementById('searchSubmit')?.addEventListener('click', () => render(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') render(input.value);
  });
  render('');
})();
