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
            event.preventDefault();
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
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                                <div class="h-10 w-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm font-medium">${(userData.firstName || '?').charAt(0)}</div>
                            </div>
                            <div class="mr-4">
                                <div class="text-sm font-medium text-gray-900">${userData.firstName || ''} ${userData.secondName || ''} ${userData.lastName || ''}</div>
                                <div class="text-sm text-gray-500">${userData.userRole} (${userData.username})</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            ${userData.userRole || 'غير محدد'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            نشط
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${new Date().toISOString().split('T')[0]}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-primary hover:text-primary-dark ml-2 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary edit-user-btn">تعديل</button>
                        <button class="text-red-600 hover:text-red-900 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 delete-user-btn">حذف</button>
                    </td>
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

                const name = userNameElement ? userNameElement.textContent.toLowerCase() : '';
                const role = userRoleElement ? userRoleElement.textContent.trim() : '';
                const statusText = userStatusElement ? userStatusElement.textContent.trim() : '';
                let statusValue = '';
                if (statusText === 'نشط') statusValue = 'active';
                else if (statusText === 'غير نشط') statusValue = 'inactive';


                let roleMatch = true;
                if (selectedRole) {
                    // This requires mapping selectedRole (e.g., "director") to the text in the table (e.g., "المدير")
                    // For simplicity, direct match or map if values are different
                    const roleMap = { "director": "المدير", "admin": "الإداري", "teacher": "المعلم", "external_teacher": "معلم خارجي", "student": "الطالب", "parent": "ولي الأمر"};
                    roleMatch = role === roleMap[selectedRole];
                }
                
                const statusMatch = selectedStatus ? statusValue === selectedStatus : true;
                const searchMatch = searchTerm ? name.includes(searchTerm) : true;

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
});
