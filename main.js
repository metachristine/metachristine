// Metafarmers Interactive JS

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // 2. Simple Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target sections for reveal
    const revealTargets = [
        ...document.querySelectorAll('.mission-card'),
        ...document.querySelectorAll('.tech-text'),
        ...document.querySelectorAll('.tech-image'),
        ...document.querySelectorAll('.product-card'),
        ...document.querySelectorAll('.section-header')
    ];

    revealTargets.forEach(target => {
        target.style.opacity = '0';
        target.style.transform = 'translateY(30px)';
        target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(target);
    });

    // Add visible class in JS for control
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // 3. Smooth Anchor Link Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Navbar height offset
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log("Metafarmers Introduction Page Loaded Successfully.");
});
