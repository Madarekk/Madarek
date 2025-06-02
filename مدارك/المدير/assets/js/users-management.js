// Users Management functionality

class UsersManagement {
    constructor() {
        this.users = [];
        this.filteredUsers = [];
        this.currentPage = 1;
        this.usersPerPage = 10;
        this.init();
    }

    init() {
        this.loadUsers();
        this.setupEventListeners();
        this.renderUsers();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('user-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchUsers(e.target.value);
            });
        }

        // Filter functionality
        const roleFilter = document.getElementById('role-filter');
        if (roleFilter) {
            roleFilter.addEventListener('change', (e) => {
                this.filterByRole(e.target.value);
            });
        }

        // Add user button
        const addUserBtn = document.getElementById('add-user-btn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                this.showAddUserModal();
            });
        }
    }

    loadUsers() {
        // Sample data - in real app, this would come from API
        this.users = [
            {
                id: 1,
                name: 'أحمد محمد السالم',
                email: 'ahmed.salem@school.edu.sa',
                phone: '0501234567',
                role: 'معلم',
                status: 'نشط',
                joinDate: '2023-09-01'
            },
            {
                id: 2,
                name: 'فاطمة علي الزهراني',
                email: 'fatima.zahrani@school.edu.sa',
                phone: '0509876543',
                role: 'معلم',
                status: 'نشط',
                joinDate: '2023-09-15'
            },
            {
                id: 3,
                name: 'محمد عبدالله القحطاني',
                email: 'mohammed.qahtani@parent.com',
                phone: '0555678901',
                role: 'ولي أمر',
                status: 'نشط',
                joinDate: '2023-10-01'
            },
            {
                id: 4,
                name: 'نورا سعد الشهري',
                email: 'nora.shahri@school.edu.sa',
                phone: '0512345678',
                role: 'إداري',
                status: 'نشط',
                joinDate: '2023-08-20'
            },
            {
                id: 5,
                name: 'خالد أحمد الغامدي',
                email: 'khalid.ghamdi@school.edu.sa',
                phone: '0567890123',
                role: 'معلم',
                status: 'غير نشط',
                joinDate: '2023-07-10'
            }
        ];

        this.filteredUsers = [...this.users];
    }

    searchUsers(query) {
        if (!query.trim()) {
            this.filteredUsers = [...this.users];
        } else {
            this.filteredUsers = this.users.filter(user =>
                user.name.includes(query) ||
                user.email.includes(query) ||
                user.phone.includes(query)
            );
        }
        this.currentPage = 1;
        this.renderUsers();
    }

    filterByRole(role) {
        if (!role || role === 'الكل') {
            this.filteredUsers = [...this.users];
        } else {
            this.filteredUsers = this.users.filter(user => user.role === role);
        }
        this.currentPage = 1;
        this.renderUsers();
    }

    renderUsers() {
        const tableBody = document.getElementById('users-table-body');
        if (!tableBody) return;

        const start = (this.currentPage - 1) * this.usersPerPage;
        const end = start + this.usersPerPage;
        const paginatedUsers = this.filteredUsers.slice(start, end);

        if (paginatedUsers.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8 text-gray-500">
                        <i class="fas fa-users text-4xl mb-4 block"></i>
                        لا توجد مستخدمين مطابقين للبحث
                    </td>
                </tr>
            `;
            return;
        }

        const usersHTML = paginatedUsers.map(user => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-reverse space-x-3">
                        <div class="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-white"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">${user.name}</p>
                            <p class="text-sm text-gray-500">${user.email}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">${user.role}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${user.phone}</td>
                <td class="px-6 py-4">
                    <span class="badge ${user.status === 'نشط' ? 'badge-success' : 'badge-danger'}">
                        ${user.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">${this.formatDate(user.joinDate)}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-reverse space-x-2">
                        <button onclick="usersManager.editUser(${user.id})" class="btn btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="usersManager.resetPassword(${user.id})" class="btn btn-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                            <i class="fas fa-key"></i>
                        </button>
                        <button onclick="usersManager.deleteUser(${user.id})" class="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = usersHTML;
        this.renderPagination();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredUsers.length / this.usersPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700">
                    عرض ${(this.currentPage - 1) * this.usersPerPage + 1} إلى ${Math.min(this.currentPage * this.usersPerPage, this.filteredUsers.length)} من ${this.filteredUsers.length} مستخدم
                </div>
                <div class="flex items-center space-x-reverse space-x-2">
        `;

        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="usersManager.goToPage(${this.currentPage - 1})" class="btn btn-outline">السابق</button>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="btn btn-primary">${i}</button>`;
            } else {
                paginationHTML += `<button onclick="usersManager.goToPage(${i})" class="btn btn-outline">${i}</button>`;
            }
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="usersManager.goToPage(${this.currentPage + 1})" class="btn btn-outline">التالي</button>`;
        }

        paginationHTML += `</div></div>`;
        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderUsers();
    }

    showAddUserModal() {
        const modalHTML = `
            <div class="modal-overlay" id="add-user-modal">
                <div class="modal-content w-full max-w-md p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">إضافة مستخدم جديد</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <form id="add-user-form">
                        <div class="form-group">
                            <label class="form-label">الاسم الكامل</label>
                            <input type="text" name="name" class="form-input" required>
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
                            <label class="form-label">الدور</label>
                            <select name="role" class="form-input form-select" required>
                                <option value="">اختر الدور</option>
                                <option value="معلم">معلم</option>
                                <option value="إداري">إداري</option>
                                <option value="ولي أمر">ولي أمر</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">كلمة المرور المؤقتة</label>
                            <input type="password" name="password" class="form-input" required>
                        </div>
                        
                        <div class="flex items-center justify-end space-x-reverse space-x-3">
                            <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">إلغاء</button>
                            <button type="submit" class="btn btn-primary">إضافة المستخدم</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Handle form submission
        document.getElementById('add-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addUser(new FormData(e.target));
        });
    }

    addUser(formData) {
        const newUser = {
            id: this.users.length + 1,
            name: formData.get('name'),
            
email: formData.get('email'),
            phone: formData.get('phone'),
            role: formData.get('role'),
            status: 'نشط',
            joinDate: new Date().toISOString().split('T')[0]
        };

        this.users.push(newUser);
        this.filteredUsers = [...this.users];
        this.renderUsers();
        
        document.getElementById('add-user-modal').remove();
        showNotification('تم إضافة المستخدم بنجاح', 'success');
    }

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const modalHTML = `
            <div class="modal-overlay" id="edit-user-modal">
                <div class="modal-content w-full max-w-md p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">تعديل بيانات المستخدم</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <form id="edit-user-form">
                        <input type="hidden" name="id" value="${user.id}">
                        
                        <div class="form-group">
                            <label class="form-label">الاسم الكامل</label>
                            <input type="text" name="name" class="form-input" value="${user.name}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">البريد الإلكتروني</label>
                            <input type="email" name="email" class="form-input" value="${user.email}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">رقم الهاتف</label>
                            <input type="tel" name="phone" class="form-input" value="${user.phone}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">الدور</label>
                            <select name="role" class="form-input form-select" required>
                                <option value="معلم" ${user.role === 'معلم' ? 'selected' : ''}>معلم</option>
                                <option value="إداري" ${user.role === 'إداري' ? 'selected' : ''}>إداري</option>
                                <option value="ولي أمر" ${user.role === 'ولي أمر' ? 'selected' : ''}>ولي أمر</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">الحالة</label>
                            <select name="status" class="form-input form-select" required>
                                <option value="نشط" ${user.status === 'نشط' ? 'selected' : ''}>نشط</option>
                                <option value="غير نشط" ${user.status === 'غير نشط' ? 'selected' : ''}>غير نشط</option>
                            </select>
                        </div>
                        
                        <div class="flex items-center justify-end space-x-reverse space-x-3">
                            <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">إلغاء</button>
                            <button type="submit" class="btn btn-primary">حفظ التغييرات</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('edit-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateUser(new FormData(e.target));
        });
    }

    updateUser(formData) {
        const userId = parseInt(formData.get('id'));
        const userIndex = this.users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            this.users[userIndex] = {
                ...this.users[userIndex],
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                role: formData.get('role'),
                status: formData.get('status')
            };
            
            this.filteredUsers = [...this.users];
            this.renderUsers();
            
            document.getElementById('edit-user-modal').remove();
            showNotification('تم تحديث بيانات المستخدم بنجاح', 'success');
        }
    }

    resetPassword(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (confirm(`هل أنت متأكد من إعادة تعيين كلمة المرور للمستخدم: ${user.name}؟`)) {
            // In real app, this would call an API
            showNotification('تم إرسال كلمة المرور الجديدة للمستخدم', 'success');
        }
    }

    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (confirm(`هل أنت متأكد من حذف المستخدم: ${user.name}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
            this.users = this.users.filter(u => u.id !== userId);
            this.filteredUsers = [...this.users];
            this.renderUsers();
            showNotification('تم حذف المستخدم بنجاح', 'success');
        }
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

// Initialize users management
let usersManager;
document.addEventListener('DOMContentLoaded', () => {
    usersManager = new UsersManagement();
});
