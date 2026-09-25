/* =========================================
   ELEMENTS
========================================= */

const body = document.body;

const intro = document.getElementById("intro");
const enterButton = document.getElementById("enter-button");

const music = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");
const volume = document.getElementById("volume");
const volumeButton = document.getElementById("volume-button");

const waveform = document.getElementById("waveform");

const cursorDot = document.querySelector(".cursor-dot");
const cursorGlow = document.querySelector(".cursor-glow");

const trails = [
    document.querySelector(".trail-1"),
    document.querySelector(".trail-2"),
    document.querySelector(".trail-3"),
    document.querySelector(".trail-4")
];

const blackfish = document.getElementById("blackfish-device");


/* =========================================
   INTRO
========================================= */

let entered = false;

function enterSite() {

    if (entered) return;

    entered = true;

    intro.classList.add("hidden");
    body.classList.add("entered");

    startMusic();

    setTimeout(() => {
        intro.style.display = "none";
    }, 1100);
}

intro.addEventListener("click", enterSite);
enterButton.addEventListener("click", enterSite);


/* =========================================
   MUSIC
========================================= */

music.volume = 0.35;

async function startMusic() {

    try {
        await music.play();

        musicToggle.textContent = "Ⅱ";

    } catch {
        musicToggle.textContent = "▶";
    }
}

musicToggle.addEventListener("click", async () => {

    if (music.paused) {

        try {
            await music.play();
            musicToggle.textContent = "Ⅱ";
        } catch {}

    } else {

        music.pause();
        musicToggle.textContent = "▶";

    }
});


volume.addEventListener("input", () => {

    music.volume = Number(volume.value);

});


volumeButton.addEventListener("click", () => {

    if (music.volume > 0) {

        music.dataset.previousVolume = music.volume;
        music.volume = 0;
        volume.value = 0;

    } else {

        const previous =
            Number(music.dataset.previousVolume || 0.35);

        music.volume = previous;
        volume.value = previous;

    }

});


music.addEventListener("ended", () => {

    music.currentTime = 0;
    music.play().catch(() => {});

});


/* =========================================
   WAVEFORM
========================================= */

const ctx = waveform.getContext("2d");

let audioContext;
let analyser;
let source;
let audioData;

function setupAudioAnalyser() {

    if (audioContext) return;

    audioContext =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

    analyser = audioContext.createAnalyser();

    analyser.fftSize = 64;

    audioData = new Uint8Array(
        analyser.frequencyBinCount
    );

    source = audioContext.createMediaElementSource(music);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
}


music.addEventListener("play", () => {

    try {

        setupAudioAnalyser();

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

    } catch {}

});


function drawWaveform() {

    requestAnimationFrame(drawWaveform);

    const width = waveform.width;
    const height = waveform.height;

    ctx.clearRect(0, 0, width, height);

    let values;

    if (analyser) {

        analyser.getByteFrequencyData(audioData);
        values = audioData;

    } else {

        values = new Uint8Array(32);

        const time = Date.now() / 280;

        for (let i = 0; i < values.length; i++) {
            values[i] =
                20 +
                Math.sin(time + i * 0.55) * 10;
        }
    }


    const bars = 32;
    const gap = 4;
    const barWidth =
        (width - gap * (bars - 1)) / bars;

    for (let i = 0; i < bars; i++) {

        const value =
            values[i] || 0;

        const normalized =
            Math.max(0.08, value / 255);

        const barHeight =
            normalized * height * 0.75;

        const x =
            i * (barWidth + gap);

        const y =
            height / 2 - barHeight / 2;

        ctx.fillStyle =
            `rgba(255,255,255,${0.14 + normalized * 0.42})`;

        ctx.beginPath();

        ctx.roundRect(
            x,
            y,
            barWidth,
            barHeight,
            4
        );

        ctx.fill();
    }
}

drawWaveform();


/* =========================================
   PARTICLES
========================================= */

const particleContainer =
    document.getElementById("particles");

const particleCount =
    window.innerWidth < 700 ? 25 : 55;

for (let i = 0; i < particleCount; i++) {

    const particle =
        document.createElement("span");

    particle.className = "particle";

    particle.style.left =
        `${Math.random() * 100}%`;

    particle.style.top =
        `${Math.random() * 100}%`;

    particle.style.animationDuration =
        `${8 + Math.random() * 15}s`;

    particle.style.animationDelay =
        `${Math.random() * -15}s`;

    particle.style.opacity =
        `${0.05 + Math.random() * 0.2}`;

    particleContainer.appendChild(particle);
}


/* =========================================
   CURSOR
========================================= */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let dotX = mouseX;
let dotY = mouseY;

let glowX = mouseX;
let glowY = mouseY;

const trailPositions =
    trails.map(() => ({
        x: mouseX,
        y: mouseY
    }));


window.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

});


function cursorLoop() {

    dotX += (mouseX - dotX) * 0.30;
    dotY += (mouseY - dotY) * 0.30;

    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;


    let previousX = mouseX;
    let previousY = mouseY;

    trails.forEach((trail, index) => {

        const position =
            trailPositions[index];

        position.x +=
            (previousX - position.x) *
            (0.18 - index * 0.025);

        position.y +=
            (previousY - position.y) *
            (0.18 - index * 0.025);

        trail.style.left =
            `${position.x}px`;

        trail.style.top =
            `${position.y}px`;

        previousX = position.x;
        previousY = position.y;

    });


    requestAnimationFrame(cursorLoop);
}

cursorLoop();


/* =========================================
   3D TILT
========================================= */

function setupTilt(element) {

    element.addEventListener("mousemove", (event) => {

        const rect =
            element.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;

        const strength =
            Number(
                element.dataset.tiltStrength || 6
            );

        const rotateX =
            ((y - centerY) / centerY) * -strength;

        const rotateY =
            ((x - centerX) / centerX) * strength;

        element.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateZ(10px)`;

    });


    element.addEventListener("mouseleave", () => {

        element.style.transform =
            "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";

    });

}


document
    .querySelectorAll(".tilt-object")
    .forEach(setupTilt);


/* =========================================
   EXPERIENCE / PROJECT TILT
========================================= */

document
    .querySelectorAll(".tilt-card")
    .forEach((card) => {

        card.addEventListener("mousemove", (event) => {

            if (window.innerWidth < 700) return;

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const rotateY =
                ((x / rect.width) - 0.5) * 4;

            const rotateX =
                ((y / rect.height) - 0.5) * -4;

            card.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-3px)`;

        });


        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });


/* =========================================
   MAGNETIC BUTTONS
========================================= */

document
    .querySelectorAll(".magnetic")
    .forEach((element) => {

        element.addEventListener("mousemove", (event) => {

            if (window.innerWidth < 700) return;

            const rect =
                element.getBoundingClientRect();

            const x =
                event.clientX - rect.left - rect.width / 2;

            const y =
                event.clientY - rect.top - rect.height / 2;

            element.style.transform =
                `translate(${x * 0.12}px, ${y * 0.12}px)`;

        });


        element.addEventListener("mouseleave", () => {

            element.style.transform = "";

        });

    });


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(".reveal");

const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach((element) => {
    observer.observe(element);
});


/* =========================================
   NAVIGATION
========================================= */

const navButtons =
    document.querySelectorAll(".nav-button");

navButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const target =
            document.getElementById(
                button.dataset.scroll
            );

        if (!target) return;

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================
   ACTIVE NAV
========================================= */

const sections = [
    document.getElementById("bio-section"),
    document.getElementById("experience-section"),
    document.getElementById("projects-section")
];

function updateNavigation() {

    const scrollPosition =
        window.scrollY + window.innerHeight * 0.35;

    let current =
        sections[0];

    sections.forEach((section) => {

        if (
            section &&
            scrollPosition >= section.offsetTop
        ) {
            current = section;
        }

    });

    navButtons.forEach((button) => {

        button.classList.toggle(
            "active",
            button.dataset.scroll === current.id
        );

    });

}

window.addEventListener(
    "scroll",
    updateNavigation,
    { passive: true }
);


/* =========================================
   BLACKFISH 3D INTERACTION
========================================= */

let deviceRotationX = -3;
let deviceRotationY = 8;

let dragging = false;

let previousPointerX = 0;
let previousPointerY = 0;

if (blackfish) {

    blackfish.addEventListener(
        "pointerdown",
        (event) => {

            dragging = true;

            previousPointerX =
                event.clientX;

            previousPointerY =
                event.clientY;

            blackfish.setPointerCapture(
                event.pointerId
            );

        }
    );


    blackfish.addEventListener(
        "pointermove",
        (event) => {

            if (!dragging) return;

            const deltaX =
                event.clientX -
                previousPointerX;

            const deltaY =
                event.clientY -
                previousPointerY;

            deviceRotationY +=
                deltaX * 0.35;

            deviceRotationX -=
                deltaY * 0.25;

            deviceRotationX =
                Math.max(
                    -22,
                    Math.min(
                        22,
                        deviceRotationX
                    )
                );

            previousPointerX =
                event.clientX;

            previousPointerY =
                event.clientY;

        }
    );


    blackfish.addEventListener(
        "pointerup",
        () => {
            dragging = false;
        }
    );


    blackfish.addEventListener(
        "pointercancel",
        () => {
            dragging = false;
        }
    );


    blackfish.addEventListener(
        "pointermove",
        (event) => {

            if (dragging) return;

            const rect =
                blackfish.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            const targetY =
                x * 8;

            const targetX =
                y * -6;

            deviceRotationY +=
                (targetY - deviceRotationY) * 0.03;

            deviceRotationX +=
                (targetX - deviceRotationX) * 0.03;

        }
    );

}


function animateBlackfish() {

    if (blackfish) {

        blackfish.style.transform =
            `rotateX(${deviceRotationX}deg)
             rotateY(${deviceRotationY}deg)`;

    }

    requestAnimationFrame(
        animateBlackfish
    );
}

animateBlackfish();


/* =========================================
   BLACKFISH TABS
========================================= */

const clientTabs =
    document.querySelectorAll(".client-tab");

const clientPanels =
    document.querySelectorAll(".client-panel");


clientTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        const target =
            tab.dataset.panel;

        clientTabs.forEach((item) => {
            item.classList.remove("active");
        });

        clientPanels.forEach((panel) => {
            panel.classList.remove("active");
        });

        tab.classList.add("active");

        const panel =
            document.querySelector(
                `[data-panel-content="${target}"]`
            );

        if (panel) {
            panel.classList.add("active");
        }

    });

});


/* =========================================
   BLACKFISH PROJECT BUTTON
========================================= */

const blackfishButton =
    document.querySelector(".blackfish-open");

if (blackfishButton) {

    blackfishButton.addEventListener(
        "click",
        () => {

            document
                .getElementById("blackfish-section")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}


/* =========================================
   PARALLAX LIGHT
========================================= */

const blackfishLight =
    document.querySelector(".blackfish-light");

document.addEventListener(
    "mousemove",
    (event) => {

        if (!blackfishLight) return;

        const x =
            (event.clientX /
                window.innerWidth -
                0.5) *
            80;

        const y =
            (event.clientY /
                window.innerHeight -
                0.5) *
            80;

        blackfishLight.style.transform =
            `translate(${x}px, ${y}px)`;

    }
);


/* =========================================
   PAGE LOAD
========================================= */

window.addEventListener(
    "load",
    () => {

        updateNavigation();

    }
);
