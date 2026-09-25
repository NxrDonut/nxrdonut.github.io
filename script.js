document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     INTRO
     ========================================= */

  const intro = document.getElementById("intro");
  const body = document.body;

  let introOpened = false;

  function openIntro() {
    if (!intro || introOpened) return;

    introOpened = true;

    intro.classList.add("hidden");
    body.classList.remove("locked");

    setTimeout(() => {
      intro.style.display = "none";
    }, 850);
  }

  if (intro) {
    body.classList.add("locked");

    intro.addEventListener("pointerup", openIntro);
    intro.addEventListener("click", openIntro);

    intro.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openIntro();
      }
    });
  }


  /* =========================================
     CUSTOM CURSOR
     ========================================= */

  const cursor = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursorDot");

  if (cursor && cursorDot && window.matchMedia("(pointer: fine)").matches) {

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.16;
      cursorY += (mouseY - cursorY) * 0.16;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    const hoverElements = document.querySelectorAll(
      "a, button, input, .pfp-wrap"
    );

    hoverElements.forEach((element) => {

      element.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
      });

      element.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
      });

    });
  }


  /* =========================================
     SCROLL REVEALS
     ========================================= */

  const revealElements =
    document.querySelectorAll(".reveal");

  const revealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            revealObserver.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });


  /* =========================================
     PFP TILT
     ========================================= */

  const pfpWrap = document.querySelector(".pfp-wrap");

  if (
    pfpWrap &&
    window.matchMedia("(pointer: fine)").matches
  ) {

    pfpWrap.addEventListener("mousemove", (event) => {

      const rect =
        pfpWrap.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
        rect.width;

      const y =
        (event.clientY - rect.top) /
        rect.height;

      const rotateY = (x - 0.5) * 10;
      const rotateX = (y - 0.5) * -10;

      pfpWrap.style.transform =
        `perspective(700px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         scale(1.02)`;
    });

    pfpWrap.addEventListener("mouseleave", () => {

      pfpWrap.style.transform =
        "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  }


  /* =========================================
     MUSIC PLAYER
     ========================================= */

  const audio = document.getElementById("audio");
  const musicPlay = document.getElementById("musicPlay");
  const playIcon = musicPlay?.querySelector(".play-icon");
  const waveform = document.getElementById("waveform");
  const musicTime = document.getElementById("musicTime");

  if (
    audio &&
    musicPlay &&
    waveform &&
    musicTime
  ) {

    function formatTime(seconds) {

      if (!Number.isFinite(seconds)) {
        return "00:00";
      }

      const minutes =
        Math.floor(seconds / 60);

      const remaining =
        Math.floor(seconds % 60);

      return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
    }

    musicPlay.addEventListener("click", async () => {

      try {

        if (audio.paused) {

          await audio.play();

          waveform.classList.add("playing");

          if (playIcon) {
            playIcon.textContent = "Ⅱ";
          }

        } else {

          audio.pause();

          waveform.classList.remove("playing");

          if (playIcon) {
            playIcon.textContent = "▶";
          }

        }

      } catch (error) {

        console.log(
          "Audio could not be played:",
          error
        );

      }

    });

    audio.addEventListener("timeupdate", () => {

      musicTime.textContent =
        formatTime(audio.currentTime);

    });

    audio.addEventListener("pause", () => {

      waveform.classList.remove("playing");

      if (playIcon) {
        playIcon.textContent = "▶";
      }

    });

    audio.addEventListener("play", () => {

      waveform.classList.add("playing");

      if (playIcon) {
        playIcon.textContent = "Ⅱ";
      }

    });
  }


  /* =========================================
     SHOWCASE
     ========================================= */

  const showcase =
    document.getElementById("showcase");

  const openShowcase =
    document.getElementById("openShowcase");

  const closeShowcase =
    document.getElementById("closeShowcase");

  const showcaseBackdrop =
    document.querySelector(".showcase-backdrop");

  function openProjectShowcase() {

    if (!showcase) return;

    showcase.classList.add("open");

    body.classList.add("locked");
  }

  function closeProjectShowcase() {

    if (!showcase) return;

    showcase.classList.remove("open");

    body.classList.remove("locked");
  }

  openShowcase?.addEventListener(
    "click",
    openProjectShowcase
  );

  closeShowcase?.addEventListener(
    "click",
    closeProjectShowcase
  );

  showcaseBackdrop?.addEventListener(
    "click",
    closeProjectShowcase
  );

  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      showcase?.classList.contains("open")
    ) {
      closeProjectShowcase();
    }

  });


  /* =========================================
     SHOWCASE TABS
     ========================================= */

  const tabs =
    document.querySelectorAll(".showcase-tab");

  const panels =
    document.querySelectorAll(".module-panel");

  tabs.forEach((tab) => {

    tab.addEventListener("click", () => {

      const target =
        tab.dataset.tab;

      tabs.forEach((item) => {
        item.classList.remove("active");
      });

      panels.forEach((panel) => {
        panel.classList.remove("active");
      });

      tab.classList.add("active");

      const panel =
        document.querySelector(
          `.module-panel[data-panel="${target}"]`
        );

      panel?.classList.add("active");

    });

  });


  /* =========================================
     MODULE TOGGLES
     ========================================= */

  const toggles =
    document.querySelectorAll(".toggle");

  const totalModules =
    document.getElementById("activeModules");

  function updateModuleCounts() {

    const groups = {
      combat: document.querySelectorAll(
        '[data-panel="combat"] .toggle.active'
      ),

      visuals: document.querySelectorAll(
        '[data-panel="visuals"] .toggle.active'
      ),

      hud: document.querySelectorAll(
        '[data-panel="hud"] .toggle.active'
      )
    };

    const combatCount =
      document.getElementById("combatCount");

    const visualsCount =
      document.getElementById("visualsCount");

    const hudCount =
      document.getElementById("hudCount");

    if (combatCount) {
      combatCount.textContent =
        groups.combat.length;
    }

    if (visualsCount) {
      visualsCount.textContent =
        groups.visuals.length;
    }

    if (hudCount) {
      hudCount.textContent =
        groups.hud.length;
    }

    const total =
      groups.combat.length +
      groups.visuals.length +
      groups.hud.length;

    if (totalModules) {
      totalModules.textContent = total;
    }

  }

  toggles.forEach((toggle) => {

    toggle.addEventListener("click", () => {

      toggle.classList.toggle("active");

      updateModuleCounts();

    });

  });

  updateModuleCounts();


  /* =========================================
     SETTINGS
     ========================================= */

  const opacitySlider =
    document.getElementById("opacitySlider");

  const opacityValue =
    document.getElementById("opacityValue");

  const scaleSlider =
    document.getElementById("scaleSlider");

  const scaleValue =
    document.getElementById("scaleValue");

  const showcaseWindow =
    document.querySelector(".showcase-window");

  if (opacitySlider && opacityValue) {

    opacitySlider.addEventListener(
      "input",
      () => {

        const value =
          opacitySlider.value;

        opacityValue.textContent =
          `${value}%`;

        if (showcaseWindow) {

          showcaseWindow.style.setProperty(
            "--showcase-opacity",
            `${value / 100}`
          );

          showcaseWindow.style.opacity =
            value / 100;
        }

      }
    );
  }

  if (scaleSlider && scaleValue) {

    scaleSlider.addEventListener(
      "input",
      () => {

        const value =
          scaleSlider.value;

        scaleValue.textContent =
          `${value}%`;

        if (showcaseWindow) {

          showcaseWindow.style.transform =
            `scale(${value / 100})`;
        }

      }
    );
  }


  /* =========================================
     VIEW MORE
     ========================================= */

  const viewMore =
    document.getElementById("viewMore");

  if (viewMore) {

    viewMore.addEventListener("click", () => {

      const current =
        viewMore.textContent.trim();

      if (current === "View More") {

        viewMore.textContent =
          "Interactive Preview";

      } else {

        viewMore.textContent =
          "View More";
      }

    });

  }


  /* =========================================
     RESET SHOWCASE
     ========================================= */

  const resetShowcase =
    document.getElementById("resetShowcase");

  if (resetShowcase) {

    resetShowcase.addEventListener(
      "click",
      () => {

        toggles.forEach((toggle) => {
          toggle.classList.remove("active");
        });

        if (opacitySlider) {
          opacitySlider.value = 85;
        }

        if (opacityValue) {
          opacityValue.textContent = "85%";
        }

        if (scaleSlider) {
          scaleSlider.value = 100;
        }

        if (scaleValue) {
          scaleValue.textContent = "100%";
        }

        if (showcaseWindow) {
          showcaseWindow.style.opacity = "1";
          showcaseWindow.style.transform =
            "scale(1)";
        }

        if (viewMore) {
          viewMore.textContent =
            "View More";
        }

        updateModuleCounts();

      }
    );

  }


  /* =========================================
     SMOOTH NAVIGATION
     ========================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener("click", (event) => {

        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      });

    });

});
