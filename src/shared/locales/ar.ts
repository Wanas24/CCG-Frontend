const shared = {
  "common": {
    "appName": "Construct Code Group",
    "loading": "جارٍ التحميل...",
    "submit": "إرسال",
    "cancel": "إلغاء",
    "back": "رجوع",
    "continue": "متابعة",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "confirmPassword": "تأكيد كلمة المرور",
    "language": "اللغة",
    "english": "English",
    "arabic": "العربية",
    "theme": "المظهر",
    "darkMode": "داكن",
    "lightMode": "فاتح",
    "systemMode": "النظام",
    "menu": "القائمة",
    "logout": "تسجيل الخروج",
    "unexpectedError": "حدث خطأ غير متوقع",
    "networkError": "تعذر الاتصال. تحقق من اتصال الإنترنت وحاول مرة أخرى.",
    "timeoutError": "انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.",
    "serverError": "حدث خطأ من جانبنا. يرجى المحاولة لاحقًا."
  },
  "validation": {
    "required": "هذا الحقل مطلوب",
    "email": "أدخل بريدًا إلكترونيًا صالحًا",
    "passwordMin": "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
    "passwordMatch": "كلمتا المرور غير متطابقتين",
    "passwordComplexity": "يجب أن تتضمن كلمة المرور حرفًا كبيرًا وصغيرًا ورقمًا ورمزًا",
    "maxLength50": "يجب ألا يزيد عن 50 حرفًا",
    "maxLength200": "يجب ألا يزيد عن 200 حرف",
    "maxLength500": "يجب ألا يزيد عن 500 حرف",
    "phoneInvalid": "أدخل رقم هاتف مصري صالح (مثال: +2010XXXXXXXX)",
    "nationalIdLength": "يجب أن يتكون الرقم القومي من 14 رقمًا بالضبط",
    "dateOfBirthPast": "يجب أن يكون تاريخ الميلاد في الماضي",
    "imageType": "ارفع صورة بصيغة JPG أو PNG",
    "imageMaxSize": "يجب ألا يتجاوز حجم الصورة 5 ميغابايت"
  },
  "upload": {
    "dragText": "انقر أو اسحب الملف إلى هذه المنطقة للرفع",
    "dragHint": "يدعم رفع ملف واحد أو عدة ملفات. يُمنع منعًا باتًا رفع بيانات الشركة أو أي ملفات محظورة."
  }
} as const;

export default shared;
