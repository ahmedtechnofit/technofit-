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
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **UI Components**: shadcn/ui
- **State Management**: Zustand

## 📋 المتطلبات

- Node.js 18+
- Bun (أو npm/yarn)
- PostgreSQL database (Neon, Supabase, etc.)

## 🔧 التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/YOUR_USERNAME/technofit.git
cd technofit

# تثبيت المكتبات
bun install

# إعداد قاعدة البيانات
bun run db:push

# إنشاء حساب الأدمن الافتراضي
bun run db:seed

# تشغيل الخادم
bun run dev
```

## 🔐 متغيرات البيئة

أنشئ ملف `.env`:

```env
# PostgreSQL connection (Neon)
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/technofit?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/technofit?sslmode=require"
```

## 👨‍💼 بيانات الأدمن الافتراضية

بعد تشغيل `bun run db:seed`:

- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ غيّر كلمة المرور فوراً بعد أول تسجيل دخول في بيئة الإنتاج!

## 🌱 API للإنشاء الأولي

إذا لم تعمل seed script، يمكنك استدعاء API مباشرة:

```
POST /api/seed-admin
```

هذا سينشئ حساب الأدمن الافتراضي.

## 📱 التواصل

- **واتساب**: +201069465855
- **فيسبوك**: [الصحيح](https://www.facebook.com/الصحيح)
- **تيك توك**: [@technofit90](https://www.tiktok.com/@technofit90)

## 📄 الترخيص

MIT License

---

تم التطوير بواسطة **أحمد الكوتش** - احصائي تغذية معتمد
