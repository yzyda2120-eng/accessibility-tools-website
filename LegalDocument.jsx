import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { X, FileText, Shield, Scale, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LegalDocument = ({ onClose, documentType = 'privacy' }) => {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // معلومات المستندات
  const documentInfo = {
    privacy: {
      title: 'سياسة الخصوصية',
      description: 'كيف نجمع ونستخدم ونحمي بياناتك الشخصية',
      icon: Shield,
      file: '/privacy-policy.md'
    },
    eula: {
      title: 'اتفاقية ترخيص المستخدم النهائي',
      description: 'شروط وأحكام استخدام الموقع والأدوات',
      icon: FileText,
      file: '/eula.md'
    },
    terms: {
      title: 'شروط الخدمة',
      description: 'القواعد والشروط التي تحكم استخدام خدماتنا',
      icon: Scale,
      file: '/terms-of-service.md'
    }
  };

  const currentDoc = documentInfo[documentType] || documentInfo.privacy;

  // تحميل محتوى المستند
  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        const response = await fetch(currentDoc.file);
        if (!response.ok) {
          throw new Error('فشل في تحميل المستند');
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentType, currentDoc.file]);

  // تحويل Markdown إلى HTML بسيط
  const renderMarkdown = (markdown) => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-primary">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-primary">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-3 mt-6">$1</h3>')
      .replace(/^\* (.*$)/gim, '<li class="mb-2">$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="mb-2">$2</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
      .replace(/(<li.*?>.*?<\/li>)/gs, '<ul class="list-disc list-inside mb-4 space-y-2">$1</ul>')
      .replace(/<\/ul>\s*<ul[^>]*>/g, '');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <currentDoc.icon className="h-8 w-8 text-primary animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold">{currentDoc.title}</h1>
              <p className="text-muted-foreground">جاري التحميل...</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/5"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <h1 className="text-2xl font-bold">خطأ في التحميل</h1>
              <p className="text-muted-foreground">حدث خطأ أثناء تحميل المستند</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">فشل في تحميل المستند</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* رأس المستند */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <currentDoc.icon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">{currentDoc.title}</h1>
            <p className="text-muted-foreground">{currentDoc.description}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* إشعار مهم */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-primary mb-1">مستند قانوني مهم</p>
              <p className="text-sm text-muted-foreground">
                يرجى قراءة هذا المستند بعناية. باستخدامك لموقعنا، فإنك توافق على الشروط والأحكام المذكورة هنا.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* محتوى المستند */}
      <Card>
        <CardContent className="p-8">
          <div 
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </CardContent>
      </Card>

      {/* أزرار التنقل */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={documentType === 'privacy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => window.location.hash = '#privacy'}
              >
                <Shield className="h-4 w-4 mr-2" />
                سياسة الخصوصية
              </Button>
              <Button
                variant={documentType === 'eula' ? 'default' : 'outline'}
                size="sm"
                onClick={() => window.location.hash = '#eula'}
              >
                <FileText className="h-4 w-4 mr-2" />
                اتفاقية الترخيص
              </Button>
              <Button
                variant={documentType === 'terms' ? 'default' : 'outline'}
                size="sm"
                onClick={() => window.location.hash = '#terms'}
              >
                <Scale className="h-4 w-4 mr-2" />
                شروط الخدمة
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              آخر تحديث: 17 أكتوبر 2025
            </div>
          </div>
        </CardContent>
      </Card>

      {/* معلومات الاتصال */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">هل لديك أسئلة؟</CardTitle>
          <CardDescription>
            إذا كان لديك أي استفسارات حول هذا المستند، لا تتردد في التواصل معنا
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              إرسال استفسار
            </Button>
            <Button variant="outline" size="sm">
              support@accessibility-tools.com
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalDocument;
