# 🏋️ TechnoFit - برنامج التغذية والتدريب

تطبيق ويب متكامل لإدارة برامج التغذية والتدريب، مع حاسبة سعرات حرارية ونظام اشتراكات.

## 🚀 المميزات

- **حاسبة السعرات الحرارية**: حساب BMR، TDEE، السعرات المستهدفة والماكرونز
- **نظام اشتراكات متعدد**: 4 باقات مختلفة تناسب جميع الاحتياجات
- **لوحة تحكم للأدمن**: إدارة المشتركين وطلبات الاشتراك
- **نظام غذائي مقترح**: خطط وجبات مبنية على بيانات المستخدم
- **تصميم متجاوب**: يعمل على جميع الأجهزة

## 📦 الباقات

| الباقة | السعر | المميزات |
|--------|-------|----------|
| الأساسية | 150 ج.م | نظام غذائي بسيط، جدول تمارين |
| الاقتصادية | 250 ج.م | نظام مخصص، حساب الماكرونز |
| الاحترافية | 500 ج.م | برنامج شهر، متابعة واتساب |
| الذهبية | 900 ج.م | برنامج 3 شهور، متابعة كاملة |

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon/Supabase) with Prisma ORM
- **UI Components**: shadcn/ui
- **State Management**: Zustand

## 📋 المتطلبات

- Node.js 18+
- PostgreSQL database (Neon, Supabase, Railway, etc.)

## 🔧 التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/YOUR_USERNAME/technofit.git
cd technofit

# تثبيت المكتبات
npm install

# إعداد متغيرات البيئة
cp .env.example .env
# ثم عدّل .env بمعلومات قاعدة البيانات الخاصة بك

# إنشاء جداول قاعدة البيانات
npx prisma db push

# إنشاء حساب الأدمن
npx prisma db seed
# أو افتح /api/fix-admin في المتصفح

# تشغيل الخادم
npm run dev
```

## 🔐 متغيرات البيئة

أنشئ ملف `.env`:

```env
# PostgreSQL connection (required)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

### مثال لـ Neon Database:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/technofit?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/technofit?sslmode=require"
```

## 👨‍💼 بيانات الأدمن

بعد التثبيت، استخدم هذه البيانات لتسجيل الدخول:

| Username | Password |
|----------|----------|
| `admin` | `admin123` |

> ⚠️ غيّر كلمة المرور فوراً في بيئة الإنتاج!

## 🔗 API Endpoints المهمة

| Endpoint | الوصف |
|----------|-------|
| `GET /api/fix-admin` | إنشاء حساب الأدمن تلقائياً |
| `GET /api/db-status` | فحص حالة قاعدة البيانات |

## 🚀 النشر على Vercel

1. اربط المشروع بـ Vercel
2. أضف متغيرات البيئة:
   - `DATABASE_URL`
   - `DIRECT_URL`
3. سيتم تشغيل `prisma db push` تلقائياً أثناء البناء
4. بعد النشر، افتح `/api/fix-admin` لإنشاء الأدمن

## 📱 التواصل

- **واتساب**: +201069465855
- **فيسبوك**: [الصحيح](https://www.facebook.com/الصحيح)
- **تيك توك**: [@technofit90](https://www.tiktok.com/@technofit90)

## 📄 الترخيص

MIT License

---

تم التطوير بواسطة **أحمد الكوتش** - احصائي تغذية معتمد
