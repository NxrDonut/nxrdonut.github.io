/* =========================
   NxrDonut PROFILE
   ========================= */


/* =========================
   ELEMENTS
   ========================= */

const intro =
    document.getElementById("intro");

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

const particlesContainer =
    document.getElementById("particles");


/* NAVIGATION */

const bioButton =
    document.getElementById("bio-button");

const experienceButton =
    document.getElementById("experience-button");

const bioSection =
    document.getElementById("bio-section");

const experienceSection =
    document.getElementById("experience-section");


/* VIEWS */

const viewsButton =
    document.getElementById("views-button");

const viewsPopup =
    document.getElementById("views-popup");

const viewsDisplay =
    document.getElementById("views");

const popupViews =
    document.getElementById("popup-views");


/* DISCORD */

const discordLink =
    document.getElementById("discord-link");

const discordText =
    document.getElementById("discord-text");


/* =========================
   SETTINGS
   ========================= */

const PROFILE_NAME =
    "NxrDonut";

const DISCORD_USERNAME =
    "nxrdonut";

const DISCORD_ID =
    "873534867210637333";

const VIEWS =
    1284;


/* =========================
   STATE
   ========================= */

let entered = false;

let mouseX = 0;

let mouseY = 0;


/* =========================
   VIDEO
   ========================= */

if (video) {

    video.volume = 0.35;

    video.pause();

}


/* =========================
   VIEWS
   ========================= */

if (viewsDisplay) {

    viewsDisplay.textContent =
        VIEWS.toLocaleString();

}

if (popupViews) {

    popupViews.textContent =
        VIEWS.toLocaleString();

}


/* =========================
   PARTICLES
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


        particlesContainer.appendChild(
            particle
        );

    }

}

createParticles();


/* =========================
   VOLUME ICON
   ========================= */

function updateVolumeIcon() {

    if (!volume ||
        !volumeIcon) {
        return;
    }


    const value =
        Number(volume.value);


    if (value === 0) {

        volumeIcon.textContent =
            "🔇";

    }

    else if (value < 0.5) {

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


    if (intro) {

        intro.classList.add(
            "hidden"
        );

    }


    if (!video) {
        return;
    }


    video.muted = false;


    if (volume) {

        video.volume =
            Number(volume.value);

    }


    try {

        await video.play();


        if (musicToggle) {

            musicToggle.textContent =
                "❚❚";

        }

    }

    catch (error) {

        console.log(
            "Audio playback blocked:",
            error
        );


        /*
         * If the browser blocks
         * autoplay with sound,
         * start the video muted.
         */

        video.muted = true;


        try {

            await video.play();

        }

        catch (videoError) {

            console.log(
                "Video playback failed:",
                videoError
            );

        }

    }

}


if (intro) {

    intro.addEventListener(
        "click",
        enterWebsite
    );

}


/* =========================
   MUSIC BUTTON
   ========================= */

if (musicToggle) {

    musicToggle.addEventListener(
        "click",
        async () => {

            if (!video) {
                return;
            }


            if (video.paused) {

                try {

                    video.muted = false;

                    await video.play();


                    musicToggle.textContent =
                        "❚❚";

                }

                catch (error) {

                    console.log(error);

                }

            }

            else {

                video.pause();


                musicToggle.textContent =
                    "▶";

            }

        }
    );

}


/* =========================
   VOLUME CONTROL
   ========================= */

if (volume) {

    volume.addEventListener(
        "input",
        () => {

            if (!video) {
                return;
            }


            const value =
                Number(volume.value);


            video.volume =
                value;


            video.muted =
                value === 0;


            updateVolumeIcon();

        }
    );

}


/* =========================
   BIO BUTTON
   ========================= */

function showBio() {

    if (!bioSection ||
        !experienceSection) {
        return;
    }


    bioSection.classList.add(
        "active-section"
    );


    experienceSection.classList.remove(
        "active-section"
    );


    if (bioButton) {

        bioButton.classList.add(
            "active"
        );

    }


    if (experienceButton) {

        experienceButton.classList.remove(
            "active"
        );

    }

}


/* =========================
   EXPERIENCE BUTTON
   ========================= */

function showExperience() {

    if (!bioSection ||
        !experienceSection) {
        return;
    }


    experienceSection.classList.add(
        "active-section"
    );


    bioSection.classList.remove(
        "active-section"
    );


    if (experienceButton) {

        experienceButton.classList.add(
            "active"
        );

    }


    if (bioButton) {

        bioButton.classList.remove(
            "active"
        );

    }

}


if (bioButton) {

    bioButton.addEventListener(
        "click",
        showBio
    );

}


if (experienceButton) {

    experienceButton.addEventListener(
        "click",
        showExperience
    );

}


/* =========================
   VIEWS POPUP
   ========================= */

if (viewsButton &&
    viewsPopup) {

    viewsButton.addEventListener(
        "click",
        () => {

            viewsPopup.classList.toggle(
                "open"
            );

        }
    );

}


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


        /* Cursor glow */

        if (cursorGlow) {

            cursorGlow.style.left =
                `${mouseX}px`;

            cursorGlow.style.top =
                `${mouseY}px`;

        }


        /* Profile parallax */

        if (
            entered &&
            profileCard &&
            window.innerWidth > 700
        ) {

            const x =
                mouseX /
                window.innerWidth -
                0.5;


            const y =
                mouseY /
                window.innerHeight -
                0.5;


            profileCard.style.transform =
                `
                perspective(1000px)
                rotateX(${y * -6}deg)
                rotateY(${x * 6}deg)
                `;

        }

    }
);


/* =========================
   MOUSE MOTION BLUR
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
                ) * 0.2;


            trailPositions[index].y +=
                (
                    target.y -
                    trailPositions[index].y
                ) * 0.2;


            trail.style.left =
                `${trailPositions[index].x}px`;


            trail.style.top =
                `${trailPositions[index].y}px`;

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

        if (profileCard) {

            profileCard.style.transform =
                `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                `;

        }

    }
);


/* =========================
   DISCORD
   ========================= */

if (discordLink) {

    discordLink.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();


            try {

                await navigator.clipboard
                    .writeText(
                        DISCORD_USERNAME
                    );


                if (discordText) {

                    discordText.textContent =
                        "Copied!";

                }


                setTimeout(
                    () => {

                        if (discordText) {

                            discordText.textContent =
                                "Discord";

                        }

                    },
                    1500
                );

            }

            catch (error) {

                alert(
                    `Discord: ${DISCORD_USERNAME}`
                );

            }

        }
    );

}


/* =========================
   ANIMATED TITLE
   ========================= */

const titleFrames = [
    "NxrDonut",
    "NxrDonut.",
    "NxrDonut..",
    "NxrDonut..."
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
   SPACEBAR MUSIC
   ========================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code === "Space" &&
            entered &&
            document.activeElement.tagName !==
                "INPUT" &&
            musicToggle
        ) {

            event.preventDefault();

            musicToggle.click();

        }

    }
);


/* =========================
   INITIAL STATE
   ========================= */

showBio();


/* =========================
   CONSOLE
   ========================= */

console.log(
    `${PROFILE_NAME} profile loaded.`
);

console.log(
    `Discord ID: ${DISCORD_ID}`
);
```
