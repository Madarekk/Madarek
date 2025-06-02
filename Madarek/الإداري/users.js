
document.addEventListener('DOMContentLoaded', () => {

    const addUserBtn = document.getElementById('addUserBtn');
    const addUserModal = document.getElementById('addUserModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const addUserForm = document.getElementById('addUserForm');

    const usersTableBody = document.getElementById('usersTableBody');


    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

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
    

    if (addUserForm) {
        addUserForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(addUserForm);
            const userData = Object.fromEntries(formData.entries());
            console.log('Add User form submitted:', userData);
            alert(`تم إرسال بيانات المستخدم: ${userData.firstName} ${userData.middleName || ''} ${userData.lastName} (الدور: ${userData.userRole}, المعرف المؤقت: ${userData.temporaryId}). سيتم ربطه بالـ backend لاحقاً`);

            toggleModal(addUserModal, false);
        });
    }






    const applyFilters = () => {
        const selectedRole = roleFilter ? roleFilter.value : '';
        const selectedStatus = statusFilter ? statusFilter.value : '';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        console.log('Applying filters:', { role: selectedRole, status: selectedStatus, search: searchTerm });


        if (usersTableBody) {

            console.log('Filtering users table (placeholder)...');
        }
    };

    if (roleFilter) roleFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            if (roleFilter) roleFilter.value = '';
            if (statusFilter) statusFilter.value = '';
            if (searchInput) searchInput.value = '';
            applyFilters();
        });
    }


    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'addUser') {
        if (addUserBtn) {
            addUserBtn.click();
        }
    }

    console.log('users.js loaded for Admin role. Add user modal and filters initialized.');
});
