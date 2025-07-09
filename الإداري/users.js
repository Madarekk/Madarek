// users.js
document.addEventListener('DOMContentLoaded', () => {
    // Add User Modal functionality
    const addUserBtn = document.getElementById('addUserBtn');
    const addUserModal = document.getElementById('addUserModal');
    const closeModalBtn = document.getElementById('closeModalBtn'); // For Add User Modal
    const cancelModalBtn = document.getElementById('cancelModalBtn'); // For Add User Modal
    const addUserForm = document.getElementById('addUserForm');
    const usersTableBody = document.getElementById('usersTableBody');
    const usersTablePlaceholder = document.querySelector('.users-table-placeholder');
    const userRoleModal = document.getElementById('userRoleModal');
    const enrollmentIdContainer = document.getElementById('enrollmentIdContainer');
    const enrollmentIdInput = document.getElementById('enrollmentId');
    const regenEnrollmentIdBtn = document.getElementById('regenEnrollmentIdBtn');

    const toggleModal = (modal, show) => {
        if (modal) {
            modal.classList.toggle('hidden', !show);
        }
    };

    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            toggleModal(addUserModal, true);
            if (addUserForm) addUserForm.reset();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => toggleModal(addUserModal, false));
    }

    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', () => toggleModal(addUserModal, false));
    }

    if (addUserModal) {
        addUserModal.addEventListener('click', (event) => {
            if (event.target === addUserModal) {
                toggleModal(addUserModal, false);
            }
        });
    }

    function getEnrollmentStart(role) {
        // تسلسل خاص لكل دور
        switch (role) {
            case 'student': return 10000;
            case 'parent': return 20000;
            case 'teacher': return 30000;
            case 'admin': return 40000;
            case 'director': return 50000;
            case 'external_teacher': return 60000;
            default: return 90000;
        }
    }
    // حفظ آخر رقم قيد لكل دور في الذاكرة المؤقتة (localStorage)
    function getNextEnrollmentId(role) {
        const key = `enrollmentId_${role}`;
        let last = parseInt(localStorage.getItem(key), 10);
        if (isNaN(last) || last < getEnrollmentStart(role)) {
            last = getEnrollmentStart(role);
        } else {
            last++;
        }
        localStorage.setItem(key, last);
        return last;
    }
    if (userRoleModal && enrollmentIdContainer && enrollmentIdInput) {
        userRoleModal.addEventListener('change', function() {
            const role = this.value;
            if (role) {
                enrollmentIdContainer.classList.remove('hidden');
                enrollmentIdInput.value = getNextEnrollmentId(role);
            } else {
                enrollmentIdContainer.classList.add('hidden');
                enrollmentIdInput.value = '';
            }
        });
    }

    if (addUserForm) {
        addUserForm.addEventListener('submit', (event) => {
            event.preventDefault;
            const formData = new FormData(addUserForm);
            const userData = Object.fromEntries(formData.entries());
            userData.enrollmentId = enrollmentIdInput ? enrollmentIdInput.value : '';
            console.log('Add User form submitted:', userData);
            alert(`تم إرسال بيانات المستخدم لإضافته: ${userData.firstName} ${userData.lastName} (اسم المستخدم: ${userData.username}). (سيتم ربطه بالـ backend لاحقاً)`);
            // Backend Note: Send userData (firstName, secondName, lastName, username, phone, userRole) to backend API.
            // Backend should generate a unique user ID and a "رقم قيد" (enrollment/registration ID).
            // This "رقم قيد" along with the username would be used by the user for their first login to set up email/password.
            // For now, we'll simulate adding to the table.
            
            // Simulate adding user to table (for frontend demo purposes)
            const newUserId = Date.now(); // Temporary unique ID
            const newUserRow = `
                <tr data-user-id="${newUserId}">
                    <td class="px-3 py-4 text-right">${userData.firstName || ''} ${userData.secondName || ''} ${userData.lastName || ''}</td>
                    <td class="px-3 py-4 text-right">${userData.userRole || 'غير محدد'}</td>
                    <td class="px-3 py-4 text-right">${userData.email || 'example@example.com'}</td>
                    <td class="px-3 py-4 text-right">${userData.phone || ''}</td>
                    <td class="px-3 py-4 text-right">${new Date().toISOString().split('T')[0]}</td>
                    <td class="px-3 py-4 text-right">-</td>
                </tr>
            `;
            if (usersTableBody) {
                 if (usersTablePlaceholder && usersTablePlaceholder.parentNode === usersTableBody) {
                    usersTableBody.removeChild(usersTablePlaceholder); // Remove placeholder if it's the only thing
                }
                usersTableBody.insertAdjacentHTML('afterbegin', newUserRow);
            }

            toggleModal(addUserModal, false);
            addUserForm.reset();
        });
    }

    // Handle table actions (Edit, Delete) using event delegation
    if (usersTableBody) {
        usersTableBody.addEventListener('click', (event) => {
            const target = event.target;
            const userRow = target.closest('tr[data-user-id]');
            if (!userRow) return;

            const userId = userRow.dataset.userId;
            const userNameElement = userRow.querySelector('div.text-sm.font-medium.text-gray-900');
            const userName = userNameElement ? userNameElement.textContent.trim() : `مستخدم ${userId}`;
            // استخراج كلمة المرور من data-password
            // تم حذف زر إظهار كلمة المرور
            if (target.closest('button.edit-user-btn')) {
                console.log(`Edit button clicked for User ID: ${userId}, Name: ${userName}`);
                alert(`تم الضغط على زر تعديل للمستخدم: ${userName}. (سيتم تنفيذ هذه الميزة لاحقاً، ربما بفتح نفس المودال مع ملء البيانات)`);
                // Backend Note: This should open an edit user modal pre-filled with user data.
            } else if (target.closest('button.delete-user-btn')) {
                console.log(`Delete button clicked for User ID: ${userId}, Name: ${userName}`);
                if (confirm(`هل أنت متأكد من رغبتك في حذف المستخدم: ${userName}؟`)) {
                    alert(`تم تأكيد حذف المستخدم: ${userName}. (سيتم ربطه بالـ backend لاحقاً)`);
                    userRow.remove(); // Simulate deletion from table
                    // Backend Note: Perform delete operation for the user via API and refresh the user list.
                }
            }
        });
    }

    // Filters, Search
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    const applyFiltersAndSearch = () => {
        const selectedRole = roleFilter ? roleFilter.value : '';
        const selectedStatus = statusFilter ? statusFilter.value : '';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        console.log('Applying filters and search:', { role: selectedRole, status: selectedStatus, search: searchTerm });
        // alert(`تطبيق الفلاتر: الدور=${selectedRole || 'الكل'}, الحالة=${selectedStatus || 'الكل'}, البحث=${searchTerm || 'لا يوجد'} (سيتم ربطه بالـ backend لاحقاً)`);
        
        // Frontend filtering simulation (replace with backend call)
        if (usersTableBody) {
            let hasVisibleRows = false;
            usersTableBody.querySelectorAll('tr[data-user-id]').forEach(row => {
                const userNameElement = row.querySelector('div.text-sm.font-medium.text-gray-900');
                const userRoleElement = row.querySelector('td:nth-child(2) span');
                const userStatusElement = row.querySelector('td:nth-child(3) span');
                const enrollmentIdElement = row.querySelector('div.text-sm.text-gray-500');

                const name = userNameElement ? userNameElement.textContent.toLowerCase() : '';
                const role = userRoleElement ? userRoleElement.textContent.trim() : '';
                const statusText = userStatusElement ? userStatusElement.textContent.trim() : '';
                let statusValue = '';
                if (statusText === 'نشط') statusValue = 'active';
                else if (statusText === 'غير نشط') statusValue = 'inactive';

                // استخراج رقم القيد من النص (مثلاً: "رقم القيد: 50000")
                let enrollmentId = '';
                if (enrollmentIdElement) {
                    const match = enrollmentIdElement.textContent.match(/رقم القيد:\s*(\d+)/);
                    if (match) enrollmentId = match[1];
                }

                let roleMatch = true;
                if (selectedRole) {
                    const roleMap = { "director": "المدير", "admin": "الإداري", "teacher": "المعلم", "external_teacher": "معلم خارجي", "student": "الطالب", "parent": "ولي الأمر"};
                    roleMatch = role === roleMap[selectedRole];
                }
                const statusMatch = selectedStatus ? statusValue === selectedStatus : true;
                // البحث بالاسم أو رقم القيد
                let searchMatch = true;
                if (searchTerm) {
                    searchMatch = name.includes(searchTerm) || enrollmentId.includes(searchTerm);
                }

                if (roleMatch && statusMatch && searchMatch) {
                    row.style.display = '';
                    hasVisibleRows = true;
                } else {
                    row.style.display = 'none';
                }
            });

            if (usersTablePlaceholder) {
                usersTablePlaceholder.style.display = hasVisibleRows ? 'none' : '';
                if (!hasVisibleRows) usersTablePlaceholder.querySelector('td').textContent = 'لا يوجد مستخدمون يطابقون معايير البحث.';
            }
        }
         // Backend Note: Fetch users based on applied filters and search term. Update the table.
    };

    if (roleFilter) roleFilter.addEventListener('change', applyFiltersAndSearch);
    if (statusFilter) statusFilter.addEventListener('change', applyFiltersAndSearch);
    if (searchInput) {
        searchInput.addEventListener('input', applyFiltersAndSearch); // Apply on every input change for demo
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            if (roleFilter) roleFilter.value = '';
            if (statusFilter) statusFilter.value = '';
            if (searchInput) searchInput.value = '';
            applyFiltersAndSearch(); // Re-apply to show all
            if (usersTablePlaceholder) usersTablePlaceholder.querySelector('td').textContent = 'يتم تحميل بيانات المستخدمين...';
            // alert('تم مسح الفلاتر.');
        });
    }

    // Pagination (Placeholder logic)
    // Backend Note: Actual pagination requires server-side logic and API calls.
    // This is a very basic frontend placeholder.
    const updatePaginationInfo = (start, end, total) => {
        document.querySelectorAll('.pagination-start-item').forEach(el => el.textContent = start);
        document.querySelectorAll('.pagination-end-item').forEach(el => el.textContent = end);
        document.querySelectorAll('.pagination-total-items').forEach(el => el.textContent = total);
    };
    // Initial call or after loading data
    // updatePaginationInfo(1, 2, 2); // Based on current static example


    // Check for `action=addUser` URL parameter (for Quick Action)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'addUser') {
        if (addUserBtn) {
            addUserBtn.click(); // Open the modal automatically
        }
    }
    
    // Simulate loading some data or clearing placeholder if data exists
    if (usersTableBody && usersTableBody.querySelectorAll('tr[data-user-id]').length > 0) {
        if (usersTablePlaceholder) usersTablePlaceholder.style.display = 'none';
    }


    console.log('users.js loaded. Modals, table actions, filters, search, and quick action trigger initialized.');

    if (regenEnrollmentIdBtn && userRoleModal && enrollmentIdInput) {
        regenEnrollmentIdBtn.addEventListener('click', function() {
            const role = userRoleModal.value;
            if (role) {
                let newId;
                let lastId = parseInt(enrollmentIdInput.value, 10);
                let tryCount = 0;
                do {
                    newId = getNextEnrollmentId(role);
                    tryCount++;
                } while (newId === lastId && tryCount < 5); // تجنب تكرار نفس الرقم الحالي
                enrollmentIdInput.value = newId;
            }
        });
    }

    // بيانات وهمية لكل دور
    const usersData = {
        admin: [
            {
                id: 1,
                name: 'أحمد محمد علي',
                enrollmentId: '50000',
                role: 'الإداري',
                email: 'ahmed.admin@email.com',
                phone: '0500000001',
                createdAt: '2024-01-15',
            },
        ],
        teacher: [
            {
                id: 2,
                name: 'فاطمة خالد إبراهيم',
                enrollmentId: '30000',
                role: 'المعلم',
                email: 'fatima.teacher@email.com',
                phone: '0500000002',
                createdAt: '2024-02-01',
                subjects: ['رياضيات', 'علوم'],
            },
            {
                id: 3,
                name: 'سامي حسن',
                enrollmentId: '30001',
                role: 'المعلم',
                email: 'sami.teacher@email.com',
                phone: '0500000003',
                createdAt: '2024-02-10',
                subjects: ['لغة عربية', 'تربية إسلامية'],
            },
        ],
        external_teacher: [
            {
                id: 4,
                name: 'منى سالم',
                enrollmentId: '60000',
                role: 'معلم خارجي',
                email: 'mona.ext@email.com',
                phone: '0500000004',
                createdAt: '2024-03-01',
                courses: ['دورة برمجة', 'دورة روبوتات'],
            },
        ],
        student: [
            {
                id: 5,
                name: 'محمد علي',
                enrollmentId: '10000',
                role: 'الطالب',
                email: 'mohammed.student@email.com',
                phone: '0500000005',
                createdAt: '2024-04-01',
                class: 'الثالث',
                section: 'ب',
                parentName: 'سعيد علي',
            },
        ],
        parent: [
            {
                id: 6,
                name: 'سعيد علي',
                enrollmentId: '20000',
                role: 'ولي الأمر',
                email: 'saeed.parent@email.com',
                phone: '0500000006',
                createdAt: '2024-04-10',
                childName: 'محمد علي',
            },
        ],
    };

    // تعريف الأعمدة لكل دور
    const columnsByRole = {
        admin: [
            { key: 'name', label: 'المستخدم' },
            { key: 'role', label: 'الدور' },
            { key: 'email', label: 'البريد الإلكتروني' },
            { key: 'enrollmentId', label: 'رقم القيد' },
            { key: 'phone', label: 'رقم الهاتف' },
            { key: 'createdAt', label: 'تاريخ الإنشاء' },
            { key: 'actions', label: 'الإجراءات' },
        ],
        teacher: [
            { key: 'name', label: 'المستخدم' },
            { key: 'role', label: 'الدور' },
            { key: 'email', label: 'البريد الإلكتروني' },
            { key: 'subjects', label: 'المواد' },
            { key: 'enrollmentId', label: 'رقم القيد' },
            { key: 'phone', label: 'رقم الهاتف' },
            { key: 'createdAt', label: 'تاريخ الإنشاء' },
            { key: 'actions', label: 'الإجراءات' },
        ],
        external_teacher: [
            { key: 'name', label: 'المستخدم' },
            { key: 'role', label: 'الدور' },
            { key: 'email', label: 'البريد الإلكتروني' },
            { key: 'courses', label: 'الدورات' },
            { key: 'enrollmentId', label: 'رقم القيد' },
            { key: 'phone', label: 'رقم الهاتف' },
            { key: 'createdAt', label: 'تاريخ الإنشاء' },
            { key: 'actions', label: 'الإجراءات' },
        ],
        student: [
            { key: 'name', label: 'المستخدم' },
            { key: 'role', label: 'الدور' },
            { key: 'email', label: 'البريد الإلكتروني' },
            { key: 'class', label: 'الصف' },
            { key: 'section', label: 'الفصل' },
            { key: 'parentName', label: 'اسم ولي الأمر' },
            { key: 'enrollmentId', label: 'رقم القيد' },
            { key: 'phone', label: 'رقم الهاتف' },
            { key: 'createdAt', label: 'تاريخ الإنشاء' },
            { key: 'actions', label: 'الإجراءات' },
        ],
        parent: [
            { key: 'name', label: 'المستخدم' },
            { key: 'role', label: 'الدور' },
            { key: 'email', label: 'البريد الإلكتروني' },
            { key: 'childName', label: 'اسم الابن' },
            { key: 'enrollmentId', label: 'رقم القيد' },
            { key: 'phone', label: 'رقم الهاتف' },
            { key: 'createdAt', label: 'تاريخ الإنشاء' },
            { key: 'actions', label: 'الإجراءات' },
        ],
    };

    // دالة مساعدة لإرجاع كلاس اللون المناسب لكل دور
    function getRoleBadgeClass(roleText) {
        switch (roleText) {
            case 'المدير':
                return 'bg-purple-100 text-purple-800';
            case 'الإداري':
                return 'bg-blue-100 text-blue-800';
            case 'المعلم':
                return 'bg-yellow-100 text-yellow-800';
            case 'معلم خارجي':
                return 'bg-cyan-100 text-cyan-800';
            case 'الطالب':
                return 'bg-green-100 text-green-800';
            case 'ولي الأمر':
                return 'bg-pink-100 text-pink-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    // دالة بناء رأس الجدول
    function renderTableHead(role) {
        const thead = document.querySelector('thead');
        if (!thead) return;
        const columns = columnsByRole[role] || columnsByRole['admin'];
        let tr = '<tr>';
        columns.forEach(col => {
            tr += `<th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">${col.label}</th>`;
        });
        tr += '</tr>';
        thead.innerHTML = tr;
    }

    // دالة بناء صفوف الجدول
    function renderTableBody(role) {
        if (!usersTableBody) return;
        const columns = columnsByRole[role] || columnsByRole['admin'];
        const data = usersData[role] || usersData['admin'];
        let rows = '';
        data.forEach(user => {
            rows += `<tr data-user-id="${user.id}">`;
            columns.forEach(col => {
                if (col.key === 'actions') {
                    // زر الإجراءات
                    if (role === 'student') {
                        rows += `<td class="px-3 py-4 whitespace-nowrap text-sm font-medium">
                            <button class="text-primary hover:text-primary-dark ml-2 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary edit-user-btn">تعديل</button>
                            <button class="text-accent hover:text-primary-dark p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-accent contact-btn">تواصل مع ولي الأمر</button>
                        </td>`;
                    } else {
                        rows += `<td class="px-3 py-4 whitespace-nowrap text-sm font-medium">
                            <button class="text-primary hover:text-primary-dark ml-2 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary edit-user-btn">تعديل</button>
                            <button class="text-accent hover:text-primary-dark p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-accent contact-btn">تواصل</button>
                        </td>`;
                    }
                } else if (col.key === 'role') {
                    // تلوين الدور
                    rows += `<td class="px-3 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(user.role)}">
                            ${user.role}
                        </span>
                    </td>`;
                } else {
                    rows += `<td class="px-3 py-4 whitespace-nowrap">${user[col.key] || ''}</td>`;
                }
            });
            rows += `</tr>`;
        });
        usersTableBody.innerHTML = rows;
    }

    // دالة رئيسية لتحديث الجدول عند تغيير الفلتر
    function updateTableByRole(role) {
        renderTableHead(role);
        renderTableBody(role);
    }

    // ربط الفلتر بتغيير الجدول مباشرة
    if (roleFilter) {
        roleFilter.addEventListener('change', function() {
            const selectedRole = this.value || 'admin';
            updateTableByRole(selectedRole);
        });
        // تحميل الجدول الافتراضي عند أول تحميل
        updateTableByRole(roleFilter.value || 'admin');
    }
});
