// Students Management functionality

class StudentsManagement {
    constructor() {
        this.students = [];
        this.filteredStudents = [];
        this.currentPage = 1;
        this.studentsPerPage = 10;
        this.init();
    }

    init() {
        this.loadStudents();
        this.setupEventListeners();
        this.renderStudents();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('student-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchStudents(e.target.value);
            });
        }

        const classFilter = document.getElementById('class-filter');
        if (classFilter) {
            classFilter.addEventListener('change', (e) => {
                this.filterByClass(e.target.value);
            });
        }

        const addStudentBtn = document.getElementById('add-student-btn');
        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', () => {
                this.showAddStudentModal();
            });
        }
    }

    loadStudents() {
        this.students = [
            {
                id: 1,
                name: 'محمد أحمد السالم',
                studentId: 'ST001',
                class: 'الصف السادس أ',
                birthDate: '2012-05-15',
                parent: 'أحمد محمد السالم',
                phone: '0501234567',
                status: 'نشط',
                enrollDate: '2023-09-01'
            },
            {
                id: 2,
                name: 'فاطمة علي الزهراني',
                studentId: 'ST002',
                class: 'الصف الخامس ب',
                birthDate: '2013-03-22',
                parent: 'علي محمد الزهراني',
                phone: '0509876543',
                status: 'نشط',
                enrollDate: '2023-09-01'
            },
            {
                id: 3,
                name: 'عبدالله محمد القحطاني',
                studentId: 'ST003',
                class: 'الصف الرابع أ',
                birthDate: '2014-07-10',
                parent: 'محمد عبدالله القحطاني',
                phone: '0555678901',
                status: 'نشط',
                enrollDate: '2023-09-05'
            },
            {
                id: 4,
                name: 'نورا سعد الشهري',
                studentId: 'ST004',
                class: 'الصف الثالث ب',
                birthDate: '2015-01-18',
                parent: 'سعد أحمد الشهري',
                phone: '0512345678',
                status: 'نشط',
                enrollDate: '2023-09-03'
            },
            {
                id: 5,
                name: 'خالد أحمد الغامدي',
                studentId: 'ST005',
                class: 'الصف السادس أ',
                birthDate: '2012-11-28',
                parent: 'أحمد خالد الغامدي',
                phone: '0567890123',
                status: 'منقطع',
                enrollDate: '2023-09-01'
            }
        ];

        this.filteredStudents = [...this.students];
    }

    searchStudents(query) {
        if (!query.trim()) {
            this.filteredStudents = [...this.students];
        } else {
            this.filteredStudents = this.students.filter(student =>
                student.name.includes(query) ||
                student.studentId.includes(query) ||
                student.parent.includes(query)
            );
        }
        this.currentPage = 1;
        this.renderStudents();
    }

    filterByClass(className) {
        if (!className || className === 'الكل') {
            this.filteredStudents = [...this.students];
        } else {
            this.filteredStudents = this.students.filter(student => student.class === className);
        }
        this.currentPage = 1;
        this.renderStudents();
    }

    renderStudents() {
        const tableBody = document.getElementById('students-table-body');
        if (!tableBody) return;

        const start = (this.currentPage - 1) * this.studentsPerPage;
        const end = start + this.studentsPerPage;
        const paginatedStudents = this.filteredStudents.slice(start, end);

        if (paginatedStudents.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-8 text-gray-500">
                        <i class="fas fa-user-graduate text-4xl mb-4 block"></i>
                        لا توجد طلاب مطابقين للبحث
                    </td>
                </tr>
            `;
            return;
        }

        const studentsHTML = paginatedStudents.map(student => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-reverse space-x-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user-graduate text-blue-600"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">${student.name}</p>
                            <p class="text-sm text-gray-500">رقم الطالب: ${student.studentId}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">${student.class}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${this.calculateAge(student.birthDate)} سنة</td>
                <td class="px-6 py-4">
                    <div>
                        <p class="text-sm text-gray-900">${student.parent}</p>
                        <p class="text-xs text-gray-500">${student.phone}</p>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="badge ${student.status === 'نشط' ? 'badge-success' : student.status === 'منقطع' ? 'badge-danger' : 'badge-warning'}">
                        ${student.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">${this.formatDate(student.enrollDate)}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-reverse space-x-2">
                        <button onclick="studentsManager.viewStudent(${student.id})" class="btn btn-sm bg-green-100 text-green-700 hover:bg-green-200">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="studentsManager.editStudent(${student.id})" class="btn btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="studentsManager.deleteStudent(${student.id})" class="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = studentsHTML;
        this.renderPagination();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredStudents.length / this.studentsPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700">
                    عرض ${(this.currentPage - 1) * this.studentsPerPage + 1} إلى ${Math.min(this.currentPage * this.studentsPerPage, this.filteredStudents.length)} من ${this.filteredStudents.length} طالب
                </div>
                <div class="flex items-center space-x-reverse space-x-2">
        `;

        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="studentsManager.goToPage(${this.currentPage - 1})" class="btn btn-outline">السابق
</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="btn btn-primary">${i}</button>`;
            } else {
                paginationHTML += `<button onclick="studentsManager.goToPage(${i})" class="btn btn-outline">${i}</button>`;
            }
        }

        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="studentsManager.goToPage(${this.currentPage + 1})" class="btn btn-outline">التالي</button>`;
        }

        paginationHTML += `</div></div>`;
        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderStudents();
    }

    showAddStudentModal() {
        const modalHTML = `
            <div class="modal-overlay" id="add-student-modal">
                <div class="modal-content w-full max-w-2xl p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">تسجيل طالب جديد</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <form id="add-student-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="form-label">اسم الطالب الكامل</label>
                            <input type="text" name="name" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">رقم الطالب</label>
                            <input type="text" name="studentId" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">الصف الدراسي</label>
                            <select name="class" class="form-input form-select" required>
                                <option value="">اختر الصف</option>
                                <option value="الصف الأول أ">الصف الأول أ</option>
                                <option value="الصف الأول ب">الصف الأول ب</option>
                                <option value="الصف الثاني أ">الصف الثاني أ</option>
                                <option value="الصف الثاني ب">الصف الثاني ب</option>
                                <option value="الصف الثالث أ">الصف الثالث أ</option>
                                <option value="الصف الثالث ب">الصف الثالث ب</option>
                                <option value="الصف الرابع أ">الصف الرابع أ</option>
                                <option value="الصف الرابع ب">الصف الرابع ب</option>
                                <option value="الصف الخامس أ">الصف الخامس أ</option>
                                <option value="الصف الخامس ب">الصف الخامس ب</option>
                                <option value="الصف السادس أ">الصف السادس أ</option>
                                <option value="الصف السادس ب">الصف السادس ب</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">تاريخ الميلاد</label>
                            <input type="date" name="birthDate" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">اسم ولي الأمر</label>
                            <input type="text" name="parent" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">رقم هاتف ولي الأمر</label>
                            <input type="tel" name="phone" class="form-input" required>
                        </div>
                        
                        <div class="col-span-1 md:col-span-2 flex items-center justify-end space-x-reverse space-x-3 mt-4">
                            <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">إلغاء</button>
                            <button type="submit" class="btn btn-primary">تسجيل الطالب</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('add-student-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addStudent(new FormData(e.target));
        });
    }

    addStudent(formData) {
        const newStudent = {
            id: this.students.length + 1,
            name: formData.get('name'),
            studentId: formData.get('studentId'),
            class: formData.get('class'),
            birthDate: formData.get('birthDate'),
            parent: formData.get('parent'),
            phone: formData.get('phone'),
            status: 'نشط',
            enrollDate: new Date().toISOString().split('T')[0]
        };

        this.students.push(newStudent);
        this.filteredStudents = [...this.students];
        this.renderStudents();
        
        document.getElementById('add-student-modal').remove();
        showNotification('تم تسجيل الطالب بنجاح', 'success');
    }

    viewStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        const modalHTML = `
            <div class="modal-overlay" id="view-student-modal">
                <div class="modal-content w-full max-w-2xl p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">تفاصيل الطالب</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">اسم الطالب</label>
                                <p class="text-gray-900">${student.name}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">رقم الطالب</label>
                                <p class="text-gray-900">${student.studentId}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">الصف الدراسي</label>
                                <p class="text-gray-900">${student.class}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">العمر</label>
                                <p class="text-gray-900">${this.calculateAge(student.birthDate)} سنة</p>
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">ولي الأمر</label>
                                <p class="text-gray-900">${student.parent}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                                <p class="text-gray-900">${student.phone}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                                <span class="badge ${student.status === 'نشط' ? 'badge-success' : 'badge-danger'}">${student.status}</span>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">تاريخ التسجيل</label>
                                <p class="text-gray-900">${this.formatDate(student.enrollDate)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-end space-x-reverse space-x-3 mt-6">
                        <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">إغلاق</button>
                        <button onclick="studentsManager.editStudent(${student.id}); this.closest('.modal-overlay').remove();" class="btn btn-primary">تعديل البيانات</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    editStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        const modalHTML = `
            <div class="modal-overlay" id="edit-student-modal">
                <div class="modal-content w-full max-w-2xl p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">تعديل بيانات الطالب</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <form id="edit-student-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="hidden" name="id" value="${student.id}">
                        
                        <div class="form-group">
                            <label class="form-label">اسم الطالب الكامل</label>
                            <input type="text" name="name" class="form-input" value="${student.name}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">رقم الطالب</label>
                            <input type="text" name="studentId" class="form-input" value="${student.studentId}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">الصف الدراسي</label>
                            <select name="class" class="form-input form-select" required>
                                <option value="الصف الأول أ" ${student.class === 'الصف الأول أ' ? 'selected' : ''}>الصف الأول أ</option>
                                <option value="الصف الأول ب" ${student.class === 'الصف الأول ب' ? 'selected' : ''}>الصف الأول ب</option>
                                <option value="الصف الثاني أ" ${student.class === 'الصف الثاني أ' ? 'selected' : ''}>الصف الثاني أ</option>
                                <option value="الصف الثاني ب" ${student.class === 'الصف الثاني ب' ? 'selected' : ''}>الصف الثاني ب</option>
                                <option value="الصف الثالث أ" ${student.class === 'الصف الثالث أ' ? 'selected' : ''}>الصف الثالث أ</option>
                                <option value="الصف الثالث ب" ${student.class === 'الصف الثالث ب' ? 'selected' : ''}>الصف الثالث ب</option>
                                <option value="الصف الرابع أ" ${student.class === 'الصف الرابع أ' ? 'selected' : ''}>الصف الرابع أ</option>
                                <option value="الصف الرابع ب" ${student.class === 'الصف الرابع ب' ? 'selected' : ''}>الصف الرابع ب</option>
                                <option value="الصف الخامس أ" ${student.class === 'الصف الخامس أ' ? 'selected' : ''}>الصف الخامس أ</option>
                                <option value="الصف الخامس ب" ${student.class === 'الصف الخامس ب' ? 'selected' : ''}>الصف الخامس ب</option>
                                <option value="الصف السادس أ" ${student.class === 'الصف السادس أ' ? 'selected' : ''}>الصف السادس أ</option>
                                <option value="الصف السادس ب" ${student.class === 'الصف السادس ب' ? 'selected' : ''}>الصف السادس ب</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">تاريخ الميلاد</label>
                            <input type="date" name="birthDate" class="form-input" value="${student.birthDate}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">اسم ولي الأمر</label>
                            <input type="text" name="parent" class="form-input" value="${student.parent}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">رقم هاتف ولي الأمر</label>
                            <input type="tel" name="phone" class="form-input" value="${student.phone}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">الحالة</label>
                            <select name="status" class="form-input form-select" required>
                                <option value="نشط" ${student.status === 'نشط' ? 'selected' : ''}>نشط</option>
                                <option value="منقطع" ${student.status === 'منقطع' ? 'selected' : ''}>منقطع</option>
                                <option value="متوقف مؤقتاً" ${student.status === 'متوقف مؤ
قتاً' ? 'selected' : ''}>متوقف مؤقتاً</option>
                            </select>
                        </div>
                        
                        <div class="col-span-1 md:col-span-2 flex items-center justify-end space-x-reverse space-x-3 mt-4">
                            <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">إلغاء</button>
                            <button type="submit" class="btn btn-primary">حفظ التغييرات</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('edit-student-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateStudent(new FormData(e.target));
        });
    }

    updateStudent(formData) {
        const studentId = parseInt(formData.get('id'));
        const studentIndex = this.students.findIndex(s => s.id === studentId);
        
        if (studentIndex !== -1) {
            this.students[studentIndex] = {
                ...this.students[studentIndex],
                name: formData.get('name'),
                studentId: formData.get('studentId'),
                class: formData.get('class'),
                birthDate: formData.get('birthDate'),
                parent: formData.get('parent'),
                phone: formData.get('phone'),
                status: formData.get('status')
            };
            
            this.filteredStudents = [...this.students];
            this.renderStudents();
            
            document.getElementById('edit-student-modal').remove();
            showNotification('تم تحديث بيانات الطالب بنجاح', 'success');
        }
    }

    deleteStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        if (confirm(`هل أنت متأكد من حذف الطالب: ${student.name}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
            this.students = this.students.filter(s => s.id !== studentId);
            this.filteredStudents = [...this.students];
            this.renderStudents();
            showNotification('تم حذف الطالب بنجاح', 'success');
        }
    }

    calculateAge(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
        
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

let studentsManager;
document.addEventListener('DOMContentLoaded', () => {
    studentsManager = new StudentsManagement();
});
