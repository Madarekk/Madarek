// Login form functionality and validation for Madarek Platform
// Backend developers: This script handles client-side validation and UI interactions.
// Form submission target: 'login.php' (example)
// Expected POST fields: user_id, password, user_role, remember_me (optional)

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIconOpen = document.getElementById('eyeIconOpen');
    const eyeIconClosed = document.getElementById('eyeIconClosed');
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginBtnLoader = document.getElementById('loginBtnLoader');

    // Password visibility toggle
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icons
            if (type === 'text') {
                eyeIconOpen.classList.add('hidden');
                eyeIconClosed.classList.remove('hidden');
            } else {
                eyeIconOpen.classList.remove('hidden');
                eyeIconClosed.classList.add('hidden');
            }
        });
    }

    // Form validation logic
    function validateForm() {
        const userId = document.getElementById('user_id').value.trim();
        const password = passwordInput.value.trim(); // Already have passwordInput
        const userRole = document.getElementById('user_role').value;
        
        let isValid = true;
        clearAllErrors(); // Clear previous errors
        
        // Validate user ID
        if (!userId) {
            showError('user_id', 'معرف المستخدم مطلوب.');
            isValid = false;
        } else if (userId.length < 3) {
            showError('user_id', 'معرف المستخدم يجب أن يكون 3 أحرف على الأقل.');
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            showError('password', 'كلمة المرور مطلوبة.');
            isValid = false;
        } else if (password.length < 6) {
            showError('password', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
            isValid = false;
        }
        
        // Validate role selection
        if (!userRole) {
            showError('user_role', 'يرجى اختيار الدور.');
            isValid = false;
        }
        
        return isValid;
    }

    // Show error message for a specific field
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        // Assumes .error-message is a sibling to the input's wrapper (.relative)
        // within a common .form-field-container
        const errorContainer = field.closest('.form-field-container');
        if (!errorContainer) return;
        const errorElement = errorContainer.querySelector('.error-message');
        
        if (field && errorElement) {
            field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
            field.classList.remove('border-gray-300', 'focus:border-indigo-500', 'focus:ring-indigo-500');
            
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    // Clear error message for a specific field
    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorContainer = field.closest('.form-field-container');
        if (!errorContainer) return;
        const errorElement = errorContainer.querySelector('.error-message');

        if (field && errorElement) {
            field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
            field.classList.add('border-gray-300', 'focus:border-indigo-500', 'focus:ring-indigo-500');
            
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    }

    // Clear all error messages on the form
    function clearAllErrors() {
        document.querySelectorAll('.form-field-container').forEach(container => {
            const field = container.querySelector('input, select');
            const errorElement = container.querySelector('.error-message');
            if (field) {
                 field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
                 field.classList.add('border-gray-300', 'focus:border-indigo-500', 'focus:ring-indigo-500');
            }
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.add('hidden');
            }
        });
    }
    
    // Show loading state on login button
    function showLoading() {
        loginBtn.disabled = true;
        loginBtn.classList.add('opacity-75', 'cursor-not-allowed');
        loginBtnText.classList.add('hidden');
        loginBtnLoader.classList.remove('hidden');
        loginBtnLoader.classList.add('flex'); // Ensure loader is flex for items-center
    }

    // Hide loading state on login button
    function hideLoading() {
        loginBtn.disabled = false;
        loginBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        loginBtnText.classList.remove('hidden');
        loginBtnLoader.classList.add('hidden');
        loginBtnLoader.classList.remove('flex');
    }

    // Form submission handler
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            showLoading();
            
            // Simulate form submission (for demonstration)
            // Backend developers: Remove this setTimeout and let the form submit via 'action' attribute
            // or handle submission with Fetch API / XMLHttpRequest.
            setTimeout(() => {
                hideLoading();
                
                const userRole = document.getElementById('user_role').value;
                const roleNames = {
                    'director': 'المدير', 'admin': 'الإداري', 'teacher': 'المعلم',
                    'external_teacher': 'المعلم الخارجي', 'student': 'الطالب', 'parent': 'ولي الأمر'
                };
                
                showModal(
                    'success',
                    'تم تسجيل الدخول بنجاح',
                    `مرحباً بك كـ ${roleNames[userRole] || 'مستخدم'}، سيتم تحويلك إلى لوحة التحكم.`
                );
                
                // Simulate redirect after 2 seconds (Backend handles actual redirect)
                setTimeout(() => {
                    console.log('Redirecting to dashboard for role:', userRole);
                    // Example: window.location.href = getDashboardUrl(userRole);
                    // closeModal(); // Optionally close modal before redirect
                }, 2000);
                
            }, 1500);
            
            // For actual submission:
            // this.submit(); 
            // OR: use Fetch API
        });
    }

    // Real-time validation on blur/change
    ['user_id', 'password', 'user_role'].forEach(fieldId => {
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
            const eventType = fieldElement.tagName === 'SELECT' ? 'change' : 'blur';
            fieldElement.addEventListener(eventType, function() {
                // Basic check: if field has value, clear its specific error
                if (this.value.trim() !== '') {
                     clearFieldError(fieldId); // Clear only if there's a value, specific validation can be added
                }
                // More detailed real-time validation can be added here if needed
                // For example, re-validating the specific field:
                if (fieldId === 'user_id') {
                    if (this.value.trim() && this.value.trim().length < 3) showError('user_id', 'معرف المستخدم يجب أن يكون 3 أحرف على الأقل.');
                } else if (fieldId === 'password') {
                    if (this.value.trim() && this.value.trim().length < 6) showError('password', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
                }
            });
        }
    });
    
    // Modal functionality
    const messageModal = document.getElementById('messageModal');
    const modalDialog = document.getElementById('modalDialog');
    const modalIconContainer = document.getElementById('modalIconContainer');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    function showModal(type, title, message) {
        if (!messageModal || !modalDialog || !modalIconContainer || !modalTitle || !modalMessage) return;

        modalTitle.textContent = title;
        modalMessage.textContent = message;
        
        modalIconContainer.innerHTML = ''; // Clear previous icon
        let iconColorClass = '';

        if (type === 'success') {
            iconColorClass = 'bg-green-100 text-green-600';
            modalIconContainer.innerHTML = `
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>`;
        } else if (type === 'error') {
            iconColorClass = 'bg-red-100 text-red-600';
            modalIconContainer.innerHTML = `
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>`;
        }
        modalIconContainer.className = `mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center text-3xl ${iconColorClass}`;
        
        messageModal.classList.remove('hidden');
        messageModal.classList.add('flex');
        // Trigger reflow for transition
        void modalDialog.offsetWidth; 
        modalDialog.classList.remove('scale-95', 'opacity-0');
        modalDialog.classList.add('scale-100', 'opacity-100');
    }

    // Expose closeModal to global scope for HTML onclick
    window.closeModal = function() {
        if (!messageModal || !modalDialog) return;
        modalDialog.classList.add('scale-95', 'opacity-0');
        modalDialog.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
            messageModal.classList.add('hidden');
            messageModal.classList.remove('flex');
        }, 300); // Match transition duration
    };

    // Close modal on backdrop click or Escape key
    if (messageModal) {
        messageModal.addEventListener('click', function(e) {
            if (e.target === messageModal) { // Click on backdrop
                closeModal();
            }
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && messageModal && !messageModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Auto-focus on the first input field
    const firstInput = document.getElementById('user_id');
    if (firstInput) {
        firstInput.focus();
    }

    // Save and retrieve last used role (optional enhancement)
    const userRoleSelect = document.getElementById('user_role');
    const rememberMeCheckbox = document.getElementById('remember_me');

    if (userRoleSelect && localStorage.getItem('madarik_last_role_remembered') === 'true') {
        const lastRole = localStorage.getItem('madarik_last_role');
        if (lastRole) {
            userRoleSelect.value = lastRole;
        }
    }
    if (rememberMeCheckbox && localStorage.getItem('madarik_remember_me') === 'true'){
        rememberMeCheckbox.checked = true;
    }


    if (userRoleSelect && rememberMeCheckbox) {
        loginForm.addEventListener('submit', () => { // Use submit event of form
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('madarik_last_role', userRoleSelect.value);
                localStorage.setItem('madarik_last_role_remembered', 'true');
                localStorage.setItem('madarik_remember_me', 'true');

            } else {
                localStorage.removeItem('madarik_last_role');
                localStorage.removeItem('madarik_last_role_remembered');
                localStorage.removeItem('madarik_remember_me');
            }
        });
    }
});

// Helper for backend: Construct dashboard URL (example)
// function getDashboardUrl(role) {
//     const base = 'dashboard/'; // Adjust if your paths are different
//     const paths = {
//         'director': `${base}director.html`, 'admin': `${base}admin.html`,
//         'teacher': `${base}teacher.html`, 'external_teacher': `${base}external-teacher.html`,
//         'student': `${base}student.html`, 'parent': `${base}parent.html`
//     };
//     return paths[role] || `${base}default.html`;
// }

// Note on "Unexpected token 'for'" DevTool error:
// The previously reported "Unexpected token 'for'" error could not be definitively pinpointed
// in the provided code. This script has been reviewed for syntax and common issues.
// The large multi-line comment containing PHP/SQL example code, which was at the end of the
// original script.js, has been removed as part of cleanup. If the error originated from
// malformed content within that comment, its removal might resolve the issue.
// Further debugging would require more specific error context (like line numbers).
