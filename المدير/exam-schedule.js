document.addEventListener('DOMContentLoaded', function() {
    // بيانات الصفوف من الرابع إلى التاسع فقط
    const examClasses = [
        { id: '4', name: 'الصف الرابع' },
        { id: '5', name: 'الصف الخامس' },
        { id: '6', name: 'الصف السادس' },
        { id: '7', name: 'الصف السابع' },
        { id: '8', name: 'الصف الثامن' },
        { id: '9', name: 'الصف التاسع' }
    ];
    const allSubjects = [
        "الرياضيات", "الفيزياء", "الكيمياء", "الأحياء", "اللغة العربية", "اللغة الإنجليزية", "التاريخ", "الجغرافيا", "التربية الإسلامية", "الحاسوب", "الفنون", "التربية البدنية", ""
    ];
    const days = [
        { key: 'sun', name: 'الأحد' }, { key: 'mon', name: 'الإثنين' },
        { key: 'tue', name: 'الثلاثاء' }, { key: 'wed', name: 'الأربعاء' },
        { key: 'thu', name: 'الخميس' }
    ];
    // عناصر الصفحة
    const examClassSelector = document.getElementById('examClassSelector');
    const examStartDateInput = document.getElementById('examStartDate');
    const examScheduleDisplayContainer = document.getElementById('examScheduleDisplayContainer');
    const examScheduleGridBody = document.getElementById('examScheduleGridBody');
    const examScheduleThead = document.getElementById('examScheduleThead');
    const examScheduleTitle = document.getElementById('examScheduleTitle');
    const saveExamBtn = document.getElementById('saveExamScheduleChanges');
    const noExamScheduleSelected = document.getElementById('noExamScheduleSelected');
    const period1TimeInput = document.getElementById('examPeriod1Time');
    const period2TimeInput = document.getElementById('examPeriod2Time');
    // LocalStorage helpers
    const EXAM_SCHEDULE_KEY = 'examsScheduleData2';
    const getExamScheduleData = () => {
        const data = localStorage.getItem(EXAM_SCHEDULE_KEY);
        return data ? JSON.parse(data) : [];
    };
    const saveExamScheduleData = (data) => {
        localStorage.setItem(EXAM_SCHEDULE_KEY, JSON.stringify(data));
    };
    // تعبئة قائمة الصفوف
    function populateExamClassSelector() {
        examClassSelector.innerHTML = '<option value="">اختر الصف الدراسي...</option>';
        examClasses.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            examClassSelector.appendChild(option);
        });
    }
    // حساب أيام الامتحانات
    function getExamDays(startDate) {
        const result = [];
        let date = new Date(startDate);
        while (date.getDay() !== 0) date.setDate(date.getDate() + 1); // Sunday
        for (let week = 1; week <= 2; week++) {
            for (let i = 0; i < 5; i++) {
                const d = new Date(date);
                d.setDate(date.getDate() + i + (week - 1) * 7);
                result.push({
                    date: d.toISOString().slice(0, 10),
                    dayName: days[i].name + ' (الأسبوع ' + week + ')',
                    week,
                    dayKey: days[i].key + '_w' + week
                });
            }
        }
        return result;
    }
    // رسم الجدول
    function renderExamScheduleTable(classId, startDate) {
        examScheduleGridBody.innerHTML = '';
        examScheduleThead.innerHTML = '';
        if (!classId || !startDate) return;
        const examDays = getExamDays(startDate);
        // Header
        const period1Time = period1TimeInput.value || '08:15';
        const period2Time = period2TimeInput.value || '10:30';
        let headerHTML = '<tr><th class="py-3 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">اليوم/التاريخ</th>';
        headerHTML += `<th class="py-3 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">الفترة الأولى (${period1Time})</th>`;
        headerHTML += `<th class="py-3 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">الفترة الثانية (${period2Time})</th>`;
        headerHTML += '</tr>';
        examScheduleThead.innerHTML = headerHTML;
        // Get saved data
        const allExamData = getExamScheduleData();
        let classExam = allExamData.find(e => e.classId === classId && e.startDate === startDate);
        if (!classExam) {
            classExam = {
                classId,
                startDate,
                schedule: {}
            };
            examDays.forEach(day => {
                classExam.schedule[day.dayKey] = ["", ""];
            });
        }
        // Render rows
        examDays.forEach(day => {
            const row = document.createElement('tr');
            let cellsHTML = `<td class="p-2 border-t border-gray-200 align-middle font-medium text-sm text-gray-700">${day.dayName}<br><span class="text-xs text-gray-400">${day.date}</span></td>`;
            for (let period = 0; period < 2; period++) {
                const selectedSubject = classExam.schedule[day.dayKey][period] || "";
                let selectHTML = `<select data-day="${day.dayKey}" data-period="${period}" class="exam-subject-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-xs py-1 mb-1">`;
                selectHTML += '<option value="">اختر المادة...</option>';
                allSubjects.forEach(subj => {
                    selectHTML += `<option value="${subj}" ${(selectedSubject === subj) ? 'selected' : ''}>${subj || 'فارغ'}</option>`;
                });
                selectHTML += '</select>';
                cellsHTML += `<td class="p-1 align-top border-t border-l border-gray-200">${selectHTML}</td>`;
            }
            row.innerHTML = cellsHTML;
            examScheduleGridBody.appendChild(row);
        });
        examScheduleTitle.textContent = 'جدول امتحانات الصف';
        examScheduleDisplayContainer.classList.remove('hidden');
        noExamScheduleSelected.classList.add('hidden');
    }
    // الأحداث
    examClassSelector.addEventListener('change', () => {
        const classId = examClassSelector.value;
        const startDate = examStartDateInput.value;
        if (classId && startDate) {
            renderExamScheduleTable(classId, startDate);
        } else {
            examScheduleDisplayContainer.classList.add('hidden');
            noExamScheduleSelected.classList.remove('hidden');
        }
    });
    examStartDateInput.addEventListener('change', () => {
        const classId = examClassSelector.value;
        const startDate = examStartDateInput.value;
        if (classId && startDate) {
            renderExamScheduleTable(classId, startDate);
        } else {
            examScheduleDisplayContainer.classList.add('hidden');
            noExamScheduleSelected.classList.remove('hidden');
        }
    });
    saveExamBtn && saveExamBtn.addEventListener('click', () => {
        const classId = examClassSelector.value;
        const startDate = examStartDateInput.value;
        if (!classId || !startDate) return;
        const examDays = getExamDays(startDate);
        // Build schedule
        const schedule = {};
        examDays.forEach(day => {
            schedule[day.dayKey] = ["", ""];
            for (let period = 0; period < 2; period++) {
                const select = examScheduleGridBody.querySelector(`.exam-subject-select[data-day="${day.dayKey}"][data-period="${period}"]`);
                schedule[day.dayKey][period] = select ? select.value : "";
            }
        });
        // Save
        let allExamData = getExamScheduleData();
        const idx = allExamData.findIndex(e => e.classId === classId && e.startDate === startDate);
        if (idx > -1) {
            allExamData[idx].schedule = schedule;
        } else {
            allExamData.push({ classId, startDate, schedule });
        }
        saveExamScheduleData(allExamData);
        alert('تم حفظ جدول الامتحانات بنجاح!');
    });
    // إعادة رسم الجدول عند تغيير توقيت الفترات
    period1TimeInput.addEventListener('change', () => {
        const classId = examClassSelector.value;
        const startDate = examStartDateInput.value;
        if (classId && startDate) renderExamScheduleTable(classId, startDate);
    });
    period2TimeInput.addEventListener('change', () => {
        const classId = examClassSelector.value;
        const startDate = examStartDateInput.value;
        if (classId && startDate) renderExamScheduleTable(classId, startDate);
    });
    // تهيئة الصفحة
    populateExamClassSelector();
}); 