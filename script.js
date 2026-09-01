/* =====================================================
   NxrDonut
   Main Website Script
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const intro = document.getElementById("intro");
const enterButton = document.getElementById("enter-button");

const audio = document.getElementById("background-music");

const musicToggle = document.getElementById("music-toggle");

const volume = document.getElementById("volume");
const volumeButton = document.getElementById("volume-button");

const viewsButton = document.getElementById("views-button");
const viewsPopup = document.getElementById("views-popup");

const cursorDot = document.getElementById("cursor-dot");
const cursorGlow = document.getElementById("cursor-glow");

const trails = [
    document.querySelector(".trail-1"),
    document.querySelector(".trail-2"),
    document.querySelector(".trail-3"),
    document.querySelector(".trail-4"),
    document.querySelector(".trail-5")
];

const waveform = document.getElementById("waveform");
const ctx = waveform.getContext("2d");


/* =====================================================
   MUSIC
===================================================== */

let audioContext = null;
let analyser = null;
let source = null;
let audioStarted = false;


/*
    Creates the Web Audio analyser only once.
*/

function setupAudioAnalyser() {

    if (audioContext) {
        return;
    }

    try {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        analyser =
            audioContext.createAnalyser();

        analyser.fftSize = 128;

        analyser.smoothingTimeConstant = 0.82;

        source =
            audioContext.createMediaElementSource(audio);

        source.connect(analyser);

        analyser.connect(audioContext.destination);

    } catch (error) {

        console.log(
            "Audio visualizer unavailable:",
            error
        );

    }
}


/*
    Start music.
*/

async function startMusic() {

    setupAudioAnalyser();

    if (audioContext) {

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

    }

    audio.volume =
        parseFloat(volume.value);

    try {

        await audio.play();

        audioStarted = true;

        musicToggle.textContent = "❚❚";

    } catch (error) {

        console.log(
            "Music could not start:",
            error
        );

    }
}


/*
    Pause music.
*/

function pauseMusic() {

    audio.pause();

    audioStarted = false;

    musicToggle.textContent = "▶";
}


/* =====================================================
   CLICK ANYWHERE INTRO
===================================================== */

let introRemoved = false;


async function enterExperience() {

    if (introRemoved) {
        return;
    }

    introRemoved = true;

    /*
        Start the audio BEFORE removing the intro.
        This keeps the click as a valid browser
        user interaction for autoplay.
    */

    await startMusic();

    intro.classList.add("hidden");

    document.body.style.overflowX = "hidden";
}


/*
    IMPORTANT:
    The entire intro is clickable.
*/

intro.addEventListener(
    "pointerdown",
    enterExperience,
    { once: true }
);


/*
    Also allow the actual button to work.
*/

enterButton.addEventListener(
    "pointerdown",
    function(event) {

        event.stopPropagation();

        enterExperience();

    },
    { once: true }
);


/* =====================================================
   MUSIC BUTTON
===================================================== */

musicToggle.addEventListener(
    "click",
    async function(event) {

        event.stopPropagation();

        if (audio.paused) {

            await startMusic();

        } else {

            pauseMusic();

        }

    }
);


/* =====================================================
   VOLUME
===================================================== */

audio.volume =
    parseFloat(volume.value);


volume.addEventListener(
    "input",
    function() {

        audio.volume =
            parseFloat(this.value);

        if (audio.volume === 0) {

            volumeButton.innerHTML = "×";

        } else {

            volumeButton.innerHTML = "♪";

        }

    }
);


volumeButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        if (audio.volume > 0) {

            audio.dataset.previousVolume =
                audio.volume;

            audio.volume = 0;

            volume.value = 0;

            volumeButton.innerHTML = "×";

        } else {

            const previous =
                parseFloat(
                    audio.dataset.previousVolume || "0.35"
                );

            audio.volume = previous;

            volume.value = previous;

            volumeButton.innerHTML = "♪";

        }

    }
);


/* =====================================================
   VIEWS POPUP
===================================================== */

viewsButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        viewsPopup.classList.toggle("show");

        setTimeout(
            function() {
                viewsPopup.classList.remove("show");
            },
            2500
        );

    }
);


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll("[data-scroll]")
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    const targetID =
                        this.dataset.scroll;

                    const target =
                        document.getElementById(targetID);

                    if (!target) {
                        return;
                    }

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );


/* =====================================================
   CURSOR
===================================================== */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let dotX = mouseX;
let dotY = mouseY;

let glowX = mouseX;
let glowY = mouseY;

const trailPositions =
    trails.map(
        function() {
            return {
                x: mouseX,
                y: mouseY
            };
        }
    );


document.addEventListener(
    "mousemove",
    function(event) {

        mouseX = event.clientX;
        mouseY = event.clientY;

    }
);


/*
    Smooth cursor animation.
*/

function animateCursor() {

    dotX +=
        (mouseX - dotX) * 0.32;

    dotY +=
        (mouseY - dotY) * 0.32;

    glowX +=
        (mouseX - glowX) * 0.12;

    glowY +=
        (mouseY - glowY) * 0.12;


    cursorDot.style.left =
        dotX + "px";

    cursorDot.style.top =
        dotY + "px";


    cursorGlow.style.left =
        glowX + "px";

    cursorGlow.style.top =
        glowY + "px";


    /*
        Motion-blur trail.
    */

    for (
        let i = 0;
        i < trailPositions.length;
        i++
    ) {

        const previous =
            i === 0
                ? {
                    x: dotX,
                    y: dotY
                }
                : trailPositions[i - 1];

        const position =
            trailPositions[i];

        position.x +=
            (previous.x - position.x) *
            (0.18 - i * 0.018);

        position.y +=
            (previous.y - position.y) *
            (0.18 - i * 0.018);

        trails[i].style.left =
            position.x + "px";

        trails[i].style.top =
            position.y + "px";

        trails[i].style.opacity =
            String(
                0.28 - i * 0.045
            );

    }


    requestAnimationFrame(
        animateCursor
    );
}

animateCursor();


/* =====================================================
   CURSOR HOVER EFFECT
===================================================== */

const interactiveElements =
    document.querySelectorAll(
        "a, button, input"
    );


interactiveElements.forEach(
    function(element) {

        element.addEventListener(
            "mouseenter",
            function() {

                cursorDot.style.width =
                    "12px";

                cursorDot.style.height =
                    "12px";

            }
        );


        element.addEventListener(
            "mouseleave",
            function() {

                cursorDot.style.width =
                    "7px";

                cursorDot.style.height =
                    "7px";

            }
        );

    }
);


/* =====================================================
   PARTICLES
===================================================== */

const particleContainer =
    document.getElementById("particles");


function createParticles() {

    const amount =
        window.innerWidth < 700
            ? 45
            : 80;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement("div");

        particle.className =
            "particle";


        const size =
            Math.random() * 2 + 1;

        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";


        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.top =
            Math.random() * 100 + "%";


        particle.style.animationDuration =
            (7 + Math.random() * 13) + "s";


        particle.style.animationDelay =
            (-Math.random() * 15) + "s";


        particleContainer.appendChild(
            particle
        );

    }

}

createParticles();


/* =====================================================
   AUDIO WAVEFORM
===================================================== */

function drawWaveform() {

    const width =
        waveform.width;

    const height =
        waveform.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
        If audio isn't running yet,
        draw a subtle idle waveform.
    */

    if (!analyser || !audioStarted) {

        ctx.beginPath();

        ctx.lineWidth = 1;

        ctx.strokeStyle =
            "rgba(255,255,255,0.16)";

        for (
            let x = 0;
            x < width;
            x += 5
        ) {

            const y =
                height / 2 +
                Math.sin(x * 0.08) * 3;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

        }

        ctx.stroke();

        requestAnimationFrame(
            drawWaveform
        );

        return;
    }


    const data =
        new Uint8Array(
            analyser.frequencyBinCount
        );


    analyser.getByteFrequencyData(
        data
    );


    const bars =
        34;

    const barWidth =
        width / bars;


    for (
        let i = 0;
        i < bars;
        i++
    ) {

        const dataIndex =
            Math.floor(
                i *
                data.length /
                bars
            );

        const value =
            data[dataIndex] / 255;


        const barHeight =
            Math.max(
                3,
                value * height * 0.8
            );


        const x =
            i * barWidth;

        const y =
            (height - barHeight) / 2;


        ctx.fillStyle =
            "rgba(255,255,255,0.7)";


        ctx.beginPath();

        ctx.roundRect(
            x,
            y,
            Math.max(2, barWidth - 3),
            barHeight,
            3
        );

        ctx.fill();

    }


    requestAnimationFrame(
        drawWaveform
    );

}

drawWaveform();


/* =====================================================
   SCROLL MOTION
===================================================== */

let scrollTimer;


window.addEventListener(
    "scroll",
    function() {

        document.body.classList.add(
            "scrolling"
        );


        clearTimeout(
            scrollTimer
        );


        scrollTimer =
            setTimeout(
                function() {

                    document.body.classList.remove(
                        "scrolling"
                    );

                },
                120
            );

    },
    { passive: true }
);


/* =====================================================
   PARALLAX
===================================================== */

let targetParallaxX = 0;
let targetParallaxY = 0;

let currentParallaxX = 0;
let currentParallaxY = 0;


document.addEventListener(
    "mousemove",
    function(event) {

        targetParallaxX =
            (event.clientX /
                window.innerWidth -
                0.5) * 5;

        targetParallaxY =
            (event.clientY /
                window.innerHeight -
                0.5) * 5;

    }
);


function animateParallax() {

    currentParallaxX +=
        (targetParallaxX -
            currentParallaxX) *
        0.04;

    currentParallaxY +=
        (targetParallaxY -
            currentParallaxY) *
        0.04;


    const avatar =
        document.querySelector(".avatar");

    if (avatar) {

        avatar.style.transform =
            `translate(
                ${currentParallaxX}px,
                ${currentParallaxY}px
            )`;

    }


    requestAnimationFrame(
        animateParallax
    );

}

animateParallax();


/* =====================================================
   PAGE LOAD
===================================================== */

window.addEventListener(
    "load",
    function() {

        /*
            Make sure audio starts muted/paused
            until the visitor clicks the intro.
        */

        audio.pause();

        audio.volume =
            parseFloat(volume.value);

    }
);
