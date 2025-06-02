// Main application controller
class ParentApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.selectedChild = null;
        this.data = null;
        this.init();
    }

    async init() {
        try {
            // Load parent data
            const response = await fetch('data/parent-data.json');
            this.data = await response.json();
            
            // Initialize UI components
            this.initNavigation();
            this.initUserMenu();
            this.initChildSelectors();
            this.initNotifications();
            this.initMessaging();
            
            // Load dashboard by default
            this.showSection('dashboard');
            
            console.log('Parent App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('حدث خطأ في تحميل البيانات');
        }
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }

    initUserMenu() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');

        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            userDropdown.classList.add('hidden');
        });
    }

    initChildSelectors() {
        const selectors = [
            'childSelector',
            'academicChildSelector',
            'attendanceChildSelector',
            'scheduleChildSelector'
        ];

        selectors.forEach(selectorId => {
            const selector = document.getElementById(selectorId);
            if (selector && this.data) {
                // Clear existing options
                selector.innerHTML = '<option value="">اختر الطفل</option>';
                
                // Add children options
                this.data.children.forEach(child => {
                    const option = document.createElement('option');
                    option.value = child.id;
                    option.textContent = child.name;
                    selector.appendChild(option);
                });

                // Add change event listener
                selector.addEventListener('change', (e) => {
                    this.selectedChild = e.target.value;
                    this.onChildSelectionChange(selectorId);
                });
            }
        });
    }

    initNotifications() {
        const notificationsBtn = document.getElementById('notificationsBtn');
        const notificationsPanel = document.getElementById('notificationsPanel');

        notificationsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationsPanel.classList.toggle('hidden');
            if (!notificationsPanel.classList.contains('hidden')) {
                this.loadNotifications();
            }
        });

        document.addEventListener('click', (e) => {
            if (!notificationsPanel.contains(e.target) && !notificationsBtn.contains(e.target)) {
                notificationsPanel.classList.add('hidden');
            }
        });
    }

    initMessaging() {
        const messagesBtn = document.getElementById('messagesBtn');
        const newMessageBtn = document.getElementById('newMessageBtn');
        const newMessageModal = document.getElementById('newMessageModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const cancelMessageBtn = document.getElementById('cancelMessageBtn');

        messagesBtn.addEventListener('click', () => {
            this.showSection('communication');
        });

        if (newMessageBtn) {
            newMessageBtn.addEventListener('click', () => {
                this.showNewMessageModal();
            });
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.hideNewMessageModal();
            });
        }

        if (cancelMessageBtn) {
            cancelMessageBtn.addEventListener('click', () => {
                this.hideNewMessageModal();
            });
        }
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });
        
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
        }

        this.currentSection = sectionName;
        this.loadSectionData(sectionName);
    }

    loadSectionData
(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                window.dashboardManager.loadDashboard();
                break;
            case 'children':
                this.loadChildrenSection();
                break;
            case 'academic':
                this.loadAcademicSection();
                break;
            case 'attendance':
                this.loadAttendanceSection();
                break;
            case 'fees':
                this.loadFeesSection();
                break;
            case 'communication':
                window.messagingManager.loadMessages();
                break;
            case 'schedule':
                this.loadScheduleSection();
                break;
        }
    }

    onChildSelectionChange(selectorId) {
        switch (selectorId) {
            case 'academicChildSelector':
                this.loadAcademicData();
                break;
            case 'attendanceChildSelector':
                this.loadAttendanceData();
                break;
            case 'scheduleChildSelector':
                this.loadScheduleData();
                break;
        }
    }

    loadChildrenSection() {
        const childrenList = document.getElementById('childrenList');
        if (!childrenList || !this.data) return;

        childrenList.innerHTML = '';

        this.data.children.forEach(child => {
            const childCard = this.createChildCard(child);
            childrenList.appendChild(childCard);
        });
    }

    createChildCard(child) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover-card';
        
        card.innerHTML = `
            <div class="flex items-center mb-4">
                <img src="${child.photo}" alt="${child.name}" class="w-16 h-16 rounded-full object-cover">
                <div class="mr-4">
                    <h3 class="text-lg font-semibold text-gray-800">${child.name}</h3>
                    <p class="text-gray-600">${child.grade} - ${child.class}</p>
                </div>
            </div>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600">متوسط الدرجات:</span>
                    <span class="font-semibold ${this.getGradeClass(child.averageGrade)}">${child.averageGrade}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">أيام الغياب:</span>
                    <span class="font-semibold text-gray-800">${child.absenceDays}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">الواجبات المعلقة:</span>
                    <span class="font-semibold text-gray-800">${child.pendingAssignments}</span>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
                <button onclick="app.viewChildDetails('${child.id}')" 
                        class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                    عرض التفاصيل
                </button>
            </div>
        `;

        return card;
    }

    loadAcademicSection() {
        if (!this.selectedChild) return;
        this.loadAcademicData();
    }

    loadAcademicData() {
        if (!this.selectedChild || !this.data) return;

        const child = this.data.children.find(c => c.id === this.selectedChild);
        if (!child) return;

        this.loadGradesTable(child);
        this.loadAssignmentsStatus(child);
    }

    loadGradesTable(child) {
        const tbody = document.getElementById('gradesTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        child.subjects.forEach(subject => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200';
            
            row.innerHTML = `
                <td class="px-4 py-3 font-medium text-gray-800">${subject.name}</td>
                <td class="px-4 py-3 text-center ${this.getGradeClass(subject.homework)}">${subject.homework || '-'}</td>
                <td class="px-4 py-3 text-center ${this.getGradeClass(subject.quizzes)}">${subject.quizzes || '-'}</td>
                <td class="px-4 py-3 text-center ${this.getGradeClass(subject.finalExam)}">${subject.finalExam || '-'}</td>
                <td class="px-4 py-3 text-center font-semibold ${this.getGradeClass(subject.total)}">${subject.total}%</td>
            `;

            tbody.appendChild(row);
        });
    }

    loadAssignmentsStatus(child) {
        const container = document.getElementById('assignmentsStatus');
        if (!container) return;

        container.innerHTML = '';

        child.assignments.forEach(assignment => {
            const assignmentDiv = document.createElement('div');
            assignmentDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
            
            assignmentDiv.innerHTML = `
                <div>
                    <h4 class="font-medium text-gray-800">${assignment.title}</h4>
                    <p class="text-sm text-gray-600">${assignment.subject} - ${assignment.dueDate}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${this.getStatusClass(assignment.status)}">
                    ${this.getStatusText(assignment.status)}
                </span>
            `;

            container.appendChild(assignmentDiv);
        });
    }

    loadAttendanceSection() {
        if (!this.selectedChild) return;
        this.loadAttendanceData();
    }

    loadAttendanceData() {
        if (!this.selectedChild || !this.data) return;

        const child = this.data.children.find(c => c.id === this.selectedChild);
        if (!child) return;

        // Update attendance summary
        document.getElementById('presentDays').textContent = child.attendance.present;
        document.getElementById('absentDays').textContent = child.attendance.absent;
        document.getElementById('lateDays').textContent = child.attendance.late;

        this.loadAttendanceTable(child);
    }

    loadAttendanceTable(child) {
        const tbody = document.getElementById('attendanceTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        child.attendanceRecords.forEach(record => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200';
            
            row.innerHTML = `
                <td class="px-4 py-3 text-gray-800">${record.date}</td>
                <td class="px-4 py-3 text-center">
                    <span class="status-${record.status}">${this.getAttendanceStatusText(record.status)}</span>
                </td>
                <td class="px-4 py-3 text-center text-gray-600">${record.arrivalTime || '-'}</td>
                <td class="px-4 py-3 text-center text-gray-600">${record.notes || '-'}</td>
            `;

            tbody.appendChild(row);
        });
    }

    loadFeesSection() {
        if (!this.data) return;

        this.loadFeesTable();
        this.loadPaymentHistory();
    }

    loadFeesTable() {
        const tbody = document.getElementById('feesTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.data.fees.forEach(fee => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200';
            
            row.innerHTML = `
                <td class="px-4 py-3 font-medium text-gray-800">${fee.childName}</td>
                <td class="px-4 py-3 text-center text-gray-600">${fee.type}</td>
                <td class="px-4 py-3 text-center font-semibold text-gray-800">${fee.amount} ر.س</td>
                <td class="px-4 py-3 text-center text-gray-600">${fee.dueDate}</td>
                <td class="px-4 py-3 text-center">
                    <span class="status-${fee.status}">${this.getFeeStatusText(fee.status)}</span>
                </td>
                <td class="px-4 py-3 text-center">
                    ${fee.status === 'pending' ? '<button class="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90">دفع الآن</button>' : '-'}
                </td>
            `;

            tbody.appendChild(row);
        });
    }

    loadPaymentHistory() {
        const container = document.getElementById('paymentHistory');
        if (!container) return;

        container.innerHTML = '';

        this.data.paymentHistory.forEach(payment => {
            const paymentDiv = document.createElement('div');
            paymentDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
            
            paymentDiv.innerHTML = `
                <div>
                    <h4 class="font-medium text-gray-800">${payment.description}</h4>
                    <p class="text-sm text-gray-600">${payment.date}</p>
                </div>
                <div class="text-left">
                    <p class="font-semibold text-gray-800">${payment.amount} ر.س</p>
                    <p class="text-sm text-success">مدفوع</p>
                </div>
            `;

            container.appendChild(paymentDiv);
        });
    }

    loadScheduleSection() {
        if (!this.selectedChild) return;
        this.loadScheduleData();
    }

    loadScheduleData() {
        if (!this.selectedChild || !this.data) return;

        const child = this.data.children.find(c => c.id === this.selectedChild);
        if (!child) return;

        this.loadScheduleTable(child);
    }

    loadScheduleTable(child) {
        const tbody = document.getElementById('scheduleTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        const times = ['08:00 - 08:45', '08:45 - 09:30', '09:45 - 10:30', '10:30 - 11:15', '11:30 - 12:15'];
        
        times.forEach((time, index) => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200';
            
            let rowHTML = `<td class="px-4 py-3 font-medium text-gray-700 bg-gray-50">${time}</td>`;
            
            ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'].forEach(day => {
                const subject = child.schedule[day][index] || '';
                rowHTML += `<td class="px-4 py-3 text-center ${subject ? 'bg-blue-50 text-blue-800' : ''}">${subject}</td>`;
            });
            
            row.innerHTML = rowHTML;
            tbody.appendChild(row);
        });
    }

    loadNotifications() {
        const container = document.getElementById('notificationsList');
        if (!container || !this.data) return;

        container.innerHTML = '';

        this.data.notifications.forEach(notification => {
            const notificationDiv = document.createElement('div');
            notificationDiv.className = `p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`;
            
            notificationDiv.innerHTML = `
                <div class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                        <i class="fas ${this.getNotificationIcon(notification.type)} text-${this.getNotificationColor(notification.type)}"></i>
                    </div>
                    <div class="mr-3 flex-1">
                        <h4 class="text-sm font-medium text-gray-800">${notification.title}</h4>
                        <p class="text-sm text-gray-600 mt-1">${notification.message}</p>
                        <p class="text-xs text-gray-400 mt-2">${notification.time}</p>
                    </div>
                    ${!notification.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full"></div>' : ''}
                </div>
            `;

            container.appendChild(notificationDiv);
        });
    }

    showNewMessageModal() {
        const modal = document.getElementById('newMessageModal');
        const recipientSelect = document.getElementById('recipientSelect');
        
        if (modal && recipientSelect) {
            // Populate recipients
            recipientSelect.innerHTML = '<option value="">اختر المستقبل</option>';
            
            if (this.data && this.data.teachers) {
                this.data.teachers.forEach(teacher => {
                    const option = document.createElement('option');
                    option.value = teacher.id;
                    option.textContent = `${teacher.name} - ${teacher.subject}`;
                    recipientSelect.appendChild(option);
                });
            }
            
            modal.classList.remove('hidden');
        }
    }

    hideNewMessageModal() {
        const modal = document.getElementById('newMessageModal');
        if (modal) {
            modal.classList.add('hidden');
            // Clear form
            document.getElementById('newMessageForm').reset();
        }
    }

    viewChildDetails(childId) {
        // Set selected child and navigate to academic section
        this.selectedChild = childId;
        document.getElementById('academicChildSelector').value = childId;
        this.showSection('academic');
    }

    getGradeClass(grade) {
        if (grade >= 90) return 'grade-excellent';
        if (grade >= 80) return 'grade-good';
        if (grade >= 70) return 'grade-average';
        return 'grade-poor';
    }

    getStatusClass(status) {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    getStatusText(status) {
        switch (status) {
            case 'completed': return 'مكتمل';
            case 'pending': return 'معلق';
            case 'overdue': return 'متأخر';
            default: return 'غير محدد';
        }
    }

    getAttendanceStatusText(status) {
        switch (status) {
            case 'present': return 'حاضر';
            case 'absent': return 'غائب';
            case 'late': return 'متأخر';
            case 'excused': return 'مستأذن';
            default: return status;
        }
    }

    
getFeeStatusText(status) {
        switch (status) {
            case 'paid': return 'مدفوع';
            case 'pending': return 'معلق';
            case 'overdue': return 'متأخر';
            default: return 'غير محدد';
        }
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'grade': return 'fa-chart-line';
            case 'attendance': return 'fa-calendar-times';
            case 'message': return 'fa-envelope';
            case 'fee': return 'fa-credit-card';
            case 'assignment': return 'fa-clipboard-list';
            default: return 'fa-info-circle';
        }
    }

    getNotificationColor(type) {
        switch (type) {
            case 'grade': return 'blue-500';
            case 'attendance': return 'red-500';
            case 'message': return 'green-500';
            case 'fee': return 'orange-500';
            case 'assignment': return 'purple-500';
            default: return 'gray-500';
        }
    }

    showError(message) {
        // Simple error display - could be enhanced with a proper notification system
        alert(message);
    }

    showSuccess(message) {
        // Simple success display - could be enhanced with a proper notification system
        console.log('Success:', message);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ParentApp();
});
