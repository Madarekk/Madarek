// Main JavaScript file for common functionality

class MainApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupSidebar();
        this.setupUserMenu();
        this.setupNotifications();
        this.updateActiveNavItem();
    }

    // Sidebar functionality
    setupSidebar() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');

        if (sidebarToggle && sidebar && sidebarOverlay) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('show');
                sidebarOverlay.classList.toggle('hidden');
            });

            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('show');
                sidebarOverlay.classList.add('hidden');
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                sidebar.classList.remove('show');
                sidebarOverlay.classList.add('hidden');
            }
        });
    }

    // User menu dropdown
    setupUserMenu() {
        const userMenuButton = document.getElementById('user-menu-button');
        const userDropdown = document.getElementById('user-dropdown');

        if (userMenuButton && userDropdown) {
            userMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target) && !userMenuButton.contains(e.target)) {
                    userDropdown.classList.add('hidden');
                }
            });
        }
    }

    // Notifications setup
    setupNotifications() {
        // This would integrate with a real notification system
        console.log('Notifications system initialized');
    }

    // Update active navigation item based on current page
    updateActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href && (href.includes(currentPage) || (currentPage === 'index.html' && href === 'index.html'))) {
                item.classList.add('active');
            }
        });
    }

    // Utility functions
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 left-4 bg-${type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'}-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 fade-in`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    static formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return new Date(date).toLocaleDateString('ar-SA', options);
    }

    static formatTime(time) {
        return new Date(`2000-01-01 ${time}`).toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});

// Global utility functions
window.showNotification = MainApp.showNotification;
window.formatDate = MainApp.formatDate;
window.formatTime = MainApp.formatTime;
