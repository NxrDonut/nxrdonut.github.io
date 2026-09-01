```javascript
/* =========================
   GET ELEMENTS
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


/* =========================
   SETTINGS
   ========================= */

let entered = false;


/*
    Starting volume.

    Change 0.35 to:
    0.10 = quiet
    0.50 = medium
    1.00 = maximum
*/

video.volume = 0.35;


/* =========================
   KEEP VIDEO STILL
   ========================= */

/*
    The video does not move
    before CLICK.
*/

video.pause();


/* =========================
   ENTER WEBSITE
   ========================= */

enterButton.addEventListener(
    "click",
    async () => {

        /*
            Prevent clicking twice.
        */

        if (entered) {
            return;
        }

        entered = true;


        /*
            Start visual transition.
        */

        document.body.classList.add(
            "entered"
        );


        /*
            Hide CLICK.
        */

        intro.classList.add(
            "hidden"
        );


        /*
            Turn audio on.

            Because the visitor clicked,
            the browser allows media audio.
        */

        video.muted = false;

        video.volume =
            Number(volume.value);


        /*
            Start video.
        */

        try {

            await video.play();

            musicToggle.textContent =
                "❚❚";

        }

        catch (error) {

            console.log(
                "Video/audio could not start:",
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

        /*
            If video is stopped,
            start it.
        */

        if (video.paused) {

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

            }

        }

        /*
            Otherwise pause it.
        */

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
   DISCORD COPY
   ========================= */

function copyDiscord(event) {

    /*
        Stop the link from
        opening a page.
    */

    event.preventDefault();


    /*
        Copy Discord username.
    */

    navigator.clipboard
        .writeText("nxrdonut")

        .then(() => {

            const text =
                document.getElementById(
                    "discord-text"
                );


            const original =
                text.textContent;


            /*
                Show confirmation.
            */

            text.textContent =
                "Copied!";


            /*
                Change it back.
            */

            setTimeout(
                () => {

                    text.textContent =
                        original;

                },
                1500
            );

        })

        .catch(() => {

            /*
                Fallback if clipboard
                permission is unavailable.
            */

            alert(
                "Discord username: nxrdonut"
            );

        });

}


/* =========================
   SPACEBAR CONTROL
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
