const bg = document.getElementById('bgMusic');
const cvs = document.getElementById('confetti');
const ctx = cvs.getContext('2d');
const balloonCanvas = document.getElementById('balloons');
const balloonCtx = balloonCanvas.getContext('2d');
const sparkleCanvas = document.getElementById('sparkles');
const sparkleCtx = sparkleCanvas.getContext('2d');

function sizeCanvas() {
  cvs.width = balloonCanvas.width = sparkleCanvas.width = window.innerWidth;
  cvs.height = balloonCanvas.height = sparkleCanvas.height = window.innerHeight;
}
sizeCanvas();
window.addEventListener('resize', sizeCanvas);

// ========== CONFETTI ==========
const COLORS = ['#ff7eb9', '#ff65a3', '#7afcff', '#feff9c', '#fff740', '#9aff6b'];
function rand(n) { return Math.random() * n; }
function createPiece() {
  return {
    x: rand(cvs.width),
    y: -10,
    w: 8 + rand(10),
    h: 12 + rand(14),
    c: COLORS[Math.floor(rand(COLORS.length))],
    s: 2 + rand(5),
    r: rand(Math.PI * 2),
    vr: (rand(0.2) - 0.1)
  };
}
let pieces = [];
function drawConfetti() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  for (let p of pieces) {
    p.y += p.s;
    p.r += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.restore();
  }
  pieces = pieces.filter(p => p.y < cvs.height + 20);
  requestAnimationFrame(drawConfetti);
}
function autoConfetti() {
  for (let i=0;i<10;i++) pieces.push(createPiece());
  setTimeout(autoConfetti, 300);
}

// ========== BALLOONS ==========
function createBalloon() {
  return {
    x: rand(balloonCanvas.width),
    y: balloonCanvas.height + 50,
    r: 20 + rand(20),
    c: COLORS[Math.floor(rand(COLORS.length))],
    s: 1 + rand(2)
  };
}
let balloons = [];
function drawBalloons() {
  balloonCtx.clearRect(0,0,balloonCanvas.width,balloonCanvas.height);
  for (let b of balloons) {
    b.y -= b.s;
    balloonCtx.beginPath();
    balloonCtx.fillStyle = b.c;
    balloonCtx.ellipse(b.x, b.y, b.r*0.8, b.r, 0, 0, Math.PI*2);
    balloonCtx.fill();
  }
  balloons = balloons.filter(b => b.y + b.r > -20);
  if (Math.random() < 0.02) balloons.push(createBalloon());
  requestAnimationFrame(drawBalloons);
}

// ========== SPARKLES ==========
function createSparkle() {
  return {
    x: rand(sparkleCanvas.width),
    y: rand(sparkleCanvas.height),
    r: rand(3)+1,
    o: Math.random()
  };
}
let sparkles = Array.from({length:100}, createSparkle);
function drawSparkles() {
  sparkleCtx.clearRect(0,0,sparkleCanvas.width,sparkleCanvas.height);
  for (let s of sparkles) {
    s.o += (Math.random()-0.5)*0.1;
    if (s.o<0) s.o=0;
    if (s.o>1) s.o=1;
    sparkleCtx.beginPath();
    sparkleCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    sparkleCtx.fillStyle = `rgba(255,255,255,${s.o})`;
    sparkleCtx.fill();
  }
  requestAnimationFrame(drawSparkles);
}

// ========== TYPEWRITER TEXT ==========
const message = "Hari ini adalah hari spesial untukmu! 🎈\nSemoga panjang umur, sehat selalu, dan semua cita-citamu tercapai. 🎁\nNikmati setiap momen indah dalam hidupmu! 🥳";
function typeWriter(text, i, el) {
  if (i < text.length) {
    el.innerHTML += text.charAt(i) === "\n" ? "<br>" : text.charAt(i);
    setTimeout(()=>typeWriter(text, i+1, el), 50);
  }
}

// ========== START + COUNTDOWN ==========
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("countdown").style.display = "flex";

  let countdown = document.getElementById("countdown");
  let count = 3;
  countdown.textContent = count;

  let timer = setInterval(()=>{
    count--;
    if (count > 0) {
      countdown.textContent = count;
    } else {
      clearInterval(timer);
      countdown.remove();

      document.querySelector("h1").style.display = "block";
      document.querySelector(".card").style.display = "block";

      // start animations
      autoConfetti();
      drawConfetti();
      drawBalloons();
      drawSparkles();

      // langsung play musik pas countdown selesai
      bg.play();

      // start typewriter
      typeWriter(message, 0, document.getElementById("ucapan"));
    }
  }, 1000);
});
