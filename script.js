/* =========================================
   NxrDonut Website
========================================= */


/* =========================================
   ELEMENTS
========================================= */

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

const viewsButton =
    document.getElementById("views-button");

const viewsPopup =
    document.getElementById("views-popup");

const discordLink =
    document.getElementById("discord-link");

const discordText =
    document.getElementById("discord-text");

const experienceButton =
    document.getElementById("experience-button");

const experienceSection =
    document.getElementById("experience-section");

const closeExperience =
    document.getElementById("close-experience");

const profileCard =
    document.getElementById("profile-card");

const cursorGlow =
    document.querySelector(".cursor-glow");

const trails = [
    document.querySelector(".trail-1"),
    document.querySelector(".trail-2"),
    document.querySelector(".trail-3"),
    document.querySelector(".trail-4"),
    document.querySelector(".trail-5"),
    document.querySelector(".trail-6")
];


/* =========================================
   SETTINGS
========================================= */

const DISCORD_USERNAME =
    "nxrdonut";

const DISCORD_ID =
    "873534867210637333";

const VIEWS =
    1284;


/* =========================================
   STATE
========================================= */

let entered = false;

let mouseX =
    window.innerWidth / 2;

let mouseY =
    window.innerHeight / 2;


/* =========================================
   VIDEO SETUP
========================================= */

if (video) {

    /*
     * The video is deliberately muted
     * before the user clicks.
     */

    video.muted = true;

    video.volume = 0.35;

    video.pause();

}


/* =========================================
   ENTER WEBSITE
========================================= */

async function enterSite() {

    if (entered) {
        return;
    }

    entered = true;

    document.body.classList.add(
        "entered"
    );


    /* Hide intro */

    if (intro) {

        intro.classList.add(
            "hidden"
        );

    }


    /* Start video + sound */

    if (video) {

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
                "Audio autoplay failed."
            );

            /*
             * The click still starts
             * the video if audio is blocked.
             */

            video.muted = true;

            try {

                await video.play();

            }

            catch (videoError) {

                console.log(
                    "Video failed:",
                    videoError
                );

            }

        }

    }

}


/*
 * Expose function globally so the
 * HTML onclick can always find it.
 */

window.enterSite =
    enterSite;


/* =========================================
   CLICK ANYWHERE FALLBACK
========================================= */

document.addEventListener(
    "click",
    (event) => {

        if (!entered) {

            enterSite();

        }

    },
    true
);


/* =========================================
   VOLUME
========================================= */

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


updateVolumeIcon();


/* =========================================
   MUSIC BUTTON
========================================= */

if (musicToggle) {

    musicToggle.addEventListener(
        "click",
        async (event) => {

            event.stopPropagation();


            if (!video) {
                return;
            }


            if (video.paused) {

                video.muted = false;

                try {

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


/* =========================================
   CURSOR
========================================= */

document.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;


        if (cursorGlow) {

            cursorGlow.style.left =
                mouseX + "px";

            cursorGlow.style.top =
                mouseY + "px";

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
                rotateX(${y * -4}deg)
                rotateY(${x * 4}deg)
                `;

        }

    }
);


/* =========================================
   CURSOR MOTION BLUR
========================================= */

const positions =
    trails.map(() => ({
        x: mouseX,
        y: mouseY
    }));


function animateCursor() {

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
                    : positions[
                        index - 1
                    ];


            const speed =
                0.3 -
                index * 0.035;


            positions[index].x +=
                (
                    target.x -
                    positions[index].x
                ) * speed;


            positions[index].y +=
                (
                    target.y -
                    positions[index].y
                ) * speed;


            trail.style.left =
                positions[index].x + "px";

            trail.style.top =
                positions[index].y + "px";

        }
    );


    requestAnimationFrame(
        animateCursor
    );

}


animateCursor();


/* =========================================
   VIEWS
========================================= */

if (viewsButton &&
    viewsPopup) {

    viewsButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            viewsPopup.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================================
   DISCORD
========================================= */

if (discordLink) {

    discordLink.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();

            event.stopPropagation();


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
                    "Discord: " +
                    DISCORD_USERNAME
                );

            }

        }
    );

}


/* =========================================
   EXPERIENCE
========================================= */

if (experienceButton &&
    experienceSection) {

    experienceButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            experienceSection.classList.add(
                "open"
            );

        }
    );

}


if (closeExperience &&
    experienceSection) {

    closeExperience.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            experienceSection.classList.remove(
                "open"
            );

        }
    );

}


/* =========================================
   CLOSE EXPERIENCE WITH ESCAPE
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            experienceSection
        ) {

            experienceSection.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================
   ANIMATED TITLE
========================================= */

const titles = [
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
            titles.length;


        document.title =
            titles[titleIndex];

    },
    700
);


/* =========================================
   PARTICLES
========================================= */

const particles =
    document.getElementById(
        "particles"
    );


if (particles) {

    const amount =
        window.innerWidth < 600
            ? 25
            : 45;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "particle";


        particle.style.left =
            Math.random() * 100 +
            "%";


        particle.style.top =
            (
                100 +
                Math.random() * 30
            ) + "%";


        particle.style.animationDuration =
            (
                10 +
                Math.random() * 20
            ) + "s";


        particle.style.animationDelay =
            Math.random() * 15 +
            "s";


        particles.appendChild(
            particle
        );

    }

}


/* =========================================
   SPACEBAR MUSIC
========================================= */

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

            if (musicToggle) {

                musicToggle.click();

            }

        }

    }
);


/* =========================================
   DEBUG
========================================= */

console.log(
    "NxrDonut profile loaded."
);

console.log(
    "Discord ID:",
    DISCORD_ID
);
```
