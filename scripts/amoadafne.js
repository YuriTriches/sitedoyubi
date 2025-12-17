document.querySelectorAll(".persona-card").forEach(card => {
    const video = card.querySelector("video");
    if (!video) return;

    // DESKTOP
    card.addEventListener("mouseenter", () => {
        video.play();
    });

    card.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
    });

    // MOBILE (toque)
    let isPlaying = false;

    card.addEventListener("touchstart", (e) => {
        e.preventDefault(); // evita scroll bugado
        if (!isPlaying) {
            video.play();
            isPlaying = true;
        } else {
            video.pause();
            video.currentTime = 0;
            isPlaying = false;
        }
    });
});
