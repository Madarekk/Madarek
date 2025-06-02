// Notifications management functionality
class NotificationsManager {
    constructor() {
        this.data = null;
        this.unreadCount = 0;
    }

    setData(data) {
        this.data = data;
        this.updateNotificationCount();
    }

    updateNotificationCount() {
        if (!this.data) return;

        this.unreadCount = this.data.notifications.filter(n => !n.read).length;
        
        const badge = document.getElementById('notificationsBadge');
        if (badge) {
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        // Update messages count
        const messagesBadge = document.getElementById('messagesBadge');
        if (messagesBadge && this.data.conversations) {
            const unreadMessages = this.data.conversations.reduce((total, conv) => {
                return total + conv.messages.filter(msg => !msg.read && msg.sender !== 'parent').length;
            }, 0);
            
            if (unreadMessages > 0) {
                messagesBadge.textContent = unreadMessages;
                messagesBadge.classList.remove('hidden');
            } else {
                messagesBadge.classList.add('hidden');
            }
        }
    }

    markNotificationAsRead(notificationId) {
        if (!this.data) return;

        const notification = this.data.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.updateNotificationCount();
        }
    }

    markAllNotificationsAsRead() {
        if (!this.data) return;

        this.data.notifications.forEach(notification => {
            notification.read = true;
        });
        this.updateNotificationCount();
    }

    addNotification(notification) {
        if (!this.data) return;

        const newNotification = {
            id: Date.now().toString(),
            read: false,
            time: new Date().toLocaleString('ar-SA'),
            ...notification
        };

        this.data.notifications.unshift(newNotification);
        this.updateNotificationCount();

        // Show browser notification if permission granted
        this.showBrowserNotification(newNotification);
    }

    showBrowserNotification(notification) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico'
            });
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    simulateNewNotification() {
        // For demo purposes - simulate receiving a new notification
        const notificationTypes = [
            {
                type: 'grade',
                title: 'درجة جديدة',
                message: 'تم إضافة درجة جديدة لمادة الرياضيات'
            },
            {
                type: 'attendance',
                title: 'إشعار حضور',
                message: 'تأخر الطالب عن الحصة الأولى اليوم'
            },
            {
                type: 'assignment',
                title: 'واجب جديد',
                message: 'تم إضافة واجب جديد في مادة العلوم'
            },
            {
                type: 'fee',
                title: 'تذكير بالرسوم',
                message: 'موعد سداد الرسوم الدراسية يقترب'
            }
        ];

        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        this.addNotification(randomNotification);
    }
}

// Initialize notifications manager
window.notificationsManager = new NotificationsManager();

// Request notification permission on page load
document.addEventListener('DOMContentLoaded', () => {
    window.notificationsManager.requestNotificationPermission();
});
