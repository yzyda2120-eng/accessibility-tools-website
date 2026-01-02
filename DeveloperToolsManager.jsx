import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { 
  X, 
  Search, 
  Filter, 
  Eye, 
  Play, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Code,
  User,
  Calendar,
  Tag,
  Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DeveloperToolsManager = ({ onClose, onRunTool }) => {
  const { t } = useTranslation();
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTool, setSelectedTool] = useState(null);
  const [isViewingCode, setIsViewingCode] = useState(false);

  // حالات الأدوات
  const statusOptions = [
    { value: 'all', label: 'جميع الحالات', color: 'default' },
    { value: 'approved', label: 'معتمدة', color: 'success' },
    { value: 'pending_review', label: 'قيد المراجعة', color: 'warning' },
    { value: 'rejected', label: 'مرفوضة', color: 'destructive' },
    { value: 'draft', label: 'مسودة', color: 'secondary' }
  ];

  // فئات الأدوات
  const categories = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'basic', label: 'أدوات أساسية' },
    { value: 'smart', label: 'أدوات ذكية' },
    { value: 'assistance', label: 'أدوات المساعدة' },
    { value: 'navigation', label: 'أدوات التنقل' },
    { value: 'braille', label: 'أدوات برايل' },
    { value: 'custom', label: 'أدوات مخصصة' }
  ];

  // تحميل الأدوات من localStorage
  useEffect(() => {
    const savedTools = JSON.parse(localStorage.getItem('developerTools') || '[]');
    
    // إضافة بعض الأدوات التجريبية إذا لم تكن موجودة
    if (savedTools.length === 0) {
      const demoTools = [
        {
          id: 1,
          name: 'محول النص إلى كود QR',
          description: 'أداة لتحويل النص إلى رمز QR قابل للقراءة',
          category: 'basic',
          author: 'أحمد محمد',
          version: '1.0.0',
          status: 'approved',
          tags: ['QR', 'تحويل', 'نص'],
          createdAt: '2025-10-13T10:00:00Z',
          code: `import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';

const QRGenerator = ({ onClose }) => {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');

  const generateQR = () => {
    // محاكاة إنشاء QR Code
    setQrCode(\`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=\${encodeURIComponent(text)}\`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">محول النص إلى كود QR</h1>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="أدخل النص المراد تحويله"
          />
          <Button onClick={generateQR} disabled={!text}>
            إنشاء رمز QR
          </Button>
          {qrCode && (
            <div className="text-center">
              <img src={qrCode} alt="QR Code" className="mx-auto" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRGenerator;`
        },
        {
          id: 2,
          name: 'حاسبة الألوان المتاحة',
          description: 'أداة لحساب التباين بين الألوان وفقاً لمعايير WCAG',
          category: 'smart',
          author: 'فاطمة أحمد',
          version: '1.2.0',
          status: 'pending_review',
          tags: ['ألوان', 'تباين', 'إمكانية الوصول'],
          createdAt: '2025-10-14T08:30:00Z',
          code: `// كود الأداة هنا...`
        },
        {
          id: 3,
          name: 'مولد كلمات المرور القوية',
          description: 'أداة لإنشاء كلمات مرور قوية وآمنة',
          category: 'basic',
          author: 'محمد علي',
          version: '1.0.0',
          status: 'draft',
          tags: ['أمان', 'كلمة مرور', 'تشفير'],
          createdAt: '2025-10-14T12:15:00Z',
          code: `// كود الأداة هنا...`
        }
      ];
      
      localStorage.setItem('developerTools', JSON.stringify(demoTools));
      setTools(demoTools);
    } else {
      setTools(savedTools);
    }
  }, []);

  // تصفية الأدوات
  useEffect(() => {
    let filtered = tools;

    // تصفية بالبحث
    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // تصفية بالحالة
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tool => tool.status === statusFilter);
    }

    // تصفية بالفئة
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tool => tool.category === categoryFilter);
    }

    setFilteredTools(filtered);
  }, [tools, searchTerm, statusFilter, categoryFilter]);

  // الحصول على لون الحالة
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  // الحصول على اسم الفئة
  const getCategoryName = (category) => {
    const categoryOption = categories.find(cat => cat.value === category);
    return categoryOption ? categoryOption.label : category;
  };

  // تشغيل الأداة
  const runTool = (tool) => {
    if (tool.status === 'approved') {
      // محاكاة تشغيل الأداة
      try {
        // يمكن هنا تنفيذ الكود الفعلي للأداة
        console.log('تشغيل الأداة:', tool.name);
        alert(`تم تشغيل الأداة: ${tool.name}`);
        
        // إذا كان هناك callback للتشغيل
        if (onRunTool) {
          onRunTool(tool);
        }
      } catch (error) {
        console.error('خطأ في تشغيل الأداة:', error);
        alert('حدث خطأ أثناء تشغيل الأداة');
      }
    } else {
      alert('هذه الأداة غير معتمدة بعد ولا يمكن تشغيلها');
    }
  };

  // حذف الأداة
  const deleteTool = (toolId) => {
    if (confirm('هل أنت متأكد من حذف هذه الأداة؟')) {
      const updatedTools = tools.filter(tool => tool.id !== toolId);
      setTools(updatedTools);
      localStorage.setItem('developerTools', JSON.stringify(updatedTools));
    }
  };

  // تصدير الأداة
  const exportTool = (tool) => {
    const dataStr = JSON.stringify(tool, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${tool.name.replace(/\s+/g, '_')}_v${tool.version}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // عرض تفاصيل الأداة
  const viewToolDetails = (tool) => {
    setSelectedTool(tool);
    setIsViewingCode(false);
  };

  // عرض كود الأداة
  const viewToolCode = (tool) => {
    setSelectedTool(tool);
    setIsViewingCode(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* رأس الأداة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Code className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">إدارة أدوات المطورين</h1>
            <p className="text-muted-foreground">عرض وإدارة الأدوات المنشورة من المجتمع</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* أدوات التصفية والبحث */}
      <Card>
        <CardHeader>
          <CardTitle>تصفية الأدوات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث في الأدوات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="تصفية بالحالة" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="تصفية بالفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قائمة الأدوات */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              الأدوات المتاحة ({filteredTools.length})
            </h2>
          </div>

          {filteredTools.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد أدوات تطابق المعايير المحددة</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTools.map(tool => (
                <Card key={tool.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{tool.name}</h3>
                          <Badge variant={getStatusColor(tool.status)}>
                            {statusOptions.find(s => s.value === tool.status)?.label}
                          </Badge>
                          <Badge variant="outline">v{tool.version}</Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{tool.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {tool.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(tool.createdAt).toLocaleDateString('ar-SA')}
                          </div>
                          <Badge variant="secondary">{getCategoryName(tool.category)}</Badge>
                        </div>

                        {tool.tags && tool.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {tool.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => viewToolDetails(tool)}
                          variant="outline"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          عرض
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={() => runTool(tool)}
                          disabled={tool.status !== 'approved'}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          تشغيل
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportTool(tool)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          تصدير
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteTool(tool.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* تفاصيل الأداة المحددة */}
        <div className="space-y-4">
          {selectedTool ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {isViewingCode ? 'كود الأداة' : 'تفاصيل الأداة'}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={!isViewingCode ? 'default' : 'outline'}
                      onClick={() => setIsViewingCode(false)}
                    >
                      التفاصيل
                    </Button>
                    <Button
                      size="sm"
                      variant={isViewingCode ? 'default' : 'outline'}
                      onClick={() => setIsViewingCode(true)}
                    >
                      الكود
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isViewingCode ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedTool.name}</h3>
                      <p className="text-muted-foreground">{selectedTool.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">المطور:</span>
                        <p>{selectedTool.author}</p>
                      </div>
                      <div>
                        <span className="font-medium">الإصدار:</span>
                        <p>v{selectedTool.version}</p>
                      </div>
                      <div>
                        <span className="font-medium">الفئة:</span>
                        <p>{getCategoryName(selectedTool.category)}</p>
                      </div>
                      <div>
                        <span className="font-medium">الحالة:</span>
                        <Badge variant={getStatusColor(selectedTool.status)}>
                          {statusOptions.find(s => s.value === selectedTool.status)?.label}
                        </Badge>
                      </div>
                    </div>

                    {selectedTool.tags && selectedTool.tags.length > 0 && (
                      <div>
                        <span className="font-medium text-sm">العلامات:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTool.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <Button
                        onClick={() => runTool(selectedTool)}
                        disabled={selectedTool.status !== 'approved'}
                        className="w-full"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        تشغيل الأداة
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-xs overflow-auto max-h-96">
                        <code>{selectedTool.code}</code>
                      </pre>
                    </div>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedTool.code);
                        alert('تم نسخ الكود!');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      نسخ الكود
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">اختر أداة لعرض تفاصيلها</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperToolsManager;
