// Main JS Engine for Flux Platform
// Handles Theme, RTL, Sticky Navbar, and Interactive Components

(function() {
    "use strict";

    const init = () => {
        const html = document.documentElement;
        
        // --- SELECTORS ---
        const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
        const rtlToggles = document.querySelectorAll('#rtl-toggle, #rtl-toggle-mobile');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const navbar = document.getElementById('navbar');

        // --- THEME ENGINE ---
        const updateThemeUI = (theme) => {
            const isLight = theme === 'light';
            themeToggles.forEach(btn => {
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
                }
            });
            if (window.lucide) {
                window.lucide.createIcons();
            }
        };

        const toggleTheme = () => {
            const isCurrentlyLight = html.getAttribute('data-theme') === 'light';
            const nextTheme = isCurrentlyLight ? 'dark' : 'light';
            
            if (nextTheme === 'light') {
                html.setAttribute('data-theme', 'light');
                html.classList.remove('dark');
            } else {
                html.removeAttribute('data-theme');
                html.classList.add('dark');
            }
            
            localStorage.setItem('theme', nextTheme);
            updateThemeUI(nextTheme);
        };

        // --- RTL ENGINE ---
        const toggleRTL = () => {
            const currentDir = html.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            html.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
        };

        // --- EVENT LISTENERS ---
        themeToggles.forEach(btn => btn.addEventListener('click', toggleTheme));
        rtlToggles.forEach(btn => btn.addEventListener('click', toggleRTL));

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // --- STICKY NAV ---
        if (navbar) {
            const handleScroll = () => {
                if (window.scrollY > 20) {
                    navbar.classList.add('glass-dark', 'py-2');
                    navbar.classList.remove('py-4');
                } else {
                    navbar.classList.remove('glass-dark', 'py-2');
                    navbar.classList.add('py-4');
                }
            };
            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial check
        }

        // --- BACK TO TOP ENGINE ---
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 400) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // --- ACTIVE NAV ENGINE ---
        const updateActiveNav = () => {
            const currentPath = window.location.pathname;
            const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
            
            document.querySelectorAll('nav a').forEach(link => {
                // Skip brand/logo link or CTA button links (identified by gradients, rounding, or branding selectors)
                if (link.querySelector('.font-sora') || 
                    link.classList.contains('bg-gradient-to-r') || 
                    link.classList.contains('rounded-full') || 
                    link.classList.contains('rounded-2xl')) {
                    return;
                }

                const href = link.getAttribute('href');
                if (href === filename) {
                    link.classList.add('nav-link-active');
                } else {
                    link.classList.remove('nav-link-active');
                }
            });
        };

        // --- INITIAL SYNC ---
        const savedTheme = localStorage.getItem('theme') || 'dark';
        updateThemeUI(savedTheme);
        updateActiveNav();

        // --- INTERACTIVE COMPONENTS ---
        
        // Accordions
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('.accordion-icon');
                if (content) content.classList.toggle('hidden');
                if (icon) icon.style.transform = content?.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            });
        });

        // Intersection Observer for Animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

        // Counter Animation
        document.querySelectorAll('.counter').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const step = target / (duration / 20);
            let current = 0;
            const update = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    setTimeout(update, 20);
                } else {
                    counter.innerText = target;
                }
            };
            update();
        });

        // --- GLOBAL ICON INITIALIZATION ---
        const refreshIcons = () => {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        };

        refreshIcons();
        // Catch-all for any late-rendered icons
        setTimeout(refreshIcons, 500);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
