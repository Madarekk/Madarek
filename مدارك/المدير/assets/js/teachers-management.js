// Teachers Management functionality

class TeachersManagement {
    constructor() {
        this.teachers = [];
        this.filteredTeachers = [];
        this.currentPage = 1;
        this.teachersPerPage = 10;
        this.init();
    }

    init() {
        this.loadTeachers();
        this.setupEventListeners();
        this.renderTeachers();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('teacher-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTeachers(e.target.value);
            });
        }

        const subjectFilter = document.getElementById('subject-filter');
        if (subjectFilter) {
            subjectFilter.addEventListener('change', (e) => {
                this.filterBySubject(e.target.value);
            });
        }

        const addTeacherBtn = document.getElementById('add-teacher-btn');
        if (addTeacherBtn) {
            addTeacherBtn.addEventListener('click', () => {
                this.showAddTeacherModal();
            });
        }
    }

    loadTeachers() {
        this.teachers = [
            {
                id: 1,
                name: 'أحمد محمد السالم',
                employeeId: 'T001',
                email: 'ahmed.salem@school.edu.sa',
                phone: '0501234567',
                subject: 'الرياضيات',
                qualification: 'بكالوريوس رياضيات',
                experience: '8 سنوات',
                status: 'نشط',
                joinDate: '2020-09-01'
            },
            {
                id: 2,
                name: 'فاطمة علي الزهراني',
                employeeId: 'T002',
                email: 'fatima.zahrani@school.edu.sa',
                phone: '0509876543',
                subject: 'اللغة العربية',
                qualification: 'ماجستير لغة عربية',
                experience: '12 سنة',
                status: 'نشط',
                joinDate: '2018-09-01'
            },
            {
                id: 3,
                name: 'محمد عبدالله القحطاني',
                employeeId: 'T003',
                email: 'mohammed.qahtani@school.edu.sa',
                phone: '0555678901',
                subject: 'العلوم',
                qualification: 'بكالوريوس أحياء',
                experience: '6 سنوات',
                status: 'نشط',
                joinDate: '2021-02-15'
            },
            {
                id: 4,
                name: 'نورا سعد الشهري',
                employeeId: 'T004',
                email: 'nora.shahri@school.edu.sa',
                phone: '0512345678',
                subject: 'اللغة الإنجليزية',
                qualification: 'بكالوريوس لغة إنجليزية',
                experience: '5 سنوات',
                status: 'إجازة',
                joinDate: '2022-01-10'
            },
            {
                id: 5,
                name: 'خالد أحمد الغامدي',
                employeeId: 'T005',
                email: 'khalid.ghamdi@school.edu.sa',
                phone: '0567890123',
                subject: 'التربية الإسلامية',
                qualification: 'بكالوريوس شريعة',
                experience: '10 سنوات',
                status: 'نشط',
                joinDate: '2019-09-01'
            }
        ];

        this.filteredTeachers = [...this.teachers];
    }

    searchTeachers(query) {
        if (!query.trim()) {
            this.filteredTeachers = [...this.teachers];
        } else {
            this.filteredTeachers = this.teachers.filter(teacher =>
                teacher.name.includes(query) ||
                teacher.employeeId.includes(query) ||
                teacher.email.includes(query) ||
                teacher.subject.includes(query)
            );
        }
        this.currentPage = 1;
        this.renderTeachers();
    }

    filterBySubject(subject) {
        if (!subject || subject === 'الكل') {
            this.filteredTeachers = [...this.teachers];
        } else {
            this.filteredTeachers = this.teachers.filter(teacher => teacher.subject === subject);
        }
        this.currentPage = 1;
        this.renderTeachers();
    }

    renderTeachers() {
        const tableBody = document.getElementById('teachers-table-body');
        if (!tableBody) return;

        const start = (this.currentPage - 1) * this.teachersPerPage;
        const end = start + this.teachersPerPage;
        const paginatedTeachers = this.filteredTeachers.slice(start, end);

        if (paginatedTeachers.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-8 text-gray-500">
                        <i class="fas fa-chalkboard-teacher text-4xl mb-4 block"></i>
                        لا توجد معلمين مطابقين للبحث
                    </td>
                </tr>
            `;
            return;
        }

        const teachersHTML = paginatedTeachers.map(teacher => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-reverse space-x-3">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-chalkboard-teacher text-green-600"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">${teacher.name}</p>
                            <p class="text-sm text-gray-500">رقم الموظف: ${teacher.employeeId}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">${teacher.subject}</td>
                <td class="px-6 py-4">
                    <div>
                        <p class="text-sm text-gray-900">${teacher.email}</p>
                        <p class="text-xs text-gray-500">${teacher.phone}</p>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">${teacher.qualification}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${teacher.experience}</td>
                <td class="px-6 py-4">
                    <span class="badge ${teacher.status === 'نشط' ? 'badge-success' : teacher.status === 'إجازة' ? 'badge-warning' : 'badge-danger'}">
                        ${teacher.status}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-reverse space-x-2">
                        <button onclick="teachersManager.viewTeacher(${teacher.id})" class="btn btn-sm bg-green-100 text-green-700 hover:bg-green-200">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="teachersManager.editTeacher(${teacher.id})" class="btn btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="teachersManager.deleteTeacher(${teacher.id})" class="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = teachersHTML;
        this.renderPagination();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredTeachers.length / this.teachersPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700">
                    عرض ${(this.currentPage - 1) * this.teachersPerPage + 1} إلى ${Math.min(this.currentPage * this.teachersPerPage, this.filteredTeachers.length)} من ${this.filteredTeachers.length} معلم
                </div>
                <div class="flex items-center space-x-reverse space-x-2">
        `;

        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="teachersManager.goToPage(${this.currentPage - 1})" class="btn btn-outline">السابق</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="btn btn-primary">${i}</button>`;
            } else {
                paginationHTML += `<button onclick="teachersManager.goToPage(${i})" class="btn btn-outline">${i}</button>`;
            }
        }

        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="teachersManager.goToPage(${this.currentPage + 1})" class="btn btn-outline">التالي</button>`;
        }

        paginationHTML += `</div></div>`;
        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderTeachers();
    }

    showAddTeacherModal() {
        const modalHTML = `
            <div class="modal-overlay" id="add-teacher-modal">
                <div class="modal-content w-full max-w-2xl p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">إضافة معلم جديد</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <form id="add-teacher-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="form-label">اسم المعلم الكامل</label>
                            <input type="text" name="name" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">رقم الموظف</label>
                            <input type="text" name="employeeId" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">البريد الإلكتروني</label>
                            <input type="email" name="email" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">رقم الهاتف</label>
                            <input type="tel" name="phone" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label
