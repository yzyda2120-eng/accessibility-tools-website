import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { X, Upload, Code, Eye, CheckCircle, AlertCircle, Play, Save, FileCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DeveloperToolPublisher = ({ onClose }) => {
  const { t } = useTranslation();
  const [toolData, setToolData] = useState({
    name: '',
    description: '',
    category: '',
    code: '',
    icon: 'Code',
    author: '',
    version: '1.0.0',
    tags: [],
    visibility: 'private', // private, public, unlisted
    allowFork: false,
    allowEdit: false,
    developerId: null
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [developerInfo, setDeveloperInfo] = useState(null);
  
  const [currentTag, setCurrentTag] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewComponent, setPreviewComponent] = useState(null);

  // فئات الأدوات المتاحة
  const categories = [
    { value: 'basic', label: 'أدوات أساسية' },
    { value: 'smart', label: 'أدوات ذكية' },
    { value: 'assistance', label: 'أدوات المساعدة' },
    { value: 'navigation', label: 'أدوات التنقل' },
    { value: 'braille', label: 'أدوات برايل' },
    { value: 'custom', label: 'أدوات مخصصة' }
  ];

  // الأيقونات المتاحة
  const availableIcons = [
    'Code', 'Wrench', 'Settings', 'Zap', 'Star', 'Heart', 'Shield', 'Lock',
    'Key', 'Search', 'Filter', 'Download', 'Upload', 'Share', 'Copy', 'Edit'
  ];

  // نظام المصادقة البسيط
  useEffect(() => {
    const savedDeveloper = localStorage.getItem('currentDeveloper');
    if (savedDeveloper) {
      const developer = JSON.parse(savedDeveloper);
      setDeveloperInfo(developer);
      setIsAuthenticated(true);
      setToolData(prev => ({ ...prev, author: developer.name, developerId: developer.id }));
    }
  }, []);

  const authenticateDeveloper = (name, email) => {
    const developerId = Date.now().toString();
    const developer = { id: developerId, name, email, createdAt: new Date().toISOString() };
    localStorage.setItem('currentDeveloper', JSON.stringify(developer));
    setDeveloperInfo(developer);
    setIsAuthenticated(true);
    setToolData(prev => ({ ...prev, author: name, developerId }));
  };

  const logout = () => {
    localStorage.removeItem('currentDeveloper');
    setDeveloperInfo(null);
    setIsAuthenticated(false);
    setToolData(prev => ({ ...prev, author: '', developerId: null }));
  };

  // قالب كود أساسي للمطورين
  const codeTemplate = `import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

const MyCustomTool = ({ onClose }) => {
  const [result, setResult] = useState('');

  const handleProcess = () => {
    // ضع منطق الأداة هنا
    setResult('تم تنفيذ الأداة بنجاح!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">أداتي المخصصة</h1>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>وصف الأداة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleProcess}>تشغيل الأداة</Button>
          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{result}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyCustomTool;`;

  // إضافة تاج جديد
  const addTag = () => {
    if (currentTag.trim() && !toolData.tags.includes(currentTag.trim())) {
      setToolData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  // حذف تاج
  const removeTag = (tagToRemove) => {
    setToolData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // التحقق من صحة الكود
  const validateCode = async () => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      // محاكاة عملية التحقق من الكود
      await new Promise(resolve => setTimeout(resolve, 2000));

      // فحص أساسي للكود
      const codeChecks = {
        hasReactImport: toolData.code.includes('import React'),
        hasExportDefault: toolData.code.includes('export default'),
        hasValidSyntax: true, // محاكاة فحص الصيغة
        hasRequiredProps: toolData.code.includes('onClose'),
        hasAccessibilityFeatures: toolData.code.includes('aria-') || toolData.code.includes('role='),
        isSecure: !toolData.code.includes('eval(') && !toolData.code.includes('innerHTML')
      };

      const passedChecks = Object.values(codeChecks).filter(Boolean).length;
      const totalChecks = Object.keys(codeChecks).length;

      setValidationResult({
        isValid: passedChecks >= totalChecks - 1,
        score: Math.round((passedChecks / totalChecks) * 100),
        checks: codeChecks,
        suggestions: generateSuggestions(codeChecks)
      });

    } catch (error) {
      setValidationResult({
        isValid: false,
        error: 'حدث خطأ أثناء التحقق من الكود'
      });
    } finally {
      setIsValidating(false);
    }
  };

  // إنشاء اقتراحات التحسين
  const generateSuggestions = (checks) => {
    const suggestions = [];
    
    if (!checks.hasReactImport) {
      suggestions.push('أضف استيراد React في بداية الملف');
    }
    if (!checks.hasExportDefault) {
      suggestions.push('أضف export default في نهاية الملف');
    }
    if (!checks.hasRequiredProps) {
      suggestions.push('تأكد من إضافة خاصية onClose للمكون');
    }
    if (!checks.hasAccessibilityFeatures) {
      suggestions.push('أضف ميزات إمكانية الوصول مثل aria-label و role');
    }
    if (!checks.isSecure) {
      suggestions.push('تجنب استخدام eval() أو innerHTML لأسباب أمنية');
    }

    return suggestions;
  };

  // معاينة الأداة
  const previewTool = () => {
    try {
      // محاكاة إنشاء معاينة للأداة
      setIsPreviewMode(true);
      setPreviewComponent({
        name: toolData.name,
        description: toolData.description,
        category: toolData.category,
        author: toolData.author,
        version: toolData.version,
        tags: toolData.tags
      });
    } catch (error) {
      console.error('خطأ في المعاينة:', error);
    }
  };

  // حفظ الأداة
  const saveTool = () => {
    if (!isAuthenticated) {
      alert('يجب تسجيل الدخول أولاً');
      return;
    }

    if (!toolData.name || !toolData.description || !toolData.code) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // حفظ الأداة مع معلومات المطور والخصوصية
    const savedTool = {
      ...toolData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: toolData.visibility === 'public' ? 'pending_review' : 'draft',
      developerId: developerInfo.id,
      developerEmail: developerInfo.email
    };

    // حفظ في localStorage مع فصل الأدوات حسب المطور
    const allTools = JSON.parse(localStorage.getItem('developerTools') || '[]');
    const developerTools = JSON.parse(localStorage.getItem(`developerTools_${developerInfo.id}`) || '[]');
    
    // إضافة للقائمة العامة فقط إذا كانت عامة
    if (toolData.visibility === 'public') {
      allTools.push(savedTool);
      localStorage.setItem('developerTools', JSON.stringify(allTools));
    }
    
    // إضافة لقائمة المطور الخاصة
    developerTools.push(savedTool);
    localStorage.setItem(`developerTools_${developerInfo.id}`, JSON.stringify(developerTools));

    const visibilityText = toolData.visibility === 'public' ? 'عامة' : 'خاصة';
    alert(`تم حفظ الأداة بنجاح كأداة ${visibilityText}!`);
    
    // إعادة تعيين النموذج
    setToolData({
      name: '',
      description: '',
      category: '',
      code: '',
      icon: 'Code',
      author: developerInfo.name,
      version: '1.0.0',
      tags: [],
      visibility: 'private',
      allowFork: false,
      allowEdit: false,
      developerId: developerInfo.id
    });
    setValidationResult(null);
    setIsPreviewMode(false);
  };

  // واجهة محسّنة لتسجيل الدخول
  const LoginForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleLogin = (e) => {
      e.preventDefault();
      if (name.trim() && email.trim()) {
        authenticateDeveloper(name.trim(), email.trim());
      }
    };

    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">تسجيل الدخول كمطور</CardTitle>
            <CardDescription className="text-center">
              أدخل بياناتك لبدء نشر أدواتك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">الاسم *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اسمك أو اسم فريقك"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                تسجيل الدخول
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Upload className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">نشر أدوات المطورين</h1>
              <p className="text-muted-foreground">انشر أداتك المخصصة لمساعدة المجتمع</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* رأس الأداة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Upload className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">نشر أدوات المطورين</h1>
            <p className="text-muted-foreground">انشر أداتك المخصصة لمساعدة المجتمع</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نموذج إدخال البيانات */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الأداة</CardTitle>
              <CardDescription>أدخل المعلومات الأساسية للأداة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم الأداة *</label>
                <Input
                  value={toolData.name}
                  onChange={(e) => setToolData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: أداة تحويل النص"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الوصف *</label>
                <Textarea
                  value={toolData.description}
                  onChange={(e) => setToolData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف مفصل لوظيفة الأداة وفوائدها"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الفئة</label>
                  <Select onValueChange={(value) => setToolData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الأيقونة</label>
                  <Select onValueChange={(value) => setToolData(prev => ({ ...prev, icon: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأيقونة" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map(icon => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم المطور</label>
                  <Input
                    value={toolData.author}
                    onChange={(e) => setToolData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="اسمك أو اسم فريقك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">رقم الإصدار</label>
                  <Input
                    value={toolData.version}
                    onChange={(e) => setToolData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="1.0.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">العلامات (Tags)</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="أضف علامة"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">إضافة</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {toolData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إعدادات الخصوصية والنشر</CardTitle>
              <CardDescription>حدد من يمكنه رؤية واستخدام أداتك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">مستوى الرؤية</label>
                <Select value={toolData.visibility} onValueChange={(value) => setToolData(prev => ({ ...prev, visibility: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستوى الرؤية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">خاصة - أنت فقط</SelectItem>
                    <SelectItem value="unlisted">غير مدرجة - بالرابط فقط</SelectItem>
                    <SelectItem value="public">عامة - للجميع</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {toolData.visibility === 'private' && 'ستكون الأداة مرئية لك فقط'}
                  {toolData.visibility === 'unlisted' && 'يمكن للآخرين استخدامها بالرابط فقط'}
                  {toolData.visibility === 'public' && 'ستظهر في قائمة الأدوات العامة'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="checkbox"
                    id="allowFork"
                    checked={toolData.allowFork}
                    onChange={(e) => setToolData(prev => ({ ...prev, allowFork: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="allowFork" className="text-sm">السماح بنسخ الأداة</label>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="checkbox"
                    id="allowEdit"
                    checked={toolData.allowEdit}
                    onChange={(e) => setToolData(prev => ({ ...prev, allowEdit: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="allowEdit" className="text-sm">السماح بتعديل الأداة</label>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">معلومات المطور:</p>
                <p className="text-sm text-muted-foreground">الاسم: {developerInfo?.name}</p>
                <p className="text-sm text-muted-foreground">البريد: {developerInfo?.email}</p>
                <Button variant="outline" size="sm" onClick={logout} className="mt-2">
                  تسجيل الخروج
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>كود الأداة *</CardTitle>
              <CardDescription>اكتب كود React للأداة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setToolData(prev => ({ ...prev, code: codeTemplate }))}
                >
                  <FileCode className="h-4 w-4 mr-2" />
                  استخدام القالب
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={validateCode}
                  disabled={isValidating}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isValidating ? 'جاري التحقق...' : 'التحقق من الكود'}
                </Button>
              </div>

              <Textarea
                value={toolData.code}
                onChange={(e) => setToolData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="أدخل كود React للأداة..."
                rows={15}
                className="font-mono text-sm"
              />

              {validationResult && (
                <div className={`p-4 rounded-lg border ${
                  validationResult.isValid 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {validationResult.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-medium">
                      {validationResult.isValid ? 'الكود صالح!' : 'يحتاج الكود إلى تحسين'}
                    </span>
                    {validationResult.score && (
                      <Badge variant={validationResult.score >= 80 ? 'default' : 'destructive'}>
                        {validationResult.score}%
                      </Badge>
                    )}
                  </div>
                  
                  {validationResult.suggestions && validationResult.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">اقتراحات التحسين:</p>
                      <ul className="text-sm space-y-1">
                        {validationResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* معاينة الأداة */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معاينة الأداة</CardTitle>
              <CardDescription>شاهد كيف ستظهر أداتك للمستخدمين</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={previewTool} className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                معاينة الأداة
              </Button>

              {isPreviewMode && previewComponent && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Code className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{previewComponent.name || 'اسم الأداة'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {previewComponent.description || 'وصف الأداة'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{previewComponent.category || 'غير محدد'}</Badge>
                    <Badge variant="secondary">v{previewComponent.version}</Badge>
                  </div>

                  {previewComponent.tags && previewComponent.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {previewComponent.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    بواسطة: {previewComponent.author || 'مطور مجهول'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إرشادات المطورين</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">متطلبات الكود:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• استخدم React مع JSX</li>
                  <li>• أضف خاصية onClose للإغلاق</li>
                  <li>• استخدم مكونات shadcn/ui</li>
                  <li>• اتبع معايير إمكانية الوصول</li>
                  <li>• تجنب الكود الضار</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">نصائح للتطوير:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• اختبر الأداة جيداً قبل النشر</li>
                  <li>• أضف تعليقات واضحة في الكود</li>
                  <li>• استخدم أسماء متغيرات وصفية</li>
                  <li>• تأكد من دعم اللغة العربية</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={saveTool} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              حفظ الأداة
            </Button>
            <Button variant="outline" onClick={previewTool}>
              <Play className="h-4 w-4 mr-2" />
              تشغيل
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperToolPublisher;
