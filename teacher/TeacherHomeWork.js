// استرجاع بيانات الواجبات من localStorage أو إنشاء مصفوفة فارغة
let homeworks = JSON.parse(localStorage.getItem('teacherHomeworks')) || [];
let currentEditId = null;
let currentFileData = null;
let filteredHomeworks = [...homeworks];

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

// دالة لحفظ بيانات الواجبات في localStorage
function saveHomeworkData() {
    localStorage.setItem('teacherHomeworks', JSON.stringify(homeworks));
    updateFilterLists(); // تحديث قوائم التصفية عند تغيير البيانات
    applyFilters(); // إعادة تطبيق التصفية
}

// عناصر DOM
const modal = document.getElementById('add-homework-modal');
const addHomeworkBtn = document.getElementById('add-homework-btn');
const closeModal = document.querySelector('.close-modal');
const addHomeworkForm = document.getElementById('add-homework-form');
const cancelAddHomework = document.getElementById('cancel-add-homework');
const homeworkList = document.getElementById('homework-list');
const subjectSelect = document.getElementById('subject-select');
const classSelect = document.getElementById('class-select');

// تحميل المواد والفصول المتاحة
function loadSubjectsAndClasses() {
    // استرجاع المواد من localStorage
    const subjects = JSON.parse(localStorage.getItem('teacherSubjects')) || [];
    
    // تعبئة قائمة المواد
    subjectSelect.innerHTML = '<option value="">اختر المادة</option>';
    subjects.forEach(subject => {
        subjectSelect.innerHTML += `<option value="${subject.id}">${subject.name}</option>`;
    });

    // تحديث قائمة الفصول عند اختيار مادة
    subjectSelect.addEventListener('change', () => {
        const selectedSubject = subjects.find(s => s.id === parseInt(subjectSelect.value));
        classSelect.innerHTML = '<option value="">اختر الفصل</option>';
        
        if (selectedSubject) {
            selectedSubject.classes.forEach(className => {
                classSelect.innerHTML += `<option value="${className}">${className}</option>`;
            });
        }
    });
}

// عرض النافذة المنبثقة
addHomeworkBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    loadSubjectsAndClasses();
});

// إغلاق النافذة المنبثقة
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    resetForm();
});

cancelAddHomework.addEventListener('click', () => {
    modal.style.display = 'none';
    resetForm();
});

// إغلاق النافذة عند النقر خارجها
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        resetForm();
    }
});

// دالة لإعادة تعيين النموذج
function resetForm() {
    addHomeworkForm.reset();
    currentEditId = null;
    currentFileData = null;
    document.getElementById('modal-title').textContent = 'إضافة واجب جديد';
    document.getElementById('form-submit-btn').textContent = 'إضافة وإرسال إشعار';
    document.getElementById('current-file-info').style.display = 'none';
    document.getElementById('homework-id').value = '';
}

// دالة لتحميل بيانات الواجب في النموذج
async function loadHomeworkData(homework) {
    const subjects = JSON.parse(localStorage.getItem('teacherSubjects')) || [];
    const selectedSubject = subjects.find(s => s.name === homework.subjectName);
    
    if (selectedSubject) {
        subjectSelect.value = selectedSubject.id;
        // تحديث قائمة الفصول
        classSelect.innerHTML = '<option value="">اختر الفصل</option>';
        selectedSubject.classes.forEach(className => {
            classSelect.innerHTML += `<option value="${className}">${className}</option>`;
        });
        classSelect.value = homework.className;
    }

    document.getElementById('homework-title').value = homework.title;
    document.getElementById('homework-description').value = homework.description;
    document.getElementById('due-date').value = homework.dueDate;
    document.getElementById('homework-id').value = homework.id;
    
    if (homework.pdfFile) {
        currentFileData = homework.pdfFile;
        document.getElementById('current-file-info').style.display = 'block';
        document.getElementById('current-filename').textContent = `${homework.title}.pdf`;
    }
}

// تحديث دالة editHomework
function editHomework(homeworkId) {
    const homework = homeworks.find(h => h.id === homeworkId);
    if (homework) {
        currentEditId = homeworkId;
        document.getElementById('modal-title').textContent = 'تعديل الواجب';
        document.getElementById('form-submit-btn').textContent = 'حفظ التعديلات';
        
        loadHomeworkData(homework);
        modal.style.display = 'flex';
    }
}

// إضافة مستمع حدث لزر حذف الملف
document.getElementById('remove-file-btn').addEventListener('click', () => {
    if (confirm('هل أنت متأكد من حذف الملف المرفق؟')) {
        try {
            currentFileData = null;
            document.getElementById('current-file-info').style.display = 'none';
            document.getElementById('homework-file').value = '';
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
    icon.textContent = type === 'success' ? '✅' : '❌';
    
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
    
    // إزالة الإشعار تلقائياً بعد 5 ثواني
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
addHomeworkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const subjectId = parseInt(subjectSelect.value);
    const className = classSelect.value;
    const title = document.getElementById('homework-title').value;
    const description = document.getElementById('homework-description').value;
    const dueDate = document.getElementById('due-date').value;
    const file = document.getElementById('homework-file').files[0];
    const homeworkId = document.getElementById('homework-id').value;

    if (!subjectId || !className) {
        showFeedback('الرجاء اختيار المادة والفصل', 'error');
        return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
        showFeedback('حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت', 'error');
        return;
    }

    try {
        const subjects = JSON.parse(localStorage.getItem('teacherSubjects')) || [];
        const selectedSubject = subjects.find(s => s.id === subjectId);
        
        const fileData = file ? await getBase64(file) : currentFileData;

        const homeworkData = {
            id: currentEditId || homeworks.length + 1,
            subjectName: selectedSubject.name,
            className: className,
            title: title,
            description: description,
            dueDate: dueDate,
            status: currentEditId ? homeworks.find(h => h.id === currentEditId).status : 'pending',
            createdAt: currentEditId ? homeworks.find(h => h.id === currentEditId).createdAt : new Date().toISOString(),
            updatedAt: currentEditId ? new Date().toISOString() : null,
            pdfFile: fileData
        };

        if (currentEditId) {
            const index = homeworks.findIndex(h => h.id === currentEditId);
            homeworks[index] = homeworkData;
            await sendNotificationToStudents({...homeworkData, type: 'update'});
            showFeedback('تم تحديث الواجب وإرسال إشعار بالتعديل بنجاح', 'success');
        } else {
            await sendNotificationToStudents(homeworkData);
            homeworks.push(homeworkData);
            showFeedback('تم إضافة الواجب وإرسال الإشعارات بنجاح', 'success');
        }

        saveHomeworkData();
        renderHomeworks();
        modal.style.display = 'none';
        resetForm();
    } catch (error) {
        const actionMessage = currentEditId ? 'تعديل' : 'إضافة';
        showFeedback(`فشل في ${actionMessage} الواجب`, 'error', () => {
            modal.style.display = 'flex';
        });
        console.error('Error:', error);
    }
});

// دالة إرسال الإشعارات للطلاب
async function sendNotificationToStudents(homework) {
    // هنا يمكن إضافة كود لإرسال الإشعارات للطلاب
    // مثال: استخدام API لإرسال إشعارات
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Notifications sent for homework:', homework);
            resolve();
        }, 1000);
    });
}

// حذف واجب
function deleteHomework(homeworkId) {
    if (confirm('هل أنت متأكد من حذف هذا الواجب؟')) {
        try {
            homeworks = homeworks.filter(homework => homework.id !== homeworkId);
            saveHomeworkData();
            renderHomeworks();
            showFeedback('تم حذف الواجب بنجاح', 'success');
        } catch (error) {
            showFeedback('فشل في حذف الواجب', 'error', () => deleteHomework(homeworkId));
        }
    }
}

// عرض الواجبات في الجدول
function renderHomeworks() {
    homeworkList.innerHTML = '';
    
    if (filteredHomeworks.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="empty-message">
                لا توجد واجبات تطابق معايير البحث
            </td>
        `;
        homeworkList.appendChild(emptyRow);
        return;
    }
    
    filteredHomeworks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach(homework => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${homework.subjectName}</td>
            <td>${homework.className}</td>
            <td>
                ${homework.title}
                ${homework.pdfFile ? '<span class="pdf-indicator" title="يحتوي على ملف PDF">📎</span>' : ''}
            </td>
            <td>${new Date(homework.dueDate).toLocaleString('ar-EG')}</td>
            <td><span class="status-${homework.status}">${displayHomeworkStatus(homework.status)}</span></td>
            <td>
                <button class="action-btn view-btn" onclick="viewHomework(${homework.id})">👁️</button>
                <button class="action-btn edit-btn" onclick="editHomework(${homework.id})">✏️</button>
                <button class="action-btn delete-btn" onclick="deleteHomework(${homework.id})">🗑️</button>
            </td>
        `;
        homeworkList.appendChild(row);
    });
}

// نص حالة الواجب
function displayHomeworkStatus(status) {
    switch(status) {
        case 'pending':
            return '<span class="status-pending">قيد الانتظار</span>';
        case 'completed':
            return '<span class="status-completed">مستلم</span>';
        default:
            return status;
    }
}

// عرض تفاصيل الواجب
function viewHomework(homeworkId) {
    const homework = homeworks.find(h => h.id === homeworkId);
    if (homework) {
        const fileInfo = homework.pdfFile ? '\nملف PDF مرفق: نعم' : '\nملف PDF مرفق: لا';
        
        if (homework.pdfFile) {
            // إنشاء رابط مؤقت لتحميل الملف
            const link = document.createElement('a');
            link.href = homework.pdfFile;
            link.download = `${homework.title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        alert(`
عنوان الواجب: ${homework.title}
المادة: ${homework.subjectName}
الفصل: ${homework.className}
الوصف: ${homework.description}
تاريخ التسليم: ${new Date(homework.dueDate).toLocaleString('ar-EG')}${fileInfo}
        `);
    }
}

// Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.teacher-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // عرض الواجبات عند تحميل الصفحة
    renderHomeworks();
    
    // تحديث قوائم التصفية
    updateFilterLists();
    
    // إضافة مستمعي أحداث للتصفية
    document.getElementById('class-filter').addEventListener('change', applyFilters);
    document.getElementById('subject-filter').addEventListener('change', applyFilters);
    document.getElementById('status-filter').addEventListener('change', applyFilters);
    
    // إضافة مستمع حدث للبحث مع تأخير
    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    });
});

// دالة لتحديث قوائم التصفية
function updateFilterLists() {
    const classFilter = document.getElementById('class-filter');
    const subjectFilter = document.getElementById('subject-filter');
    
    // تجميع الفصول والمواد الفريدة
    const classes = new Set();
    const subjects = new Set();
    
    homeworks.forEach(homework => {
        classes.add(homework.className);
        subjects.add(homework.subjectName);
    });
    
    // تحديث قائمة الفصول
    classFilter.innerHTML = '<option value="all">جميع الفصول</option>';
    Array.from(classes).sort().forEach(className => {
        classFilter.innerHTML += `<option value="${className}">${className}</option>`;
    });
    
    // تحديث قائمة المواد
    subjectFilter.innerHTML = '<option value="all">جميع المواد</option>';
    Array.from(subjects).sort().forEach(subject => {
        subjectFilter.innerHTML += `<option value="${subject}">${subject}</option>`;
    });
}

// دالة تطبيق التصفية
function applyFilters() {
    const classValue = document.getElementById('class-filter').value;
    const subjectValue = document.getElementById('subject-filter').value;
    const statusValue = document.getElementById('status-filter').value;
    const searchValue = document.getElementById('search-input').value.trim().toLowerCase();
    
    filteredHomeworks = homeworks.filter(homework => {
        const matchClass = classValue === 'all' || homework.className === classValue;
        const matchSubject = subjectValue === 'all' || homework.subjectName === subjectValue;
        const matchStatus = statusValue === 'all' || homework.status === statusValue;
        const matchSearch = !searchValue || 
            homework.title.toLowerCase().includes(searchValue) ||
            homework.description.toLowerCase().includes(searchValue) ||
            homework.subjectName.toLowerCase().includes(searchValue) ||
            homework.className.toLowerCase().includes(searchValue);
        
        return matchClass && matchSubject && matchStatus && matchSearch;
    });
    
    renderHomeworks();
}
