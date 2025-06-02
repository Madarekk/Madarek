// التأكد من وجود مفتاح الدروس في localStorage
if (!localStorage.getItem('lessons')) {
    localStorage.setItem('lessons', JSON.stringify([]));
}

// المتغيرات العامة
let lessons = JSON.parse(localStorage.getItem('lessons')) || [];
let currentLessonId = null;

// عناصر DOM
const addLessonBtn = document.getElementById('add-lesson-btn');
const addLessonModal = document.getElementById('add-lesson-modal');
const addLessonForm = document.getElementById('add-lesson-form');
const closeModalBtns = document.querySelectorAll('.close-modal');
const cancelAddLesson = document.getElementById('cancel-add-lesson');
const lessonsList = document.getElementById('lessons-list');
const classFilter = document.getElementById('class-filter');
const subjectFilter = document.getElementById('subject-filter');
const searchInput = document.getElementById('search-input');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.teacher-sidebar');

// تحديث الإحصائيات
function updateStats() {
    const totalLessons = lessons.length;
    const weeklyLessons = lessons.filter(lesson => {
        const lessonDate = new Date(lesson.date);
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return lessonDate >= weekAgo && lessonDate <= today;
    }).length;
    const completedLessons = lessons.filter(lesson => 
        new Date(lesson.date) < new Date()
    ).length;

    document.getElementById('total-lessons').textContent = totalLessons;
    document.getElementById('weekly-lessons').textContent = weeklyLessons;
    document.getElementById('completed-lessons').textContent = completedLessons;
}

// تحديث قائمة الدروس
function updateLessonsList(filteredLessons = lessons) {
    lessonsList.innerHTML = '';
    
    filteredLessons.forEach(lesson => {
        const row = document.createElement('tr');
        const lessonDate = new Date(lesson.date);
        const today = new Date();
        const status = lessonDate < today ? 'مكتمل' : 'قادم';
        const statusClass = status === 'مكتمل' ? 'completed' : 'upcoming';

        row.innerHTML = `
            <td>${lesson.subject}</td>
            <td>${lesson.class}</td>
            <td>${lesson.title}</td>
            <td>${new Date(lesson.date).toLocaleDateString('ar-EG')}</td>
            <td>الحصة ${lesson.period}</td>
            <td><span class="status ${statusClass}">${status}</span></td>
            <td>
                <button onclick="editLesson(${lesson.id})" class="edit-btn">تعديل</button>
                <button onclick="deleteLesson(${lesson.id})" class="delete-btn">حذف</button>
            </td>
        `;
        lessonsList.appendChild(row);
    });
}

// تطبيق الفلاتر
function applyFilters() {
    const classValue = classFilter.value;
    const subjectValue = subjectFilter.value;
    const searchValue = searchInput.value.toLowerCase();

    let filteredLessons = lessons;

    if (classValue !== 'all') {
        filteredLessons = filteredLessons.filter(lesson => lesson.class === classValue);
    }

    if (subjectValue !== 'all') {
        filteredLessons = filteredLessons.filter(lesson => lesson.subject === subjectValue);
    }

    if (searchValue) {
        filteredLessons = filteredLessons.filter(lesson =>
            lesson.title.toLowerCase().includes(searchValue) ||
            lesson.description.toLowerCase().includes(searchValue)
        );
    }

    updateLessonsList(filteredLessons);
}

// إضافة مستمعي الأحداث للفلاتر
classFilter.addEventListener('change', applyFilters);
subjectFilter.addEventListener('change', applyFilters);
searchInput.addEventListener('input', applyFilters);

// فتح النافذة المنبثقة
function openModal() {
    addLessonModal.style.display = 'block';
    if (currentLessonId === null) {
        addLessonForm.reset();
        document.getElementById('modal-title').textContent = 'إضافة درس جديد';
        document.getElementById('form-submit-btn').textContent = 'إضافة الدرس';
    }
}

// إغلاق النافذة المنبثقة
function closeModal() {
    addLessonModal.style.display = 'none';
    currentLessonId = null;
}

// حفظ الدرس
function saveLesson(e) {
    e.preventDefault();

    const lessonData = {
        id: currentLessonId || Date.now(),
        title: document.getElementById('lesson-title').value,
        subject: document.getElementById('subject-select').value,
        class: document.getElementById('class-select').value,
        date: document.getElementById('lesson-date').value,
        period: document.getElementById('lesson-period').value,
        description: document.getElementById('lesson-description').value,
        objectives: document.getElementById('lesson-objectives').value
    };

    if (currentLessonId) {
        const index = lessons.findIndex(lesson => lesson.id === currentLessonId);
        lessons[index] = lessonData;
        showFeedback('تم تحديث الدرس بنجاح', 'success');
    } else {
        lessons.push(lessonData);
        showFeedback('تم إضافة الدرس بنجاح', 'success');
    }

    localStorage.setItem('lessons', JSON.stringify(lessons));
    closeModal();
    updateLessonsList();
    updateStats();
}

// تعديل الدرس
function editLesson(id) {
    const lesson = lessons.find(lesson => lesson.id === id);
    if (!lesson) return;

    currentLessonId = id;
    document.getElementById('modal-title').textContent = 'تعديل الدرس';
    document.getElementById('form-submit-btn').textContent = 'حفظ التعديلات';
    
    document.getElementById('lesson-title').value = lesson.title;
    document.getElementById('subject-select').value = lesson.subject;
    document.getElementById('class-select').value = lesson.class;
    document.getElementById('lesson-date').value = lesson.date;
    document.getElementById('lesson-period').value = lesson.period;
    document.getElementById('lesson-description').value = lesson.description;
    document.getElementById('lesson-objectives').value = lesson.objectives;

    openModal();
}

// حذف الدرس
function deleteLesson(id) {
    if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
        lessons = lessons.filter(lesson => lesson.id !== id);
        localStorage.setItem('lessons', JSON.stringify(lessons));
        updateLessonsList();
        updateStats();
        showFeedback('تم حذف الدرس بنجاح', 'success');
    }
}

// عرض رسائل التنبيه
function showFeedback(message, type) {
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackElement = document.createElement('div');
    feedbackElement.className = `feedback-message feedback-${type}`;
    feedbackElement.textContent = message;

    feedbackContainer.appendChild(feedbackElement);
    setTimeout(() => {
        feedbackElement.remove();
    }, 3000);
}

// تبديل حالة الشريط الجانبي
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// إضافة مستمعي الأحداث
addLessonBtn.addEventListener('click', openModal);
closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
cancelAddLesson.addEventListener('click', closeModal);
addLessonForm.addEventListener('submit', saveLesson);
sidebarToggle.addEventListener('click', toggleSidebar);

// تحديث البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateLessonsList();
    updateStats();
});
