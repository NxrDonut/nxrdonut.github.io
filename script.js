document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const finePointer =
    window.matchMedia("(pointer:fine)").matches;


  /* =========================================================
     INTRO
  ========================================================= */

  const intro = $("#intro");

  let introOpened = false;

  function openIntro() {
    if (!intro || introOpened) return;

    introOpened = true;

    intro.classList.add("hidden");
    document.body.classList.remove("locked");

    setTimeout(() => {
      intro.style.display = "none";
    }, 900);
  }

  if (intro) {
    intro.addEventListener("pointerup", openIntro);
    intro.addEventListener("click", openIntro);

    intro.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openIntro();
      }
    });
  }


  /* =========================================================
     CURSOR
  ========================================================= */

  const cursorRing = $(".cursor-ring");
  const cursorDot = $(".cursor-dot");

  if (finePointer && cursorRing && cursorDot) {

    let mouseX = innerWidth / 2;
    let mouseY = innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.13;
      ringY += (mouseY - ringY) * 0.13;

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    $$(".magnetic").forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursorRing.classList.add("hover");
      });

      element.addEventListener("mouseleave", () => {
        cursorRing.classList.remove("hover");
        element.style.transform = "";
      });
    });
  }


  /* =========================================================
     CLOCK
  ========================================================= */

  const clock = $("#navClock");

  function updateClock() {
    if (!clock) return;

    const now = new Date();

    clock.textContent =
      `${String(now.getHours()).padStart(2, "0")}:` +
      `${String(now.getMinutes()).padStart(2, "0")}:` +
      `${String(now.getSeconds()).padStart(2, "0")}`;
  }

  updateClock();
  setInterval(updateClock, 1000);


  /* =========================================================
     REVEAL ANIMATIONS
  ========================================================= */

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

          });

        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -40px 0px"
        }
      );

    revealElements.forEach((element, index) => {

      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 45, 280)}ms`
      );

      revealObserver.observe(element);

    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* =========================================================
     PROFILE / PFP TILT
  ========================================================= */

  const pfpWrap = $("#pfpWrap") || $(".profile-avatar");

  if (finePointer && pfpWrap) {

    pfpWrap.addEventListener("mousemove", (event) => {

      const rect = pfpWrap.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width;

      const y =
        (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 10;
      const rotateX = (y - 0.5) * -10;

      pfpWrap.style.transform =
        `perspective(900px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         translateY(-4px)`;

    });

    pfpWrap.addEventListener("mouseleave", () => {

      pfpWrap.style.transform =
        `perspective(900px)
         rotateX(0deg)
         rotateY(0deg)
         translateY(0)`;

    });

  }


  /* =========================================================
     MUSIC
  ========================================================= */

  const audio = $("#audio");
  const musicToggle = $("#musicToggle");
  const musicIcon = $("#musicIcon");
  const musicWave = $("#musicWave");
  const musicTime = $("#musicTime");

  function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
      return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(remaining).padStart(2, "0")
    );
  }

  function updateMusicUI() {

    if (!audio) return;

    if (musicTime) {
      musicTime.textContent =
        formatTime(audio.currentTime);
    }

    const playing = !audio.paused;

    if (musicWave) {
      musicWave.classList.toggle("playing", playing);
    }

    if (musicIcon) {
      musicIcon.textContent = playing ? "Ⅱ" : "▶";
    }

    if (musicToggle) {
      musicToggle.classList.toggle("playing", playing);
      musicToggle.setAttribute(
        "aria-label",
        playing ? "Pause music" : "Play music"
      );
    }
  }

  musicToggle?.addEventListener("click", async () => {

    if (!audio) return;

    try {

      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }

      updateMusicUI();

    } catch (error) {

      console.log(
        "Music playback requires user interaction.",
        error
      );

    }
  });

  audio?.addEventListener("timeupdate", updateMusicUI);
  audio?.addEventListener("play", updateMusicUI);
  audio?.addEventListener("pause", updateMusicUI);

  updateMusicUI();


  /* =========================================================
     SHOWCASE
  ========================================================= */

  const showcase = $("#showcase");
  const showcaseWindow = $(".showcase-window");
  const openShowcase = $("#openShowcase");
  const closeShowcase = $("#closeShowcase");
  const showcaseBackdrop = $(".showcase-backdrop");

  let showcaseOpen = false;

  function openProject() {

    if (!showcase || showcaseOpen) return;

    showcaseOpen = true;

    showcase.classList.add("open");
    showcase.setAttribute("aria-hidden", "false");

    document.body.classList.add("locked");

    /*
      Allow CSS opening animation to begin
      before adding the active state.
    */
    requestAnimationFrame(() => {
      showcase.classList.add("active");
    });

    setTimeout(() => {
      $(".showcase-tab.active")?.focus();
    }, 250);
  }

  function closeProject() {

    if (!showcase || !showcaseOpen) return;

    showcaseOpen = false;

    showcase.classList.remove("active");

    setTimeout(() => {
      showcase.classList.remove("open");
      showcase.setAttribute("aria-hidden", "true");

      if (!intro || intro.style.display === "none") {
        document.body.classList.remove("locked");
      }
    }, 350);
  }

  openShowcase?.addEventListener("click", openProject);
  closeShowcase?.addEventListener("click", closeProject);
  showcaseBackdrop?.addEventListener("click", closeProject);


  /* =========================================================
     SHOWCASE TABS
  ========================================================= */

  const tabs = $$(".showcase-tab");
  const panels = $$(".showcase-panel");

  tabs.forEach((tab) => {

    tab.addEventListener("click", () => {

      const target = tab.dataset.tab;

      if (!target) return;

      tabs.forEach((item) => {
        item.classList.toggle(
          "active",
          item === tab
        );
      });

      panels.forEach((panel) => {

        const isTarget =
          panel.dataset.panel === target;

        if (isTarget) {

          panel.classList.remove("panel-enter");

          /*
            Restart animation cleanly.
          */
          void panel.offsetWidth;

          panel.classList.add("panel-enter");
        }

        panel.classList.toggle(
          "active",
          isTarget
        );

      });

    });

  });


  /* =========================================================
     SHOWCASE KEYBOARD CONTROL
  ========================================================= */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && showcaseOpen) {
      closeProject();
    }

  });


  /* =========================================================
     MODULE COUNTER
  ========================================================= */

  const moduleToggles = $$(".module-toggle");
  const activeModules = $("#activeModules");

  function updateModuleCount() {

    if (!activeModules) return;

    const count =
      moduleToggles.filter(
        (toggle) => toggle.checked
      ).length;

    activeModules.textContent = count;

    activeModules.animate(
      [
        {
          transform: "scale(1)"
        },
        {
          transform: "scale(1.18)"
        },
        {
          transform: "scale(1)"
        }
      ],
      {
        duration: 260,
        easing: "cubic-bezier(.2,.8,.2,1)"
      }
    );
  }

  moduleToggles.forEach((toggle) => {

    toggle.addEventListener(
      "change",
      updateModuleCount
    );

  });

  updateModuleCount();


  /* =========================================================
     SHOWCASE SETTINGS
  ========================================================= */

  const opacitySlider = $("#opacitySlider");
  const opacityValue = $("#opacityValue");

  const scaleSlider = $("#scaleSlider");
  const scaleValue = $("#scaleValue");

  const glowSlider = $("#glowSlider");
  const glowValue = $("#glowValue");


  function updateOpacity() {

    if (!opacitySlider) return;

    const value = Number(opacitySlider.value);

    if (opacityValue) {
      opacityValue.textContent = `${value}%`;
    }

    showcaseWindow?.style.setProperty(
      "--showcase-opacity",
      value / 100
    );
  }


  function updateScale() {

    if (!scaleSlider) return;

    const value = Number(scaleSlider.value);

    if (scaleValue) {
      scaleValue.textContent = `${value}%`;
    }

    showcaseWindow?.style.setProperty(
      "--showcase-scale",
      value / 100
    );
  }


  function updateGlow() {

    if (!glowSlider) return;

    const value = Number(glowSlider.value);

    if (glowValue) {
      glowValue.textContent = `${value}%`;
    }

    showcaseWindow?.style.setProperty(
      "--showcase-glow",
      value / 100
    );
  }


  opacitySlider?.addEventListener(
    "input",
    updateOpacity
  );

  scaleSlider?.addEventListener(
    "input",
    updateScale
  );

  glowSlider?.addEventListener(
    "input",
    updateGlow
  );

  updateOpacity();
  updateScale();
  updateGlow();


  /* =========================================================
     RESET SHOWCASE
  ========================================================= */

  const resetShowcase = $("#resetShowcase");

  resetShowcase?.addEventListener("click", () => {

    /*
      Reset visual showcase toggles only.
    */

    moduleToggles.forEach((toggle, index) => {
      toggle.checked = index < 5;
    });

    if (opacitySlider) {
      opacitySlider.value = 100;
    }

    if (scaleSlider) {
      scaleSlider.value = 100;
    }

    if (glowSlider) {
      glowSlider.value = 45;
    }

    updateOpacity();
    updateScale();
    updateGlow();
    updateModuleCount();

    resetShowcase.animate(
      [
        {
          transform: "rotate(0deg)"
        },
        {
          transform: "rotate(-4deg)"
        },
        {
          transform: "rotate(4deg)"
        },
        {
          transform: "rotate(0deg)"
        }
      ],
      {
        duration: 300
      }
    );

  });


  /* =========================================================
     VIEW MORE
  ========================================================= */

  const viewMore = $("#viewMore");

  viewMore?.addEventListener("click", () => {

    const open =
      viewMore.dataset.open === "true";

    viewMore.dataset.open =
      open ? "false" : "true";

    const textNode =
      [...viewMore.childNodes]
        .find(
          node =>
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim()
        );

    if (textNode) {
      textNode.textContent =
        open
          ? "VIEW MORE "
          : "ACTIVE PREVIEW ";
    }

    const icon =
      viewMore.querySelector("span");

    if (icon) {
      icon.textContent =
        open ? "↗" : "✓";
    }

  });


  /* =========================================================
     SMOOTH ANCHORS
  ========================================================= */

  $$('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const id =
        link.getAttribute("href");

      if (!id || id === "#") return;

      const target = $(id);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* =========================================================
     MAGNETIC EFFECT
  ========================================================= */

  if (finePointer) {

    $$(".magnetic").forEach((element) => {

      element.addEventListener(
        "mousemove",
        (event) => {

          const rect =
            element.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          const strength =
            element.classList.contains("profile-social")
              ? 0.055
              : 0.08;

          element.style.transform =
            `translate3d(
              ${x * strength}px,
              ${y * strength}px,
              0
            )`;

        }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          element.style.transform = "";
        }
      );

    });

  }


  /* =========================================================
     SHOWCASE WINDOW PARALLAX
  ========================================================= */

  if (finePointer && showcaseWindow) {

    showcaseWindow.addEventListener(
      "mousemove",
      (event) => {

        if (!showcaseOpen) return;

        const rect =
          showcaseWindow.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width -
          0.5;

        const y =
          (event.clientY - rect.top) /
          rect.height -
          0.5;

        showcaseWindow.style.setProperty(
          "--mouse-x",
          `${x * 18}px`
        );

        showcaseWindow.style.setProperty(
          "--mouse-y",
          `${y * 18}px`
        );

      }
    );

    showcaseWindow.addEventListener(
      "mouseleave",
      () => {

        showcaseWindow.style.setProperty(
          "--mouse-x",
          "0px"
        );

        showcaseWindow.style.setProperty(
          "--mouse-y",
          "0px"
        );

      }
    );

  }


  /* =========================================================
     KEYBOARD MUSIC
  ========================================================= */

  document.addEventListener("keydown", (event) => {

    if (
      event.key.toLowerCase() !== "m" ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    const active =
      document.activeElement;

    if (
      active?.tagName === "INPUT" ||
      active?.tagName === "TEXTAREA" ||
      active?.isContentEditable
    ) {
      return;
    }

    musicToggle?.click();

  });


  /* =========================================================
     REDUCED MOTION
  ========================================================= */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  if (reducedMotion.matches) {

    document.documentElement
      .classList
      .add("reduced-motion");

  }

});
