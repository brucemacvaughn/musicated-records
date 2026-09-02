/* Musicated Records — global JS
   Mobile nav, scroll reveals, marquee duplication, form handling
*/
(function(){
  "use strict";

  // ===== Active nav link based on path =====
  function markActiveNav(){
    var path = location.pathname.replace(/\/$/, "") || "/";
    document.querySelectorAll(".nav__links a, .nav__mobile a").forEach(function(a){
      var href = a.getAttribute("href") || "";
      var ap = href.replace(/\/$/, "") || "/";
      if (ap === path) a.classList.add("is-active");
      if (path === "/" && (ap === "/index.html" || ap === "/")) a.classList.add("is-active");
    });
  }

  // ===== Mobile nav toggle =====
  function wireMobileNav(){
    var btn = document.querySelector(".nav__toggle");
    var panel = document.querySelector(".nav__mobile");
    if (!btn || !panel) return;
    btn.addEventListener("click", function(){
      panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", panel.classList.contains("is-open"));
    });
    panel.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ panel.classList.remove("is-open"); });
    });
  }

  // ===== Reveal on scroll =====
  function wireReveal(){
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function(e){ e.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function(e){ io.observe(e); });
  }

  // ===== Marquee: duplicate children for seamless loop =====
  function wireMarquee(){
    document.querySelectorAll(".ticker__track").forEach(function(track){
      var html = track.innerHTML;
      track.innerHTML = html + html; // duplicate
    });
  }

  // ===== Form handler (Formspree-ready) =====
  var FORM_ENDPOINTS = {
    contact:    "https://formspree.io/f/mwlkonlq",
    demo:       "",
    sync:       "",
    newsletter: "https://formspree.io/f/meaqkeaq"
  };
  var FALLBACK_EMAIL = "info@musicatedrecords.com";

  function wireForms(){
    document.querySelectorAll("form[data-form-name]").forEach(function(form){
      var name = form.getAttribute("data-form-name");
      var status = form.querySelector(".form__status");
      var submit = form.querySelector("[type=submit]");
      var origSubmitLabel = submit ? submit.textContent : "";

      form.addEventListener("submit", function(e){
        e.preventDefault();
        if (!FORM_ENDPOINTS[name]) {
          if (status){
            status.textContent = "Email " + FALLBACK_EMAIL + " directly — form delivery activating soon.";
            status.classList.remove("is-ok");
            status.classList.add("is-err");
          }
          return;
        }
        if (submit){ submit.disabled = true; submit.textContent = "SENDING…"; }
        if (status){ status.textContent = "Sending…"; status.classList.remove("is-ok","is-err"); }
        var data = new FormData(form);
        fetch(FORM_ENDPOINTS[name], {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" }
        }).then(function(r){
          if (!r.ok) throw new Error("status " + r.status);
          form.reset();
          var successMessage = name === "newsletter"
            ? "Thank you for your subscription. Welcome to the Musicated family — we'll be in touch."
            : "Got it. We'll be in touch.";
          if (status){
            status.textContent = successMessage;
            status.classList.add("is-ok");
          } else if (name === "newsletter") {
            var message = document.createElement("p");
            message.className = "form__status is-ok";
            message.textContent = successMessage;
            message.setAttribute("role", "status");
            form.insertAdjacentElement("afterend", message);
          }
        }).catch(function(){
          var errorMessage = name === "newsletter"
            ? "We couldn't complete your subscription. Please try again."
            : "Couldn't send. Try emailing " + FALLBACK_EMAIL;
          if (status){
            status.textContent = errorMessage;
            status.classList.add("is-err");
          } else if (name === "newsletter") {
            var message = document.createElement("p");
            message.className = "form__status is-err";
            message.textContent = errorMessage;
            message.setAttribute("role", "status");
            form.insertAdjacentElement("afterend", message);
          }
        }).finally(function(){
          if (submit){ submit.disabled = false; submit.textContent = origSubmitLabel; }
        });
      });
    });
  }

  // ===== Release cover hover toggle on touch =====
  function wireReleaseTap(){
    document.querySelectorAll(".release, .artist").forEach(function(el){
      el.addEventListener("click", function(){
        el.classList.toggle("is-color");
      }, { passive: true });
    });
  }

  // ===== Stat counter ease-in =====
  function wireStats(){
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1100;
        var t0 = performance.now();
        function tick(t){
          var p = Math.min(1, (t - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    nums.forEach(function(n){ io.observe(n); });
  }

  // ===== Init =====
  document.addEventListener("DOMContentLoaded", function(){
    markActiveNav();
    wireMobileNav();
    wireReveal();
    wireMarquee();
    wireForms();
    wireReleaseTap();
    wireStats();
  });
})();
