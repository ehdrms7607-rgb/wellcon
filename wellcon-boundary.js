(()=>{
  "use strict";
  const doc=document,root=doc.documentElement;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("boundary-ready");

  const track=doc.createElement("div");
  track.className="boundary-track";
  track.setAttribute("aria-hidden","true");
  track.innerHTML="<span></span>";
  doc.body.append(track);
  const trackFill=track.firstElementChild;

  const transition=doc.createElement("div");
  transition.className="boundary-transition";
  transition.setAttribute("aria-hidden","true");
  transition.innerHTML="<i></i><i></i>";
  doc.body.append(transition);

  const header=doc.querySelector(".site-header");
  const update=()=>{
    const y=scrollY||doc.documentElement.scrollTop;
    const max=Math.max(1,doc.documentElement.scrollHeight-innerHeight);
    trackFill.style.transform="scaleY("+Math.min(1,y/max)+")";
    if(header) header.classList.toggle("is-scrolled",y>20);
  };
  let frame=0;
  addEventListener("scroll",()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;update()})},{passive:true});
  addEventListener("resize",update,{passive:true});
  update();

  const selectors=[
    ".product-list-hero>*",".case-hero>*",".quote-hero>*",
    ".b-hero-inner>*",".b-manifesto-copy",".b-number",".b-cap-title",".b-cap-row",
    ".b-principles-head",".b-principle-grid article",".b-closing>div",
    ".catalog-card",".product-card",".case-card",".project-card",
    ".company-section-head",".history-item",".quote-form",".tech-card",".project-gallery-head"
  ];
  const nodes=[...new Set(doc.querySelectorAll(selectors.join(",")))].filter(el=>!el.closest(".intro-video"));
  nodes.forEach((el,index)=>{
    el.classList.add("boundary-reveal");
    el.style.setProperty("--bc-delay",(index%4)*60+"ms");
  });
  if(reduced||!("IntersectionObserver" in window)) nodes.forEach(el=>el.classList.add("boundary-in"));
  else{
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("boundary-in");io.unobserve(entry.target)}
    }),{threshold:.08,rootMargin:"0px 0px -5% 0px"});
    nodes.forEach(el=>io.observe(el));
  }

  if(!reduced&&matchMedia("(hover:hover) and (pointer:fine)").matches){
    const dot=doc.createElement("div"),ring=doc.createElement("div");
    dot.className="boundary-cursor";ring.className="boundary-cursor-ring";
    doc.body.append(dot,ring);
    let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;
    addEventListener("pointermove",event=>{
      x=event.clientX;y=event.clientY;
      dot.style.opacity=ring.style.opacity="1";
      dot.style.left=x+"px";dot.style.top=y+"px";
      ring.classList.toggle("is-link",!!event.target.closest("a,button,input,.catalog-card,.case-card"));
    },{passive:true});
    const draw=()=>{
      rx+=(x-rx)*.16;ry+=(y-ry)*.16;
      ring.style.left=rx+"px";ring.style.top=ry+"px";
      requestAnimationFrame(draw);
    };draw();
  }

  doc.querySelectorAll(".product-3d-link").forEach(link=>{
    link.addEventListener("click",event=>event.stopPropagation());
    link.addEventListener("keydown",event=>event.stopPropagation());
  });

  if(!reduced) doc.addEventListener("click",event=>{
    const link=event.target.closest("a[href]");
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey) return;
    if(link.target&&link.target!=="_self"||link.hasAttribute("download")) return;
    const raw=link.getAttribute("href");
    if(!raw||raw.startsWith("#")||raw.startsWith("mailto:")||raw.startsWith("tel:")||raw.startsWith("javascript:")) return;
    let url;try{url=new URL(link.href,location.href)}catch(_){return}
    if(url.origin!==location.origin||url.href===location.href) return;
    event.preventDefault();
    transition.classList.add("is-active");
    setTimeout(()=>{location.href=url.href},1080);
  });
  addEventListener("pageshow",()=>transition.classList.remove("is-active"));
})();
