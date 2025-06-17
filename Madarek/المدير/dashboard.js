// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    // User Menu Toggle (Keep existing)
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenu = document.getElementById('userMenu');

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            userMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (event) => {
            if (userMenu && !userMenu.classList.contains('hidden')) {
                if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
                    userMenu.classList.add('hidden');
                }
            }
        });
    }

    // Mobile Menu Toggle (Keep existing)
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    // The specific close buttons (e.g., closeMobileMenuButtonUsers) are handled in their respective HTML files
    const closeMobileMenuButton = document.getElementById('closeMobileMenuButton'); // General one for index.html


    if (mobileMenuButton && mobileMenuOverlay) {
        mobileMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            mobileMenuOverlay.classList.toggle('hidden');
        });

        const mobileMenuBackground = mobileMenuOverlay.querySelector('div:first-child');
        if (mobileMenuBackground) {
            mobileMenuBackground.addEventListener('click', () => {
                 mobileMenuOverlay.classList.add('hidden');
            });
        }
        
        if (closeMobileMenuButton) { // Close button INSIDE the mobile menu (used in index.html)
             closeMobileMenuButton.addEventListener('click', () => {
                mobileMenuOverlay.classList.add('hidden');
            });
        }

        // Close mobile menu when a link is clicked
        const mobileNavLinks = mobileMenuOverlay.querySelectorAll('nav a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Small delay to allow navigation before hiding
                setTimeout(() => {
                     mobileMenuOverlay.classList.add('hidden');
                }, 100);
            });
        });
    }

    // Sidebar active state based on current page (Keep existing)
    const currentPage = window.location.pathname.split("/").pop();
    const sidebarLinks = document.querySelectorAll('nav ul li a');
    sidebarLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split("/").pop();
        if (linkPage === currentPage) {
            // Remove active classes from all links first
            document.querySelectorAll('nav ul li a.bg-primary').forEach(activeLink => {
                 if(activeLink !== link){
                    activeLink.classList.remove('bg-primary', 'text-white');
                    activeLink.classList.add('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-50');
                    const svg = activeLink.querySelector('svg');
                    if (svg) {
                        svg.classList.remove('text-white');
                        svg.classList.add('text-gray-400', 'group-hover:text-gray-500');
                    }
                 }
            });
            
            // Add active classes to the current link
            link.classList.remove('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-50');
            link.classList.add('bg-primary', 'text-white');
            const svgIcon = link.querySelector('svg');
            if (svgIcon) {
                svgIcon.classList.remove('text-gray-400', 'group-hover:text-gray-500');
                svgIcon.classList.add('text-white');
            }
        } else {
             // Ensure non-active links have standard styles
            link.classList.remove('bg-primary', 'text-white');
            link.classList.add('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-50');
            const svgIcon = link.querySelector('svg');
            if (svgIcon) {
                 svgIcon.classList.remove('text-white');
                 svgIcon.classList.add('text-gray-400', 'group-hover:text-gray-500');
            }
        }
    });
    
    // Handle Quick Actions from index.html that use URL parameters
    // This logic is handled within the target pages' JS (e.g., users.js, classes.js)

    console.log('dashboard.js loaded. Menus and sidebar active state initialized. Page-specific JS (e.g., users.js, classes.js) handles quick actions via URL parameters.');

    // Notifications Dropdown
    const notificationButton = document.getElementById('notificationButton');
    const notificationsDropdown = document.getElementById('notificationsDropdown');

    if (notificationButton && notificationsDropdown) {
        // Toggle notifications dropdown
        notificationButton.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationsDropdown.classList.toggle('hidden');
        });

        // Close notifications dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationsDropdown.contains(e.target) && !notificationButton.contains(e.target)) {
                notificationsDropdown.classList.add('hidden');
            }
        });

        // Prevent dropdown from closing when clicking inside it
        notificationsDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});
