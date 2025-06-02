// Dashboard specific functionality

class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.loadDashboardData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // Add click handlers for dashboard cards
        const cards = document.querySelectorAll('.bg-white.rounded-xl');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') return; // Don't interfere with links
                const link = card.querySelector('a');
                if (link) {
                    window.location.href = link.href;
                }
            });
        });
    }

    loadDashboardData() {
        // Simulate API call to load dashboard data
        const dashboardData = {
            todayRegistrations: 5,
            todayPayments: 12,
            todayAbsences: 8,
            pendingMessages: 3,
            recentRegistrations: [
                {
                    name: 'محمد أحمد علي',
                    class: 'الصف السادس أ',
                    time: 'منذ ساعتين'
                },
                {
                    name: 'فاطمة محمد سالم',
                    class: 'الصف الثالث ب',
                    time: 'منذ 3 ساعات'
                },
                {
                    name: 'عبدالله سعد الغامدي',
                    class: 'الصف الأول أ',
                    time: 'منذ 4 ساعات'
                }
            ],
            recentMessages: [
                {
                    sender: 'أحمد الأستاذ',
                    message: 'استفسار حول جدول الحصص الجديد',
                    time: 'منذ 30 دقيقة',
                    type: 'teacher'
                },
                {
                    sender: 'سعاد ولي أمر',
                    message: 'طلب تحديث بيانات الطالب',
                    time: 'منذ ساعة',
                    type: 'parent'
                },
                {
                    sender: 'خالد ولي أمر',
                    message: 'استفسار حول الرسوم الدراسية',
                    time: 'منذ ساعتين',
                    type: 'parent'
                }
            ]
        };

        this.updateDashboardUI(dashboardData);
    }

    updateDashboardUI(data) {
        // Update stats cards
        this.updateStatsCards(data);
        
        // Update recent activities
        this.updateRecentActivities(data);
    }

    updateStatsCards(data) {
        const stats = [
            { id: 'registrations', value: data.todayRegistrations },
            { id: 'payments', value: data.todayPayments },
            { id: 'absences', value: data.todayAbsences },
            { id: 'messages', value: data.pendingMessages }
        ];

        stats.forEach(stat => {
            const element = document.querySelector(`[data-stat="${stat.id}"]`);
            if (element) {
                element.textContent = stat.value;
                this.animateCounter(element, stat.value);
            }
        });
    }

    updateRecentActivities(data) {
        // Update recent registrations
        const registrationsContainer = document.querySelector('.space-y-4');
        if (registrationsContainer && data.recentRegistrations) {
            // Clear existing content
            registrationsContainer.innerHTML = '';
            
            data.recentRegistrations.forEach(registration => {
                const element = this.createRegistrationElement(registration);
                registrationsContainer.appendChild(element);
            });
        }

        // Update recent messages
        const messagesContainer = document.querySelectorAll('.space-y-4')[1];
        if (messagesContainer && data.recentMessages) {
            // Clear existing content
            messagesContainer.innerHTML = '';
            
            data.recentMessages.forEach(message => {
                const element = this.createMessageElement(message);
                messagesContainer.appendChild(element);
            });
        }
    }

    createRegistrationElement(registration) {
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-reverse space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer';
        
        const colors = ['blue', 'green', 'purple', 'orange', 'pink'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        div.innerHTML = `
            <div class="w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-${color}-600"></i>
            </div>
            <div class="flex-1">
                <h4 class="font-medium text-gray-800">${registration.name}</h4>
                <p class="text-sm text-gray-600">${registration.class} - ${registration.time}</p>
            </div>
        `;
        
        return div;
    }

    createMessageElement(message) {
        const div = document.createElement('div');
        div.className = 'flex items-start space-x-reverse space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer';
        
        const icon = message.type === 'teacher' ? 'fa-user-tie' : 'fa-user';
        const colors = {
            teacher: 'orange',
            parent: 'pink'
        };
        const color = colors[message.type] || 'blue';
        
        div.innerHTML = `
            <div class="w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center">
                <i class="fas ${icon} text-${color}-600"></i>
            </div>
            <div class="flex-1">
                <h4 class="font-medium text-gray-800
">${message.sender}</h4>
                <p class="text-sm text-gray-600 mt-1">${message.message}</p>
                <p class="text-xs text-gray-500 mt-2">${message.time}</p>
            </div>
        `;
        
        return div;
    }

    animateCounter(element, targetValue) {
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateNotificationCounts();
        }, 30000);
    }

    updateNotificationCounts() {
        // Simulate random updates to notification counts
        const notifications = document.querySelectorAll('.bg-red-500');
        notifications.forEach(notification => {
            const currentCount = parseInt(notification.textContent);
            const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
            notification.textContent = newCount;
            
            if (newCount === 0) {
                notification.classList.add('hidden');
            } else {
                notification.classList.remove('hidden');
            }
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.text-2xl').textContent.includes('لوحة المعلومات')) {
        new Dashboard();
    }
});
