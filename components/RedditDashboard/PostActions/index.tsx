import React, { useContext, useState } from "react";
import { useTranslations } from 'next-intl';
import { BookOpen, BookOpenText, Crown, Search } from "lucide-react";
import { Checkbox, Button } from "@heroui/react";
import { analyzeBasicTrends, analyzeProfessionalTrends } from "@/app/api/reddit";
import { PostSelectionContext } from "@/components/RedditDashboard";

const PostActions = ({ selectedCount, onSelectAll, postsCount, selectedPosts }) => {
  const context = useContext(PostSelectionContext);
  if (!context) {
    throw new Error('useContext must be used within a PostSelectionProvider');
  }
  const {
    analyzeData,
    setAnalyzePostsData,
    analyzePostsProfessionalData,
    setAnalyzePostsProfessionalData,
    // 添加滚动方法
    scrollToAnalyticsSection,
    scrollToProfessionalSection
  } = context;
  const t = useTranslations('RedditDashboard');
  const [basicBtnLoading, setBasicBtnLoading] = useState(false);
  const [deepBtnLoading, setDeepBtnLoading] = useState(false);
  
  function getSelectedPosts(selectedPosts: {
    [key: string]: boolean
  }) {
    const {
      r_data,
      nr_data
    } = analyzeData?.analyze_posts
    const arr = [...r_data,...nr_data]
    if(!arr.length) return []
    
    return arr.filter(post => selectedPosts[post.id]);
  }
  
  const handleBasicClick = async () => {
    try { // 处理基本分析点击事件
      setBasicBtnLoading(true)
      const res = await analyzeBasicTrends({
        posts_json: JSON.stringify(getSelectedPosts(selectedPosts))
      });
      if ( res.code === 1 ) {
        setAnalyzePostsData(res.data);
        // 添加滚动到AnalyticsSection的功能
        setTimeout(() => {
          scrollToAnalyticsSection();
        }, 300);
      }
    } finally {
      setBasicBtnLoading(false)
    }
  }
  
  const handleDeepClick = async () => {
    try { // 处理深入分析点击事件
      setDeepBtnLoading(true)
      const res = await analyzeProfessionalTrends({
        posts_json: JSON.stringify(getSelectedPosts(selectedPosts))
      });
      if ( res.code === 1 ) {
        setAnalyzePostsProfessionalData(res.data);
        // 添加滚动到AnalyzeProfessionalSection的功能
        setTimeout(() => {
          scrollToProfessionalSection();
        }, 300);
      }
    } finally {
      setDeepBtnLoading(false)
    }
  }
  return (
    <div className="rounded-xl p-4 mb-4 shadow-md flex flex-col md:flex-row justify-between items-center transition-all bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center gap-4 mb-3 md:mb-0">
        <Checkbox onValueChange={onSelectAll} isSelected={selectedCount === postsCount}>
          {t('selectAll')}
        </Checkbox>
        
        <div className="text-gray-500 dark:text-gray-400">
          {t('selectedPosts')} <strong className="text-orange-500">{selectedCount}</strong> {t('posts')}
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button
          isLoading={basicBtnLoading}
          className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all
            ${selectedCount > 0
            ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer shadow-md hover:shadow-lg'
            : 'bg-blue-500/30 text-white/50 cursor-not-allowed'}`}
          onPress={handleBasicClick}
          disabled={selectedCount === 0}
        >
          <Search /> {t('basicInsight')}
        </Button>
        
        <Button
          isLoading={deepBtnLoading}
          className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all
            ${selectedCount > 0
            ? 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer shadow-md hover:shadow-lg'
            : 'bg-purple-600/30 text-white/50 cursor-not-allowed'}`}
          onPress={handleDeepClick}
          disabled={selectedCount === 0}
        >
          <Crown /> {t('deepInsight')}
        </Button>
      </div>
    </div>
  );
};

export default PostActions;

