import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { 
  X, 
  Crown, 
  Check, 
  Star, 
  Calendar, 
  CreditCard,
  Gift,
  Zap,
  Users,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SubscriptionPlan = ({ onClose }) => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  // تحميل معلومات الاشتراك الحالي
  useEffect(() => {
    const subscription = localStorage.getItem('userSubscription');
    if (subscription) {
      setCurrentSubscription(JSON.parse(subscription));
    }
  }, []);

  // خطط الاشتراك
  const plans = [
    {
      id: 'free',
      name: 'المجاني',
      price: 0,
      period: 'دائماً',
      description: 'للاستخدام الأساسي',
      features: [
        'الوصول إلى 10 أدوات أساسية',
        'استخدام محدود يومياً',
        'دعم المجتمع',
        'تحديثات أساسية'
      ],
      limitations: [
        'لا يشمل الأدوات المتقدمة',
        'حد أقصى 20 استخدام يومياً',
        'لا يوجد دعم مباشر'
      ],
      color: 'bg-gray-50 border-gray-200',
      buttonColor: 'outline',
      icon: Users
    },
    {
      id: 'premium',
      name: 'المميز',
      price: 29,
      period: 'شهرياً',
      description: 'للمستخدمين المحترفين',
      trialDays: 30,
      features: [
        'الوصول إلى جميع الـ 50 أداة',
        'استخدام غير محدود',
        'دعم فني مباشر 24/7',
        'تحديثات فورية',
        'أدوات ذكية متقدمة',
        'تخزين سحابي للإعدادات',
        'تصدير النتائج بصيغ متعددة',
        'أولوية في الميزات الجديدة'
      ],
      limitations: [],
      color: 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200',
      buttonColor: 'default',
      icon: Crown,
      popular: true
    }
  ];

  // معالج بدء التجربة المجانية
  const handleStartTrial = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30);
      
      const subscription = {
        plan: 'premium',
        status: 'trial',
        startDate: new Date().toISOString(),
        endDate: trialEndDate.toISOString(),
        trialDays: 30,
        userInfo: userInfo
      };
      
      localStorage.setItem('userSubscription', JSON.stringify(subscription));
      setCurrentSubscription(subscription);
      setIsProcessing(false);
      
      alert('تم تفعيل التجربة المجانية لمدة 30 يوماً! يمكنك الآن الوصول إلى جميع الأدوات المميزة.');
    }, 2000);
  };

  // معالج الاشتراك المدفوع
  const handleSubscribe = () => {
    if (!userInfo.name || !userInfo.email) {
      alert('يرجى ملء المعلومات المطلوبة');
      return;
    }

    setIsProcessing(true);
    
    // محاكاة عملية الدفع
    setTimeout(() => {
      const subscription = {
        plan: selectedPlan,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        userInfo: userInfo
      };
      
      localStorage.setItem('userSubscription', JSON.stringify(subscription));
      setCurrentSubscription(subscription);
      setIsProcessing(false);
      
      alert('تم تفعيل الاشتراك بنجاح! مرحباً بك في العضوية المميزة.');
    }, 3000);
  };

  // حساب الأيام المتبقية
  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // إذا كان لديه اشتراك نشط
  if (currentSubscription) {
    const daysRemaining = getDaysRemaining(currentSubscription.endDate);
    const isExpired = daysRemaining <= 0;
    
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Crown className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">حالة الاشتراك</h1>
              <p className="text-muted-foreground">إدارة اشتراكك الحالي</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <Card className={isExpired ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className={`h-6 w-6 ${isExpired ? 'text-red-500' : 'text-green-500'}`} />
                <div>
                  <CardTitle className="flex items-center gap-2">
                    الاشتراك المميز
                    <Badge variant={isExpired ? "destructive" : "default"}>
                      {isExpired ? 'منتهي الصلاحية' : currentSubscription.status === 'trial' ? 'تجربة مجانية' : 'نشط'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {isExpired 
                      ? 'انتهت صلاحية اشتراكك' 
                      : `${daysRemaining} يوم متبقي`
                    }
                  </CardDescription>
                </div>
              </div>
              {!isExpired && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{daysRemaining}</p>
                  <p className="text-sm text-muted-foreground">يوم متبقي</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">معلومات الاشتراك</h4>
                <p className="text-sm text-muted-foreground">تاريخ البداية: {new Date(currentSubscription.startDate).toLocaleDateString('ar-SA')}</p>
                <p className="text-sm text-muted-foreground">تاريخ الانتهاء: {new Date(currentSubscription.endDate).toLocaleDateString('ar-SA')}</p>
                <p className="text-sm text-muted-foreground">الحالة: {currentSubscription.status === 'trial' ? 'تجربة مجانية' : 'مدفوع'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">المميزات المتاحة</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 50 أداة كاملة</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> استخدام غير محدود</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> دعم فني مباشر</li>
                </ul>
              </div>
            </div>
            
            {isExpired && (
              <div className="mt-4 p-4 bg-red-100 rounded-lg">
                <p className="text-red-700 font-medium">انتهت صلاحية اشتراكك</p>
                <p className="text-red-600 text-sm mt-1">لمواصلة الاستفادة من جميع المميزات، يرجى تجديد اشتراكك.</p>
                <Button 
                  className="mt-3" 
                  onClick={() => {
                    localStorage.removeItem('userSubscription');
                    setCurrentSubscription(null);
                  }}
                >
                  تجديد الاشتراك
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Crown className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">خطط الاشتراك</h1>
            <p className="text-muted-foreground">اختر الخطة المناسبة لك</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* إعلان العرض الخاص */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Gift className="h-12 w-12" />
              <div>
                <h3 className="text-xl font-bold">عرض خاص - تجربة مجانية!</h3>
                <p className="text-purple-100">احصل على 30 يوماً مجاناً للوصول إلى جميع الأدوات المميزة</p>
              </div>
            </div>
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* خطط الاشتراك */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          return (
            <Card 
              key={plan.id}
              className={`relative ${plan.color} ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''} cursor-pointer transition-all duration-200 hover:shadow-lg`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    الأكثر شعبية
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PlanIcon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                  </div>
                  {selectedPlan === plan.id && (
                    <Check className="h-6 w-6 text-primary" />
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{plan.price === 0 ? 'مجاني' : `$${plan.price}`}</span>
                  {plan.price > 0 && <span className="text-muted-foreground">/ {plan.period}</span>}
                </div>
                
                {plan.trialDays && (
                  <Badge variant="secondary" className="w-fit">
                    <Clock className="h-3 w-3 mr-1" />
                    تجربة مجانية {plan.trialDays} يوم
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">المميزات المشمولة:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">القيود:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-red-600">
                            <X className="h-4 w-4 flex-shrink-0" />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* نموذج معلومات المستخدم */}
      {selectedPlan === 'premium' && (
        <Card>
          <CardHeader>
            <CardTitle>معلومات التسجيل</CardTitle>
            <CardDescription>أدخل معلوماتك لبدء التجربة المجانية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                <Input
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                <Input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">رقم الهاتف (اختياري)</label>
              <Input
                value={userInfo.phone}
                onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+966 50 123 4567"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* أزرار الإجراء */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {selectedPlan === 'premium' ? (
              <>
                <Button 
                  size="lg" 
                  onClick={handleStartTrial}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري التفعيل...
                    </>
                  ) : (
                    <>
                      <Gift className="h-5 w-5" />
                      بدء التجربة المجانية (30 يوم)
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  اشتراك مباشر ($29/شهر)
                </Button>
              </>
            ) : (
              <Button size="lg" variant="outline" disabled>
                <Users className="h-5 w-5 mr-2" />
                الخطة الحالية
              </Button>
            )}
          </div>
          
          <div className="text-center mt-4 text-sm text-muted-foreground">
            <p>• لا توجد رسوم خفية • إلغاء في أي وقت • دعم فني 24/7</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlan;
