// Efeito do cabeçalho ao rolar
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 60) {
        header.style.background = '#fff';
        header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
    } else {
        header.style.background = 'transparent';
        header.style.boxShadow = 'none';
    }
});

// Filtro de projetos
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove destaque de todos
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.getAttribute('data-category');

        projects.forEach(project => {
            const projectCategory = project.getAttribute('data-category');
            if (projectCategory === category) {
                project.classList.remove('hidden');
            } else {
                project.classList.add('hidden');
            }
        });
    });
});
