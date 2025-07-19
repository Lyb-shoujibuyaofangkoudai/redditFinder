import React, { useContext, useState } from "react";
import { useTranslations } from 'next-intl';
import { Keyboard, X } from "lucide-react";
import { PostSelectionContext } from "..";
import { addToast, Button } from "@heroui/react";
import { extractKeywordsByDesc } from "@/app/api/reddit";

const TopSection = (/*{ darkMode }*/) => {
  const context= useContext(PostSelectionContext);
  if (!context) {
    throw new Error('useContext must be used within a PostSelectionProvider');
  }
  
  const { desc, setDesc,aiKeywords,setAiKeywords } = context;
  const [loading, setLoading] = useState(false);
  const t = useTranslations('RedditDashboard');
  // 添加关键词移除方法
  const handleRemoveKeyword = (indexToRemove: number) => {
    setAiKeywords(aiKeywords.filter((_, index) => index !== indexToRemove));
  };
  
  const handleExtraKeywords = async () => {
    try {
      setAiKeywords([]);
      setLoading(true);
      if(!desc) return addToast({
        title: t('inputDescription'),
        description: t('inputDescriptionDesc'),
        color: 'warning',
      })
      const res = await extractKeywordsByDesc({
        desc
      });
      if ( res.code === 1 ) {
        const {
          keywords
        } = res.data;
        setAiKeywords(keywords);
      }
    } finally {
      setLoading(false);
    }
  }
  
  const handleInputChange = (e) => {
    setDesc(e.target.value);
  };
  
  
  return (
    <section className="rounded-xl p-6 mb-6 shadow-lg transition-all bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
        <Keyboard color="#D74200"/> {t('inputDescription')}
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder={t('inputPlaceholder')}
          onBlur={handleInputChange}
          className="flex-1 px-4 h-12 rounded-lg transition-all bg-gray-50 text-gray-800 border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:focus:border-orange-500 dark:focus:ring-orange-900"
        />
        
        <Button
          isLoading={loading}
          className="h-12 cursor-pointer rounded-lg flex items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-orange-700 text-white font-bold hover:from-orange-600 hover:to-orange-800 transition-all transform shadow-lg hover:shadow-xl relative overflow-hidden"
          onPress={handleExtraKeywords}
        >
          {t('extractKeywords')}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity -rotate-45 w-full h-16"></span>
        </Button>
      </div>
      
      
      <div className="flex flex-wrap gap-3 p-4 rounded-lg min-h-[60px] transition-all bg-gray-100 dark:bg-gray-900/50">
        {aiKeywords.map((keyword, index) => (
          <div
            key={index}
            className="px-4 py-2 rounded-full flex items-center gap-2  bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500/30"
          >
            # {keyword} <X className="cursor-pointer hover:text-red-800" onClick={() => handleRemoveKeyword(index)} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopSection;
