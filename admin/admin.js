// بيانات وهمية أولية
const fakeStats = {
    students: 320,
    teachers: 22,
    classes: 14,
    attendance: 91,
    alerts: 2
};
const fakeStudents = [
    {id: 1, name: "أحمد علي", grade: "الأول", parent: "محمد علي", phone: "0912345678"},
    {id: 2, name: "سارة محمد", grade: "الثاني", parent: "خالد محمد", phone: "0923456789"},
    {id: 3, name: "مريم يوسف", grade: "الثالث", parent: "يوسف سالم", phone: "0945671234"}
];
const fakeTeachers = [
    {id: 1, name: "منى عبد الله", subject: "رياضيات"},
    {id: 2, name: "يوسف سالم", subject: "لغة عربية"}
];

function renderDashboard() {
    document.getElementById('admin-main-content').innerHTML = `
    <h1>لوحة المعلومات</h1>
    <div class="dashboard-cards">
        <div class="dashboard-card"><span>👨‍🎓</span><div>عدد الطلاب</div><strong>${fakeStats.students}</strong></div>
        <div class="dashboard-card"><span>👩‍🏫</span><div>عدد المعلمين</div><strong>${fakeStats.teachers}</strong></div>
        <div class="dashboard-card"><span>🏫</span><div>عدد الفصول</div><strong>${fakeStats.classes}</strong></div>
        <div class="dashboard-card"><span>📅</span><div>نسبة الحضور اليوم</div><strong>${fakeStats.attendance}%</strong></div>
        <div class="dashboard-card"><span>🔔</span><div>تنبيهات</div><strong>${fakeStats.alerts}</strong></div>
    </div>
    <h2>إحصائيات سريعة</h2>
    <div style="display:flex;gap:2rem;flex-wrap:wrap">
      <div style="flex:1;min-width:220px">
        <strong>مخطط الحضور الشهري (وهمي)</strong>
        <div style="background:#f4f6fb;border-radius:10px;height:120px;display:flex;align-items:center;justify-content:center;color:#bbb;">[مخطط]</div>
      </div>
      <div style="flex:1;min-width:220px">
        <strong>مخطط توزيع الطلاب حسب الصفوف (وهمي)</strong>
        <div style="background:#f4f6fb;border-radius:10px;height:120px;display:flex;align-items:center;justify-content:center;color:#bbb;">[مخطط]</div>
      </div>
    </div>
    <h2>تنبيهات إدارية</h2>
    <ul class="recent-list">
      <li>هناك ${fakeStats.alerts} تنبيهات جديدة بانتظار المراجعة.</li>
      <li>تذكير: غدًا اجتماع مجلس الإدارة.</li>
    </ul>
    `;
}

function renderStudents() {
    document.getElementById('admin-main-content').innerHTML = `
    <h1>إدارة الطلاب</h1>
    <button class="add-btn">إضافة طالب جديد</button>
    <input type="text" placeholder="ابحث باسم الطالب..." style="margin:1rem 0;width:220px;">
    <table class="students-table">
        <thead>
            <tr>
                <th>الرقم</th>
                <th>اسم الطالب</th>
                <th>الصف</th>
                <th>اسم ولي الأمر</th>
                <th>الهاتف</th>
                <th>إجراءات</th>
            </tr>
        </thead>
        <tbody>
            ${fakeStudents.map(s => `
                <tr>
                    <td>${s.id}</td>
                    <td>${s.name}</td>
                    <td>${s.grade}</td>
                    <td>${s.parent}</td>
                    <td>${s.phone}</td>
                    <td>
                        <button class="edit-btn">تعديل</button>
                        <button class="delete-btn">حذف</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    `;
}

function renderTeachers() {
    document.getElementById('admin-main-content').innerHTML = `
    <h1>إدارة المعلمين</h1>
    <button class="add-btn">إضافة معلم جديد</button>
    <table class="students-table">
        <thead>
            <tr>
                <th>الرقم</th>
                <th>اسم المعلم</th>
                <th>التخصص</th>
                <th>إجراءات</th>
            </tr>
        </thead>
        <tbody>
            ${fakeTeachers.map(t => `
                <tr>
                    <td>${t.id}</td>
                    <td>${t.name}</td>
                    <td>${t.subject}</td>
                    <td>
                        <button class="edit-btn">تعديل</button>
                        <button class="delete-btn">حذف</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    `;
}

function renderAttendance() {
    document.getElementById('admin-main-content').innerHTML = `
    <h1>الحضور والانصراف</h1>
    <div class="dashboard-cards">
      <div class="dashboard-card"><span>📅</span><div>نسبة الحضور اليوم</div><strong>${fakeStats.attendance}%</strong></div>
      <div class="dashboard-card"><span>👨‍🎓</span><div>طلاب حاضرين</div><strong>${Math.round(fakeStats.students*fakeStats.attendance/100)}</strong></div>
      <div class="dashboard-card"><span>👩‍🏫</span><div>معلمون حاضرين</div><strong>${fakeStats.teachers-1}</strong></div>
    </div>
    <div style="margin-top:2rem">
      <strong>قائمة الغياب اليومي (وهمية)</strong>
      <ul class="recent-list">
        <li>سارة محمد (طالبة)</li>
        <li>يوسف سالم (معلم)</li>
      </ul>
    </div>
    `;
}

function renderSchedule() {
    document.getElementById('admin-main-content').innerHTML = `
    <h1>الجداول الدراسية</h1>
    <div style="background:#f4f6fb;border-radius:10px;padding:2rem;text-align:center;">
      <strong>جدول الحصص الأسبوعي (تصميم تخيلي)</strong>
      <div style="margin-top:1rem;color:#888;">[هنا جدول الحصص]</div>
    </div>
    <button class="add-btn" style="margin-top:2rem">إضافة/تعديل جدول</button>
    `;
}

function renderContent() {
    document.getElementById('admin-main-content').innerHTML = `
    <h1>المحتوى والاختبارات</h1>
    <button class="add-btn">إضافة درس/اختبار جديد</button>
    <div style="margin:2rem 0;background:#f4f6fb;padding:1.5rem;border-radius:10px;">
      <strong>قائمة الدروس والاختبارات (وهمية)</strong>
      <ul class="recent-list">
        <li>درس: الكسور العشرية - الصف الثالث</li>
        <li>اختبار: قواعد اللغة - الصف الثاني</li>
      </ul>
    </div>
    `;
}

function renderReports() {
    document.getElementById('admin-main-content').innerHTML = `
    <h1>التقارير والإحصائيات</h1>
    <div class="dashboard-cards">
      <div class="dashboard-card"><span>📊</span><div>تقارير الأداء الأكاديمي</div><strong>12 تقرير</strong></div>
      <div class="dashboard-card"><span>📈</span><div>تقارير الحضور</div><strong>6 تقارير</strong></div>
    </div>
    <button class="add-btn">توليد تقرير جديد</button>
    <div style="margin-top:2rem;color:#888;">[مخطط وهمي لتقرير]</div>
    `;
}

function renderSettings() {
    document.getElementById('admin-main-content').innerHTML = `
    <h1>إعدادات النظام</h1>
    <div style="background:#f4f6fb;border-radius:10px;padding:2rem;max-width:400px;margin:auto;">
      <label>اسم المدرسة:<input type="text" style="width:100%;margin:0.5rem 0"></label>
      <label>البريد الإلكتروني:<input type="email" style="width:100%;margin:0.5rem 0"></label>
      <label>تغيير كلمة المرور:<input type="password" style="width:100%;margin:0.5rem 0"></label>
      <button class="add-btn" style="width:100%;margin-top:1rem">حفظ الإعدادات</button>
    </div>
    `;
}

function setupSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const adminSidebar = document.getElementById('admin-sidebar');
    const mainContent = document.getElementById('admin-main-content');
    const adminHeader = document.querySelector('.admin-header');

    if (sidebarToggle && adminSidebar && mainContent && adminHeader) {
        sidebarToggle.onclick = function (e) {
            e.preventDefault();

            // تغيير حالة السايدبار
            const isCollapsed = adminSidebar.classList.toggle('sidebar-collapsed');
            mainContent.classList.toggle('sidebar-collapsed');
            adminHeader.classList.toggle('sidebar-collapsed');
            sidebarToggle.classList.toggle('sidebar-collapsed'); // ← تحريك الزر عند الإغلاق/الفتح

            // تعديل كلاس إضافي للهيدر إذا احتجت استخدامه
            if (!isCollapsed) {
                adminHeader.classList.add('sidebar-open');
            } else {
                adminHeader.classList.remove('sidebar-open');
            }

            const adminTitle = document.querySelector('.admin-title');
            if (adminTitle) {
                adminTitle.classList.toggle('sidebar-collapsed');
            }

        };

        // عند التحميل، تأكد من ضبط الكلاسات بشكل صحيح
        if (!adminSidebar.classList.contains('sidebar-collapsed')) {
            adminHeader.classList.add('sidebar-open');
        }
    }

    // إعداد روابط التنقل
    document.getElementById('dashboard-link').onclick = function (e) { e.preventDefault(); renderDashboard(); highlight(this); };
    document.getElementById('students-link').onclick = function (e) { e.preventDefault(); renderStudents(); highlight(this); };
    document.getElementById('teachers-link').onclick = function (e) { e.preventDefault(); renderTeachers(); highlight(this); };
    document.getElementById('attendance-link').onclick = function (e) { e.preventDefault(); renderAttendance(); highlight(this); };
    document.getElementById('schedule-link').onclick = function (e) { e.preventDefault(); renderSchedule(); highlight(this); };
    document.getElementById('content-link').onclick = function (e) { e.preventDefault(); renderContent(); highlight(this); };
    document.getElementById('reports-link').onclick = function (e) { e.preventDefault(); renderReports(); highlight(this); };
    document.getElementById('settings-link').onclick = function (e) { e.preventDefault(); renderSettings(); highlight(this); };
}

function highlight(link) {
    document.querySelectorAll('.admin-sidebar ul li a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
}

window.onload = function () {
    setupSidebar();
    renderDashboard();
    document.getElementById('dashboard-link').classList.add('active');
};
