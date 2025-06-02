document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.querySelector('.signup-btn');

    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        removeMessages();
        // التأكد من الموافقة على الشروط
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            showError('يرجى الموافقة على الشروط والأحكام وسياسة الخصوصية');
            return;
        }
        // تعطيل الزر وإظهار تحميل وهمي
        signupBtn.disabled = true;
        const originalText = signupBtn.innerHTML;
        signupBtn.innerHTML = '<span class="loader"></span> جارٍ التسجيل...';
        setTimeout(function () {
            signupBtn.disabled = false;
            signupBtn.innerHTML = originalText;
            showSuccess('تم إنشاء الحساب بنجاح!');
            signupForm.reset();
        }, 2000);
    });
});

function showError(message) {
    removeMessages();
    const form = document.getElementById('signupForm');
    let error = document.createElement('div');
    error.className = 'error-message';
    error.innerText = message;
    form.parentNode.insertBefore(error, form);
}
function showSuccess(message) {
    removeMessages();
    const form = document.getElementById('signupForm');
    let success = document.createElement('div');
    success.className = 'success-message';
    success.innerText = message;
    form.parentNode.insertBefore(success, form);
}
function removeMessages() {
    const error = document.querySelector('.error-message');
    if (error) error.remove();
    const success = document.querySelector('.success-message');
    if (success) success.remove();
}
// تأثير تحميل للزر
const style = document.createElement('style');
style.innerHTML = `
.loader {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid #fff;
  border-radius: 50%;
  border-top: 3px solid #27ae60;
  animation: spin 1s linear infinite;
  vertical-align: middle;
  margin-left: 6px;
  margin-right: 4px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);
