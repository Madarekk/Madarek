// classes.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DATA MANAGEMENT ---
    const SCHOOL_DATA_KEY = 'schoolData';

    // Default data structure if localStorage is empty
    const getDefaultData = () => [
        {
            id: 'class_1',
            name: 'الصف الأول الابتدائي',
            sections: [
                { id: 'sec_1_1', name: 'الأول أ', studentCount: 28, schedule: createEmptySchedule('الأول أ') },
                { id: 'sec_1_2', name: 'الأول ب', studentCount: 29, schedule: createEmptySchedule('الأول ب') },
                { id: 'sec_1_3', name: 'الأول ج', studentCount: 28, schedule: createEmptySchedule('الأول ج') }
            ]
        },
        {
            id: 'class_2',
            name: 'الصف الثاني الابتدائي',
            sections: [
                { id: 'sec_2_1', name: 'الثاني أ', studentCount: 30, schedule: createEmptySchedule('الثاني أ') },
                { id: 'sec_2_2', name: 'الثاني ب', studentCount: 30, schedule: createEmptySchedule('الثاني ب') }
            ]
        },
        {
            id: 'class_3',
            name: 'الصف الثالث الابتدائي',
            sections: [
                { id: 'sec_3_1', name: 'الثالث أ', studentCount: 27, schedule: createEmptySchedule('الثالث أ') },
                { id: 'sec_3_2', name: 'الثالث ب', studentCount: 28, schedule: createEmptySchedule('الثالث ب') }
            ]
        }
    ];

    const createEmptySchedule = (sectionName) => {
        const days = ['sun', 'mon', 'tue', 'wed', 'thu'];
        const periods = [1, 2, 3, 4, 5, 6, 7];
        const schedule = {
            name: `جدول ${sectionName}`,
            grid: {}
        };
        days.forEach(day => {
            schedule.grid[day] = [];
            periods.forEach(p => {
                schedule.grid[day].push({ periodId: p, subject: '', teacher: '' });
            });
        });
        return schedule;
    };

    // Function to get data from localStorage
    const getSchoolData = () => {
        const data = localStorage.getItem(SCHOOL_DATA_KEY);
        return data ? JSON.parse(data) : getDefaultData();
    };

    // Function to save data to localStorage
    const saveSchoolData = (data) => {
        localStorage.setItem(SCHOOL_DATA_KEY, JSON.stringify(data));
    };

    // Initialize data on first load
    if (!localStorage.getItem(SCHOOL_DATA_KEY)) {
        saveSchoolData(getDefaultData());
    }

    // --- DOM ELEMENTS ---
    const manageSectionsModal = document.getElementById('manageSectionsModal');
    const addSectionForm = document.getElementById('addSectionForm');
    const managingClassNameSpan = document.getElementById('managingClassName');
    const classesGrid = document.getElementById('classesGrid');
    const currentSectionsListContainer = document.getElementById('currentSectionsList');

    const toggleModal = (modal, show) => {
        if (modal) modal.classList.toggle('hidden', !show);
    };

    // --- RENDERING LOGIC ---
    
    const renderAllClasses = () => {
        const schoolData = getSchoolData();
        classesGrid.innerHTML = ''; // Clear existing static content
        schoolData.forEach(cls => {
            classesGrid.appendChild(createClassCard(cls));
        });
    };

    const createClassCard = (classData) => {
        const totalStudents = classData.sections.reduce((sum, sec) => sum + (sec.studentCount || 0), 0);
        const card = document.createElement('div');
        card.className = 'bg-white overflow-hidden shadow rounded-lg';
        card.setAttribute('data-class-id', classData.id);

        card.innerHTML = `
            <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-medium text-gray-900 class-name">${classData.name}</h3>
                        <p class="text-sm text-gray-500 sections-summary">${classData.sections.length} فصول - ${totalStudents} طالب</p>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="space-y-2 sections-list">
                        ${classData.sections.map(sec => `
                            <div class=\"flex justify-between items-center p-2 bg-gray-50 rounded\">
                                <span class=\"text-sm text-gray-900\">${sec.name}</span>
                                <div class=\"flex items-center gap-2\">
                                    <span class=\"text-xs text-gray-500\">${sec.studentCount} طالب</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-3">
                        <button class="w-full bg-gray-100 hover:bg-gray-200 text-primary py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 manage-sections-btn">
                            إدارة الفصول
                        </button>
                    </div>
                </div>
            </div>
        `;
        return card;
    };

    const createSectionItemHTML = (sectionData) => {
        return `
            <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="text-sm text-gray-900">${sectionData.name}</span>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500">${sectionData.studentCount} طالب</span>
                    <button class="text-xs text-blue-500 hover:text-blue-700 edit-section-btn-modal" data-section-id="${sectionData.id}">تعديل</button>
                </div>
            </div>
        `;
    };

    const renderSectionsInModal = (classId) => {
        const schoolData = getSchoolData();
        const classData = schoolData.find(cls => cls.id === classId);
        currentSectionsListContainer.innerHTML = '';
        if (classData && classData.sections.length > 0) {
            classData.sections.forEach(sec => {
                 const sectionHTML = `
                    <div class="section-item flex justify-between items-center p-2 bg-gray-100 rounded-md mb-2" data-section-id="${sec.id}">
                        <div>
                            <span class="text-sm text-gray-900 font-medium">${sec.name}</span>
                            <span class="text-xs text-gray-600 mr-2">(السعة: ${sec.studentCount} طالب)</span>
                        </div>
                        <div class="flex gap-2">
                            <button class="text-xs text-blue-500 hover:text-blue-700 edit-section-btn-modal" data-section-id="${sec.id}">تعديل</button>
                            <button class="text-xs text-red-500 hover:text-red-700 delete-section-btn-modal" data-section-id="${sec.id}">حذف</button>
                        </div>
                    </div>
                `;
                currentSectionsListContainer.insertAdjacentHTML('beforeend', sectionHTML);
            });
        } else {
            currentSectionsListContainer.innerHTML = '<p class="text-center text-sm text-gray-500">لا توجد فصول مضافة حالياً.</p>';
        }
    };

    // --- EVENT LISTENERS ---

    // Open "Manage Sections" Modal
    classesGrid.addEventListener('click', (event) => {
        const manageBtn = event.target.closest('.manage-sections-btn');
        if (!manageBtn) return;
        
        const card = manageBtn.closest('[data-class-id]');
        const classId = card.dataset.classId;
        const className = card.querySelector('.class-name').textContent;

        document.getElementById('managingClassIdForSection').value = classId;
        managingClassNameSpan.textContent = className;
        renderSectionsInModal(classId);
        toggleModal(manageSectionsModal, true);
    });

    // Add new section form submission
    addSectionForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const classId = document.getElementById('managingClassIdForSection').value;
        const sectionNameInput = document.getElementById('sectionName');
        const sectionName = sectionNameInput.value;
        const sectionCapacity = parseInt(document.getElementById('sectionCapacity').value, 10);
        
        if (!classId || !sectionName || isNaN(sectionCapacity)) {
            alert('يرجى ملء جميع الحقول بشكل صحيح.');
            return;
        }

        const schoolData = getSchoolData();
        const classIndex = schoolData.findIndex(cls => cls.id === classId);

        if (classIndex !== -1) {
            // Construct section name, e.g., "الأول أ", "الثاني ب"
            const classNameBase = schoolData[classIndex].name.split(' ')[1]; // e.g., "الأول"
            const fullSectionName = `${classNameBase} ${sectionName}`;

            const newSection = {
                id: `sec_${classId}_${Date.now()}`,
                name: fullSectionName,
                studentCount: sectionCapacity,
                schedule: createEmptySchedule(fullSectionName) // Create default schedule
            };
            schoolData[classIndex].sections.push(newSection);
            saveSchoolData(schoolData);

            // Re-render UI
            renderAllClasses();
            renderSectionsInModal(classId); // Update modal view
            sectionNameInput.value = ''; // Clear only the name field for quick additions
            document.getElementById('sectionCapacity').value = '';
            sectionNameInput.focus();
        }
    });
    
    // Event delegation for deleting sections from the modal
    currentSectionsListContainer.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('.delete-section-btn-modal');
        if (!deleteBtn) return;
        
        const sectionId = deleteBtn.dataset.sectionId;
        const classId = document.getElementById('managingClassIdForSection').value;
        
        if (confirm('هل أنت متأكد من حذف هذا الفصل؟ سيتم حذف جدوله الدراسي أيضاً.')) {
            const schoolData = getSchoolData();
            const classData = schoolData.find(cls => cls.id === classId);
            if (classData) {
                classData.sections = classData.sections.filter(sec => sec.id !== sectionId);
                saveSchoolData(schoolData);
                renderAllClasses();
                renderSectionsInModal(classId);
            }
        }
    });

    // Event delegation for editing sections from the modal
    currentSectionsListContainer.addEventListener('click', (event) => {
        const editBtn = event.target.closest('.edit-section-btn-modal');
        if (editBtn) {
            const sectionId = editBtn.dataset.sectionId;
            const classId = document.getElementById('managingClassIdForSection').value;
            const schoolData = getSchoolData();
            const classData = schoolData.find(cls => cls.id === classId);
            if (classData) {
                const section = classData.sections.find(sec => sec.id === sectionId);
                if (section) {
                    document.getElementById('editSectionId').value = section.id;
                    document.getElementById('editSectionName').value = section.name;
                    document.getElementById('editSectionCapacity').value = section.studentCount;
                    toggleModal(document.getElementById('editSectionModal'), true);
                }
            }
            return;
        }
        // ... existing code for delete ...
    });

    // General close modal buttons
    document.querySelectorAll('.close-modal-btn, .cancel-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.modalId;
            toggleModal(document.getElementById(modalId), false);
        });
    });

    // Close edit section modal
    const editSectionModal = document.getElementById('editSectionModal');
    const cancelEditSectionBtn = document.getElementById('cancelEditSectionBtn');
    if (cancelEditSectionBtn && editSectionModal) {
        cancelEditSectionBtn.addEventListener('click', () => {
            toggleModal(editSectionModal, false);
        });
    }
    if (editSectionModal) {
        editSectionModal.addEventListener('click', (e) => {
            if (e.target === editSectionModal) {
                toggleModal(editSectionModal, false);
            }
        });
    }

    // Save edited section
    const editSectionForm = document.getElementById('editSectionForm');
    if (editSectionForm) {
        editSectionForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const sectionId = document.getElementById('editSectionId').value;
            const newName = document.getElementById('editSectionName').value;
            const newCapacity = parseInt(document.getElementById('editSectionCapacity').value, 10);
            const classId = document.getElementById('managingClassIdForSection').value;
            if (!sectionId || !newName || isNaN(newCapacity) || !classId) return;
            const schoolData = getSchoolData();
            const classData = schoolData.find(cls => cls.id === classId);
            if (classData) {
                const section = classData.sections.find(sec => sec.id === sectionId);
                if (section) {
                    section.name = newName;
                    section.studentCount = newCapacity;
                    saveSchoolData(schoolData);
                    renderAllClasses();
                    renderSectionsInModal(classId);
                    toggleModal(editSectionModal, false);
                }
            }
        });
    }

    // --- INITIAL RENDER ---
    renderAllClasses();
    
    // Note: Add/Edit Class functionality is not implemented as it was not part of the core request.
    // The modal `addClassModal` exists in HTML but has no listeners in this version of the script.
});
