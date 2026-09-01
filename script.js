/* =========================================
   NxrDonut - Profile Script
========================================= */

const intro = document.getElementById("intro");
const video = document.getElementById("background-video");
const musicToggle = document.getElementById("music-toggle");
const volume = document.getElementById("volume");
const volumeIcon = document.getElementById("volume-icon");
const profileCard = document.getElementById("profile-card");

let entered = false;

/* =========================================
   CURSOR
========================================= */

const cursorGlow = document.querySelector(".cursor-glow");

const trails = [
    document.querySelector(".trail-1"),
    document.querySelector(".trail-2"),
    document.querySelector(".trail-3"),
    document.querySelector(".trail-4"),
    document.querySelector(".trail-5"),
    document.querySelector(".trail-6")
];

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

const trailPositions = trails.map(() => ({
    x: mouseX,
    y: mouseY
}));


/* =========================================
   MOUSE MOVEMENT
========================================= */

document.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

    if (cursorGlow) {
        cursorGlow.style.left = `${mouseX}px`;
        cursorGlow.style.top = `${mouseY}px`;
    }

    /* Profile parallax */

    if (
        entered &&
        profileCard &&
        window.innerWidth > 700
    ) {

        const x =
            mouseX / window.innerWidth - 0.5;

        const y =
            mouseY / window.innerHeight - 0.5;

        profileCard.style.transform = `
            perspective(1000px)
            rotateX(${y * -4}deg)
            rotateY(${x * 4}deg)
        `;
    }

});


/* =========================================
   SMOOTH MOTION-BLUR TRAIL
========================================= */

function animateCursor() {

    trails.forEach((trail, index) => {

        if (!trail) return;

        const target =
            index === 0
                ? { x: mouseX, y: mouseY }
                : trailPositions[index - 1];

        const speed =
            0.28 - index * 0.035;

        trailPositions[index].x +=
            (target.x - trailPositions[index].x)
            * speed;

        trailPositions[index].y +=
            (target.y - trailPositions[index].y)
            * speed;

        trail.style.left =
            `${trailPositions[index].x}px`;

        trail.style.top =
            `${trailPositions[index].y}px`;

    });

    requestAnimationFrame(animateCursor);
}

animateCursor();


/* =========================================
   ENTER WEBSITE
========================================= */

async function enterWebsite(event) {

    if (entered) return;

    entered = true;

    document.body.classList.add("entered");

    if (intro) {
        intro.classList.add("hidden");
    }

    /* Start background video */

    if (video) {

        video.muted = false;

        if (volume) {
            video.volume =
                Number(volume.value);
        }

        try {

            await video.play();

            if (musicToggle) {
                musicToggle.textContent = "❚❚";
            }

        } catch (error) {

            /*
             * If the browser blocks audio,
             * start the video muted.
             */

            video.muted = true;

            try {
                await video.play();
            } catch (e) {
                console.log(
                    "Video could not start:",
                    e
                );
            }

        }
    }

}


/* =========================================
   CLICK ANYWHERE
========================================= */

/*
   Use document instead of only #intro.

   This means clicking anywhere on the
   screen will start the website while
   the intro is visible.
*/

document.addEventListener(
    "click",
    (event) => {

        if (!entered) {

            enterWebsite(event);

        }

    },
    {
        once: false,
        capture: true
    }
);


/* =========================================
   VOLUME
========================================= */

if (volume) {

    volume.addEventListener(
        "input",
        () => {

            if (!video) return;

            const value =
                Number(volume.value);

            video.volume = value;

            video.muted =
                value === 0;

            updateVolumeIcon();

        }
    );

}


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

updateVolumeIcon();


/* =========================================
   MUSIC BUTTON
========================================= */

if (musicToggle) {

    musicToggle.addEventListener(
        "click",
        async (event) => {

            /*
             * Don't let the global click
             * handler interfere with the
             * music button.
             */

            event.stopPropagation();

            if (!video) return;

            if (video.paused) {

                try {

                    video.muted = false;

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
   TITLE ANIMATION
========================================= */

const titleFrames = [
    "NxrDonut",
    "NxrDonut.",
    "NxrDonut..",
    "NxrDonut..."
];

let titleIndex = 0;

setInterval(() => {

    titleIndex =
        (titleIndex + 1) %
        titleFrames.length;

    document.title =
        titleFrames[titleIndex];

}, 700);


/* =========================================
   SPACEBAR MUSIC
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

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
```
