// محاكاة قاعدة بيانات المدرسة
const schoolDatabase = [
    {
        id: 1,
        name: "أحمد محمد علي",
        class: "سادس أ",
        studentId: "2024001"
    },
    {
        id: 2,
        name: "فاطمة خالد عمر",
        class: "سابع ب",
        studentId: "2024002"
    },
    {
        id: 3,
        name: "محمد سالم إبراهيم",
        class: "ثامن أ",
        studentId: "2024003"
    },
    {
        id: 4,
        name: "نور أحمد حسين",
        class: "سادس ب",
        studentId: "2024004"
    }
];

// استرجاع بيانات الطلاب من localStorage أو إنشاء مصفوفة فارغة
let students = JSON.parse(localStorage.getItem('teacherStudents')) || [];

// دالة لحفظ بيانات الطلاب في localStorage
function saveStudentsData() {
    localStorage.setItem('teacherStudents', JSON.stringify(students));
}

// عناصر DOM
const modal = document.getElementById('add-student-modal');
const addStudentBtn = document.getElementById('add-student-btn');
const closeModal = document.querySelector('.close-modal');
const addStudentForm = document.getElementById('add-student-form');
const cancelAddStudent = document.getElementById('cancel-add-student');
const studentsList = document.getElementById('students-list');
const classFilter = document.getElementById('class-filter');
const subjectFilter = document.getElementById('subject-filter');
const searchInput = document.getElementById('search-input');
const studentSearch = document.getElementById('student-search');
const searchResults = document.getElementById('search-results');
const selectedStudentInfo = document.getElementById('selected-student-info');

let selectedStudent = null;

// عرض النافذة المنبثقة
addStudentBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    studentSearch.value = '';
    searchResults.innerHTML = '';
    selectedStudentInfo.style.display = 'none';
    selectedStudent = null;
});

// إغلاق النافذة المنبثقة
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    addStudentForm.reset();
    searchResults.innerHTML = '';
    selectedStudentInfo.style.display = 'none';
    selectedStudent = null;
});

cancelAddStudent.addEventListener('click', () => {
    modal.style.display = 'none';
    addStudentForm.reset();
    searchResults.innerHTML = '';
    selectedStudentInfo.style.display = 'none';
    selectedStudent = null;
});

// إغلاق النافذة عند النقر خارجها
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        addStudentForm.reset();
        searchResults.innerHTML = '';
        selectedStudentInfo.style.display = 'none';
        selectedStudent = null;
    }
});

// البحث عن الطلاب
studentSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    
    if (searchTerm.length < 2) {
        searchResults.innerHTML = '<p class="search-message">اكتب حرفين على الأقل للبحث...</p>';
        return;
    }

    const results = schoolDatabase.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.includes(searchTerm)
    );

    if (results.length === 0) {
        searchResults.innerHTML = '<p class="search-message">لم يتم العثور على نتائج</p>';
        return;
    }

    searchResults.innerHTML = results.map(student => `
        <div class="search-result-item" data-student-id="${student.id}">
            <div class="student-info">
                <strong>${student.name}</strong>
                <div class="student-details">
                    <span>الفصل: ${student.class}</span>
                    <span>رقم الطالب: ${student.studentId}</span>
                </div>
            </div>
        </div>
    `).join('');

    // إضافة مستمعي الأحداث لنتائج البحث
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const studentId = parseInt(item.dataset.studentId);
            selectStudent(studentId);
        });
    });
});

// تحديد طالب من نتائج البحث
function selectStudent(studentId) {
    selectedStudent = schoolDatabase.find(s => s.id === studentId);
    if (!selectedStudent) return;

    selectedStudentInfo.style.display = 'block';
    selectedStudentInfo.querySelector('.student-details').innerHTML = `
        <p><strong>الاسم:</strong> ${selectedStudent.name}</p>
        <p><strong>الفصل:</strong> ${selectedStudent.class}</p>
        <p><strong>رقم الطالب:</strong> ${selectedStudent.studentId}</p>
    `;

    searchResults.innerHTML = '';
    studentSearch.value = selectedStudent.name;
}

// إضافة طالب للمواد الدراسية
addStudentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!selectedStudent) {
        alert('الرجاء اختيار طالب أولاً');
        return;
    }

    const selectedSubjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked'))
        .map(checkbox => checkbox.value);

    if (selectedSubjects.length === 0) {
        alert('الرجاء اختيار مادة واحدة على الأقل');
        return;
    }

    // التحقق مما إذا كان الطالب موجود بالفعل
    const existingStudent = students.find(s => s.id === selectedStudent.id);
    if (existingStudent) {
        // تحديث المواد للطالب الموجود
        existingStudent.subjects = [...new Set([...existingStudent.subjects, ...selectedSubjects])];
    } else {
        // إضافة طالب جديد مع المواد المحددة
        students.push({
            ...selectedStudent,
            subjects: selectedSubjects
        });
    }

    // حفظ البيانات في localStorage
    saveStudentsData();

    // تحديث العرض وإعادة تعيين النموذج
    renderStudents(students);
    modal.style.display = 'none';
    addStudentForm.reset();
    searchResults.innerHTML = '';
    selectedStudentInfo.style.display = 'none';
    selectedStudent = null;
});

// تصفية الطلاب
function filterStudents() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedClass = classFilter.value;
    const selectedSubject = subjectFilter.value;

    let filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm);
        const matchesClass = selectedClass === 'all' || student.class === selectedClass;
        const matchesSubject = selectedSubject === 'all' || student.subjects.includes(selectedSubject);
        
        return matchesSearch && matchesClass && matchesSubject;
    });

    renderStudents(filteredStudents);
}

// إضافة مستمعي الأحداث للتصفية
searchInput.addEventListener('input', filterStudents);
classFilter.addEventListener('change', filterStudents);
subjectFilter.addEventListener('change', filterStudents);

// حذف طالب
function deleteStudent(studentId) {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
        students = students.filter(student => student.id !== studentId);
        // حفظ البيانات بعد الحذف
        saveStudentsData();
        renderStudents(students);
    }
}

// عرض الطلاب في الجدول
function renderStudents(studentsToRender) {
    studentsList.innerHTML = '';
    
    studentsToRender.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.subjects.map(subject => 
                `<span class="subject-tag">${subject}</span>`
            ).join('')}</td>
            <td>
                <button class="action-btn delete-btn" onclick="deleteStudent(${student.id})">🗑️</button>
            </td>
        `;
        studentsList.appendChild(row);
    });
}

// عرض الطلاب عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    renderStudents(students);
});

// Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.teacher-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainContent = document.querySelector('.students-container');
    const headerLeft = document.querySelector('.teacher-header-left');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        headerLeft.classList.toggle('expanded');
    });
}); 