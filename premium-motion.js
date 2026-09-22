(()=>{
  "use strict";
  const doc=document;
  const root=doc.documentElement;
  const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("motion-ready");

  const progress=doc.createElement("div");
  progress.className="premium-progress";
  progress.setAttribute("aria-hidden","true");
  doc.body.prepend(progress);

  const transition=doc.createElement("div");
  transition.className="page-transition";
  transition.setAttribute("aria-hidden","true");
  doc.body.append(transition);

  const header=doc.querySelector(".site-header");
  let ticking=false;
  const onScroll=()=>{
    const y=window.scrollY||doc.documentElement.scrollTop;
    const max=Math.max(1,doc.documentElement.scrollHeight-window.innerHeight);
    progress.style.transform="scaleX("+Math.min(1,y/max)+")";
    if(header) header.classList.toggle("is-scrolled",y>18);
    ticking=false;
  };
  const requestScroll=()=>{
    if(!ticking){requestAnimationFrame(onScroll);ticking=true}
  };
  addEventListener("scroll",requestScroll,{passive:true});
  addEventListener("resize",requestScroll,{passive:true});
  onScroll();

  const revealSelectors=[
    ".product-list-hero > *",".case-hero > *",".quote-hero > *",
    ".b-hero-inner > *",".b-manifesto-copy",".b-number",".b-cap-title",
    ".b-cap-row",".b-principles-head",".b-principle-grid article",".b-closing > div",
    ".catalog-card",".product-card",".case-card",".project-card",
    ".value-card",".company-card",".promise-card",".tech-card",
    ".company-section-head",".history-item",".quote-form",
    ".project-gallery-head",".project-gallery-section img",
    ".section-title",".section-head"
  ];
  const seen=new Set();
  const reveals=[];
  doc.querySelectorAll(revealSelectors.join(",")).forEach((el)=>{
    if(seen.has(el)||el.closest(".intro-video")) return;
    seen.add(el);
    el.classList.add("motion-reveal");
    const index=reveals.length;
    el.style.setProperty("--premium-delay",Math.min(index%5,4)*55+"ms");
    if(el.matches(".b-manifesto-copy,.company-section-head,.section-head")) el.dataset.motion="left";
    else if(el.matches(".quote-form,.b-closing > div")) el.dataset.motion="scale";
    reveals.push(el);
  });

  if(reduced||!("IntersectionObserver" in window)){
    reveals.forEach(el=>el.classList.add("motion-in"));
  }else{
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("motion-in");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.09,rootMargin:"0px 0px -6% 0px"});
    reveals.forEach(el=>observer.observe(el));
  }

  const interactiveSelector=[
    ".catalog-card",".product-card",".case-card",".project-card",
    ".value-card",".company-card",".promise-card",".tech-card",
    ".b-principle-grid article"
  ].join(",");
  doc.querySelectorAll(interactiveSelector).forEach(card=>{
    card.classList.add("premium-interactive");
    const sheen=doc.createElement("span");
    sheen.className="premium-sheen";
    sheen.setAttribute("aria-hidden","true");
    card.append(sheen);
    if(!reduced){
      card.addEventListener("pointermove",event=>{
        const box=card.getBoundingClientRect();
        card.style.setProperty("--premium-x",((event.clientX-box.left)/box.width*100).toFixed(1)+"%");
        card.style.setProperty("--premium-y",((event.clientY-box.top)/box.height*100).toFixed(1)+"%");
      },{passive:true});
    }
  });

  /* The 3D link is an independent action inside a card that opens G2B. */
  doc.querySelectorAll(".product-3d-link").forEach(link=>{
    link.addEventListener("click",event=>event.stopPropagation());
    link.addEventListener("keydown",event=>event.stopPropagation());
  });

  doc.addEventListener("pointerdown",event=>{
    if(reduced) return;
    const target=event.target.closest(".btn,.header-cta,.product-3d-link,.b-closing a,.company-cta a,.quote-submit,.qsubmit,button");
    if(!target) return;
    const rect=target.getBoundingClientRect();
    const ripple=doc.createElement("span");
    ripple.className="premium-ripple";
    ripple.style.left=(event.clientX-rect.left)+"px";
    ripple.style.top=(event.clientY-rect.top)+"px";
    target.append(ripple);
    setTimeout(()=>ripple.remove(),700);
  });

  if(!reduced){
    doc.addEventListener("click",event=>{
      const link=event.target.closest("a[href]");
      if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey) return;
      if(link.target&&link.target!=="_self"||link.hasAttribute("download")) return;
      const raw=link.getAttribute("href");
      if(!raw||raw.startsWith("#")||raw.startsWith("mailto:")||raw.startsWith("tel:")||raw.startsWith("javascript:")) return;
      let url;
      try{url=new URL(link.href,location.href)}catch(_){return}
      if(url.origin!==location.origin||url.href===location.href) return;
      event.preventDefault();
      transition.classList.add("is-active");
      setTimeout(()=>{location.href=url.href},1080);
    });
  }

  addEventListener("pageshow",()=>{
    transition.classList.remove("is-active");
    requestAnimationFrame(()=>doc.body.classList.add("premium-loaded"));
  });
})();
