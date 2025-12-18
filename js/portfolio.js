/**
 * =========================================
 *  PORTFOLIO.JS
 *  JS EXCLUSIVO DA PÁGINA PORTFOLIO
 *  Não interfere em outras páginas
 * =========================================
 */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
   *  FADE-UP (ANIMAÇÕES SEGURAS)
   * ========================================= */

  const fadeElements = document.querySelectorAll(".fade-up");

  // Se não houver elementos, não faz nada
  if (fadeElements.length > 0 && "IntersectionObserver" in window) {

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // anima uma vez
        }
      });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => observer.observe(el));

  } else {
    // Fallback: garante que tudo apareça
    fadeElements.forEach(el => el.classList.add("active"));
  }

  /* =========================================
   *  VÍDEO DO HERO (GARANTIA DE AUTOPLAY)
   * ========================================= */

  const heroVideo = document.querySelector(".cinema-screen video");

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.play().catch(() => {
      // Se o navegador bloquear autoplay, mantém estático
      console.warn("Autoplay bloqueado pelo navegador.");
    });
  }

});
