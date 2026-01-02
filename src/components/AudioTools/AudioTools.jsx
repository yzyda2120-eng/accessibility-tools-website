import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Waves, Volume2, Zap, Music, Mic, Filter, Settings, Sliders, Activity, Radio } from 'lucide-react';
import NoiseIsolator from './NoiseIsolator.jsx';
import AudioEnhancer from './AudioEnhancer.jsx';

const AudioTools = ({ onClose }) => {
  const [selectedTool, setSelectedTool] = useState(null);

  const tools = [
    { id: 1, name: 'عزل الضوضاء', desc: 'إزالة الضوضاء الخلفية', icon: Waves, component: NoiseIsolator },
    { id: 2, name: 'تحسين الصوت', desc: 'تحسين جودة الصوت', icon: Music, component: AudioEnhancer },
    { id: 3, name: 'معادل صوتي متقدم', desc: 'ضبط الترددات', icon: Settings, component: null },
    { id: 4, name: 'مكبر صوت ذكي', desc: 'تضخيم الصوت الخافت', icon: Volume2, component: null },
    { id: 5, name: 'إزالة الصدى', desc: 'إزالة صدى الصوت', icon: Radio, component: null },
    { id: 6, name: 'تصفية الضوضاء', desc: 'فلاتر صوتية متقدمة', icon: Filter, component: null },
    { id: 7, name: 'ضاغط صوتي', desc: 'ضغط ديناميكي للصوت', icon: Sliders, component: null },
    { id: 8, name: 'محسّن الكلام', desc: 'تحسين وضوح الكلام', icon: Mic, component: null },
    { id: 9, name: 'محلل الموجات', desc: 'تحليل الموجات الصوتية', icon: Activity, component: null },
    { id: 10, name: 'معدل الصوت', desc: 'تعديل سرعة الصوت', icon: Zap, component: null }
  ];

  if (selectedTool) {
    const Tool = selectedTool.component;
    return <Tool onClose={() => setSelectedTool(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Waves className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">أدوات الهندسة الصوتية</h1>
            <p className="text-muted-foreground">عزل الضوضاء وتحسين الصوت</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>✕</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isAvailable = tool.component !== null;
          return (
            <Card 
              key={tool.id}
              className={`cursor-pointer transition-all ${isAvailable ? 'hover:shadow-lg' : 'opacity-50'}`}
              onClick={() => isAvailable && setSelectedTool(tool)}
            >
              <CardHeader className="pb-3">
                <Icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <CardDescription className="text-xs">{tool.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                {isAvailable ? (
                  <Badge className="bg-green-500">متاح</Badge>
                ) : (
                  <Badge variant="secondary">قريباً</Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AudioTools;
