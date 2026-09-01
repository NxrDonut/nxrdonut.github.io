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

    const waveform = document.getElementById("waveform");

    const cursorDot = document.getElementById("cursor-dot");
    const cursorGlow = document.getElementById("cursor-glow");

    const trails = [
        document.querySelector(".trail-1"),
        document.querySelector(".trail-2"),
        document.querySelector(".trail-3"),
        document.querySelector(".trail-4"),
        document.querySelector(".trail-5")
    ];

    const particles = document.getElementById("particles");

    const viewsButton = document.getElementById("views-button");
    const viewsPopup = document.getElementById("views-popup");


    /* =========================
       MUSIC
    ========================== */

    let musicStarted = false;

    music.volume = Number(volume?.value || 0.35);

    async function startMusic() {

        if (!music) return;

        try {
            await music.play();

            musicStarted = true;

            if (musicToggle) {
                musicToggle.textContent = "Ⅱ";
            }

        } catch (error) {

            /*
             * Browser autoplay protection may prevent
             * playback until the user interacts.
             * The click-anywhere screen counts as
             * that interaction.
             */

            musicStarted = false;
        }
    }


    /* =========================
       CLICK ANYWHERE
    ========================== */

    function enterExperience() {

        if (!intro) return;

        intro.classList.add("hidden");

        startMusic();

        document.body.classList.add("entered");

        setTimeout(() => {
            intro.style.display = "none";
        }, 850);
    }


    /*
     * Clicking absolutely anywhere on the intro
     * enters the website.
     */

    if (intro) {
        intro.addEventListener("click", enterExperience);
    }

    if (enterButton) {
        enterButton.addEventListener("click", (event) => {
            event.stopPropagation();

            enterExperience();
        });
    }


    /* =========================
       MUSIC BUTTON
    ========================== */

    if (musicToggle && music) {

        musicToggle.addEventListener("click", async () => {

            if (music.paused) {

                await startMusic();

            } else {

                music.pause();

                musicToggle.textContent = "▶";
            }

        });

    }


    /* =========================
       VOLUME
    ========================== */

    if (volume && music) {

        volume.addEventListener("input", () => {

            music.volume = Number(volume.value);

        });

    }


    if (volumeButton && music) {

        volumeButton.addEventListener("click", () => {

            if (music.volume > 0) {

                music.dataset.previousVolume =
                    music.volume;

                music.volume = 0;

                if (volume) {
                    volume.value = 0;
                }

                volumeButton.querySelector("span").textContent = "×";

            } else {

                const previous =
                    Number(
                        music.dataset.previousVolume || 0.35
                    );

                music.volume = previous;

                if (volume) {
                    volume.value = previous;
                }

                volumeButton.querySelector("span").textContent = "♪";
            }

        });

    }


    /* =========================
       NAVIGATION
    ========================== */

    document
        .querySelectorAll(".nav-button[data-scroll]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const targetId =
                    button.dataset.scroll;

                const target =
                    document.getElementById(targetId);

                if (!target) return;

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


    /* =========================
       VIEWS POPUP
    ========================== */

    if (viewsButton && viewsPopup) {

        viewsButton.addEventListener("click", () => {

            viewsPopup.classList.add("show");

            clearTimeout(
                window.viewsPopupTimeout
            );

            window.viewsPopupTimeout =
                setTimeout(() => {

                    viewsPopup.classList.remove("show");

                }, 2200);

        });

    }


    /* =========================
       PARTICLES
    ========================== */

    if (particles) {

        const particleCount =
            window.innerWidth < 700
                ? 35
                : 65;

        for (let i = 0; i < particleCount; i++) {

            const particle =
                document.createElement("div");

            particle.className = "particle";

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
                `${8 + Math.random() * 15}s`;

            particle.style.animationDelay =
                `${Math.random() * -15}s`;

            particles.appendChild(particle);
        }

    }


    /* =========================
       CUSTOM CURSOR
    ========================== */

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


    document.addEventListener("mousemove", (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

    });


    function animateCursor() {

        /*
         * Small amount of smoothing gives
         * the cursor a clean motion-blur feel.
         */

        dotX +=
            (mouseX - dotX) * 0.42;

        dotY +=
            (mouseY - dotY) * 0.42;

        glowX +=
            (mouseX - glowX) * 0.12;

        glowY +=
            (mouseY - glowY) * 0.12;


        if (cursorDot) {

            cursorDot.style.left =
                `${dotX}px`;

            cursorDot.style.top =
                `${dotY}px`;

        }


        if (cursorGlow) {

            cursorGlow.style.left =
                `${glowX}px`;

            cursorGlow.style.top =
                `${glowY}px`;

        }


        /*
         * Motion trail.
         */

        trails.forEach((trail, index) => {

            if (!trail) return;

            const previous =
                index === 0
                    ? { x: mouseX, y: mouseY }
                    : trailPositions[index - 1];

            const position =
                trailPositions[index];

            position.x +=
                (previous.x - position.x)
                * (0.22 - index * 0.018);

            position.y +=
                (previous.y - position.y)
                * (0.22 - index * 0.018);

            trail.style.left =
                `${position.x}px`;

            trail.style.top =
                `${position.y}px`;

            trail.style.opacity =
                `${0.22 - index * 0.035}`;

            trail.style.transform =
                `translate(-50%, -50%) scale(${1 - index * .08})`;

        });


        requestAnimationFrame(animateCursor);
    }

    animateCursor();


    /* =========================
       CLICK EFFECT
    ========================== */

    document.addEventListener("mousedown", () => {

        if (cursorDot) {

            cursorDot.style.width = "11px";
            cursorDot.style.height = "11px";

        }

    });


    document.addEventListener("mouseup", () => {

        if (cursorDot) {

            cursorDot.style.width = "7px";
            cursorDot.style.height = "7px";

        }

    });


    /* =========================
       SCROLL MOTION
    ========================== */

    let scrollTimeout;

    window.addEventListener(
        "scroll",
        () => {

            document.body.classList.add("scrolling");

            clearTimeout(scrollTimeout);

            scrollTimeout =
                setTimeout(() => {

                    document.body.classList.remove("scrolling");

                }, 90);

        },
        { passive: true }
    );


    /* =========================
       MUSIC WAVEFORM
    ========================== */

    if (waveform) {

        const ctx =
            waveform.getContext("2d");

        let animationFrame;


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


            const center =
                height / 2;

            const bars = 42;

            for (let i = 0; i < bars; i++) {

                const x =
                    (i / bars) * width;

                let barHeight;


                if (
                    music &&
                    !music.paused
                ) {

                    const wave =
                        Math.sin(
                            (i * .65) +
                            performance.now() / 180
                        );

                    barHeight =
                        5 +
                        Math.abs(wave) *
                        (10 + Math.random() * 12);

                } else {

                    barHeight =
                        4 +
                        Math.sin(i * .8) * 2;

                }


                ctx.beginPath();

                ctx.roundRect(
                    x,
                    center - barHeight / 2,
                    3,
                    barHeight,
                    2
                );

                ctx.fillStyle =
                    "rgba(255,255,255,.48)";

                ctx.fill();
            }


            animationFrame =
                requestAnimationFrame(
                    drawWaveform
                );
        }


        drawWaveform();

    }


    /* =========================
       RESIZE
    ========================== */

    window.addEventListener(
        "resize",
        () => {

            if (!particles) return;

            particles.innerHTML = "";

            const particleCount =
                window.innerWidth < 700
                    ? 35
                    : 65;

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
                    `${8 + Math.random() * 15}s`;

                particle.style.animationDelay =
                    `${Math.random() * -15}s`;

                particles.appendChild(
                    particle
                );

            }

        }
    );

});
