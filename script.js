/* =========================================================
   N X R D O N U T
   Premium Portfolio Interaction
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const body = document.body;

const intro =
  document.getElementById("intro");

const cursor =
  document.getElementById("cursor");

const cursorDot =
  document.getElementById("cursorDot");

const pfp =
  document.getElementById("pfp");

const audio =
  document.getElementById("audio");

const musicPlay =
  document.getElementById("musicPlay");

const musicPlayer =
  document.querySelector(".music-player");

const musicTime =
  document.getElementById("musicTime");

const waveform =
  document.getElementById("waveform");

const showcase =
  document.getElementById("showcase");

const openShowcase =
  document.getElementById("openShowcase");

const closeShowcase =
  document.getElementById("closeShowcase");


/* =========================================================
   INTRO
========================================================= */

let introFinished = false;

function closeIntro() {

  if (introFinished) {
    return;
  }

  introFinished = true;

  if (intro) {
    intro.classList.add("hidden");
  }

}

if (intro) {

  intro.addEventListener(
    "click",
    closeIntro
  );

}


/* =========================================================
   CURSOR
========================================================= */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let cursorX = mouseX;
let cursorY = mouseY;

document.addEventListener(
  "mousemove",
  (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

  }
);


function animateCursor() {

  cursorX +=
    (mouseX - cursorX) * .18;

  cursorY +=
    (mouseY - cursorY) * .18;

  if (cursor) {

    cursor.style.left =
      `${cursorX}px`;

    cursor.style.top =
      `${cursorY}px`;

  }

  if (cursorDot) {

    cursorDot.style.left =
      `${mouseX}px`;

    cursorDot.style.top =
      `${mouseY}px`;

  }

  requestAnimationFrame(
    animateCursor
  );

}

animateCursor();


const hoverElements =
  document.querySelectorAll(
    "a, button, input, .social-card, .community-card, .project-card"
  );

hoverElements.forEach((element) => {

  element.addEventListener(
    "mouseenter",
    () => {
      body.classList.add("cursor-hover");
    }
  );

  element.addEventListener(
    "mouseleave",
    () => {
      body.classList.remove("cursor-hover");
    }
  );

});


/* =========================================================
   PFP PARALLAX
========================================================= */

document.addEventListener(
  "mousemove",
  (event) => {

    if (!pfp) {
      return;
    }

    const x =
      (event.clientX / window.innerWidth - .5) * 8;

    const y =
      (event.clientY / window.innerHeight - .5) * 8;

    pfp.style.transform =
      `translate(${x}px, ${y}px) scale(1.05)`;

  }
);


/* =========================================================
   MUSIC PLAYER
========================================================= */

if (audio && musicPlay) {

  musicPlay.addEventListener(
    "click",
    async () => {

      try {

        if (audio.paused) {

          await audio.play();

          musicPlayer.classList.add(
            "playing"
          );

          musicPlay
            .querySelector(".play-icon")
            .textContent = "Ⅱ";

        } else {

          audio.pause();

          musicPlayer.classList.remove(
            "playing"
          );

          musicPlay
            .querySelector(".play-icon")
            .textContent = "▶";

        }

      } catch (error) {

        console.warn(
          "Audio could not be played.",
          error
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

      const minutes =
        Math.floor(
          audio.currentTime / 60
        );

      const seconds =
        Math.floor(
          audio.currentTime % 60
        );

      musicTime.textContent =
        `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

    }
  );


  audio.addEventListener(
    "ended",
    () => {

      musicPlayer.classList.remove(
        "playing"
      );

      musicPlay
        .querySelector(".play-icon")
        .textContent = "▶";

    }
  );

}


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

            revealObserver.unobserve(
              entry.target
            );

          }

        }
      );

    },
    {
      threshold: .12
    }
  );


revealElements.forEach(
  (element) => {

    revealObserver.observe(
      element
    );

  }
);


/* =========================================================
   PREMIUM CLIENT
========================================================= */

let sessionSeconds = 0;

let sessionTimer = null;

let telemetryTimer = null;


/* =========================================================
   OPEN CLIENT
========================================================= */

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

  if (!sessionTimer) {

    sessionTimer =
      setInterval(
        updateSession,
        1000
      );

  }

  startTelemetry();

}


/* =========================================================
   CLOSE CLIENT
========================================================= */

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

  stopTelemetry();

}


if (openShowcase) {

  openShowcase.addEventListener(
    "click",
    openClient
  );

}


if (closeShowcase) {

  closeShowcase.addEventListener(
    "click",
    closeClient
  );

}


const showcaseBackdrop =
  document.querySelector(
    ".showcase-backdrop"
  );


if (showcaseBackdrop) {

  showcaseBackdrop.addEventListener(
    "click",
    closeClient
  );

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      showcase &&
      showcase.classList.contains("active")
    ) {

      closeClient();

    }

  }
);


/* =========================================================
   CLIENT NAVIGATION
========================================================= */

const clientNav =
  document.querySelectorAll(
    ".client-nav"
  );

const clientPages =
  document.querySelectorAll(
    ".client-page"
  );


clientNav.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const target =
          button.dataset.clientTab;

        if (!target) {
          return;
        }


        clientNav.forEach(
          (item) => {

            item.classList.remove(
              "active"
            );

          }
        );


        clientPages.forEach(
          (page) => {

            page.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        const page =
          document.querySelector(
            `[data-client-page="${target}"]`
          );


        if (page) {

          page.classList.add(
            "active"
          );

        }

      }
    );

  }
);


/* =========================================================
   MODULE COUNTERS
========================================================= */

const moduleGroups = [
  "combat",
  "visuals",
  "hud",
  "player"
];


function updateModuleCounts() {

  let total = 0;


  moduleGroups.forEach(
    (group) => {

      const active =
        document.querySelectorAll(
          `.client-toggle.active[data-group="${group}"]`
        );


      const counter =
        document.querySelector(
          `[data-count-group="${group}"]`
        );


      if (counter) {

        counter.textContent =
          active.length;

      }


      total += active.length;

    }
  );


  const dashboardActive =
    document.getElementById(
      "dashboardActive"
    );


  const dashboardModules =
    document.getElementById(
      "dashboardModules"
    );


  if (dashboardActive) {

    dashboardActive.textContent =
      total;

  }


  if (dashboardModules) {

    dashboardModules.textContent =
      total;

  }

}


const moduleToggles =
  document.querySelectorAll(
    ".client-toggle[data-group]"
  );


moduleToggles.forEach(
  (toggle) => {

    toggle.addEventListener(
      "click",
      () => {

        toggle.classList.toggle(
          "active"
        );

        updateModuleCounts();

      }
    );

  }
);


updateModuleCounts();


/* =========================================================
   CONFIGS
========================================================= */

const configCards =
  document.querySelectorAll(
    ".config-card"
  );


configCards.forEach(
  (card) => {

    card.addEventListener(
      "click",
      () => {

        configCards.forEach(
          (item) => {

            item.classList.remove(
              "active"
            );

          }
        );


        card.classList.add(
          "active"
        );

      }
    );

  }
);


/* =========================================================
   OPACITY
========================================================= */

const clientOpacity =
  document.getElementById(
    "clientOpacity"
  );

const clientOpacityValue =
  document.getElementById(
    "clientOpacityValue"
  );


if (clientOpacity) {

  clientOpacity.addEventListener(
    "input",
    () => {

      const value =
        Number(
          clientOpacity.value
        );


      if (clientOpacityValue) {

        clientOpacityValue.textContent =
          `${value}%`;

      }


      const clientWindow =
        document.querySelector(
          ".client-window"
        );


      if (clientWindow) {

        clientWindow.style.opacity =
          value / 100;

      }

    }
  );

}


/* =========================================================
   SCALE
========================================================= */

const clientScale =
  document.getElementById(
    "clientScale"
  );

const clientScaleValue =
  document.getElementById(
    "clientScaleValue"
  );


if (clientScale) {

  clientScale.addEventListener(
    "input",
    () => {

      const value =
        Number(
          clientScale.value
        );


      if (clientScaleValue) {

        clientScaleValue.textContent =
          `${value}%`;

      }


      const clientWindow =
        document.querySelector(
          ".client-window"
        );


      if (clientWindow) {

        clientWindow.style.transform =
          `scale(${value / 100})`;

      }

    }
  );

}


/* =========================================================
   ANIMATION TOGGLE
========================================================= */

const animationToggle =
  document.getElementById(
    "animationToggle"
  );


if (animationToggle) {

  animationToggle.addEventListener(
    "click",
    () => {

      animationToggle.classList.toggle(
        "active"
      );


      const enabled =
        animationToggle.classList.contains(
          "active"
        );


      body.classList.toggle(
        "client-reduced-motion",
        !enabled
      );

    }
  );

}


/* =========================================================
   REDUCED MOTION
========================================================= */

const motionToggle =
  document.getElementById(
    "motionToggle"
  );


if (motionToggle) {

  motionToggle.addEventListener(
    "click",
    () => {

      motionToggle.classList.toggle(
        "active"
      );


      const reduced =
        motionToggle.classList.contains(
          "active"
        );


      body.classList.toggle(
        "client-reduced-motion",
        reduced
      );

    }
  );

}


/* =========================================================
   SESSION TIMER
========================================================= */

function updateSession() {

  if (
    !showcase ||
    !showcase.classList.contains("active")
  ) {

    return;

  }


  sessionSeconds++;


  const minutes =
    Math.floor(
      sessionSeconds / 60
    );


  const seconds =
    sessionSeconds % 60;


  const sessionTime =
    document.getElementById(
      "sessionTime"
    );


  if (sessionTime) {

    sessionTime.textContent =
      `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

  }

}


/* =========================================================
   TELEMETRY
========================================================= */

function startTelemetry() {

  if (telemetryTimer) {
    return;
  }


  telemetryTimer =
    setInterval(
      updateTelemetry,
      1200
    );


  updateTelemetry();

}


function stopTelemetry() {

  if (!telemetryTimer) {
    return;
  }


  clearInterval(
    telemetryTimer
  );

  telemetryTimer = null;

}


function updateTelemetry() {

  if (
    !showcase ||
    !showcase.classList.contains("active")
  ) {

    return;

  }


  const fps =
    document.getElementById(
      "fpsValue"
    );


  const ping =
    document.getElementById(
      "pingValue"
    );


  const memory =
    document.getElementById(
      "memoryValue"
    );


  if (fps) {

    fps.textContent =
      String(
        220 +
        Math.floor(
          Math.random() * 40
        )
      );

  }


  if (ping) {

    ping.textContent =
      `${8 + Math.floor(Math.random() * 9)}ms`;

  }


  if (memory) {

    memory.textContent =
      `${38 + Math.floor(Math.random() * 8)}%`;

  }

}


/* =========================================================
   CLIENT KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      !showcase ||
      !showcase.classList.contains("active")
    ) {

      return;

    }


    const key =
      event.key.toLowerCase();


    const shortcuts = {

      "1": "dashboard",
      "2": "combat",
      "3": "visuals",
      "4": "hud",
      "5": "player",
      "6": "configs",
      "7": "settings"

    };


    if (!shortcuts[key]) {
      return;
    }


    const target =
      shortcuts[key];


    const navButton =
      document.querySelector(
        `.client-nav[data-client-tab="${target}"]`
      );


    if (navButton) {

      navButton.click();

    }

  }
);


/* =========================================================
   RESET CLIENT
========================================================= */

function resetClient() {

  moduleToggles.forEach(
    (toggle) => {

      toggle.classList.remove(
        "active"
      );

    }
  );


  updateModuleCounts();


  if (clientOpacity) {

    clientOpacity.value = 92;

  }


  if (clientOpacityValue) {

    clientOpacityValue.textContent =
      "92%";

  }


  if (clientScale) {

    clientScale.value = 100;

  }


  if (clientScaleValue) {

    clientScaleValue.textContent =
      "100%";

  }


  const clientWindow =
    document.querySelector(
      ".client-window"
    );


  if (clientWindow) {

    clientWindow.style.opacity =
      "1";

    clientWindow.style.transform =
      "translateY(0) scale(1)";

  }


  configCards.forEach(
    (card) => {

      card.classList.remove(
        "active"
      );

    }
  );


  const defaultConfig =
    document.querySelector(
      '.config-card[data-config="default"]'
    );


  if (defaultConfig) {

    defaultConfig.classList.add(
      "active"
    );

  }

}


/* =========================================================
   DOUBLE CLICK LOGO = RESET
========================================================= */

const clientLogo =
  document.querySelector(
    ".client-logo"
  );


if (clientLogo) {

  clientLogo.addEventListener(
    "dblclick",
    resetClient
  );

}


/* =========================================================
   SMOOTH ANCHOR FALLBACK
========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          const target =
            document.querySelector(
              link.getAttribute("href")
            );


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

    }
  );
