/* ==========================================
   NxrDonut
   Main Website Script
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const intro =
    document.getElementById("intro");

const video =
    document.getElementById(
        "background-video"
    );

const volume =
    document.getElementById("volume");

const volumeIcon =
    document.getElementById("volume-icon");

const musicToggle =
    document.getElementById("music-toggle");

const viewsButton =
    document.getElementById("views-button");

const viewsPopup =
    document.getElementById("views-popup");

const discordLink =
    document.getElementById("discord-link");

const discordText =
    document.getElementById("discord-text");

const experienceButton =
    document.getElementById(
        "experience-button"
    );

const experienceSection =
    document.getElementById(
        "experience-section"
    );

const closeExperience =
    document.getElementById(
        "close-experience"
    );

const profileCard =
    document.getElementById(
        "profile-card"
    );

const cursorGlow =
    document.getElementById(
        "cursor-glow"
    );

const cursorDot =
    document.querySelector(
        ".cursor-dot"
    );

const trails = [
    document.querySelector(".trail-1"),
    document.querySelector(".trail-2"),
    document.querySelector(".trail-3"),
    document.querySelector(".trail-4"),
    document.querySelector(".trail-5"),
    document.querySelector(".trail-6")
];


/* ==========================================
   SETTINGS
========================================== */

const DISCORD_USERNAME =
    "nxrdonut";

const DISCORD_ID =
    "873534867210637333";

const PROFILE_VIEWS =
    1284;


/* ==========================================
   ENTER WEBSITE
========================================== */

let entered = false;


/*
 * IMPORTANT:
 * The ENTIRE #intro element is clickable.
 */

async function enterWebsite() {

    if (entered) {
        return;
    }

    entered = true;


    console.log(
        "Entering NxrDonut..."
    );


    /*
     * Start the video immediately
     * after the user's click.
     */

    if (video) {

        video.volume =
            volume
                ? Number(volume.value)
                : 0.35;

        video.muted = false;


        try {

            await video.play();

            console.log(
                "Video + audio started."
            );

        }

        catch (error) {

            console.log(
                "Browser blocked audio:",
                error
            );


            /*
             * Fallback:
             * video still plays.
             */

            video.muted = true;

            try {

                await video.play();

            }

            catch (videoError) {

                console.log(
                    "Video could not play:",
                    videoError
                );

            }

        }

    }


    /*
     * Activate the website.
     */

    document.body.classList.add(
        "entered"
    );


    /*
     * Fade out intro.
     */

    if (intro) {

        intro.classList.add(
            "hidden"
        );

    }

}


/* ==========================================
   FULL SCREEN CLICK
========================================== */

if (intro) {

    intro.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            enterWebsite();

        }
    );

}


/*
 * Extra safety:
 * clicking anywhere before entering
 * also activates the website.
 */

document.addEventListener(
    "click",
    function(event) {

        if (
            !entered &&
            intro &&
            !intro.classList.contains(
                "hidden"
            )
        ) {

            enterWebsite();

        }

    },
    true
);


/* ==========================================
   VOLUME
========================================== */

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
        function() {

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


/* ==========================================
   MUSIC BUTTON
========================================== */

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


/* ==========================================
   VIDEO STATE
========================================== */

if (video) {

    video.addEventListener(
        "play",
        function() {

            if (musicToggle) {

                musicToggle.textContent =
                    "❚❚";

            }

        }
    );


    video.addEventListener(
        "pause",
        function() {

            if (musicToggle) {

                musicToggle.textContent =
                    "▶";

            }

        }
    );

}


/* ==========================================
   VIEWS
========================================== */

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


/* ==========================================
   DISCORD
========================================== */

if (discordLink) {

    discordLink.addEventListener(
        "click",
        async function(event) {

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
                    function() {

                        if (discordText) {

                            discordText.textContent =
                                "Discord";

                        }

                    },
                    1500
                );

            }

            catch (error) {

                if (discordText) {

                    discordText.textContent =
                        DISCORD_USERNAME;

                }

            }

        }
    );

}


/* ==========================================
   EXPERIENCE
========================================== */

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


/* ==========================================
   ESCAPE
========================================== */

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


/* ==========================================
   MOUSE
========================================== */

let mouseX =
    window.innerWidth / 2;

let mouseY =
    window.innerHeight / 2;


const trailPositions =
    trails.map(function() {

        return {
            x: mouseX,
            y: mouseY
        };

    });


document.addEventListener(
    "mousemove",
    function(event) {

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;


        /*
         * Main glow.
         */

        if (cursorGlow) {

            cursorGlow.style.left =
                mouseX + "px";

            cursorGlow.style.top =
                mouseY + "px";

        }


        /*
         * Main cursor.
         */

        if (cursorDot) {

            cursorDot.style.left =
                mouseX + "px";

            cursorDot.style.top =
                mouseY + "px";

        }


        /*
         * Profile parallax.
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


            profileCard.style.transform =
                `
                perspective(1000px)
                rotateX(${y * -3}deg)
                rotateY(${x * 3}deg)
                translateZ(0)
                `;

        }

    }
);


/* ==========================================
   SMOOTH CURSOR TRAIL
========================================== */

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


            const speed =
                0.30 -
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


/* ==========================================
   PARTICLES
========================================== */

const particleContainer =
    document.getElementById(
        "particles"
    );


if (particleContainer) {

    const particleCount =
        window.innerWidth < 600
            ? 25
            : 50;


    for (
        let i = 0;
        i < particleCount;
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


        particleContainer.appendChild(
            particle
        );

    }

}


/* ==========================================
   ANIMATED TITLE
========================================== */

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


/* ==========================================
   CONSOLE
========================================== */

console.log(
    "NxrDonut profile loaded."
);

console.log(
    "Discord:",
    DISCORD_USERNAME
);

console.log(
    "Discord ID:",
    DISCORD_ID
);

console.log(
    "Views:",
    PROFILE_VIEWS
);
