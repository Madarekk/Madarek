// استرجاع بيانات الاختبارات من localStorage أو إنشاء مصفوفة فارغة
let exams = JSON.parse(localStorage.getItem('teacherExams')) || [];
let currentEditId = null;
let currentFileData = null;
let filteredExams = [...exams];

// دالة لتحويل الملف إلى Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// دالة لحفظ بيانات الاختبارات في localStorage
function saveExamData() {
    localStorage.setItem('teacherExams', JSON.stringify(exams));
    updateFilterLists();
    applyFilters();
    updateStatistics();
}

// عناصر DOM
const modal = document.getElementById('add-exam-modal');
const viewModal = document.getElementById('view-exam-modal');
const addExamBtn = document.getElementById('add-exam-btn');
const closeModals = document.querySelectorAll('.close-modal');
const addExamForm = document.getElementById('add-exam-form');
const cancelAddExam = document.getElementById('cancel-add-exam');
const examsList = document.getElementById('exams-list');
const subjectSelect = document.getElementById('subject-select');
const classSelect = document.getElementById('class-select');

// تحميل المواد والفصول المتاحة
function loadSubjectsAndClasses() {
    const allSubjects = [
        { id: 1, name: 'الرياضيات' },
        { id: 2, name: 'العلوم' },
        { id: 3, name: 'اللغة العربية' },
        { id: 4, name: 'اللغة الإنجليزية' },
        { id: 5, name: 'التاريخ' },
        { id: 6, name: 'الجغرافيا' },
        { id: 7, name: 'التربية الإسلامية' },
        { id: 8, name: 'الدراسات الاجتماعية' }
    ];
    
    const allClasses = [
        'سادس أ', 'سادس ب',
        'سابع أ', 'سابع ب',
        'ثامن أ', 'ثامن ب',
        'تاسع أ', 'تاسع ب'
    ];
    
    subjectSelect.innerHTML = '<option value="">اختر المادة</option>';
    allSubjects.forEach(subject => {
        subjectSelect.innerHTML += `<option value="${subject.name}">${subject.name}</option>`;
    });

    // تحديث قائمة الفصول
    function updateClassList() {
        classSelect.innerHTML = '<option value="">اختر الفصل</option>';
        allClasses.forEach(className => {
            classSelect.innerHTML += `<option value="${className}">${className}</option>`;
        });
    }

    // تحديث قائمة الفصول عند تغيير المادة
    subjectSelect.addEventListener('change', updateClassList);
    
    // تحديث قائمة الفصول عند تحميل الصفحة
    updateClassList();
}

// إغلاق النوافذ المنبثقة
closeModals.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        viewModal.style.display = 'none';
        resetForm();
    });
});

// عرض نافذة إضافة اختبار
addExamBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    loadSubjectsAndClasses();
});

// إغلاق النافذة عند النقر خارجها
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        resetForm();
    }
    if (e.target === viewModal) {
        viewModal.style.display = 'none';
    }
});

// دالة لإعادة تعيين النموذج
function resetForm() {
    addExamForm.reset();
    currentEditId = null;
    currentFileData = null;
    document.getElementById('modal-title').textContent = 'إضافة اختبار جديد';
    document.getElementById('form-submit-btn').textContent = 'إضافة الاختبار';
    document.getElementById('current-file-info').style.display = 'none';
    document.getElementById('exam-id').value = '';
}

// تحديث دالة loadExamData
async function loadExamData(exam) {
    subjectSelect.value = exam.subjectName;
    classSelect.value = exam.className;

    document.getElementById('exam-title').value = exam.title;
    document.getElementById('exam-date').value = exam.date;
    document.getElementById('exam-period').value = exam.period;
    document.getElementById('exam-duration').value = exam.duration;
    document.getElementById('exam-description').value = exam.description;
    document.getElementById('exam-total-grade-input').value = exam.totalGrade || '';
    document.getElementById('exam-id').value = exam.id;
    
    if (exam.pdfFile) {
        currentFileData = exam.pdfFile;
        document.getElementById('current-file-info').style.display = 'block';
        document.getElementById('current-filename').textContent = `${exam.title}.pdf`;
    }
}

// تحديث دالة editExam
function editExam(examId) {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
        currentEditId = examId;
        document.getElementById('modal-title').textContent = 'تعديل الاختبار';
        document.getElementById('form-submit-btn').textContent = 'حفظ التعديلات';
        
        loadExamData(exam);
        modal.style.display = 'flex';
    }
}

// إضافة مستمع حدث لزر حذف الملف
document.getElementById('remove-file-btn').addEventListener('click', () => {
    if (confirm('هل أنت متأكد من حذف الملف المرفق؟')) {
        try {
            currentFileData = null;
            document.getElementById('current-file-info').style.display = 'none';
            document.getElementById('exam-file').value = '';
            showFeedback('تم حذف الملف المرفق بنجاح', 'success');
        } catch (error) {
            showFeedback('فشل في حذف الملف المرفق', 'error');
        }
    }
});

// دالة لعرض التغذية الراجعة
function showFeedback(message, type, action = null) {
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackId = Date.now();
    
    const feedbackElement = document.createElement('div');
    feedbackElement.className = `feedback ${type}`;
    feedbackElement.id = `feedback-${feedbackId}`;
    
    const content = document.createElement('div');
    content.className = 'feedback-content';
    
    const icon = document.createElement('span');
    icon.className = 'feedback-icon';
    icon.textContent = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌';
    
    const messageElement = document.createElement('p');
    messageElement.className = 'feedback-message';
    messageElement.textContent = message;
    
    content.appendChild(icon);
    content.appendChild(messageElement);
    
    if (action) {
        const actionButton = document.createElement('button');
        actionButton.className = 'feedback-action';
        actionButton.textContent = 'إعادة المحاولة';
        actionButton.onclick = action;
        content.appendChild(actionButton);
    }
    
    const closeButton = document.createElement('button');
    closeButton.className = 'feedback-close';
    closeButton.textContent = '×';
    closeButton.onclick = () => removeFeedback(feedbackId);
    
    feedbackElement.appendChild(content);
    feedbackElement.appendChild(closeButton);
    
    feedbackContainer.appendChild(feedbackElement);
    
    setTimeout(() => removeFeedback(feedbackId), 5000);
}

// دالة لإزالة التغذية الراجعة
function removeFeedback(id) {
    const feedback = document.getElementById(`feedback-${id}`);
    if (feedback) {
        feedback.classList.add('hide');
        setTimeout(() => feedback.remove(), 300);
    }
}

// تحديث معالج النموذج
addExamForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const subjectName = subjectSelect.value;
    const className = classSelect.value;
    const title = document.getElementById('exam-title').value;
    const date = document.getElementById('exam-date').value;
    const period = document.getElementById('exam-period').value;
    const duration = document.getElementById('exam-duration').value;
    const description = document.getElementById('exam-description').value;
    const totalGrade = document.getElementById('exam-total-grade-input').value;
    const file = document.getElementById('exam-file').files[0];
    const examId = document.getElementById('exam-id').value;

    if (!subjectName || !className) {
        showFeedback('الرجاء اختيار المادة والفصل', 'error');
        return;
    }

    if (!totalGrade || totalGrade < 1 || totalGrade > 100) {
        showFeedback('الرجاء إدخال درجة صحيحة للاختبار (من 1 إلى 100)', 'error');
        return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
        showFeedback('حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت', 'error');
        return;
    }

    try {
        const fileData = file ? await getBase64(file) : currentFileData;

        const examData = {
            id: currentEditId || exams.length + 1,
            subjectName: subjectName,
            className: className,
            title: title,
            date: date,
            period: period,
            duration: duration,
            description: description,
            totalGrade: parseFloat(totalGrade),
            status: currentEditId ? exams.find(e => e.id === currentEditId).status : 'upcoming',
            createdAt: currentEditId ? exams.find(e => e.id === currentEditId).createdAt : new Date().toISOString(),
            updatedAt: currentEditId ? new Date().toISOString() : null,
            pdfFile: fileData,
            students: currentEditId ? exams.find(e => e.id === currentEditId).students || [] : [],
            teacherNotes: currentEditId ? exams.find(e => e.id === currentEditId).teacherNotes || '' : '',
            grades: currentEditId ? exams.find(e => e.id === currentEditId).grades || [] : []
        };

        if (currentEditId) {
            const index = exams.findIndex(e => e.id === currentEditId);
            exams[index] = examData;
            showFeedback('تم تحديث الاختبار بنجاح', 'success');
        } else {
            exams.push(examData);
            showFeedback('تم إضافة الاختبار بنجاح', 'success');
        }

        saveExamData();
        renderExams();
        modal.style.display = 'none';
        resetForm();
        
        checkExamNotifications();
    } catch (error) {
        const actionMessage = currentEditId ? 'تعديل' : 'إضافة';
        showFeedback(`فشل في ${actionMessage} الاختبار`, 'error');
        console.error('Error:', error);
    }
});

// حذف اختبار
function deleteExam(examId) {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
        try {
            exams = exams.filter(exam => exam.id !== examId);
            saveExamData();
            renderExams();
            showFeedback('تم حذف الاختبار بنجاح', 'success');
        } catch (error) {
            showFeedback('فشل في حذف الاختبار', 'error', () => deleteExam(examId));
        }
    }
}

// تحديث دالة viewExam لعرض درجات الطلاب
function viewExam(examId) {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
        currentEditId = examId; // تحديث المعرف الحالي
        document.getElementById('detail-title').textContent = exam.title;
        document.getElementById('detail-subject').textContent = exam.subjectName;
        document.getElementById('detail-class').textContent = exam.className;
        document.getElementById('detail-datetime').textContent = `${new Date(exam.date).toLocaleDateString('en-US')} - الحصة ${exam.period}`;
        
        // عرض الدرجة الكاملة للاختبار
        document.getElementById('exam-total-grade').value = exam.totalGrade || '';
        
        // عرض درجات الطلاب
        const gradesList = document.getElementById('grades-list');
        gradesList.innerHTML = '';
        
        // استرجاع قائمة الطلاب في الفصل
        const classStudents = getClassStudents(exam.className);
        
        classStudents.forEach(student => {
            const studentGrade = exam.grades ? exam.grades.find(g => g.studentId === student.id) : null;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>
                    <input type="number" 
                           class="grade-input" 
                           min="0" 
                           max="${exam.totalGrade || 100}"
                           value="${studentGrade ? studentGrade.grade : ''}"
                           data-student-id="${student.id}">
                </td>
                <td>
                    <input type="text" 
                           class="grade-note" 
                           value="${studentGrade ? studentGrade.note || '' : ''}"
                           placeholder="إضافة ملاحظة">
                </td>
                <td>
                    <span class="notification-status ${studentGrade && studentGrade.notificationSent ? 'notification-sent' : 'notification-pending'}">
                        ${studentGrade && studentGrade.notificationSent ? 'تم الإرسال' : 'في الانتظار'}
                    </span>
                </td>
            `;
            gradesList.appendChild(row);
        });

        document.getElementById('detail-notes').value = exam.teacherNotes || '';
        
        // تحديث حالة الأزرار
        const downloadBtn = document.getElementById('download-results-btn');
        const sendToAdminBtn = document.getElementById('send-to-admin-btn');
        downloadBtn.style.display = exam.status === 'completed' ? 'block' : 'none';
        sendToAdminBtn.style.display = exam.status === 'completed' ? 'block' : 'none';
        
        viewModal.style.display = 'flex';
    }
}

// دالة لاسترجاع طلاب الفصل (يمكن تعديلها حسب هيكل البيانات الخاص بك)
function getClassStudents(className) {
    // هنا يمكنك استرجاع الطلاب من localStorage أو API
    const studentsData = JSON.parse(localStorage.getItem('students')) || [];
    return studentsData.filter(student => student.class === className);
}

// حفظ درجات الطلاب وإرسال الإشعارات
document.getElementById('save-grades-btn').addEventListener('click', async () => {
    const examId = currentEditId;
    const exam = exams.find(e => e.id === examId);
    
    if (!exam) return;
    
    const totalGrade = document.getElementById('exam-total-grade').value;
    if (!totalGrade || totalGrade <= 0) {
        showFeedback('الرجاء إدخال الدرجة الكاملة للاختبار', 'error');
        return;
    }
    
    exam.totalGrade = parseFloat(totalGrade);
    exam.grades = [];
    
    // جمع درجات الطلاب
    const gradeInputs = document.querySelectorAll('.grade-input');
    const noteInputs = document.querySelectorAll('.grade-note');
    
    for (let i = 0; i < gradeInputs.length; i++) {
        const grade = parseFloat(gradeInputs[i].value);
        if (!isNaN(grade)) {
            const studentId = gradeInputs[i].dataset.studentId;
            const note = noteInputs[i].value;
            
            exam.grades.push({
                studentId: studentId,
                grade: grade,
                note: note,
                notificationSent: false
            });
            
            // إرسال إشعار للطالب
            try {
                await sendGradeNotification(studentId, exam.title, grade, exam.totalGrade);
                exam.grades[exam.grades.length - 1].notificationSent = true;
            } catch (error) {
                console.error('Error sending notification:', error);
            }
        }
    }
    
    // حفظ التغييرات
    const examIndex = exams.findIndex(e => e.id === examId);
    exams[examIndex] = exam;
    saveExamData();
    
    showFeedback('تم حفظ الدرجات وإرسال الإشعارات بنجاح', 'success');
    viewExam(examId); // تحديث العرض
});

// دالة إرسال إشعار للطالب
async function sendGradeNotification(studentId, examTitle, grade, totalGrade) {
    const student = await getStudentData(studentId);
    if (!student) return;
    
    // هنا يمكنك إضافة كود لإرسال الإشعار عبر البريد الإلكتروني أو إشعارات الموقع
    const notification = {
        studentId: studentId,
        type: 'grade',
        title: 'نتيجة اختبار',
        message: `حصلت على درجة ${grade} من ${totalGrade} في اختبار ${examTitle}`,
        date: new Date().toISOString(),
        read: false
    };
    
    // حفظ الإشعار في قاعدة البيانات
    saveNotification(notification);
}

// دالة استرجاع بيانات الطالب
async function getStudentData(studentId) {
    // هنا يمكنك استرجاع بيانات الطالب من قاعدة البيانات
    const studentsData = JSON.parse(localStorage.getItem('students')) || [];
    return studentsData.find(student => student.id === studentId);
}

// دالة حفظ الإشعار
function saveNotification(notification) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// إرسال النتائج للإدارة
document.getElementById('send-to-admin-btn').addEventListener('click', async () => {
    const examId = currentEditId;
    const exam = exams.find(e => e.id === examId);
    
    if (!exam || !exam.grades || exam.grades.length === 0) {
        showFeedback('لا توجد درجات لإرسالها', 'error');
        return;
    }
    
    try {
        // إنشاء تقرير للإدارة
        const report = {
            examId: exam.id,
            title: exam.title,
            subject: exam.subjectName,
            class: exam.className,
            date: exam.date,
            totalGrade: exam.totalGrade,
            grades: exam.grades,
            teacherNotes: exam.teacherNotes,
            submittedAt: new Date().toISOString()
        };
        
        // حفظ التقرير في قاعدة البيانات
        saveAdminReport(report);
        
        exam.reportSubmitted = true;
        saveExamData();
        
        showFeedback('تم إرسال النتائج للإدارة بنجاح', 'success');
    } catch (error) {
        showFeedback('حدث خطأ أثناء إرسال النتائج', 'error');
        console.error('Error sending results to admin:', error);
    }
});

// دالة حفظ تقرير الإدارة
function saveAdminReport(report) {
    const reports = JSON.parse(localStorage.getItem('adminReports')) || [];
    reports.push(report);
    localStorage.setItem('adminReports', JSON.stringify(reports));
}

// تحديث دالة عرض الاختبارات في الجدول
function renderExams() {
    examsList.innerHTML = '';
    
    if (filteredExams.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="8" class="empty-message">
                لا توجد اختبارات تطابق معايير البحث
            </td>
        `;
        examsList.appendChild(emptyRow);
        return;
    }
    
    filteredExams.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(exam => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exam.subjectName}</td>
            <td>${exam.className}</td>
            <td>
                ${exam.title}
                ${exam.pdfFile ? '<span class="pdf-indicator" title="يحتوي على ملف PDF">📎</span>' : ''}
            </td>
            <td>${new Date(exam.date).toLocaleDateString('en-US')}</td>
            <td>الحصة ${exam.period}</td>
            <td>${exam.duration} دقيقة</td>
            <td>
                <span class="status-${exam.status}">${getStatusText(exam.status)}</span>
                <br>
                <small class="exam-grade">${exam.totalGrade} درجة</small>
            </td>
            <td>
                <button class="action-btn view-btn" onclick="viewExam(${exam.id})">👁️</button>
                <button class="action-btn edit-btn" onclick="editExam(${exam.id})">✏️</button>
                <button class="action-btn delete-btn" onclick="deleteExam(${exam.id})">🗑️</button>
            </td>
        `;
        examsList.appendChild(row);
    });
}

// نص حالة الاختبار
function getStatusText(status) {
    switch (status) {
        case 'upcoming':
            return 'قادم';
        case 'completed':
            return 'مكتمل';
        default:
            return status;
    }
}

// تحديث الإحصائيات
function updateStatistics() {
    const totalExams = exams.length;
    const upcomingExams = exams.filter(exam => exam.status === 'upcoming').length;
    const completedExams = exams.filter(exam => exam.status === 'completed').length;
    
    document.getElementById('total-exams').textContent = totalExams;
    document.getElementById('upcoming-exams').textContent = upcomingExams;
    document.getElementById('completed-exams').textContent = completedExams;
}

// التحقق من الإشعارات
function checkExamNotifications() {
    const now = new Date();
    exams.forEach(exam => {
        const examDate = new Date(exam.date);
        const timeDiff = examDate - now;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (exam.status === 'upcoming' && hoursDiff <= 24 && hoursDiff > 0) {
            showFeedback(`تنبيه: اختبار "${exam.title}" سيبدأ خلال ${Math.ceil(hoursDiff)} ساعة`, 'warning');
        }
        
        if (exam.status === 'completed' && !exam.teacherNotes) {
            showFeedback(`تذكير: لم يتم إدخال نتائج اختبار "${exam.title}"`, 'warning');
        }
    });
}

// تحديث قوائم التصفية
function updateFilterLists() {
    const classFilter = document.getElementById('class-filter');
    const subjectFilter = document.getElementById('subject-filter');
    
    // تحديث قائمة الفصول
    classFilter.innerHTML = '<option value="all">جميع الفصول</option>';
    const allClasses = [
        'سادس أ', 'سادس ب',
        'سابع أ', 'سابع ب',
        'ثامن أ', 'ثامن ب',
        'تاسع أ', 'تاسع ب'
    ];
    allClasses.forEach(className => {
        classFilter.innerHTML += `<option value="${className}">${className}</option>`;
    });

    // تحديث قائمة المواد
    subjectFilter.innerHTML = '<option value="all">جميع المواد</option>';
    const allSubjects = [
        'الرياضيات',
        'العلوم',
        'اللغة العربية',
        'اللغة الإنجليزية',
        'التاريخ',
        'الجغرافيا',
        'التربية الإسلامية',
        'الدراسات الاجتماعية'
    ];
    allSubjects.forEach(subject => {
        subjectFilter.innerHTML += `<option value="${subject}">${subject}</option>`;
    });
}

// تطبيق التصفية
function applyFilters() {
    const classValue = document.getElementById('class-filter').value;
    const subjectValue = document.getElementById('subject-filter').value;
    const statusValue = document.getElementById('status-filter').value;
    const searchValue = document.getElementById('search-input').value.trim().toLowerCase();
    
    filteredExams = exams.filter(exam => {
        const matchClass = classValue === 'all' || exam.className === classValue;
        const matchSubject = subjectValue === 'all' || exam.subjectName === subjectValue;
        const matchStatus = statusValue === 'all' || exam.status === statusValue;
        const matchSearch = !searchValue || 
            exam.title.toLowerCase().includes(searchValue) ||
            exam.description.toLowerCase().includes(searchValue) ||
            exam.subjectName.toLowerCase().includes(searchValue) ||
            exam.className.toLowerCase().includes(searchValue);
        
        return matchClass && matchSubject && matchStatus && matchSearch;
    });
    
    renderExams();
}

// تحديث حالة الاختبارات تلقائياً
function updateExamStatuses() {
    const now = new Date();
    let updated = false;
    
    exams.forEach(exam => {
        const examDate = new Date(exam.date);
        if (exam.status === 'upcoming' && examDate < now) {
            exam.status = 'completed';
            updated = true;
        }
    });
    
    if (updated) {
        saveExamData();
    }
}

// إضافة مستمعي الأحداث للتصفية
document.getElementById('class-filter').addEventListener('change', applyFilters);
document.getElementById('subject-filter').addEventListener('change', applyFilters);
document.getElementById('status-filter').addEventListener('change', applyFilters);
document.getElementById('search-input').addEventListener('input', applyFilters);

// تحميل البيانات الأولية
window.addEventListener('load', () => {
    updateFilterLists();
    applyFilters();
    updateStatistics();
    checkExamNotifications();
});

// تحديث حالة الاختبارات كل دقيقة
setInterval(() => {
    updateExamStatuses();
    checkExamNotifications();
}, 60000); 