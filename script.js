/* =============================================
   Portfolio — Minimal, Purposeful Interactions
   Optimized for clarity, affordance, and comfort
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initActiveNav();
    initMobileMenu();
    initScrollReveal();
    initContactForm();
    initSmoothScroll();
});

/* Theme Toggle */
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', saved);
    toggle.setAttribute('aria-pressed', saved === 'light');
    
    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        toggle.setAttribute('aria-pressed', next === 'light');
    });
}

/* Header Scroll */
function initHeader() {
    const header = document.getElementById('header');
    
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* Active Navigation State */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (!sections.length || !navLinks.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    const isActive = href === `#${id}`;
                    link.classList.toggle('active', isActive);
                    link.setAttribute('aria-current', isActive ? 'page' : 'false');
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

/* Mobile Menu */
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    const links = menu.querySelectorAll('a');
    
    const close = () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };
    
    const open = () => {
        toggle.classList.add('active');
        menu.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };
    
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'mobileMenu');
    
    toggle.addEventListener('click', () => {
        const isActive = toggle.classList.contains('active');
        isActive ? close() : open();
    });
    
    links.forEach(link => link.addEventListener('click', close));
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            close();
            toggle.focus();
        }
    });
}

/* Simple Scroll Reveal - Faster */
function initScrollReveal() {
    const elements = document.querySelectorAll('.project, .experience-item, .about-content, .about-skills, .contact-info, .contact-form');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered reveal
                setTimeout(() => {
                    entry.target.classList.add('fade-in', 'visible');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    
    elements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/* Contact Form - Formspree Integration */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        // Disable and show loading
        btn.textContent = 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        if (feedback) feedback.textContent = '';
        
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                btn.textContent = 'Sent!';
                btn.style.background = '#10b981';
                btn.style.opacity = '1';
                if (feedback) {
                    feedback.textContent = 'Thanks for your message! I\'ll get back to you soon.';
                    feedback.className = 'form-feedback success';
                }
                form.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            btn.textContent = 'Error';
            btn.style.background = '#ef4444';
            btn.style.opacity = '1';
            if (feedback) {
                feedback.textContent = 'Something went wrong. Please try again or email directly.';
                feedback.className = 'form-feedback error';
            }
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}

/* Smooth Scroll */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });
}
