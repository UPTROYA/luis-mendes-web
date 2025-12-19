/* ===================================== */
/* MAIN JS - DEFINITIVO CINEMATOGRÁFICO  */
/* ===================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 0. INICIALIZAÇÃO DO LENIS (SMOOTH SCROLL)
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    smooth: true,
    smoothTouch: false 
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // OTIMIZAÇÃO DE VÍDEO CINEMATOGRÁFICO
  const cinemaVideo = document.querySelector('.cinema-video');
  if (cinemaVideo) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cinemaVideo.play().catch(() => {}); 
        } else {
          cinemaVideo.pause();
        }
      });
    }, { threshold: 0.1 });
    videoObserver.observe(cinemaVideo);
  }

  window.scrollTo(0, 0);
  lenis.scrollTo(0, { immediate: true });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        lenis.scrollTo(targetId);
      }
    });
  });

  // 1. PAGE TRANSITION
  const transition = document.querySelector('.page-transition');
  if(transition) setTimeout(() => transition.classList.add('hide'), 100);

  // 2. MENU MOBILE
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "auto";
    });
  }

  // 3. LINKS EXTERNOS
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
         e.preventDefault();
         if(transition) transition.classList.remove('hide');
         setTimeout(() => window.location.href = href, 500);
      }
    });
  });

  // 4. SISTEMA DE PARTÍCULAS
  const canvas = document.getElementById("particles");
  if(canvas) initParticles(canvas);

  // 5. ANIMAÇÕES
  initScrollAnimation();
  initTiltAndSpotlight(); 
  initScrollSpy();
  initFaq();
});

function initTiltAndSpotlight() {
  // Ignora o cinema-frame para manter o vídeo estático e sofisticado
  const cards = document.querySelectorAll('.spotlight-card:not(.cinema-frame .spotlight-card)');
  
  if (window.innerWidth < 1024) return;

  cards.forEach(card => {
    let bounds;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let animationFrameId = null;

    function updateCard() {
      if (!isHovering) return;
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const rotateX = ((currentY - centerY) / centerY) * -5; 
      const rotateY = ((currentX - centerX) / centerX) * 5;

      card.style.setProperty('--x', `${currentX}px`);
      card.style.setProperty('--y', `${currentY}px`);
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      animationFrameId = requestAnimationFrame(updateCard);
    }

    card.addEventListener('mouseenter', () => {
      isHovering = true;
      bounds = card.getBoundingClientRect();
      card.style.transition = 'opacity 0.4s ease, box-shadow 0.4s ease'; 
      updateCard();
    });

    card.addEventListener('mousemove', (e) => {
      if(!bounds) return;
      currentX = e.clientX - bounds.left;
      currentY = e.clientY - bounds.top;
    });

    card.addEventListener('mouseleave', () => {
      isHovering = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease, box-shadow 0.4s ease';
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

function initParticles(canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationId;
  let isVisible = true;

  function resize() {
    const heroSection = document.querySelector(".hero");
    if(heroSection) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = heroSection.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${heroSection.offsetHeight}px`;
    }
  }
  window.addEventListener("resize", resize);
  resize();

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fade = Math.random() * 0.003 + 0.001;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fade;
      if (this.opacity <= 0 || this.y < -10) {
        this.reset();
        this.opacity = 0;
        setTimeout(() => { this.opacity = Math.random() * 0.5 + 0.2; }, 100);
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(237, 165, 71, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 50; i++) particles.push(new Particle());

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) { if (!animationId) animate(); } 
      else { cancelAnimationFrame(animationId); animationId = null; }
    });
  });
  
  const heroSection = document.querySelector(".hero");
  if (heroSection) heroObserver.observe(heroSection);

  function animate() {
    if (!isVisible) return;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    animationId = requestAnimationFrame(animate);
  }
  animate();
}

function initScrollAnimation() {
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach((el) => {
    scrollObserver.observe(el);
  });
}

function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => { i.classList.remove('active'); i.querySelector('.faq-answer').style.maxHeight = null; });
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if(link.getAttribute('href') === `#${entry.target.id}`) link.classList.add('active');
        });
      }
    });
  }, { rootMargin: "-20% 0px -60% 0px" });
  sections.forEach(s => observer.observe(s));
}