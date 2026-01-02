import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import {
  Eye,
  Volume2,
  Mic,
  ZoomIn,
  Palette,
  Camera,
  Video,
  Banknote,
  Map,
  Type,
  Shield,
  FileText,
  MessageSquare,
  BookOpen,
  Scan,
  Menu,
  X,
  Globe,
  Film,
  TextSelect,
  Paintbrush,
  Sparkles, // أيقونة جديدة لقسم الجديد من آخر التحديثات
  Upload,
  Settings,
  Scale,
  Crown,
  Lock,
  Waves
} from 'lucide-react'
import TextToSpeech from './components/TextToSpeech.jsx'
import SpeechToText from './components/SpeechToText.jsx'
import ScreenMagnifier from './components/ScreenMagnifier.jsx'
import ColorContrastAnalyzer from './components/ColorContrastAnalyzer.jsx'
import AIImageDescriber from './components/AIImageDescriber.jsx'
import CurrencyRecognizer from './components/CurrencyRecognizer.jsx'
import OCRDocumentReader from './components/OCRDocumentReader.jsx'
import ObjectRecognizer from './components/ObjectRecognizer.jsx'
import AudioNavigation from './components/AudioNavigation.jsx'
import LiveAssistance from './components/LiveAssistance.jsx'
import BrailleConverter from './components/BrailleConverter.jsx'
import DigitalLibrary from './components/DigitalLibrary.jsx'
import ColorReader from './components/ColorReader.jsx'
import VideoTextReader from './components/VideoTextReader.jsx'
import VideoSceneDescriber from './components/VideoSceneDescriber.jsx'
import WhatsNew from './components/WhatsNew.jsx' // استيراد مكون WhatsNew
import DeveloperToolPublisher from './components/DeveloperToolPublisher.jsx'
import DeveloperToolsManager from './components/DeveloperToolsManager.jsx'
import LegalDocument from './components/LegalDocument.jsx'
import SubscriptionPlan from './components/SubscriptionPlan.jsx'
import AudioTools from './components/AudioTools/AudioTools.jsx'
import { SubscriptionService } from './services/subscriptionService.js'
import './App.css'
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';

// قائمة الأدوات المتاحة
const tools = [
  {
    id: 1,
    title: "tool_screen_reader_title",
    description: "tool_screen_reader_description",
    icon: Eye,
    category: "category_basic",
    status: "status_available"
  },
  {
    id: 2,
    title: "tool_text_to_speech_title",
    description: "tool_text_to_speech_description",
    icon: Volume2,
    category: "category_basic",
    status: "status_available"
  },
  {
    id: 3,
    title: "tool_speech_to_text_title",
    description: "tool_speech_to_text_description",
    icon: Mic,
    category: "category_basic",
    status: "status_available"
  },
  {
    id: 4,
    title: "tool_screen_magnifier_title",
    description: "tool_screen_magnifier_description",
    icon: ZoomIn,
    category: "category_basic",
    status: "status_available"
  },
  {
    id: 5,
    title: "tool_color_contrast_analyzer_title",
    description: "tool_color_contrast_analyzer_description",
    icon: Palette,
    category: "category_basic",
    status: "status_available"
  },
  {
    id: 6,
    title: "tool_ai_image_describer_title",
    description: "tool_ai_image_describer_description",
    icon: Camera,
    category: "category_smart",
    status: "status_available"
  },
  {
    id: 7,
    title: "tool_live_assistance_title",
    description: "tool_live_assistance_description",
    icon: Video,
    category: "category_assistance",
    status: "status_coming_soon"
  },
  {
    id: 8,
    title: "tool_currency_recognizer_title",
    description: "tool_currency_recognizer_description",
    icon: Banknote,
    category: "category_smart",
    status: "status_available"
  },
  {
    id: 9,
    title: "tool_audio_navigation_title",
    description: "tool_audio_navigation_description",
    icon: Map,
    category: "category_navigation",
    status: "status_available"
  },
  {
    id: 10,
    title: "tool_braille_converter_title",
    description: "tool_braille_converter_description",
    icon: Type,
    category: "category_braille",
    status: "status_available"
  },
  {
    id: 11,
    title: "tool_accessibility_checker_title",
    description: "tool_accessibility_checker_description",
    icon: Shield,
    category: "category_basic",
    status: "status_available"
  },
  {
    id: 12,
    title: "tool_ocr_document_reader_title",
    description: "tool_ocr_document_reader_description",
    icon: FileText,
    category: "category_smart",
    status: "status_available"
  },
  {
    id: 13,
    title: "tool_dictation_tool_title",
    description: "tool_dictation_tool_description",
    icon: MessageSquare,
    category: "category_basic",
    status: "status_available"
  },
  {
    id: 14,
    title: "tool_digital_library_title",
    description: "tool_digital_library_description",
    icon: BookOpen,
    category: "category_braille",
    status: "status_available"
  },
  {
    id: 15,
    title: "tool_object_recognizer_title",
    description: "tool_object_recognizer_description",
    icon: Scan,
    category: "category_smart",
    status: "status_available"
  },
  {
    id: 16,
    title: "tool_video_scene_describer_title",
    description: "tool_video_scene_describer_description",
    icon: Film,
    category: "category_smart",
    status: "status_available"
  },
  {
    id: 17,
    title: "tool_video_text_reader_title",
    description: "tool_video_text_reader_description",
    icon: TextSelect,
    category: "category_smart",
    status: "status_available"
  },
  {
    id: 18,
    title: "tool_color_reader_title",
    description: "tool_color_reader_description",
    icon: Paintbrush,
    category: "category_basic",
    status: "status_available"
  },
  {
    id: 19,
    title: "whats_new_title",
    description: "whats_new_description",
    icon: Sparkles,
    category: "category_info",
    status: "status_available"
  },
  {
    id: 20,
    title: "developer_tool_publisher_title",
    description: "developer_tool_publisher_description",
    icon: Upload,
    category: "category_developer",
    status: "status_available"
  },
  {
    id: 21,
    title: "developer_tools_manager_title",
    description: "developer_tools_manager_description",
    icon: Settings,
    category: "category_developer",
    status: "status_available"
  },
  {
    id: 22,
    title: "privacy_policy_title",
    description: "privacy_policy_description",
    icon: Shield,
    category: "category_legal",
    status: "status_available"
  },
  {
    id: 23,
    title: "eula_title",
    description: "eula_description",
    icon: FileText,
    category: "category_legal",
    status: "status_available"
  },
  {
    id: 24,
    title: "terms_of_service_title",
    description: "terms_of_service_description",
    icon: Scale,
    category: "category_legal",
    status: "status_available"
  },
  {
    id: 25,
    title: "subscription_plan_title",
    description: "subscription_plan_description",
    icon: Crown,
    category: "category_info",
    status: "status_available"
  },
  {
    id: 26,
    title: "audio_tools_title",
    description: "audio_tools_description",
    icon: Waves,
    category: "category_smart",
    status: "status_available"
  }
]

const categories = ["category_all", "category_basic", "category_smart", "category_assistance", "category_navigation", "category_braille", "category_info", "category_developer", "category_legal"]

function App() {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("category_all")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const [openTool, setOpenTool] = useState(null)

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  // تصفية الأدوات حسب الفئة المختارة وإضافة معلومات الاشتراك
  const baseFilteredTools = selectedCategory === "category_all" 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory)
  
  const filteredTools = SubscriptionService.getAvailableTools(baseFilteredTools)

  // إعلان للقارئ الصوتي عند تغيير الفئة
  useEffect(() => {
    if (selectedCategory !== "category_all") {
      setAnnouncement(t("category_announcement", { category: t(selectedCategory), count: filteredTools.length }));
    } else {
      setAnnouncement(t("all_tools_announcement", { count: tools.length }));
    }
  }, [selectedCategory, filteredTools.length, t, tools.length])

  const handleToolClick = (tool) => {
    if (tool.status !== "status_available") {
      setAnnouncement(t("tool_unavailable_announcement", { toolTitle: t(tool.title), toolDescription: t(tool.description) }));
      return
    }
    
    // التحقق من إمكانية الوصول للأداة
    if (tool.isLocked) {
      // تسجيل محاولة الوصول
      SubscriptionService.recordToolUsage(tool.id);
      
      setAnnouncement("هذه الأداة تتطلب اشتراك مميز. انقر على خطط الاشتراك للحصول على وصول كامل.");
      
      // فتح صفحة الاشتراك
      setOpenTool(25);
      return;
    }
    
    // التحقق من حد الاستخدام اليومي للمستخدمين المجانيين
    const dailyLimit = SubscriptionService.checkDailyLimit();
    if (!dailyLimit.allowed) {
      setAnnouncement(`لقد وصلت إلى الحد الأقصى للاستخدام اليومي (${dailyLimit.limit} استخدام). اشترك في الخطة المميزة لاستخدام غير محدود.`);
      setOpenTool(25);
      return;
    }
    
    // تسجيل استخدام الأداة
    SubscriptionService.recordToolUsage(tool.id);
    
    setAnnouncement(t("tool_open_announcement", { toolTitle: t(tool.title), toolDescription: t(tool.description) }));
    setOpenTool(tool.id)
  }

  const handleCloseTool = () => {
    setOpenTool(null)
    setAnnouncement(t("tool_close_announcement"))
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* إعلان للقارئ الصوتي */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      {/* رأس الصفحة */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Eye className="h-8 w-8 text-primary" aria-hidden="true" />
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  {t("header_title")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("header_subtitle")}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
                <SelectTrigger className="w-[100px]">
                  <Globe className="h-4 w-4" />
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                </SelectContent>
              </Select>

              {/* زر القائمة للشاشات الصغيرة */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? t("menu_close") : t("menu_open")}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="container mx-auto px-4 py-8">
        {/* مقدمة الموقع */}
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 text-primary">
            {t("welcome_title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("welcome_description")}
          </p>
        </section>

        {/* فلاتر الفئات */}
        <section className="mb-8" role="region" aria-label={t("filter_by_category")}>
          <h3 className="text-lg font-semibold mb-4">{t("filter_by_category")}</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className="capitalize"
              >
                {t(category)}
              </Button>
            ))}
          </div>
        </section>

        {/* قائمة الأدوات */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card 
              key={tool.id} 
              className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                tool.isLocked ? 'opacity-75 border-orange-200 bg-orange-50' : ''
              }`}
              onClick={() => handleToolClick(tool)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="relative">
                    <tool.icon className={`h-6 w-6 ${
                      tool.isLocked ? 'text-orange-500' : 'text-primary'
                    }`} />
                    {tool.isLocked && (
                      <Lock className="h-3 w-3 text-orange-600 absolute -top-1 -right-1 bg-white rounded-full" />
                    )}
                  </div>
                  {t(tool.title)}
                  {tool.requiresPremium && (
                    <Crown className="h-4 w-4 text-orange-500" />
                  )}
                </CardTitle>
                <CardDescription>{t(tool.description)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant={tool.status === "status_available" ? "default" : "secondary"}>
                    {t(tool.status)}
                  </Badge>
                  {tool.isLocked && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      مميز
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      {/* تذييل الصفحة */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} أدوات النفاذ الرقمي. جميع الحقوق محفوظة.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="link" size="sm" onClick={() => setOpenTool(22)}>{t('privacy_policy_title')}</Button>
              <Button variant="link" size="sm" onClick={() => setOpenTool(23)}>{t('eula_title')}</Button>
              <Button variant="link" size="sm" onClick={() => setOpenTool(24)}>{t('terms_of_service_title')}</Button>
            </div>
          </div>
        </div>
      </footer>

      {/* عرض الأداة المفتوحة */}
      {openTool === 2 && <TextToSpeech onClose={handleCloseTool} />}
      {openTool === 3 && <SpeechToText onClose={handleCloseTool} />}
      {openTool === 4 && <ScreenMagnifier onClose={handleCloseTool} />}
      {openTool === 5 && <ColorContrastAnalyzer onClose={handleCloseTool} />}
      {openTool === 6 && <AIImageDescriber onClose={handleCloseTool} />}
      {openTool === 8 && <CurrencyRecognizer onClose={handleCloseTool} />}
      {openTool === 9 && <AudioNavigation onClose={handleCloseTool} />}
      {openTool === 10 && <BrailleConverter onClose={handleCloseTool} />}
      {openTool === 12 && <OCRDocumentReader onClose={handleCloseTool} />}
      {openTool === 15 && <ObjectRecognizer onClose={handleCloseTool} />}
      {openTool === 16 && <VideoSceneDescriber onClose={handleCloseTool} />}
      {openTool === 17 && <VideoTextReader onClose={handleCloseTool} />}
      {openTool === 18 && <ColorReader onClose={handleCloseTool} />}
      {openTool === 19 && <WhatsNew onClose={handleCloseTool} />}
      {openTool === 20 && <DeveloperToolPublisher onClose={handleCloseTool} />}
      {openTool === 21 && <DeveloperToolsManager onClose={handleCloseTool} />}
      {openTool === 22 && <LegalDocument onClose={handleCloseTool} documentType="privacy" />}
      {openTool === 23 && <LegalDocument onClose={handleCloseTool} documentType="eula" />}
      {openTool === 24 && <LegalDocument onClose={handleCloseTool} documentType="terms" />}
      {openTool === 25 && <SubscriptionPlan onClose={handleCloseTool} />}
      {openTool === 26 && <AudioTools onClose={handleCloseTool} />}

    </div>
  )
}

export default App
App

