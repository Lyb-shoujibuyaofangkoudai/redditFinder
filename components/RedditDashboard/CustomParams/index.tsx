import React, { useContext, useState } from "react";
import FetchTrigger from "@/components/RedditDashboard/FetchTrigger";
import { useTranslations } from 'next-intl';
import { FileSliders } from "lucide-react";
import { PostSelectionContext } from "@/components/RedditDashboard";

const CustomParams = (/*{ darkMode }*/) => {
  const context= useContext(PostSelectionContext);
  if (!context) {
    throw new Error('useContext must be used within a PostSelectionProvider');
  }
  const {
    customKeywords,
    setCustomKeywords
  } = context
  const t = useTranslations('RedditDashboard');
  // const [customKeywords, setCustomKeywords] = useState('');
  const handleKeywordChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomKeywords(e.target.value);
  };
  
  return (
    <section className="rounded-xl p-6 mb-6 shadow-lg transition-all bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-white">
        <FileSliders color="#D74200"/> {t('customFilterConditions')}
      </h3>
      
      <textarea
        placeholder={t('customKeywordsPlaceholder')}
        className="w-full min-h-[120px] p-4 rounded-lg transition-all bg-gray-50 text-gray-800 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:focus:border-blue-500 dark:focus:ring-blue-900"
        value={customKeywords}
        onChange={handleKeywordChange}
      />
      
      <div className="flex flex-wrap gap-2 mt-4">
        {customKeywords?.split(',').map((tag, index) => (
          <div
            key={index}
            className="px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:hover:bg-blue-500/25"
          >
            # {tag}
          </div>
        ))}
      </div>
      
      <FetchTrigger />
    </section>
  );
};

export default CustomParams;
