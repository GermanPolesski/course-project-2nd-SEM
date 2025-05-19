document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            // Переключаем классы для анимации гамбургера
            hamburger.classList.toggle('active');
            // Переключаем видимость меню
            navMenu.classList.toggle('active');
        });

        // Закрываем меню при клике на ссылку
        const navLinks = document.querySelectorAll('nav ul a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Закрываем меню при клике вне его области
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}); 