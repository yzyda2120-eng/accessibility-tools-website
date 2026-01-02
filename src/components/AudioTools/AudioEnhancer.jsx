import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Volume2, 
  Zap,
  Music,
  Settings,
  Play,
  Upload,
  Download
} from 'lucide-react';

const AudioEnhancer = ({ onClose }) => {
  const [bass, setBass] = useState(50);
  const [treble, setTreble] = useState(50);
  const [volume, setVolume] = useState(70);
  const [clarity, setClarity] = useState(50);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Music className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">تحسين جودة الصوت</h1>
            <p className="text-muted-foreground">حسّن جودة الصوت والوضوح</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          ✕
        </Button>
      </div>

      {/* بطاقة تحميل الملف */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            تحميل ملف صوتي
          </CardTitle>
          <CardDescription>اختر ملف صوتي لتحسين جودته</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div 
            onClick={triggerFileInput}
            className="border-2 border-dashed border-primary rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 transition"
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-semibold mb-1">اضغط لاختيار ملف أو اسحب الملف هنا</p>
            <p className="text-sm text-muted-foreground">
              الصيغ المدعومة: MP3, WAV, OGG, M4A
            </p>
          </div>

          {fileName && (
            <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm font-semibold">{fileName}</span>
              <Badge variant="default">محمل</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* بطاقة معادل الصوت */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            معادل الصوت (EQ)
          </CardTitle>
          <CardDescription>اضبط الترددات المختلفة لتحسين الصوت</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* الجهير (Bass) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold">الجهير (Bass)</label>
              <Badge variant="secondary">{bass}%</Badge>
            </div>
            <Slider
              value={[bass]}
              onValueChange={(value) => setBass(value[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              زيادة الجهير تعطي الصوت عمقاً وقوة
            </p>
          </div>

          {/* الحدة (Treble) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold">الحدة (Treble)</label>
              <Badge variant="secondary">{treble}%</Badge>
            </div>
            <Slider
              value={[treble]}
              onValueChange={(value) => setTreble(value[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              زيادة الحدة تحسن الوضوح والتفاصيل
            </p>
          </div>

          {/* الوضوح (Clarity) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold">الوضوح (Clarity)</label>
              <Badge variant="secondary">{clarity}%</Badge>
            </div>
            <Slider
              value={[clarity]}
              onValueChange={(value) => setClarity(value[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              زيادة الوضوح تجعل الكلام أكثر فهماً
            </p>
          </div>
        </CardContent>
      </Card>

      {/* بطاقة التحكم في مستوى الصوت */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            مستوى الصوت
          </CardTitle>
          <CardDescription>اضبط مستوى الصوت العام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold">مستوى الصوت</label>
              <Badge variant="secondary">{volume}%</Badge>
            </div>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* مؤشر مستوى الصوت */}
          <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full h-2 w-full">
            <div 
              className="bg-white h-full rounded-full transition-all"
              style={{ width: `${100 - volume}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* بطاقة المعاينة والتحميل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            المعاينة والتحميل
          </CardTitle>
          <CardDescription>استمع إلى الملف المحسّن وحمّله</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="flex items-center justify-center gap-2"
              disabled={!fileName}
            >
              <Play className="h-4 w-4" />
              معاينة
            </Button>
            <Button 
              variant="outline"
              className="flex items-center justify-center gap-2"
              disabled={!fileName}
            >
              <Download className="h-4 w-4" />
              تحميل الملف المحسّن
            </Button>
          </div>

          {!fileName && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              قم بتحميل ملف صوتي أولاً لتفعيل المعاينة والتحميل
            </div>
          )}
        </CardContent>
      </Card>

      {/* إعدادات مسبقة */}
      <Card>
        <CardHeader>
          <CardTitle>إعدادات مسبقة</CardTitle>
          <CardDescription>اختر إعداداً مسبقاً يناسب احتياجاتك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'متوازن', bass: 50, treble: 50, clarity: 50 },
              { name: 'صوت دافئ', bass: 70, treble: 40, clarity: 50 },
              { name: 'صوت حاد', bass: 40, treble: 70, clarity: 70 },
              { name: 'كلام واضح', bass: 30, treble: 60, clarity: 80 }
            ].map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => {
                  setBass(preset.bass);
                  setTreble(preset.treble);
                  setClarity(preset.clarity);
                }}
                className="text-sm"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioEnhancer;
