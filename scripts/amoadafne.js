const cards = document.querySelectorAll(".persona-card");

cards.forEach(card => {
    const video = card.querySelector("video");
    if (!video) return;

    // Garantias importantes pro mobile
    video.muted = true;
    video.playsInline = true;
    video.pause();

    // DESKTOP (hover)
    card.addEventListener("mouseenter", () => {
        if (window.innerWidth > 768) {
            video.play();
        }
    });

    card.addEventListener("mouseleave", () => {
        if (window.innerWidth > 768) {
            video.pause();
            video.currentTime = 0;
        }
    });

    // MOBILE (tap / click)
    card.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            if (video.paused) {
                // pausa todos os outros
                document.querySelectorAll(".persona-card video").forEach(v => {
                    v.pause();
                    v.currentTime = 0;
                });

                video.play();
            } else {
                video.pause();
                video.currentTime = 0;
            }
        }
    });
});
