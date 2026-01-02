// خدمة إدارة الاشتراكات
export class SubscriptionService {
  
  // الحصول على معلومات الاشتراك الحالي
  static getCurrentSubscription() {
    try {
      const subscription = localStorage.getItem('userSubscription');
      return subscription ? JSON.parse(subscription) : null;
    } catch (error) {
      console.error('خطأ في قراءة بيانات الاشتراك:', error);
      return null;
    }
  }

  // التحقق من صحة الاشتراك
  static isSubscriptionValid(subscription) {
    if (!subscription) return false;
    
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    
    return endDate > now && (subscription.status === 'active' || subscription.status === 'trial');
  }

  // التحقق من وجود اشتراك نشط
  static hasActiveSubscription() {
    const subscription = this.getCurrentSubscription();
    return this.isSubscriptionValid(subscription);
  }

  // التحقق من نوع الاشتراك
  static getSubscriptionType() {
    const subscription = this.getCurrentSubscription();
    if (!subscription || !this.isSubscriptionValid(subscription)) {
      return 'free';
    }
    return subscription.plan;
  }

  // التحقق من حالة الاشتراك
  static getSubscriptionStatus() {
    const subscription = this.getCurrentSubscription();
    if (!subscription) return 'none';
    
    if (!this.isSubscriptionValid(subscription)) {
      return 'expired';
    }
    
    return subscription.status;
  }

  // حساب الأيام المتبقية
  static getDaysRemaining() {
    const subscription = this.getCurrentSubscription();
    if (!subscription || !this.isSubscriptionValid(subscription)) {
      return 0;
    }
    
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  // التحقق من إمكانية الوصول لأداة معينة
  static canAccessTool(toolId) {
    const subscription = this.getCurrentSubscription();
    
    // الأدوات المجانية (متاحة للجميع)
    const freeTools = [1, 2, 3, 4, 5, 18, 19, 22, 23, 24, 25]; // أدوات أساسية + مستندات قانونية + خطط الاشتراك
    
    // إذا كانت الأداة مجانية
    if (freeTools.includes(toolId)) {
      return true;
    }
    
    // إذا كان لديه اشتراك نشط (مجاني أو مدفوع)
    // التجربة المجانية لمدة 30 يوم توفر وصول كامل إلى جميع 50 أداة
    if (this.hasActiveSubscription()) {
      return true;
    }
    
    return false;
  }

  // الحصول على قائمة الأدوات المتاحة
  static getAvailableTools(allTools) {
    const subscriptionType = this.getSubscriptionType();
    
    return allTools.map(tool => {
      const canAccess = this.canAccessTool(tool.id);
      return {
        ...tool,
        isLocked: !canAccess,
        requiresPremium: !canAccess && subscriptionType === 'free'
      };
    });
  }

  // إنشاء اشتراك تجريبي
  static createTrialSubscription(userInfo) {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);
    
    const subscription = {
      plan: 'premium',
      status: 'trial',
      startDate: new Date().toISOString(),
      endDate: trialEndDate.toISOString(),
      trialDays: 30,
      userInfo: userInfo,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('userSubscription', JSON.stringify(subscription));
    return subscription;
  }

  // إنشاء اشتراك مدفوع
  static createPaidSubscription(userInfo, planId = 'premium') {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // شهر واحد
    
    const subscription = {
      plan: planId,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
      userInfo: userInfo,
      paymentDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('userSubscription', JSON.stringify(subscription));
    return subscription;
  }

  // إلغاء الاشتراك
  static cancelSubscription() {
    localStorage.removeItem('userSubscription');
    return true;
  }

  // تجديد الاشتراك
  static renewSubscription() {
    const currentSubscription = this.getCurrentSubscription();
    if (!currentSubscription) return false;
    
    const newEndDate = new Date();
    newEndDate.setMonth(newEndDate.getMonth() + 1);
    
    const updatedSubscription = {
      ...currentSubscription,
      status: 'active',
      endDate: newEndDate.toISOString(),
      renewedAt: new Date().toISOString()
    };
    
    localStorage.setItem('userSubscription', JSON.stringify(updatedSubscription));
    return updatedSubscription;
  }

  // إحصائيات الاستخدام
  static getUsageStats() {
    const subscription = this.getCurrentSubscription();
    if (!subscription) return null;
    
    const usage = JSON.parse(localStorage.getItem('toolUsage') || '{}');
    const today = new Date().toDateString();
    const todayUsage = usage[today] || 0;
    
    return {
      todayUsage,
      subscriptionType: subscription.plan,
      daysRemaining: this.getDaysRemaining(),
      isUnlimited: this.hasActiveSubscription()
    };
  }

  // تسجيل استخدام أداة
  static recordToolUsage(toolId) {
    const today = new Date().toDateString();
    const usage = JSON.parse(localStorage.getItem('toolUsage') || '{}');
    
    usage[today] = (usage[today] || 0) + 1;
    localStorage.setItem('toolUsage', JSON.stringify(usage));
    
    // تنظيف البيانات القديمة (الاحتفاظ بآخر 30 يوم فقط)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    Object.keys(usage).forEach(date => {
      if (new Date(date) < thirtyDaysAgo) {
        delete usage[date];
      }
    });
    
    localStorage.setItem('toolUsage', JSON.stringify(usage));
  }

  // التحقق من حد الاستخدام اليومي للمستخدمين المجانيين
  static checkDailyLimit() {
    const subscriptionType = this.getSubscriptionType();
    
    // المستخدمون المميزون لا يوجد لديهم حد
    if (subscriptionType === 'premium') {
      return { allowed: true, remaining: -1 };
    }
    
    // المستخدمون المجانيون لديهم حد 20 استخدام يومياً
    const today = new Date().toDateString();
    const usage = JSON.parse(localStorage.getItem('toolUsage') || '{}');
    const todayUsage = usage[today] || 0;
    const dailyLimit = 20;
    
    return {
      allowed: todayUsage < dailyLimit,
      remaining: Math.max(0, dailyLimit - todayUsage),
      limit: dailyLimit,
      used: todayUsage
    };
  }

  // الحصول على رسالة حالة الاشتراك
  static getStatusMessage() {
    const subscription = this.getCurrentSubscription();
    
    if (!subscription) {
      return {
        type: 'info',
        message: 'أنت تستخدم النسخة المجانية. ترقى للحصول على جميع المميزات!'
      };
    }
    
    if (!this.isSubscriptionValid(subscription)) {
      return {
        type: 'warning',
        message: 'انتهت صلاحية اشتراكك. جدد الآن لمواصلة الاستفادة من جميع المميزات.'
      };
    }
    
    const daysRemaining = this.getDaysRemaining();
    
    if (subscription.status === 'trial') {
      if (daysRemaining <= 3) {
        return {
          type: 'warning',
          message: `تنتهي تجربتك المجانية خلال ${daysRemaining} أيام. اشترك الآن لمواصلة الاستفادة!`
        };
      }
      return {
        type: 'success',
        message: `تجربة مجانية نشطة - ${daysRemaining} يوم متبقي`
      };
    }
    
    if (daysRemaining <= 7) {
      return {
        type: 'warning',
        message: `ينتهي اشتراكك خلال ${daysRemaining} أيام. جدد الآن!`
      };
    }
    
    return {
      type: 'success',
      message: `اشتراك نشط - ${daysRemaining} يوم متبقي`
    };
  }
}
