import React, { useContext, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";
import { PostSelectionContext } from "@/components/RedditDashboard";
import { aiAnalyzeByKeywords } from "@/app/api/reddit";
import { addToast, Button } from "@heroui/react";

const FetchTrigger = (/*{ darkMode }*/) => {
  const context= useContext(PostSelectionContext);
  if (!context) {
    throw new Error('useContext must be used within a PostSelectionProvider');
  }
  const [loading, setLoading] = useState(false);
  const t = useTranslations('RedditDashboard');
  const particlesRef = useRef<any>(null);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    if (!particlesRef.current) return;
    
    // 清除现有的粒子
    while (particlesRef.current?.firstChild) {
      particlesRef.current?.removeChild(particlesRef.current?.firstChild);
    }
    
    // 创建粒子效果
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle absolute rounded-full animate-float';
      
      // 随机属性
      const size = Math.random() * 6 + 2;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;
      const color = Math.random() > 0.5 ? '#FF4500' : '#0077FF';
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.backgroundColor = color;
      particle.style.animationDelay = `${delay}s`;
      
      particlesRef.current?.appendChild(particle);
    }
  }, [theme]);
  
  const handleFetch = async () => {
    try {
      setLoading(true);
      if(!context?.customKeywords && !context?.aiKeywords.length) {
        addToast({
          title: t('keywordsRequired'),
          description: t('keywordsRequiredDesc'),
          color: 'warning',
        })
        return setLoading(false)
      }
      const res = await aiAnalyzeByKeywords({
        keywords: context?.customKeywords + ',' + context?.aiKeywords.join(","),
        limit_count: 10,
        limit: 5
      });
      if ( res.code == 1 ) {
        context.setAnalyzeData(res.data);
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <section className="rounded-xl p-8 mb-6 relative overflow-hidden h-48 flex flex-col items-center justify-center transition-all">
      <Button onPress={handleFetch} isLoading={loading} className="cursor-pointer px-20 py-4 h-16 rounded-full flex items-center gap-3 bg-gradient-to-br from-orange-500 to-blue-500 text-white font-bold text-xl hover:from-orange-600 hover:to-blue-600 transition-all transform hover:scale-102 shadow-xl z-10">
        <Zap /> {t('fetchRelatedPosts')}
      </Button>
      
      <div
        ref={particlesRef}
        className="particles absolute inset-0 pointer-events-none z-0"
      />
    </section>
  );
};

export default FetchTrigger;
