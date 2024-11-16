// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-out',
    once: true,
    offset: 100
});

// Navigation active state handler
function setActiveNav() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('text-blue-600');
            link.classList.remove('text-gray-600');
        }
    });
}

// Scroll progress indicator
function initScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
    if (progress) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progress.style.width = `${scrolled}%`;
        });
    }
}

// Counter animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize stats counters
function initCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const end = parseInt(element.dataset.counter);
                animateValue(element, 0, end, 2000);
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    counterElements.forEach(element => observer.observe(element));
}

// Chart initialization (for impact.html)
function initCharts() {
    // Cost Savings Chart
    const costSavingsChart = document.getElementById('costSavingsChart');
    if (costSavingsChart) {
        new Chart(costSavingsChart.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Year 1', 'Year 2', 'Year 3'],
                datasets: [{
                    label: 'Cost Savings ($M)',
                    data: [2.5, 3.8, 5.2],
                    backgroundColor: '#2563eb'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Productivity Chart
    const productivityChart = document.getElementById('productivityChart');
    if (productivityChart) {
        new Chart(productivityChart.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Productivity Increase (%)',
                    data: [10, 20, 25, 30],
                    borderColor: '#2563eb',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    // ROI Projection Chart
    const roiChart = document.getElementById('roiProjectionChart');
    if (roiChart) {
        new Chart(roiChart.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
                datasets: [{
                    label: 'ROI Projection',
                    data: [-100, -50, 0, 50, 100, 150],
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
}

// Form validation and submission (for contact.html)
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/.netlify/functions/submit-contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    showNotification('Message sent successfully!', 'success');
                    form.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            }
        });
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } transition-opacity duration-300`;
    notification.textContent = message;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Mobile menu handler
function initMobileMenu() {
    const menuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Modal handler
function initModals() {
    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modalTrigger;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    initScrollProgress();
    initCounters();
    initCharts();
    initContactForm();
    initMobileMenu();
    initSmoothScroll();
    initModals();
});

// Handle dynamic content updates
document.addEventListener('contentChanged', () => {
    AOS.refresh();
    initCounters();
    initCharts();
});

// Export functions for use in other scripts if needed
export {
    showNotification,
    animateValue,
    initCharts,
    initContactForm
};
