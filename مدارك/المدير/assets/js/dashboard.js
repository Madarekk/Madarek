// Dashboard specific functionality

class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.loadRecentStudents();
        this.loadRecentMessages();
        this.updateStatistics();
    }

    // Load recent students data
    loadRecentStudents() {
        const recentStudentsContainer = document.getElementById('recent-students');
        if (!recentStudentsContainer) return;

        // Sample data - in real app, this would come from API
        const recentStudents = [
            {
                name: 'محمد أحمد السالم',
                class: 'الصف السادس أ',
                date: '2024-01-15',
                status: 'مفعل'
            },
            {
                name: 'فاطمة علي الزهراني',
                class: 'الصف الخامس ب',
                date: '2024-01-14',
                status: 'مفعل'
            },
            {
                name: 'عبدالله محمد القحطاني',
                class: 'الصف الرابع أ',
                date: '2024-01-13',
                status: 'قيد المراجعة'
            },
            {
                name: 'نورا سعد الشهري',
                class: 'الصف الثالث ب',
                date: '2024-01-12',
                status: 'مفعل'
            }
        ];

        const studentsHTML = recentStudents.map(student => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-reverse space-x-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-blue-600"></i>
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${student.name}</p>
                        <p class="text-sm text-gray-500">${student.class}</p>
                    </div>
                </div>
                <div class="text-left">
                    <span class="badge ${student.status === 'مفعل' ? 'badge-success' : 'badge-warning'}">${student.status}</span>
                    <p class="text-xs text-gray-500 mt-1">${this.formatDate(student.date)}</p>
                </div>
            </div>
        `).join('');

        recentStudentsContainer.innerHTML = studentsHTML;
    }

    // Load recent messages data
    loadRecentMessages() {
        const recentMessagesContainer = document.getElementById('recent-messages');
        if (!recentMessagesContainer) return;

        // Sample data
        const recentMessages = [
            {
                sender: 'سارة أحمد (ولي أمر)',
                subject: 'استفسار حول واجبات الرياضيات',
                time: '2024-01-15 10:30',
                unread:
true
            },
            {
                sender: 'أحمد محمد العتيبي (معلم)',
                subject: 'تقرير غياب الطلاب',
                time: '2024-01-15 09:15',
                unread: false
            },
            {
                sender: 'منى علي الشهري (ولي أمر)',
                subject: 'طلب موعد مقابلة',
                time: '2024-01-14 16:45',
                unread: true
            },
            {
                sender: 'خالد سعد الغامدي (معلم)',
                subject: 'تحديث درجات الاختبار',
                time: '2024-01-14 14:20',
                unread: false
            }
        ];

        const messagesHTML = recentMessages.map(message => `
            <div class="flex items-start space-x-reverse space-x-3 p-3 bg-gray-50 rounded-lg ${message.unread ? 'border-r-4 border-accent' : ''}">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-envelope text-purple-600"></i>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                        <p class="font-medium text-gray-900 ${message.unread ? 'font-bold' : ''}">${message.sender}</p>
                        ${message.unread ? '<span class="w-2 h-2 bg-accent rounded-full"></span>' : ''}
                    </div>
                    <p class="text-sm text-gray-600 mb-1">${message.subject}</p>
                    <p class="text-xs text-gray-500">${this.formatDateTime(message.time)}</p>
                </div>
            </div>
        `).join('');

        recentMessagesContainer.innerHTML = messagesHTML;
    }

    // Update statistics (this would fetch real data from API)
    updateStatistics() {
        // Animate numbers counting up
        this.animateCounter('.stats-students', 450);
        this.animateCounter('.stats-teachers', 28);
        this.animateCounter('.stats-schedules', 15);
        this.animateCounter('.stats-content', 120);
    }

    animateCounter(selector, target) {
        const element = document.querySelector(selector);
        if (!element) return;

        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 30);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('ar-SA', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
