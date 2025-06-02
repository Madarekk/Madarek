// بيانات الطلاب الوهميين
const mockStudents = [
    // سادس أ
    { id: 1, name: "أحمد محمد", class: "سادس أ", email: "ahmed@example.com" },
    { id: 2, name: "سارة خالد", class: "سادس أ", email: "sara@example.com" },
    { id: 3, name: "عمر علي", class: "سادس أ", email: "omar@example.com" },
    { id: 4, name: "فاطمة أحمد", class: "سادس أ", email: "fatima@example.com" },
    
    // سادس ب
    { id: 5, name: "محمد إبراهيم", class: "سادس ب", email: "mohamed@example.com" },
    { id: 6, name: "نور حسن", class: "سادس ب", email: "nour@example.com" },
    { id: 7, name: "ياسر عبدالله", class: "سادس ب", email: "yasser@example.com" },
    { id: 8, name: "ليلى عمر", class: "سادس ب", email: "layla@example.com" },

    // سابع أ
    { id: 9, name: "خالد محمود", class: "سابع أ", email: "khaled@example.com" },
    { id: 10, name: "رنا سعيد", class: "سابع أ", email: "rana@example.com" },
    { id: 11, name: "زياد طارق", class: "سابع أ", email: "ziad@example.com" },
    { id: 12, name: "سلمى كريم", class: "سابع أ", email: "salma@example.com" },

    // سابع ب
    { id: 13, name: "طارق حسين", class: "سابع ب", email: "tarek@example.com" },
    { id: 14, name: "مريم أحمد", class: "سابع ب", email: "mariam@example.com" },
    { id: 15, name: "يوسف سامي", class: "سابع ب", email: "yousef@example.com" },
    { id: 16, name: "هدى محمد", class: "سابع ب", email: "huda@example.com" },

    // ثامن أ
    { id: 17, name: "كريم عادل", class: "ثامن أ", email: "kareem@example.com" },
    { id: 18, name: "دينا حسام", class: "ثامن أ", email: "dina@example.com" },
    { id: 19, name: "باسم وليد", class: "ثامن أ", email: "bassem@example.com" },
    { id: 20, name: "رقية سمير", class: "ثامن أ", email: "rokaya@example.com" },

    // ثامن ب
    { id: 21, name: "سمير فؤاد", class: "ثامن ب", email: "samir@example.com" },
    { id: 22, name: "منى عصام", class: "ثامن ب", email: "mona@example.com" },
    { id: 23, name: "حسام علاء", class: "ثامن ب", email: "hossam@example.com" },
    { id: 24, name: "ندى كمال", class: "ثامن ب", email: "nada@example.com" },

    // تاسع أ
    { id: 25, name: "عادل حمدي", class: "تاسع أ", email: "adel@example.com" },
    { id: 26, name: "رانيا ماهر", class: "تاسع أ", email: "rania@example.com" },
    { id: 27, name: "ماهر سليم", class: "تاسع أ", email: "maher@example.com" },
    { id: 28, name: "إيمان صلاح", class: "تاسع أ", email: "eman@example.com" },

    // تاسع ب
    { id: 29, name: "صلاح الدين", class: "تاسع ب", email: "salah@example.com" },
    { id: 30, name: "نهى سعد", class: "تاسع ب", email: "noha@example.com" },
    { id: 31, name: "سعد حسني", class: "تاسع ب", email: "saad@example.com" },
    { id: 32, name: "لينا عماد", class: "تاسع ب", email: "lina@example.com" }
];

// دالة لتهيئة البيانات الوهمية
function initializeMockData() {
    // حفظ بيانات الطلاب في localStorage
    localStorage.setItem('students', JSON.stringify(mockStudents));
    console.log('تم تهيئة بيانات الطلاب الوهميين بنجاح');
}

// تهيئة البيانات عند تحميل الصفحة
window.addEventListener('load', () => {
    // التحقق مما إذا كانت البيانات موجودة بالفعل
    if (!localStorage.getItem('students')) {
        initializeMockData();
    }
}); 