document.addEventListener('DOMContentLoaded', () => {
    // --- DATA CONSTANTS & HELPERS ---
    const SCHOOL_DATA_KEY = 'schoolData';

    const getSchoolData = () => {
        const data = localStorage.getItem(SCHOOL_DATA_KEY);
        return data ? JSON.parse(data) : [];
    };

    const saveSchoolData = (data) => {
        localStorage.setItem(SCHOOL_DATA_KEY, JSON.stringify(data));
    };

    const allSubjects = ["الرياضيات", "الفيزياء", "الكيمياء", "الأحياء", "اللغة العربية", "اللغة الإنجليزية", "التاريخ", "الجغرافيا", "التربية الإسلامية", "الحاسوب", "الفنون", "التربية البدنية", ""];
    const allTeachers = ["أ. محمد الأحمد", "أ. فاطمة علي", "أ. خالد السيد", "أ. سارة عبدالله", "أ. يوسف حسن", "أ. مريم محمود", ""];

    const periods = [
        { id: 1, time: "08:00 - 08:45", name: "الحصة الأولى" },
        { id: 2, time: "08:45 - 09:30", name: "الحصة الثانية" },
        { id: 3, time: "09:30 - 10:15", name: "الحصة الثالثة" },
        { id: 4, time: "10:15 - 11:00", name: "الحصة الرابعة" },
        { id: 'break', time: "11:00 - 11:15", name: "إستراحة" },
        { id: 5, time: "11:15 - 12:00", name: "الحصة الخامسة" },
        { id: 6, time: "12:00 - 12:45", name: "الحصة السادسة" },
        { id: 7, time: "12:45 - 13:30", name: "الحصة السابعة" }
    ];
    const days = [
        { key: 'sun', name: 'الأحد' }, { key: 'mon', name: 'الإثنين' },
        { key: 'tue', name: 'الثلاثاء' }, { key: 'wed', name: 'الأربعاء' },
        { key: 'thu', name: 'الخميس' }
    ];

    // --- DOM ELEMENTS ---
    const classSelector = document.getElementById('classSelector');
    const sectionSelector = document.getElementById('sectionSelector');
    const scheduleDisplayContainer = document.getElementById('scheduleDisplayContainer');
    const scheduleGridBody = document.getElementById('scheduleGridBody');
    const scheduleThead = document.querySelector('#scheduleDisplayContainer table thead'); // Get thead element
    const scheduleTitle = document.getElementById('scheduleTitle');
    const saveBtn = document.getElementById('saveScheduleChanges');
    const placeholder = document.getElementById('noScheduleSelected');

    // --- FUNCTIONS ---

    const populateClassSelector = () => {
        const schoolData = getSchoolData();
        classSelector.innerHTML = '<option value="">اختر الصف الدراسي...</option>';
        if (schoolData.length === 0) {
            classSelector.innerHTML = '<option value="">لا توجد بيانات صفوف، يرجى إضافتها أولاً.</option>';
            return;
        }
        schoolData.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            classSelector.appendChild(option);
        });
    };

    const populateSectionSelector = (classId) => {
        const schoolData = getSchoolData();
        const classData = schoolData.find(cls => cls.id === classId);
        sectionSelector.innerHTML = '<option value="">اختر الفصل...</option>';
        sectionSelector.disabled = true;

        if (classData && classData.sections.length > 0) {
            classData.sections.forEach(sec => {
                const option = document.createElement('option');
                option.value = sec.id;
                option.textContent = sec.name;
                sectionSelector.appendChild(option);
            });
            sectionSelector.disabled = false;
        } else {
            sectionSelector.innerHTML = '<option value="">لا توجد فصول لهذا الصف.</option>';
        }
    };

    const renderSchedule = (schedule) => {
        scheduleGridBody.innerHTML = ''; // Clear old body
        scheduleThead.innerHTML = '';    // Clear old head

        // 1. Render Header Row
        let headerHTML = '<tr><th class="py-3 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">اليوم</th>';
        periods.forEach(period => {
            if (period.id === 'break') {
                headerHTML += `<th class="py-3 px-3 text-center align-middle text-xs font-medium text-green-600 bg-green-50 uppercase tracking-wider border-b">${period.name}<br><span class="font-normal normal-case">(${period.time})</span></th>`;
            } else {
                headerHTML += `<th class="py-3 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">${period.name}<br><span class="font-normal normal-case">(${period.time})</span></th>`;
            }
        });
        headerHTML += '</tr>';
        scheduleThead.innerHTML = headerHTML;

        // 2. Render Day Rows
        days.forEach(day => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            let cellsHTML = `<td class="p-2 border-t border-gray-200 align-middle font-medium text-sm text-gray-700">${day.name}</td>`;
            
            periods.forEach(period => {
                if (period.id === 'break') {
                    cellsHTML += `<td class="bg-green-50 border-t border-l border-gray-200"></td>`; // Empty, styled cell for break time
                    return; // Skips to the next period in the loop
                }

                const entry = schedule.grid[day.key]?.find(e => e.periodId === period.id) || { subject: '', teacher: '' };
                
                const subjectOptions = allSubjects.map(s => `<option value="${s}" ${s === entry.subject ? 'selected' : ''}>${s || 'فارغ'}</option>`).join('');
                const teacherOptions = allTeachers.map(t => `<option value="${t}" ${t === entry.teacher ? 'selected' : ''}>${t || 'فارغ'}</option>`).join('');

                cellsHTML += `
                    <td class="p-1 align-top border-t border-l border-gray-200">
                        <select data-day="${day.key}" data-period="${period.id}" class="subject-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-xs py-1 mb-1">
                            ${subjectOptions}
                        </select>
                        <select data-day="${day.key}" data-period="${period.id}" class="teacher-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-xs py-1">
                            ${teacherOptions}
                        </select>
                    </td>`;
            });
            row.innerHTML = cellsHTML;
            scheduleGridBody.appendChild(row);
        });

        scheduleTitle.textContent = schedule.name || 'جدول دراسي';
    };

    const handleSaveChanges = () => {
        const classId = classSelector.value;
        const sectionId = sectionSelector.value;
        if (!classId || !sectionId) return;

        const schoolData = getSchoolData();
        const classData = schoolData.find(cls => cls.id === classId);
        const section = classData?.sections.find(sec => sec.id === sectionId);

        if (!section) return;

        // Update the schedule object from the DOM table
        days.forEach(day => {
            periods.forEach(period => {
                const subjectSelect = scheduleGridBody.querySelector(`.subject-select[data-day="${day.key}"][data-period="${period.id}"]`);
                const teacherSelect = scheduleGridBody.querySelector(`.teacher-select[data-day="${day.key}"][data-period="${period.id}"]`);
                const scheduleEntry = section.schedule.grid[day.key].find(e => e.periodId === period.id);

                if (scheduleEntry) {
                    scheduleEntry.subject = subjectSelect.value;
                    scheduleEntry.teacher = teacherSelect.value;
                }
            });
        });

        saveSchoolData(schoolData);
        alert('تم حفظ التغييرات بنجاح!');
    };


    // --- EVENT LISTENERS ---
    classSelector.addEventListener('change', () => {
        const selectedClassId = classSelector.value;
        populateSectionSelector(selectedClassId);
        scheduleDisplayContainer.classList.add('hidden');
        saveBtn.classList.add('hidden');
        placeholder.classList.remove('hidden');
    });

    sectionSelector.addEventListener('change', () => {
        const schoolData = getSchoolData();
        const classId = classSelector.value;
        const sectionId = sectionSelector.value;
        
        if (!sectionId) {
             scheduleDisplayContainer.classList.add('hidden');
             saveBtn.classList.add('hidden');
             placeholder.classList.remove('hidden');
             return;
        }

        const classData = schoolData.find(cls => cls.id === classId);
        const section = classData?.sections.find(sec => sec.id === sectionId);

        if (section && section.schedule) {
            renderSchedule(section.schedule);
            scheduleDisplayContainer.classList.remove('hidden');
            saveBtn.classList.remove('hidden');
            placeholder.classList.add('hidden');
        } else {
            alert('خطأ: لم يتم العثور على جدول لهذا الفصل.');
        }
    });

    saveBtn.addEventListener('click', handleSaveChanges);

    // --- INITIALIZATION ---
    populateClassSelector();
});
