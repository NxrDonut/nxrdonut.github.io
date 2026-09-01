```javascript
/* =========================
   ELEMENTS
   ========================= */

const intro =
    document.getElementById("intro");

const enterButton =
    document.getElementById("enter");

const video =
    document.getElementById("background-video");

const musicToggle =
    document.getElementById("music-toggle");

const volume =
    document.getElementById("volume");

const profileCard =
    document.getElementById("profile-card");

const cursorGlow =
    document.querySelector(".cursor-glow");

const viewsButton =
    document.getElementById("views-button");

const viewsDisplay =
    document.getElementById("views");

const popupViews =
    document.getElementById("popup-views");

const viewsPopup =
    document.getElementById("views-popup");


/* =========================
   SETTINGS
   ========================= */

let entered = false;

video.volume = 0.35;


/* =========================
   VIEW COUNTER
   ========================= */

/*
    Fixed profile view count.
*/

const views = 1284;

viewsDisplay.textContent =
    views.toLocaleString();

popupViews.textContent =
    views.toLocaleString();


/* =========================
   VIEW POPUP
   ========================= */

viewsButton.addEventListener(
    "click",
    () => {

        viewsPopup.classList.toggle(
            "open"
        );

    }
);


/* =========================
   VIDEO STARTS STILL
   ========================= */

video.pause();


/* =========================
   ENTER WEBSITE
   ========================= */

enterButton.addEventListener(
    "click",
    async () => {

        if (entered) {
            return;
        }

        entered = true;


        /*
            Enable the website.
        */

        document.body.classList.add(
            "entered"
        );


        /*
            Hide CLICK screen.
        */

        intro.classList.add(
            "hidden"
        );


        /*
            Set volume.
        */

        video.volume =
            Number(volume.value);


        /*
            Enable video audio.
        */

        video.muted = false;


        /*
            Start background video.
        */

        try {

            await video.play();

            musicToggle.textContent =
                "❚❚";

        }

        catch (error) {

            console.log(
                "Video could not start:",
                error
            );

            musicToggle.textContent =
                "▶";

        }

    }
);


/* =========================
   PLAY / PAUSE
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
                    "Video could not start:",
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
   VOLUME CONTROL
   ========================= */

volume.addEventListener(
    "input",
    () => {

        video.volume =
            Number(volume.value);

    }
);


/* =========================
   CURSOR GLOW
   ========================= */

document.addEventListener(
    "mousemove",
    (event) => {

        if (!cursorGlow) {
            return;
        }

        cursorGlow.style.left =
            `${event.clientX}px`;

        cursorGlow.style.top =
            `${event.clientY}px`;

    }
);


/* =========================
   PARALLAX PROFILE
   ========================= */

document.addEventListener(
    "mousemove",
    (event) => {

        if (!entered || !profileCard) {
            return;
        }


        const x =
            (event.clientX /
                window.innerWidth) -
            0.5;

        const y =
            (event.clientY /
                window.innerHeight) -
            0.5;


        const rotateX =
            y * -7;

        const rotateY =
            x * 7;


        profileCard.style.transform =
            `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-2px)
            `;

    }
);


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

function copyDiscord(event) {

    event.preventDefault();


    navigator.clipboard
        .writeText("nxrdonut")

        .then(() => {

            const text =
                document.getElementById(
                    "discord-text"
                );


            if (!text) {
                return;
            }


            const original =
                text.textContent;


            text.textContent =
                "Copied!";


            setTimeout(
                () => {

                    text.textContent =
                        original;

                },
                1500
            );

        })

        .catch(() => {

            alert(
                "Discord username: nxrdonut"
            );

        });

}


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
            (titleIndex + 1) %
            titleFrames.length;

        document.title =
            titleFrames[titleIndex];

    },
    700
);


/* =========================
   SPACEBAR PLAY / PAUSE
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
```
