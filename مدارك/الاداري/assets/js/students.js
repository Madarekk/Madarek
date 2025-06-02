// Students management functionality

class StudentsManager {
    constructor() {
        this.students = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filteredStudents = [];
        this.editingStudent = null;
        this.init();
    }

    init() {
        this.loadStudents();
        this.setupEventListeners();
        this.renderTable();
        this.setupPagination();
    }

    setupEventListeners() {
        // Add student button
        document.getElementById('addStudentBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Close modal buttons
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submission
        document.getElementById('studentForm').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Search and filters
        document.getElementById('searchInput').addEventListener('input', () => {
            this.filterStudents();
        });

        document.getElementById('classFilter').addEventListener('change', () => {
            this.filterStudents();
        });

        document.getElementById('statusFilter').addEventListener('change', () => {
            this.filterStudents();
        });

        // Modal overlay click
        document.getElementById('studentModal').addEventListener('click', (e) => {
            if (e.target.id === 'studentModal') {
                this.closeModal();
            }
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            this.goToPage(this.currentPage - 1);
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.goToPage(this.currentPage + 1);
        });
    }

    loadStudents() {
        // Simulate API call to load students data
        this.students = [
            {
                id: 1,
                name: 'محمد أحمد علي',
                studentId: '1234567890',
                class: 'السادس أ',
                parentName: 'أحمد علي محمد',
                parentPhone: '0501234567',
                parentEmail: 'ahmed@example.com',
                registrationDate: '2024-01-15',
                status: 'نشط',
                birthDate: '2012-05-10',
                gender: 'ذكر',
                address: 'الرياض، حي النخيل'
            },
            {
                id: 2,
                name: 'فاطمة محمد سالم',
                studentId: '0987654321',
                class: 'الثالث ب',
                parentName: 'محمد سالم أحمد',
                parentPhone: '0507654321',
                parentEmail: 'mohamed@example.com',
                registrationDate: '2024-01-10',
                status: 'نشط',
                birthDate: '2015-03-22',
                gender: 'أنثى',
                address: 'الرياض، حي الصحافة'
            },
            {
                id: 3,
                name: 'عبدالله سعد الغامدي',
                studentId: '1122334455',
                class: 'الأول أ',
                parentName: 'سعد الغامدي',
                parentPhone: '0551122334',
                parentEmail: 'saad@example.com',
                registrationDate: '2024-01-08',
                status: 'نشط',
                birthDate: '2017-08-15',
                gender: 'ذكر',
                address: 'الرياض، حي العليا'
            },
            {
                id: 4,
                name: 'نورا خالد المطيري',
                studentId: '5566778899',
                class: 'الرابع أ',
                parentName: 'خالد المطيري',
                parentPhone: '0555566778',
                parentEmail: 'khalid@example.com',
                registrationDate: '2024-01-05',
                status: 'معلق',
                birthDate: '2014-12-03',
                gender: 'أنثى',
                address: 'الرياض، حي الملز'
            },
            {
                id: 5,
                name: 'يوسف عبدالرحمن القحطاني',
                studentId: '9988776655',
                class: 'الخامس ب',
                parentName: 'عبدالرحمن القحطاني',
                parentPhone: '0509988776',
                parentEmail: 'abdulrahman@example.com',
                registrationDate: '2024-01-03',
                status: 'نشط',
                birthDate: '2013-07-20',
                gender: 'ذكر',
                address: 'الرياض، حي الروضة'
            }
        ];

        this.filteredStudents = [...this.students];
    }

    filterStudents() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const classFilter = document.getElementById('classFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        this.filteredStudents = this.students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm) || 
                                student.studentId.includes(searchTerm);
            const matchesClass = !classFilter || student.class.includes(classFilter);
            const matchesStatus = !statusFilter || student.status === statusFilter;

            return matchesSearch && matchesClass && matchesStatus;
        });

        this.currentPage = 1;
        this.renderTable();
        this.setupPagination();
    }

    renderTable() {
        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = '';

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentStudents = this.filteredStudents
.slice(startIndex, endIndex);

        currentStudents.forEach(student => {
            const row = document.createElement('tr');
            row.className = 'table-row hover:bg-gray-50 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-reverse space-x-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-blue-600 font-medium">${student.name.charAt(0)}</span>
                        </div>
                        <div>
                            <div class="font-medium text-gray-800">${student.name}</div>
                            <div class="text-sm text-gray-500">${student.gender}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-gray-800">${student.studentId}</td>
                <td class="px-6 py-4 text-gray-800">${student.class}</td>
                <td class="px-6 py-4">
                    <div class="text-gray-800">${student.parentName}</div>
                    <div class="text-sm text-gray-500">${student.parentPhone}</div>
                </td>
                <td class="px-6 py-4 text-gray-800">${this.formatDate(student.registrationDate)}</td>
                <td class="px-6 py-4">
                    <span class="status-${student.status === 'نشط' ? 'active' : student.status === 'معلق' ? 'pending' : 'inactive'}">${student.status}</span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center justify-center space-x-reverse space-x-2">
                        <button onclick="studentsManager.editStudent(${student.id})" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="studentsManager.viewStudent(${student.id})" class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="عرض التفاصيل">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="studentsManager.deleteStudent(${student.id})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Update pagination info
        const totalStudents = this.filteredStudents.length;
        const startItem = totalStudents > 0 ? startIndex + 1 : 0;
        const endItem = Math.min(endIndex, totalStudents);
        
        document.getElementById('currentRange').textContent = `${startItem}-${endItem}`;
        document.getElementById('totalStudents').textContent = totalStudents;
    }

    setupPagination() {
        const totalPages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);
        const pageNumbers = document.getElementById('pageNumbers');
        pageNumbers.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = `px-3 py-2 border rounded-lg transition-colors ${
                i === this.currentPage 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-gray-300 hover:bg-gray-50'
            }`;
            button.addEventListener('click', () => this.goToPage(i));
            pageNumbers.appendChild(button);
        }

        // Update navigation buttons
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages || totalPages === 0;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.setupPagination();
        }
    }

    openModal(student = null) {
        this.editingStudent = student;
        const modal = document.getElementById('studentModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('studentForm');

        if (student) {
            modalTitle.textContent = 'تعديل بيانات الطالب';
            this.populateForm(student);
        } else {
            modalTitle.textContent = 'تسجيل طالب جديد';
            form.reset();
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('studentModal');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.editingStudent = null;
    }

    populateForm(student) {
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentId').value = student.studentId;
        document.getElementById('birthDate').value = student.birthDate;
        document.getElementById('studentClass').value = student.class;
        document.getElementById('gender').value = student.gender;
        document.getElementById('parentName').value = student.parentName;
        document.getElementById('parentPhone').value = student.parentPhone;
        document.getElementById('parentEmail').value = student.parentEmail || '';
        document.getElementById('address').value = student.address || '';
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const studentData = {
            name: formData.get('studentName'),
            studentId: formData.get('studentId'),
            birthDate: formData.get('birthDate'),
            class: formData.get('studentClass'),
            gender: formData.get('gender'),
            parentName: formData.get('parentName'),
            parentPhone: formData.get('parentPhone'),
            parentEmail: formData.get('parentEmail'),
            address: formData.get('address'),
            status: 'نشط',
            registrationDate: new Date().toISOString().split('T')[0]
        };

        if (this.editingStudent) {
            this.updateStudent(studentData);
        } else {
            this.addStudent(studentData);
        }
    }

    addStudent(studentData) {
        const newStudent = {
            id: this.students.length + 1,
            ...studentData
        };

        this.students.push(newStudent);
        this.filteredStudents = [...this.students];
        this.renderTable();
        this.setupPagination();
        this.closeModal();

        window.madarekAdmin.showSuccessMessage('تم تسجيل الطالب بنجاح');
    }

    updateStudent(studentData) {
        const index = this.students.findIndex(s => s.id === this.editingStudent.id);
        if (index !== -1) {
            this.students[index] = { ...this.editingStudent, ...studentData };
            this.filteredStudents = [...this.students];
            this.renderTable();
            this.closeModal();

            window.madarekAdmin.showSuccessMessage('تم تحديث بيانات الطالب بنجاح');
        }
    }

    editStudent(id) {
        const student = this.students.find(s => s.id === id);
        if (student) {
            this.openModal(student);
        }
    }

    viewStudent(id) {
        const student = this.students.find(s => s.id === id);
        if (student) {
            // Create a detailed view modal or navigate to student details page
            alert(`عرض تفاصيل الطالب: ${student.name}`);
        }
    }

    deleteStudent(id) {
        const student = this.students.find(s => s.id === id);
        if (student) {
            if (confirm(`هل أنت متأكد من حذف الطالب "${student.name}"؟`)) {
                this.students = this.students.filter(s => s.id !== id);
                this.filteredStudents = [...this.students];
                this.renderTable();
                this.setupPagination();

                window.madarekAdmin.showSuccessMessage('تم حذف الطالب بنجاح');
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA');
    }
}

// Initialize students manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('studentsTable')) {
        window.studentsManager = new StudentsManager();
    }
});
