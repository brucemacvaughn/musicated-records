/* Musicated Records — Hero Visualizer
   Animated vinyl + audio EQ ring. The logo is a STATIC HTML overlay
   (.hero__viz__logo in index.html) — the record spins around it.
   Pure canvas, no audio input required (procedural waveform)
*/
(function(){
  "use strict";
  var canvas = document.getElementById("heroViz");
  if (!canvas) return;

  // Keep the Musicated mark visually locked to the vinyl label centre.
  // The slightly larger scale mirrors the established Musicated hero benchmark.
  var heroLogo = document.querySelector(".hero__viz__logo");
  if (heroLogo){
    heroLogo.style.left = "50%";
    heroLogo.style.top = "50%";
    heroLogo.style.width = "34%";
    heroLogo.style.transform = "translate(-50%, -50%)";
  }

  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function size(){
    var r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
  }
  size();
  window.addEventListener("resize", size);

  var t0 = performance.now();
  var bars = 64;
  var phase = new Array(bars).fill(0).map(function(_,i){ return Math.random() * Math.PI * 2; });

  function frame(now){
    var t = (now - t0) / 1000;
    var w = canvas.width, h = canvas.height;
    var cx = w/2, cy = h/2;
    var R  = Math.min(w,h) * 0.46;

    ctx.clearRect(0,0,w,h);

    // outer ring
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.05);
    var grad = ctx.createRadialGradient(0, 0, R*0.2, 0, 0, R);
    grad.addColorStop(0, "rgba(95,201,214,0.05)");
    grad.addColorStop(0.8, "rgba(95,201,214,0.12)");
    grad.addColorStop(1, "rgba(7,8,10,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, R*1.05, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // vinyl disc (rotating)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.6);
    // body
    ctx.fillStyle = "#080808";
    ctx.beginPath(); ctx.arc(0,0,R,0,Math.PI*2); ctx.fill();
    // grooves
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1 * dpr;
    for (var r = R*0.4; r < R*0.98; r += 4*dpr){
      ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.stroke();
    }
    // highlight sweep
    var sweep = ctx.createConicGradient ? ctx.createConicGradient(t*0.6, 0, 0) : null;
    if (sweep){
      sweep.addColorStop(0, "rgba(255,255,255,0)");
      sweep.addColorStop(0.06, "rgba(255,255,255,0.22)");
      sweep.addColorStop(0.12, "rgba(255,255,255,0)");
      sweep.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sweep;
      ctx.beginPath(); ctx.arc(0,0,R*0.98,0,Math.PI*2); ctx.fill();
    }
    // center label — vinyl label with Musicated logo
    var lr = R*0.40;
    // dark label disc — the static logo overlay sits on top of this
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath(); ctx.arc(0,0,lr,0,Math.PI*2); ctx.fill();
    // thin teal accent ring
    ctx.strokeStyle = "#5fc9d6";
    ctx.lineWidth = Math.max(1, R*0.006);
    ctx.beginPath(); ctx.arc(0,0,lr*0.96,0,Math.PI*2); ctx.stroke();
    // center spindle hole
    ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.arc(0,0,lr*0.07,0,Math.PI*2); ctx.fill();
    ctx.restore();

    // EQ ring outside vinyl (audio reactive feeling, procedural)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = "#5fc9d6";
    ctx.lineCap = "round";
    var bRadius = R * 1.08;
    for (var i = 0; i < bars; i++){
      var a = (i / bars) * Math.PI * 2;
      // pseudo waveform: layered sines + per-bar phase
      var v = 0.55 +
              0.20 * Math.sin(t * 2.4 + phase[i]) +
              0.12 * Math.sin(t * 4.8 + i * 0.5) +
              0.08 * Math.sin(t * 7.1 + i * 0.27);
      v = Math.max(0.18, Math.min(1, v));
      var inner = bRadius;
      var outer = bRadius + R * 0.22 * v;
      ctx.lineWidth = Math.max(2, R * 0.012);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
      ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
      ctx.stroke();
    }
    ctx.restore();


    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
