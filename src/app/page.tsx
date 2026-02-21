'use client';

import { useState, useEffect } from 'react';
import { useAppStore, ActivityLevel, Goal, Gender } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Dumbbell, 
  Calculator, 
  User, 
  Target, 
  Flame, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Upload,
  Download,
  MessageCircle,
  Instagram,
  Facebook,
  Phone,
  Menu,
  X,
  Shield,
  Users,
  DollarSign,
  Eye,
  LogOut,
  ArrowRight,
  Sparkles,
  Heart,
  Activity,
  Apple,
  Zap,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

// Activity level multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Little or no exercise
  light: 1.375,        // Light exercise 1-3 days/week
  moderate: 1.55,      // Moderate exercise 3-5 days/week
  active: 1.725,       // Hard exercise 6-7 days/week
  very_active: 1.9,    // Very hard exercise & physical job
};

// Activity level labels in Arabic
const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'غير نشيط - لا يوجد تمارين',
  light: 'نشاط خفيف - 1-3 أيام أسبوعياً',
  moderate: 'نشاط متوسط - 3-5 أيام أسبوعياً',
  active: 'نشاط عالي - 6-7 أيام أسبوعياً',
  very_active: 'نشاط مكثف - رياضة + عمل بدني',
};

// Goal labels in Arabic
const GOAL_LABELS: Record<Goal, { label: string; description: string }> = {
  cutting: { 
    label: 'تنشيف Cutting', 
    description: 'خسارة الدهون والحفاظ على العضلات' 
  },
  bulking: { 
    label: 'تضخيم Bulking', 
    description: 'زيادة الكتلة العضلية والقوة' 
  },
  maintenance: { 
    label: 'ثبات Maintenance', 
    description: 'الحفاظ على الوزن الحالي' 
  },
};

// Calculate BMR using Mifflin-St Jeor Equation
function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Calculate TDEE
function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

// Calculate target calories based on goal
function calculateTargetCalories(tdee: number, goal: Goal): number {
  switch (goal) {
    case 'cutting':
      return tdee - 500; // 500 calorie deficit
    case 'bulking':
      return tdee + 300; // 300 calorie surplus
    default:
      return tdee;
  }
}

// Calculate macros
function calculateMacros(calories: number, goal: Goal) {
  let proteinRatio = 0.3;
  let fatRatio = 0.25;
  let carbsRatio = 0.45;

  if (goal === 'cutting') {
    proteinRatio = 0.35;
    fatRatio = 0.25;
    carbsRatio = 0.4;
  } else if (goal === 'bulking') {
    proteinRatio = 0.25;
    fatRatio = 0.2;
    carbsRatio = 0.55;
  }

  return {
    protein: Math.round((calories * proteinRatio) / 4), // 4 cal per gram
    carbs: Math.round((calories * carbsRatio) / 4),     // 4 cal per gram
    fat: Math.round((calories * fatRatio) / 9),         // 9 cal per gram
  };
}

// Landing Page Component
function LandingPage() {
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20" />
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 z-10">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                احصائي تغذية معتمد
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  أحمد الكوتش
                </span>
                <br />
                <span className="text-white">مرشدك للوصول للجسم المثالي</span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                برامج تدريب وتغذية مخصصة بناءً على جسمك وهدفك. 
                احسب سعراتك اليومية مجاناً واحصل على خطة احترافية مدفوعة.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg"
                  onClick={() => setCurrentStep('calculator')}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  احسب سعراتك مجاناً
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">+500</div>
                  <div className="text-slate-400">متدرب</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-400">98%</div>
                  <div className="text-slate-400">نسبة النجاح</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">5+ سنين</div>
                  <div className="text-slate-400">خبرة</div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
                <Image
                  src="/coach.jpg"
                  alt="أحمد الكوتش - احصائي تغذية"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating elements */}
              <div className="absolute top-10 -left-4 bg-emerald-500/20 backdrop-blur-sm rounded-xl p-3 border border-emerald-500/30">
                <Dumbbell className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="absolute bottom-20 -left-8 bg-teal-500/20 backdrop-blur-sm rounded-xl p-3 border border-teal-500/30">
                <Apple className="w-6 h-6 text-teal-400" />
              </div>
              <div className="absolute top-1/2 -right-4 bg-cyan-500/20 backdrop-blur-sm rounded-xl p-3 border border-cyan-500/30">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          ماذا نقدم لك؟
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors">
            <CardHeader>
              <Calculator className="w-12 h-12 text-emerald-400 mb-4" />
              <CardTitle className="text-white">حاسبة السعرات المجانية</CardTitle>
              <CardDescription className="text-slate-400">
                احسب BMR و TDEE والسعرات المستهدفة بناءً على بياناتك
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 hover:border-teal-500/50 transition-colors">
            <CardHeader>
              <Target className="w-12 h-12 text-teal-400 mb-4" />
              <CardTitle className="text-white">خطط مخصصة</CardTitle>
              <CardDescription className="text-slate-400">
                برامج تدريب وتغذية مصممة خصيصاً لهدفك
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors">
            <CardHeader>
              <Heart className="w-12 h-12 text-cyan-400 mb-4" />
              <CardTitle className="text-white">متابعة مستمرة</CardTitle>
              <CardDescription className="text-slate-400">
                تواصل مباشر مع الكوتش عبر واتساب
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            جاهز تبدأ رحلتك؟
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            احسب سعراتك الآن مجاناً واعرف من أين تبدأ
          </p>
          <Button 
            size="lg" 
            className="bg-white text-emerald-600 hover:bg-emerald-50 px-12 py-6 text-lg"
            onClick={() => setCurrentStep('calculator')}
          >
            ابدأ الآن
            <ArrowRight className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Calculator Form Component
function CalculatorForm() {
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const setUserProfile = useAppStore((state) => state.setUserProfile);
  const setFitnessResults = useAppStore((state) => state.setFitnessResults);
  const setUserId = useAppStore((state) => state.setUserId);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    height: '',
    weight: '',
    age: '',
    gender: 'male' as Gender,
    activityLevel: 'moderate' as ActivityLevel,
    goal: 'cutting' as Goal,
    proteinBudget: 'medium' as 'low' | 'medium' | 'high',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save user and calculate results
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          age: parseInt(formData.age),
          gender: formData.gender,
          activityLevel: formData.activityLevel,
          goal: formData.goal,
          proteinBudget: formData.proteinBudget,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'حدث خطأ');
      }

      const data = await response.json();
      
      // Calculate results
      const bmr = calculateBMR(
        parseFloat(formData.weight),
        parseFloat(formData.height),
        parseInt(formData.age),
        formData.gender
      );
      const tdee = calculateTDEE(bmr, formData.activityLevel);
      const targetCalories = calculateTargetCalories(tdee, formData.goal);
      const macros = calculateMacros(targetCalories, formData.goal);

      setUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        age: parseInt(formData.age),
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
      });

      setFitnessResults({
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        ...macros,
      });

      setUserId(data.userId);
      setCurrentStep('results');
      toast.success('تم حساب النتائج بنجاح!');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button 
          variant="ghost" 
          className="text-slate-400 mb-6"
          onClick={() => setCurrentStep('landing')}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة للرئيسية
        </Button>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <Calculator className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <CardTitle className="text-2xl text-white">حاسبة السعرات الحرارية</CardTitle>
            <CardDescription className="text-slate-400">
              أدخل بياناتك للحصول على حسابات دقيقة لجسمك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  البيانات الشخصية
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="أحمد محمد"
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ahmed@example.com"
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+20xxxxxxxxxx"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">الموقع</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="القاهرة، مصر"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              {/* Body Measurements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-teal-400 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  قياسات الجسم
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">الطول (سم)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="175"
                      required
                      min={100}
                      max={250}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">الوزن (كجم)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="75"
                      required
                      min={30}
                      max={300}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">العمر</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="25"
                      required
                      min={10}
                      max={100}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الجنس</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value: Gender) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="male">ذكر</SelectItem>
                        <SelectItem value="female">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              {/* Activity Level */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  مستوى النشاط
                </h3>
                <RadioGroup 
                  value={formData.activityLevel} 
                  onValueChange={(value: ActivityLevel) => setFormData({ ...formData, activityLevel: value })}
                  className="space-y-3"
                >
                  {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
                    <div key={level} className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value={level} id={level} className="border-emerald-500 text-emerald-500" />
                      <Label htmlFor={level} className="text-slate-300 cursor-pointer">
                        {ACTIVITY_LABELS[level]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator className="bg-slate-700" />

              {/* Goal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-rose-400 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  هدفك
                </h3>
                <div className="grid gap-3">
                  {(Object.keys(GOAL_LABELS) as Goal[]).map((goal) => (
                    <div 
                      key={goal}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.goal === goal 
                          ? 'border-emerald-500 bg-emerald-500/10' 
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                      onClick={() => setFormData({ ...formData, goal })}
                    >
                      <div className="flex items-center gap-3">
                        {goal === 'cutting' ? (
                          <TrendingDown className="w-6 h-6 text-rose-400" />
                        ) : goal === 'bulking' ? (
                          <TrendingUp className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Activity className="w-6 h-6 text-cyan-400" />
                        )}
                        <div>
                          <div className="font-semibold text-white">{GOAL_LABELS[goal].label}</div>
                          <div className="text-sm text-slate-400">{GOAL_LABELS[goal].description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-700" />

              {/* Protein Budget */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  حالتك المادية من ناحية البروتين
                </h3>
                <div className="grid gap-3">
                  {[
                    { value: 'low', label: 'ميزانية محدودة', desc: 'أعتمد على الأكل الطبيعي فقط' },
                    { value: 'medium', label: 'ميزانية متوسطة', desc: 'أستطيع شراء مكملات أحياناً' },
                    { value: 'high', label: 'ميزانية جيدة', desc: 'أستطيع شراء مكملات بانتظام' },
                  ].map((budget) => (
                    <div 
                      key={budget.value}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.proteinBudget === budget.value 
                          ? 'border-emerald-500 bg-emerald-500/10' 
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                      onClick={() => setFormData({ ...formData, proteinBudget: budget.value as 'low' | 'medium' | 'high' })}
                    >
                      <div className="flex items-center gap-3">
                        <DollarSign className={`w-6 h-6 ${budget.value === 'high' ? 'text-emerald-400' : budget.value === 'medium' ? 'text-amber-400' : 'text-slate-400'}`} />
                        <div>
                          <div className="font-semibold text-white">{budget.label}</div>
                          <div className="text-sm text-slate-400">{budget.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2" />
                    جاري الحساب...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 ml-2" />
                    احسب الآن
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Results Page Component
function ResultsPage() {
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const userProfile = useAppStore((state) => state.userProfile);
  const fitnessResults = useAppStore((state) => state.fitnessResults);

  if (!userProfile || !fitnessResults) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">لا توجد نتائج. يرجى حساب السعرات أولاً.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          className="text-slate-400 mb-6"
          onClick={() => setCurrentStep('calculator')}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          تعديل البيانات
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            نتائجك المخصصة
          </Badge>
          <h1 className="text-3xl font-bold mb-2">أهلاً {userProfile.name}! 👋</h1>
          <p className="text-slate-400">إليك تحليل جسمك وخطة السعرات المثالية لك</p>
        </div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border-emerald-500/30">
            <CardContent className="pt-6 text-center">
              <Flame className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm text-slate-400 mb-1">BMR - معدل الأيض الأساسي</div>
              <div className="text-3xl font-bold text-white">{fitnessResults.bmr}</div>
              <div className="text-sm text-slate-400">سعرة/يوم</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-teal-600/20 to-teal-800/20 border-teal-500/30">
            <CardContent className="pt-6 text-center">
              <Zap className="w-10 h-10 text-teal-400 mx-auto mb-2" />
              <div className="text-sm text-slate-400 mb-1">TDEE - معدل الحرق اليومي</div>
              <div className="text-3xl font-bold text-white">{fitnessResults.tdee}</div>
              <div className="text-sm text-slate-400">سعرة/يوم</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border-cyan-500/30">
            <CardContent className="pt-6 text-center">
              <Target className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
              <div className="text-sm text-slate-400 mb-1">السعرات المستهدفة</div>
              <div className="text-3xl font-bold text-white">{fitnessResults.targetCalories}</div>
              <div className="text-sm text-slate-400">سعرة/يوم</div>
            </CardContent>
          </Card>
        </div>

        {/* Macros */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Apple className="w-5 h-5 text-emerald-400" />
              توزيع الماكرونز
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-slate-700/50">
                <div className="text-4xl font-bold text-rose-400">{fitnessResults.protein}g</div>
                <div className="text-slate-400 mt-1">بروتين</div>
                <Progress value={(fitnessResults.protein * 4 / fitnessResults.targetCalories) * 100} className="mt-2 h-2" />
              </div>
              <div className="text-center p-4 rounded-lg bg-slate-700/50">
                <div className="text-4xl font-bold text-amber-400">{fitnessResults.carbs}g</div>
                <div className="text-slate-400 mt-1">كربوهيدرات</div>
                <Progress value={(fitnessResults.carbs * 4 / fitnessResults.targetCalories) * 100} className="mt-2 h-2" />
              </div>
              <div className="text-center p-4 rounded-lg bg-slate-700/50">
                <div className="text-4xl font-bold text-emerald-400">{fitnessResults.fat}g</div>
                <div className="text-slate-400 mt-1">دهون</div>
                <Progress value={(fitnessResults.fat * 9 / fitnessResults.targetCalories) * 100} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-emerald-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              نصائح من أحمد الكوتش
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userProfile.goal === 'cutting' && (
              <>
                <p className="text-slate-300">
                  🎯 عشان توصل لهدفك في التنشيف، لازم تركز على الآتي:
                </p>
                <ul className="text-slate-400 space-y-2 list-disc list-inside">
                  <li>حافظ على نسبة البروتين عالية للحفاظ على عضلاتك</li>
                  <li>قلل الكربوهيدرات تدريجياً مش فجأة</li>
                  <li>زيد الكارديو تدريجياً مع التمرين</li>
                  <li>اشرب 3-4 لتر ماء يومياً</li>
                  <li>نام 7-8 ساعات لتحسين التعافي</li>
                </ul>
              </>
            )}
            {userProfile.goal === 'bulking' && (
              <>
                <p className="text-slate-300">
                  💪 عشان تبني عضلات، اتبع النصائح دي:
                </p>
                <ul className="text-slate-400 space-y-2 list-disc list-inside">
                  <li>كل فائض سعرات معتدل (300-500 سعرة)</li>
                  <li>ركز على الكربوهيدرات المعقدة</li>
                  <li>تمرن بأوزان ثقيلة مع تقدم تدريجي</li>
                  <li>خد راحة كافية بين التمارين</li>
                  <li>تتبع وزنك أسبوعياً</li>
                </ul>
              </>
            )}
            {userProfile.goal === 'maintenance' && (
              <>
                <p className="text-slate-300">
                  ⚖️ للحفاظ على وزنك الحالي:
                </p>
                <ul className="text-slate-400 space-y-2 list-disc list-inside">
                  <li>حافظ على توازن السعرات</li>
                  <li>استمر في التمرين بانتظام</li>
                  <li>راقب وزنك كل أسبوع</li>
                  <li>اضبط السعرات حسب نشاطك</li>
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        {/* WhatsApp Button */}
        <div className="flex justify-center">
          <a 
            href="https://wa.me/201069465855" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              تواصل مع أحمد الكوتش
            </Button>
          </a>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30 mb-8 mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">🔥 محتاج خطة تفصيلية؟</h3>
                <p className="text-slate-300">
                  اشترك الآن واحصل على برنامج تدريب وتغذية مخصص لجسمك وهدفك
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8"
                onClick={() => setCurrentStep('subscription')}
              >
                <Dumbbell className="w-5 h-5 ml-2" />
                اشترك الآن
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Subscription Page Component
function SubscriptionPage() {
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const userId = useAppStore((state) => state.userId);
  const setPaymentStatus = useAppStore((state) => state.setPaymentStatus);
  
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'pro' | 'ultimate'>('basic');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const plans = {
    basic: {
      name: 'الباقة الأساسية',
      price: 150,
      features: [
        'نظام غذائي بسيط',
        'قائمة أكلات أساسية',
        'جدول تمارين بسيط',
        'توصيل خلال 72 ساعة',
      ],
      highlight: 'الأساسية',
    },
    premium: {
      name: 'الباقة الاقتصادية',
      price: 250,
      features: [
        'نظام غذائي مخصص',
        'حساب السعرات والماكرونز',
        'قائمة أكلات مقترحة',
        'جدول تمارين أساسي',
        'توصيل خلال 48 ساعة',
      ],
      highlight: 'الأكثر طلباً',
    },
    pro: {
      name: 'الباقة الاحترافية',
      price: 500,
      features: [
        'برنامج تدريب لمدة شهر',
        'خطة تغذية مخصصة',
        'قائمة أكلات مقترحة',
        'متابعة عبر واتساب',
      ],
      highlight: 'احترافية',
    },
    ultimate: {
      name: 'الباقة الذهبية',
      price: 900,
      features: [
        'برنامج تدريب لمدة 3 شهور',
        'خطة تغذية مخصصة',
        'قائمة أكلات مقترحة',
        'متابعة أسبوعية عبر واتساب',
        'تعديل الخطة شهرياً',
        'دعم 24/7',
      ],
      highlight: 'أفضل قيمة',
    },
  };

  const handleSubmit = async () => {
    if (!receiptFile) {
      toast.error('يرجى رفع صورة الإيصال');
      return;
    }

    if (!userId) {
      toast.error('يرجى حساب السعرات أولاً');
      setCurrentStep('calculator');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('amount', plans[selectedPlan].price.toString());
      formData.append('receipt', receiptFile);

      const response = await fetch('/api/payment', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('حدث خطأ في إرسال الطلب');
      }

      const data = await response.json();
      setPaymentStatus({
        id: data.paymentId,
        status: 'pending',
      });
      
      toast.success('تم إرسال طلبك بنجاح! سيتم مراجعته قريباً');
      setCurrentStep('my-plan');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          className="text-slate-400 mb-6"
          onClick={() => setCurrentStep('landing')}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة للرئيسية
        </Button>

        <div className="text-center mb-8">
          <Dumbbell className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">اشترك الآن</h1>
          <p className="text-slate-400">اختر الباقة المناسبة لك واحصل على برنامجك المخصص</p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {(Object.keys(plans) as Array<keyof typeof plans>).map((key) => (
            <Card 
              key={key}
              className={`cursor-pointer transition-all relative ${
                selectedPlan === key 
                  ? 'bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border-emerald-500 ring-2 ring-emerald-500' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => setSelectedPlan(key)}
            >
              {/* Highlight Badge */}
              {plans[key].highlight && (
                <div className="absolute -top-3 right-4">
                  <Badge className={`${
                    key === 'ultimate' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                      : key === 'pro'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : key === 'premium'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                  } px-3 py-1`}>
                    {plans[key].highlight}
                  </Badge>
                </div>
              )}
              <CardHeader className="pt-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plans[key].name}</CardTitle>
                  {selectedPlan === key && (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  )}
                </div>
                <div className="text-3xl font-bold text-emerald-400">
                  {plans[key].price} <span className="text-base text-slate-400">ج.م</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plans[key].features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Info */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              طريقة الدفع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-white font-semibold mb-2">فودافون كاش</p>
              <p className="text-2xl font-bold text-emerald-400" dir="ltr">01069465855</p>
            </div>
            <p className="text-slate-400 text-sm">
              قم بتحويل المبلغ ثم ارفع صورة الإيصال أدناه
            </p>
          </CardContent>
        </Card>

        {/* Upload Receipt */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              رفع إيصال الدفع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="cursor-pointer">
                {receiptFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                    <p className="text-white">{receiptFile.name}</p>
                    <p className="text-slate-400 text-sm">اضغط لتغيير الصورة</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                    <p className="text-white">اضغط لرفع صورة الإيصال</p>
                    <p className="text-slate-400 text-sm">PNG, JPG, JPEG</p>
                  </div>
                )}
              </label>
            </div>
          </CardContent>
        </Card>

        <Button 
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 text-lg"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 ml-2" />
              إرسال طلب الاشتراك
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// My Plan Page Component
function MyPlanPage() {
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const paymentStatus = useAppStore((state) => state.paymentStatus);
  const userId = useAppStore((state) => state.userId);
  const setPaymentStatus = useAppStore((state) => state.setPaymentStatus);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/payment?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            setPaymentStatus(data);
          }
        } catch (error) {
          console.error('Error fetching payment status:', error);
        }
      }
    };

    fetchPaymentStatus();
    const interval = setInterval(fetchPaymentStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [userId, setPaymentStatus]);

  const getStatusBadge = () => {
    if (!paymentStatus) return null;

    switch (paymentStatus.status) {
      case 'pending':
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            قيد المراجعة
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            تم القبول
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 px-4 py-2">
            <XCircle className="w-4 h-4 mr-2" />
            تم الرفض
          </Badge>
        );
    }
  };

  const getStatusMessage = () => {
    if (!paymentStatus) return null;

    switch (paymentStatus.status) {
      case 'pending':
        return {
          title: 'طلبك قيد المراجعة',
          message: 'يتم مراجعة إيصال الدفع الخاص بك. سيتم الرد عليك خلال 24 ساعة.',
          icon: <Clock className="w-16 h-16 text-amber-400" />,
        };
      case 'approved':
        return {
          title: 'تم قبول طلبك! 🎉',
          message: 'مبروك! يمكنك الآن تحميل برنامجك المخصص.',
          icon: <CheckCircle className="w-16 h-16 text-emerald-400" />,
        };
      case 'rejected':
        return {
          title: 'تم رفض طلبك',
          message: paymentStatus.rejectionReason || 'للأسف تم رفض طلبك. يرجى التواصل معنا للمزيد من التفاصيل.',
          icon: <XCircle className="w-16 h-16 text-rose-400" />,
        };
    }
  };

  const statusInfo = getStatusMessage();

  if (!paymentStatus) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">لا يوجد طلب اشتراك</h2>
            <p className="text-slate-400 mb-4">لم تقم بإرسال طلب اشتراك بعد</p>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-500"
              onClick={() => setCurrentStep('calculator')}
            >
              <Calculator className="w-5 h-5 ml-2" />
              احسب سعراتك أولاً
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button 
          variant="ghost" 
          className="text-slate-400 mb-6"
          onClick={() => setCurrentStep('landing')}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة للرئيسية
        </Button>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-8 text-center">
            {statusInfo?.icon}
            <h1 className="text-2xl font-bold text-white mt-4 mb-2">{statusInfo?.title}</h1>
            <p className="text-slate-400 mb-6">{statusInfo?.message}</p>
            
            <div className="flex justify-center mb-6">
              {getStatusBadge()}
            </div>

            {paymentStatus.status === 'approved' && paymentStatus.pdfUrl && (
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                onClick={() => window.open(paymentStatus.pdfUrl, '_blank')}
              >
                <Download className="w-5 h-5 ml-2" />
                تحميل البرنامج (PDF)
              </Button>
            )}

            {paymentStatus.status === 'rejected' && (
              <div className="space-y-4">
                <a href="https://wa.me/201069465855" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
                    <MessageCircle className="w-5 h-5 ml-2" />
                    تواصل معنا عبر واتساب
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 block mx-auto"
                  onClick={() => setCurrentStep('subscription')}
                >
                  إعادة الاشتراك
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* WhatsApp Support Card */}
        <Card className="bg-gradient-to-r from-green-600/20 to-green-800/20 border-green-500/30 mt-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">تحتاج مساعدة؟</h3>
                  <p className="text-green-300 text-sm">
                    في حالة وجود أي مشاكل، يمكن التواصل مع الكوتش عبر الواتساب
                  </p>
                </div>
              </div>
              <a 
                href="https://wa.me/201069465855" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="w-5 h-5 ml-2" />
                  تواصل عبر واتساب
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Admin Login Page
function AdminLogin() {
  const setAdminToken = useAppStore((state) => state.setAdminToken);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'اسم المستخدم أو كلمة المرور غير صحيحة');
      }

      setAdminToken(data.token);
      setCurrentStep('admin');
      toast.success('تم تسجيل الدخول بنجاح');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <Card className="bg-slate-800/50 border-slate-700 max-w-md w-full">
        <CardHeader className="text-center">
          <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <CardTitle className="text-2xl text-white">لوحة التحكم</CardTitle>
          <CardDescription className="text-slate-400">أدخل بيانات الدخول</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">اسم المستخدم</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-slate-700 border-slate-600 text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              'دخول'
            )}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-slate-400"
            onClick={() => setCurrentStep('landing')}
          >
            العودة للرئيسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard() {
  const adminToken = useAppStore((state) => state.adminToken);
  const setAdminToken = useAppStore((state) => state.setAdminToken);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  
  const [stats, setStats] = useState({ users: 0, pending: 0, approved: 0 });
  const [payments, setPayments] = useState<Array<{
    id: string;
    userId: string;
    amount: number;
    status: string;
    receiptImage: string;
    rejectionReason?: string;
    pdfFile?: string;
    user: { 
      name: string; 
      email: string;
      phone?: string;
      location?: string;
      fitnessProfile?: {
        height: number;
        weight: number;
        age: number;
        gender: string;
        activityLevel: string;
        goal: string;
        proteinBudget: string | null;
        bmr: number | null;
        tdee: number | null;
        targetCalories: number | null;
        protein: number | null;
        carbs: number | null;
        fat: number | null;
      };
    };
    createdAt: string;
  }>>([]);
  const [users, setUsers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    createdAt: string;
    fitnessProfile?: {
      goal: string;
      weight: number;
      height: number;
    };
  }>>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'users'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const handleDeleteAllUsers = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع المشتركين؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/delete-user?token=${adminToken}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('حدث خطأ');

      toast.success('تم حذف جميع المشتركين');
      setStats({ users: 0, pending: 0, approved: 0 });
      setPayments([]);
      setUsers([]);
    } catch (error) {
      toast.error('حدث خطأ في حذف المشتركين');
    }
  };

  const handleDeleteUser = async (userIdToDelete: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: adminToken, userId: userIdToDelete }),
      });

      if (!response.ok) throw new Error('حدث خطأ');

      toast.success('تم حذف المستخدم');
      setUsers(users.filter(u => u.id !== userIdToDelete));
      setPayments(payments.filter(p => p.userId !== userIdToDelete));
    } catch (error) {
      toast.error('حدث خطأ في حذف المستخدم');
    }
  };

  useEffect(() => {
    if (!adminToken) {
      setCurrentStep('admin-login');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, paymentsRes, usersRes] = await Promise.all([
          fetch(`/api/admin/stats?token=${adminToken}`),
          fetch(`/api/admin/payments?token=${adminToken}`),
          fetch(`/api/admin/users?token=${adminToken}`),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (paymentsRes.ok) setPayments(await paymentsRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [adminToken, setCurrentStep]);

  const handleApprove = async (paymentId: string) => {
    if (!pdfFile) {
      toast.error('يرجى رفع ملف PDF للبرنامج');
      return;
    }

    // Check if file is likely a PDF
    if (!pdfFile.name.toLowerCase().endsWith('.pdf')) {
      toast.error('يرجى اختيار ملف بامتداد .pdf');
      return;
    }

    setIsApproving(true);
    const formData = new FormData();
    formData.append('token', adminToken!);
    formData.append('paymentId', paymentId);
    formData.append('pdf', pdfFile);

    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ');
      }

      toast.success('تم قبول الطلب ورفع البرنامج بنجاح!');
      setSelectedPayment(null);
      setPdfFile(null);
      
      // Refresh all data
      const [statsRes, paymentsRes] = await Promise.all([
        fetch(`/api/admin/stats?token=${adminToken}`),
        fetch(`/api/admin/payments?token=${adminToken}`),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (paymentsRes.ok) setPayments(await paymentsRes.json());
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'حدث خطأ في قبول الطلب';
      toast.error(errorMsg);
      console.error('Approve error:', error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    setCurrentStep('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-400" />
            <h1 className="text-xl font-bold">لوحة تحكم الأدمن</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-slate-600 text-slate-300">
            <LogOut className="w-4 h-4 ml-2" />
            خروج
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            className={activeTab === 'overview' ? 'bg-emerald-500 text-white' : 'border-slate-600 text-slate-300'}
            onClick={() => setActiveTab('overview')}
          >
            <Activity className="w-4 h-4 ml-2" />
            نظرة عامة
          </Button>
          <Button
            variant={activeTab === 'payments' ? 'default' : 'outline'}
            className={activeTab === 'payments' ? 'bg-emerald-500 text-white' : 'border-slate-600 text-slate-300'}
            onClick={() => setActiveTab('payments')}
          >
            <DollarSign className="w-4 h-4 ml-2" />
            طلبات الاشتراك
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            className={activeTab === 'users' ? 'bg-emerald-500 text-white' : 'border-slate-600 text-slate-300'}
            onClick={() => setActiveTab('users')}
          >
            <Users className="w-4 h-4 ml-2" />
            المستخدمين
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white">{stats.users}</div>
                  <div className="text-slate-400">إجمالي المستخدمين</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <Clock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white">{stats.pending}</div>
                  <div className="text-slate-400">طلبات معلقة</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white">{stats.approved}</div>
                  <div className="text-slate-400">مشتركين مفعلين</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Delete All Users Button */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">حذف جميع المشتركين</h3>
                    <p className="text-slate-400 text-sm">سيتم حذف جميع البيانات والطلبات نهائياً</p>
                  </div>
                  <Button 
                    variant="destructive"
                    onClick={handleDeleteAllUsers}
                  >
                    <XCircle className="w-4 h-4 ml-2" />
                    حذف الكل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {payments.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">لا توجد طلبات اشتراك</p>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment) => (
                <Card key={payment.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                          <User className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{payment.user.name}</p>
                          <p className="text-sm text-slate-400">{payment.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="font-bold text-emerald-400">{payment.amount} ج.م</p>
                          <p className="text-xs text-slate-400">{new Date(payment.createdAt).toLocaleDateString('ar-EG')}</p>
                        </div>
                        {payment.status === 'pending' && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                            قيد المراجعة
                          </Badge>
                        )}
                        {payment.status === 'approved' && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            مقبول
                          </Badge>
                        )}
                        {payment.status === 'rejected' && (
                          <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">
                            مرفوض
                          </Badge>
                        )}
                        {payment.status === 'pending' && (
                          <Button 
                            size="sm" 
                            className="bg-emerald-500 hover:bg-emerald-600"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            مراجعة
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-right py-3 px-4 text-slate-400 font-normal">الاسم</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-normal">البريد</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-normal">الهاتف</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-normal">الهدف</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-normal">تاريخ التسجيل</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-normal">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-white">{user.name}</td>
                        <td className="py-3 px-4 text-slate-300">{user.email}</td>
                        <td className="py-3 px-4 text-slate-300">{user.phone || '-'}</td>
                        <td className="py-3 px-4">
                          {user.fitnessProfile && (
                            <Badge className="bg-slate-700 text-slate-300">
                              {GOAL_LABELS[user.fitnessProfile.goal as Goal]?.label || user.fitnessProfile.goal}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-3 px-4">
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <XCircle className="w-4 h-4 ml-1" />
                            حذف
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Review Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-xl">مراجعة طلب الاشتراك</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* صورة الإيصال */}
                <div className="space-y-2">
                  <Label>صورة الإيصال</Label>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-700">
                    <img
                      src={selectedPayment.receiptImage}
                      alt="إيصال الدفع"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* معلومات المستخدم */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>معلومات المستخدم</Label>
                    <div className="bg-slate-700/50 rounded-lg p-3 space-y-1">
                      <p className="text-white"><span className="text-slate-400">الاسم:</span> {selectedPayment.user.name}</p>
                      <p className="text-white"><span className="text-slate-400">البريد:</span> {selectedPayment.user.email}</p>
                      <p className="text-white"><span className="text-slate-400">الهاتف:</span> {selectedPayment.user.phone || '-'}</p>
                      <p className="text-white"><span className="text-slate-400">المبلغ:</span> {selectedPayment.amount} ج.م</p>
                    </div>
                  </div>

                  {/* الباقة */}
                  <div className="space-y-2">
                    <Label>نوع الباقة</Label>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <Badge className={
                        selectedPayment.amount <= 150 ? 'bg-slate-500/20 text-slate-400' :
                        selectedPayment.amount <= 250 ? 'bg-blue-500/20 text-blue-400' :
                        selectedPayment.amount <= 500 ? 'bg-purple-500/20 text-purple-400' :
                        'bg-amber-500/20 text-amber-400'
                      }>
                        {selectedPayment.amount <= 150 ? 'الباقة الأساسية (150 ج.م)' :
                         selectedPayment.amount <= 250 ? 'الباقة الاقتصادية (250 ج.م)' :
                         selectedPayment.amount <= 500 ? 'الباقة الاحترافية (500 ج.م)' :
                         'الباقة الذهبية (900 ج.م)'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* معلومات الجسم والبروتين */}
              {selectedPayment.user.fitnessProfile && (
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    تحليل الجسم والماكرونز
                  </Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* قياسات الجسم */}
                    <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-white mb-2">قياسات الجسم</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-slate-300"><span className="text-slate-500">الطول:</span> {selectedPayment.user.fitnessProfile.height} سم</p>
                        <p className="text-slate-300"><span className="text-slate-500">الوزن:</span> {selectedPayment.user.fitnessProfile.weight} كجم</p>
                        <p className="text-slate-300"><span className="text-slate-500">العمر:</span> {selectedPayment.user.fitnessProfile.age} سنة</p>
                        <p className="text-slate-300"><span className="text-slate-500">الجنس:</span> {selectedPayment.user.fitnessProfile.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                        <p className="text-slate-300"><span className="text-slate-500">الهدف:</span> {GOAL_LABELS[selectedPayment.user.fitnessProfile.goal as Goal]?.label}</p>
                        <p className="text-slate-300"><span className="text-slate-500">النشاط:</span> {ACTIVITY_LABELS[selectedPayment.user.fitnessProfile.activityLevel as ActivityLevel]?.split(' - ')[0]}</p>
                      </div>
                    </div>

                    {/* السعرات والماكرونز */}
                    <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-white mb-2">السعرات والماكرونز</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">BMR:</span>
                          <span className="text-white font-medium">{selectedPayment.user.fitnessProfile.bmr || '-'} سعرة</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">TDEE:</span>
                          <span className="text-white font-medium">{selectedPayment.user.fitnessProfile.tdee || '-'} سعرة</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">السعرات المستهدفة:</span>
                          <span className="text-emerald-400 font-bold">{selectedPayment.user.fitnessProfile.targetCalories || '-'} سعرة</span>
                        </div>
                        <Separator className="bg-slate-600 my-2" />
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-rose-400 font-bold">{selectedPayment.user.fitnessProfile.protein || '-'}g</p>
                            <p className="text-xs text-slate-500">بروتين</p>
                          </div>
                          <div>
                            <p className="text-amber-400 font-bold">{selectedPayment.user.fitnessProfile.carbs || '-'}g</p>
                            <p className="text-xs text-slate-500">كارب</p>
                          </div>
                          <div>
                            <p className="text-emerald-400 font-bold">{selectedPayment.user.fitnessProfile.fat || '-'}g</p>
                            <p className="text-xs text-slate-500">دهون</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* حالة البروتين */}
                  {selectedPayment.user.fitnessProfile.proteinBudget && (
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className={`w-5 h-5 ${
                          selectedPayment.user.fitnessProfile.proteinBudget === 'high' ? 'text-emerald-400' :
                          selectedPayment.user.fitnessProfile.proteinBudget === 'medium' ? 'text-amber-400' : 'text-slate-400'
                        }`} />
                        <span className="text-slate-300">حالة البروتين: </span>
                        <Badge className={
                          selectedPayment.user.fitnessProfile.proteinBudget === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                          selectedPayment.user.fitnessProfile.proteinBudget === 'medium' ? 'bg-amber-500/20 text-amber-400' : 
                          'bg-slate-500/20 text-slate-400'
                        }>
                          {selectedPayment.user.fitnessProfile.proteinBudget === 'high' ? 'ميزانية جيدة' :
                           selectedPayment.user.fitnessProfile.proteinBudget === 'medium' ? 'ميزانية متوسطة' : 'ميزانية محدودة'}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* نظام غذائي مقترح */}
              {selectedPayment.user.fitnessProfile && selectedPayment.user.fitnessProfile.targetCalories && (
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-amber-400 flex items-center gap-2">
                    <Apple className="w-5 h-5" />
                    نظام غذائي مقترح
                  </Label>
                  <div className="bg-slate-700/50 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-600/50">
                        <tr>
                          <th className="p-3 text-right text-slate-300">الوجبة</th>
                          <th className="p-3 text-right text-slate-300">البروتين</th>
                          <th className="p-3 text-right text-slate-300">الكارب</th>
                          <th className="p-3 text-right text-slate-300">الدهون</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const p = selectedPayment.user.fitnessProfile.protein || 0;
                          const c = selectedPayment.user.fitnessProfile.carbs || 0;
                          const f = selectedPayment.user.fitnessProfile.fat || 0;
                          const budget = selectedPayment.user.fitnessProfile.proteinBudget || 'medium';
                          
                          // توزيع الوجبات حسب الميزانية
                          let meals;
                          if (budget === 'high') {
                            meals = [
                              { name: 'الفطور', protein: Math.round(p * 0.25), carbs: Math.round(c * 0.25), fat: Math.round(f * 0.25) },
                              { name: 'سناكة', protein: Math.round(p * 0.1), carbs: Math.round(c * 0.1), fat: Math.round(f * 0.1) },
                              { name: 'الغداء', protein: Math.round(p * 0.3), carbs: Math.round(c * 0.3), fat: Math.round(f * 0.3) },
                              { name: 'سناكة', protein: Math.round(p * 0.1), carbs: Math.round(c * 0.1), fat: Math.round(f * 0.1) },
                              { name: 'العشاء', protein: Math.round(p * 0.25), carbs: Math.round(c * 0.25), fat: Math.round(f * 0.25) },
                            ];
                          } else if (budget === 'medium') {
                            meals = [
                              { name: 'الفطور', protein: Math.round(p * 0.3), carbs: Math.round(c * 0.3), fat: Math.round(f * 0.3) },
                              { name: 'الغداء', protein: Math.round(p * 0.35), carbs: Math.round(c * 0.35), fat: Math.round(f * 0.35) },
                              { name: 'العشاء', protein: Math.round(p * 0.35), carbs: Math.round(c * 0.35), fat: Math.round(f * 0.35) },
                            ];
                          } else {
                            meals = [
                              { name: 'الفطور', protein: Math.round(p * 0.35), carbs: Math.round(c * 0.4), fat: Math.round(f * 0.3) },
                              { name: 'الغداء', protein: Math.round(p * 0.35), carbs: Math.round(c * 0.35), fat: Math.round(f * 0.35) },
                              { name: 'العشاء', protein: Math.round(p * 0.3), carbs: Math.round(c * 0.25), fat: Math.round(f * 0.35) },
                            ];
                          }
                          
                          return meals.map((meal, i) => (
                            <tr key={i} className="border-t border-slate-600">
                              <td className="p-3 text-white font-medium">{meal.name}</td>
                              <td className="p-3 text-rose-400">{meal.protein}g</td>
                              <td className="p-3 text-amber-400">{meal.carbs}g</td>
                              <td className="p-3 text-emerald-400">{meal.fat}g</td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>

                  {/* اقتراحات للكوتش */}
                  <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      اقتراحات للبرنامج
                    </h4>
                    <div className="text-sm text-slate-300 space-y-2">
                      {selectedPayment.user.fitnessProfile.goal === 'cutting' && (
                        <>
                          <p>• البروتين المثالي: {Math.round((selectedPayment.user.fitnessProfile.weight * 2.2))}g - {Math.round((selectedPayment.user.fitnessProfile.weight * 2.5))}g يومياً</p>
                          <p>• يُنصح بتقليل الكارب تدريجياً مع زيادة الكارديو</p>
                          <p>• شرب 3-4 لتر ماء يومياً</p>
                        </>
                      )}
                      {selectedPayment.user.fitnessProfile.goal === 'bulking' && (
                        <>
                          <p>• البروتين المثالي: {Math.round((selectedPayment.user.fitnessProfile.weight * 1.8))}g - {Math.round((selectedPayment.user.fitnessProfile.weight * 2.2))}g يومياً</p>
                          <p>• فائض سعرات 300-500 سعرة فوق TDEE</p>
                          <p>• التركيز على التمارين المركبة</p>
                        </>
                      )}
                      {selectedPayment.user.fitnessProfile.goal === 'maintenance' && (
                        <>
                          <p>• الحفاظ على السعرات عند مستوى TDEE</p>
                          <p>• الاستمرار في نظام التمرين الحالي</p>
                          <p>• متابعة الوزن أسبوعياً</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* رفع ملف PDF */}
              <div className="space-y-2">
                <Label>رفع ملف PDF للبرنامج</Label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                        toast.error('يرجى اختيار ملف PDF صالح فقط');
                        e.target.value = '';
                        return;
                      }
                      setPdfFile(file);
                    }
                  }}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="block">
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-500 transition-colors">
                    {pdfFile ? (
                      <div className="space-y-1">
                        <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
                        <p className="text-emerald-400 font-medium">{pdfFile.name}</p>
                        <p className="text-slate-500 text-xs">اضغط لتغيير الملف</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-slate-300">اضغط لرفع ملف PDF</p>
                        <p className="text-slate-500 text-xs">يجب أن يكون ملف PDF حقيقي</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => handleApprove(selectedPayment.id)}
                  disabled={isApproving}
                >
                  {isApproving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 ml-2" />
                  )}
                  {isApproving ? 'جاري القبول...' : 'قبول وإرسال البرنامج'}
                </Button>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-slate-600 text-slate-300"
                onClick={() => {
                  setSelectedPayment(null);
                  setPdfFile(null);
                }}
              >
                إلغاء
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-emerald-400" />
            <span className="text-xl font-bold text-white">TechnoFit</span>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-4">
            <a 
              href="https://www.facebook.com/الصحيح" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://wa.me/201069465855" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://www.tiktok.com/@technofit90" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-black transition-colors"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </a>
            <a 
              href="tel:+201069465855" 
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
            >
              <Phone className="w-5 h-5 text-white" />
            </a>
          </div>

          <div className="text-center">
            <p className="text-slate-400 text-sm">
              تم التصميم بواسطة <span className="text-emerald-400 font-semibold">أحمد الكوتش</span>
            </p>
            <p className="text-slate-500 text-xs mt-1">
              احصائي تغذية معتمد
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
export default function Home() {
  const currentStep = useAppStore((state) => state.currentStep);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showHeader = currentStep !== 'admin' && currentStep !== 'admin-login';

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      {/* Header */}
      {showHeader && (
        <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-8 h-8 text-emerald-400" />
              <span className="text-xl font-bold text-white">TechnoFit</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button 
                variant="ghost" 
                className="text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => setCurrentStep('landing')}
              >
                الرئيسية
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => setCurrentStep('calculator')}
              >
                حاسبة السعرات
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => setCurrentStep('subscription')}
              >
                الاشتراك
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => setCurrentStep('my-plan')}
              >
                برنامجي
              </Button>
              <Button 
                variant="outline" 
                className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                onClick={() => setCurrentStep('admin-login')}
              >
                <Shield className="w-4 h-4 ml-2" />
                الأدمن
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-slate-800 border-t border-slate-700 py-4">
              <nav className="container mx-auto px-4 flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  className="text-slate-300 hover:text-white hover:bg-slate-700 justify-start"
                  onClick={() => { setCurrentStep('landing'); setMobileMenuOpen(false); }}
                >
                  الرئيسية
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-slate-300 hover:text-white hover:bg-slate-700 justify-start"
                  onClick={() => { setCurrentStep('calculator'); setMobileMenuOpen(false); }}
                >
                  حاسبة السعرات
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-slate-300 hover:text-white hover:bg-slate-700 justify-start"
                  onClick={() => { setCurrentStep('subscription'); setMobileMenuOpen(false); }}
                >
                  الاشتراك
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-slate-300 hover:text-white hover:bg-slate-700 justify-start"
                  onClick={() => { setCurrentStep('my-plan'); setMobileMenuOpen(false); }}
                >
                  برنامجي
                </Button>
                <Button 
                  variant="outline" 
                  className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 justify-start"
                  onClick={() => { setCurrentStep('admin-login'); setMobileMenuOpen(false); }}
                >
                  <Shield className="w-4 h-4 ml-2" />
                  الأدمن
                </Button>
              </nav>
            </div>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {currentStep === 'landing' && <LandingPage />}
        {currentStep === 'calculator' && <CalculatorForm />}
        {currentStep === 'results' && <ResultsPage />}
        {currentStep === 'subscription' && <SubscriptionPage />}
        {currentStep === 'my-plan' && <MyPlanPage />}
        {currentStep === 'admin-login' && <AdminLogin />}
        {currentStep === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      {showHeader && <Footer />}
    </div>
  );
}
