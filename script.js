document.addEventListener("DOMContentLoaded", () => {

  "use strict";


  /* =========================================================
     HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


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
    }, 950);

  }

  if (intro) {

    intro.addEventListener(
      "pointerup",
      openIntro
    );

    intro.addEventListener(
      "click",
      openIntro
    );

    intro.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openIntro();

        }

      }
    );

  }


  /* =========================================================
     CURSOR
  ========================================================= */

  const cursorRing = $(".cursor-ring");
  const cursorDot = $(".cursor-dot");

  if (
    cursorRing &&
    cursorDot &&
    window.matchMedia("(pointer:fine)").matches
  ) {

    let mouseX = innerWidth / 2;
    let mouseY = innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener(
      "mousemove",
      (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        cursorDot.style.left =
          `${mouseX}px`;

        cursorDot.style.top =
          `${mouseY}px`;

      }
    );


    function animateCursor() {

      ringX +=
        (mouseX - ringX) * .14;

      ringY +=
        (mouseY - ringY) * .14;

      cursorRing.style.left =
        `${ringX}px`;

      cursorRing.style.top =
        `${ringY}px`;

      requestAnimationFrame(
        animateCursor
      );

    }

    animateCursor();


    $$(".magnetic").forEach((element) => {

      element.addEventListener(
        "mouseenter",
        () => {
          cursorRing.classList.add("hover");
        }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          cursorRing.classList.remove("hover");

          element.style.transform = "";
        }
      );

    });

  }


  /* =========================================================
     CLOCK
  ========================================================= */

  const clock = $("#navClock");

  function updateClock() {

    if (!clock) return;

    const now = new Date();

    const hours =
      String(now.getHours())
        .padStart(2, "0");

    const minutes =
      String(now.getMinutes())
        .padStart(2, "0");

    const seconds =
      String(now.getSeconds())
        .padStart(2, "0");

    clock.textContent =
      `${hours}:${minutes}:${seconds}`;

  }

  updateClock();

  setInterval(
    updateClock,
    1000
  );


  /* =========================================================
     REVEAL
  ========================================================= */

  const revealElements =
    $$(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target
                  .classList
                  .add("visible");

                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: .1
        }
      );

    revealElements.forEach(
      element =>
        revealObserver.observe(element)
    );

  } else {

    revealElements.forEach(
      element =>
        element.classList.add("visible")
    );

  }


  /* =========================================================
     PFP 3D TILT
  ========================================================= */

  const pfp =
    $("#pfpWrap");

  if (
    pfp &&
    window.matchMedia("(pointer:fine)").matches
  ) {

    pfp.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          pfp.getBoundingClientRect();

        const x =
          (event.clientX - rect.left)
          / rect.width;

        const y =
          (event.clientY - rect.top)
          / rect.height;

        const rotateY =
          (x - .5) * 12;

        const rotateX =
          (y - .5) * -12;

        pfp.style.transform =
          `
          perspective(900px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale(1.025)
          `;

      }
    );


    pfp.addEventListener(
      "mouseleave",
      () => {

        pfp.style.transform =
          `
          perspective(900px)
          rotateX(0deg)
          rotateY(0deg)
          scale(1)
          `;

      }
    );

  }


  /* =========================================================
     MUSIC
  ========================================================= */

  const audio =
    $("#audio");

  const musicToggle =
    $("#musicToggle");

  const musicIcon =
    $("#musicIcon");

  const musicWave =
    $("#musicWave");

  const musicTime =
    $("#musicTime");


  function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
      return "00:00";
    }

    const minutes =
      Math.floor(seconds / 60);

    const remaining =
      Math.floor(seconds % 60);

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

    if (musicWave) {

      musicWave.classList.toggle(
        "playing",
        !audio.paused
      );

    }

    if (musicIcon) {

      musicIcon.textContent =
        audio.paused
          ? "▶"
          : "Ⅱ";

    }

  }


  musicToggle?.addEventListener(
    "click",
    async () => {

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

    }
  );


  audio?.addEventListener(
    "timeupdate",
    updateMusicUI
  );

  audio?.addEventListener(
    "play",
    updateMusicUI
  );

  audio?.addEventListener(
    "pause",
    updateMusicUI
  );


  /* =========================================================
     SHOWCASE
  ========================================================= */

  const showcase =
    $("#showcase");

  const showcaseWindow =
    $(".showcase-window");

  const openShowcase =
    $("#openShowcase");

  const closeShowcase =
    $("#closeShowcase");

  const showcaseBackdrop =
    $(".showcase-backdrop");


  function openProject() {

    if (!showcase) return;

    showcase.classList.add("open");

    showcase.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "locked"
    );

  }


  function closeProject() {

    if (!showcase) return;

    showcase.classList.remove("open");

    showcase.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "locked"
    );

  }


  openShowcase?.addEventListener(
    "click",
    openProject
  );

  closeShowcase?.addEventListener(
    "click",
    closeProject
  );

  showcaseBackdrop?.addEventListener(
    "click",
    closeProject
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        showcase?.classList.contains("open")
      ) {

        closeProject();

      }

    }
  );


  /* =========================================================
     SHOWCASE TABS
  ========================================================= */

  const tabs =
    $$(".showcase-tab");

  const panels =
    $$(".showcase-panel");


  tabs.forEach(
    (tab) => {

      tab.addEventListener(
        "click",
        () => {

          const target =
            tab.dataset.tab;

          tabs.forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );

          panels.forEach(
            panel =>
              panel.classList.remove(
                "active"
              )
          );

          tab.classList.add(
            "active"
          );

          const targetPanel =
            $(
              `.showcase-panel[data-panel="${target}"]`
            );

          targetPanel?.classList.add(
            "active"
          );

        }
      );

    }
  );


  /* =========================================================
     MODULE COUNTER
  ========================================================= */

  const moduleToggles =
    $$(".module-toggle");

  const activeModules =
    $("#activeModules");


  function updateModuleCount() {

    if (!activeModules) return;

    const count =
      moduleToggles.filter(
        toggle =>
          toggle.checked
      ).length;

    activeModules.textContent =
      count;

  }


  moduleToggles.forEach(
    toggle => {

      toggle.addEventListener(
        "change",
        updateModuleCount
      );

    }
  );


  updateModuleCount();


  /* =========================================================
     SETTINGS
  ========================================================= */

  const opacitySlider =
    $("#opacitySlider");

  const opacityValue =
    $("#opacityValue");

  const scaleSlider =
    $("#scaleSlider");

  const scaleValue =
    $("#scaleValue");

  const glowSlider =
    $("#glowSlider");

  const glowValue =
    $("#glowValue");


  opacitySlider?.addEventListener(
    "input",
    () => {

      const value =
        Number(opacitySlider.value);

      if (opacityValue) {

        opacityValue.textContent =
          `${value}%`;

      }

      if (showcaseWindow) {

        showcaseWindow.style.setProperty(
          "--showcase-opacity",
          value / 100
        );

      }

    }
  );


  scaleSlider?.addEventListener(
    "input",
    () => {

      const value =
        Number(scaleSlider.value);

      if (scaleValue) {

        scaleValue.textContent =
          `${value}%`;

      }

      if (showcaseWindow) {

        showcaseWindow.style.transform =
          `scale(${value / 100})`;

      }

    }
  );


  glowSlider?.addEventListener(
    "input",
    () => {

      const value =
        Number(glowSlider.value);

      if (glowValue) {

        glowValue.textContent =
          `${value}%`;

      }

      if (showcaseWindow) {

        showcaseWindow.style.setProperty(
          "--showcase-glow",
          value / 100
        );

      }

    }
  );


  /* =========================================================
     RESET
  ========================================================= */

  const resetShowcase =
    $("#resetShowcase");

  resetShowcase?.addEventListener(
    "click",
    () => {

      moduleToggles.forEach(
        (toggle, index) => {

          toggle.checked =
            index < 5;

        }
      );

      if (opacitySlider) {
        opacitySlider.value = 100;
      }

      if (opacityValue) {
        opacityValue.textContent = "100%";
      }

      if (scaleSlider) {
        scaleSlider.value = 100;
      }

      if (scaleValue) {
        scaleValue.textContent = "100%";
      }

      if (glowSlider) {
        glowSlider.value = 45;
      }

      if (glowValue) {
        glowValue.textContent = "45%";
      }

      if (showcaseWindow) {

        showcaseWindow.style.setProperty(
          "--showcase-opacity",
          "1"
        );

        showcaseWindow.style.setProperty(
          "--showcase-glow",
          ".45"
        );

        showcaseWindow.style.transform =
          "scale(1)";

      }

      updateModuleCount();

    }
  );


  /* =========================================================
     VIEW MORE
  ========================================================= */

  const viewMore =
    $("#viewMore");

  viewMore?.addEventListener(
    "click",
    () => {

      const buttonText =
        viewMore.querySelector("span");

      if (
        viewMore.dataset.open !== "true"
      ) {

        viewMore.dataset.open =
          "true";

        viewMore.firstChild.textContent =
          "ACTIVE PREVIEW ";

        if (buttonText) {
          buttonText.textContent = "✓";
        }

      } else {

        viewMore.dataset.open =
          "false";

        viewMore.firstChild.textContent =
          "VIEW MORE ";

        if (buttonText) {
          buttonText.textContent = "↗";
        }

      }

    }
  );


  /* =========================================================
     SMOOTH ANCHORS
  ========================================================= */

  $$('a[href^="#"]').forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          const id =
            link.getAttribute("href");

          if (
            !id ||
            id === "#"
          ) {
            return;
          }

          const target =
            $(id);

          if (!target) return;

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    }
  );


  /* =========================================================
     KEYBOARD SHORTCUT
  ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key.toLowerCase() === "m" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {

        if (
          document.activeElement?.tagName ===
          "INPUT"
        ) {
          return;
        }

        musicToggle?.click();

      }

    }
  );


  /* =========================================================
     MAGNETIC BUTTON EFFECT
  ========================================================= */

  if (
    window.matchMedia("(pointer:fine)").matches
  ) {

    $$(".magnetic").forEach(
      (element) => {

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

            const strength = 0.08;

            element.style.transform =
              `translate(
                ${x * strength}px,
                ${y * strength}px
              )`;

          }
        );

        element.addEventListener(
          "mouseleave",
          () => {

            element.style.transform = "";

          }
        );

      }
    );

  }

});
