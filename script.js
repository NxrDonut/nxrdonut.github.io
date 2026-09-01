const intro = document.getElementById("intro");
const enterButton = document.getElementById("enter");

const video = document.getElementById("background-video");

const musicToggle = document.getElementById("music-toggle");
const volume = document.getElementById("volume");

let entered = false;

/* =========================
   DEFAULT VOLUME
   ========================= */

video.volume = 0.35;

/* =========================
   ENTER WEBSITE
   ========================= */

enterButton.addEventListener("click", async () => {

    if (entered) {
        return;
    }

    entered = true;

    /* Start visual transition */
    document.body.classList.add("entered");

    /* Hide CLICK */
    intro.classList.add("hidden");

    /*
     * The video was muted so the browser
     * could autoplay it.
     *
     * The user's click now allows us
     * to turn the audio on.
     */

    try {

        video.muted = false;
        video.volume = Number(volume.value);

        await video.play();

        musicToggle.textContent = "❚❚";

    } catch (error) {

        console.log(
            "Video/audio could not start:",
            error
        );

        musicToggle.textContent = "▶";
    }

});

/* =========================
   PLAY / PAUSE VIDEO AUDIO
   ========================= */

musicToggle.addEventListener("click", async () => {

    if (video.paused) {

        try {

            await video.play();

            musicToggle.textContent = "❚❚";

        } catch (error) {

            console.log(
                "Video could not start:",
                error
            );

        }

    } else {

        video.pause();

        musicToggle.textContent = "▶";

    }

});

/* =========================
   VOLUME
   ========================= */

volume.addEventListener("input", () => {

    video.volume = Number(volume.value);

});

/* =========================
   SPACEBAR
   ========================= */

document.addEventListener("keydown", (event) => {

    if (
        event.code === "Space" &&
        entered &&
        document.activeElement.tagName !== "INPUT"
    ) {

        event.preventDefault();

        musicToggle.click();

    }

});
