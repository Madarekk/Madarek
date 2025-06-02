// classes.js
document.addEventListener('DOMContentLoaded', () => {
    // Modals
    const addClassModal = document.getElementById('addClassModal');
    const manageSectionsModal = document.getElementById('manageSectionsModal');
    
    // Forms
    const addClassForm = document.getElementById('addClassForm');
    const addSectionForm = document.getElementById('addSectionForm');

    // Spans for dynamic content in modals
    const managingClassNameSpan = document.getElementById('managingClassName');
    const addClassModalTitle = document.getElementById('addClassModalTitle');
    
    // Containers
    const classesGrid = document.getElementById('classesGrid');
    const currentSectionsListContainer = document.getElementById('currentSectionsList');

    // Helper to toggle modals
    const toggleModal = (modal, show) => {
        if (modal) {
            modal.classList.toggle('hidden', !show);
        }
    };

    // --- Add/Edit Class Functionality ---
    const openAddClassModal = (classData = null) => {
        if (addClassForm) addClassForm.reset();
        document.getElementById('editClassId').value = ''; // Clear edit ID

        if (classData) { // Editing existing class
            addClassModalTitle.textContent = 'تعديل بيانات الصف';
            document.getElementById('editClassId').value = classData.id;
            document.getElementById('className').value = classData.name;
            document.getElementById('classLevel').value = classData.level || '';
            document.getElementById('classCapacity').value = classData.capacity || '';
        } else { // Adding new class
            addClassModalTitle.textContent = 'إضافة صف دراسي جديد';
        }
        toggleModal(addClassModal, true);
    };

    // "Add Class" button (Page Header)
    const addClassBtn = document.getElementById('addClassBtn');
    if (addClassBtn) {
        addClassBtn.addEventListener('click', () => openAddClassModal());
    }

    // "Add Class" button (Card in Grid)
    const addClassCardBtn = document.getElementById('addClassCardBtn');
    if (addClassCardBtn) {
        addClassCardBtn.addEventListener('click', () => openAddClassModal());
    }

    // Add Class Form Submission
    if (addClassForm) {
        addClassForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(addClassForm);
            const classData = Object.fromEntries(formData.entries());
            const classId = classData.editClassId;

            if (classId) { // Editing
                console.log('Update Class form submitted:', classData);
                alert(`تم إرسال بيانات الصف للتعديل: ${classData.className} (سيتم ربطه بالـ backend لاحقاً)`);
                // Backend Note: Send classData to backend API for update using classId. Refresh specific card on success.
                // For demo: update card in UI
                const cardToUpdate = classesGrid.querySelector(`.bg-white[data-class-id="${classId}"]`);
                if (cardToUpdate) {
                    cardToUpdate.querySelector('.class-name').textContent = classData.className;
                    // Update other details if displayed on card
                }

            } else { // Adding New
                console.log('Add Class form submitted:', classData);
                alert(`تم إرسال بيانات الصف لإضافته: ${classData.className} (سيتم ربطه بالـ backend لاحقاً)`);
                // Backend Note: Send classData to backend API for creation. Refresh list or add new card on success.
                // For demo: add new card to UI
                const newClassId = Date.now(); // Temporary unique ID
                const newClassCardHTML = `
                    <div class="bg-white overflow-hidden shadow rounded-lg" data-class-id="${newClassId}">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900 class-name">${classData.className}</h3>
                                    <p class="text-sm text-gray-500 sections-summary">0 فصول - 0 طالب</p>
                                </div>
                                <div class="flex space-x-2 space-x-reverse">
                                    <button class="text-primary hover:text-primary-dark p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary edit-class-btn" aria-label="تعديل الصف">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                    </button>
                                    <button class="text-red-600 hover:text-red-900 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 delete-class-btn" aria-label="حذف الصف">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </div>
                            </div>
                            <div class="mt-4">
                                <div class="space-y-2 sections-list">
                                    <!-- Sections will be listed here -->
                                </div>
                                <div class="mt-3">
                                    <button class="w-full bg-gray-100 hover:bg-gray-200 text-primary py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 manage-sections-btn">
                                        إدارة الفصول
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                if (addClassCardBtn) {
                    addClassCardBtn.parentElement.insertAdjacentHTML('beforebegin', newClassCardHTML);
                }
            }
            toggleModal(addClassModal, false);
        });
    }

    // --- Manage Sections Functionality ---
    let currentManagingClassId = null;
    // Dummy sections data store (replace with backend interaction)
    let sectionsData = { 
        // "classId": [{id: "sec1", name: "أ", capacity: 30, teacher: "أ. أحمد"}, ...]
    };

    const renderSectionsList = (classId) => {
        const sections = sectionsData[classId] || [];
        const noSectionsMessage = currentSectionsListContainer.querySelector('.no-sections-message');
        
        // Clear previous list items, but keep the placeholder message element
        currentSectionsListContainer.querySelectorAll('.section-item').forEach(el => el.remove());

        if (sections.length === 0) {
            if (noSectionsMessage) noSectionsMessage.style.display = 'block';
        } else {
            if (noSectionsMessage) noSectionsMessage.style.display = 'none';
            sections.forEach(section => {
                const sectionElementHTML = `
                    <div class="section-item flex justify-between items-center p-2 bg-gray-100 rounded-md mb-2" data-section-id="${section.id}">
                        <div>
                            <span class="text-sm text-gray-900 font-medium">${section.name}</span>
                            <span class="text-xs text-gray-600 mr-2">(السعة: ${section.capacity})</span>
                            ${section.teacher ? `<span class="text-xs text-gray-500">- المعلم: ${section.teacher}</span>` : ''}
                        </div>
                        <div>
                            <button class="text-xs text-red-500 hover:text-red-700 delete-section-btn" data-class-id="${classId}" data-section-id="${section.id}">حذف</button>
                        </div>
                    </div>
                `;
                currentSectionsListContainer.insertAdjacentHTML('beforeend', sectionElementHTML);
            });
        }
    };
    
    const openManageSectionsModal = (classId, className) => {
        currentManagingClassId = classId;
        if (managingClassNameSpan) managingClassNameSpan.textContent = className;
        document.getElementById('managingClassIdForSection').value = classId; // For new section form
        if (addSectionForm) addSectionForm.reset();
        renderSectionsList(classId);
        toggleModal(manageSectionsModal, true);
    };

    // Add Section Form Submission
    if (addSectionForm) {
        addSectionForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(addSectionForm);
            const sectionData = Object.fromEntries(formData.entries());
            const classId = sectionData.classId;

            console.log('Add Section form submitted:', sectionData, 'for Class ID:', classId);
            alert(`تم إرسال بيانات الفصل الجديد: ${sectionData.sectionName} للصف ${managingClassNameSpan.textContent}. (سيتم ربطه بالـ backend لاحقاً)`);
            
            // Backend Note: Send sectionData to backend API. On success, refresh sections list.
            // For demo: add to local sectionsData and re-render
            if (!sectionsData[classId]) {
                sectionsData[classId] = [];
            }
            sectionsData[classId].push({ 
                id: `sec${Date.now()}`, // Temporary unique ID
                name: sectionData.sectionName, 
                capacity: sectionData.sectionCapacity,
                // teacher: sectionData.sectionTeacher // Map teacher ID to name if needed
                teacher: document.getElementById('sectionTeacher').selectedOptions[0]?.text || 'غير محدد'
            });
            renderSectionsList(classId);
            addSectionForm.reset();
        });
    }

    // Delete Section (event delegation on currentSectionsListContainer)
    if (currentSectionsListContainer) {
        currentSectionsListContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-section-btn') || event.target.closest('.delete-section-btn')) {
                const button = event.target.closest('.delete-section-btn');
                const classId = button.dataset.classId;
                const sectionId = button.dataset.sectionId;
                const sectionName = button.closest('.section-item').querySelector('.text-sm.text-gray-900').textContent;

                if (confirm(`هل أنت متأكد من حذف الفصل "${sectionName}"؟`)) {
                    console.log(`Deleting section ${sectionId} from class ${classId}`);
                    // Backend Note: API call to delete section. On success, update UI.
                    // For demo: remove from local data and re-render
                    if (sectionsData[classId]) {
                        sectionsData[classId] = sectionsData[classId].filter(sec => sec.id !== sectionId);
                        renderSectionsList(classId);
                    }
                }
            }
        });
    }


    // --- Event Delegation for Class Card Actions (Edit, Delete, Manage Sections) ---
    if (classesGrid) {
        classesGrid.addEventListener('click', (event) => {
            const target = event.target;
            const card = target.closest('.bg-white.overflow-hidden.shadow.rounded-lg[data-class-id]');
            if (!card) return;

            const classId = card.dataset.classId;
            const className = card.querySelector('h3.class-name')?.textContent || 'صف غير محدد';

            // Edit button for the class card
            if (target.closest('button.edit-class-btn')) {
                 console.log(`Edit button clicked for class ID: ${classId}, Name: ${className}`);
                 // Backend Note: Fetch full class data by ID then open modal.
                 // For demo, simulate with current card data or dummy data.
                 openAddClassModal({
                     id: classId,
                     name: className,
                     level: "المرحلة الابتدائية", // Dummy data
                     capacity: parseInt(card.querySelector('.sections-summary')?.textContent.split('-')[1]?.match(/\d+/)[0] || 0) // Attempt to parse
                 });
            }

            // Delete button for the class card
            else if (target.closest('button.delete-class-btn')) {
                console.log(`Delete button clicked for class ID: ${classId}, Name: ${className}`);
                if (confirm(`هل أنت متأكد من رغبتك في حذف الصف: ${className} وكل الفصول التابعة له؟`)) {
                    alert(`تم تأكيد حذف الصف: ${className}. (سيتم ربطه بالـ backend لاحقاً)`);
                    card.remove(); // Simulate deletion from UI
                    // Backend Note: Perform delete operation for the class and its sections. Refresh list.
                }
            }

            // "إدارة الفصول" button within each card
            else if (target.closest('button.manage-sections-btn')) {
                console.log(`Manage Sections button clicked for class ID: ${classId}, Name: ${className}`);
                openManageSectionsModal(classId, className);
                // Backend Note: Load section data for the specific class into the modal.
            }
        });
    }

    // --- Modal Close Handlers ---
    document.querySelectorAll('.close-modal-btn, .cancel-modal-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modalId;
            if (modalId) {
                toggleModal(document.getElementById(modalId), false);
            }
        });
    });

    // Close Modals when clicking outside (specific for each modal)
    [addClassModal, manageSectionsModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    toggleModal(modal, false);
                }
            });
        }
    });
    
    // Check for `action=addClass` URL parameter (for Quick Action)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'addClass') {
        openAddClassModal(); // Open the "Add Class" modal automatically
    }

    console.log('classes.js loaded. Modals and card button listeners initialized.');
});
