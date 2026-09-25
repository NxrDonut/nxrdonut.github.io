document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     ELEMENT HELPERS
  ====================================================== */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  /* =====================================================
     INTRO — CLICK ANYWHERE
  ====================================================== */

  const intro = $("#intro");

  function enterWebsite() {

    if (!intro) return;

    intro.classList.add("intro-hidden");

    document.body.classList.remove("intro-active");

    /*
      Completely remove the intro after the
      fade animation so it can never block clicks.
    */

    setTimeout(() => {
      intro.style.display = "none";
    }, 900);

    /*
      Start music after the user's click.
      Browsers generally allow audio after a
      direct user interaction.
    */

    const audio = $("#audio");

    if (audio) {
      audio.play().catch(() => {
        // Browser may still block audio.
      });
    }
  }

  if (intro) {

    intro.addEventListener("click", enterWebsite);

    intro.addEventListener("keydown", (event) => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        enterWebsite();
      }

    });

  }


  /* =====================================================
     NAV CLOCK
  ====================================================== */

  const navClock = $("#navClock");

  function updateNavClock() {

    if (!navClock) return;

    const now = new Date();

    const hours =
      String(now.getHours()).padStart(2, "0");

    const minutes =
      String(now.getMinutes()).padStart(2, "0");

    navClock.textContent =
      `${hours}:${minutes}`;
  }

  updateNavClock();

  setInterval(updateNavClock, 1000);


  /* =====================================================
     CLIENT CLOCK
  ====================================================== */

  const clientClock = $("#clientClock");

  function updateClientClock() {

    if (!clientClock) return;

    const now = new Date();

    const hours =
      String(now.getHours()).padStart(2, "0");

    const minutes =
      String(now.getMinutes()).padStart(2, "0");

    const seconds =
      String(now.getSeconds()).padStart(2, "0");

    clientClock.textContent =
      `${hours}:${minutes}:${seconds}`;
  }

  updateClientClock();

  setInterval(updateClientClock, 1000);


  /* =====================================================
     MUSIC
  ====================================================== */

  const audio = $("#audio");
  const musicPlay = $("#musicPlay");
  const musicTime = $("#musicTime");
  const waveform = $("#waveform");

  if (audio && musicPlay) {

    musicPlay.addEventListener("click", () => {

      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }

    });

    audio.addEventListener("play", () => {

      musicPlay.classList.add("playing");

      const icon = $(".play-icon", musicPlay);

      if (icon) {
        icon.textContent = "Ⅱ";
      }

      if (waveform) {
        waveform.classList.add("playing");
      }

    });

    audio.addEventListener("pause", () => {

      musicPlay.classList.remove("playing");

      const icon = $(".play-icon", musicPlay);

      if (icon) {
        icon.textContent = "▶";
      }

      if (waveform) {
        waveform.classList.remove("playing");
      }

    });

    audio.addEventListener("timeupdate", () => {

      if (!musicTime) return;

      const minutes =
        Math.floor(audio.currentTime / 60);

      const seconds =
        Math.floor(audio.currentTime % 60);

      musicTime.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    });

  }


  /* =====================================================
     SHOWCASE
  ====================================================== */

  const showcase = $("#showcase");
  const openShowcase = $("#openShowcase");
  const closeShowcase = $("#closeShowcase");
  const heroClientButton = $("#heroClientButton");

  function openClient() {

    if (!showcase) return;

    showcase.classList.add("showcase-open");

    document.body.classList.add("modal-open");

  }

  function closeClient() {

    if (!showcase) return;

    showcase.classList.remove("showcase-open");

    document.body.classList.remove("modal-open");

    closeCommandPalette();

  }

  if (openShowcase) {
    openShowcase.addEventListener("click", openClient);
  }

  if (heroClientButton) {
    heroClientButton.addEventListener("click", openClient);
  }

  if (closeShowcase) {
    closeShowcase.addEventListener("click", closeClient);
  }

  const showcaseBackdrop =
    $(".showcase-backdrop");

  if (showcaseBackdrop) {
    showcaseBackdrop.addEventListener(
      "click",
      closeClient
    );
  }


  /* =====================================================
     CLIENT TABS
  ====================================================== */

  const clientTabs =
    $$(".client-tab");

  const clientPanels =
    $$(".client-panel");

  const clientPageTitle =
    $("#clientPageTitle");


  const titles = {
    dashboard: "Dashboard",
    modules: "Modules",
    visuals: "Visuals",
    hud: "HUD Studio",
    settings: "Settings"
  };


  function switchClientTab(tabName) {

    clientTabs.forEach((tab) => {

      tab.classList.toggle(
        "active",
        tab.dataset.tab === tabName
      );

    });


    clientPanels.forEach((panel) => {

      panel.classList.toggle(
        "active",
        panel.dataset.panel === tabName
      );

    });


    if (clientPageTitle) {
      clientPageTitle.textContent =
        titles[tabName] || tabName;
    }

  }


  clientTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

      switchClientTab(tab.dataset.tab);

    });

  });


  /* =====================================================
     MODULE TOGGLES
  ====================================================== */

  const toggles =
    $$(".toggle");

  const activeModules =
    $("#activeModules");

  const dashboardModuleCount =
    $("#dashboardModuleCount");


  function updateModuleCount() {

    /*
      Only count module toggles inside the
      actual Modules panel.

      This prevents the HUD / settings toggles
      from inflating the module counter.
    */

    const modulePanel =
      $('.client-panel[data-panel="modules"]');

    let count = 0;

    if (modulePanel) {

      count =
        $$(".toggle.active", modulePanel).length;

    }


    if (activeModules) {
      activeModules.textContent = count;
    }

    if (dashboardModuleCount) {
      dashboardModuleCount.textContent = count;
    }

  }


  function addActivity(text) {

    const list = $("#activityList");

    if (!list) return;

    const item =
      document.createElement("div");

    item.innerHTML = `
      <i></i>
      <span>${text}</span>
      <small>now</small>
    `;

    list.prepend(item);

    /*
      Keep the activity panel clean.
    */

    while (list.children.length > 5) {
      list.lastElementChild.remove();
    }

  }


  toggles.forEach((toggle) => {

    toggle.addEventListener("click", () => {

      toggle.classList.toggle("active");

      updateModuleCount();

      const moduleName =
        toggle.dataset.module;

      if (moduleName) {

        const state =
          toggle.classList.contains("active")
            ? "Enabled"
            : "Disabled";

        addActivity(
          `${state} ${moduleName}`
        );

      }

    });

  });


  updateModuleCount();


  /* =====================================================
     OPACITY
  ====================================================== */

  const opacitySlider =
    $("#opacitySlider");

  const opacityValue =
    $("#opacityValue");

  if (opacitySlider) {

    opacitySlider.addEventListener(
      "input",
      () => {

        const value =
          Number(opacitySlider.value);

        if (opacityValue) {
          opacityValue.textContent =
            `${value}%`;
        }

        const windowElement =
          $(".showcase-window");

        if (windowElement) {

          windowElement.style.setProperty(
            "--client-opacity",
            value / 100
          );

        }

      }
    );

  }


  /* =====================================================
     SCALE
  ====================================================== */

  const scaleSlider =
    $("#scaleSlider");

  const scaleValue =
    $("#scaleValue");

  if (scaleSlider) {

    scaleSlider.addEventListener(
      "input",
      () => {

        const value =
          Number(scaleSlider.value);

        if (scaleValue) {
          scaleValue.textContent =
            `${value}%`;
        }

        const windowElement =
          $(".showcase-window");

        if (windowElement) {

          windowElement.style.setProperty(
            "--client-scale",
            value / 100
          );

        }

      }
    );

  }


  /* =====================================================
     MOTION TOGGLE
  ====================================================== */

  const motionToggle =
    $("#motionToggle");

  if (motionToggle) {

    motionToggle.addEventListener(
      "click",
      () => {

        motionToggle.classList.toggle("active");

        document.body.classList.toggle(
          "reduced-client-motion",
          !motionToggle.classList.contains("active")
        );

        addActivity(
          motionToggle.classList.contains("active")
            ? "Motion enabled"
            : "Motion disabled"
        );

      }
    );

  }


  /* =====================================================
     GRID TOGGLE
  ====================================================== */

  const gridToggle =
    $("#gridToggle");

  const gameGrid =
    $(".game-grid");

  if (gridToggle) {

    gridToggle.addEventListener(
      "click",
      () => {

        gridToggle.classList.toggle("active");

        if (gameGrid) {

          gameGrid.style.opacity =
            gridToggle.classList.contains("active")
              ? "1"
              : "0";

        }

        addActivity(
          gridToggle.classList.contains("active")
            ? "Grid enabled"
            : "Grid disabled"
        );

      }
    );

  }


  /* =====================================================
     RESET
  ====================================================== */

  const resetButton =
    $("#resetShowcase");

  if (resetButton) {

    resetButton.addEventListener(
      "click",
      () => {

        /*
          Default modules
        */

        toggles.forEach((toggle) => {

          const module =
            toggle.dataset.module;

          const defaultOn =
            module === "Motion Blur" ||
            module === "Array List" ||
            module === "Watermark";

          toggle.classList.toggle(
            "active",
            defaultOn
          );

        });


        /*
          Sliders
        */

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


        /*
          Window
        */

        const windowElement =
          $(".showcase-window");

        if (windowElement) {

          windowElement.style.setProperty(
            "--client-opacity",
            ".85"
          );

          windowElement.style.setProperty(
            "--client-scale",
            "1"
          );

        }


        /*
          Motion
        */

        if (motionToggle) {
          motionToggle.classList.add("active");
        }

        document.body.classList.remove(
          "reduced-client-motion"
        );


        /*
          Grid
        */

        if (gridToggle) {
          gridToggle.classList.add("active");
        }

        if (gameGrid) {
          gameGrid.style.opacity = "1";
        }


        updateModuleCount();

        addActivity(
          "Interface restored"
        );

      }
    );

  }


  /* =====================================================
     COMMAND PALETTE
  ====================================================== */

  const commandPalette =
    $("#commandPalette");

  const commandButton =
    $("#clientCommand");

  const commandInput =
    $("#commandInput");


  function openCommandPalette() {

    if (!commandPalette) return;

    commandPalette.classList.add("open");

    if (commandInput) {

      commandInput.value = "";

      setTimeout(() => {
        commandInput.focus();
      }, 50);

    }

  }


  function closeCommandPalette() {

    if (!commandPalette) return;

    commandPalette.classList.remove("open");

  }


  if (commandButton) {

    commandButton.addEventListener(
      "click",
      openCommandPalette
    );

  }


  if (commandPalette) {

    commandPalette.addEventListener(
      "click",
      (event) => {

        if (
          event.target === commandPalette
        ) {
          closeCommandPalette();
        }

      }
    );

  }


  const commandButtons =
    $$(".command-results button");


  commandButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const command =
        button.dataset.command;

      switchClientTab(command);

      closeCommandPalette();

    });

  });


  if (commandInput) {

    commandInput.addEventListener(
      "input",
      () => {

        const query =
          commandInput.value
            .trim()
            .toLowerCase();

        commandButtons.forEach((button) => {

          const text =
            button.textContent.toLowerCase();

          button.style.display =
            text.includes(query)
              ? "flex"
              : "none";

        });

      }
    );

  }


  /* =====================================================
     KEYBOARD SHORTCUTS
  ====================================================== */

  document.addEventListener(
    "keydown",
    (event) => {

      /*
        Escape closes everything.
      */

      if (event.key === "Escape") {

        closeCommandPalette();

        if (
          showcase &&
          showcase.classList.contains(
            "showcase-open"
          )
        ) {
          closeClient();
        }

      }


      /*
        "/" opens command palette
        unless user is already typing.
      */

      if (
        event.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {

        event.preventDefault();

        if (
          showcase &&
          showcase.classList.contains(
            "showcase-open"
          )
        ) {
          openCommandPalette();
        }

      }

    }
  );


  /* =====================================================
     CUSTOM CURSOR
  ====================================================== */

  const cursor =
    $("#cursor");

  const cursorDot =
    $("#cursorDot");


  if (
    cursor &&
    cursorDot &&
    window.matchMedia("(pointer: fine)").matches
  ) {

    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;


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

      cursorX +=
        (mouseX - cursorX) * .15;

      cursorY +=
        (mouseY - cursorY) * .15;

      cursor.style.left =
        `${cursorX}px`;

      cursor.style.top =
        `${cursorY}px`;

      requestAnimationFrame(
        animateCursor
      );

    }

    animateCursor();


    function bindCursorHover() {

      const interactive =
        $$(
          "a, button, input, .social-card, .community-card, .experience-card, .project-card"
        );

      interactive.forEach((element) => {

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

    bindCursorHover();

  }


  /* =====================================================
     HERO PARALLAX
  ====================================================== */

  const hero =
    $(".hero");

  const pfp =
    $("#pfp");


  if (
    hero &&
    pfp &&
    window.matchMedia("(pointer: fine)").matches
  ) {

    hero.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          hero.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
            rect.width -
          .5;

        const y =
          (event.clientY - rect.top) /
            rect.height -
          .5;

        pfp.style.transform =
          `translate(${x * 12}px, ${y * 12}px)`;

      }
    );


    hero.addEventListener(
      "mouseleave",
      () => {

        pfp.style.transform =
          "translate(0, 0)";

      }
    );

  }


  /* =====================================================
     PROJECT CARD TILT
  ====================================================== */

  const projectCards =
    $$(".project-card");


  if (
    window.matchMedia("(pointer: fine)").matches
  ) {

    projectCards.forEach((card) => {

      card.addEventListener(
        "mousemove",
        (event) => {

          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
              rect.width -
            .5;

          const y =
            (event.clientY - rect.top) /
              rect.height -
            .5;

          card.style.transform =
            `perspective(1000px)
             rotateX(${y * -2}deg)
             rotateY(${x * 2}deg)
             translateY(-5px)`;

        }
      );


      card.addEventListener(
        "mouseleave",
        () => {

          card.style.transform = "";

        }
      );

    });

  }


  /* =====================================================
     SCROLL REVEAL
  ====================================================== */

  const revealElements =
    $$(".reveal");


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: .12
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
        element.classList.add("visible");
      }
    );

  }


  /* =====================================================
     SMOOTH NAVIGATION
  ====================================================== */

  $$('a[href^="#"]').forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(
            targetId
          );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  });


  /* =====================================================
     PREVENT MODAL SCROLL EVENTS LEAKING
  ====================================================== */

  if (showcase) {

    showcase.addEventListener(
      "wheel",
      (event) => {

        if (
          event.target.closest(
            ".client-content"
          )
        ) {
          return;
        }

        event.preventDefault();

      },
      { passive: false }
    );

  }


  /* =====================================================
     INITIAL STATE
  ====================================================== */

  /*
    Make sure the intro starts visible and
    the page is usable even if CSS/JS was
    cached strangely.
  */

  if (intro) {

    intro.style.display = "flex";

    requestAnimationFrame(() => {

      if (
        intro.classList.contains(
          "intro-hidden"
        )
      ) {
        intro.style.display = "none";
      }

    });

  }

});
