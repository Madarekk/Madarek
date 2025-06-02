// Sample data for the student dashboard
const studentData = {
    // Today's schedule
    todaySchedule: [
        {
            subject: 'الرياضيات',
            teacher: 'أ. محمد أحمد',
            time: '08:00 - 08:45',
            room: 'قاعة 101'
        },
        {
            subject: 'اللغة العربية',
            teacher: 'أ. فاطمة علي',
            time: '09:00 - 09:45',
            room: 'قاعة 102'
        },
        {
            subject: 'العلوم',
            teacher: 'أ. سارة محمود',
            time: '10:15 - 11:00',
            room: 'مختبر العلوم'
        },
        {
            subject: 'اللغة الإنجليزية',
            teacher: 'أ. أحمد حسن',
            time: '11:15 - 12:00',
            room: 'قاعة 104'
        }
    ],

    // Pending assignments
    pendingAssignments: [
        {
            id: 1,
            title: 'حل تمارين الجبر',
            subject: 'الرياضيات',
            teacher: 'أ. محمد أحمد',
            dueDate: '2024-01-20',
            status: 'pending',
            type: 'homework',
            description: 'حل تمارين الوحدة الثالثة من كتاب الرياضيات صفحة 45-50'
        },
        {
            id: 2,
            title: 'بحث عن الشعر الجاهلي',
            subject: 'اللغة العربية',
            teacher: 'أ. فاطمة علي',
            dueDate: '2024-01-22',
            status: 'pending',
            type: 'research',
            description: 'إعداد بحث مفصل عن خصائص الشعر الجاهلي مع أمثلة'
        },
        {
            id: 3,
            title: 'تجربة الكيمياء',
            subject: 'العلوم',
            teacher: 'أ. سارة محمود',
            dueDate: '2024-01-18',
            status: 'overdue',
            type: 'experiment',
            description: 'كتابة تقرير عن تجربة التفاعلات الكيميائية'
        },
        {
            id: 4,
            title: 'مقال باللغة الإنجليزية',
            subject: 'اللغة الإنجليزية',
            teacher: 'أ. أحمد حسن',
            dueDate: '2024-01-25',
            status: 'pending',
            type: 'essay',
            description: 'Write an essay about environmental protection (500 words)'
        }
    ],

    // Recent grades
    recentGrades: [
        {
            subject: 'الرياضيات',
            type: 'اختبار قصير',
            score: 85,
            total: 100,
            date: '2024-01-15',
            teacher: 'أ. محمد أحمد'
        },
        {
            subject: 'اللغة العربية',
            type: 'واجب منزلي',
            score: 92,
            total: 100,
            date: '2024-01-14',
            teacher: 'أ. فاطمة علي'
        },
        {
            subject: 'العلوم',
            type: 'تجربة معملية',
            score: 88,
            total: 100,
            date: '2024-01-13',
            teacher: 'أ. سارة محمود'
        },
        {
            subject: 'اللغة الإنجليزية',
            type: 'امتحان شفهي',
            score: 90,
            total: 100,
            date: '2024-01-12',
            teacher: 'أ. أحمد حسن'
        }
    ],

    // Recent announcements
    recentAnnouncements: [
        {
            id: 1,
            title: 'إعلان مهم بخصوص امتحانات نهاية الفصل',
            content: 'تبدأ امتحانات نهاية الفصل الدراسي الأول يوم 15 فبراير 2024. يرجى مراجعة جدول الامتحانات والاستعداد جيداً.',
            sender: 'إدارة المدرسة',
            date: '2024-01-16',
            type: 'important'
        },
        {
            id: 2,
            title: 'ورشة عمل حول مهارات الدراسة',
            content: 'ستقام ورشة عمل حول تطوير مهارات الدراسة والمذاكرة الفعالة يوم الأربعاء القادم في المكتبة.',
            sender: 'أ. محمد أحمد',
            date: '2024-01-15',
            type: 'event'
        },
        {
            id: 3,
            title: 'تأجيل حصة الرياضة',
            content: 'تم تأجيل حصة الرياضة المقررة يوم الخميس إلى يوم السبت بسبب سوء الأحوال الجوية.',
            sender: 'أ. خالد سعد',
            date: '2024-01-14',
            type: 'schedule'
        }
    ],

    // Full schedule
    weeklySchedule: {
        'الأحد': [
            { time: '08:00-08:45', subject: 'الرياضيات', teacher: 'أ. محمد أحمد', room: 'قاعة 101' },
            { time: '09:00-09:45', subject: 'اللغة العربية', teacher: 'أ. فاطمة علي', room: 'قاعة 102' },
            { time: '10:15-11:00', subject: 'العلوم', teacher: 'أ. سارة محمود', room: 'مختبر العلوم' },
            { time: '11:15-12:00', subject: 'اللغة الإنجليزية', teacher: 'أ. أحمد حسن', room: 'قاعة 104' },
            { time: '12:15-13:00', subject: 'التاريخ', teacher: 'أ. عمر يوسف', room: 'قاعة 105' }
        ],
        'الاثنين': [
            { time: '08:00-08:45', subject: 'اللغة الإنجليزية', teacher: 'أ. أحمد حسن', room: 'قاعة 104' },
            { time: '09:00-09:45', subject: 'الرياضيات', teacher: 'أ. محمد أحمد', room: 'قاعة 101' },
            { time: '10:15-11:00', subject: 'الجغرافيا', teacher: 'أ. نور الدين', room: 'قاعة 106' },
            { time: '11:15-12:00', subject: 'التربية الإسلامية', teacher: 'أ. حسام الدين', room: 'قاعة 107' },
            { time: '12:15-13:00', subject: 'الرياضة', teacher: 'أ. خالد سعد', room: 'الملعب' }
        ],
        'الثلاثاء': [
            { time: '08:00-08:45', subject: 'العلوم', teacher: 'أ. سارة محمود', room: 'مختبر العلوم' },
            { time: '09:00-09:45', subject: 'اللغة العربية', teacher: 'أ. فاطمة علي', room: 'قاعة 102' },
            { time: '10:15-11:00', subject: 'الرياضيات', teacher: 'أ. محمد أحمد', room: 'قاعة 101' },
            { time: '11:15-12:00', subject: 'الفنون', teacher: 'أ. منى حسن', room: 'قاعة الفنون' },
            { time: '12:15-13:00', subject: 'الحاسوب', teacher: 'أ. أحمد سليم', room: 'مختبر الحاسوب' }
        ]
    },

    // Student subjects
    subjects: [
        {
            id: 1,
            name: 'الرياضيات',
            teacher: 'أ. محمد أحمد',
            code: 'MATH101',
            credits: 4,
            description: 'دراسة الجبر والهندسة والإحصاء',
            materials: [
                { type: 'pdf', title: 'كتاب الرياضيات الجزء الأول', url: '#' },
                { type: 'video', title: 'شرح الوحدة الأولى', url: '#' },
                { type: 'pdf', title: 'تمارين إضافية', url: '#' }
            ]
        },
        {
            id: 2,
            name: 'اللغة العربية',
            teacher: 'أ. فاطمة علي',
            code: 'ARAB101',
            credits: 4,
            description: 'دراسة الأدب والنحو والصرف',
            materials: [
                { type: 'pdf', title: 'كتاب الأدب العربي', url: '#' },
                { type: 'pdf', title: 'قواعد النحو', url: '#' }
            ]
        }
    ],

    // Attendance records
    attendanceRecords: [
        { date: '2024-01-16', subject: 'الرياضيات', status: 'حاضر', time: '08:00' },
        { date: '2024-01-16', subject: 'اللغة العربية', status: 'حاضر', time: '09:00' },
        { date: '2024-01-16', subject: 'العلوم', status: 'غائب', time: '10:15' },
        { date: '2024-01-15', subject: 'الرياضيات', status: 'حاضر', time: '08:00' },
        { date: '2024-01-15', subject: 'اللغة الإنجليزية', status: 'متأخر', time: '09:15' }
    ],

    // All grades
    allGrades: {
        'الرياضيات': [
            { type: 'اختبار قصير 1', score: 85, total: 100, date: '2024-01-15', weight: 10 },
            { type: 'واجب 1', score: 90, total: 100, date: '2024-01-10', weight: 5 },
            { type: 'واجب 2', score: 88, total: 100, date: '2024-01-05', weight: 5 }
        ],
        'اللغة العربية': [
            { type: 'واجب منزلي', score: 92, total: 100, date: '2024-01-14', weight: 5 },
            { type: 'اختبار شفهي', score: 87, total: 100, date: '2024-01-08', weight: 10 }
        ],
        'العلوم': [
            { type: 'تجربة معملية', score: 88, total: 100, date: '2024-01-13', weight: 15 },
            { type: 'اختبار قصير', score: 82, total: 100, date: '2024-01-06', weight: 10 }
        ]
    }
};

// Data access functions
function getTodaySchedule() {
    const today = new Date().toLocaleDateString('ar-SA', { weekday: 'long' });
    return studentData.weeklySchedule[today] || [];
}

function getPendingAssignments() {
    return studentData.pendingAssignments;
}

function getRecentGrades() {
    return studentData.recentGrades;
}

function getRecentAnnouncements() {
    return studentData.recentAnnouncements;
}

function getWeeklySchedule() {
    return studentData.
weeklySchedule;
}

function getSubjects() {
    return studentData.subjects;
}

function getAttendanceRecords() {
    return studentData.attendanceRecords;
}

function getAllGrades() {
    return studentData.allGrades;
}

function getAssignmentById(id) {
    return studentData.pendingAssignments.find(assignment => assignment.id === parseInt(id));
}
