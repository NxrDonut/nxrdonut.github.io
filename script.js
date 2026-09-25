/* =========================================================
   INTRO
========================================================= */

const intro = document.getElementById("intro");

function closeIntro() {
  if (!intro) return;

  intro.classList.add("hidden");

  document.body.style.overflow = "";
}

document.addEventListener("click", () => {
  closeIntro();
}, { once: true });

document.addEventListener("keydown", () => {
  closeIntro();
}, { once: true });


/* =========================================================
   CURSOR
========================================================= */

const cursor = document.getElementById("cursor");
const cursorDot = document.getElementById("cursorDot");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let cursorX = mouseX;
let cursorY = mouseY;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;

  if (cursor) {
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();

document.querySelectorAll("a, button").forEach((element) => {
  element.addEventListener("mouseenter", () => {
    document.body.classList.add("cursor-hover");
  });

  element.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-hover");
  });
});


/* =========================================================
   MUSIC
========================================================= */

const audio = document.getElementById("audio");
const musicPlay = document.getElementById("musicPlay");
const musicPlayer = document.querySelector(".music-player");
const musicTime = document.getElementById("musicTime");

let playing = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

musicPlay?.addEventListener("click", async (event) => {
  event.stopPropagation();

  if (!audio) return;

  try {
    if (audio.paused) {
      await audio.play();

      playing = true;

      musicPlayer?.classList.add("playing");

      musicPlay.querySelector(".play-icon").textContent = "Ⅱ";
    } else {
      audio.pause();

      playing = false;

      musicPlayer?.classList.remove("playing");

      musicPlay.querySelector(".play-icon").textContent = "▶";
    }
  } catch (error) {
    console.log("Audio could not be played.", error);
  }
});

audio?.addEventListener("timeupdate", () => {
  if (musicTime) {
    musicTime.textContent = formatTime(audio.currentTime);
  }
});


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

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
    threshold: 0.12
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});


/* =========================================================
   PFP PARALLAX
========================================================= */

const pfp = document.getElementById("pfp");

document.addEventListener("mousemove", (event) => {

  if (!pfp) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 8;
  const y = (event.clientY / window.innerHeight - 0.5) * 8;

  pfp.style.transform = `
    translate(${x}px, ${y}px)
    scale(1.04)
  `;
});


/* =========================================================
   SHOWCASE
========================================================= */

const showcase = document.getElementById("showcase");
const openShowcase = document.getElementById("openShowcase");
const closeShowcase = document.getElementById("closeShowcase");
const showcaseBackdrop = document.querySelector(".showcase-backdrop");

function openShowcaseModal() {
  if (!showcase) return;

  showcase.classList.add("active");

  document.body.style.overflow = "hidden";
}

function closeShowcaseModal() {
  if (!showcase) return;

  showcase.classList.remove("active");

  document.body.style.overflow = "";
}

openShowcase?.addEventListener("click", (event) => {
  event.stopPropagation();

  openShowcaseModal();
});

closeShowcase?.addEventListener("click", (event) => {
  event.stopPropagation();

  closeShowcaseModal();
});

showcaseBackdrop?.addEventListener("click", () => {
  closeShowcaseModal();
});

document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {
    closeShowcaseModal();
  }

});


/* =========================================================
   SHOWCASE TABS
========================================================= */

const showcaseTabs = document.querySelectorAll(".showcase-tab");
const modulePanels = document.querySelectorAll(".module-panel");

showcaseTabs.forEach((tab) => {

  tab.addEventListener("click", (event) => {

    event.stopPropagation();

    const target = tab.dataset.tab;

    showcaseTabs.forEach((item) => {
      item.classList.remove("active");
    });

    modulePanels.forEach((panel) => {
      panel.classList.remove("active");
    });

    tab.classList.add("active");

    const targetPanel = document.querySelector(
      `.module-panel[data-panel="${target}"]`
    );

    targetPanel?.classList.add("active");

  });

});


/* =========================================================
   MODULE TOGGLES
========================================================= */

const toggles = document.querySelectorAll(".toggle");

function updateModuleCounts() {

  const activeModules = document.querySelectorAll(
    ".toggle.active"
  ).length;

  const totalElement = document.getElementById("activeModules");

  if (totalElement) {
    totalElement.textContent = activeModules;
  }

  const combatCount = document.getElementById("combatCount");
  const visualsCount = document.getElementById("visualsCount");
  const hudCount = document.getElementById("hudCount");

  if (combatCount) {
    combatCount.textContent =
      document.querySelectorAll(
        '[data-module="Aim Assist"].active, [data-module="Click Visualizer"].active, [data-module="Target HUD"].active'
      ).length;
  }

  if (visualsCount) {
    visualsCount.textContent =
      document.querySelectorAll(
        '[data-module="ESP Preview"].active, [data-module="Tracers"].active, [data-module="Motion Blur"].active'
      ).length;
  }

  if (hudCount) {
    hudCount.textContent =
      document.querySelectorAll(
        '[data-module="Array List"].active, [data-module="Watermark"].active, [data-module="Coordinates"].active'
      ).length;
  }
}

toggles.forEach((toggle) => {

  toggle.addEventListener("click", (event) => {

    event.stopPropagation();

    toggle.classList.toggle("active");

    updateModuleCounts();

  });

});


/* =========================================================
   SETTINGS
========================================================= */

const opacitySlider = document.getElementById("opacitySlider");
const opacityValue = document.getElementById("opacityValue");

const scaleSlider = document.getElementById("scaleSlider");
const scaleValue = document.getElementById("scaleValue");

opacitySlider?.addEventListener("input", () => {

  const value = opacitySlider.value;

  if (opacityValue) {
    opacityValue.textContent = `${value}%`;
  }

  const showcaseWindow =
    document.querySelector(".showcase-window");

  if (showcaseWindow) {
    showcaseWindow.style.opacity = value / 100;
  }

});

scaleSlider?.addEventListener("input", () => {

  const value = scaleSlider.value;

  if (scaleValue) {
    scaleValue.textContent = `${value}%`;
  }

  const showcaseWindow =
    document.querySelector(".showcase-window");

  if (showcaseWindow) {
    showcaseWindow.style.transform =
      `perspective(1200px) scale(${value / 100})`;
  }

});


/* =========================================================
   RESET SHOWCASE
========================================================= */

const resetShowcase =
  document.getElementById("resetShowcase");

resetShowcase?.addEventListener("click", (event) => {

  event.stopPropagation();

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

  const showcaseWindow =
    document.querySelector(".showcase-window");

  if (showcaseWindow) {
    showcaseWindow.style.opacity = "1";
    showcaseWindow.style.transform = "";
  }

  updateModuleCounts();

});


/* =========================================================
   VIEW MORE
========================================================= */

const viewMore = document.getElementById("viewMore");

viewMore?.addEventListener("click", (event) => {

  event.stopPropagation();

  const panels = [
    ...document.querySelectorAll(".module-panel")
  ];

  const activePanel =
    panels.find((panel) =>
      panel.classList.contains("active")
    );

  if (!activePanel) return;

  const modules =
    activePanel.querySelectorAll(".module");

  modules.forEach((module, index) => {

    module.animate(
      [
        {
          opacity: .35,
          transform: "translateX(0)"
        },
        {
          opacity: 1,
          transform: "translateX(5px)"
        },
        {
          opacity: 1,
          transform: "translateX(0)"
        }
      ],
      {
        duration: 550,
        delay: index * 60,
        easing: "cubic-bezier(.16,1,.3,1)"
      }
    );

  });

});


/* =========================================================
   CARD TILT
========================================================= */

const tiltCards = document.querySelectorAll(
  ".project-card, .experience-card, .social-card, .community-card"
);

tiltCards.forEach((card) => {

  card.addEventListener("mousemove", (event) => {

    if (window.innerWidth < 800) return;

    const rect = card.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `
      perspective(800px)
      rotateX(${y * -2}deg)
      rotateY(${x * 2}deg)
      translateY(-4px)
    `;

  });

  card.addEventListener("mouseleave", () => {

    card.style.transform = "";

  });

});


/* =========================================================
   NAV ACTIVE STATE
========================================================= */

const navLinks = document.querySelectorAll(".nav-links a");

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
        link.style.color = "#626262";
      });

      const activeLink =
        document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );

      if (activeLink) {
        activeLink.style.color = "white";
      }

    });

  },
  {
    rootMargin: "-35% 0px -55% 0px"
  }
);

sections.forEach((section) => {
  navObserver.observe(section);
});


/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

  link.addEventListener("click", (event) => {

    const targetId =
      link.getAttribute("href");

    const target =
      document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});


/* =========================================================
   INITIAL STATE
========================================================= */

updateModuleCounts();
