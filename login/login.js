document.querySelector('.login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        alert('تسجيل الدخول ناجح!');
    } else {
        alert('يرجى ملء جميع الحقول.');
    }
});