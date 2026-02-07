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
const toast = document.getElementById('toast');
const trackerModal = document.getElementById('trackerModal');
const openTrackerModal = document.getElementById('openTrackerModal');
const closeTrackerModal = document.getElementById('closeTrackerModal');
const trackerForm = document.getElementById('trackerForm');
const trackerStatusMsg = document.getElementById('trackerStatusMsg');
const CMS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbycQAlPIrEZ4e4BPf5QpZiThEisAvfJVg0SguSxHmvIRqRHtzN0BdJmjqReP9mYSLCS1Q/exec';
const TRACKER_FORM_ENDPOINT = CMS_ENDPOINT;

function showToast(message, type = 'info') {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.className = 'toast';
        toast.textContent = '';
    }, 3500);
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const lastSubmit = Number(localStorage.getItem('contact_last_submit') || '0');
    const now = Date.now();
    if (now - lastSubmit < 120000) {
        showFormStatus('Please wait a bit before sending another message.', 'info');
        showToast('Please wait 2 minutes before sending another message.', 'info');
        return;
    }

    if (!CONTACT_FORM_ENDPOINT || CONTACT_FORM_ENDPOINT.includes('PASTE_')) {
        showFormStatus('Coming soon: add your Google Sheets endpoint to enable submissions.', 'info');
        return;
    }
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const website = document.getElementById('website')?.value.trim();

    // Honeypot anti-spam (bots will fill hidden fields)
    if (website) {
        showToast('Thanks! Your message is being processed.', 'success');
        contactForm.reset();
        return;
    }
    
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
    showToast('Sending message...', 'info');

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
            showToast('Message sent successfully!', 'success');
            localStorage.setItem('contact_last_submit', String(Date.now()));
            contactForm.reset();
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        })
        .catch(() => {
            showFormStatus('Submission failed. Please try again later.', 'error');
            showToast('Submission failed. Please try again later.', 'error');
        });
});

function toggleTrackerModal(show) {
    if (!trackerModal) return;
    trackerModal.classList.toggle('show', show);
    trackerModal.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (show) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

if (openTrackerModal) {
    openTrackerModal.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTrackerModal(true);
    });
}

if (closeTrackerModal) {
    closeTrackerModal.addEventListener('click', () => toggleTrackerModal(false));
}

if (trackerModal) {
    trackerModal.addEventListener('click', (e) => {
        if (e.target === trackerModal) toggleTrackerModal(false);
    });
}

if (trackerForm) {
    trackerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!TRACKER_FORM_ENDPOINT || TRACKER_FORM_ENDPOINT.includes('PASTE_')) {
            if (trackerStatusMsg) trackerStatusMsg.textContent = 'Coming soon: add your tracker endpoint.';
            showToast('Add your tracker endpoint to enable saving.', 'info');
            return;
        }

        const payload = new URLSearchParams({
            mode: 'tracker_append',
            company: document.getElementById('trackerCompany').value.trim(),
            role: document.getElementById('trackerRole').value.trim(),
            link: document.getElementById('trackerLink').value.trim(),
            status: document.getElementById('trackerStatus').value,
            appliedDate: document.getElementById('trackerDate').value,
            followUpDate: document.getElementById('trackerFollowUp').value,
            notes: document.getElementById('trackerNotes').value.trim(),
            timestamp: new Date().toISOString()
        });

        if (trackerStatusMsg) trackerStatusMsg.textContent = 'Saving...';
        showToast('Saving application...', 'info');

        fetch(TRACKER_FORM_ENDPOINT, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: payload.toString()
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed');
                return response.text();
            })
            .then(() => {
                if (trackerStatusMsg) trackerStatusMsg.textContent = 'Saved!';
                trackerForm.reset();
                showToast('Application saved to tracker.', 'success');
            })
            .catch(() => {
                if (trackerStatusMsg) trackerStatusMsg.textContent = 'Failed to save.';
                showToast('Tracker save failed. Try again.', 'error');
            });
    });
}

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

// ============================================
// Tech Journal (local edit + drag/drop)
// ============================================
const journalGrid = document.querySelector('.journal-grid');
const journalAdminToggle = document.getElementById('journalAdminToggle');
const journalAdminPanel = document.getElementById('journalAdminPanel');
const journalAddBtn = document.getElementById('journalAddBtn');
const journalSaveBtn = document.getElementById('journalSaveBtn');
const sectionToggleInputs = document.querySelectorAll('[data-toggle-section]');
const saveSectionVisibilityBtn = document.getElementById('saveSectionVisibility');
const resetSectionVisibilityBtn = document.getElementById('resetSectionVisibility');
const SECTION_VISIBILITY_KEY = 'section_visibility';
const cmsJson = document.getElementById('cmsJson');
const cmsLoadBtn = document.getElementById('cmsLoadBtn');
const cmsLoadFromPageBtn = document.getElementById('cmsLoadFromPageBtn');
const cmsApplyBtn = document.getElementById('cmsApplyBtn');
const cmsSaveBtn = document.getElementById('cmsSaveBtn');
const trackerFilterStatus = document.getElementById('trackerFilterStatus');
const trackerFilterWindow = document.getElementById('trackerFilterWindow');
const trackerFilterFollowUp = document.getElementById('trackerFilterFollowUp');
const trackerRefreshBtn = document.getElementById('trackerRefreshBtn');
const trackerStats = document.getElementById('trackerStats');
const trackerTableBody = document.getElementById('trackerTableBody');
const CMS_CACHE_KEY = 'cms_content_cache';
let cmsState = null;
let trackerRows = [];
const journalTitle = document.getElementById('journalTitle');
const journalTag = document.getElementById('journalTag');
const journalBody = document.getElementById('journalBody');
const JOURNAL_KEY = 'tech_journal_posts';
const JOURNAL_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzDvb6n1xhulw3W6_V3K6OVwb5-mncUF_58SuQlkp_cvl_Ws9lbuGKI5FvziVOa0t4N/exec';
const JOURNAL_ADMIN_ID = 'singhutsav555@gmail.com';
const JOURNAL_ADMIN_PASSWORD = '';
const JOURNAL_PASSWORD_HINT = '';
const JOURNAL_TOKEN_KEY = 'journal_admin_token';

function defaultJournalPosts() {
    return Array.from(journalGrid.querySelectorAll('.journal-card')).map(card => ({
        tag: card.querySelector('.journal-tag')?.textContent || '',
        title: card.querySelector('h3')?.textContent || '',
        body: card.querySelector('p')?.textContent || '',
        meta: card.querySelector('.journal-meta')?.textContent || ''
    }));
}

function renderJournal(posts) {
    if (!journalGrid) return;
    journalGrid.innerHTML = posts.map((post, idx) => `
        <div class="journal-card" draggable="true" data-index="${idx}">
            <div class="journal-tag">${post.tag}</div>
            <h3 contenteditable="true">${post.title}</h3>
            <p contenteditable="true">${post.body}</p>
            <div class="journal-meta" contenteditable="true">${post.meta}</div>
        </div>
    `).join('');
}

async function loadJournal() {
    if (JOURNAL_ENDPOINT && !JOURNAL_ENDPOINT.includes('PASTE_')) {
        try {
            const response = await fetch(`${JOURNAL_ENDPOINT}?mode=read`);
            if (response.ok) {
                const data = await response.json();
                const posts = Array.isArray(data.posts) && data.posts.length
                    ? data.posts
                    : defaultJournalPosts();
                renderJournal(posts);
                return;
            }
        } catch (e) {
            // fallback to local
        }
    }
    try {
        const stored = localStorage.getItem(JOURNAL_KEY);
        if (stored) {
            renderJournal(JSON.parse(stored));
            return;
        }
    } catch (e) {}
    renderJournal(defaultJournalPosts());
}

async function saveJournal() {
    const cards = Array.from(journalGrid.querySelectorAll('.journal-card'));
    const posts = cards.map(card => ({
        tag: card.querySelector('.journal-tag')?.textContent.trim() || '',
        title: card.querySelector('h3')?.textContent.trim() || '',
        body: card.querySelector('p')?.textContent.trim() || '',
        meta: card.querySelector('.journal-meta')?.textContent.trim() || ''
    }));
    if (JOURNAL_ENDPOINT && !JOURNAL_ENDPOINT.includes('PASTE_')) {
        try {
            const response = await fetch(JOURNAL_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'write',
                    password: JOURNAL_ADMIN_PASSWORD,
                    token: sessionStorage.getItem(JOURNAL_TOKEN_KEY) || '',
                    posts
                })
            });
            if (response.ok) {
                showToast('Journal saved for all visitors.', 'success');
                return;
            }
        } catch (e) {
            // fallback to local
        }
    }
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(posts));
    showToast('Journal saved locally (set endpoint for global).', 'info');
}

let isAdminMode = false;
function enableAdminIfRequested() {
    const params = new URLSearchParams(window.location.search);
    isAdminMode = params.get('admin') === '1';
    if (isAdminMode) {
        journalAdminToggle.style.display = 'inline-flex';
        sessionStorage.setItem('journal_admin', '1');
        toggleAdminOnly();
        if (journalAdminPanel) {
            journalAdminPanel.classList.add('show');
        }
    } else {
        journalAdminToggle.style.display = 'none';
    }
}

let dragIndex = null;
function setupDragAndDrop() {
    if (!journalGrid) return;
    journalGrid.addEventListener('dragstart', (e) => {
        const card = e.target.closest('.journal-card');
        if (!card) return;
        dragIndex = Number(card.dataset.index);
        e.dataTransfer.effectAllowed = 'move';
    });
    journalGrid.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    journalGrid.addEventListener('drop', (e) => {
        e.preventDefault();
        const target = e.target.closest('.journal-card');
        if (!target) return;
        const dropIndex = Number(target.dataset.index);
        const posts = Array.from(journalGrid.querySelectorAll('.journal-card')).map(card => ({
            tag: card.querySelector('.journal-tag')?.textContent || '',
            title: card.querySelector('h3')?.textContent || '',
            body: card.querySelector('p')?.textContent || '',
            meta: card.querySelector('.journal-meta')?.textContent || ''
        }));
        if (dragIndex === null || dropIndex === dragIndex) return;
        const [moved] = posts.splice(dragIndex, 1);
        posts.splice(dropIndex, 0, moved);
        renderJournal(posts);
        setupDragAndDrop();
    });
}

if (journalGrid) {
    loadJournal();
    enableAdminIfRequested();
    setupDragAndDrop();
}

function applySectionVisibility() {
    const raw = localStorage.getItem(SECTION_VISIBILITY_KEY);
    const visibility = raw ? JSON.parse(raw) : {};
    sectionToggleInputs.forEach(input => {
        const id = input.getAttribute('data-toggle-section');
        const isVisible = isAdminMode ? true : visibility[id] !== false;
        input.checked = isVisible;
        const section = document.getElementById(id);
        if (section) {
            section.classList.toggle('section-hidden', !isVisible);
        }
    });
}

applySectionVisibility();

function getTextContent(el) {
    return el ? el.textContent.trim() : '';
}

function collectCmsFromPage() {
    const aboutParas = Array.from(document.querySelectorAll('#about .about-text p')).map(p => p.textContent.trim());
    const aboutStats = Array.from(document.querySelectorAll('#about .stat-item')).map(item => ({
        value: getTextContent(item.querySelector('h4')),
        label: getTextContent(item.querySelector('p'))
    }));
    const skills = Array.from(document.querySelectorAll('.skills-grid .skill-category')).map(cat => ({
        title: getTextContent(cat.querySelector('h3')),
        tags: Array.from(cat.querySelectorAll('.skill-tag')).map(tag => tag.textContent.trim())
    }));
    const projects = Array.from(document.querySelectorAll('.project-card')).map(card => ({
        title: getTextContent(card.querySelector('h3')),
        description: getTextContent(card.querySelector('.project-description')),
        tech: Array.from(card.querySelectorAll('.project-tech .tech-badge')).map(t => t.textContent.trim()),
        learnings: Array.from(card.querySelectorAll('.project-learning li')).map(li => li.textContent.trim()),
        repo: card.querySelector('.project-links a')?.getAttribute('href') || ''
    }));
    const achievements = Array.from(document.querySelectorAll('.achievement-card')).map(card => ({
        title: getTextContent(card.querySelector('h3')),
        description: getTextContent(card.querySelector('p')),
        badge: getTextContent(card.querySelector('.stat-badge'))
    }));
    const internshipsColumns = Array.from(document.querySelectorAll('#internships .target-column')).map(col => ({
        title: getTextContent(col.querySelector('h3')),
        items: Array.from(col.querySelectorAll('li')).map(li => ({
            name: getTextContent(li.querySelector('span')),
            link: li.querySelector('a')?.getAttribute('href') || '',
            label: getTextContent(li.querySelector('a'))
        }))
    }));
    const sectionVisibility = {};
    sectionToggleInputs.forEach(input => {
        sectionVisibility[input.getAttribute('data-toggle-section')] = input.checked;
    });

    return {
        hero: {
            subtitle: getTextContent(document.querySelector('.hero-subtitle')),
            tagline: getTextContent(document.querySelector('.hero-tagline'))
        },
        about: {
            headline: getTextContent(document.querySelector('#about h3')),
            paragraphs: aboutParas,
            stats: aboutStats
        },
        skills,
        projects,
        internships: {
            subtitle: getTextContent(document.querySelector('#internships .section-subtitle')),
            columns: internshipsColumns
        },
        achievements,
        contact: {
            subtitle: getTextContent(document.querySelector('#contact .section-subtitle')),
            location: getTextContent(document.querySelector('#contact .contact-item p'))
        },
        sectionVisibility
    };
}

function applyCmsToPage(cms) {
    if (!cms) return;
    if (cms.hero) {
        const subtitleEl = document.querySelector('.hero-subtitle');
        const taglineEl = document.querySelector('.hero-tagline');
        if (subtitleEl && cms.hero.subtitle) subtitleEl.textContent = cms.hero.subtitle;
        if (taglineEl && cms.hero.tagline) taglineEl.textContent = cms.hero.tagline;
    }
    if (cms.about) {
        const h3 = document.querySelector('#about h3');
        if (h3 && cms.about.headline) h3.textContent = cms.about.headline;
        const paras = document.querySelectorAll('#about .about-text p');
        if (cms.about.paragraphs && cms.about.paragraphs.length) {
            cms.about.paragraphs.forEach((text, idx) => {
                if (paras[idx]) paras[idx].textContent = text;
            });
        }
        if (cms.about.stats && cms.about.stats.length) {
            const stats = document.querySelectorAll('#about .stat-item');
            cms.about.stats.forEach((stat, idx) => {
                const item = stats[idx];
                if (!item) return;
                const val = item.querySelector('h4');
                const label = item.querySelector('p');
                if (val && stat.value) val.textContent = stat.value;
                if (label && stat.label) label.textContent = stat.label;
            });
        }
    }
    if (cms.skills && cms.skills.length) {
        const cats = document.querySelectorAll('.skills-grid .skill-category');
        cms.skills.forEach((skill, idx) => {
            const cat = cats[idx];
            if (!cat) return;
            const title = cat.querySelector('h3');
            if (title && skill.title) title.textContent = skill.title;
            const tagsWrap = cat.querySelector('.skill-tags');
            if (tagsWrap && skill.tags) {
                tagsWrap.innerHTML = skill.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('');
            }
        });
    }
    if (cms.projects && cms.projects.length) {
        const cards = document.querySelectorAll('.project-card');
        cms.projects.forEach((proj, idx) => {
            const card = cards[idx];
            if (!card) return;
            const title = card.querySelector('h3');
            const desc = card.querySelector('.project-description');
            if (title && proj.title) title.textContent = proj.title;
            if (desc && proj.description) desc.textContent = proj.description;
            const techWrap = card.querySelector('.project-tech');
            if (techWrap && proj.tech) {
                techWrap.innerHTML = proj.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');
            }
            const learnWrap = card.querySelector('.project-learning ul');
            if (learnWrap && proj.learnings) {
                learnWrap.innerHTML = proj.learnings.map(l => `<li>${l}</li>`).join('');
            }
            const repoLink = card.querySelector('.project-links a');
            if (repoLink && proj.repo) repoLink.setAttribute('href', proj.repo);
        });
    }
    if (cms.internships) {
        const subtitle = document.querySelector('#internships .section-subtitle');
        if (subtitle && cms.internships.subtitle) subtitle.textContent = cms.internships.subtitle;
        const cols = document.querySelectorAll('#internships .target-column');
        cms.internships.columns?.forEach((col, idx) => {
            const el = cols[idx];
            if (!el) return;
            const title = el.querySelector('h3');
            if (title && col.title) title.textContent = col.title;
            const list = el.querySelector('ul');
            if (list && col.items) {
                list.innerHTML = col.items.map(item => `<li><span>${item.name}</span><a href="${item.link}" target="_blank" rel="noopener">${item.label || 'Link'}</a></li>`).join('');
            }
        });
    }
    if (cms.achievements && cms.achievements.length) {
        const cards = document.querySelectorAll('.achievement-card');
        cms.achievements.forEach((ach, idx) => {
            const card = cards[idx];
            if (!card) return;
            const title = card.querySelector('h3');
            const desc = card.querySelector('p');
            const badge = card.querySelector('.stat-badge');
            if (title && ach.title) title.textContent = ach.title;
            if (desc && ach.description) desc.textContent = ach.description;
            if (badge && ach.badge) badge.textContent = ach.badge;
        });
    }
    if (cms.contact) {
        const subtitle = document.querySelector('#contact .section-subtitle');
        if (subtitle && cms.contact.subtitle) subtitle.textContent = cms.contact.subtitle;
        const loc = document.querySelector('#contact .contact-item p');
        if (loc && cms.contact.location) loc.textContent = cms.contact.location;
    }
    if (cms.sectionVisibility) {
        localStorage.setItem(SECTION_VISIBILITY_KEY, JSON.stringify(cms.sectionVisibility));
        applySectionVisibility();
    }
}

async function loadCmsFromSheet() {
    if (!CMS_ENDPOINT || CMS_ENDPOINT.includes('PASTE_')) {
        showToast('Set CMS endpoint to load content.', 'info');
        return;
    }
    const res = await fetch(`${CMS_ENDPOINT}?mode=cms_read`);
    if (!res.ok) throw new Error('CMS load failed');
    const data = await res.json();
    cmsState = data.cms || null;
    if (cmsState) {
        localStorage.setItem(CMS_CACHE_KEY, JSON.stringify(cmsState));
        applyCmsToPage(cmsState);
        if (cmsJson) cmsJson.value = JSON.stringify(cmsState, null, 2);
    }
}

function loadCmsFromCache() {
    const raw = localStorage.getItem(CMS_CACHE_KEY);
    if (!raw) return;
    try {
        cmsState = JSON.parse(raw);
        applyCmsToPage(cmsState);
        if (cmsJson) cmsJson.value = JSON.stringify(cmsState, null, 2);
    } catch (e) {
        // ignore
    }
}

async function saveCmsToSheet(cms) {
    if (!CMS_ENDPOINT || CMS_ENDPOINT.includes('PASTE_')) {
        showToast('Set CMS endpoint to save content.', 'info');
        return;
    }
    const res = await fetch(CMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'cms_write', cms })
    });
    if (!res.ok) throw new Error('CMS save failed');
    localStorage.setItem(CMS_CACHE_KEY, JSON.stringify(cms));
    showToast('CMS saved.', 'success');
}

loadCmsFromCache();
loadCmsFromSheet().catch(() => {});

const adminOnlyEls = document.querySelectorAll('[data-admin-only]');
function toggleAdminOnly() {
    const isAdmin = sessionStorage.getItem('journal_admin') === '1';
    adminOnlyEls.forEach(el => {
        el.style.display = isAdmin ? 'inline-flex' : 'none';
    });
}

toggleAdminOnly();

if (journalAdminToggle) {
    journalAdminToggle.addEventListener('click', () => {
        if (journalAdminPanel) {
            journalAdminPanel.classList.toggle('show');
        }
        toggleAdminOnly();
        if (journalAdminPanel.classList.contains('show')) {
            loadTrackerRows().catch(() => {});
        }
    });
}

// Internship section only visible when explicitly opened
function updateInternshipVisibility() {
    const section = document.getElementById('internships');
    if (!section) return;
    const isTarget = window.location.hash === '#internships';
    section.classList.toggle('section-hidden', !isTarget);
}

window.addEventListener('hashchange', updateInternshipVisibility);
updateInternshipVisibility();

if (saveSectionVisibilityBtn) {
    saveSectionVisibilityBtn.addEventListener('click', () => {
        const visibility = {};
        sectionToggleInputs.forEach(input => {
            const id = input.getAttribute('data-toggle-section');
            visibility[id] = input.checked;
        });
        localStorage.setItem(SECTION_VISIBILITY_KEY, JSON.stringify(visibility));
        applySectionVisibility();
        if (cmsState) {
            cmsState.sectionVisibility = visibility;
            saveCmsToSheet(cmsState).catch(() => {
                showToast('Visibility saved locally.', 'info');
            });
        } else {
            showToast('Section visibility updated.', 'success');
        }
    });
}

if (resetSectionVisibilityBtn) {
    resetSectionVisibilityBtn.addEventListener('click', () => {
        localStorage.removeItem(SECTION_VISIBILITY_KEY);
        applySectionVisibility();
        showToast('Section visibility reset.', 'success');
    });
}

if (cmsLoadBtn) {
    cmsLoadBtn.addEventListener('click', () => {
        loadCmsFromSheet().catch(() => showToast('Failed to load CMS.', 'error'));
    });
}

if (cmsLoadFromPageBtn) {
    cmsLoadFromPageBtn.addEventListener('click', () => {
        const cms = collectCmsFromPage();
        cmsState = cms;
        if (cmsJson) cmsJson.value = JSON.stringify(cms, null, 2);
        showToast('Loaded content from page.', 'success');
    });
}

if (cmsApplyBtn) {
    cmsApplyBtn.addEventListener('click', () => {
        try {
            const cms = cmsJson?.value ? JSON.parse(cmsJson.value) : null;
            if (!cms) return;
            cmsState = cms;
            applyCmsToPage(cms);
            showToast('CMS applied to page.', 'success');
        } catch (e) {
            showToast('Invalid CMS JSON.', 'error');
        }
    });
}

if (cmsSaveBtn) {
    cmsSaveBtn.addEventListener('click', () => {
        try {
            const cms = cmsJson?.value ? JSON.parse(cmsJson.value) : null;
            if (!cms) return;
            cmsState = cms;
            saveCmsToSheet(cms).catch(() => showToast('CMS save failed.', 'error'));
        } catch (e) {
            showToast('Invalid CMS JSON.', 'error');
        }
    });
}

function normalizeDate(value) {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

function computeTrackerStats(rows, daysWindow) {
    const now = new Date();
    const since = daysWindow === 'all' ? null : new Date(now.getTime() - Number(daysWindow) * 86400000);
    const filtered = rows.filter(r => {
        const d = normalizeDate(r.appliedDate || r.timestamp);
        return !since || (d && d >= since);
    });
    const counts = {};
    filtered.forEach(r => {
        const key = r.status || 'Unknown';
        counts[key] = (counts[key] || 0) + 1;
    });
    return { counts, total: filtered.length };
}

function renderTrackerStats(stats) {
    if (!trackerStats) return;
    const cards = Object.entries(stats.counts).map(([status, count]) => `
        <div class="tracker-stat-card">
            <strong>${status}</strong>
            <div>${count}</div>
        </div>
    `);
    trackerStats.innerHTML = `
        <div class="tracker-stat-card"><strong>Total</strong><div>${stats.total}</div></div>
        ${cards.join('')}
    `;
}

function renderTrackerTable(rows) {
    if (!trackerTableBody) return;
    trackerTableBody.innerHTML = rows.map(r => `
        <tr>
            <td>${r.appliedDate || r.timestamp || ''}</td>
            <td>${r.company || ''}</td>
            <td>${r.role || ''}</td>
            <td>${r.status || ''}</td>
            <td>${r.followUpDate || ''}</td>
            <td>${r.link ? `<a href="${r.link}" target="_blank" rel="noopener">Open</a>` : ''}</td>
        </tr>
    `).join('');
}

function filterTrackerRows() {
    let rows = [...trackerRows];
    const status = trackerFilterStatus?.value || '';
    const windowValue = trackerFilterWindow?.value || '7';
    const followUpOnly = trackerFilterFollowUp?.checked;
    if (status) {
        rows = rows.filter(r => (r.status || '') === status);
    }
    if (windowValue !== 'all') {
        const now = new Date();
        const since = new Date(now.getTime() - Number(windowValue) * 86400000);
        rows = rows.filter(r => {
            const d = normalizeDate(r.appliedDate || r.timestamp);
            return d && d >= since;
        });
    }
    if (followUpOnly) {
        const now = new Date();
        rows = rows.filter(r => {
            const d = normalizeDate(r.followUpDate);
            return d && d <= now;
        });
    }
    const stats = computeTrackerStats(rows, windowValue);
    renderTrackerStats(stats);
    renderTrackerTable(rows);
}

async function loadTrackerRows() {
    if (!CMS_ENDPOINT || CMS_ENDPOINT.includes('PASTE_')) return;
    const res = await fetch(`${CMS_ENDPOINT}?mode=tracker_read`);
    if (!res.ok) throw new Error('Tracker load failed');
    const data = await res.json();
    trackerRows = data.rows || [];
    filterTrackerRows();
}

if (trackerRefreshBtn) {
    trackerRefreshBtn.addEventListener('click', () => {
        loadTrackerRows().catch(() => showToast('Tracker load failed.', 'error'));
    });
}

if (trackerFilterStatus) trackerFilterStatus.addEventListener('change', filterTrackerRows);
if (trackerFilterWindow) trackerFilterWindow.addEventListener('change', filterTrackerRows);
if (trackerFilterFollowUp) trackerFilterFollowUp.addEventListener('change', filterTrackerRows);

async function requestOtp(adminId) {
    try {
        const response = await fetch(JOURNAL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'request_otp', adminId })
        });
        if (!response.ok) throw new Error('OTP request failed');
        showToast('OTP sent to your email.', 'success');
        const code = window.prompt('Enter OTP from email');
        if (!code) return;
        const verify = await fetch(JOURNAL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'verify_otp', adminId, code })
        });
        const data = await verify.json();
        if (data && data.status === 'ok') {
            sessionStorage.setItem('journal_admin', '1');
            if (data.token) {
                sessionStorage.setItem(JOURNAL_TOKEN_KEY, data.token);
            }
            journalAdminPanel.classList.add('show');
            showToast('Admin access granted.', 'success');
            return;
        }
        showToast('OTP invalid or expired.', 'error');
    } catch (e) {
        showToast('OTP flow failed.', 'error');
    }
}

if (journalAddBtn) {
    journalAddBtn.addEventListener('click', () => {
        if (!journalTitle.value.trim() || !journalBody.value.trim()) {
            showToast('Add a title and short note.', 'info');
            return;
        }
        const posts = Array.from(journalGrid.querySelectorAll('.journal-card')).map(card => ({
            tag: card.querySelector('.journal-tag')?.textContent || '',
            title: card.querySelector('h3')?.textContent || '',
            body: card.querySelector('p')?.textContent || '',
            meta: card.querySelector('.journal-meta')?.textContent || ''
        }));
        posts.unshift({
            tag: journalTag.value.trim() || 'Note',
            title: journalTitle.value.trim(),
            body: journalBody.value.trim(),
            meta: 'Added just now'
        });
        renderJournal(posts);
        setupDragAndDrop();
        journalTitle.value = '';
        journalTag.value = '';
        journalBody.value = '';
        showToast('Post added. Click Save to keep it.', 'success');
    });
}

if (journalSaveBtn) {
    journalSaveBtn.addEventListener('click', saveJournal);
}
