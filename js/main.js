// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

// Mobile detection
const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

// Apply mobile-specific adjustments
document.addEventListener('DOMContentLoaded', () => {
    if (isMobile.any()) {
        document.body.classList.add('is-mobile');
        
        // Optimize animations for mobile
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!reducedMotion.matches) {
            // Apply lighter animations for mobile
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
        }

        // Add touch-specific event handlers
        document.querySelectorAll('.project-box, .skill-category').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });

            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    }

    // Existing theme toggle code
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = (theme) => {
        document.body.className = theme + (isMobile.any() ? ' is-mobile' : '');
        if (theme === 'light') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
        localStorage.setItem('theme', theme);
    };
    
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    updateTheme(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.className.includes('light') ? 'dark' : 'light';
        updateTheme(newTheme);
    });
    
    prefersDarkScheme.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            updateTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Optimize scroll performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                // Scroll handling code here
                const currentScroll = window.pageYOffset;
                
                if (currentScroll <= 0) {
                    header.classList.remove('scroll-up');
                    return;
                }
                
                if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                    header.classList.remove('scroll-up');
                    header.classList.add('scroll-down');
                } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                    header.classList.remove('scroll-down');
                    header.classList.add('scroll-up');
                }
                lastScroll = currentScroll;
            }, 10);
        }
    }, { passive: true });

    // Mobile hover effects using Intersection Observer
    if ('IntersectionObserver' in window && isMobile) {
        const options = {
            root: null,
            rootMargin: '-35% 0px -35% 0px',
            threshold: 0.3
        };

        const removeHoverFromAll = () => {
            document.querySelectorAll('.project-box, .skill-category').forEach(box => {
                box.classList.remove('touch-hover');
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    removeHoverFromAll();
                    entry.target.classList.add('touch-hover');
                } else {
                    entry.target.classList.remove('touch-hover');
                }
            });
        }, options);

        document.querySelectorAll('.project-box, .skill-category').forEach(box => {
            observer.observe(box);
        });
    }

    initQuotesCarousel();
});

function initQuotesCarousel() {
    const root = document.querySelector('.quotes');
    const stage = document.querySelector('.quotes-stage');
    if (!root || !stage) return;

    const cards = Array.from(stage.querySelectorAll('.quote-card'));
    const prevBtn = root.querySelector('.quotes-prev');
    const nextBtn = root.querySelector('.quotes-next');
    const n = cards.length;
    if (!n) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0;
    let timer = null;
    let paused = false;

    const positionCards = () => {
        cards.forEach((card, i) => {
            card.classList.remove('is-left', 'is-center', 'is-right', 'is-hidden');
            const rel = (i - index + n) % n;
            if (rel === 0) {
                card.classList.add('is-center');
            } else if (rel === 1) {
                card.classList.add('is-right');
            } else if (rel === n - 1) {
                card.classList.add('is-left');
            } else {
                card.classList.add('is-hidden');
            }
        });
    };

    const stop = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

    const start = () => {
        stop();
        if (reducedMotion || paused || n < 2) return;
        timer = setInterval(() => go(1), 6500);
    };

    const go = (dir) => {
        index = (index + dir + n) % n;
        positionCards();
        if (!paused) start();
    };

    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));

    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            const rel = (i - index + n) % n;
            if (rel === 1) go(1);
            else if (rel === n - 1) go(-1);
        });
    });

    const pause = () => {
        paused = true;
        stop();
    };

    const resume = () => {
        paused = false;
        start();
    };

    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', resume);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', (e) => {
        if (!root.contains(e.relatedTarget)) resume();
    });

    root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            go(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            go(1);
        }
    });

    let touchStartX = 0;
    stage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        pause();
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        resume();
    }, { passive: true });

    positionCards();
    start();
}

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Here you would typically send the form data to a server
        // For now, we'll just log it and show a success message
        console.log('Form submitted:', formObject);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
}); 