
/* partículas */
const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");
let particles=[];

function resize(){
  canvas.width=window.innerWidth;
  canvas.height=document.querySelector(".hero").offsetHeight;
}
window.addEventListener("resize",resize);
resize();

class Particle{
  constructor(){
    this.x=Math.random()*canvas.width;
    this.y=Math.random()*canvas.height;
    this.r=Math.random()*2+1;
    this.dx=Math.random()*.4-.2;
    this.dy=Math.random()*.4-.2;
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

/* animações */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add("active");
  });
},{threshold:.2});
document.querySelectorAll(".fade-up").forEach(el=>obs.observe(el));

/* tema */
const toggle=document.querySelector(".theme-toggle");
toggle.onclick=()=>{
  document.body.classList.toggle("light");
  toggle.textContent=document.body.classList.contains("light")?"☀️":"🌙";
};
