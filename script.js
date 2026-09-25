/* =========================================================
   PREMIUM CLIENT INTERFACE
========================================================= */

const showcase = document.getElementById("showcase");
const openShowcase = document.getElementById("openShowcase");
const closeShowcase = document.getElementById("closeShowcase");

const clientNav = document.querySelectorAll(".client-nav");
const clientPages = document.querySelectorAll(".client-page");

const toggles = document.querySelectorAll(".client-toggle");

const dashboardActive = document.getElementById("dashboardActive");
const dashboardModules = document.getElementById("dashboardModules");

let sessionSeconds = 0;

/* OPEN */

if (openShowcase) {
  openShowcase.addEventListener("click", () => {

    showcase.classList.add("active");

    document.body.classList.add("modal-open");

  });
}

/* CLOSE */

function closeClient() {

  showcase.classList.remove("active");

  document.body.classList.remove("modal-open");

}

if (closeShowcase) {
  closeShowcase.addEventListener("click", closeClient);
}

/* BACKDROP */

const showcaseBackdrop =
  document.querySelector(".showcase-backdrop");

if (showcaseBackdrop) {

  showcaseBackdrop.addEventListener(
    "click",
    closeClient
  );

}

/* ESC */

document.addEventListener("keydown", (event) => {

  if (
    event.key === "Escape" &&
    showcase.classList.contains("active")
  ) {

    closeClient();

  }

});

/* NAVIGATION */

clientNav.forEach((button) => {

  button.addEventListener("click", () => {

    const target =
      button.dataset.clientTab;

    clientNav.forEach((item) => {
      item.classList.remove("active");
    });

    clientPages.forEach((page) => {
      page.classList.remove("active");
    });

    button.classList.add("active");

    const page =
      document.querySelector(
        `[data-client-page="${target}"]`
      );

    if (page) {
      page.classList.add("active");
    }

  });

});

/* TOGGLES */

function updateModuleCounts() {

  const groups = [
    "combat",
    "visuals",
    "hud",
    "player"
  ];

  let total = 0;

  groups.forEach((group) => {

    const count =
      document.querySelectorAll(
        `.client-toggle.active[data-group="${group}"]`
      ).length;

    const counter =
      document.querySelector(
        `[data-count-group="${group}"]`
      );

    if (counter) {
      counter.textContent = count;
    }

    total += count;

  });

  if (dashboardActive) {
    dashboardActive.textContent = total;
  }

  if (dashboardModules) {
    dashboardModules.textContent = total;
  }

}

toggles.forEach((toggle) => {

  if (toggle.id === "animationToggle") {
    return;
  }

  toggle.addEventListener("click", () => {

    toggle.classList.toggle("active");

    updateModuleCounts();

  });

});

updateModuleCounts();

/* CONFIGS */

const configs =
  document.querySelectorAll(".config-card");

configs.forEach((config) => {

  config.addEventListener("click", () => {

    configs.forEach((item) => {
      item.classList.remove("active");
    });

    config.classList.add("active");

  });

});

/* OPACITY */

const opacity =
  document.getElementById("clientOpacity");

const opacityValue =
  document.getElementById("clientOpacityValue");

if (opacity) {

  opacity.addEventListener("input", () => {

    const value = opacity.value;

    opacityValue.textContent =
      `${value}%`;

    document
      .querySelector(".client-window")
      .style.opacity =
      Number(value) / 100;

  });

}

/* SCALE */

const scale =
  document.getElementById("clientScale");

const scaleValue =
  document.getElementById("clientScaleValue");

if (scale) {

  scale.addEventListener("input", () => {

    const value = scale.value;

    scaleValue.textContent =
      `${value}%`;

    document
      .querySelector(".client-window")
      .style.transform =
      `scale(${Number(value) / 100})`;

  });

}

/* ANIMATIONS */

const animationToggle =
  document.getElementById("animationToggle");

if (animationToggle) {

  animationToggle.addEventListener("click", () => {

    animationToggle.classList.toggle("active");

    document.body.classList.toggle(
      "client-reduced-motion"
    );

  });

}

/* SESSION CLOCK */

setInterval(() => {

  if (
    showcase &&
    showcase.classList.contains("active")
  ) {

    sessionSeconds++;

    const minutes =
      String(
        Math.floor(sessionSeconds / 60)
      ).padStart(2, "0");

    const seconds =
      String(
        sessionSeconds % 60
      ).padStart(2, "0");

    const sessionTime =
      document.getElementById("sessionTime");

    if (sessionTime) {

      sessionTime.textContent =
        `${minutes}:${seconds}`;

    }

  }

}, 1000);

/* LIVE TELEMETRY */

setInterval(() => {

  if (
    !showcase ||
    !showcase.classList.contains("active")
  ) {
    return;
  }

  const fps =
    document.getElementById("fpsValue");

  const ping =
    document.getElementById("pingValue");

  const memory =
    document.getElementById("memoryValue");

  if (fps) {
    fps.textContent =
      String(
        220 +
        Math.floor(Math.random() * 40)
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

}, 1200);
