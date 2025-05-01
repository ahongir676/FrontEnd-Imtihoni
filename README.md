# 🎓 Edufix Admin Panel

EduCenter — bu o‘quv markazi uchun yaratilgan **admin panel**, unda admin va o‘qituvchilar foydalanuvchilarni, guruhlarni va o‘quvchilarni boshqarishlari mumkin.

---

## 📦 Texnologiyalar

- **React** (Vite)
- **React Router v6**
- **Redux Toolkit**
- **Axios**
- **Tailwind CSS** (yoki boshqa UI kutubxonasi)
- **Role-based Access Control (RBAC)**

---

## 🔐 Role-based Access

Loyihada `RoleChecker` komponenti orqali sahifalarga kirish **faqat "admin" yoki "teacher"** rollariga ruxsat etiladi. 
Shu orqali himoyalangan marshrutlar faqat kerakli rollarga ko‘rsatiladi.

---

## 🧭 Marshrutlar (Routes)

| Path              | Tavsif                     | Kirish huquqi       |
|-------------------|----------------------------|----------------------|
| `/login`          | Login sahifasi             | Barchaga ochiq       |
| `/`               | Dashboard va Home          | admin, teacher       |
| `/students`       | O‘quvchilar ro‘yxati       | admin, teacher       |
| `/students/add`   | O‘quvchi qo‘shish sahifasi | faqat admin          |
| `/teachers`       | O‘qituvchilar ro‘yxati     | faqat admin          |
| `/teachers/add`   | O‘qituvchi qo‘shish        | faqat admin          |
| `/groups`         | Guruhlar ro‘yxati          | admin, teacher       |
| `/groups/add`     | Guruh qo‘shish             | faqat admin          |

---
TODO — Tugallanmagan joylar
 Filter qilish funksiyasi hali qo‘shilmagan

 "Yaratish" (Create) funksiyasi ba'zi sahifalarda ishlamaydi

 Hech qaysi sahifada Details  page yo‘q (Student, Teacher, Group)

 Foydalanuvchi o‘z profilini tahrirlashi qo‘shilmagan

 Xatoliklar uchun Snackbar yoki Toast xabarlari yo‘q

 Loaderlar (Yuklanmoqda) holatlari hali ko‘rsatilmagan
