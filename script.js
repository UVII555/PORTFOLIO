// ============================================
// Theme Toggle Functionality
// ============================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update theme toggle icon
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ============================================
// Mobile Menu Toggle
// ============================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// ============================================
// Smooth Scroll with Offset for Fixed Navbar
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Active Navigation Link on Scroll
// ============================================
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        if (pageYOffset >= sectionTop - navbarHeight - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// Navbar Background on Scroll
// ============================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = 'var(--shadow-md)';
        navbar.style.padding = '0.5rem 0';
    } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
        navbar.style.padding = '1rem 0';
    }
});

// ============================================
// Contact Form Validation and Submission
// ============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyM4fC6SrVTphRMoO7F8IbnooKnkJ6f413v1BjYa6OpON2QJtJcR8qVBadPu58UhadegQ/exec';

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!CONTACT_FORM_ENDPOINT || CONTACT_FORM_ENDPOINT.includes('PASTE_')) {
        showFormStatus('Coming soon: add your Google Sheets endpoint to enable submissions.', 'info');
        return;
    }
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validation
    if (!name || !email || !subject || !message) {
        showFormStatus('Please fill in all fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormStatus('Please enter a valid email address.', 'error');
        return;
    }
    
    // Message length validation
    if (message.length < 10) {
        showFormStatus('Message must be at least 10 characters long.', 'error');
        return;
    }
    
    // Submit to Google Sheets via Apps Script
    showFormStatus('Sending message...', 'info');

    const payload = new URLSearchParams({
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
    });

    fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
    })
        .then((response) => {
            if (!response.ok) throw new Error('Failed to submit');
            return response.text();
        })
        .then(() => {
            showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        })
        .catch(() => {
            showFormStatus('Submission failed. Please try again later.', 'error');
        });
});

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    
    // Add appropriate styles
    if (type === 'error') {
        formStatus.style.color = '#dc2626';
    } else if (type === 'success') {
        formStatus.style.color = '#16a34a';
    } else {
        formStatus.style.color = 'var(--text-secondary)';
    }
}

// ============================================
// Download Resume Button
// ============================================
const downloadResumeBtn = document.getElementById('downloadResume');

downloadResumeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    window.open('assets/resume.pdf', '_blank');
});

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
const animatedElements = document.querySelectorAll('.project-card, .skill-category, .achievement-card, .education-item, .stat-item');

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// Typing Effect for Hero Tagline (Optional)
// ============================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect on hero tagline
// window.addEventListener('load', () => {
//     const tagline = document.querySelector('.hero-tagline');
//     const originalText = tagline.textContent;
//     typeWriter(tagline, originalText, 80);
// });

// ============================================
// Dynamic Year in Footer
// ============================================
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-content p');
if (footerText) {
    footerText.textContent = `© ${currentYear} Utsav Singh. All rights reserved.`;
}

// ============================================
// Project Links Placeholder Alert
// ============================================
// Removed - Add your actual GitHub repo URLs in index.html

// ============================================
// Form Input Animations
// ============================================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.querySelector('label').style.color = 'var(--accent-primary)';
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.querySelector('label').style.color = 'var(--text-primary)';
        }
    });
});

// ============================================
// Console Message for Recruiters
// ============================================
console.log('%c👋 Hello Recruiter!', 'color: #4f46e5; font-size: 24px; font-weight: bold;');
console.log('%cThanks for checking out my portfolio!', 'color: #6366f1; font-size: 16px;');
console.log('%cI\'m actively looking for internship opportunities.', 'color: #818cf8; font-size: 14px;');
console.log('%cFeel free to reach out via the contact form or email.', 'color: #a5b4fc; font-size: 14px;');
console.log('%c💼 Let\'s build something amazing together!', 'color: #4f46e5; font-size: 14px; font-weight: bold;');

// ============================================
// Performance Monitoring (Optional)
// ============================================
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
});

// ============================================
// Keyboard Navigation Accessibility
// ============================================
document.addEventListener('keydown', (e) => {
    // Press 'T' to toggle theme
    if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        // Don't trigger if user is typing in an input
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            themeToggle.click();
        }
    }
});

// ============================================
// Smooth Reveal on Load
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// DSA Tracker Integration
// ============================================
let dsaTracker = null;

// Initialize DSA Tracker
if (typeof DSA_CONFIG !== 'undefined' && typeof DSATracker !== 'undefined') {
    dsaTracker = new DSATracker(DSA_CONFIG);
    
    // Fetch stats on page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            dsaTracker.fetchAllStats();
        }, 500);
    });
    
    // Refresh button
    const refreshBtn = document.getElementById('refresh-stats');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            refreshBtn.disabled = true;
            
            await dsaTracker.refresh();
            
            refreshBtn.innerHTML = '<i class="fas fa-redo"></i>';
            refreshBtn.disabled = false;
        });
    }
    
    // Auto-refresh every 30 minutes
    setInterval(() => {
        dsaTracker.fetchAllStats();
    }, 30 * 60 * 1000);
}

// ============================================
// Project Metrics (GitHub Stars)
// ============================================
const projectMetricElements = document.querySelectorAll('.project-metrics[data-repo]');

async function fetchRepoStars(repo) {
    const url = `https://api.github.com/repos/${repo}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('GitHub API error');
    const data = await response.json();
    return data.stargazers_count ?? 0;
}

projectMetricElements.forEach(async (el) => {
    const repo = el.getAttribute('data-repo');
    if (!repo) return;
    const starEl = el.querySelector('[data-star-count]');
    if (!starEl) return;
    try {
        const stars = await fetchRepoStars(repo);
        starEl.textContent = stars;
    } catch (error) {
        starEl.textContent = 'N/A';
    }
});
