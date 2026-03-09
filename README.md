# 📚 نصوصي | Nususi

منصة عربية لرفع وقراءة وتحميل الكتب الإلكترونية بسهولة.

يتيح الموقع للمستخدمين إنشاء حساب، رفع كتب بصيغة **PDF**، قراءتها مباشرة داخل المتصفح، أو تحميلها.

---

# ✨ المميزات

* 🔐 تسجيل حساب وتسجيل دخول آمن باستخدام JWT
* 📤 رفع الكتب بصيغة PDF
* 📖 قراءة الكتب مباشرة في المتصفح
* ⬇️ تحميل الكتب
* 🔎 البحث عن الكتب
* 🗂 تصنيفات متعددة
* 👤 ملف شخصي للمستخدم
* 📊 لوحة تحكم للمستخدم

---

# 🧱 بنية المشروع

```
nususi/
│
├── backend/              # Node.js + Express + MongoDB
│   ├── middleware/       # التحقق من تسجيل الدخول
│   ├── models/           # نماذج البيانات (User, Book)
│   ├── routes/           # مسارات API
│   │   ├── auth.js
│   │   ├── books.js
│   │   ├── upload.js
│   │   └── dashboard.js
│   │
│   ├── uploads/          # ملفات PDF المرفوعة
│   ├── .env              # متغيرات البيئة
│   ├── package.json
│   └── server.js         # نقطة تشغيل السيرفر
│
└── frontend/             # React + TypeScript + Tailwind
    │
    ├── public/           # الملفات العامة (اللوجو)
    │
    ├── src/
    │   ├── components/   # مكونات الواجهة
    │   │   ├── Navbar
    │   │   ├── Footer
    │   │   ├── Layout
    │   │   └── PrivateRoute
    │   │
    │   ├── context/      # إدارة الحالة
    │   │   └── AuthContext
    │   │
    │   ├── pages/        # صفحات الموقع
    │   │
    │   ├── types/        # أنواع البيانات
    │   ├── utils/        # أدوات مساعدة
    │   │   ├── api.ts
    │   │   └── cn.ts
    │   │
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    │
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── tsconfig.json
```

---

# ⚙️ التقنيات المستخدمة

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication
* Multer (رفع الملفات)

## Frontend

* React
* TypeScript
* Tailwind CSS
* Vite

---

# 🚀 تشغيل المشروع

## 1️⃣ تشغيل السيرفر (Backend)

```
cd backend
npm install
```

أنشئ ملف `.env` وضع فيه:

```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/nususi
JWT_SECRET=your_secret_key
PORT=5000
```

ثم شغل السيرفر:

```
node server.js
```

السيرفر سيعمل على:

```
http://localhost:5000
```

---

## 2️⃣ تشغيل الموقع (Frontend)

```
cd frontend
npm install
npm run dev
```

الموقع سيعمل على:

```
http://localhost:3000
```

---

# 📡 API Endpoints

## Auth

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | إنشاء حساب       |
| POST   | /api/auth/login    | تسجيل الدخول     |
| GET    | /api/auth/me       | معلومات المستخدم |

---

## Books

| Method | Endpoint       | Description |
| ------ | -------------- | ----------- |
| GET    | /api/books     | جميع الكتب  |
| GET    | /api/books/:id | تفاصيل كتاب |

---

## Upload

| Method | Endpoint         | Description |
| ------ | ---------------- | ----------- |
| POST   | /api/upload/book | رفع كتاب    |

---

## Dashboard

| Method | Endpoint                  | Description       |
| ------ | ------------------------- | ----------------- |
| GET    | /api/dashboard/stats      | إحصائيات عامة     |
| GET    | /api/dashboard/user-stats | إحصائيات المستخدم |

---

# 📄 الصفحات

| المسار     | الصفحة          |
| ---------- | --------------- |
| /          | الصفحة الرئيسية |
| /books     | جميع الكتب      |
| /books/:id | تفاصيل الكتاب   |
| /read/:id  | قراءة الكتاب    |
| /upload    | رفع كتاب        |
| /dashboard | لوحة التحكم     |
| /login     | تسجيل الدخول    |
| /register  | إنشاء حساب      |
| /profile   | الملف الشخصي    |

---

# 📂 رفع الملفات

جميع الكتب يتم حفظها داخل:

```
backend/uploads/
```

ويمكن الوصول إليها عبر:

```
http://localhost:5000/uploads/filename.pdf
```

---

# 🔐 الأمان

المشروع يستخدم:

* JWT Authentication
* حماية المسارات الخاصة
* تشفير كلمات المرور باستخدام bcrypt
* التحقق من نوع الملفات (PDF فقط)

---

# 🛠 تحسينات مستقبلية

* ⭐ نظام تقييم الكتب
* 💬 نظام تعليقات
* 📊 إحصائيات أكثر تفصيلاً
* 🔖 حفظ الكتب المفضلة
* 📱 تحويل الموقع إلى PWA
* 🤖 اقتراح كتب مشابهة

---

# 👨‍💻 المطور

تم تطوير هذا المشروع بواسطة:

**Mahmoud Elbana**

📧 البريد الإلكتروني:
[mahemoudgamal6@gmail.com](mailto:mahemoudgamal6@gmail.com)

📍 العنوان:
المحلة الكبرى – مصر

---

# 📜 الترخيص

هذا المشروع مفتوح المصدر ويمكن استخدامه وتطويره بحرية.
