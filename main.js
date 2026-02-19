// Metafarmers Interactive JS

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '5px 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });

    // 2. Dark Mode Toggle Logic
    const themeBtn = document.getElementById('btnTheme');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply initial theme
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeBtn.textContent = '☀️';
    }

    themeBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeBtn.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeBtn.textContent = '☀️';
        }
    });

    // 3. Roaming Quokka Logic
    const roamer = document.getElementById('quokkaRoamer');
    if (roamer) {
        let x = Math.random() * (window.innerWidth - 60);
        let y = Math.random() * (window.innerHeight - 60);
        let dx = (Math.random() - 0.5) * 2; // velocity X
        let dy = (Math.random() - 0.5) * 2; // velocity Y
        
        function roam() {
            x += dx;
            y += dy;
            
            // Bounce off left/right
            if (x < 0 || x + 52 > window.innerWidth) {
                dx *= -1;
            }
            // Bounce off top/bottom
            if (y < 0 || y + 52 > window.innerHeight) {
                dy *= -1;
            }
            
            // Flip image horizontally based on direction
            const flip = dx < 0 ? 'scaleX(-1)' : 'scaleX(1)';
            roamer.style.transform = `translate(${x}px, ${y}px) ${flip}`;
            
            requestAnimationFrame(roam);
        }
        roam();
    }

    // 4. Simple Scroll Reveal Animation
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
