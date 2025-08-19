// ===== GLOBAL VARIABLES =====
let currentSection = 'home';
let isScrolling = false;
let theme = localStorage.getItem('theme') || 'light';

// ===== DOM ELEMENTS =====
const elements = {
  body: document.body,
  sidebar: document.getElementById('sidebar'),
  mainContent: document.getElementById('mainContent'),
  themeToggle: document.getElementById('themeToggle'),
  mobileMenuToggle: document.getElementById('mobileMenuToggle'),
  loadingScreen: document.getElementById('loadingScreen'),
  sections: document.querySelectorAll('.section'),
  navLinks: document.querySelectorAll('.nav-link')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Set initial theme
  setTheme(theme);
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Initialize animations
  initializeAnimations();
  
  // Initialize intersection observer
  initializeIntersectionObserver();
  
  // Hide loading screen
  setTimeout(() => {
    elements.loadingScreen.classList.add('hidden');
  }, 1500);
  
  // Initialize parallax effects
  initializeParallax();
  
  // Initialize smooth scrolling
  initializeSmoothScrolling();
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
  // Theme toggle
  elements.themeToggle?.addEventListener('click', toggleTheme);
  
  // Mobile menu toggle
  elements.mobileMenuToggle?.addEventListener('click', toggleMobileMenu);
  
  // Navigation links
  elements.navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', handleOutsideClick);
  
  // Scroll events
  window.addEventListener('scroll', throttle(handleScroll, 16));
  
  // Resize events
  window.addEventListener('resize', throttle(handleResize, 250));
  
  // CTA buttons
  const ctaButtons = document.querySelectorAll('[data-section]');
  ctaButtons.forEach(button => {
    button.addEventListener('click', handleNavClick);
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyNavigation);
}

// ===== THEME MANAGEMENT =====
function setTheme(newTheme) {
  theme = newTheme;
  elements.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update theme toggle icon
  if (elements.themeToggle) {
    const icon = elements.themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

function toggleTheme() {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  
  // Add visual feedback
  elements.themeToggle.style.transform = 'scale(0.8)';
  setTimeout(() => {
    elements.themeToggle.style.transform = 'scale(1)';
  }, 150);
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  elements.sidebar.classList.toggle('open');
  
  // Update mobile menu icon
  const icon = elements.mobileMenuToggle.querySelector('i');
  const isOpen = elements.sidebar.classList.contains('open');
  icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
  
  // Prevent body scroll when menu is open
  elements.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
  elements.sidebar.classList.remove('open');
  const icon = elements.mobileMenuToggle.querySelector('i');
  icon.className = 'fas fa-bars';
  elements.body.style.overflow = '';
}

function handleOutsideClick(e) {
  if (window.innerWidth <= 768) {
    const isClickInSidebar = elements.sidebar.contains(e.target);
    const isClickOnToggle = elements.mobileMenuToggle.contains(e.target);
    
    if (!isClickInSidebar && !isClickOnToggle && elements.sidebar.classList.contains('open')) {
      closeMobileMenu();
    }
  }
}

// ===== NAVIGATION =====
function handleNavClick(e) {
  e.preventDefault();
  
  const targetSection = e.target.closest('[data-section]')?.getAttribute('data-section') ||
                       e.target.getAttribute('data-section');
  
  if (targetSection) {
    navigateToSection(targetSection);
    
    // Close mobile menu if open
    if (window.innerWidth <= 768) {
      closeMobileMenu();
    }
  }
}

function navigateToSection(sectionId) {
  if (isScrolling || sectionId === currentSection) return;
  
  isScrolling = true;
  currentSection = sectionId;
  
  // Update active nav link
  updateActiveNavLink(sectionId);
  
  // Smooth scroll to section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
  
  // Reset scrolling flag after animation
  setTimeout(() => {
    isScrolling = false;
  }, 1000);
}

function updateActiveNavLink(sectionId) {
  elements.navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    }
  });
}

// ===== SCROLL HANDLING =====
function handleScroll() {
  // Update active section based on scroll position
  if (!isScrolling) {
    updateActiveSection();
  }
  
  // Parallax effects
  updateParallaxEffects();
}

function updateActiveSection() {
  const scrollPosition = window.scrollY + window.innerHeight / 2;
  
  elements.sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.id;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      if (currentSection !== sectionId) {
        currentSection = sectionId;
        updateActiveNavLink(sectionId);
        
        // Trigger section animations
        animateSection(section);
      }
    }
  });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
  // Animate profile image on load
  const profileImg = document.getElementById('profileImg');
  if (profileImg) {
    profileImg.style.transform = 'scale(0)';
    setTimeout(() => {
      profileImg.style.transition = 'transform 0.5s ease-out';
      profileImg.style.transform = 'scale(1)';
    }, 500);
  }
  
  // Animate navigation links
  elements.navLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      link.style.transition = 'all 0.3s ease-out';
      link.style.opacity = '1';
      link.style.transform = 'translateX(0)';
    }, 200 + index * 100);
  });
}

function animateSection(section) {
  if (!section.classList.contains('animated')) {
    section.classList.add('animated');
    
    // Animate section elements
    const elements = section.querySelectorAll('.timeline-item, .project-card, .education-item, .stat-item');
    elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      setTimeout(() => {
        element.style.transition = 'all 0.6s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }
}

// ===== INTERSECTION OBSERVER =====
function initializeIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger specific animations for different sections
        const sectionId = entry.target.id;
        if (sectionId === 'publications') {
          animatePublications();
        } else if (sectionId === 'awards') {
          animateAwards();
        }
      }
    });
  }, observerOptions);
  
  elements.sections.forEach(section => {
    observer.observe(section);
  });
}

// ===== SECTION ANIMATIONS =====
function animatePublications() {
  const publicationCards = document.querySelectorAll('.publication-card');
  publicationCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease-out';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 150);
  });
}

function animateAwards() {
  const awardCards = document.querySelectorAll('.award-card');
  awardCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease-out';
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, index * 100);
  });
}

// ===== PARALLAX EFFECTS =====
function initializeParallax() {
  // Initialize parallax elements
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  parallaxElements.forEach(element => {
    element.style.transform = 'translateY(0px) scale(1)';
  });
}

function updateParallaxEffects() {
  const scrollY = window.scrollY;
  
  // Home section parallax
  const parallaxBg = document.querySelector('.parallax-bg');
  if (parallaxBg) {
    const rate = scrollY * -0.5;
    parallaxBg.style.transform = `translateY(${rate}px) scale(1.05)`;
  }
  
  // Scroll indicator fade
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    const opacity = Math.max(0, 1 - scrollY / 300);
    scrollIndicator.style.opacity = opacity;
  }
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
  // Enhanced smooth scrolling for better UX
  let isScrollingSmooth = false;
  
  document.addEventListener('wheel', (e) => {
    if (isScrollingSmooth) return;
    
    // Smooth wheel scrolling
    if (Math.abs(e.deltaY) > 50) {
      isScrollingSmooth = true;
      setTimeout(() => {
        isScrollingSmooth = false;
      }, 100);
    }
  });
}

// ===== KEYBOARD NAVIGATION =====
function handleKeyNavigation(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  switch (e.key) {
    case 'ArrowDown':
    case 'j':
      e.preventDefault();
      navigateToNextSection();
      break;
    case 'ArrowUp':
    case 'k':
      e.preventDefault();
      navigateToPrevSection();
      break;
    case 'Home':
      e.preventDefault();
      navigateToSection('home');
      break;
    case 'End':
      e.preventDefault();
      navigateToSection('certifications');
      break;
    case 'Escape':
      if (elements.sidebar.classList.contains('open')) {
        closeMobileMenu();
      }
      break;
  }
}

function navigateToNextSection() {
  const sections = ['home', 'about', 'education', 'experience', 'publications', 'awards', 'projects', 'certifications'];
  const currentIndex = sections.indexOf(currentSection);
  const nextIndex = (currentIndex + 1) % sections.length;
  navigateToSection(sections[nextIndex]);
}

function navigateToPrevSection() {
  const sections = ['home', 'about', 'education', 'experience', 'publications', 'awards', 'projects', 'certifications'];
  const currentIndex = sections.indexOf(currentSection);
  const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
  navigateToSection(sections[prevIndex]);
}

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== RESIZE HANDLING =====
function handleResize() {
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 768 && elements.sidebar.classList.contains('open')) {
    closeMobileMenu();
  }
  
  // Recalculate parallax effects
  updateParallaxEffects();
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Preload critical images
function preloadImages() {
  const imageUrls = [
    'images/avatar.png'
  ];
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
  // Add skip navigation
  const skipNav = document.createElement('a');
  skipNav.href = '#main-content';
  skipNav.textContent = 'Skip to main content';
  skipNav.className = 'skip-nav';
  skipNav.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--blue-primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10000;
    transition: top 0.3s;
  `;
  
  skipNav.addEventListener('focus', () => {
    skipNav.style.top = '6px';
  });
  
  skipNav.addEventListener('blur', () => {
    skipNav.style.top = '-40px';
  });
  
  document.body.insertBefore(skipNav, document.body.firstChild);
  
  // Add aria-labels and roles
  elements.themeToggle?.setAttribute('aria-label', 'Toggle dark/light theme');
  elements.mobileMenuToggle?.setAttribute('aria-label', 'Toggle mobile menu');
  
  // Add focus indicators
  const style = document.createElement('style');
  style.textContent = `
    .nav-link:focus,
    .btn:focus,
    .social-link:focus,
    .theme-toggle:focus,
    .mobile-menu-toggle:focus {
      outline: 2px solid var(--blue-primary);
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// ===== EASTER EGGS AND SPECIAL EFFECTS =====
function initializeEasterEggs() {
  let konamiCode = [];
  const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  
  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-konamiSequence.length);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
      triggerSpecialEffect();
    }
  });
}

function triggerSpecialEffect() {
  // Fun animation effect
  const body = document.body;
  body.style.animation = 'rainbow 2s ease-in-out';
  
  setTimeout(() => {
    body.style.animation = '';
  }, 2000);
  
  // Add rainbow animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      25% { filter: hue-rotate(90deg); }
      50% { filter: hue-rotate(180deg); }
      75% { filter: hue-rotate(270deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// Initialize easter eggs
document.addEventListener('DOMContentLoaded', initializeEasterEggs);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Portfolio Error:', e.error);
  // Graceful degradation - ensure basic functionality works
  if (!elements.loadingScreen.classList.contains('hidden')) {
    elements.loadingScreen.classList.add('hidden');
  }
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setTheme,
    navigateToSection,
    updateActiveNavLink,
    throttle,
    debounce
  };
}

// ===== AWARDS CAROUSEL FUNCTIONALITY =====

