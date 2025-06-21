document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openCreateScheduleModalBtn');
    const modal = document.getElementById('createScheduleModal');
    const closeModalBtn = document.getElementById('closeCreateScheduleModalBtn');
    const cancelModalBtn = document.getElementById('cancelCreateScheduleBtn');
    const scheduleForm = document.getElementById('createScheduleForm');
    const scheduleGridBody = document.getElementById('scheduleGridBody');
    const scheduleClassSelect = document.getElementById('scheduleClass');

    const noSchedulesPlaceholder = document.getElementById('noSchedulesPlaceholder');
    const schedulesListContainer = document.getElementById('schedulesListContainer');

    // Dummy data (replace with actual data from backend)
    const subjects = ["الرياضيات", "الفيزياء", "الكيمياء", "الأحياء", "اللغة العربية", "اللغة الإنجليزية", "التاريخ", "الجغرافيا", "التربية الإسلامية", "الحاسوب", "الفنون", "التربية البدنية", "لا يوجد"];
    const teachers = ["أ. محمد الأحمد", "أ. فاطمة علي", "أ. خالد السيد", "أ. سارة عبدالله", "أ. يوسف حسن", "أ. مريم محمود", "لا يوجد"];
    const classes = ["الصف الأول أ", "الصف الأول ب", "الصف الثاني أ", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"];
    
    const days = [
        { key: 'sun', name: 'الأحد' },
        { key: 'mon', name: 'الإثنين' },
        { key: 'tue', name: 'الثلاثاء' },
        { key: 'wed', name: 'الأربعاء' },
        { key: 'thu', name: 'الخميس' }
    ];

    const periods = [
        { id: 1, time: "08:00 - 08:45", name: "الحصة الأولى" },
        { id: 2, time: "08:45 - 09:30", name: "الحصة الثانية" },
        { id: 3, time: "09:30 - 10:15", name: "الحصة الثالثة" },
        { id: 4, time: "10:15 - 11:00", name: "الحصة الرابعة" },
        { id: 5, time: "11:00 - 11:45", name: "الحصة الخامسة" },
        { id: 6, time: "11:45 - 12:30", name: "الحصة السادسة" },
        { id: 7, time: "12:30 - 13:15", name: "الحصة السابعة" }
    ];

    function populateDropdown(selectElement, optionsArray, defaultOptionText = "اختر...") {
        selectElement.innerHTML = `<option value="">${defaultOptionText}</option>`;
        optionsArray.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
    }

    function populateScheduleGrid() {
        scheduleGridBody.innerHTML = ''; // Clear existing grid
        periods.forEach(period => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-2 border border-gray-300 text-center align-top">
                    <div class="font-medium">${period.name}</div>
                    <div class="text-xs text-gray-500">${period.time}</div>
                </td>
                ${days.map(day => `
                    <td class="p-2 border border-gray-300 align-top">
                        <select name="subject_${day.key}_p${period.id}" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-xs py-1 mb-1 subject-select">
                            <!-- Subject options populated here -->
                        </select>
                        <select name="teacher_${day.key}_p${period.id}" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-xs py-1 teacher-select">
                            <!-- Teacher options populated here -->
                        </select>
                    </td>
                `).join('')}
            `;
            scheduleGridBody.appendChild(row);
        });

        // Populate all select dropdowns in the grid
        scheduleGridBody.querySelectorAll('.subject-select').forEach(select => populateDropdown(select, subjects, "اختر المادة..."));
        scheduleGridBody.querySelectorAll('.teacher-select').forEach(select => populateDropdown(select, teachers, "اختر المعلم..."));
    }
    
    function toggleModal(show) {
        if (modal) {
            modal.classList.toggle('hidden', !show);
            if (show) {
                populateDropdown(scheduleClassSelect, classes, "اختر الصف...");
                populateScheduleGrid();
                scheduleForm.reset(); // Reset form fields when opening
            }
        }
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => toggleModal(true));
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => toggleModal(false));
    }
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', () => toggleModal(false));
    }
    if (modal) {
        // Close modal if clicked outside of the content
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                toggleModal(false);
            }
        });
    }

    if (scheduleForm) {
        scheduleForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(scheduleForm);
            const scheduleData = {
                scheduleName: formData.get('scheduleName'),
                targetClass: formData.get('scheduleClass'),
                grid: {}
            };

            days.forEach(day => {
                scheduleData.grid[day.key] = [];
                periods.forEach(period => {
                    scheduleData.grid[day.key].push({
                        periodId: period.id,
                        subject: formData.get(`subject_${day.key}_p${period.id}`),
                        teacher: formData.get(`teacher_${day.key}_p${period.id}`)
                    });
                });
            });

            console.log('New Schedule Data:', scheduleData);
            alert(`تم استلام بيانات الجدول: "${scheduleData.scheduleName}" للصف "${scheduleData.targetClass}". التفاصيل في الكونسول. (سيتم ربطه بالـ backend لاحقاً)`);
            
            // Simulate adding to list (for UI demo)
            addScheduleToList(scheduleData);

            toggleModal(false);
        });
    }

    function addScheduleToList(scheduleData) {
        if (noSchedulesPlaceholder) {
            noSchedulesPlaceholder.classList.add('hidden');
        }
        
        // Remove the "Example Schedule Card" if it's the only thing or if we want to replace placeholders
        const exampleCard = schedulesListContainer.querySelector('.bg-gray-50.p-4.rounded-md.shadow-sm.mb-3');
        if (exampleCard && schedulesListContainer.children.length <= 2 ) { // <=2 to account for placeholder and example
             if(!exampleCard.dataset.persisted) exampleCard.remove(); // Only remove if it's the initial dummy
        }


        const cardHTML = `
            <div class="bg-gray-50 p-4 rounded-md shadow-sm mb-3" data-persisted="true">
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-semibold text-primary">${scheduleData.scheduleName} (${scheduleData.targetClass})</h4>
                        <p class="text-xs text-gray-500">تم إنشاؤه في: ${new Date().toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div class="space-x-2 space-x-reverse">
                        <button class="text-xs bg-accent hover:bg-cyan-700 text-white py-1 px-3 rounded-md">عرض</button>
                        <button class="text-xs bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md">تعديل</button>
                        <button class="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md">حذف</button>
                    </div>
                </div>
            </div>
        `;
        // Prepend to the list of schedules
        if (schedulesListContainer.firstChild && schedulesListContainer.firstChild.id === 'noSchedulesPlaceholder'){
             schedulesListContainer.insertAdjacentHTML('afterbegin', cardHTML);
        } else if (schedulesListContainer.querySelector('#noSchedulesPlaceholder')){
            schedulesListContainer.insertBefore(document.createRange().createContextualFragment(cardHTML), schedulesListContainer.querySelector('#noSchedulesPlaceholder'));
        } else {
            schedulesListContainer.insertAdjacentHTML('beforeend', cardHTML);
        }


        // Check if placeholder should be visible after potential removal of example
        if (schedulesListContainer.querySelectorAll('[data-persisted="true"]').length === 0) {
             if (noSchedulesPlaceholder) noSchedulesPlaceholder.classList.remove('hidden');
        }
    }

    // Initial check for schedules (if any were loaded from backend)
    // For demo, we assume it's empty or has the example card
    if (schedulesListContainer) {
        const existingScheduleCards = schedulesListContainer.querySelectorAll('.bg-gray-50[data-persisted="true"]').length;
        const initialExampleCardExists = !!schedulesListContainer.querySelector('.bg-gray-50:not([data-persisted="true"])');

        if (existingScheduleCards === 0 && !initialExampleCardExists && noSchedulesPlaceholder) {
            noSchedulesPlaceholder.classList.remove('hidden');
        } else if (existingScheduleCards > 0 || initialExampleCardExists) {
             if (noSchedulesPlaceholder) noSchedulesPlaceholder.classList.add('hidden');
        }
    }
    
    console.log('schedules.js loaded and initialized.');
});
