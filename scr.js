// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Global Message Display with improved error handling
function showGlobalMessage(message, type = 'info') {
    const messageBox = document.getElementById('globalMessageBox');
    if (!messageBox) {
        console.warn('Global message box not found');
        return;
    }

    messageBox.textContent = message;
    messageBox.className = `global-message-box ${type}`;
    messageBox.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 5000);
}

// API Functions with improved error handling
async function fetchJobs() {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching jobs:', error);
        showGlobalMessage('Failed to load jobs. Please try again later.', 'error');
        return [];
    }
}

async function createJob(jobData) {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating job:', error);
        showGlobalMessage('Failed to create job. Please try again.', 'error');
        throw error;
    }
}

async function updateJob(jobId, jobData) {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating job:', error);
        showGlobalMessage('Failed to update job. Please try again.', 'error');
        throw error;
    }
}

async function deleteJob(jobId) {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error('Error deleting job:', error);
        showGlobalMessage('Failed to delete job. Please try again.', 'error');
        throw error;
    }
}

async function fetchApplications() {
    try {
        const response = await fetch(`${API_BASE_URL}/applications`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching applications:', error);
        showGlobalMessage('Failed to load applications. Please try again later.', 'error');
        return [];
    }
}

async function submitApplication(applicationData) {
    try {
        const response = await fetch(`${API_BASE_URL}/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(applicationData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error submitting application:', error);
        showGlobalMessage('Failed to submit application. Please try again.', 'error');
        throw error;
    }
}

async function fetchNews() {
    try {
        const response = await fetch(`${API_BASE_URL}/news`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching news:', error);
        showGlobalMessage('Failed to load news. Please try again later.', 'error');
        return [];
    }
}

// Enhanced hamburger menu for mobile navigation
let hamburgerMenuInitialized = false;
function setupHamburgerMenu() {
    if (hamburgerMenuInitialized) {
        return;
    }
    hamburgerMenuInitialized = true;
    
    const hamburger = document.querySelector('.hamburger');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (!hamburger || !sideMenu) {
        console.error('Hamburger menu elements not found!');
        return;
    }

    // Toggle menu function
    function toggleMenu() {
        hamburger.classList.toggle('active');
        sideMenu.classList.toggle('open');
        if (menuOverlay) {
            menuOverlay.classList.toggle('active');
        }
        document.body.style.overflow = sideMenu.classList.contains('open') ? 'hidden' : '';
        if (!sideMenu.classList.contains('open')) {
            closeAllDropdowns();
        }
    }

    // Close all dropdowns function
    function closeAllDropdowns() {
        const dropdowns = sideMenu.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
            const arrow = dropdown.querySelector('.arrow');
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Remove any existing onclick attributes
    hamburger.removeAttribute('onclick');
    
    // Add click event to hamburger
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Close button click event
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.removeAttribute('onclick');
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Overlay click to close menu
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Enhanced dropdown functionality
    const dropdowns = sideMenu.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        const arrow = dropdown.querySelector('.arrow');
        
        if (dropdownLink && dropdownContent) {
            dropdownLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('open');
                        const otherArrow = otherDropdown.querySelector('.arrow');
                        if (otherArrow) {
                            otherArrow.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('open');
                if (arrow) {
                    arrow.style.transform = dropdown.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
                dropdownLink.style.background = dropdown.classList.contains('open') ? 'rgba(255, 255, 255, 0.15)' : '';
            });
            
            // Enhanced hover effects for desktop
            if (window.innerWidth > 768) {
                dropdownLink.addEventListener('mouseenter', () => {
                    if (!dropdown.classList.contains('open')) {
                        dropdownLink.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                });
                dropdownLink.addEventListener('mouseleave', () => {
                    if (!dropdown.classList.contains('open')) {
                        dropdownLink.style.background = '';
                    }
                });
            }
        }
    });

    // Close menu when a non-dropdown link is clicked
    const menuLinks = sideMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.parentElement.classList.contains('dropdown')) {
                return;
            }
            setTimeout(() => {
                toggleMenu();
            }, 100);
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (sideMenu.classList.contains('open')) {
                toggleMenu();
            }
        }
    });

    // Close menu on window resize (if desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && sideMenu.classList.contains('open')) {
            toggleMenu();
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!sideMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeAllDropdowns();
        }
    });
}

// Global toggle menu function (for backward compatibility)
window.toggleMenu = function() {
    const hamburger = document.querySelector('.hamburger');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (hamburger && sideMenu) {
        hamburger.classList.toggle('active');
        sideMenu.classList.toggle('open');
        if (menuOverlay) {
            menuOverlay.classList.toggle('active');
        }
        document.body.style.overflow = sideMenu.classList.contains('open') ? 'hidden' : '';
        if (!sideMenu.classList.contains('open')) {
            const dropdowns = sideMenu.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
                const arrow = dropdown.querySelector('.arrow');
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        }
    }
}

// Enhanced form handling
function setupFormHandling() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
            
            // Re-enable button after a delay (in case of errors)
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }, 5000);
        });
    });
}

// Enhanced scroll handling
function setupScrollHandling() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        // Sticky navbar shadow on scroll
        if (window.scrollY > 20) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
        
        // Scroll to top button
        const btn = document.getElementById('scrollToTopBtn');
        if (btn) {
            if (window.scrollY > 200) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        }
        
        // Debounced scroll events for performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Additional scroll-based functionality can be added here
        }, 100);
    });
    
    // Scroll to top action
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Enhanced touch handling for mobile
function setupTouchHandling() {
    if ('ontouchstart' in window) {
        // Add touch-specific enhancements
        document.body.classList.add('touch-device');
        
        // Improve touch targets
        const touchTargets = document.querySelectorAll('.btn, .navbar .nav-links ul li a, .side-menu a');
        touchTargets.forEach(target => {
            target.style.minHeight = '44px';
            target.style.minWidth = '44px';
        });
    }
}

// Initialize the application with enhanced error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        setupHamburgerMenu();
        setupFormHandling();
        setupScrollHandling();
        setupTouchHandling();
        
        // Fallback initialization after a short delay
        setTimeout(() => {
            if (!hamburgerMenuInitialized) {
                setupHamburgerMenu();
            }
        }, 1000);
        
        // Initialize page-specific functionality
        if (typeof initPage === 'function') {
            initPage();
        }
        
        console.log('Website initialized successfully');
    } catch (error) {
        console.error('Error during website initialization:', error);
        showGlobalMessage('There was an error loading the website. Please refresh the page.', 'error');
    }
});

// Enable click-to-open for desktop dropdowns in the header
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.navbar .dropdown > a').forEach(link => {
      link.addEventListener('click', function(e) {
        if (window.innerWidth >= 1025) {
          e.preventDefault();
          const parent = this.parentElement;
          // Close other open dropdowns
          document.querySelectorAll('.navbar .dropdown.open').forEach(d => {
            if (d !== parent) d.classList.remove('open');
          });
          parent.classList.toggle('open');
        }
      });
    });
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth >= 1025) {
        if (!e.target.closest('.navbar .dropdown')) {
          document.querySelectorAll('.navbar .dropdown.open').forEach(d => d.classList.remove('open'));
        }
      }
    });
  });
} 