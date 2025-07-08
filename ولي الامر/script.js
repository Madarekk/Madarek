document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const userMenuButton = document.getElementById('userMenuButton');
    const userMenu = document.getElementById('userMenu');
    const notificationButton = document.getElementById('notificationButton');
    const notificationMenu = document.getElementById('notificationMenu');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenuButton = document.getElementById('closeMobileMenuButton');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            userMenu.classList.toggle('hidden');
            if (notificationMenu) {
                notificationMenu.classList.add('hidden');
            }
        });
    }

    if (notificationButton && notificationMenu) {
        notificationButton.addEventListener('click', (event) => {
            event.stopPropagation();
            notificationMenu.classList.toggle('hidden');
            if (userMenu) {
                userMenu.classList.add('hidden');
            }
        });
    }

    document.addEventListener('click', (event) => {
        if (userMenu && !userMenu.classList.contains('hidden') && !userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
            userMenu.classList.add('hidden');
        }
        if (notificationMenu && !notificationMenu.classList.contains('hidden') && !notificationButton.contains(event.target) && !notificationMenu.contains(event.target)) {
            notificationMenu.classList.add('hidden');
        }
    });

    if (mobileMenuButton && closeMobileMenuButton && mobileMenuOverlay) {
        const overlayBackground = mobileMenuOverlay.querySelector('div:first-child');

        mobileMenuButton.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('hidden');
        });

        closeMobileMenuButton.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('hidden');
        });

        if (overlayBackground) {
            overlayBackground.addEventListener('click', () => {
                mobileMenuOverlay.classList.add('hidden');
            });
        }
    }
});
