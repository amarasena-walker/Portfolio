/**
 * Portfolio Main JavaScript
 * Handles interactivity, smooth scrolling, and scroll-triggered animations.
 */

/**
 * Initialize Lucide Icons
 * Re-scan the DOM for data-lucide attributes and replace with SVGs.
 */
lucide.createIcons();

/**
 * Mobile Menu Toggle Logic
 * Handles the opening/closing of the mobile navigation overlay.
 */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuBtn.querySelector('i');
    
    // Toggle between menu and close icons
    if (mobileMenu.classList.contains('hidden')) {
        icon.setAttribute('data-lucide', 'menu');
    } else {
        icon.setAttribute('data-lucide', 'x');
    }
    lucide.createIcons();
});

/**
 * Close mobile menu automatically when a link is clicked.
 */
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

/**
 * Navbar State Management
 * Shrinks the navbar and adds a shadow when user scrolls down.
 */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('py-2', 'shadow-lg');
        navbar.classList.remove('py-4');
    } else {
        navbar.classList.add('py-4');
        navbar.classList.remove('py-2', 'shadow-lg');
    }
});

/**
 * Generic Scroll Reveal Animation
 * Uses IntersectionObserver to trigger 'animate-slide-up' on elements
 * with the '.reveal-on-scroll' class.
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    el.style.opacity = '0'; // Hide element initially
    observer.observe(el);
});

/**
 * Contact Form Submission Handler
 * Prevents default submission and logs form data.
 */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        console.log('Form Submitted:', formData);
        alert('Thank you for your message! (This is a clone demo, no data was actually sent)');
        contactForm.reset();
    });
}

/**
 * Lazy Load YouTube Videos
 * Replaces placeholders with iframes on user click to prevent initialization errors
 * and improve initial page load performance.
 */
document.querySelectorAll('.video-placeholder').forEach(placeholder => {
    placeholder.addEventListener('click', function() {
        const videoUrl = this.getAttribute('data-video-url');
        const iframe = document.createElement('iframe');
        
        iframe.setAttribute('src', videoUrl);
        iframe.setAttribute('class', 'w-full h-full');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', 'true');
        
        // Replace placeholder content with the iframe
        this.parentElement.appendChild(iframe);
        this.remove();
    });
});

/**
 * Video Modal Support
 * Although YouTube handles most controls natively, we maintain the modal logic
 * to allow for a specialized viewing experience if desired.
 */
// Global Modal Close Handlers
const modal = document.getElementById('video-modal');
const modalIframe = document.getElementById('modal-iframe');
const closeModal = document.getElementById('close-modal');

if (modal && modalIframe && closeModal) {
    const closeHandler = () => {
        modal.classList.remove('active');
        modalIframe.src = "";
    };

    closeModal.onclick = closeHandler;
    modal.onclick = (e) => {
        if (e.target === modal) closeHandler();
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeHandler();
        }
    });
}

/**
 * Lenis Smooth Scroll Engine
 * Configures the momentum-based smooth scroll for a premium feel.
 */
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

/**
 * RequestAnimationFrame Loop for Lenis
 * Integrates Lenis with the browser's native frame budget.
 */
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/**
 * Scroll Event Hub (Lenis)
 * Handles the Top Progress Bar and the Back-to-Top button visibility.
 */
lenis.on('scroll', ({ scroll, limit, velocity, progress }) => {
    // Update the thin Progress Bar at the top
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
    }

    // Toggle Back-to-Top Button visibility (appears after 500px)
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        if (scroll > 500) {
            backToTopBtn.classList.add('opacity-100', 'translate-y-0');
            backToTopBtn.classList.remove('opacity-0', 'translate-y-10');
        } else {
            backToTopBtn.classList.add('opacity-0', 'translate-y-10');
            backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
        }
    }
});

/**
 * Smooth Internal Navigation
 * Intercepts anchor links (#) to use the Lenis scroll engine instead
 * of native jumps, ensuring momentum is preserved.
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            lenis.scrollTo(targetElement, {
                offset: -80, // Adjust for fixed navbar
                duration: 1.5
            });
        }
    });
});

/**
 * Back to Top Interaction
 * Resets user scroll to the very top using a weighted smooth transit.
 */
document.getElementById('back-to-top')?.addEventListener('click', () => {
    lenis.scrollTo(0, {
        duration: 2
    });
});

/**
 * Staggered Bento Grid Reveal
 * Special IntersectionObserver for the skills section that adds a delayed timing
 * to each item for a cascading "pop-in" effect.
 */
const bentoItems = document.querySelectorAll('.bento-item');
const bentoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Sequential delay based on element index
            setTimeout(() => {
                entry.target.classList.add('animate-slide-up');
                entry.target.style.opacity = '1';
            }, index * 100);
            bentoObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Initialize bento items with opacity 0 so they can reveal on scroll
bentoItems.forEach(item => {
    item.style.opacity = '0';
    bentoObserver.observe(item);
});
