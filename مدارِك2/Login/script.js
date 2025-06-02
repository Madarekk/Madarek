// DOM Elements
const loginForm = document.getElementById('loginForm');
const userIdInput = document.getElementById('userId');
const passwordInput = document.getElementById('password');
const userRoleSelect = document.getElementById('userRole');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginButton = document.getElementById('loginButton');
const loginButtonText = document.getElementById('loginButtonText');
const alertMessage = document.getElementById('alertMessage');
const loadingOverlay = document.getElementById('loadingOverlay');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    setupEventListeners();
    loadRememberedCredentials();
    addFormValidation();
    addAnimations();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleFormSubmit);
    
    // Password toggle
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Input validation on blur
    userIdInput.addEventListener('blur', () => validateField(userIdInput));
    passwordInput.addEventListener('blur', () => validateField(passwordInput));
    userR
oleSelect.addEventListener('change', () => validateField(userRoleSelect));
    
    // Real-time input feedback
    userIdInput.addEventListener('input', handleInputChange);
    passwordInput.addEventListener('input', handleInputChange);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShorts);
}

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        userId: userIdInput.value.trim(),
        password: passwordInput.value,
        role: userRoleSelect.value,
        rememberMe: rememberMeCheckbox.checked
    };
    
    await performLogin(formData);
}

/**
 * Validate the entire form
 */
function validateForm() {
    let isValid = true;
    
    // Clear previous alerts
    hideAlert();
    
    // Validate each field
    if (!validateField(userIdInput)) isValid = false;
    if (!validateField(passwordInput)) isValid = false;
    if (!validateField(userRoleSelect)) isValid = false;
    
    return isValid;
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous validation classes
    field.classList.remove('input-error', 'input-success');
    
    switch (field.id) {
        case 'userId':
            if (!value) {
                errorMessage = 'معرف المستخدم مطلوب';
                isValid = false;
            } else if (value.length < 3) {
                errorMessage = 'معرف المستخدم يجب أن يكون 3 أحرف على الأقل';
                isValid = false;
            }
            break;
            
        case 'password':
            if (!value) {
                errorMessage = 'كلمة المرور مطلوبة';
                isValid = false;
            } else if (value.length < 6) {
                errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
                isValid = false;
            }
            break;
            
        case 'userRole':
            if (!value) {
                errorMessage = 'يجب اختيار الدور';
                isValid = false;
            }
            break;
    }
    
    // Apply validation styling
    if (isValid) {
        field.classList.add('input-success');
    } else {
        field.classList.add('input-error');
        if (errorMessage) {
            showAlert(errorMessage, 'error');
        }
    }
    
    return isValid;
}

/**
 * Handle input changes for real-time feedback
 */
function handleInputChange(event) {
    const field = event.target;
    
    // Remove error styling on input
    if (field.classList.contains('input-error')) {
        field.classList.remove('input-error');
        hideAlert();
    }
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    const icon = togglePasswordBtn.querySelector('i');
    
    passwordInput.type = isPassword ? 'text' : 'password';
    icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    
    // Add animation
    icon.style.transform = 'scale(0.8)';
    setTimeout(() => {
        icon.style.transform = 'scale(1)';
    }, 150);
}

/**
 * Perform login process
 */
async function performLogin(formData) {
    try {
        showLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Handle remember me functionality
        if (formData.rememberMe) {
            saveCredentials(formData);
        } else {
            clearSavedCredentials();
        }
        
        // Simulate login validation
        const loginResult = simulateLogin(formData);
        
        if (loginResult.success) {
            showAlert('تم تسجيل الدخول بنجاح! جاري التحويل...', 'success');
            
            // Simulate redirect delay
            setTimeout(() => {
                redirectToDashboard(formData.role);
            }, 1500);
        } else {
            showAlert(loginResult.message, 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showAlert('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Simulate login validation
 */
function simulateLogin(formData) {
    // Simulate different login scenarios
    const validCredentials = {
        'admin': { userId: 'admin001', password: 'admin123' },
        'staff': { userId: 'staff001', password: 'staff123' },
        'teacher': { userId: 'teacher001', password: 'teacher123' },
        'external_teacher': { userId: 'ext001', password: 'ext123' },
        'student': { userId: 'student001', password: 'student123' },
        'parent': { userId: 'parent001', password: 'parent123' }
    };
    
    const roleCredentials = validCredentials[formData.role];
    
    if (!roleCredentials) {
        return { success: false, message: 'الدور المحدد غير صحيح' };
    }
    
    if (formData.userId === roleCredentials.userId && formData.password === roleCredentials.password) {
        return { success: true };
    } else {
        return { success: false, message: 'معرف المستخدم أو كلمة المرور غير صحيحة' };
    }
}

/**
 * Redirect to appropriate dashboard
 */
function redirectToDashboard(role) {
    const dashboardUrls = {
        'admin': 'admin-dashboard.html',
        'staff': 'staff-dashboard.html',
        'teacher': 'teacher-dashboard.html',
        'external_teacher': 'external-teacher-dashboard.html',
        'student': 'student-dashboard.html',
        'parent': 'parent-dashboard.html'
    };
    
    const url = dashboardUrls[role] || 'dashboard.html';
    
    // In a real application, this would redirect to the actual dashboard
    console.log(`Redirecting to: ${url}`);
    showAlert(`سيتم التحويل إلى لوحة تحكم ${getRoleDisplayName(role)}`, 'success');
}

/**
 * Get role display name in Arabic
 */
function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'المدير',
        'staff': 'الإداري',
        'teacher': 'المعلم',
        'external_teacher': 'المعلم الخارجي',
        'student': 'الطالب',
        'parent': 'ولي الأمر'
    };
    
    return roleNames[role] || role;
}

/**
 * Show/hide loading overlay
 */
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.remove('hidden');
        loginButton.disabled = true;
        loginButtonText.textContent = 'جاري التحقق...';
    } else {
        loadingOverlay.classList.add('hidden');
        loginButton.disabled = false;
        loginButtonText.textContent = 'تسجيل الدخول';
    }
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    alertMessage.textContent = message;
    alertMessage.className = `p-3 rounded-lg text-sm alert-${type}`;
    alertMessage.classList.remove('hidden');
    
    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(hideAlert, 3000);
    }
}

/**
 * Hide alert message
 */
function hideAlert() {
    alertMessage.classList.add('hidden');
}

/**
 * Save credentials to localStorage
 */
function saveCredentials(formData) {
    try {
        const credentials = {
            userId: formData.userId,
            role: formData.role,
            timestamp: Date.now()
        };
        
        localStorage.setItem('madarik_credentials', JSON.stringify(credentials));
    } catch (error) {
        console.error('Error saving credentials:', error);
    }
}

/**
 * Load remembered credentials
 */
function loadRememberedCredentials() {
    try {
        const saved = localStorage.getItem('madarik_credentials');
        if (saved) {
            const credentials = JSON.parse(saved);
            
            // Check if credentials are not too old (7 days)
            const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            if (credentials.timestamp > weekAgo) {
                userIdInput.value = credentials.userId;
                userRoleSelect.value = credentials.role;
                rememberMeCheckbox.checked = true;
            } else {
                clearSavedCredentials();
            }
        }
    } catch (error) {
        console.error('Error loading credentials:', error);
        clearSavedCredentials();
    }
}

/**
 * Clear saved credentials
 */
function clearSavedCredentials() {
    localStorage.removeItem('madarik_credentials');
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShorts(event) {
    // Enter key to submit form
    if (event.key === 'Enter' && event.target !== loginButton) {
        event.preventDefault();
        loginForm.dispatchEvent(new Event('submit'));
    }
    
    // Escape key to clear form
    if (event.key === 'Escape') {
        clearForm();
    }
}

/**
 * Clear form fields
 */
function clearForm() {
    userIdInput.value = '';
    passwordInput.value = '';
    userRoleSelect.value = '';
    rememberMeCheckbox.checked = false;
    hideAlert();
    
    // Remove validation classes
    document.querySelectorAll('.input-error, .input-success').forEach(element => {
        element.classList.remove('input-error', 'input-success');
    });
}

/**
 * Add animations to form elements
 */
function addAnimations() {
    // Add fade-in animation to the login card
    const loginCard = document.querySelector('.bg-white.rounded-2xl');
    loginCard.classList.add('animate-fade-in-up');
    
    // Add hover effects to form fields
    const formFields = document.querySelectorAll('input, select');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        field.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Demo credentials helper (for development)
 */
function showDemoCredentials() {
    console.log('Demo Credentials:');
    console.log('المدير: admin001 / admin123');
    console.log('الإداري: staff001 / staff123');
    console.log('المعلم: teacher001 / teacher123');
    console.log('معلم خارجي: ext001 / ext123');
    console.log('الطالب: student001 / student123');
    console.log('ولي الأمر: parent001 / parent123');
}

// Show demo credentials in console for testing
showDemoCredentials();

// Export functions for potential future use
window.MadarikLogin = {
    clearForm,
    showDemoCredentials,
    validateForm
};
