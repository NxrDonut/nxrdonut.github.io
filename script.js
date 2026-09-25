/* =========================================================
   NXR DONUT
   Premium portfolio interactions
========================================================= */


/* =========================
   INTRO
========================= */

const intro = document.getElementById("intro");

function enterSite() {
  if (!intro) return;

  intro.classList.add("hidden");
  document.body.classList.add("entered");

  setTimeout(() => {
    intro.style.display = "none";
  }, 1100);
}

intro?.addEventListener("click", enterSite);


/* =========================
   CURSOR
========================= */

const cursor = document.querySelector(".cursor");
const cursorTrail = document.querySelector(".cursor-trail");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let trailX = mouseX;
let trailY = mouseY;

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (cursor) {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  }
});

function animateCursor() {
  trailX += (mouseX - trailX) * 0.13;
  trailY += (mouseY - trailY) * 0.13;

  if (cursorTrail) {
    cursorTrail.style.left = `${trailX}px`;
    cursorTrail.style.top = `${trailY}px`;
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();


document.querySelectorAll("a, button, input").forEach((element) => {
  element.addEventListener("mouseenter", () => {
    document.body.classList.add("cursor-hover");
  });

  element.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-hover");
  });
});


/* =========================
   MUSIC
========================= */

const audio = document.getElementById("audio");
const musicToggle = document.getElementById("musicToggle");
const navMusic = document.getElementById("navMusic");
const musicPlayer = document.querySelector(".music-player");

let musicPlaying = false;

async function toggleMusic() {
  if (!audio) return;

  if (audio.paused) {
    try {
      await audio.play();
      musicPlaying = true;
    } catch {
      musicPlaying = false;
    }
  } else {
    audio.pause();
    musicPlaying = false;
  }

  updateMusicUI();
}

function updateMusicUI() {
  if (!musicToggle || !navMusic || !musicPlayer) return;

  musicToggle.querySelector(".play-icon").textContent =
    musicPlaying ? "Ⅱ" : "▶";

  navMusic.classList.toggle("playing", musicPlaying);
  musicPlayer.classList.toggle("playing", musicPlaying);
}

musicToggle?.addEventListener("click", toggleMusic);
navMusic?.addEventListener("click", toggleMusic);

audio?.addEventListener("play", () => {
  musicPlaying = true;
  updateMusicUI();
});

audio?.addEventListener("pause", () => {
  musicPlaying = false;
  updateMusicUI();
});


/* =========================
   SCROLL REVEAL
========================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.08
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});


/* =========================
   PFP PARALLAX
========================= */

const pfpWrap = document.getElementById("pfpWrap");

if (pfpWrap && window.matchMedia("(pointer:fine)").matches) {

  window.addEventListener("mousemove", (event) => {

    const x =
      (event.clientX / window.innerWidth - 0.5) * 2;

    const y =
      (event.clientY / window.innerHeight - 0.5) * 2;

    pfpWrap.style.transform = `
      rotateY(${x * 5}deg)
      rotateX(${y * -5}deg)
    `;
  });

}


/* =========================================================
   BLACKFISH / CLOSET CHEATS INTERACTIVE SHOWCASE
========================================================= */

const bfTabs = document.querySelectorAll(".bf-tab");
const clientMenuItems = document.querySelectorAll(".client-menu-item");

const moduleContents = document.querySelectorAll(".module-content");

const currentTitle = document.getElementById("bfCurrentTitle");
const panelTitle = document.getElementById("panelTitle");

const clientDevice = document.getElementById("clientDevice");
const bfStage = document.getElementById("bfStage");

const enabledCount = document.getElementById("enabledCount");


/* -------------------------
   Tab Switching
------------------------- */

function activateTab(tabName) {

  bfTabs.forEach((tab) => {
    tab.classList.toggle(
      "active",
      tab.dataset.tab === tabName
    );
  });

  clientMenuItems.forEach((item) => {
    item.classList.toggle(
      "active",
      item.dataset.tab === tabName
    );
  });

  moduleContents.forEach((content) => {
    content.classList.toggle(
      "active",
      content.dataset.content === tabName
    );
  });

  const formattedName =
    tabName.charAt(0).toUpperCase() + tabName.slice(1);

  if (currentTitle) {
    currentTitle.textContent = formattedName;
  }

  if (panelTitle) {
    panelTitle.textContent = formattedName;
  }

  updateEnabledCount();
}

bfTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateTab(tab.dataset.tab);
  });
});

clientMenuItems.forEach((item) => {
  item.addEventListener("click", () => {
    activateTab(item.dataset.tab);
  });
});


/* -------------------------
   Module Toggles
------------------------- */

function updateEnabledCount() {

  const activeModule =
    document.querySelector(".module-content.active");

  if (!activeModule || !enabledCount) return;

  const toggles =
    activeModule.querySelectorAll(".toggle");

  const active =
    activeModule.querySelectorAll(".toggle.active");

  enabledCount.textContent = active.length;
}

document.querySelectorAll("[data-toggle]").forEach((toggle) => {

  toggle.addEventListener("click", () => {

    toggle.classList.toggle("active");

    updateEnabledCount();

  });

});


/* -------------------------
   View More
------------------------- */

const viewMore = document.getElementById("viewMore");

viewMore?.addEventListener("click", () => {

  const activeContent =
    document.querySelector(".module-content.active");

  if (!activeContent) return;

  const firstToggle =
    activeContent.querySelector(".toggle");

  if (firstToggle) {
    firstToggle.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    firstToggle.animate(
      [
        {
          transform: "scale(1)"
        },
        {
          transform: "scale(1.12)"
        },
        {
          transform: "scale(1)"
        }
      ],
      {
        duration: 500,
        easing: "ease-out"
      }
    );
  }

});


/* -------------------------
   Open Settings
------------------------- */

const openSettings =
  document.getElementById("openSettings");

openSettings?.addEventListener("click", () => {
  activateTab("settings");

  document.querySelector(".blackfish-shell")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
});


/* -------------------------
   Reset View
------------------------- */

const resetView =
  document.getElementById("resetView");

resetView?.addEventListener("click", () => {

  if (!clientDevice) return;

  clientDevice.style.transform =
    "rotateX(8deg) rotateY(-15deg) rotateZ(-1deg)";
});


/* -------------------------
   3D Drag / Mouse Interaction
------------------------- */

let dragging = false;
let startX = 0;
let startY = 0;

let rotationX = 8;
let rotationY = -15;

if (bfStage && clientDevice) {

  bfStage.addEventListener("pointerdown", (event) => {

    dragging = true;

    startX = event.clientX;
    startY = event.clientY;

    bfStage.setPointerCapture(event.pointerId);

    document.body.classList.add("cursor-hover");
  });


  bfStage.addEventListener("pointermove", (event) => {

    if (!dragging) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    rotationY += deltaX * 0.18;
    rotationX -= deltaY * 0.12;

    rotationX = Math.max(-20, Math.min(25, rotationX));

    clientDevice.style.transform = `
      rotateX(${rotationX}deg)
      rotateY(${rotationY}deg)
      rotateZ(-1deg)
    `;

    startX = event.clientX;
    startY = event.clientY;
  });


  const stopDragging = () => {
    dragging = false;
    document.body.classList.remove("cursor-hover");
  };

  bfStage.addEventListener("pointerup", stopDragging);
  bfStage.addEventListener("pointercancel", stopDragging);
  bfStage.addEventListener("pointerleave", stopDragging);
}


/* -------------------------
   Stage Light
------------------------- */

const stageLight =
  document.querySelector(".stage-light");

if (bfStage && stageLight) {

  bfStage.addEventListener("pointermove", (event) => {

    if (dragging) return;

    const rect =
      bfStage.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) * 100;

    const y =
      ((event.clientY - rect.top) / rect.height) * 100;

    stageLight.style.left = `${x}%`;
    stageLight.style.top = `${y}%`;

    stageLight.style.transform =
      "translate(-50%, -50%)";
  });

}


/* -------------------------
   HUD Sliders
------------------------- */

const opacitySlider =
  document.getElementById("opacitySlider");

const opacityValue =
  document.getElementById("opacityValue");

opacitySlider?.addEventListener("input", () => {

  const value = opacitySlider.value;

  if (opacityValue) {
    opacityValue.textContent = `${value}%`;
  }

  if (clientDevice) {
    clientDevice.style.opacity =
      Number(value) / 100;
  }

});


const scaleSlider =
  document.getElementById("scaleSlider");

const scaleValue =
  document.getElementById("scaleValue");

scaleSlider?.addEventListener("input", () => {

  const value = Number(scaleSlider.value);

  if (scaleValue) {
    scaleValue.textContent = `${value}%`;
  }

  if (clientDevice) {

    const scale =
      value / 100;

    clientDevice.style.transform = `
      scale(${scale})
      rotateX(${rotationX}deg)
      rotateY(${rotationY}deg)
      rotateZ(-1deg)
    `;
  }

});


/* =========================
   NAV ACTIVE STATE
========================= */

const navLinks =
  document.querySelectorAll(".nav-links a");

const sections = [
  document.getElementById("bio"),
  document.getElementById("experience"),
  document.getElementById("projects")
].filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.style.color = "#777";
      });

      const active =
        document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );

      if (active) {
        active.style.color = "white";
      }

    });

  },
  {
    threshold: 0.45
  }
);

sections.forEach((section) => {
  navObserver.observe(section);
});


/* =========================
   PROJECT CARD TILT
========================= */

document.querySelectorAll(".project-card, .community-card, .social-card")
  .forEach((card) => {

    card.addEventListener("mousemove", (event) => {

      if (window.innerWidth < 700) return;

      const rect = card.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - .5;

      const y =
        (event.clientY - rect.top) / rect.height - .5;

      card.style.transform = `
        perspective(700px)
        rotateX(${y * -3}deg)
        rotateY(${x * 3}deg)
        translateY(-5px)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });

  });


/* =========================
   SMOOTH ANCHORS
========================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

  link.addEventListener("click", (event) => {

    const target =
      document.querySelector(link.getAttribute("href"));

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});


/* =========================
   INITIAL STATE
========================= */

activateTab("combat");
updateEnabledCount();
