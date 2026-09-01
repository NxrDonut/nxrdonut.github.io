/* =========================================
   NxrDonut - Main Script
========================================= */

const intro = document.getElementById("intro");
const video = document.getElementById("background-video");

const musicToggle = document.getElementById("music-toggle");
const volume = document.getElementById("volume");
const volumeIcon = document.getElementById("volume-icon");

const viewsButton = document.getElementById("views-button");
const viewsPopup = document.getElementById("views-popup");

const discordLink = document.getElementById("discord-link");
const discordText = document.getElementById("discord-text");

const experienceButton =
    document.getElementById("experience-button");

const experienceSection =
    document.getElementById("experience-section");

const closeExperience =
    document.getElementById("close-experience");

const profileCard =
    document.getElementById("profile-card");

const cursorGlow =
    document.getElementById("cursor-glow");

const cursorDot =
    document.querySelector(".cursor-dot");

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

const DISCORD_USERNAME = "nxrdonut";

const PROFILE_VIEWS = 1284;


/* =========================================
   STATE
========================================= */

let entered = false;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;


/* =========================================
   VIDEO
========================================= */

if (video) {
    video.muted = true;
    video.volume = 0.35;
    video.pause();
}


/* =========================================
   ENTER WEBSITE
========================================= */

async function enterWebsite() {

    if (entered) {
        return;
    }

    entered = true;

    console.log("Entering NxrDonut website...");

    /*
        Start the visual transition first.
    */

    document.body.classList.add("entered");

    /*
        Hide CLICK ANYWHERE.
    */

    if (intro) {
        intro.classList.add("hidden");
    }

    /*
        Start video and audio.
    */

    if (video) {

        video.muted = false;

        video.volume = volume
            ? Number(volume.value)
            : 0.35;

        try {

            await video.play();

            if (musicToggle) {
                musicToggle.textContent = "❚❚";
            }

            console.log("Video started.");

        } catch (error) {

            console.log(
                "Audio could not start. Starting video muted."
            );

            /*
                Fallback for browsers that block
                unmuted playback.
            */

            video.muted = true;

            try {

                await video.play();

                if (musicToggle) {
                    musicToggle.textContent = "❚❚";
                }

            } catch (videoError) {

                console.log(
                    "Video could not start:",
                    videoError
                );

            }
        }
    }
}


/* =========================================
   CLICK ANYWHERE
========================================= */

/*
    IMPORTANT:
    The intro itself covers the whole screen.

    Clicking anywhere on it enters the website.
*/

if (intro) {

    intro.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            enterWebsite();

        }
    );

}


/* =========================================
   EXTRA CLICK FALLBACK
========================================= */

document.addEventListener(
    "click",
    function(event) {

        if (
            !entered &&
            intro &&
            !intro.classList.contains("hidden")
        ) {

            enterWebsite();

        }

    },
    true
);


/* =========================================
   VOLUME
========================================= */

function updateVolumeIcon() {

    if (!volumeIcon || !volume) {
        return;
    }

    const value =
        Number(volume.value);

    if (value === 0) {

        volumeIcon.textContent = "🔇";

    } else if (value < 0.5) {

        volumeIcon.textContent = "🔉";

    } else {

        volumeIcon.textContent = "🔊";

    }
}


if (volume) {

    volume.addEventListener(
        "input",
        function() {

            if (!video) {
                return;
            }

            const value =
                Number(volume.value);

            video.volume = value;

            video.muted = value === 0;

            updateVolumeIcon();

        }
    );

}

updateVolumeIcon();


/* =========================================
   PLAY / PAUSE
========================================= */

if (musicToggle) {

    musicToggle.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

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

                } catch (error) {

                    console.log(error);

                }

            } else {

                video.pause();

                musicToggle.textContent =
                    "▶";

            }

        }
    );

}


/* =========================================
   VIEWS
========================================= */

if (
    viewsButton &&
    viewsPopup
) {

    viewsButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            viewsPopup.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================================
   DISCORD COPY
========================================= */

if (discordLink) {

    discordLink.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            event.stopPropagation();

            try {

                await navigator.clipboard.writeText(
                    DISCORD_USERNAME
                );

                if (discordText) {

                    discordText.textContent =
                        "Copied!";

                    setTimeout(
                        function() {

                            discordText.textContent =
                                "Discord";

                        },
                        1500
                    );

                }

            } catch (error) {

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

if (experienceButton) {

    experienceButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            if (experienceSection) {

                experienceSection.classList.add(
                    "open"
                );

            }

        }
    );

}


if (closeExperience) {

    closeExperience.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            if (experienceSection) {

                experienceSection.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* =========================================
   ESCAPE CLOSES EXPERIENCE
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

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
   CURSOR POSITION
========================================= */

document.addEventListener(
    "mousemove",
    function(event) {

        mouseX = event.clientX;
        mouseY = event.clientY;


        /*
            Main glowing area.
        */

        if (cursorGlow) {

            cursorGlow.style.left =
                mouseX + "px";

            cursorGlow.style.top =
                mouseY + "px";

        }


        /*
            Small bright cursor point.
        */

        if (cursorDot) {

            cursorDot.style.left =
                mouseX + "px";

            cursorDot.style.top =
                mouseY + "px";

        }


        /*
            Profile parallax.
        */

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


            profileCard.style.transform = `
                perspective(1000px)
                rotateX(${y * -4}deg)
                rotateY(${x * 4}deg)
            `;

        }

    }
);


/* =========================================
   SMOOTH MOTION-BLUR TRAIL
========================================= */

const trailPositions =
    trails.map(function() {

        return {
            x: mouseX,
            y: mouseY
        };

    });


function animateCursor() {

    trails.forEach(
        function(trail, index) {

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


            /*
                Each trail point follows
                the one before it.
            */

            const speed =
                0.28 -
                index * 0.035;


            trailPositions[index].x +=
                (
                    target.x -
                    trailPositions[index].x
                ) * speed;


            trailPositions[index].y +=
                (
                    target.y -
                    trailPositions[index].y
                ) * speed;


            trail.style.left =
                trailPositions[index].x +
                "px";


            trail.style.top =
                trailPositions[index].y +
                "px";

        }
    );


    requestAnimationFrame(
        animateCursor
    );

}

animateCursor();


/* =========================================
   PARTICLES
========================================= */

const particles =
    document.getElementById("particles");


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
            document.createElement("div");


        particle.className =
            "particle";


        particle.style.left =
            Math.random() * 100 +
            "%";


        particle.style.top =
            (
                100 +
                Math.random() * 30
            ) +
            "%";


        particle.style.animationDuration =
            (
                12 +
                Math.random() * 18
            ) +
            "s";


        particle.style.animationDelay =
            Math.random() * 15 +
            "s";


        particles.appendChild(
            particle
        );

    }

}


/* =========================================
   ANIMATED TITLE
========================================= */

const titleFrames = [
    "NxrDonut",
    "NxrDonut.",
    "NxrDonut..",
    "NxrDonut..."
];

let titleIndex = 0;


setInterval(
    function() {

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


/* =========================================
   SPACEBAR
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

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
