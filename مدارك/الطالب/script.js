// Global variables
let currentUser = {
    name: 'أحمد محمد',
    class: 'الصف العاشر - أ',
    studentId: 'ST2024001'
};

// DOM Elements
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const profileDropdown = document.getElementById('profileDropdown');
const profileMenu = document.getElementById('profileMenu');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadDashboardData();
});

// Event Listeners
function initializeEventListeners() {
    // Sidebar toggle for mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Profile dropdown
    if (profileDropdown) {
        profileDropdown.addEventListener('click', toggleProfileMenu);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!profileDropdown?.contains(event.target)) {
            closeProfileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
}

// Sidebar functions
function toggleSidebar() {
    if (sidebar) {
        sidebar.classList.toggle('translate-x-full');
        sidebarOverlay?.classList.toggle('hidden');
    }
}

function closeSidebar() {
    if (sidebar) {
        sidebar.classList.add('translate-x-full');
        sidebarOverlay?.classList.add('hidden');
    }
}

function handleResize() {
    if (window.innerWidth >= 1024) {
        closeSidebar();
    }
}

// Profile menu functions
function toggleProfileMenu() {
    profileMenu?.classList.toggle('hidden');
}

function closeProfileMenu() {
    profileMenu?.classList.add('hidden');
}

// Load dashboard data
function loadDashboardData() {
    loadTodaySchedule();
    loadPendingAssignments();
    loadRecentGrades();
    loadRecentAnnouncements();
}

// Load today's schedule
function loadTodaySchedule() {
    const container = document.getElementById('todaySchedule');
    if (!container) return;
    
    const todaySchedule = getTodaySchedule();
    
    if (todaySchedule.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">لا توجد حصص اليوم</p>';
        return;
    }
    
    const scheduleHTML = todaySchedule.map(item => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3 space-x-reverse">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-book text-blue-600 text-sm"></i>
                </div>
                <div>
                    <h4 class="font-medium text-gray-900">${item.subject}</h4>
                    <p class="text-sm text-gray-600">${item.teacher}</p>
                </div>
            </div>
            <div class="text-left">
                <p class="text-sm font-medium text-gray-900">${item.time}</p>
                <p class="text-xs text-gray-500">${item.room}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = scheduleHTML;
}

// Load pending assignments
function loadPendingAssignments() {
    const container = document.getElementById('pendingAssignments');
    if (!container) return;
    
    const assignments = getPendingAssignments();
    
    if (assignments.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">لا توجد واجبات معلقة</p>';
        return;
    }
    
    const assignmentsHTML = assignments.slice(0, 3).map(assignment => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover-card cursor-pointer">
            <div class="flex items-center space-x-3 space-x-reverse">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-tasks text-orange-600 text-sm"></i>
                </div>
                <div>
                    <h4 class="font-medium text-gray-900">${assignment.title}</h4>
                    <p class="text-sm text-gray-600">${assignment.subject}</p>
                </div>
            </div>
            <div class="text-left">
                <p class="text-sm font-medium ${getDueDateColor(assignment.dueDate)}">${formatDate(assignment.dueDate)}</p>
                <span class="inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(assignment.status)}">
                    ${getStatusText(assignment.status)}
                </span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = assignmentsHTML;
}

// Load recent grades
function loadRecentGrades() {
    const container = document.getElementById('recentGrades');
    if (!container) return;
    
    const grades = getRecentGrades();
    
    if (grades.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">لا توجد درجات حديثة</p>';
        return;
    }
    
    const gradesHTML = grades.slice(0, 4).map(grade => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3 space-x-reverse">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-star text-green-600 text-sm"></i>
                </div>
                <div>
                    <h4 class="font-medium text-gray-900">${grade.subject}</h4>
                    <p class="text-sm text-gray-600">${grade.type}</p>
                </div>
            </div>
            <div class="text-left">
                <p class="text-lg font-bold ${getGradeColor(grade.score)}">${grade.score}/${grade.total}</p>
                <p class="text-xs text-gray-500">${formatDate(grade.date)}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = gradesHTML;
}

// Load recent announcements
function loadRecentAnnouncements() {
    const container = document.getElementById('recentAnnouncements');
    if (!container) return;
    
    const announcements = getRecentAnnouncements();
    
    if (announcements.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">لا توجد إعلانات حديثة</p>';
        return;
    }
    
    const announcementsHTML = announcements.slice(0, 3).map(announcement => `
        <div class="p-3 bg-gray-50 rounded-lg">
            <div class="flex items-start space-x-3 space-x-reverse">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-bullhorn text-green-600 text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 mb-1">${announcement.title}</h4>
                    <p class="text-sm text-gray-600 mb-2">${announcement.content}</p>
                    <div class="flex items-center space-x-4 space-x-reverse text-xs text-gray-500">
                        <span><i class="fas fa-user ml-1"></i>${announcement.sender}</span>
                        <span><i class="fas fa-clock ml-1"></i>${formatDate(announcement.date)}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = announcementsHTML;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'اليوم';
    if (diffDays === 1) return 'غداً';
    if (diffDays === -1) return 'أمس';
    if (diffDays > 0 && diffDays <= 7) return `خلال ${diffDays} أيام`;
    if (diffDays < 0 && diffDays >= -7) return `منذ ${Math.abs(diffDays)} أيام`;
    
    return date.toLocaleDateString('ar-SA');
}

function getDueDateColor(dueDate) {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600';
    if (diffDays <= 2) return 'text-orange-600';
    return 'text-gray-900';
}

function getGradeColor(score) {
    const percentage = (score / 100) * 100;
    if (percentage >= 90) return 'grade-excellent';
    if (percentage >= 80) return 'grade-good';
    if (percentage >= 70) return 'grade-average';
    return 'grade-poor';
}

function getStatusClass(status) {
    switch (status) {
        case 'completed': return 'status-completed';
        case 'submitted': return 'status-submitted';
        case 'pending': return 'status-pending';
        case 'overdue': return 'status-overdue';
        default: return 'status-pending';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'completed': return 'مكتمل';
        case 'submitted': return 'تم التسليم';
        case 'pending': return 'معلق';
        case 'overdue': return 'متأخر';
        default: return 'معلق';
    }
}

// Show loading state
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="animate-pulse space-y-3">
            <div class="flex items-center space-x-3 space-x-reverse">
                <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div class="flex-1">
                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    `;
}

// Error handling
function showError(containerId, message = 'حدث خطأ في تحميل البيانات') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-center py-4">
            <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
            <p class="text-red-600">${message}</p>
        </div>
    `;
}
