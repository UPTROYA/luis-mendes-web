/**
 * MAIN.JS - Lógica Global Otimizada
 */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. PAGE TRANSITION (Efeito de carregamento simples)
  const transitionEl = document.querySelector('.page-transition');
  
  setTimeout(() => {
    if(transitionEl) transitionEl.classList.add('hide');
  }, 100);

  // Intercepta cliques para transição suave
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      // Apenas links internos reais
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && link.target !== '_blank') {
        e.preventDefault();
        if(transitionEl) transitionEl.classList.remove('hide');
        setTimeout(() => { window.location.href = href; }, 400);
      }
    });
  });

  // 2. SCROLL ANIMATION (Observer de Performance)
  const animatedElements = document.querySelectorAll('.fade-up');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // requestAnimationFrame para evitar "jank" no scroll
        requestAnimationFrame(() => {
          entry.target.classList.add('in-view');
        });
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));

  // 3. MENU MOBILE
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if(hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
});

// 4. LENIS SMOOTH SCROLL (Configuração Otimizada para Performance)
// Verifica se o Lenis foi carregado antes de iniciar
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false, // DESATIVADO NO MOBILE PARA PERFORMANCE
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}