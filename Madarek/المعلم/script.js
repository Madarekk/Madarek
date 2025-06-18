document.addEventListener('DOMContentLoaded', () => {
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenu = document.getElementById('userMenu');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileMenuButton = document.getElementById('closeMobileMenuButton');
    const notificationsButton = document.getElementById('notificationsButton');
    const notificationsDropdown = document.getElementById('notificationsDropdown');

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            userMenu.classList.toggle('hidden');
            if (notificationsDropdown && !notificationsDropdown.classList.contains('hidden')) {
                notificationsDropdown.classList.add('hidden');
            }
        });
    }

    if (notificationsButton && notificationsDropdown) {
        notificationsButton.addEventListener('click', (event) => {
            event.stopPropagation();
            notificationsDropdown.classList.toggle('hidden');
            if (userMenu && !userMenu.classList.contains('hidden')) {
                userMenu.classList.add('hidden');
            }
        });
    }

    if (mobileMenuButton && mobileMenuOverlay) {
        mobileMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            mobileMenuOverlay.classList.toggle('hidden');
        });
    }
    
    if (closeMobileMenuButton && mobileMenuOverlay) {
        closeMobileMenuButton.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('hidden');
        });
    }
    
    if (mobileMenuOverlay) {
        const mobileMenuBackground = mobileMenuOverlay.querySelector('div:first-child');
        if (mobileMenuBackground) {
            mobileMenuBackground.addEventListener('click', () => {
                mobileMenuOverlay.classList.add('hidden');
            });
        }
        const mobileNavLinks = mobileMenuOverlay.querySelectorAll('nav a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('javascript:')) {
                     setTimeout(() => {
                        mobileMenuOverlay.classList.add('hidden');
                    }, 100);
                } else {
                     mobileMenuOverlay.classList.add('hidden');
                }
            });
        });
    }

    document.addEventListener('click', (event) => {
        if (userMenu && !userMenu.classList.contains('hidden') && userMenuButton && !userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
            userMenu.classList.add('hidden');
        }
        if (notificationsDropdown && !notificationsDropdown.classList.contains('hidden') && notificationsButton && !notificationsButton.contains(event.target) && !notificationsDropdown.contains(event.target)) {
            notificationsDropdown.classList.add('hidden');
        }
    });

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split("/").pop() || "index.html";
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    window.toggleModal = (modalId, show) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.toggle('hidden', !show);
            if(show) {
                modal.scrollTop = 0; 
            }
        }
    };
    
    document.querySelectorAll('.close-modal-btn, .cancel-modal-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.closest('.modal')?.id || button.dataset.modalId;
            if (modalId) {
                toggleModal(modalId, false);
            }
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                toggleModal(modal.id, false);
            }
        });
    });
});
