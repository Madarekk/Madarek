function setupSidebarToggle() {
    const sidebar = document.querySelector('.student-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const header = document.querySelector('.student-header');
    const main = document.querySelector('.student-main');
    const toggle = document.getElementById('sidebarToggle');
    const toggleInside = document.getElementById('sidebarToggleInside');
    function openSidebarMobile() {
        sidebar.classList.add('sidebar-open');
        if (overlay) overlay.classList.add('active');
        if (toggleInside) toggleInside.style.display = 'flex';
    }
    function closeSidebarMobile() {
        sidebar.classList.remove('sidebar-open');
        if (overlay) overlay.classList.remove('active');
        if (toggleInside) toggleInside.style.display = 'none';
    }
    function toggleSidebarDesktop() {
        sidebar.classList.toggle('sidebar-collapsed');
        if (header) header.classList.toggle('sidebar-collapsed');
        if (toggle) toggle.classList.toggle('sidebar-collapsed');
        if (main) main.classList.toggle('sidebar-collapsed');
    }
    if (toggle) {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (window.innerWidth <= 700) {
                if (sidebar.classList.contains('sidebar-open')) {
                    closeSidebarMobile();
                } else {
                    openSidebarMobile();
                }
            } else {
                toggleSidebarDesktop();
            }
        });
    }
    if (toggleInside) {
        toggleInside.addEventListener('click', function(e) {
            e.stopPropagation();
            closeSidebarMobile();
        });
    }
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeSidebarMobile();
        });
    }
    window.addEventListener('resize', function() {
        if (window.innerWidth > 700) {
            closeSidebarMobile();
        } else {
            sidebar.classList.remove('sidebar-collapsed');
            if (header) header.classList.remove('sidebar-collapsed');
            if (toggle) toggle.classList.remove('sidebar-collapsed');
            if (main) main.classList.remove('sidebar-collapsed');
            if (toggleInside) toggleInside.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupSidebarToggle();
    updateStudentName();
    updateProfileData();
});

// Highlight active sidebar link based on current page
window.addEventListener('DOMContentLoaded', function() {
    var sidebarLinks = document.querySelectorAll('.student-sidebar a');
    var current = window.location.pathname.split('/').pop();
    sidebarLinks.forEach(function(link) {
        var href = link.getAttribute('href');
        if (href && current && href.toLowerCase() === current.toLowerCase()) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    // تمييز زر النقاشات في الهيدر إذا كنا في صفحة النقاشات
    var messagesBtn = document.querySelector('.student-messages');
    if (messagesBtn && current && current.toLowerCase() === 'student_discussion.html') {
        messagesBtn.classList.add('active');
    } else if (messagesBtn) {
        messagesBtn.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var notifBtn = document.querySelector('.student-notifications');
    if (notifBtn) {
        notifBtn.addEventListener('click', function() {
            window.location.href = 'Student_Notifications.html';
        });
    }
});

// Dashboard mock data and dynamic linking
const dashboardData = {
    lessons: 12,
    homework: 5,
    grades: 4,
    attendance: 30,
    courses: 2,
    profile: {
        name: "عاطف محمد الحتوشي",
        details: "الصف: الثالث الثانوي\nالشعبة: علوم"
    }
};

function updateDashboard() {
    document.getElementById('lessons-count').textContent = dashboardData.lessons;
    document.getElementById('homework-count').textContent = dashboardData.homework;
    document.getElementById('grades-count').textContent = dashboardData.grades;
    document.getElementById('attendance-count').textContent = dashboardData.attendance;
    document.getElementById('courses-count').textContent = dashboardData.courses;
    document.getElementById('profile-name').textContent = dashboardData.profile.name;
    document.getElementById('profile-details').textContent = dashboardData.profile.details;
}

function setupDashboardLinks() {
    document.getElementById('lessons-card').onclick = () => location.href = 'Student_Lessons.html';
    document.getElementById('homework-card').onclick = () => location.href = 'Student_Homework.html';
    document.getElementById('grades-card').onclick = () => location.href = 'Student_Grades.html';
    document.getElementById('attendance-card').onclick = () => location.href = 'Student_Attendance.html';
    document.getElementById('courses-card').onclick = () => location.href = 'Student_Courses.html';
    document.getElementById('profile-btn').onclick = () => location.href = 'Student_Profile.html';
}

// Initialize dashboard if on dashboard page
if (document.getElementById('student-main-content')) {
    updateDashboard();
    setupDashboardLinks();
}

// حساب الدروس/الواجبات الجديدة (آخر 7 أيام)
function isNewItem(dateStr) {
    const today = new Date();
    const itemDate = new Date(dateStr);
    const diffDays = (today - itemDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
}
// حفظ آخر عنصر جديد تم عرضه لكل مادة
function markSubjectAsRead(type, subject, latestDate) {
    let readSubjects = JSON.parse(localStorage.getItem('readSubjects_' + type) || '{}');
    readSubjects[subject] = latestDate;
    localStorage.setItem('readSubjects_' + type, JSON.stringify(readSubjects));
}
function isSubjectRead(type, subject, latestDate) {
    let readSubjects = JSON.parse(localStorage.getItem('readSubjects_' + type) || '{}');
    return readSubjects[subject] === latestDate;
}

// بيانات الطالب (يمكن ربطها بالباك اند لاحقاً)
const studentData = {
    firstName: "سراج",
    lastName: "عريبي",
    fullName: "سراج عريبي",
    grade: "الثالث الثانوي",
    section: "علوم",
    profile: {
        name: "سراج عريبي",
        details: "الصف: الثالث الثانوي\nالشعبة: علوم"
    }
};

// تحديث اسم الطالب في كل الصفحات
function updateStudentName() {
    const studentUserElements = document.querySelectorAll('.student-user');
    studentUserElements.forEach(element => {
        element.textContent = studentData.fullName;
    });
}

// تحديث بيانات البروفايل
function updateProfileData() {
    const profileNameElements = document.querySelectorAll('#profile-name');
    const profileDetailsElements = document.querySelectorAll('#profile-details');
    
    profileNameElements.forEach(element => {
        if (element) element.textContent = studentData.profile.name;
    });
    
    profileDetailsElements.forEach(element => {
        if (element) element.textContent = studentData.profile.details;
    });
}

