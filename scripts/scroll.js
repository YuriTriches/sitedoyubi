const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .final-reveal');

function fadeInOnScroll() {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;

        if (isVisible) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', fadeInOnScroll);

// FINAL SECTION + FOOTER animation
const finalElements = document.querySelectorAll(".final-reveal");

function revealFinal() {
    const trigger = window.innerHeight * 0.85;

    finalElements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < trigger) {
            el.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", revealFinal);
revealFinal();
