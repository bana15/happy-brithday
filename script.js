// ---- gate open ----
  const gate = document.getElementById('gate');
  const wrap = document.getElementById('wrap');
  gate.addEventListener('click', () => {
    if(gate.classList.contains('open')) return;
    gate.classList.add('open');
    startMusic();
    burstConfetti(40);
    setTimeout(() => heartBurst(18), 900);
    setTimeout(() => gate.classList.add('hidden'), 2500);
    setTimeout(() => { wrap.classList.add('visible'); goPage(0); burstConfetti(50); }, 2800);
  });

  function heartBurst(n){
    const sy = ['🤍','💗','💕','🌸'];
    for(let i = 0; i < n; i++){
      const h = document.createElement('div');
      h.textContent = sy[Math.floor(Math.random() * sy.length)];
      h.style.cssText = 'position:fixed;left:' + (40 + Math.random() * 20) + 'vw;top:55vh;font-size:' +
        (16 + Math.random() * 16) + 'px;z-index:80;pointer-events:none';
      document.body.appendChild(h);
      const dx = (Math.random() - 0.5) * 240, dy = -(120 + Math.random() * 280);
      h.animate([
        { transform:'translate(0,0) scale(0.5)', opacity:1 },
        { transform:'translate(' + dx + 'px,' + dy + 'px) scale(1.2)', opacity:0 }
      ], { duration:1600 + Math.random() * 1200, easing:'ease-out' });
      setTimeout(() => h.remove(), 3000);
    }
  }

  // ---- scroll reveal ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); } });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---- reply feature (shared storage) ----
  const sendBtn = document.getElementById('sendBtn');
  const replyInput = document.getElementById('replyInput');
  replyInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  });
  replyInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const plain = (e.clipboardData || window.clipboardData).getData('text');
    document.execCommand('insertText', false, plain);
  });
  replyInput.addEventListener('input', (e) => {
    if(e.inputType && e.inputType.startsWith('delete')) return;
    wrapLastTypedChar();
  });

  function getLastCharLength(text){
    if(typeof Intl !== 'undefined' && Intl.Segmenter){
      try{
        const seg = new Intl.Segmenter(undefined, {granularity:'grapheme'});
        const parts = Array.from(seg.segment(text));
        if(parts.length) return parts[parts.length-1].segment.length;
      }catch(e){}
    }
    const last2 = text.slice(-2);
    if(/[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(last2)) return 2;
    return 1;
  }

  function wrapLastTypedChar(){
    const sel = window.getSelection();
    if(!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if(!range.collapsed) return;
    const node = range.startContainer;
    const offset = range.startOffset;
    if(node.nodeType !== Node.TEXT_NODE || offset === 0) return;

    const text = node.textContent;
    const charLen = Math.min(getLastCharLength(text.slice(0, offset)), offset);
    const before = text.slice(0, offset - charLen);
    const charText = text.slice(offset - charLen, offset);
    const after = text.slice(offset);

    const span = document.createElement('span');
    span.className = 'pop-letter';
    span.addEventListener('animationend', () => span.classList.add('done'), {once:true});
    span.textContent = charText;

    const parent = node.parentNode;
    const afterNode = document.createTextNode(after);
    parent.replaceChild(afterNode, node);
    parent.insertBefore(span, afterNode);
    if(before) parent.insertBefore(document.createTextNode(before), span);

    const newRange = document.createRange();
    newRange.setStart(afterNode, 0);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
  }
  const replyStatus = document.getElementById('replyStatus');
  const existingReplyHolder = document.getElementById('existingReplyHolder');
  const WHATSAPP_NUMBER = '6285166469917';

  sendBtn.addEventListener('click', () => {
    const text = replyInput.textContent.trim();
    if(!text){
      replyStatus.textContent = 'tulis dulu pesannya ya';
      return;
    }
    const waText = encodeURIComponent('Balasan dari Nayla untuk ucapan ulang tahunnya:\n\n"' + text + '"');
    const waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waText;
    window.open(waUrl, '_blank');
    replyStatus.textContent = 'membuka WhatsApp... 🤍';
    burstConfetti(60);
  });

  // ---- confetti ----
  function burstConfetti(count){
    const colors = ['#e8a3b5','#c9a875','#f7cdd8','#b56377','#fff3ea'];
    for(let i=0;i<count;i++){
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      const size = 5 + Math.random()*6;
      p.style.width = size+'px';
      p.style.height = (size*0.4)+'px';
      p.style.left = Math.random()*100+'vw';
      p.style.background = colors[Math.floor(Math.random()*colors.length)];
      p.style.transform = 'rotate('+(Math.random()*360)+'deg)';
      document.body.appendChild(p);
      const duration = 2200 + Math.random()*1800;
      const drift = (Math.random()-0.5)*160;
      p.animate([
        { transform:p.style.transform+' translate(0,0)', opacity:1 },
        { transform:'rotate('+(Math.random()*720)+'deg) translate('+drift+'px, 100vh)', opacity:0.9 }
      ], { duration, easing:'cubic-bezier(.2,.6,.3,1)' });
      setTimeout(()=>p.remove(), duration+50);
    }
  }

  // ---- ambient sparkles ----
  const canvas = document.getElementById('sparkle');
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const sparkles = Array.from({length: 36}, () => ({
    x: Math.random()*window.innerWidth,
    y: Math.random()*window.innerHeight,
    r: Math.random()*1.6 + 0.4,
    speed: Math.random()*0.25 + 0.05,
    phase: Math.random()*Math.PI*2
  }));
  let t = 0;
  function loop(){
    t += 0.02;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    sparkles.forEach(s => {
      s.y -= s.speed;
      if(s.y < -5){ s.y = canvas.height + 5; s.x = Math.random()*canvas.width; }
      const alpha = 0.25 + 0.35*Math.sin(t + s.phase);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,'+Math.max(0,alpha)+')';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();

  // floating heart particles
  const floatWrap = document.createElement('div');
  floatWrap.style.position = 'fixed';
  floatWrap.style.inset = '0';
  floatWrap.style.zIndex = '1';
  floatWrap.style.pointerEvents = 'none';
  floatWrap.style.overflow = 'hidden';
  document.body.appendChild(floatWrap);

  const heartSymbols = ['🤍','✿'];
  function spawnHeart(){
    const h = document.createElement('div');
    h.textContent = heartSymbols[Math.floor(Math.random()*heartSymbols.length)];
    h.style.position = 'absolute';
    h.style.left = Math.random()*100 + 'vw';
    h.style.bottom = '-40px';
    h.style.fontSize = (12 + Math.random()*12) + 'px';
    h.style.opacity = (0.25 + Math.random()*0.35).toString();
    const duration = 9000 + Math.random()*7000;
    const drift = (Math.random()-0.5)*120;
    h.animate([
      { transform:'translate(0,0) rotate(0deg)', opacity:0 },
      { transform:'translate(0,-10vh)', opacity:h.style.opacity, offset:0.1 },
      { transform:'translate('+drift+'px,-110vh) rotate('+(Math.random()*360)+'deg)', opacity:0 }
    ], { duration, easing:'linear' });
    floatWrap.appendChild(h);
    setTimeout(()=>h.remove(), duration+50);
  }
  setInterval(spawnHeart, 1200);
  spawnHeart();

  // ---- musik: Happy Birthday versi santai (dibuat langsung dengan Web Audio) ----
  const musicBtn = document.getElementById('musicBtn');
  let audioCtx = null, musicOn = false, musicTimer = null;
  const BEAT = 0.4; // makin besar makin pelan

  const NOTE = {G4:392.00, A4:440.00, B4:493.88, C5:523.25, D5:587.33,
                E5:659.25, F5:698.46, G5:783.99};
  const CHORD = {
    C:[130.81,164.81,196.00],
    G:[98.00,123.47,146.83],
    F:[87.31,110.00,130.81]
  };
  // tiap birama (3 ketukan): [nada, panjang ketukan], akord
  const BARS = [
    {c:'C', n:[['G4',.75],['G4',.25],['A4',1],['G4',1]]},
    {c:'G', n:[['C5',1],['B4',2]]},
    {c:'G', n:[['G4',.75],['G4',.25],['A4',1],['G4',1]]},
    {c:'C', n:[['D5',1],['C5',2]]},
    {c:'C', n:[['G4',.75],['G4',.25],['G5',1],['E5',1]]},
    {c:'F', n:[['C5',1],['B4',1],['A4',1]]},
    {c:'F', n:[['F5',.75],['F5',.25],['E5',1],['C5',1]]},
    {c:'C', n:[['D5',1],['C5',2]]}
  ];

  function tone(freq, start, dur, vol, type, dest){
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g); g.connect(dest);
    osc.start(start); osc.stop(start + dur + 0.05);
  }

  // suara piano: beberapa nada harmonik, serangan cepat, lalu meredup
  function pianoNote(freq, start, dur, vol, dest){
    const lp = audioCtx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 3200;
    lp.connect(dest);
    [[1,1],[2,0.45],[3,0.22],[4,0.12],[5,0.06]].forEach(([mult, amp], i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq * mult;
      const len = dur / (1 + i * 0.7);
      const peak = vol * amp;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.linearRampToValueAtTime(peak, start + 0.008);
      g.gain.exponentialRampToValueAtTime(peak * 0.3, start + Math.min(0.3, len * 0.4));
      g.gain.exponentialRampToValueAtTime(0.0001, start + len);
      osc.connect(g); g.connect(lp);
      osc.start(start); osc.stop(start + len + 0.05);
    });
  }

  function pluck(freq, start, dur, vol, dest){
    const o = audioCtx.createOscillator(), o2 = audioCtx.createOscillator();
    const lp = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
    o.type = 'sawtooth'; o2.type = 'triangle';
    o.frequency.value = freq; o2.frequency.value = freq * 2;
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(3500, start);
    lp.frequency.exponentialRampToValueAtTime(700, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(dest);
    o.start(start); o2.start(start); o.stop(start + dur + 0.05); o2.stop(start + dur + 0.05);
  }
  function kick(start, dest){
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.setValueAtTime(140, start);
    o.frequency.exponentialRampToValueAtTime(45, start + 0.12);
    g.gain.setValueAtTime(0.5, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
    o.connect(g); g.connect(dest); o.start(start); o.stop(start + 0.25);
  }
  function hat(start, vol, dest){
    const len = Math.floor(audioCtx.sampleRate * 0.05);
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource(); src.buffer = buf;
    const hp = audioCtx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.05);
    src.connect(hp); hp.connect(g); g.connect(dest); src.start(start);
  }

  function schedulePhrase(t0){
    const master = audioCtx.createGain();
    master.gain.value = 0.5;
    const delay = audioCtx.createDelay();
    delay.delayTime.value = 0.18;
    const fb = audioCtx.createGain();
    fb.gain.value = 0.15;
    delay.connect(fb); fb.connect(delay);
    master.connect(audioCtx.destination);
    master.connect(delay); delay.connect(audioCtx.destination);

    let t = t0;
    BARS.forEach(bar => {
      const ch = CHORD[bar.c];
      kick(t, master);
      pluck(ch[0], t, BEAT * 0.9, 0.28, master);
      [1, 2].forEach(k => {
        ch.forEach(f => pluck(f * 2, t + k * BEAT, BEAT * 0.45, 0.07, master));
      });
      for(let k = 0; k < 3; k++){
        hat(t + k * BEAT, 0.03, master);
        hat(t + k * BEAT + BEAT * 0.5, 0.05, master);
      }
      let bt = t;
      bar.n.forEach(([name, beats]) => {
        const dd = beats * BEAT;
        pluck(NOTE[name], bt, Math.max(dd * 1.5, BEAT * 0.9), 0.22, master);
        bt += dd;
      });
      t += BEAT * 3;
    });
    return t - t0;
  }

  function loopMusic(){
    if(!musicOn || !audioCtx) return;
    const len = schedulePhrase(audioCtx.currentTime + 0.1);
    musicTimer = setTimeout(loopMusic, (len + 0.6) * 1000);
  }

  function startMusic(){
    try{
      if(musicOn) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtx.resume();
      musicOn = true;
      loopMusic();
      musicBtn.classList.add('show');
      musicBtn.classList.remove('off');
    }catch(e){}
  }

  function stopMusic(){
    musicOn = false;
    clearTimeout(musicTimer);
    if(audioCtx){ audioCtx.close(); audioCtx = null; }
    musicBtn.classList.add('off');
  }

  musicBtn.addEventListener('click', () => {
    if(musicOn){ stopMusic(); } else { startMusic(); }
  });



  // ---- halaman (geser / tombol) ----
  const pages = Array.from(document.querySelectorAll('.page'));
  const dotsEl = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let cur = 0;
  pages.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.addEventListener('click', () => goPage(i));
    dotsEl.appendChild(dot);
  });
  function goPage(i){
    cur = Math.max(0, Math.min(pages.length - 1, i));
    pages.forEach((p, k) => p.classList.toggle('active', k === cur));
    dotsEl.querySelectorAll('.dot').forEach((d, k) => d.classList.toggle('on', k === cur));
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur === pages.length - 1;
    if(wrap.classList.contains('visible')){
      pages[cur].querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }
    window.scrollTo({top:0, behavior:'smooth'});
  }
  prevBtn.addEventListener('click', () => goPage(cur - 1));
  nextBtn.addEventListener('click', () => goPage(cur + 1));
  let touchX = 0;
  document.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, {passive:true});
  document.addEventListener('touchend', e => {
    if(!wrap.classList.contains('visible') || e.target.closest('#replyInput')) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if(Math.abs(dx) > 70) goPage(cur + (dx < 0 ? 1 : -1));
  }, {passive:true});
  goPage(0);