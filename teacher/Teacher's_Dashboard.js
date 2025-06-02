// رسم مخطط عدد الطلاب باستخدام Chart.js
window.onload = function() {
    // بيانات افتراضية لعدد الطلاب في الفصول
    const classLabels = ['الأول أ', 'الأول ب', 'الثاني أ', 'الثاني ب', 'الثالث أ', 'الثالث ب'];
    const studentsData = [20, 18, 22, 19, 17, 16];
    const ctx = document.getElementById('studentsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: classLabels,
            datasets: [{
                label: 'عدد الطلاب',
                data: studentsData,
                backgroundColor: '#4bb36d',
                borderRadius: 8,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 2
                    }
                }
            }
        }
    });

    // تفعيل نموذج تخصيص المواد والفصول
    const assignForm = document.getElementById('assign-form');
    const subjectSelect = document.getElementById('subject-select');
    const classSelect = document.getElementById('class-select');
    const assignedList = document.querySelector('#assigned-list ul');
    let assignedItems = [];

    assignForm.onsubmit = function(e) {
        e.preventDefault();
        const subject = subjectSelect.value;
        const className = classSelect.value;
        // تحقق من عدم التكرار
        const exists = assignedItems.some(item => item.subject === subject && item.className === className);
        if (!exists) {
            assignedItems.push({ subject, className });
            updateAssignedList();
        }
    };

    function updateAssignedList() {
        assignedList.innerHTML = '';
        assignedItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.subject} - ${item.className}`;
            assignedList.appendChild(li);
        });
    }

    // إدارة عرض الأقسام
    const sections = ['dashboard', 'my-classes', 'homework', 'exams'];
    sections.forEach(section => {
        const link = document.getElementById(`${section}-link`);
        if (link) {
            link.addEventListener('click', () => {
                // إخفاء جميع الأقسام
                document.querySelectorAll('.teacher-main > div').forEach(div => {
                    div.style.display = 'none';
                });
                // إظهار القسم المطلوب
                const sectionElement = document.querySelector(`.${section}-section`);
                if (sectionElement) {
                    sectionElement.style.display = 'block';
                }
            });
        }
    });

    // التعامل مع نموذج إضافة الاختبار
    const addExamBtn = document.getElementById('add-exam-btn');
    const addExamForm = document.getElementById('add-exam-form');
    const cancelExamBtn = document.getElementById('cancel-exam-btn');
    const newExamForm = document.getElementById('new-exam-form');
    const examsList = document.getElementById('exams-list');

    if (addExamBtn && addExamForm) {
        addExamBtn.addEventListener('click', () => {
            addExamForm.style.display = 'block';
            addExamBtn.style.display = 'none';
        });
    }

    if (cancelExamBtn) {
        cancelExamBtn.addEventListener('click', () => {
            addExamForm.style.display = 'none';
            addExamBtn.style.display = 'block';
            newExamForm.reset();
        });
    }

    if (newExamForm) {
        newExamForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // جمع بيانات الاختبار
            const examData = {
                subject: document.getElementById('exam-subject').value,
                class: document.getElementById('exam-class').value,
                date: document.getElementById('exam-date').value,
                duration: document.getElementById('exam-duration').value,
                description: document.getElementById('exam-description').value
            };

            // إنشاء عنصر الاختبار الجديد
            const examElement = createExamElement(examData);
            examsList.appendChild(examElement);

            // إرسال إشعار للطلاب (يمكن تنفيذه من خلال API)
            sendExamNotification(examData);

            // إعادة تعيين النموذج وإخفائه
            newExamForm.reset();
            addExamForm.style.display = 'none';
            addExamBtn.style.display = 'block';
        });
    }

    // دالة لإنشاء عنصر الاختبار في واجهة المستخدم
    function createExamElement(examData) {
        const examDiv = document.createElement('div');
        examDiv.className = 'exam-item';
        
        const dateObj = new Date(examData.date);
        const formattedDate = dateObj.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        examDiv.innerHTML = `
            <h5>${examData.subject} - ${examData.class}</h5>
            <p>التاريخ: ${formattedDate}</p>
            <p>المدة: ${examData.duration} دقيقة</p>
            <p>الوصف: ${examData.description}</p>
        `;

        return examDiv;
    }

    // دالة لإرسال إشعار للطلاب
    function sendExamNotification(examData) {
        console.log('تم إرسال إشعار للطلاب حول الاختبار الجديد:', examData);
    }
};

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    setupSchedule();
    initializeCharts();

    // التحكم في الشريط الجانبي (مبسط)
    const sidebar = document.querySelector('.teacher-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainContent = document.getElementById('teacher-main-content');

    // داخل event listener لزر التبديل
sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    
    // إزالة التعديلات على المحتوى الرئيسي (غير ضرورية الآن)
    if (mainContent) {
        mainContent.classList.remove('expanded');
    }
});
});

// دالة تحميل بيانات لوحة التحكم
async function loadDashboardData() {
    const teacherData = {
        totalStudents: 120,
        totalSubjects: 4,
        activeHomework: 8,
        completedHomework: 15,
        upcomingExams: 3,
        completedExams: 12,
        publishedLessons: 45,
        lessonViews: 1250
    };

    document.getElementById('total-students').textContent = teacherData.totalStudents;
    document.getElementById('total-subjects').textContent = teacherData.totalSubjects;
    document.getElementById('active-homework').textContent = teacherData.activeHomework;
    document.getElementById('completed-homework').textContent = teacherData.completedHomework;
    document.getElementById('upcoming-exams').textContent = teacherData.upcomingExams;
    document.getElementById('completed-exams').textContent = teacherData.completedExams;
    document.getElementById('published-lessons').textContent = teacherData.publishedLessons;
    document.getElementById('lesson-views').textContent = teacherData.lessonViews;
}

// دالة إعداد جدول الحصص
function setupSchedule() {
    const scheduleData = [
        { time: '8:15 - 9:00', classes: ['رياضيات 6أ', '', 'علوم 7ب', 'رياضيات 8أ', ''] },
        { time: '9:00 - 9:45', classes: ['', 'فيزياء 9أ', 'رياضيات 6ب', '', 'علوم 8ب'] },
        { time: '9:45 - 10:30', classes: ['علوم 7أ', '', '', 'فيزياء 9ب', 'رياضيات 7ب'] },
        { time: '10:30 - 11:15', classes: ['', 'رياضيات 8ب', 'فيزياء 9أ', '', ''] },
        { time: '11:15 - 12:00', classes: ['فيزياء 9ب', '', '', 'رياضيات 6أ', 'علوم 7أ'] },
        { time: '12:00 - 12:45', classes: ['', 'علوم 8أ', 'رياضيات 7ب', '', 'فيزياء 9أ'] },
        { time: '12:45 - 1:30', classes: ['علوم 8ب', 'رياضيات 7أ', '', 'فيزياء 8أ', 'رياضيات 9ب'] }
    ];

    const scheduleBody = document.getElementById('schedule-body');
    scheduleBody.innerHTML = scheduleData.map(row => `
        <tr>
            <td>${row.time}</td>
            ${row.classes.map(cls => `
                <td class="${cls ? 'has-class' : ''}">${cls}</td>
            `).join('')}
        </tr>
    `).join('');
}

// دالة تهيئة الرسوم البيانية
function initializeCharts() {
    const homeworkCtx = document.getElementById('homeworkChart').getContext('2d');
    new Chart(homeworkCtx, {
        type: 'doughnut',
        data: {
            labels: ['قيد الانتظار', 'مكتمل', 'متأخر'],
            datasets: [{
                data: [8, 15, 3],
                backgroundColor: [
                    '#4068fc',
                    '#43cea2',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true,
                    labels: {
                        font: {
                            family: 'Cairo'
                        }
                    }
                }
            }
        }
    });
}













// نجرب اهني

function setupSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const teacherSidebar = document.getElementById('teacher-sidebar');
    const mainContent = document.getElementById('teacher-main-content');
    const teacherHeader = document.querySelector('.teacher-header');

    if (sidebarToggle && teacherSidebar && mainContent && teacherHeader) {
        sidebarToggle.onclick = function (e) {
            e.preventDefault();

            // تغيير حالة السايدبار
            const isCollapsed = teacherSidebar.classList.toggle('sidebar-collapsed');
            mainContent.classList.toggle('sidebar-collapsed');
            teacherHeader.classList.toggle('sidebar-collapsed');
            sidebarToggle.classList.toggle('sidebar-collapsed'); // ← تحريك الزر عند الإغلاق/الفتح

            // تعديل كلاس إضافي للهيدر إذا احتجت استخدامه
            if (!isCollapsed) {
                teacherHeader.classList.add('sidebar-open');
            } else {
                teacherHeader.classList.remove('sidebar-open');
            }

            const teacherTitle = document.querySelector('.teacher-title');
            if (teacherTitle) {
                teacherTitle.classList.toggle('sidebar-collapsed');
            }

        };

        // عند التحميل، تأكد من ضبط الكلاسات بشكل صحيح
        if (!teacherSidebar.classList.contains('sidebar-collapsed')) {
            teacherHeader.classList.add('sidebar-open');
        }
    }

    
}

function highlight(link) {
    document.querySelectorAll('.teacher-sidebar ul li a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
}

window.onload = function () {
    setupSidebar();
    renderDashboard();
    document.getElementById('dashboard-link').classList.add('active');
};