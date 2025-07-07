import * as framerMotion from 'https://esm.run/framer-motion';
const { animate, spring } = framerMotion;

const loadingSpinnerSVG = (color = 'text-white') => `<svg class="animate-spin h-5 w-5 ${color} mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

async function mockApiCall(endpoint, method = 'GET', body = null, delay = 500) {
    console.log(`Mock API Call: ${method} ${endpoint}`, body);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (endpoint.startsWith('/api/assignments')) {
                if (method === 'GET') {
                    const params = new URLSearchParams(endpoint.split('?')[1]);
                    const searchTerm = params.get('search') ? params.get('search').toLowerCase() : '';
                    const statusFilter = params.get('status');
                    let assignments = [
                        { id: '1', title: 'كتابة مقال وصفي عن الربيع', course: 'اللغة العربية', dueDate: '2025-07-15', status: 'upcoming', description: 'وصف مفصل لمقال الربيع.', notes: 'التركيز على الصور الجمالية', maxScore: 20 },
                        { id: '2', title: 'حل مسائل الجبر الخطي', course: 'الرياضيات', dueDate: '2025-07-10', status: 'active', description: 'مسائل تغطي الفصل الثالث.', notes: '', maxScore: 25 },
                        { id: '3', title: 'بحث حول الدولة العباسية', course: 'التاريخ', dueDate: '2025-06-20', status: 'archived', description: 'بحث لا يقل عن 5 صفحات.', notes: 'تم التقييم', maxScore: 30 }
                    ];
                    if (searchTerm) {
                        assignments = assignments.filter(a => a.title.toLowerCase().includes(searchTerm) || a.course.toLowerCase().includes(searchTerm));
                    }
                    if (statusFilter) {
                        assignments = assignments.filter(a => a.status === statusFilter);
                    }
                    resolve(assignments);
                } else if (method === 'POST') {
                    const newAssignment = { ...body, id: Date.now().toString(), status: 'upcoming' };
                    resolve(newAssignment);
                } else if (method === 'PUT') {
                    resolve({ ...body, id: endpoint.split('/').pop() });
                } else if (method === 'DELETE') {
                    resolve({});
                }
            } else if (endpoint.startsWith('/api/courses')) {
                 if (method === 'GET') {
                    const params = new URLSearchParams(endpoint.split('?')[1]);
                    const searchTerm = params.get('search') ? params.get('search').toLowerCase() : '';
                    const statusFilter = params.get('status');
                    let courses = [
                        { id: 'c1', name: 'اللغة العربية للمرحلة الإعدادية', description: 'دورة شاملة لتطوير مهارات اللغة العربية.', studentCount: 25, lessonCount: 10, status: 'active' },
                        { id: 'c2', name: 'الرياضيات للمرحلة الإعدادية', description: 'تغطية لمناهج الرياضيات الأساسية.', studentCount: 18, lessonCount: 8, status: 'active' },
                        { id: 'c3', name: 'اللغة الإنجليزية للمرحلة الإعدادية', description: 'تعلم أساسيات اللغة الإنجليزية.', studentCount: 30, lessonCount: 15, status: 'upcoming' },
                        { id: 'c4', name: 'العلوم للمرحلة الإعدادية', description: 'استكشاف مبادئ العلوم الطبيعية.', studentCount: 22, lessonCount: 12, status: 'archived' }
                    ];
                    if (searchTerm) {
                        courses = courses.filter(c => c.name.toLowerCase().includes(searchTerm));
                    }
                    if (statusFilter) {
                        courses = courses.filter(c => c.status === statusFilter);
                    }
                    resolve(courses);
                } else if (method === 'POST' && endpoint.includes('/lessons')) {
                    resolve({ ...body, id: `l-${Date.now().toString()}` });
                }
            } else if (endpoint.startsWith('/api/students')) {
                let studentsData = [
                    { id: 's1', name: 'أحمد محمود عبدالله', studentId: 'STU-00123', courseRegistered: 'مقدمة في البرمجة', status: 'نشط', email: 'ahmad@example.com', attendance: '90%', grade: 'ممتاز', totalDue: 1000, amountPaid: 500 },
                    { id: 's2', name: 'فاطمة علي حسن', studentId: 'STU-00124', courseRegistered: 'تصميم الجرافيك الأساسي', status: 'نشط', email: 'fatima@example.com', attendance: '95%', grade: 'جيد جداً', totalDue: 800, amountPaid: 800 },
                    { id: 's3', name: 'خالد يوسف إبراهيم', studentId: 'STU-00125', courseRegistered: 'مقدمة في البرمجة', status: 'غير نشط', email: 'khaled@example.com', attendance: '70%', grade: 'مقبول', totalDue: 1000, amountPaid: 0 },
                    { id: 's4', name: 'نورة سالم حمد', studentId: 'STU-00126', courseRegistered: 'اللغة الإنجليزية للمبتدئين', status: 'نشط', email: 'noura@example.com', attendance: '88%', grade: 'جيد', totalDue: 750, amountPaid: 300 },
                    { id: 's5', name: 'عبدالرحمن بكر صالح', studentId: 'STU-00127', courseRegistered: 'تصميم الجرافيك الأساسي', status: 'نشط', email: 'abdulrahman@example.com', attendance: '92%', grade: 'ممتاز', totalDue: 800, amountPaid: 800 },
                    { id: 's6', name: 'مريم عادل فهد', studentId: 'STU-00128', courseRegistered: 'أساسيات الرياضيات', status: 'نشط', email: 'mariam@example.com', attendance: '98%', grade: 'ممتاز', totalDue: 600, amountPaid: 600 }
                ];

                const queryParamsString = endpoint.split('?')[1];
                if (queryParamsString) {
                    const params = new URLSearchParams(queryParamsString);
                    const searchTerm = params.get('search')?.toLowerCase();
                    const subjectFilter = params.get('subject')?.toLowerCase();

                    if (searchTerm) {
                        studentsData = studentsData.filter(s => 
                            s.name.toLowerCase().includes(searchTerm) || 
                            s.studentId.toLowerCase().includes(searchTerm)
                        );
                    }
                    if (subjectFilter) {
                        studentsData = studentsData.filter(s => 
                            s.courseRegistered.toLowerCase().includes(subjectFilter)
                        );
                    }
                }
                resolve(studentsData);

            } else if (endpoint.startsWith('/api/discussions')) {
                if (method === 'GET') {
                     resolve([ {id: 'd1', title: 'مناقشة الفصل الأول', author: 'المعلم', replies: 5, lastReply: '2025-05-28'} ]);
                } else if (method === 'POST') {
                    resolve({ ...body, id: `d-${Date.now().toString()}`});
                }
            } else if (endpoint.startsWith('/api/schedule')) {
                 resolve([ { id: 'ev1', title: 'درس الرياضيات', time: '10:00 - 11:00', course: 'الرياضيات', type: 'live' } ]);
            } else if (endpoint.startsWith('/api/user/settings')) {
                resolve({ name: 'المعلم الخارجي', email: 'teacher.backend@example.com' });
            } else if (endpoint.startsWith('/api/user/change-password')) {
                if (body.newPassword === 'failme') return reject(new Error('كلمة المرور ضعيفة جداً.'));
                resolve({ message: 'تم تغيير كلمة المرور بنجاح.' });
            } else if (endpoint.startsWith('/api/dashboard')) {
                resolve({ studentCount: 150, courseCount: 5, upcomingAssignments: 3, activeDiscussions: 2});
            } else if (endpoint.startsWith('/api/live-lessons/credentials')) {
                resolve({ apiKey: 'MOCK_VIDEOSDK_API_KEY', token: 'MOCK_VIDEOSDK_VALID_JWT_TOKEN_FROM_BACKEND' });
            }
            else {
                reject(new Error(`Unhandled mock API endpoint: ${endpoint}`));
            }
        }, delay);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');
    const navLinks = document.querySelectorAll('.nav-link');

    const pageTitles = {
        dashboard: 'لوحة التحكم',
        students: 'الطلاب',
        courses: 'الدورات',
        assignments: 'الواجبات',
        discussions: 'النقاشات',
        schedule: 'الجدول الدراسي',
        notifications_page: 'الإشعارات',
        settings_page: 'الإعدادات',
        live_lesson: 'درس مباشر'
    };

    async function loadContent(pageWithParams) {
        try {
            let page = pageWithParams;
            let queryParams = {};

            if (pageWithParams.includes('?')) {
                const parts = pageWithParams.split('?');
                page = parts[0];
                const searchParams = new URLSearchParams(parts[1]);
                searchParams.forEach((value, key) => {
                    queryParams[key] = value;
                });
            }
            
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) {
                throw new Error(`Could not load page: ${page}`);
            }
            const html = await response.text();
            contentArea.innerHTML = html;
            
            const dynamicTitle = queryParams.meetingId ? `${pageTitles[page]}: ${decodeURIComponent(queryParams.meetingId)}` : pageTitles[page];
            pageTitle.textContent = dynamicTitle || 'مدارِك';
            
            lucide.createIcons(); 
            
            attachPageSpecificListeners(page);

            if (page === 'live_lesson') {
                const liveLessonModule = await import('./js/live_lesson.js');
                if (liveLessonModule.initLiveLesson) {
                    liveLessonModule.initLiveLesson(queryParams);
                }
            }

            animate(contentArea, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, ease: "easeOut" });

        } catch (error) {
            console.error('Error loading page:', error);
            contentArea.innerHTML = `<p class="text-red-500 text-center">حدث خطأ أثناء تحميل الصفحة. الرجاء المحاولة مرة أخرى.</p>`;
        }
    }

    function updateActiveLink(targetPage) {
        const pageName = targetPage.split('?')[0];
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${pageName}`) {
                link.classList.add('active-link');
            }
        });
    }
    
    function handleNavigation(page) {
        loadContent(page);
        updateActiveLink(page);
        if (window.innerWidth < 768 && sidebar.classList.contains('active')) { 
            sidebar.classList.remove('active'); 
            animate(sidebar, { x: "100%" }, { duration: 0.3 });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.currentTarget.getAttribute('href').substring(1);
            if (location.hash !== `#${page}`) {
                 history.pushState({ page }, '', `#${page}`);
            }
            handleNavigation(page);
        });
    });

    window.addEventListener('popstate', (event) => {
        const page = event.state ? event.state.page : (window.location.hash ? window.location.hash.substring(1) : 'dashboard');
        handleNavigation(page);
    });
    
    window.addEventListener('hashchange', () => {
        const page = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
        handleNavigation(page);
    });


    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (sidebar.classList.contains('active')) {
                animate(sidebar, { x: 0 }, { duration: 0.3 });
            } else {
                animate(sidebar, { x: "100%" }, { duration: 0.3 });
            }
        });
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
            animate(sidebar, { x: "100%" }, { duration: 0.3 });
        });
    }
    
    const initialPageFromHash = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
    loadContent(initialPageFromHash);
    updateActiveLink(initialPageFromHash);


    const notificationsToggle = document.getElementById('notifications-toggle');
    const settingsToggle = document.getElementById('settings-toggle');
    const userMenuToggle = document.getElementById('user-menu-toggle');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    const userMenuChevron = document.getElementById('user-menu-chevron');

    function closeAllPopups(except) {
        const popups = [
            { popup: userMenuDropdown, toggle: userMenuToggle, chevron: userMenuChevron }
        ];

        popups.forEach(item => {
            if (item.popup && item.popup !== except && !item.popup.classList.contains('hidden')) {
                item.popup.classList.add('hidden');
                animate(item.popup, { opacity: 0, scale: 0.95 }, { duration: 0.15 });
                if (item.chevron) {
                    item.chevron.style.transform = 'rotate(0deg)';
                }
            }
        });
    }

    if (notificationsToggle) {
        notificationsToggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const page = 'notifications_page';
            if (location.hash !== `#${page}`) {
                history.pushState({ page }, '', `#${page}`);
            }
            handleNavigation(page);
            closeAllPopups();
        });
    }

    if (settingsToggle) {
        settingsToggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const page = 'settings_page';
             if (location.hash !== `#${page}`) {
                history.pushState({ page }, '', `#${page}`);
            }
            handleNavigation(page);
            closeAllPopups();
        });
    }

    if (userMenuToggle && userMenuDropdown) {
        userMenuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            closeAllPopups(userMenuDropdown);
            const isHidden = userMenuDropdown.classList.toggle('hidden');
            animate(userMenuDropdown, { opacity: isHidden ? 0 : 1, scale: isHidden ? 0.95 : 1}, {duration: 0.15});
            if (userMenuChevron) userMenuChevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    }

    document.addEventListener('click', (event) => {
        if (userMenuDropdown && !userMenuDropdown.classList.contains('hidden') && 
            !userMenuDropdown.contains(event.target) && 
            userMenuToggle && !userMenuToggle.contains(event.target) && event.target !== userMenuToggle) {
            
            userMenuDropdown.classList.add('hidden');
            animate(userMenuDropdown, { opacity: 0, scale: 0.95}, {duration: 0.15});
            if (userMenuChevron) {
                userMenuChevron.style.transform = 'rotate(0deg)';
            }
        }
    });

    function attachPageSpecificListeners(page) {
        if (page === 'assignments') {
            const addAssignmentBtn = document.getElementById('add-assignment-btn');
            if (addAssignmentBtn) {
                addAssignmentBtn.addEventListener('click', () => openModal('addAssignmentModal'));
            }

            const assignmentsTableBody = document.getElementById('assignments-table-body');
            const assignmentSearchInput = document.getElementById('assignment-search-input');
            const assignmentStatusFilter = document.getElementById('assignment-status-filter');
            const statusMessageElement = document.getElementById('assignments-status-message');

            function showAssignmentsStatus(message, isError = false) {
                if (statusMessageElement) {
                    statusMessageElement.textContent = message;
                    statusMessageElement.className = `text-center py-4 ${isError ? 'text-red-500' : 'text-gray-500'}`;
                    statusMessageElement.classList.remove('hidden');
                }
                if (assignmentsTableBody) assignmentsTableBody.innerHTML = ''; 
            }

            async function fetchAndDisplayAssignments() {
                if (!assignmentsTableBody || !statusMessageElement) return;
                showAssignmentsStatus('جاري تحميل الواجبات...'); 

                const searchTerm = assignmentSearchInput ? assignmentSearchInput.value.trim() : "";
                const selectedStatus = assignmentStatusFilter ? assignmentStatusFilter.value : "";
                const queryParams = new URLSearchParams();
                if (searchTerm) queryParams.append('search', searchTerm);
                if (selectedStatus) queryParams.append('status', selectedStatus);

                try {
                    const assignments = await mockApiCall(`/api/assignments?${queryParams.toString()}`);
                    
                    if (assignmentsTableBody) assignmentsTableBody.innerHTML = '';

                    if (assignments.length === 0) {
                        showAssignmentsStatus('لا توجد واجبات مطابقة لمعايير الفلترة.');
                    } else {
                        if (statusMessageElement) statusMessageElement.classList.add('hidden'); 
                        assignments.forEach(assignment => {
                            const newRow = assignmentsTableBody.insertRow();
                            newRow.dataset.id = assignment.id; 
                            newRow.dataset.status = assignment.status.toLowerCase(); 
                            newRow.dataset.description = assignment.description || '';
                            newRow.dataset.notes = assignment.notes || '';
                            newRow.dataset.maxScore = assignment.maxScore || '';


                            newRow.insertCell().textContent = assignment.title;
                            newRow.insertCell().textContent = assignment.course;
                            newRow.insertCell().textContent = assignment.dueDate;
                            
                            const statusCell = newRow.insertCell();
                            const statusSpan = document.createElement('span');
                            let statusClass = '';
                            let statusText = '';
                             switch (assignment.status.toLowerCase()) {
                                case 'upcoming':
                                    statusClass = 'text-blue-700 bg-blue-100';
                                    statusText = 'قادمة';
                                    break;
                                case 'active':
                                    statusClass = 'text-yellow-700 bg-yellow-100';
                                    statusText = 'نشطة';
                                    break;
                                case 'archived':
                                    statusClass = 'text-green-700 bg-green-100';
                                    statusText = 'مؤرشفة';
                                    break;
                                default:
                                    statusClass = 'text-gray-700 bg-gray-100';
                                    statusText = assignment.status;
                            }
                            statusSpan.className = `px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`;
                            statusSpan.textContent = statusText;
                            statusCell.appendChild(statusSpan);

                            const actionsCell = newRow.insertCell();
                            const canEditDelete = assignment.status.toLowerCase() !== 'archived'; 
                            actionsCell.innerHTML = `
                                <button class="text-primary hover:underline p-1 edit-assignment-btn ${!canEditDelete ? 'text-gray-400 cursor-not-allowed' : ''}" ${!canEditDelete ? 'disabled title="لا يمكن تعديل واجب مؤرشف"' : ''} data-id="${assignment.id}"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                                <button class="text-red-500 hover:underline p-1 delete-assignment-btn ${!canEditDelete ? 'text-gray-400 cursor-not-allowed' : ''}" ${!canEditDelete ? 'disabled title="لا يمكن حذف واجب مؤرشف"' : ''} data-id="${assignment.id}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            `;
                        });
                        lucide.createIcons(); 
                    }
                } catch (error) {
                    console.error("Error fetching assignments:", error);
                    showAssignmentsStatus(`خطأ في تحميل الواجبات: ${error.message}`, true); 
                }
            }

            if (assignmentSearchInput) assignmentSearchInput.addEventListener('input', fetchAndDisplayAssignments);
            if (assignmentStatusFilter) assignmentStatusFilter.addEventListener('change', fetchAndDisplayAssignments);
            
            const addAssignmentForm = document.getElementById('addAssignmentForm');
            if (addAssignmentForm) {
                addAssignmentForm.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const submitBtn = addAssignmentForm.querySelector('button[type="submit"]');
                    const originalBtnText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = loadingSpinnerSVG('text-white');

                    const formData = new FormData(addAssignmentForm);
                    const assignmentData = Object.fromEntries(formData.entries());
                    
                    if (assignmentData.assignmentFile && assignmentData.assignmentFile.size === 0) {
                         delete assignmentData.assignmentFile; 
                    } else if (assignmentData.assignmentFile instanceof File) {
                        console.warn("File upload is present but will not be sent in JSON payload. Backend should handle file uploads separately.");
                        delete assignmentData.assignmentFile;
                    }

                    try {
                        await mockApiCall('/api/assignments', 'POST', assignmentData);
                        closeModal('addAssignmentModal');
                        addAssignmentForm.reset();
                        await fetchAndDisplayAssignments(); 
                    } catch (error) {
                        console.error("Error adding assignment:", error);
                        alert(`حدث خطأ عند إضافة الواجب: ${error.message}`); 
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        lucide.createIcons();
                    }
                });
            }
            
            const assignmentsTable = document.getElementById('assignments-table');
            if (assignmentsTable) {
                assignmentsTable.addEventListener('click', async (event) => {
                    const editButton = event.target.closest('.edit-assignment-btn:not([disabled])');
                    const deleteButton = event.target.closest('.delete-assignment-btn:not([disabled])');
                    const row = event.target.closest('tr');
                    const assignmentId = row ? row.dataset.id : null;

                    if (editButton && assignmentId) {
                        document.getElementById('editAssignmentId').value = assignmentId;
                        document.getElementById('editAssignmentTitle').value = row.cells[0].textContent;
                        document.getElementById('editAssignmentDescription').value = row.dataset.description || '';
                        
                        const courseSelect = document.getElementById('editAssignmentCourse');
                        for (let option of courseSelect.options) {
                            if (option.value === row.cells[1].textContent || option.text === row.cells[1].textContent) {
                                option.selected = true;
                                break;
                            }
                        }
                        document.getElementById('editAssignmentDueDate').value = row.cells[2].textContent; // Assuming YYYY-MM-DD
                        document.getElementById('editAssignmentNotes').value = row.dataset.notes || '';
                        document.getElementById('editAssignmentMaxScore').value = row.dataset.maxScore || '';
                        openModal('editAssignmentModal');
                    }

                    if (deleteButton && assignmentId) {
                        if (confirm('هل أنت متأكد من حذف هذا الواجب؟')) {
                            try {
                                await mockApiCall(`/api/assignments/${assignmentId}`, 'DELETE');
                                await fetchAndDisplayAssignments(); 
                            } catch (error) {
                                console.error("Error deleting assignment:", error);
                                alert(`حدث خطأ عند حذف الواجب: ${error.message}`);
                            }
                        }
                    }
                });
            }

            const editAssignmentForm = document.getElementById('editAssignmentForm');
            if (editAssignmentForm) {
                editAssignmentForm.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const submitBtn = editAssignmentForm.querySelector('button[type="submit"]');
                    const originalBtnText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = loadingSpinnerSVG('text-white');

                    const assignmentIdToEdit = document.getElementById('editAssignmentId').value;
                    if (!assignmentIdToEdit) {
                        alert("خطأ: لم يتم تحديد الواجب المراد تعديله.");
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        lucide.createIcons();
                        return;
                    }

                    const formData = new FormData(editAssignmentForm);
                    const updatedAssignmentData = Object.fromEntries(formData.entries());

                    if (updatedAssignmentData.editAssignmentFile && updatedAssignmentData.editAssignmentFile.size === 0) {
                        delete updatedAssignmentData.editAssignmentFile;
                    } else if (updatedAssignmentData.editAssignmentFile instanceof File) {
                       console.warn("File upload is present but will not be sent in JSON payload for edit. Backend should handle file uploads separately.");
                       delete updatedAssignmentData.editAssignmentFile;
                   }
                    
                    const payload = {
                        title: updatedAssignmentData.editAssignmentTitle,
                        description: updatedAssignmentData.editAssignmentDescription,
                        course: updatedAssignmentData.editAssignmentCourse,
                        dueDate: updatedAssignmentData.editAssignmentDueDate,
                        notes: updatedAssignmentData.editAssignmentNotes,
                        maxScore: updatedAssignmentData.editAssignmentMaxScore
                    };

                    try {
                        await mockApiCall(`/api/assignments/${assignmentIdToEdit}`, 'PUT', payload);
                        closeModal('editAssignmentModal');
                        editAssignmentForm.reset();
                        await fetchAndDisplayAssignments();
                    } catch (error) {
                        console.error("Error updating assignment:", error);
                        alert(`حدث خطأ عند حفظ التعديلات: ${error.message}`);
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        lucide.createIcons();
                    }
                });
            }
            fetchAndDisplayAssignments();
        }

        if (page === 'courses') {
            const courseSearchInput = document.getElementById('course-search-input');
            const courseStatusFilter = document.getElementById('course-status-filter');
            const courseCardsContainer = document.getElementById('course-cards-container');
            const coursesStatusMessage = document.getElementById('courses-status-message');

            function showCoursesStatus(message, isError = false) {
                if (coursesStatusMessage) {
                    coursesStatusMessage.textContent = message;
                    coursesStatusMessage.className = `text-center py-4 ${isError ? 'text-red-500' : 'text-gray-500'}`;
                    coursesStatusMessage.classList.remove('hidden');
                }
                if(courseCardsContainer) courseCardsContainer.innerHTML = '';
            }
            
            async function fetchAndDisplayCourses() {
                if (!courseCardsContainer || !coursesStatusMessage) return;
                showCoursesStatus('جاري تحميل الدورات...');

                const searchTerm = courseSearchInput ? courseSearchInput.value.toLowerCase() : "";
                const selectedStatus = courseStatusFilter ? courseStatusFilter.value : "";
                const queryParams = new URLSearchParams();
                if (searchTerm) queryParams.append('search', searchTerm);
                if (selectedStatus) queryParams.append('status', selectedStatus);

                try {
                    const courses = await mockApiCall(`/api/courses?${queryParams.toString()}`);
                    if(courseCardsContainer) courseCardsContainer.innerHTML = '';

                    if (courses.length === 0) {
                        showCoursesStatus('لا توجد دورات مطابقة لمعايير الفلترة.');
                    } else {
                        if (coursesStatusMessage) coursesStatusMessage.classList.add('hidden');
                        courses.forEach(course => {
                            const card = document.createElement('div');
                            card.className = "bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow course-card-item";
                            card.dataset.courseId = course.id;
                            card.dataset.courseName = course.name;
                            card.dataset.status = course.status;

                            card.innerHTML = `
                                <h3 class="text-lg font-semibold text-primary mb-2">${course.name}</h3>
                                <p class="text-sm text-gray-600 mb-3">${course.description}</p>
                                <div class="text-xs text-gray-500 mb-4">
                                    <span><i data-lucide="users" class="inline-block w-3 h-3 ml-1"></i> ${course.studentCount} طالب</span> | 
                                    <span><i data-lucide="list-checks" class="inline-block w-3 h-3 ml-1"></i> ${course.lessonCount} دروس</span>
                                </div>
                                <button class="btn btn-outline btn-sm w-full mb-2 view-course-details-btn" data-course-id="${course.id}">عرض التفاصيل</button>
                                <button class="btn btn-primary btn-sm w-full mb-2 add-lesson-to-course-btn" data-course-id="${course.id}" data-course-name="${course.name}">
                                    <i data-lucide="plus-circle" class="w-4 h-4"></i> إضافة درس جديد
                                </button>
                                <button class="btn btn-success btn-sm w-full start-live-lesson-btn" data-course-id="${encodeURIComponent(course.name)}">
                                    <i data-lucide="video" class="w-4 h-4"></i> بدء درس مباشر
                                </button>
                            `;
                            courseCardsContainer.appendChild(card);
                        });
                        lucide.createIcons();
                        attachCourseCardButtonListeners();
                    }
                } catch (error) {
                    console.error("Error fetching courses:", error);
                    showCoursesStatus(`خطأ في تحميل الدورات: ${error.message}`, true);
                }
            }

            function attachCourseCardButtonListeners() {
                document.querySelectorAll('.add-lesson-to-course-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const courseId = e.currentTarget.dataset.courseId;
                        const courseName = e.currentTarget.dataset.courseName;
                        document.getElementById('addLessonCourseId').value = courseId;
                        document.getElementById('lessonCourseName').value = courseName;
                        openModal('addLessonModal');
                    });
                });
                 document.querySelectorAll('.start-live-lesson-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const meetingId = e.currentTarget.dataset.courseId || `live_lesson_${Date.now()}`;
                        const role = 'teacher'; 
                        const targetHash = `live_lesson?meetingId=${meetingId}&role=${role}`;
                        
                        if (window.location.hash.substring(1) !== targetHash) {
                            window.location.hash = targetHash;
                        } else {
                            handleNavigation(targetHash); 
                        }
                    });
                });
                document.querySelectorAll('.view-course-details-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const courseId = e.currentTarget.dataset.courseId;
                        alert(`TODO: Implement view details for course ID: ${courseId}. This would typically navigate to a course detail page or open a modal with fetched course details.`);
                    });
                });
            }
            
            if (courseSearchInput) courseSearchInput.addEventListener('input', fetchAndDisplayCourses);
            if (courseStatusFilter) courseStatusFilter.addEventListener('change', fetchAndDisplayCourses);

            const addLessonForm = document.getElementById('addLessonForm');
            if (addLessonForm) {
                addLessonForm.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const submitBtn = addLessonForm.querySelector('button[type="submit"]');
                    const originalBtnText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = loadingSpinnerSVG('text-white');

                    const formData = new FormData(addLessonForm);
                    const lessonData = Object.fromEntries(formData.entries());
                    const courseId = lessonData.addLessonCourseId;

                    if (lessonData.lessonFile && lessonData.lessonFile.size === 0) {
                         delete lessonData.lessonFile;
                    } else if (lessonData.lessonFile instanceof File) {
                        console.warn("File upload is present but will not be sent in JSON payload. Backend should handle file uploads separately.");
                        delete lessonData.lessonFile;
                    }
                    
                    try {
                        await mockApiCall(`/api/courses/${courseId}/lessons`, 'POST', lessonData);
                        alert('تم إضافة الدرس بنجاح (محاكاة).');
                        closeModal('addLessonModal');
                        addLessonForm.reset();
                    } catch (error) {
                        console.error("Error adding lesson:", error);
                        alert(`حدث خطأ عند إضافة الدرس: ${error.message}`);
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        lucide.createIcons();
                    }
                });
            }
            fetchAndDisplayCourses();
        }
        
        if (page === 'students') {
            const studentSearchInput = document.getElementById('student-search-input');
            const studentSubjectFilter = document.getElementById('student-subject-filter'); 
            const studentTableBody = document.getElementById('students-table-body');
            const studentStatusMessage = document.getElementById('students-status-message');

            function showStudentsStatus(message, isError = false) {
                if (studentStatusMessage) {
                    studentStatusMessage.textContent = message;
                    studentStatusMessage.className = `text-center py-4 ${isError ? 'text-red-500' : 'text-gray-500'}`;
                    studentStatusMessage.classList.remove('hidden');
                }
                if(studentTableBody) studentTableBody.innerHTML = '';
            }

            async function fetchAndDisplayStudents() {
                if (!studentTableBody || !studentStatusMessage) {
                     console.warn("Students table body or status message element not found. Cannot fetch students.");
                     if(studentStatusMessage) showStudentsStatus("خطأ في تهيئة عرض الطلاب.", true);
                     return;
                }
                showStudentsStatus('جاري تحميل بيانات الطلاب...');
                const searchTerm = studentSearchInput ? studentSearchInput.value.toLowerCase() : "";
                const selectedSubject = studentSubjectFilter ? studentSubjectFilter.value.toLowerCase() : ""; // This should be .value, not .value.toLowerCase() yet if empty
                const queryParams = new URLSearchParams();
                if (searchTerm) queryParams.append('search', searchTerm);
                if (selectedSubject) queryParams.append('subject', selectedSubject);

                try {
                    const students = await mockApiCall(`/api/students?${queryParams.toString()}`);
                    studentTableBody.innerHTML = '';
                    if(students.length === 0) {
                        showStudentsStatus('لا يوجد طلاب مطابقون لمعايير البحث.');
                    } else {
                        if(studentStatusMessage) studentStatusMessage.classList.add('hidden');
                        students.forEach(student => {
                            const row = studentTableBody.insertRow();
                            row.dataset.id = student.id;
                
                            row.insertCell().textContent = student.name;
                            row.insertCell().textContent = student.studentId;
                            row.insertCell().textContent = student.courseRegistered;
                
                            const statusCell = row.insertCell();
                            const statusSpan = document.createElement('span');
                            let studentStatusText = student.status || 'غير محدد';
                            let studentStatusClass = 'text-gray-700 bg-gray-100';
                            if (studentStatusText === 'نشط') {
                                studentStatusClass = 'text-green-700 bg-green-100';
                            } else if (studentStatusText === 'غير نشط') {
                                studentStatusClass = 'text-yellow-700 bg-yellow-100';
                            }
                            statusSpan.className = `px-2 py-1 text-xs font-semibold rounded-full ${studentStatusClass}`;
                            statusSpan.textContent = studentStatusText;
                            statusCell.appendChild(statusSpan);
                
                            const paymentCell = row.insertCell();
                            let paymentStatusText = '';
                            let paymentStatusClasses = 'text-sm ';
                
                            if (student.totalDue === undefined || student.amountPaid === undefined) {
                                paymentStatusText = 'غير متوفر';
                                paymentStatusClasses += 'text-gray-500';
                            } else if (student.amountPaid === 0) {
                                paymentStatusText = 'لم يتم الدفع';
                                paymentStatusClasses += 'text-red-600 font-semibold';
                            } else if (student.amountPaid >= student.totalDue) {
                                paymentStatusText = 'مدفوع بالكامل';
                                paymentStatusClasses += 'text-green-600 font-semibold';
                            } else {
                                paymentStatusText = `${student.amountPaid}\u00A0د.ل / ${student.totalDue}\u00A0د.ل`;
                                paymentStatusClasses += 'text-yellow-700';
                            }
                            paymentCell.textContent = paymentStatusText;
                            paymentCell.className = paymentStatusClasses;
                
                            const actionsCell = row.insertCell();
                            actionsCell.classList.add('text-center');
                            actionsCell.innerHTML = `<button class="text-primary hover:text-primary-dark p-1" title="عرض تفاصيل الطالب"><i data-lucide="eye" class="w-5 h-5"></i></button>`;
                        });
                        lucide.createIcons();
                    }
                } catch (error) {
                    console.error("Error fetching students:", error);
                    showStudentsStatus(`خطأ في تحميل الطلاب: ${error.message}`, true);
                }
            }
            if (studentSearchInput) studentSearchInput.addEventListener('input', fetchAndDisplayStudents);
            if (studentSubjectFilter) studentSubjectFilter.addEventListener('change', fetchAndDisplayStudents);
            

            if(document.getElementById('students-table-body') && document.getElementById('students-status-message')) {
                 fetchAndDisplayStudents();
            }
        }

        if (page === 'discussions') {
            const createTopicBtn = document.getElementById('create-topic-btn');
            if (createTopicBtn) {
                createTopicBtn.addEventListener('click', () => openModal('createTopicModal'));
            }
            async function fetchAndDisplayDiscussions() {
                 console.log("TODO: Implement fetchAndDisplayDiscussions with API call and dynamic rendering.");
            }
            const createTopicForm = document.getElementById('createTopicForm');
            if (createTopicForm) {
                 createTopicForm.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    alert("TODO: Submit create topic form data to backend API.");
                 });
            }
            fetchAndDisplayDiscussions();
        }
        
        if (page === 'schedule') {
             async function fetchAndDisplayScheduleEvents() {
                 console.log("TODO: Implement fetchAndDisplayScheduleEvents with API call and dynamic rendering for schedule.");
             }
             document.querySelectorAll('.start-live-lesson-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const meetingId = e.currentTarget.dataset.meetingId || e.currentTarget.dataset.courseId || `live_lesson_${Date.now()}`;
                    const role = 'teacher'; 
                    const targetHash = `live_lesson?meetingId=${encodeURIComponent(meetingId)}&role=${role}`;
                    
                    if (window.location.hash.substring(1) !== targetHash) {
                        window.location.hash = targetHash;
                    } else {
                        handleNavigation(targetHash); 
                    }
                });
            });
             fetchAndDisplayScheduleEvents();
        }
        
        if (page === 'dashboard') {
            async function fetchAndDisplayDashboardData() {
                 try {
                    const data = await mockApiCall('/api/dashboard');
                    
                    const studentCountEl = document.getElementById('dashboard-student-count');
                    if (studentCountEl) studentCountEl.textContent = data.studentCount;

                    const courseCountEl = document.getElementById('dashboard-course-count');
                    if (courseCountEl) courseCountEl.textContent = data.courseCount;
                    
                 } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                    const studentCountEl = document.getElementById('dashboard-student-count');
                    if (studentCountEl) studentCountEl.textContent = 'N/A';
                    
                    const courseCountEl = document.getElementById('dashboard-course-count');
                    if (courseCountEl) courseCountEl.textContent = 'N/A';
                 }
            }
            fetchAndDisplayDashboardData();
        }

        if (page === 'settings_page') {
            const teacherNameDisplay = document.getElementById('teacher-name-display');
            const teacherEmailDisplay = document.getElementById('teacher-email-display');

            async function fetchAndDisplayUserSettings() {
                try {
                    const settings = await mockApiCall('/api/user/settings');
                    if (teacherNameDisplay) teacherNameDisplay.textContent = settings.name;
                    if (teacherEmailDisplay) teacherEmailDisplay.textContent = settings.email;
                } catch (error) {
                    console.error("Error fetching user settings:", error);
                    if (teacherNameDisplay) teacherNameDisplay.textContent = "خطأ في التحميل";
                    if (teacherEmailDisplay) teacherEmailDisplay.textContent = "خطأ في التحميل";
                }
            }
            
            const changePasswordForm = document.getElementById('changePasswordForm');
            if (changePasswordForm) {
                changePasswordForm.addEventListener('submit', async function(event) {
                    event.preventDefault();
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalBtnText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = loadingSpinnerSVG('text-white');

                    const currentPassword = document.getElementById('currentPassword').value;
                    const newPassword = document.getElementById('newPassword').value;
                    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

                    if (newPassword !== confirmNewPassword) {
                        alert('كلمتا المرور الجديدتان غير متطابقتين.');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        lucide.createIcons();
                        return;
                    }
                    try {
                        await mockApiCall('/api/user/change-password', 'POST', { currentPassword, newPassword });
                        alert('تم طلب تغيير كلمة المرور بنجاح (محاكاة).');
                        this.reset();
                    } catch (error) {
                         alert(`فشل تغيير كلمة المرور: ${error.message}`);
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        lucide.createIcons();
                    }
                });
            }
            fetchAndDisplayUserSettings();
        }
    }

    window.openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            animate(modal, { opacity: [0, 1] }, { duration: 0.3 });
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                animate(modalContent, { scale: [0.9, 1], opacity: [0,1] }, { duration: 0.3, delay:0.05 });
            }
        }
    }

    window.closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                 animate(modalContent, { scale: [1, 0.9], opacity: [1,0] }, { duration: 0.2 });
            }
            animate(modal, { opacity: [1, 0] }, { duration: 0.2, delay: 0.1 }).then(() => {
                 modal.classList.remove('active');
            });
        }
    }
    
    document.addEventListener('click', (event) => {
        if (event.target.matches('.modal-close-btn') || event.target.closest('.modal-close-btn')) {
            const modal = event.target.closest('.modal-backdrop');
            if (modal && modal.id && modal.classList.contains('active')) {
                 closeModal(modal.id);
            }
        }

        if (event.target.matches('.modal-backdrop.active')) {
            const modalContent = event.target.querySelector('.modal-content');
            if (modalContent && !modalContent.contains(event.target) && event.target.id) {
                closeModal(event.target.id);
            }
        }
    });
});
