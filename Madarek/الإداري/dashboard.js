document.addEventListener('DOMContentLoaded', () => {
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenu = document.getElementById('userMenu');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileMenuButton = document.getElementById('closeMobileMenuButton');

    const notificationButton = document.getElementById('notificationButton');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotificationPanel = document.getElementById('closeNotificationPanel');
    const noNotificationsMessage = document.getElementById('noNotifications');

    const chatButton = document.getElementById('chatButton');
    const chatPanel = document.getElementById('chatPanel');
    const closeChatPanel = document.getElementById('closeChatPanel');
    const noChatsMessage = document.getElementById('noChats');

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            userMenu.classList.toggle('hidden');
            if (notificationPanel && !notificationPanel.classList.contains('hidden')) notificationPanel.classList.add('hidden');
            if (chatPanel && !chatPanel.classList.contains('hidden')) chatPanel.classList.add('hidden');
        });
    }

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
        
        if (closeMobileMenuButton) {
             closeMobileMenuButton.addEventListener('click', () => {
                mobileMenuOverlay.classList.add('hidden');
            });
        }

        const mobileNavLinks = mobileMenuOverlay.querySelectorAll('nav a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                     mobileMenuOverlay.classList.add('hidden');
                }, 100);
            });
        });
    }

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const sidebarLinks = document.querySelectorAll('nav ul li a');
    sidebarLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split("/").pop() || "index.html";
        const svgIcon = link.querySelector('svg');

        if (linkPage === currentPage) {
            link.classList.remove('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-50');
            link.classList.add('bg-primary', 'text-white');
            if (svgIcon) {
                svgIcon.classList.remove('text-gray-400', 'group-hover:text-gray-500');
                svgIcon.classList.add('text-white');
            }
        } else {
            link.classList.remove('bg-primary', 'text-white');
            link.classList.add('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-50');
            if (svgIcon) {
                 svgIcon.classList.remove('text-white');
                 svgIcon.classList.add('text-gray-400', 'group-hover:text-gray-500');
            }
        }
    });

    if (notificationButton && notificationPanel) {
        notificationButton.addEventListener('click', (event) => {
            event.stopPropagation();
            notificationPanel.classList.toggle('hidden');
            if (userMenu && !userMenu.classList.contains('hidden')) userMenu.classList.add('hidden');
            if (chatPanel && !chatPanel.classList.contains('hidden')) chatPanel.classList.add('hidden');
            
            const notificationItemsContainer = notificationPanel.querySelector('.p-4.max-h-80.overflow-y-auto');
            if (notificationItemsContainer && noNotificationsMessage) {
                const notificationItems = notificationItemsContainer.querySelectorAll('div.flex.items-start');
                noNotificationsMessage.classList.toggle('hidden', notificationItems.length > 0);
            }
        });
        if(closeNotificationPanel) {
            closeNotificationPanel.addEventListener('click', () => notificationPanel.classList.add('hidden'));
        }
    }

    if (chatButton && chatPanel) {
        chatButton.addEventListener('click', (event) => {
            event.stopPropagation();
            chatPanel.classList.toggle('hidden');
            if (userMenu && !userMenu.classList.contains('hidden')) userMenu.classList.add('hidden');
            if (notificationPanel && !notificationPanel.classList.contains('hidden')) notificationPanel.classList.add('hidden');

            const chatItemsContainer = chatPanel.querySelector('.p-4.max-h-80.overflow-y-auto');
            if (chatItemsContainer && noChatsMessage) {
                 const chatItems = chatItemsContainer.querySelectorAll('div.flex.items-start');
                 noChatsMessage.classList.toggle('hidden', chatItems.length > 0);
            }
        });
        if(closeChatPanel) {
            closeChatPanel.addEventListener('click', () => chatPanel.classList.add('hidden'));
        }
    }

    document.addEventListener('click', (event) => {
        if (userMenu && !userMenu.classList.contains('hidden') && !userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
            userMenu.classList.add('hidden');
        }
        if (notificationPanel && !notificationPanel.classList.contains('hidden') && !notificationButton.contains(event.target) && !notificationPanel.contains(event.target)) {
            notificationPanel.classList.add('hidden');
        }
        if (chatPanel && !chatPanel.classList.contains('hidden') && !chatButton.contains(event.target) && !chatPanel.contains(event.target)) {
            chatPanel.classList.add('hidden');
        }
    });
});
