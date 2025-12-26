/* ===================================== */
/* MAIN JS - OTIMIZADO (SEM ALTERAR UI) */
/* ===================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ============================= */
  /* 1. LENIS (SMOOTH SCROLL)     */
  /* ============================= */
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false
  });

  let lenisRAF;
  function raf(time) {
    lenis.raf(time);
    lenisRAF = requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(lenisRAF);
    else requestAnimationFrame(raf);
  });

  window.scrollTo(0, 0);
  lenis.scrollTo(0, { immediate: true });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id.length > 1) {
        e.preventDefault();
        lenis.scrollTo(id);
      }
    });
  });

  /* ============================= */
  /* 2. PAGE TRANSITION           */
  /* ============================= */
  const transition = document.querySelector('.page-transition');
  if (transition) setTimeout(() => transition.classList.add('hide'), 100);

  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
        e.preventDefault();
        transition?.classList.remove('hide');
        setTimeout(() => window.location.href = href, 450);
      }
    });
  });

  /* ============================= */
  /* 3. MENU MOBILE               */
  /* ============================= */
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
  });

  /* ============================= */
  /* 4. VÍDEO CINEMATOGRÁFICO     */
  /* ============================= */
  const cinemaVideo = document.querySelector('.cinema-video');
  if (cinemaVideo) {
    new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? cinemaVideo.play().catch(()=>{}) : cinemaVideo.pause());
    }, { threshold: 0.2 }).observe(cinemaVideo);
  }

  /* ============================= */
  /* 5. PARTÍCULAS (CANVAS)       */
  /* ============================= */
  const canvas = document.getElementById("particles");
  if (canvas) initParticles(canvas);

  /* ============================= */
  /* 6. ANIMAÇÕES                 */
  /* ============================= */
  initScrollAnimation();
  initTiltAndSpotlight();
  initScrollSpy();
  initFaq();
});

/* ============================= */
/* TILT + SPOTLIGHT              */
/* ============================= */
function initTiltAndSpotlight() {
  if (window.innerWidth < 1024) return;

  document.querySelectorAll('.spotlight-card').forEach(card => {
    let bounds, rafId, hovering = false;
    let x = 0, y = 0;

    const update = () => {
      if (!hovering) return;
      const cx = bounds.width / 2;
      const cy = bounds.height / 2;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
      card.style.transform =
        `perspective(1000px)
         rotateX(${((y - cy) / cy) * -5}deg)
         rotateY(${((x - cx) / cx) * 5}deg)
         scale3d(1.02,1.02,1.02)`;
      rafId = requestAnimationFrame(update);
    };

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
      hovering = true;
      update();
    });

    card.addEventListener('mousemove', e => {
      x = e.clientX - bounds.left;
      y = e.clientY - bounds.top;
    });

    card.addEventListener('mouseleave', () => {
      hovering = false;
      cancelAnimationFrame(rafId);
      card.style.transform = 'perspective(1000px)';
    });
  });
}

/* ============================= */
/* PARTÍCULAS OTIMIZADAS         */
/* ============================= */
function initParticles(canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  let particles = [];
  let running = true;

  function resize() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    canvas.width = window.innerWidth * dpr;
    canvas.height = hero.offsetHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = hero.offsetHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resize);
  resize();

  class Particle {
    reset(start = false) {
      this.x = Math.random() * canvas.width / dpr;
      this.y = start ? Math.random() * canvas.height / dpr : canvas.height / dpr + 10;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = Math.random() * 0.6 + 0.2;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(237,165,71,${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 45; i++) {
    const p = new Particle();
    p.reset(true);
    particles.push(p);
  }

  new IntersectionObserver(entries => {
    running = entries[0].isIntersecting;
    if (running) animate();
  }).observe(document.querySelector(".hero"));

  function animate() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================= */
/* SCROLL / FAQ / SPY            */
/* ============================= */
function initScrollAnimation() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add("in-view"));
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');

    q.addEventListener('click', () => {
      const open = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('active');
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });
}

function initScrollSpy() {
  const links = document.querySelectorAll('.nav-links a');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle(
          'active',
          l.getAttribute('href') === `#${e.target.id}`
        ));
      }
    });
  }, { rootMargin: "-20% 0px -60% 0px" })
  .observe(...document.querySelectorAll('section[id]'));
}
