document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenuButton = document.getElementById('closeMobileMenuButton');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenu = document.getElementById('mobileMenu');

    const notificationsButton = document.getElementById('notificationsButton');
    const notificationsDropdown = document.getElementById('notificationsDropdown');

    const notificationButton = document.getElementById('notificationButton');
    const notificationMenu = document.getElementById('notificationMenu');

    const userMenuButton = document.getElementById('userMenuButton');
    const userMenu = document.getElementById('userMenu');

    const toggleMobileMenu = (show) => {
        if (show) {
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenu.classList.add('show');
        } else {
            mobileMenu.classList.remove('show');
            setTimeout(() => {
                mobileMenuOverlay.classList.add('hidden');
            }, 300);
        }
    };
    
    mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu(true);
    });

    closeMobileMenuButton.addEventListener('click', () => toggleMobileMenu(false));
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            toggleMobileMenu(false);
        }
    });

    const toggleDropdown = (button, dropdown) => {
        const isHidden = dropdown.classList.contains('hidden');
        document.querySelectorAll('.absolute.left-0.mt-2').forEach(d => d.classList.add('hidden'));
        if (isHidden) {
            dropdown.classList.remove('hidden');
        }
    };

    notificationsButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(notificationsButton, notificationsDropdown);
    });

    if (notificationButton && notificationMenu) {
        notificationButton.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.absolute.left-0.mt-2').forEach(d => {
                if (d !== notificationMenu) d.classList.add('hidden');
            });
            notificationMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!notificationMenu.classList.contains('hidden') && !notificationMenu.contains(e.target) && e.target !== notificationButton) {
                notificationMenu.classList.add('hidden');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (!notificationsDropdown.contains(e.target) && !notificationsButton.contains(e.target)) {
            notificationsDropdown.classList.add('hidden');
        }
    });

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', function(e) {
            if (!userMenu.classList.contains('hidden') && !userMenu.contains(e.target) && e.target !== userMenuButton) {
                userMenu.classList.add('hidden');
            }
        });
    }
});
