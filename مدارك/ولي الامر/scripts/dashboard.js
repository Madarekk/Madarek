// Dashboard management functionality
class DashboardManager {
    constructor() {
        this.data = null;
    }

    setData(data) {
        this.data = data;
    }

    loadDashboard() {
        if (!this.data) return;

        this.updateQuickStats();
        this.loadChildrenSummary();
        this.loadRecentNotifications();
        this.loadUpcomingAssignments();
        this.loadFeeStatus();
    }

    updateQuickStats() {
        if (!this.data) return;

        // Update total children
        const totalChildren = this.data.children.length;
        document.getElementById('totalChildren').textContent = totalChildren;

        // Calculate average grades
        let totalGrades = 0;
        let gradeCount = 0;
        this.data.children.forEach(child => {
            if (child.averageGrade) {
                totalGrades += child.averageGrade;
                gradeCount++;
            }
        });
        const averageGrades = gradeCount > 0 ? Math.round(totalGrades / gradeCount) : 0;
        document.getElementById('averageGrades').textContent = `${averageGrades}%`;

        // Calculate total absence days
        const totalAbsence = this.data.children.reduce((total, child) => total + child.absenceDays, 0);
        document.getElementById('absenceDays').textContent = totalAbsence;

        // Calculate pending fees
        const pendingFees = this.data.fees
            .filter(fee => fee.status === 'pending')
            .reduce((total, fee) => total + fee.amount, 0);
        document.getElementById('pendingFees').textContent = `${pendingFees.toLocaleString('ar-SA')} ر.س`;
    }

    loadChildrenSummary() {
        const container = document.getElementById('childrenSummary');
        if (!container || !this.data) return;

        container.innerHTML = '';

        this.data.children.forEach(child => {
            const childDiv = document.createElement('div');
            childDiv.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer';
            childDiv.onclick = () => window.app.viewChildDetails(child.id);
            
            childDiv.innerHTML = `
                <div class="flex items-center">
                    <img src="${child.photo}" alt="${child.name}" class="w-12 h-12 rounded-full object-cover">
                    <div class="mr-3">
                        <h4 class="font-medium text-gray-800">${child.name}</h4>
                        <p class="text-sm text-gray-600">${child.grade} - ${child.class}</p>
                    </div>
                </div>
                <div class="text-left">
                    <p class="text-sm font-medium ${window.app.getGradeClass(child.averageGrade)}">${child.averageGrade}%</p>
                    <p class="text-xs text-gray-500">${child.absenceDays} أيام غياب</p>
                </div>
            `;

            container.appendChild(childDiv);
        });
    }

    loadRecentNotifications() {
        const container = document.getElementById('recentNotifications');
        if (!container || !this.data) return;

        container.innerHTML = '';

        // Show only the 5 most recent notifications
        const recentNotifications = this.data.notifications.slice(0, 5);

        recentNotifications.forEach(notification => {
            const notificationDiv = document.createElement('div');
            notificationDiv.className = `flex items-start p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`;
            
            notificationDiv.innerHTML = `
                <div class="flex-shrink-0 mt-1">
                    <i class="fas ${window.app.getNotificationIcon(notification.type)} text-${window.app.getNotificationColor(notification.type)} text-sm"></i>
                </div>
                <div class="mr-3 flex-1">
                    <h5 class="text-sm font-medium text-gray-800">${notification.title}</h5>
                    <p class="text-xs text-gray-600 mt-1">${notification.message}</p>
                    <p class="text-xs text-gray-400 mt-1">${notification.time}</p>
                </div>
                ${!notification.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>' : ''}
            `;

            container.appendChild(notificationDiv);
        });

        // Add "view all" link
        const viewAllDiv = document.createElement('div');
        viewAllDiv.className = 'text-center pt-3 border-t border-gray-200';
        viewAllDiv.innerHTML = `
            <button onclick="document.getElementById('notificationsBtn').click()" 
                    class="text-primary text-sm hover:text-primary/80 transition-colors">
                عرض جميع الإشعارات
            </button>
        `;
        container.appendChild(viewAllDiv);
    }

    loadUpcomingAssignments() {
        const container = document.getElementById('upcomingAssignments');
        if (!container || !this.data) return;

        container.innerHTML = '';

        // Collect all upcoming assignments from all children
        const upcomingAssignments = [];
        this.data.children.forEach(child => {
            child.assignments.forEach(assignment => {
                if (assignment.status === 'pending') {
                    upcomingAssignments.push({
                        ...assignment,
                        childName: child.name
                    });
                }
            });
        });

        // Sort by due date and take the first 5
        upcomingAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        const nextAssignments = upcomingAssignments.slice(0, 5);

        if (nextAssignments.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">لا توجد واجبات قادمة</p>';
            return;
        }

        nextAssignments.forEach(assignment => {
            const assignmentDiv = document.createElement('div');
            assignmentDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
            
            assignmentDiv.innerHTML = `
                <div>
                    <h5 class="text-sm font-medium text-gray-800">${assignment.title}</h5>
                    <p class="text-xs text-gray-600">${assignment.childName} - ${assignment.subject}</p>
                    <p class="text-xs text-gray-500 mt-1">موعد التسليم: ${assignment.dueDate}</p>
                </div>
                <div class="text-left">
                    <span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">معلق</span>
                </div>
            `;

            container.appendChild(assignmentDiv);
        });
    }

    loadFeeStatus() {
        const container = document.getElementById('feeStatus');
        if (!container || !this.data) return;

        container.innerHTML = '';

        // Calculate fee statistics
        const totalFees = this.data.fees.reduce((total, fee) => total + fee.amount, 0);
        const paidFees = this.data.fees.filter(fee => fee.status === 'paid').reduce((total, fee) => total + fee.amount, 0);
        const pendingFees = this.data.fees.filter(fee => fee.status === 'pending').reduce((total, fee) => total + fee.amount, 0);
        const overdueFees = this.data.fees.filter(fee => fee.status === 'overdue').reduce((total, fee) => total + fee.amount, 0);

        // Fee summary
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'grid grid-cols-2 gap-4 mb-4';
        summaryDiv.innerHTML = `
            <div class="text-center">
                <p class="text-sm text-gray-600">إجمالي الرسوم</p>
                <p class="text-lg font-bold text-gray-800">${totalFees.toLocaleString('ar-SA')} ر.س</p>
            </div>
            <div class="text-center">
                <p class="text-sm text-gray-600">المدفوع</p>
                <p class="text-lg font-bold text-success">${paidFees.toLocaleString('ar-SA')} ر.س</p>
            </div>
        `;
        container.appendChild(summaryDiv);

        // Pending fees
        if (pendingFees > 0) {
            const pendingDiv = document.createElement('div');
            pendingDiv.className = 'p-3 bg-orange-50 border border-orange-200 rounded-lg mb-3';
            pendingDiv.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <h5 class="text-sm font-medium text-orange-800">رسوم معلقة</h5>
                        <p class="text-xs text-orange-600">يجب دفعها قريباً</p>
                    </div>
                    <div class="text-left">
                        <p class="text-lg font-bold text-orange-800">${pendingFees.toLocaleString('ar-SA')} ر.س</p>
                    </div>
                </div>
            `;
            container.appendChild(pendingDiv);
        }

        // Overdue fees
        if (overdueFees > 0) {
            const overdueDiv = document.createElement('div');
            overdueDiv.className = 'p-3 bg-red-50 border border-red-200 rounded-lg mb-3';
            overdueDiv.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <h5 class="text-sm font-medium text-red-800">رسوم متأخرة</h5>
                        <p class="text-xs text-red-600">يجب دفعها فوراً</p>
                    </div>
                    <div class="text-left">
                        <p class="text-lg font-bold text-red-800">${overdueFees.toLocaleString('ar-SA')} ر.س</p>
                    </div>
                </div>
            `;
            container.appendChild(overdueDiv);
        }

        // View all fees button
        const viewAllDiv = document.createElement('div');
        viewAllDiv.className = 'text-center pt-3 border-t border-gray-200';
        viewAllDiv.innerHTML = `
            <button onclick="window.app.showSection('fees')" 
                    class="text-primary text-sm hover:text-primary/80 transition-colors">
                عرض جميع الرسوم
            </button>
        `;
        container.appendChild(viewAllDiv);
    }
}

// Initialize dashboard manager
window.dashboardManager = new DashboardManager();
