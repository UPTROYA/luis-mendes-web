/**
 * PORTFOLIO.JS
 * Controle de animações e transições da página de portfólio
 */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. PAGE TRANSITION (Efeito de carregamento)
  const transitionEl = document.querySelector('.page-transition');
  
  // Remove a tela preta assim que o DOM carregar
  setTimeout(() => {
    transitionEl.classList.add('hide');
  }, 100);

  // Intercepta cliques nos links para fazer a transição de saída
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      
      // Só ativa se for link interno e não for âncora (#)
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        e.preventDefault();
        transitionEl.classList.remove('hide'); // Mostra a tela preta
        
        setTimeout(() => {
          window.location.href = href;
        }, 500); // Tempo igual ao CSS transition
      }
    });
  });

  // 2. SCROLL ANIMATION (Observer)
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const observerOptions = {
    threshold: 0.1, // Dispara quando 10% do elemento aparece
    rootMargin: "0px 0px -50px 0px" // Dispara um pouco antes de subir totalmente
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        scrollObserver.unobserve(entry.target); // Para de observar após animar
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));
});