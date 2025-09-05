// Teachers' Day Site: Section Timings in seconds
const timings = {
  intro: 5, // 0–5s
  transition: 3, // 5–8s
  appreciation: 7, // 8–15s
  interactive: 7, // 15–22s
  outro: 8 // 22–30s
};

let currentSection = 'intro';
let flowTimer = null;
let bgmStarted = false;

// Elements
const sections = {
  intro: document.getElementById('intro'),
  classroom: document.getElementById('classroom'),
  appreciation: document.getElementById('appreciation'),
  interactive: document.getElementById('interactive'),
  outro: document.getElementById('outro'),
};
const introBtn = document.getElementById('begin-btn');
const replayBtn = document.getElementById('replay-btn');
const bgMusic = document.getElementById('bg-music');
const applause = document.getElementById('applause-sound');

// Intro Confetti Canvas
function confettiEffect(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = window.innerWidth;
  const H = canvas.height = window.innerHeight;
  const confettiColors = ['#ffdf76','#ffd800','#fff','#ffc400','#fff4bc','#fff9e4'];
  const maxParticles = 90;
  let particles = [];
  for(let i=0;i<maxParticles;i++) {
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*6+4,
      d: Math.random()*maxParticles,
      color: confettiColors[Math.floor(Math.random()*confettiColors.length)],
      tilt:Math.floor(Math.random()*8)-4,
      tiltAngleIncremental:(Math.random()*0.07)+.05,
      tiltAngle:0
    });
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.lineWidth=p.r;
      ctx.strokeStyle=p.color;
      ctx.moveTo(p.x+p.tilt+p.r/2,p.y);
      ctx.lineTo(p.x+p.tilt,p.y+p.tilt+p.r/2);
      ctx.stroke();
    });
    update();
    requestAnimationFrame(draw);
  }
  function update() {
    for (let i = 0; i < maxParticles; i++) {
      let p = particles[i];
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d)+2+ p.r/2)/1.6;
      p.x += Math.sin(0.5);
      p.tilt = Math.sin(p.tiltAngle- (i%3)) * 16;
      if (p.y > H+30) {
        p.x = Math.random()*W;
        p.y = -16;
      }
    }
  }
  draw();
}
confettiEffect('confetti-canvas');
window.addEventListener('resize',()=>confettiEffect('confetti-canvas'));

// Utilities
function showSection(name) {
  Object.values(sections).forEach(sec => sec.classList.add('hidden'));
  sections[name].classList.remove('hidden');
  sections[name].classList.add('show');
  currentSection = name;
}

function startFlow() {
  showSection('intro');
  bgmStarted = false;
  setTimeout(()=>{
    transitionSection();
  }, timings.intro*1000);
}
function transitionSection() {
  // Curtain/Zoom animation to classroom
  gsap.to('#intro', {scale:1.09,opacity:0,ease:'power2.in',duration:0.9,
    onComplete: ()=>{
      showSection('classroom');
      animateClassroom();
      // Start bg music
      if (!bgmStarted) { bgMusic.volume=0.6; bgMusic.play(); bgmStarted=true; }
      setTimeout(()=>{ appreciationSection(); }, timings.transition*1000);
    }
  });
}
function appreciationSection() {
  showSection('appreciation');
  revealAppreciation();
  setTimeout(()=>{ interactiveSection(); }, timings.appreciation*1000);
}
function interactiveSection() {
  showSection('interactive');
  floatInteractive();
  setTimeout(()=>{ outroSection(); }, timings.interactive*1000);
}
function outroSection() {
  showSection('outro');
  setTimeout(()=>{
    startOutroConfetti();
    applause.volume=0.45;
    applause.currentTime=0;
    applause.play();
    animateOutroSilhouette();
  },500);
}
// Handlers
introBtn.onclick = ()=>{
  gsap.to('.intro-content',{y:60,opacity:0,duration:0.7});
  setTimeout(()=>{ transitionSection(); },700);
};

replayBtn.onclick = ()=>{
  // Reset
  window.location.reload();
};

// CLASSROOM SECTION ANIMATIONS
function animateClassroom() {
  const icons = ['fa-atom','fa-flask','fa-microscope','fa-rocket','fa-dna','fa-vial'];
  const iconContainer = sections.classroom.querySelector('.floating-icons');
  iconContainer.innerHTML = '';
  for (let i=0;i<7;i++) {
    const span = document.createElement('span');
    span.className = 'science-icon fas ' + icons[i%icons.length];
    span.style.top = Math.random()*80 + '%';
    span.style.left = Math.random()*85 + '%';
    iconContainer.appendChild(span);
    gsap.to(span, {
      y: (Math.random()*60-30),
      x: (Math.random()*80-40),
      rotation: Math.random()*30-15,
      duration: 3+Math.random()*4,
      ease: "sine.inOut",
      repeat: -1, yoyo: true, delay: Math.random()
    });
  }
}

// APPRECIATION SECTION ANIMATIONS
function revealAppreciation() {
  // Animate three lines of text
  const lines = [
    "To the teacher who opened our minds…",
    "…and made science an adventure 🌌",
    "You're not just a teacher, you're a guide, mentor"
  ];
  ['line1','line2','line3'].forEach((id)=>{ document.getElementById(id).innerHTML='';});
  function typeLine(line, id, fontCls, delay=0) {
    let idx=0; const el=document.getElementById(id);
    function typer() {
      el.style.opacity=1;
      el.innerHTML = lines[line].substring(0,idx+1);
      idx++;
      if (idx < lines[line].length) setTimeout(typer,36);
    }
    setTimeout(typer,delay);
  }
  typeLine(0, "line1", "headline-font", 0);
  setTimeout(()=>typeLine(1,"line2","headline-font",0), 1400);
  setTimeout(()=>typeLine(2,"line3","shayari-font",0), 2700);

  // Floating books, test tubes, atoms
  const icons = [
    {icon:'fa-book', font:'2.1rem', color:'#ffdf76'},
    {icon:'fa-flask', font:'2.2rem', color:'#bfcbfd'},
    {icon:'fa-atom', font:'2.1rem', color:'#dcc6ff'},
    {icon:'fa-rocket', font:'2.3rem', color:'#ffb276'},
    {icon:'fa-graduation-cap', font:'2.3rem', color:'#fff'},
    {icon:'fa-dna', font:'2.2rem', color:'#ff93e6'}
  ];
  const floaters = sections.appreciation.querySelector('.appreciation-floaters');
  floaters.innerHTML = '';
  for (let i=0;i<7;i++) {
    const span = document.createElement('span');
    span.className = 'floater fas ' + icons[i%icons.length].icon;
    span.style.fontSize = icons[i%icons.length].font;
    span.style.color = icons[i%icons.length].color;
    span.style.top = Math.random()*80 + '%';
    span.style.left = Math.random()*80 + '%';
    floaters.appendChild(span);
    gsap.to(span, {
      y: (Math.random()*70-35),
      x: (Math.random()*60-30),
      rotation: Math.random()*38-19,
      duration: 3.1+Math.random()*4,
      ease: "sine.inOut",
      repeat: -1, yoyo: true, delay:Math.random()
    });
  }
}

// INTERACTIVE SECTION
function floatInteractive() {
  // Animate icons to float and be tappable
  document.getElementById('book').style.top = "40%";
  document.getElementById('book').style.left = "42%";
  document.getElementById('star').style.top = "59%";
  document.getElementById('star').style.left = "56%";
  gsap.fromTo('#book',{y:-30,scale:1.05},{y:24,scale:1.10,duration:2.8,repeat:-1,yoyo:true,ease:"sine.inOut"});
  gsap.fromTo('#star',{y:10,scale:1.1},{y:-19,scale:1.06,duration:2.3,repeat:-1,yoyo:true,ease:"sine.inOut"});

  // Book click: Shayari popup
  document.getElementById('book').onclick = ()=>{
    const popup = document.getElementById('popup-shayari');
    popup.innerHTML = "علم سے بڑا کوئی خزانہ نہیں<br>اور استاد سے بڑا رہبر نہیں";
    popup.classList.add('active');
    setTimeout(()=>popup.classList.remove('active'), 2700);
    // Sound effect (optional): You can add a small 'ding' here
  };

  // Star click: Show thank-you word
  let thankWords = ['Respect','Inspiration','Knowledge','Guidance','Kindness'];
  document.getElementById('star').onclick = ()=>{
    const popup = document.getElementById('popup-thank');
    const word = thankWords[Math.floor(Math.random()*thankWords.length)];
    popup.innerHTML = `<span style="font-family:'Poppins',sans-serif;font-weight:bold;font-size:1.3rem;color:#ffdf76;">${word}</span>`;
    popup.classList.add('active');
    anime({
      targets:'#star',
      scale:1.44,
      duration:300,
      easing:'easeOutCubic',
      direction:'alternate'
    });
    setTimeout(()=>popup.classList.remove('active'), 1700);
  };
}

// OUTRO CONFETTI + TEACHER ANIMATION
function startOutroConfetti() {
  confettiEffect('confetti-outro');
}
function animateOutroSilhouette() {
  const el = document.querySelector('.teacher-silhouette');
  el.style.opacity=0;
  setTimeout(()=>{
    gsap.to(el,{opacity:1,duration:1.2});
    setTimeout(()=>gsap.to(el,{opacity:0,duration:1.5,delay:1.7}),2800);
  },600);
}

// INIT
showSection('intro');
startFlow();

/* ---- Comments ----
- You can replace all audio URLs with your own royalty-free MP3 files.
- To customize, change [Your Name] in .your-name or allow user input.
- All assets loaded from CDN, works perfectly with static hosting (Vercel).
*/
