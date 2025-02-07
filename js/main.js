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
});

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