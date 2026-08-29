/* Musicated Records — "musicated, adj." dancefloor
   The crowd seen from the booth. Dots laid out in perspective (rows compress
   toward the back of the room); on every beat a pulse leaves the booth and
   travels out through them. As the wavefront reaches a dot it lifts, swells and
   warms from faint grey -> teal -> gold, then settles.

   Deliberately abstract: no figures, no faces, nothing that could read as a
   cartoon. It illustrates the definition rather than depicting it.

   Self-contained. Touches nothing but its own canvas.
*/
(function () {
  "use strict";

  var canvas = document.getElementById("crowdViz");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var reduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- layout -------------------------------------------------------------
  var COLS = 26, ROWS = 15;
  var BPM = 122;                     // house
  var BEAT = 60 / BPM;
  var RING_LIFE = 2.3;               // seconds a pulse stays alive
  var SIGMA = 26;                    // wavefront thickness, px

  var dpr = 1, W = 0, H = 0, dots = [], emitter = { x: 0, y: 0 }, maxDist = 1;

  function build() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // the booth: just off the front-left corner, where the copy sits
    emitter.x = -W * 0.10;
    emitter.y = H * 1.02;

    dots = [];
    var padTop = H * 0.12, padBottom = H * 0.06;
    for (var r = 0; r < ROWS; r++) {
      // v: 0 = back of the room, 1 = front. Non-linear so rows bunch up at the back.
      var v = r / (ROWS - 1);
      var y = padTop + (H - padTop - padBottom) * Math.pow(v, 1.5);
      var half = (W * 0.5) * (0.40 + 0.60 * Math.pow(v, 0.85));
      for (var c = 0; c < COLS; c++) {
        // stagger alternate rows so it reads as a crowd, not a grid
        var u = (c + (r % 2 ? 0.5 : 0)) / (COLS - 1);
        var x = W * 0.5 + (u - 0.5) * 2 * half;
        if (x < -8 || x > W + 8) continue;
        var d = Math.hypot(x - emitter.x, y - emitter.y);
        if (d > maxDist) maxDist = d;
        dots.push({
          x: x, y: y, v: v, d: d,
          r0: 0.65 + 1.85 * v,
          a0: 0.16 + 0.46 * v,
          ph: Math.random() * Math.PI * 2
        });
      }
    }
    return true;
  }

  var SPEED = 1;
  function computeSpeed() { SPEED = maxDist / 1.55; }   // cross the room in ~3 beats

  // faint -> teal -> gold
  function shade(e) {
    var r, g, b;
    if (e < 0.55) {
      var k = e / 0.55;
      r = 185 + (95 - 185) * k; g = 189 + (201 - 189) * k; b = 199 + (214 - 199) * k;
    } else {
      var k2 = Math.min(1, (e - 0.55) / 0.45);
      r = 95 + (255 - 95) * k2; g = 201 + (201 - 201) * k2; b = 214 + (74 - 214) * k2;
    }
    return [r | 0, g | 0, b | 0];
  }

  var rings = [], t0 = performance.now(), nextBeat = 0, running = false, raf = 0;

  function frame(now) {
    var t = (now - t0) / 1000;

    while (t >= nextBeat) {                       // emit on the beat
      rings.push({ born: nextBeat });
      nextBeat += BEAT;
      if (rings.length > 8) rings.shift();
    }
    for (var i = rings.length - 1; i >= 0; i--) {
      if (t - rings[i].born > RING_LIFE) rings.splice(i, 1);
    }

    ctx.clearRect(0, 0, W, H);

    for (var j = 0; j < dots.length; j++) {
      var p = dots[j], e = 0;
      for (var k = 0; k < rings.length; k++) {
        var age = t - rings[k].born;
        if (age < 0) continue;
        var front = age * SPEED;
        var dd = p.d - front;
        e += Math.exp(-(dd * dd) / (2 * SIGMA * SIGMA)) * (1 - age / RING_LIFE);
      }
      e = Math.min(1, e);

      var sway = Math.sin(t * 0.8 + p.ph) * 1.2 * p.v;          // never fully still
      var lift = e * 9 * (0.4 + 0.6 * p.v);
      var y = p.y + sway - lift;
      var rad = p.r0 * (1 + 1.9 * e);
      var col = shade(e);
      var alpha = Math.min(1, p.a0 + e * 0.75);

      if (e > 0.55) {                                            // bloom at the crest
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + ((e - 0.55) * 0.30).toFixed(3) + ")";
        ctx.arc(p.x, y, rad * 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + alpha.toFixed(3) + ")";
      ctx.arc(p.x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(frame);
  }

  function still() {                                             // reduced-motion frame
    ctx.clearRect(0, 0, W, H);
    for (var j = 0; j < dots.length; j++) {
      var p = dots[j], col = shade(p.v * 0.35);
      ctx.beginPath();
      ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + p.a0.toFixed(3) + ")";
      ctx.arc(p.x, p.y, p.r0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function start() {
    if (running || reduced) return;
    running = true; t0 = performance.now(); nextBeat = 0; rings = [];
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function init() {
    if (!build()) return;
    computeSpeed();
    if (reduced) { still(); return; }
    // only run while it is actually on screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
      }, { threshold: 0.05 }).observe(canvas);
    } else {
      start();
    }
  }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      maxDist = 1;
      if (build()) { computeSpeed(); if (reduced) still(); }
    }, 150);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
