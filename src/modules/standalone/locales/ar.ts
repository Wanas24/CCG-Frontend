const notFound = {
  title: "الصفحة غير موجودة",
  description: "الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.",
  goHome: "العودة للرئيسية",
  goLogin: "الذهاب لتسجيل الدخول",
} as const;

export const home = {
  navLabel: "الرئيسية",
  permissions: {
    title: "صلاحياتك",
    admin: "مسؤول",
    manager: "مدير",
    yes: "نعم",
    no: "لا",
    granted: "ممنوحة",
    denied: "مرفوضة",
    error: "تعذّر تحميل الصلاحيات.",
  },
} as const;

export const settings = {
  navLabel: "الإعدادات",
} as const;

export default notFound;
