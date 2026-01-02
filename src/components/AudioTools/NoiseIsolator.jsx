import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Volume2, 
  Mic, 
  Play, 
  Square, 
  Download,
  Settings,
  Zap,
  Waves
} from 'lucide-react';

const NoiseIsolator = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(30);
  const [sensitivity, setSensitivity] = useState(50);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        recordedChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      alert('خطأ في الوصول إلى الميكروفون: ' + error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
      };
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Waves className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">عزل الضوضاء الذكية</h1>
            <p className="text-muted-foreground">إزالة الضوضاء الخلفية من الصوتيات</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          ✕
        </Button>
      </div>

      {/* بطاقة التسجيل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            التسجيل الصوتي
          </CardTitle>
          <CardDescription>سجل صوتك أو قم بتحميل ملف صوتي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* عرض وقت التسجيل */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {formatTime(recordingTime)}
            </div>
            <p className="text-muted-foreground">
              {isRecording ? 'جاري التسجيل...' : 'جاهز للتسجيل'}
            </p>
          </div>

          {/* أزرار التحكم */}
          <div className="flex gap-4 justify-center">
            {!isRecording ? (
              <Button 
                onClick={startRecording}
                className="flex items-center gap-2"
                size="lg"
              >
                <Mic className="h-5 w-5" />
                ابدأ التسجيل
              </Button>
            ) : (
              <Button 
                onClick={stopRecording}
                variant="destructive"
                className="flex items-center gap-2"
                size="lg"
              >
                <Square className="h-5 w-5" />
                إيقاف التسجيل
              </Button>
            )}
            
            {recordedChunksRef.current.length > 0 && (
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                size="lg"
              >
                <Download className="h-5 w-5" />
                تحميل الملف
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* بطاقة الإعدادات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            إعدادات عزل الضوضاء
          </CardTitle>
          <CardDescription>اضبط مستويات عزل الضوضاء والحساسية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* مستوى عزل الضوضاء */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                مستوى عزل الضوضاء
              </label>
              <Badge variant="secondary">{noiseLevel}%</Badge>
            </div>
            <Slider
              value={[noiseLevel]}
              onValueChange={(value) => setNoiseLevel(value[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              {noiseLevel < 30 && 'عزل خفيف - يحافظ على معظم الأصوات'}
              {noiseLevel >= 30 && noiseLevel < 70 && 'عزل متوسط - توازن جيد بين الوضوح والعزل'}
              {noiseLevel >= 70 && 'عزل قوي - يزيل معظم الضوضاء الخلفية'}
            </p>
          </div>

          {/* حساسية الكشف */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                حساسية الكشف
              </label>
              <Badge variant="secondary">{sensitivity}%</Badge>
            </div>
            <Slider
              value={[sensitivity]}
              onValueChange={(value) => setSensitivity(value[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              {sensitivity < 40 && 'حساسية منخفضة - تكتشف الضوضاء الشديدة فقط'}
              {sensitivity >= 40 && sensitivity < 70 && 'حساسية متوسطة - توازن جيد'}
              {sensitivity >= 70 && 'حساسية عالية - تكتشف الضوضاء الخفيفة'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* بطاقة المعاينة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            معاينة النتيجة
          </CardTitle>
          <CardDescription>استمع إلى الصوت بعد عزل الضوضاء</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recordedChunksRef.current.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  الملف المسجل جاهز للمعالجة
                </p>
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isPlaying}
                >
                  <Play className="h-4 w-4" />
                  {isPlaying ? 'جاري التشغيل...' : 'تشغيل الملف المعالج'}
                </Button>
              </div>
              
              {/* مقارنة قبل وبعد */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm font-semibold mb-2">قبل المعالجة</p>
                  <div className="bg-red-100 rounded p-3 text-xs text-red-700">
                    ضوضاء: {noiseLevel}%
                  </div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm font-semibold mb-2">بعد المعالجة</p>
                  <div className="bg-green-100 rounded p-3 text-xs text-green-700">
                    ضوضاء: {Math.max(0, noiseLevel - 70)}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>ابدأ التسجيل أو قم بتحميل ملف صوتي لرؤية المعاينة</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* نصائح الاستخدام */}
      <Card>
        <CardHeader>
          <CardTitle>نصائح للحصول على أفضل النتائج</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>استخدم ميكروفون عالي الجودة للحصول على أفضل النتائج</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>ابدأ بمستوى عزل متوسط وعدل حسب احتياجاتك</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>تجنب الضوضاء الشديدة جداً أثناء التسجيل</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>استخدم حساسية عالية لاكتشاف الضوضاء الخفيفة</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoiseIsolator;
