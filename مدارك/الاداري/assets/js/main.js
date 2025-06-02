// Main JavaScript functionality for the administrative interface

class MadarekAdmin {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupUserDropdown();
        this.setupNotifications();
        this.loadUserData();
    }

    // Setup event listeners
    setupEventListeners() {
        // Sidebar toggle for mobile
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Close sidebar on overlay click
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    // Setup mobile menu
    setupMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (window.innerWidth < 1024) {
            sidebar?.classList.add('hidden');
        }
    }

    // Toggle sidebar visibility
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('hidden');
            overlay.classList.toggle('hidden');
        }
    }

    // Close sidebar
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('hidden');
            overlay.classList.add('hidden');
        }
    }

    // Handle window resize
    handleResize() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (window.innerWidth >= 1024) {
            sidebar?.classList.remove('hidden');
            overlay?.classList.add('hidden');
        } else {
            sidebar?.classList.add('hidden');
            overlay?.classList.add('hidden');
        }
    }

    // Setup user dropdown
    setupUserDropdown() {
        const userMenuToggle = document.getElementById('userMenuToggle');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userMenuToggle && userDropdown) {
            userMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userDropdown.classList.add('hidden');
            });
        }
    }

    // Setup notifications
    setupNotifications() {
        // This would typically connect to a real-time notification system
        this.updateNotificationBadges();
    }

    // Update notification badges
    updateNotificationBadges() {
        // Simulate real-time updates
        const notifications = {
            bell: 3,
            envelope: 2
        };

        Object.keys(notifications).forEach(type => {
            const badge = document.querySelector(`.fa-${type}`).parentNode.querySelector('span');
            if (badge && notifications[type] > 0) {
                badge.textContent = notifications[type];
                badge.classList.remove('hidden');
            }
        });
    }

    // Load user data
    loadUserData() {
        // This would typically fetch from an API
        const userData = {
            name: 'أحمد الإداري',
            role: 'موظف إداري',
            avatar: 'أ'
        };

        this.updateUserInterface(userData);
    }

    // Update user interface with user data
    updateUserInterface(userData) {
        const userNameElement = document.querySelector('#userMenuToggle span');
        if (userNameElement) {
            userNameElement.textContent = userData.name;
        }

        const avatarElement = document.querySelector('#userMenuToggle .rounded-full span');
        if (avatarElement) {
            avatarElement.textContent = userData.avatar;
        }
    }

    // Show success message
    showSuccessMessage(message) {
        this.showAlert(message, 'success');
    }

    // Show error message
    showErrorMessage(message) {
        this.showAlert(message, 'error');
    }

    // Show alert message
    showAlert(message, type = 'info') {
        const alertContainer = this.getOrCreateAlertContainer();
        
        const alertElement = document.createElement('div');
        alertElement.className = `alert flex items-center p-4 mb-4 rounded-lg ${this.getAlertClasses(type)}`;
        
        alertElement.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${this.getAlertIcon(type)} ml-3"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="mr-auto text-lg hover:opacity-75" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        alertContainer.appendChild(alertElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.remove();
            }
        }, 5000);
    }

    // Get or create alert container
    getOrCreateAlertContainer() {
        let container = document.getElementById('alertContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'alertContainer';
            container.className = 'fixed top-20 left-4 z-50 w-80';
            document.body.appendChild(container);
        }
        return container;
    }

    // Get alert classes based on type
    getAlertClasses(type) {
        const classes = {
            success: 'bg-green-50 text-green-800 border border-green-200',
            error: 'bg-red-50 text-red-800 border border-red-200',
            warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
            info: 'bg-blue-50 text-blue-800 border border-blue-200'
        };
        return classes[type] || classes.info;
    }

    // Get alert icon based on type
    getAlertIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Format date in Arabic
    formatArabicDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        return new Intl.DateTimeFormat('ar-SA', options).format(date);
    }

    // Format currency in Arabic
    formatCurrency(amount) {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR'
        }).format(amount);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.madarekAdmin = new MadarekAdmin();
});

// Global utility functions
window.utils = {
    // Confirm dialog in Arabic
    confirm: (message, callback) => {
        if (confirm(message)) {
            callback();
        }
    },

    // Loading state
    showLoading: (element) => {
        const original = element.innerHTML;
        element.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i>جاري التحميل...';
        element.disabled = true;
        return () => {
            element.innerHTML = original;
            element.disabled = false;
        };
    },

    // Validate Arabic text
    isArabicText: (text) => {
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text);
    },

    // Validate email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};
