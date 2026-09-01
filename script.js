document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
    ========================== */

    const intro = document.getElementById("intro");
    const enterButton = document.getElementById("enter-button");

    const music = document.getElementById("background-music");
    const musicToggle = document.getElementById("music-toggle");

    const volume = document.getElementById("volume");
    const volumeButton = document.getElementById("volume-button");

    const cursorDot = document.getElementById("cursor-dot");
    const cursorGlow = document.getElementById("cursor-glow");

    const trails = document.querySelectorAll(".cursor-trail");

    const viewsButton = document.getElementById("views-button");
    const viewsPopup = document.getElementById("views-popup");

    const navButtons =
        document.querySelectorAll(".nav-button");

    const waveform =
        document.getElementById("waveform");


    /* =========================
       INITIAL AUDIO
    ========================== */

    music.volume = 0.35;


    /* =========================
       ENTER EXPERIENCE
    ========================== */

    function enterExperience() {

        music.play()
            .then(() => {
                if (musicToggle) {
                    musicToggle.textContent = "Ⅱ";
                }
            })
            .catch(() => {
                // Browser may block autoplay.
                // The music button will still work.
            });

        intro.classList.add("hidden");
    }


    /*
     * The entire intro is clickable.
     */

    intro.addEventListener("click", (event) => {

        if (event.target.closest("a")) {
            return;
        }

        enterExperience();

    });


    /*
     * Explicit button listener as a backup.
     */

    enterButton.addEventListener("click", (event) => {

        event.stopPropagation();

        enterExperience();

    });


    /* =========================
       MUSIC TOGGLE
    ========================== */

    musicToggle.addEventListener("click", (event) => {

        event.stopPropagation();

        if (music.paused) {

            music.play()
                .then(() => {
                    musicToggle.textContent = "Ⅱ";
                })
                .catch(() => {});

        } else {

            music.pause();

            musicToggle.textContent = "▶";

        }

    });


    /* =========================
       AUTO LOOP FALLBACK
    ========================== */

    music.addEventListener("ended", () => {

        music.currentTime = 0;

        music.play()
            .then(() => {
                musicToggle.textContent = "Ⅱ";
            })
            .catch(() => {});

    });


    /* =========================
       VOLUME
    ========================== */

    volume.addEventListener("input", () => {

        music.volume = Number(volume.value);

    });


    volumeButton.addEventListener("click", () => {

        if (music.muted) {

            music.muted = false;

            volumeButton.innerHTML = "<span>♪</span>";

        } else {

            music.muted = true;

            volumeButton.innerHTML = "<span>×</span>";

        }

    });


    /* =========================
       NAVIGATION
    ========================== */

    navButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const targetId =
                button.dataset.scroll;

            const target =
                document.getElementById(targetId);

            if (!target) {
                return;
            }

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =========================
       VIEWS POPUP
    ========================== */

    if (viewsButton) {

        viewsButton.addEventListener("click", () => {

            viewsPopup.classList.add("show");

            clearTimeout(
                window.viewsPopupTimer
            );

            window.viewsPopupTimer =
                setTimeout(() => {

                    viewsPopup.classList.remove("show");

                }, 2500);

        });

    }


    /* =========================
       CURSOR
    ========================== */

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let dotX = mouseX;
    let dotY = mouseY;

    let glowX = mouseX;
    let glowY = mouseY;

    const trailPositions =
        Array.from(trails).map(() => ({
            x: mouseX,
            y: mouseY
        }));


    document.addEventListener("mousemove", (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

    });


    function animateCursor() {

        dotX += (mouseX - dotX) * 0.38;
        dotY += (mouseY - dotY) * 0.38;

        glowX += (mouseX - glowX) * 0.16;
        glowY += (mouseY - glowY) * 0.16;


        cursorDot.style.left =
            `${dotX}px`;

        cursorDot.style.top =
            `${dotY}px`;


        cursorGlow.style.left =
            `${glowX}px`;

        cursorGlow.style.top =
            `${glowY}px`;


        let previousX = mouseX;
        let previousY = mouseY;


        trails.forEach((trail, index) => {

            const position =
                trailPositions[index];

            const delay =
                0.20 + index * 0.045;

            position.x +=
                (previousX - position.x) * delay;

            position.y +=
                (previousY - position.y) * delay;


            trail.style.left =
                `${position.x}px`;

            trail.style.top =
                `${position.y}px`;

            trail.style.opacity =
                `${Math.max(
                    0.025,
                    0.13 - index * 0.018
                )}`;


            previousX = position.x;
            previousY = position.y;

        });


        requestAnimationFrame(
            animateCursor
        );

    }

    animateCursor();


    /* =========================
       PARTICLES
    ========================== */

    const particles =
        document.getElementById("particles");

    const particleCount =
        window.innerWidth < 700 ? 45 : 75;


    for (let i = 0; i < particleCount; i++) {

        const particle =
            document.createElement("div");

        particle.className =
            "particle";


        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${Math.random() * 100}%`;


        const size =
            Math.random() * 2 + 1;

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;


        particle.style.animationDuration =
            `${Math.random() * 12 + 8}s`;

        particle.style.animationDelay =
            `${Math.random() * -15}s`;


        particles.appendChild(
            particle
        );

    }


    /* =========================
       WAVEFORM
    ========================== */

    if (waveform) {

        const canvas =
            waveform;

        const ctx =
            canvas.getContext("2d");

        let phase = 0;


        function drawWave() {

            const width =
                canvas.width;

            const height =
                canvas.height;

            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            ctx.beginPath();


            for (let x = 0; x < width; x++) {

                const center =
                    height / 2;

                const wave =
                    Math.sin(
                        x * 0.08 +
                        phase
                    ) * 5;

                const second =
                    Math.sin(
                        x * 0.19 +
                        phase * 1.4
                    ) * 3;


                const y =
                    center +
                    wave +
                    second;


                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

            }


            ctx.strokeStyle =
                "rgba(255,255,255,.5)";

            ctx.lineWidth = 1.5;

            ctx.stroke();


            phase +=
                music.paused ? 0.01 : 0.055;


            requestAnimationFrame(
                drawWave
            );

        }


        drawWave();

    }


    /* =========================
       PREVENT CONTEXT MENU
       ON CUSTOM CURSOR AREA
    ========================== */

    document.addEventListener(
        "contextmenu",
        () => {},
        false
    );

});
