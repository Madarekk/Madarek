// قائمة برجر (القائمة الجانبية للجوال)
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileMenuButton = document.getElementById('closeMobileMenuButton');
    if (mobileMenuButton && mobileMenuOverlay) {
        mobileMenuButton.addEventListener('click', function (e) {
            e.stopPropagation();
            mobileMenuOverlay.classList.remove('hidden');
        });
        if (closeMobileMenuButton) {
            closeMobileMenuButton.addEventListener('click', function () {
                mobileMenuOverlay.classList.add('hidden');
            });
        }
        // إغلاق عند الضغط خارج القائمة
        mobileMenuOverlay.addEventListener('click', function (e) {
            if (e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.add('hidden');
            }
        });
        // إغلاق عند الضغط على رابط
        const mobileNavLinks = mobileMenuOverlay.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function () {
                setTimeout(() => mobileMenuOverlay.classList.add('hidden'), 100);
            });
        });
    }
});
// script.js لولي الأمر - قائمة الإشعارات وقائمة المستخدم
document.addEventListener('DOMContentLoaded', function () {
    // قائمة المستخدم
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenu = document.getElementById('userMenu');
    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', function (e) {
            e.stopPropagation();
            userMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', function (e) {
            if (!userMenu.contains(e.target) && !userMenuButton.contains(e.target)) {
                userMenu.classList.add('hidden');
            }
        });
    }

    // قائمة الإشعارات
    const notificationButton = document.querySelector('button[title="الإشعارات"]');
    let notificationPanel = document.getElementById('notificationPanel');
    if (notificationButton) {
        if (!notificationPanel) {
            // إنشاء قائمة الإشعارات إذا لم تكن موجودة
            notificationPanel = document.createElement('div');
            notificationPanel.id = 'notificationPanel';
            notificationPanel.className = 'absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 z-50 hidden text-right';
            notificationPanel.innerHTML = `
                <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                    <span class="text-base font-semibold text-text-primary">الإشعارات</span>
                    <button id="closeNotificationPanel" class="text-gray-400 hover:text-gray-700">&times;</button>
                </div>
                <div class="p-4 max-h-80 overflow-y-auto">
                    <div class="flex items-start mb-4">
                        <i data-lucide="bell" class="w-5 h-5 text-accent ml-2 mt-1 flex-shrink-0"></i>
                        <div>
                            <p class="text-sm text-text-secondary">تم إضافة واجب جديد في مادة العلوم.</p>
                            <span class="text-xs text-text-secondary">منذ دقيقة</span>
                        </div>
                    </div>
                    <div class="flex items-start mb-4">
                        <i data-lucide="message-square" class="w-5 h-5 text-primary ml-2 mt-1 flex-shrink-0"></i>
                        <div>
                            <p class="text-sm text-text-secondary">رسالة من معلم الرياضيات حول تقدم الطالب.</p>
                            <span class="text-xs text-text-secondary">منذ 10 دقائق</span>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <i data-lucide="alert-triangle" class="w-5 h-5 text-yellow-500 ml-2 mt-1 flex-shrink-0"></i>
                        <div>
                            <p class="text-sm text-text-secondary">تنبيه: غياب الطالب يوم الأربعاء.</p>
                            <span class="text-xs text-text-secondary">منذ يوم</span>
                        </div>
                    </div>
                </div>
            `;
            // ضع القائمة بمحاذاة الجهة اليمنى للزر
            // ضمان أن الحاوية الرئيسية للزر الجرس تحمل position: relative
if (getComputedStyle(notificationButton.parentElement).position === 'static') {
    notificationButton.parentElement.style.position = 'relative';
}
            notificationButton.parentElement.appendChild(notificationPanel);
            if (window.lucide) lucide.createIcons();
        }
        notificationButton.addEventListener('click', function (e) {
            e.stopPropagation();
            notificationPanel.classList.toggle('hidden');
            if (userMenu && !userMenu.classList.contains('hidden')) userMenu.classList.add('hidden');
        });
        document.addEventListener('click', function (e) {
            if (!notificationPanel.contains(e.target) && !notificationButton.contains(e.target)) {
                notificationPanel.classList.add('hidden');
            }
        });
        notificationPanel.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        // زر إغلاق
        notificationPanel.querySelector('#closeNotificationPanel').onclick = function () {
            notificationPanel.classList.add('hidden');
        };
    }
});
