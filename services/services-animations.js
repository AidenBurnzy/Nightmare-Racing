(function(){
  function addLocationChip(){
    const meta = document.getElementById('service-meta');
    if (!meta) return;
    const exists = Array.from(meta.querySelectorAll('span')).some(s => s.textContent?.toLowerCase().includes('hudsonville'));
    if (!exists){
      const chip = document.createElement('span');
      chip.textContent = 'Hudsonville, MI';
      meta.appendChild(chip);
    }
  }

  function tagRevealTargets(){
    const title = document.getElementById('service-title');
    if (title){
      title.setAttribute('data-reveal','up');
      title.classList.add('title-animate');
      // Small delay so the onload reveal feels intentional
      title.style.setProperty('--reveal-delay','80ms');
      // Force the title to animate on initial page load
      setTimeout(()=>{
        title.classList.add('in-view');
      }, 60);
    }

    const tagline = document.getElementById('service-tagline');
    if (tagline) tagline.setAttribute('data-reveal','fade');

    const meta = document.getElementById('service-meta');
    if (meta){
      meta.setAttribute('data-reveal','up');
      meta.classList.add('reveal-stagger');
      meta.querySelectorAll('span').forEach((chip, i)=>{
        chip.setAttribute('data-reveal','up');
        chip.style.setProperty('--reveal-delay', `${i*80}ms`);
      });
    }

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) heroVisual.setAttribute('data-reveal','scale');

    const backdropImg = document.querySelector('.hero-backdrop-image');
    if (backdropImg){
      backdropImg.setAttribute('data-reveal','fade');
      backdropImg.style.setProperty('--reveal-delay','40ms');
    }

    const detailsGrid = document.getElementById('service-details');
    if (detailsGrid){
      detailsGrid.setAttribute('data-reveal','up');
      detailsGrid.classList.add('reveal-stagger');
      detailsGrid.querySelectorAll('.details-card').forEach((card, i)=>{
        card.setAttribute('data-reveal','up');
        card.style.setProperty('--reveal-delay', `${i*80}ms`);
      });
    }

    const ctaTitle = document.getElementById('cta-title');
    if (ctaTitle) ctaTitle.setAttribute('data-reveal','up');
    const ctaDesc = document.getElementById('cta-description');
    if (ctaDesc) ctaDesc.setAttribute('data-reveal','fade');
    const ctaActions = document.getElementById('cta-actions');
    if (ctaActions){
      ctaActions.setAttribute('data-reveal','up');
      ctaActions.classList.add('reveal-stagger');
      ctaActions.querySelectorAll('a').forEach((a, i)=>{
        a.setAttribute('data-reveal','up');
        a.style.setProperty('--reveal-delay', `${i*80}ms`);
      });
    }
  }

  function setupObserver(){
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          // once in view, no need to observe further for performance
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
  }

  function setupParallax(){
    const hero = document.querySelector('.hero-visual');
    if (!hero) return;
    const onScroll = ()=>{
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));
      const offset = (progress * 10).toFixed(2);
      hero.style.setProperty('--parallax-y', `${offset}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function init(){
    addLocationChip();
    // Some content is rendered by service-specific JS after DOMContentLoaded.
    // Defer tagging and observing to run after a short delay to ensure content exists.
    setTimeout(()=>{
      tagRevealTargets();
      setupObserver();
      setupParallax();
    }, 50);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
