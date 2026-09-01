/* =========================================
   NxrDonut
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const intro =
    document.getElementById("intro");

const music =
    document.getElementById("background-music");

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
    document.getElementById("experience-button");

const homeButton =
    document.getElementById("home-button");

const heroContent =
    document.getElementById("hero-content");

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
   STATE
========================================= */

let entered = false;

let mouseX =
    window.innerWidth / 2;

let mouseY =
    window.innerHeight / 2;


/* =========================================
   ENTER WEBSITE
========================================= */

async function enterWebsite() {

    if (entered) {
        return;
    }

    entered = true;


    if (intro) {
        intro.classList.add("hidden");
    }


    document.body.classList.add("entered");


    if (music) {

        music.volume =
            volume
                ? Number(volume.value)
                : 0.35;


        try {

            await music.play();

            if (musicToggle) {
                musicToggle.textContent =
                    "❚❚";
            }

        } catch (error) {

            console.log(
                "Music playback blocked:",
                error
            );

        }

    }

}


/* =========================================
   CLICK ANYWHERE
========================================= */

document.addEventListener(
    "click",
    function () {

        if (!entered) {
            enterWebsite();
        }

    },
    true
);


/* =========================================
   TOUCH
========================================= */

document.addEventListener(
    "touchstart",
    function () {

        if (!entered) {
            enterWebsite();
        }

    },
    {
        passive: true
    }
);


/* =========================================
   EXPERIENCE NAVIGATION
========================================= */

if (experienceButton) {

    experienceButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            if (!entered) {
                enterWebsite();
            }


            const experience =
                document.getElementById(
                    "experience"
                );


            if (experience) {

                setTimeout(
                    function () {

                        experience.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    },
                    150
                );

            }

        }
    );

}


/* =========================================
   HOME NAVIGATION
========================================= */

if (homeButton) {

    homeButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            const home =
                document.getElementById(
                    "home"
                );


            if (home) {

                home.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}


/* =========================================
   VOLUME
========================================= */

function updateVolumeIcon() {

    if (
        !volumeIcon ||
        !volume
    ) {
        return;
    }


    const value =
        Number(volume.value);


    if (value === 0) {

        volumeIcon.textContent =
            "🔇";

    } else if (value < 0.5) {

        volumeIcon.textContent =
            "🔉";

    } else {

        volumeIcon.textContent =
            "🔊";

    }

}


if (volume) {

    volume.addEventListener(
        "input",
        function () {

            if (!music) {
                return;
            }


            music.volume =
                Number(this.value);


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
        async function (event) {

            event.preventDefault();

            event.stopPropagation();


            if (!music) {
                return;
            }


            if (music.paused) {

                try {

                    await music.play();

                    musicToggle.textContent =
                        "❚❚";

                } catch (error) {

                    console.log(error);

                }

            } else {

                music.pause();

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
        function (event) {

            event.preventDefault();

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
        async function (event) {

            event.preventDefault();

            event.stopPropagation();


            const username =
                "nxrdonut";


            try {

                await navigator.clipboard.writeText(
                    username
                );


                if (discordText) {

                    discordText.textContent =
                        "Copied!";


                    setTimeout(
                        function () {

                            discordText.textContent =
                                "Discord";

                        },
                        1500
                    );

                }

            } catch (error) {

                alert(
                    "Discord: nxrdonut"
                );

            }

        }
    );

}


/* =========================================
   MOUSE
========================================= */

document.addEventListener(
    "mousemove",
    function (event) {

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


        if (cursorDot) {

            cursorDot.style.left =
                mouseX + "px";

            cursorDot.style.top =
                mouseY + "px";

        }


        /* PROFILE PARALLAX */

        if (
            heroContent &&
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


            heroContent.style.transform = `
                perspective(1200px)
                rotateX(${y * -3}deg)
                rotateY(${x * 3}deg)
            `;

        }

    }
);


/* =========================================
   CURSOR TRAIL
========================================= */

const trailPositions =
    trails.map(
        function () {

            return {
                x: mouseX,
                y: mouseY
            };

        }
    );


function animateCursor() {

    trails.forEach(
        function (trail, index) {

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

const particleContainer =
    document.getElementById(
        "particles"
    );


if (particleContainer) {

    const amount =
        window.innerWidth < 600
            ? 25
            : 55;


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
            ) +
            "%";


        particle.style.animationDuration =
            (
                12 +
                Math.random() * 18
            ) +
            "s";


        particle.style.animationDelay =
            (
                Math.random() * 18
            ) +
            "s";


        particle.style.transform =
            `scale(${
                .5 +
                Math.random() * 1.5
            })`;


        particleContainer.appendChild(
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
    function () {

        titleIndex =
            (
                titleIndex + 1
            ) %
            titleFrames.length;


        document.title =
            titleFrames[titleIndex];

    },
    800
);


/* =========================================
   SPACEBAR MUSIC
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.code === "Space" &&
            entered &&
            document.activeElement.tagName !== "INPUT"
        ) {

            event.preventDefault();


            if (musicToggle) {
                musicToggle.click();
            }

        }

    }
);


/* =========================================
   RESET PARALLAX
========================================= */

document.addEventListener(
    "mouseleave",
    function () {

        if (heroContent) {

            heroContent.style.transform =
                "perspective(1200px) rotateX(0deg) rotateY(0deg)";

        }

    }
);
