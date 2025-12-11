// Smooth Scroll Profissional para o Menu
document.querySelectorAll('header a[href^="#"], footer a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetID = this.getAttribute('href');
        const targetElement = document.querySelector(targetID);

        if (!targetElement) return;

        const yOffset = -20; // ajuste fino (espaço do topo)
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
            top: y,
            behavior: "smooth"
        });
    });
});
