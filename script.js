const intro = document.getElementById("intro");
const enterButton = document.getElementById("enter");

const video = document.getElementById("background-video");
const music = document.getElementById("music");

const musicToggle = document.getElementById("music-toggle");
const volume = document.getElementById("volume");

let entered = false;

/* =========================
   DEFAULT MUSIC VOLUME
   ========================= */

music.volume = 0.35;

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

    /* Start background video */
    try {

        video.muted = true;

        await video.play();

    } catch (error) {

        console.log(
            "Background video could not start:",
            error
        );

    }

    /* Start music */
    try {

        await music.play();

        musicToggle.textContent = "❚❚";

    } catch (error) {

        console.log(
            "Music could not start:",
            error
        );

        musicToggle.textContent = "▶";

    }

});

/* =========================
   MUSIC PLAY / PAUSE
   ========================= */

musicToggle.addEventListener("click", async () => {

    if (music.paused) {

        try {

            await music.play();

            musicToggle.textContent = "❚❚";

        } catch (error) {

            console.log(
                "Music could not start:",
                error
            );

        }

    } else {

        music.pause();

        musicToggle.textContent = "▶";

    }

});

/* =========================
   VOLUME
   ========================= */

volume.addEventListener("input", () => {

    music.volume = Number(volume.value);

});

/* =========================
   SPACEBAR MUSIC CONTROL
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
