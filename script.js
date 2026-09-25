document.addEventListener("DOMContentLoaded", () => {

  "use strict";


  /* =========================================================
     INTRO
  ========================================================= */

  const intro =
    document.getElementById("intro");

  const body =
    document.body;

  let introOpened = false;


  function enterSite() {

    if (introOpened) {
      return;
    }

    introOpened = true;

    body.classList.remove("locked");

    if (!intro) {
      return;
    }

    intro.classList.add("hidden");

    setTimeout(() => {

      if (intro && intro.parentNode) {
        intro.remove();
      }

    }, 900);

  }


  if (intro) {

    body.classList.add("locked");

    intro.addEventListener(
      "pointerdown",
      (event) => {

        event.preventDefault();

        enterSite();

      },
      {
        passive: false
      }
    );


    intro.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " " ||
          event.key === "Escape"
        ) {

          event.preventDefault();

          enterSite();

        }

      }
    );

  } else {

    body.classList.remove("locked");

  }


  /* =========================================================
     SMOOTH NAVIGATION
  ========================================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const id =
            link.getAttribute("href");

          if (!id || id === "#") {
            return;
          }

          const target =
            document.querySelector(id);

          if (!target) {
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });


  /* =========================================================
     REVEAL ANIMATIONS
  ========================================================= */

  const revealElements =
    document.querySelectorAll(".reveal");


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries, obs) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            obs.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(
      (element) => {
        observer.observe(element);
      }
    );

  } else {

    revealElements.forEach(
      (element) => {
        element.classList.add(
          "visible"
        );
      }
    );

  }


  /* =========================================================
     CURSOR
  ========================================================= */

  const cursor =
    document.getElementById("cursor");

  const cursorDot =
    document.getElementById("cursorDot");


  if (
    cursor &&
    cursorDot &&
    window.matchMedia(
      "(pointer: fine)"
    ).matches
  ) {

    let mouseX =
      window.innerWidth / 2;

    let mouseY =
      window.innerHeight / 2;

    let cursorX = mouseX;
    let cursorY = mouseY;


    document.addEventListener(
      "mousemove",
      (event) => {

        mouseX =
          event.clientX;

        mouseY =
          event.clientY;

        cursorDot.style.left =
          `${mouseX}px`;

        cursorDot.style.top =
          `${mouseY}px`;

      }
    );


    function animateCursor() {

      cursorX +=
        (mouseX - cursorX) * 0.15;

      cursorY +=
        (mouseY - cursorY) * 0.15;


      cursor.style.left =
        `${cursorX}px`;

      cursor.style.top =
        `${cursorY}px`;


      requestAnimationFrame(
        animateCursor
      );

    }


    animateCursor();


    document
      .querySelectorAll(
        "a, button, input"
      )
      .forEach((element) => {

        element.addEventListener(
          "mouseenter",
          () => {
            cursor.classList.add(
              "cursor-hover"
            );
          }
        );


        element.addEventListener(
          "mouseleave",
          () => {
            cursor.classList.remove(
              "cursor-hover"
            );
          }
        );

      });

  }


  /* =========================================================
     MUSIC
  ========================================================= */

  const audio =
    document.getElementById("audio");

  const musicPlay =
    document.getElementById(
      "musicPlay"
    );

  const musicTime =
    document.getElementById(
      "musicTime"
    );

  const waveform =
    document.getElementById(
      "waveform"
    );


  if (audio && musicPlay) {

    const icon =
      musicPlay.querySelector(
        ".play-icon"
      );


    musicPlay.addEventListener(
      "click",
      async (event) => {

        event.preventDefault();
        event.stopPropagation();


        try {

          if (audio.paused) {

            await audio.play();

          } else {

            audio.pause();

          }

        } catch (error) {

          console.log(
            "Audio playback unavailable:",
            error
          );

        }

      }
    );


    audio.addEventListener(
      "play",
      () => {

        musicPlay.classList.add(
          "playing"
        );

        if (icon) {
          icon.textContent = "Ⅱ";
        }

        if (waveform) {
          waveform.classList.add(
            "active"
          );
        }

      }
    );


    audio.addEventListener(
      "pause",
      () => {

        musicPlay.classList.remove(
          "playing"
        );

        if (icon) {
          icon.textContent = "▶";
        }

        if (waveform) {
          waveform.classList.remove(
            "active"
          );
        }

      }
    );


    audio.addEventListener(
      "timeupdate",
      () => {

        if (!musicTime) {
          return;
        }

        if (
          !Number.isFinite(
            audio.currentTime
          )
        ) {
          return;
        }


        const minutes =
          Math.floor(
            audio.currentTime / 60
          );


        const seconds =
          Math.floor(
            audio.currentTime % 60
          );


        musicTime.textContent =
          `${String(minutes).padStart(2, "0")}:` +
          `${String(seconds).padStart(2, "0")}`;

      }
    );

  }


  /* =========================================================
     SHOWCASE
  ========================================================= */

  const showcase =
    document.getElementById(
      "showcase"
    );

  const openShowcase =
    document.getElementById(
      "openShowcase"
    );

  const closeShowcase =
    document.getElementById(
      "closeShowcase"
    );

  const backdrop =
    document.querySelector(
      ".showcase-backdrop"
    );


  function openClient() {

    if (!showcase) {
      return;
    }

    showcase.classList.add(
      "active"
    );

    showcase.setAttribute(
      "aria-hidden",
      "false"
    );

    body.classList.add(
      "modal-open"
    );

  }


  function closeClient() {

    if (!showcase) {
      return;
    }

    showcase.classList.remove(
      "active"
    );

    showcase.setAttribute(
      "aria-hidden",
      "true"
    );

    body.classList.remove(
      "modal-open"
    );

  }


  if (openShowcase) {

    openShowcase.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        openClient();

      }
    );

  }


  if (closeShowcase) {

    closeShowcase.addEventListener(
      "click",
      closeClient
    );

  }


  if (backdrop) {

    backdrop.addEventListener(
      "click",
      closeClient
    );

  }


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape"
      ) {

        closeClient();

      }

    }
  );


  /* =========================================================
     SHOWCASE TABS
  ========================================================= */

  const tabs =
    document.querySelectorAll(
      ".showcase-tab"
    );

  const panels =
    document.querySelectorAll(
      ".module-panel"
    );


  tabs.forEach((tab) => {

    tab.addEventListener(
      "click",
      () => {

        const target =
          tab.dataset.tab;


        tabs.forEach(
          (item) => {
            item.classList.remove(
              "active"
            );
          }
        );


        panels.forEach(
          (panel) => {
            panel.classList.remove(
              "active"
            );
          }
        );


        tab.classList.add(
          "active"
        );


        const panel =
          document.querySelector(
            `.module-panel[data-panel="${target}"]`
          );


        if (panel) {

          panel.classList.add(
            "active"
          );

        }

      }
    );

  });


  /* =========================================================
     MODULE TOGGLES
  ========================================================= */

  const toggles =
    document.querySelectorAll(
      ".toggle"
    );

  const activeModules =
    document.getElementById(
      "activeModules"
    );


  function updateCounters() {

    let total = 0;


    panels.forEach((panel) => {

      const active =
        panel.querySelectorAll(
          ".toggle.active"
        ).length;


      total += active;


      const counter =
        panel.querySelector(
          ".module-count b"
        );


      if (counter) {

        counter.textContent =
          active;

      }

    });


    if (activeModules) {

      activeModules.textContent =
        total;

    }

  }


  toggles.forEach(
    (toggle) => {

      toggle.addEventListener(
        "click",
        () => {

          toggle.classList.toggle(
            "active"
          );

          updateCounters();

        }
      );

    }
  );


  /* =========================================================
     OPACITY
  ========================================================= */

  const opacitySlider =
    document.getElementById(
      "opacitySlider"
    );

  const opacityValue =
    document.getElementById(
      "opacityValue"
    );

  const showcaseWindow =
    document.querySelector(
      ".showcase-window"
    );


  if (opacitySlider) {

    opacitySlider.addEventListener(
      "input",
      () => {

        const value =
          Number(
            opacitySlider.value
          );


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

  }


  /* =========================================================
     SCALE
  ========================================================= */

  const scaleSlider =
    document.getElementById(
      "scaleSlider"
    );

  const scaleValue =
    document.getElementById(
      "scaleValue"
    );


  if (scaleSlider) {

    scaleSlider.addEventListener(
      "input",
      () => {

        const value =
          Number(
            scaleSlider.value
          );


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

  }


  /* =========================================================
     VIEW MORE
  ========================================================= */

  const viewMore =
    document.getElementById(
      "viewMore"
    );


  if (viewMore) {

    viewMore.addEventListener(
      "click",
      () => {

        const content =
          document.querySelector(
            ".showcase-content"
          );


        if (!content) {
          return;
        }


        content.classList.toggle(
          "expanded"
        );


        const expanded =
          content.classList.contains(
            "expanded"
          );


        viewMore.textContent =
          expanded
            ? "Collapse View"
            : "View More";


        viewMore.classList.toggle(
          "active",
          expanded
        );

      }
    );

  }


  /* =========================================================
     RESET SHOWCASE
  ========================================================= */

  const resetShowcase =
    document.getElementById(
      "resetShowcase"
    );


  if (resetShowcase) {

    resetShowcase.addEventListener(
      "click",
      () => {

        toggles.forEach(
          (toggle) => {

            toggle.classList.remove(
              "active"
            );

          }
        );


        if (opacitySlider) {

          opacitySlider.value =
            85;

        }


        if (opacityValue) {

          opacityValue.textContent =
            "85%";

        }


        if (showcaseWindow) {

          showcaseWindow.style.setProperty(
            "--showcase-opacity",
            ".85"
          );

        }


        if (scaleSlider) {

          scaleSlider.value =
            100;

        }


        if (scaleValue) {

          scaleValue.textContent =
            "100%";

        }


        if (showcaseWindow) {

          showcaseWindow.style.transform =
            "scale(1)";

        }


        const content =
          document.querySelector(
            ".showcase-content"
          );


        if (content) {

          content.classList.remove(
            "expanded"
          );

        }


        if (viewMore) {

          viewMore.textContent =
            "View More";

          viewMore.classList.remove(
            "active"
          );

        }


        updateCounters();

      }
    );

  }


  /* =========================================================
     INITIAL STATE
  ========================================================= */

  updateCounters();


  if (opacitySlider && opacityValue) {

    opacityValue.textContent =
      `${opacitySlider.value}%`;

  }


  if (scaleSlider && scaleValue) {

    scaleValue.textContent =
      `${scaleSlider.value}%`;

  }

});
