/* ===================================== */
/* PARTÍCULAS HERO                       */
/* ===================================== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = document.querySelector(".hero").offsetHeight;
}
window.addEventListener("resize", resize);
resize();

class Particle{
  constructor(){
    this.x = Math.random()*canvas.width;
    this.y = Math.random()*canvas.height;
    this.r = Math.random()*2+1;
    this.dx = Math.random()*.4-.2;
    this.dy = Math.random()*.4-.2;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle="rgba(237,165,71,.6)";
    ctx.fill();
  }
  update(){
    this.x+=this.dx;
    this.y+=this.dy;
    if(this.x<0||this.x>canvas.width) this.dx*=-1;
    if(this.y<0||this.y>canvas.height) this.dy*=-1;
    this.draw();
  }
}

for(let i=0;i<60;i++) particles.push(new Particle());

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>p.update());
  requestAnimationFrame(animate);
}
animate();

/* ===================================== */
/* SCROLL ANIMATION + STAGGER             */
/* ===================================== */
const animatedElements = document.querySelectorAll('.fade-up');

const scrollObserver = new IntersectionObserver(entries=>{
  entries.forEach((entry,index)=>{
    if(entry.isIntersecting){
      entry.target.style.transitionDelay = `${index*0.08}s`;
      entry.target.classList.add('in-view');
      scrollObserver.unobserve(entry.target);
    }
  });
},{threshold:0.12});

animatedElements.forEach(el=>scrollObserver.observe(el));

/* ===================================== */
/* NAVBAR LINK ATIVO PELO SCROLL          */
/* ===================================== */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const navObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(link=>link.classList.remove("active"));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      active?.classList.add("active");
    }
  });
},{threshold:0.6});

sections.forEach(sec=>navObserver.observe(sec));

/* ===================================== */
/* TOGGLE TEMA                            */
/* ===================================== */
const toggle=document.querySelector(".theme-toggle");
toggle.onclick=()=>{
  document.body.classList.toggle("light");
  toggle.textContent=document.body.classList.contains("light")?"☀️":"🌙";
};
