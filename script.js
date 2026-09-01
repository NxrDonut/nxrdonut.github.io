/* =========================
   ELEMENTS
   ========================= */

const intro =
    document.getElementById("intro");

const enter =
    document.getElementById("enter");

const video =
    document.getElementById("background-video");

const musicToggle =
    document.getElementById("music-toggle");

const volume =
    document.getElementById("volume");

const volumeIcon =
    document.getElementById("volume-icon");

const profileCard =
    document.getElementById("profile-card");

const cursorGlow =
    document.querySelector(".cursor-glow");

const trails = [
    document.querySelector(".trail-1"),
    document.querySelector(".trail-2"),
    document.querySelector(".trail-3"),
    document.querySelector(".trail-4"),
    document.querySelector(".trail-5")
];

const viewsButton =
    document.getElementById("views-button");

const viewsPopup =
    document.getElementById("views-popup");

const viewsDisplay =
    document.getElementById("views");

const popupViews =
    document.getElementById("popup-views");

const discordLink =
    document.getElementById("discord-link");

const discordText =
    document.getElementById("discord-text");

const particlesContainer =
    document.getElementById("particles");


/* =========================
   SETTINGS
   ========================= */

let entered = false;

let mouseX = 0;
let mouseY = 0;

video.volume = 0.35;

video.pause();


/* =========================
   FIXED VIEW COUNT
   ========================= */

const views = 1284;

viewsDisplay.textContent =
    views.toLocaleString();

popupViews.textContent =
    views.toLocaleString();


/* =========================
   CREATE PARTICLES
   ========================= */

function createParticles() {

    if (!particlesContainer) {
        return;
    }

    const amount =
        window.innerWidth < 600
            ? 20
            : 35;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement("div");


        particle.className =
            "particle";


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${100 + Math.random() * 20}%`;


        particle.style.animationDuration =
            `${12 + Math.random() * 18}s`;


        particle.style.animationDelay =
            `${Math.random() * 15}s`;


        const size =
            1 + Math.random() * 2;


        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;


        particlesContainer.appendChild(
            particle
        );

    }

}

createParticles();


/* =========================
   INITIAL VOLUME
   ========================= */

function updateVolumeIcon() {

    const currentVolume =
        Number(volume.value);


    if (currentVolume === 0) {

        volumeIcon.textContent =
            "🔇";

    }

    else if (
        currentVolume < 0.5
    ) {

        volumeIcon.textContent =
            "🔉";

    }

    else {

        volumeIcon.textContent =
            "🔊";

    }

}

updateVolumeIcon();


/* =========================
   ENTER WEBSITE
   ========================= */

async function enterWebsite() {

    if (entered) {
        return;
    }

    entered = true;


    document.body.classList.add(
        "entered"
    );


    intro.classList.add(
        "hidden"
    );


    /*
        The click on the intro gives
        the browser permission to start
        video + audio.
    */

    video.muted = false;

    video.volume =
        Number(volume.value);


    try {

        await video.play();

        musicToggle.textContent =
            "❚❚";

    }

    catch (error) {

        console.log(
            "Normal playback failed:",
            error
        );


        /*
            Some browsers may reject
            unmuted playback.

            Start the video muted as
            a fallback.
        */

        try {

            video.muted = true;

            await video.play();

            musicToggle.textContent =
                "❚❚";

        }

        catch (secondError) {

            console.log(
                "Video could not play:",
                secondError
            );

        }

    }

}


/* =========================
   CLICK ANYWHERE
   ========================= */

intro.addEventListener(
    "click",
    enterWebsite
);


/* =========================
   KEYBOARD ENTER
   ========================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            !entered &&
            (
                event.code === "Enter" ||
                event.code === "Space"
            )
        ) {

            enterWebsite();

        }

    }
);


/* =========================
   MUSIC PLAY / PAUSE
   ========================= */

musicToggle.addEventListener(
    "click",
    async () => {

        if (video.paused) {

            try {

                video.muted = false;

                await video.play();

                musicToggle.textContent =
                    "❚❚";

            }

            catch (error) {

                console.log(
                    "Playback error:",
                    error
                );

            }

        }

        else {

            video.pause();

            musicToggle.textContent =
                "▶";

        }

    }
);


/* =========================
   VOLUME
   ========================= */

volume.addEventListener(
    "input",
    () => {

        video.volume =
            Number(volume.value);

        updateVolumeIcon();

    }
);


/* =========================
   MOUSE POSITION
   ========================= */

document.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;


        /*
            Mouse glow
        */

        if (cursorGlow) {

            cursorGlow.style.left =
                `${mouseX}px`;

            cursorGlow.style.top =
                `${mouseY}px`;

        }


        /*
            Profile parallax
        */

        if (
            entered &&
            profileCard
        ) {

            const x =
                (
                    mouseX /
                    window.innerWidth
                ) - 0.5;


            const y =
                (
                    mouseY /
                    window.innerHeight
                ) - 0.5;


            const rotateX =
                y * -6;


            const rotateY =
                x * 6;


            profileCard.style.transform =
                `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-2px)
                `;

        }

    }
);


/* =========================
   SMOOTH MOUSE TRAIL
   ========================= */

const trailPositions =
    trails.map(
        () => ({
            x: 0,
            y: 0
        })
    );


function animateTrail() {

    trails.forEach(
        (trail, index) => {

            if (!trail) {
                return;
            }


            const target =
                index === 0
                    ? {
                        x: mouseX,
                        y: mouseY
                    }
                    : trailPositions[
                        index - 1
                    ];


            trailPositions[index].x +=
                (
                    target.x -
                    trailPositions[index].x
                ) * 0.20;


            trailPositions[index].y +=
                (
                    target.y -
                    trailPositions[index].y
                ) * 0.20;


            trail.style.left =
                `${trailPositions[index].x}px`;


            trail.style.top =
                `${trailPositions[index].y}px`;


            const distance =
                Math.hypot(
                    target.x -
                    trailPositions[index].x,

                    target.y -
                    trailPositions[index].y
                );


            const scale =
                Math.min(
                    1.4,
                    0.5 +
                    distance * 0.018
                );


            trail.style.transform =
                `
                translate(-50%, -50%)
                scale(${scale})
                `;

        }
    );


    requestAnimationFrame(
        animateTrail
    );

}

animateTrail();


/* =========================
   RESET PARALLAX
   ========================= */

document.addEventListener(
    "mouseleave",
    () => {

        if (!profileCard) {
            return;
        }


        profileCard.style.transform =
            `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            translateY(0)
            `;

    }
);


/* =========================
   DISCORD COPY
   ========================= */

discordLink.addEventListener(
    "click",
    async (event) => {

        event.preventDefault();


        try {

            await navigator.clipboard
                .writeText("nxrdonut");


            const original =
                discordText.textContent;


            discordText.textContent =
                "Copied!";


            setTimeout(
                () => {

                    discordText.textContent =
                        original;

                },
                1500
            );

        }

        catch (error) {

            alert(
                "Discord username: nxrdonut"
            );

        }

    }
);


/* =========================
   ANIMATED PAGE TITLE
   ========================= */

const titleFrames = [
    "nxrdonut",
    "nxrdonut.",
    "nxrdonut..",
    "nxrdonut..."
];

let titleIndex = 0;


setInterval(
    () => {

        titleIndex =
            (
                titleIndex + 1
            ) %
            titleFrames.length;


        document.title =
            titleFrames[titleIndex];

    },
    700
);


/* =========================
   SPACEBAR MUSIC CONTROL
   ========================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code === "Space" &&
            entered &&
            document.activeElement.tagName !==
                "INPUT"
        ) {

            event.preventDefault();

            musicToggle.click();

        }

    }
);


/* =========================
   RESIZE PARTICLES
   ========================= */

window.addEventListener(
    "resize",
    () => {

        if (
            particlesContainer &&
            particlesContainer.children.length === 0
        ) {

            createParticles();

        }

    }
);
