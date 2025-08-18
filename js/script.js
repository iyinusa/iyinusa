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
class AwardsCarousel {
  constructor() {
    this.carousel = document.getElementById('awardsCarousel');
    this.track = document.getElementById('carouselTrack');
    this.slides = this.track?.querySelectorAll('.carousel-slide');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.dotsContainer = document.getElementById('carouselDots');
    
    this.currentSlide = 0;
    this.totalSlides = this.slides?.length || 0;
    this.autoPlayInterval = null;
    this.isTransitioning = false;
    this.autoPlayDelay = 4000; // 4 seconds
    this.isAutoPlayPaused = false;
    
    console.log('Carousel initialized:', {
      totalSlides: this.totalSlides,
      hasCarousel: !!this.carousel,
      hasTrack: !!this.track
    });
    
    if (this.carousel && this.totalSlides > 0) {
      this.init();
    }
  }
  
  init() {
    console.log('Initializing carousel...');
    this.createDots();
    this.addEventListeners();
    this.updateCarousel();
    this.startAutoPlay();
    this.addTouchSupport();
    this.addIntersectionObserver();
  }
  
  createDots() {
    if (!this.dotsContainer) return;
    
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToSlide(i);
      });
      this.dotsContainer.appendChild(dot);
    }
    console.log(`Created ${this.totalSlides} dots`);
  }
  
  addEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Previous button clicked');
        this.prevSlide();
      });
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Next button clicked');
        this.nextSlide();
      });
    }
    
    // Pause auto-play on hover
    if (this.carousel) {
      this.carousel.addEventListener('mouseenter', () => {
        console.log('Mouse entered carousel - pausing autoplay');
        this.isAutoPlayPaused = true;
        this.stopAutoPlay();
      });
      
      this.carousel.addEventListener('mouseleave', () => {
        console.log('Mouse left carousel - resuming autoplay');
        this.isAutoPlayPaused = false;
        this.startAutoPlay();
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isCarouselVisible() && !this.isTransitioning) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prevSlide();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextSlide();
        }
      }
    });
  }
  
  addTouchSupport() {
    if (!this.carousel) return;
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    this.carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.isAutoPlayPaused = true;
      this.stopAutoPlay();
    }, { passive: true });
    
    this.carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });
    
    this.carousel.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      const diffX = startX - currentX;
      const threshold = 50;
      
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      
      isDragging = false;
      this.isAutoPlayPaused = false;
      this.startAutoPlay();
    }, { passive: true });
  }
  
  addIntersectionObserver() {
    if (!window.IntersectionObserver || !this.carousel) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!this.isAutoPlayPaused) {
            this.startAutoPlay();
          }
        } else {
          this.stopAutoPlay();
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(this.carousel);
  }
  
  updateCarousel() {
    if (!this.track || this.isTransitioning) {
      console.log('Cannot update carousel - track missing or transitioning');
      return;
    }
    
    this.isTransitioning = true;
    console.log(`Updating carousel to slide ${this.currentSlide}`);
    
    // Calculate translateX based on card width (350px) plus gap (20px)
    const cardWidth = 370; // 350px card width + 20px gap
    const translateX = -this.currentSlide * cardWidth;
    this.track.style.transform = `translateX(${translateX}px)`;
    
    // Update dots
    const dots = this.dotsContainer?.querySelectorAll('.dot');
    if (dots) {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentSlide);
      });
    }
    
    // Update button states (for non-looping behavior)
    // Since we want looping, we'll keep buttons always enabled
    if (this.prevBtn) {
      this.prevBtn.disabled = false;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = false;
    }
    
    // Reset transition flag after animation
    setTimeout(() => {
      this.isTransitioning = false;
      console.log('Transition completed');
    }, 600);
    
    // Trigger slide animations
    this.animateSlideContent();
  }
  
  animateSlideContent() {
    const currentSlideEl = this.slides[this.currentSlide];
    if (!currentSlideEl) return;
    
    const awardCards = currentSlideEl.querySelectorAll('.award-card');
    
    awardCards.forEach((card, index) => {
      card.style.animation = 'none';
      setTimeout(() => {
        card.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
      }, 100);
    });
  }
  
  nextSlide() {
    if (this.isTransitioning) {
      console.log('Transition in progress, ignoring next slide');
      return;
    }
    
    console.log(`Moving to next slide from ${this.currentSlide}`);
    // Looping behavior: go to first slide after last
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
  }
  
  prevSlide() {
    if (this.isTransitioning) {
      console.log('Transition in progress, ignoring prev slide');
      return;
    }
    
    console.log(`Moving to previous slide from ${this.currentSlide}`);
    // Looping behavior: go to last slide before first
    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.updateCarousel();
  }
  
  goToSlide(index) {
    if (this.isTransitioning || index === this.currentSlide || index < 0 || index >= this.totalSlides) {
      console.log('Cannot go to slide:', { index, current: this.currentSlide, transitioning: this.isTransitioning });
      return;
    }
    
    console.log(`Going directly to slide ${index}`);
    this.currentSlide = index;
    this.updateCarousel();
  }
  
  startAutoPlay() {
    if (this.isAutoPlayPaused || this.totalSlides <= 1) {
      console.log('AutoPlay not started - paused or single slide');
      return;
    }
    
    this.stopAutoPlay();
    console.log('Starting autoplay...');
    this.autoPlayInterval = setInterval(() => {
      if (!this.isAutoPlayPaused && this.isCarouselVisible()) {
        console.log('AutoPlay: moving to next slide');
        this.nextSlide();
      }
    }, this.autoPlayDelay);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      console.log('Stopping autoplay');
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  isCarouselVisible() {
    if (!this.carousel) return false;
    const rect = this.carousel.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }
  
  destroy() {
    this.stopAutoPlay();
    // Remove event listeners if needed
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing carousel...');
  // Wait a bit to ensure all elements are rendered
  setTimeout(() => {
    window.awardsCarousel = new AwardsCarousel();
  }, 500);
});

// Reinitialize carousel on resize
window.addEventListener('resize', debounce(() => {
  if (window.awardsCarousel) {
    console.log('Window resized, updating carousel...');
    window.awardsCarousel.updateCarousel();
  }
}, 250));

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (window.awardsCarousel) {
    window.awardsCarousel.destroy();
  }
});
