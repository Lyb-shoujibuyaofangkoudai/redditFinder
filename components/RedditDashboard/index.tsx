"use client";
import React, { useState, useEffect, useRef, createContext } from "react";
import { useTranslations } from "next-intl";
import Header from "./Header";
import TopSection from "./TopSection";
import CustomParams from "./CustomParams";
import FetchTrigger from "./FetchTrigger";
import PostActions from "./PostActions";
import PostGrid from "./PostGrid";
import AnalyticsSection from "./AnalyticsSection";
import { Rss } from "lucide-react";
import AnalyzeProfessionalSection from "@/components/RedditDashboard/AnalyzeProfessionalSection";

export const PostSelectionContext = createContext<{
  desc: string;
  setDesc: (value: string) => void;
  subreddits: string[];
  setSubreddits: (value: string[]) => void;
  aiKeywords: string[];
  setAiKeywords: (value: string[]) => void;
  customKeywords: string;
  setCustomKeywords: (value: string) => void;
  // AI分析帖子契合关键字数据结果
  analyzeData: any;
  setAnalyzeData: (value: any) => void;
  // 基础分析多个帖子数据
  analyzePostsData: any;
  setAnalyzePostsData: (value: any) => void;
  // 更专业的多帖子分析数据
  analyzePostsProfessionalData: any;
  setAnalyzePostsProfessionalData: (value: any) => void;
  // 添加ref引用
  analyticsSectionRef: React.RefObject<HTMLDivElement> | null | any;
  professionalSectionRef: React.RefObject<HTMLDivElement> | null | any;
  // 添加滚动方法
  scrollToAnalyticsSection: () => void;
  scrollToProfessionalSection: () => void;
} | null>(null);

const RedditDashboard = () => {
  const t = useTranslations("RedditDashboard");
  const [selectedCount, setSelectedCount] = useState(0);
  const [desc, setDesc] = useState("");
  const [subreddits, setSubreddits] = useState<string[]>([]);
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  const [customKeywords, setCustomKeywords] = useState<string>("");
  const [analyzeData, setAnalyzeData] = useState<any>(null);
  const [analyzePostsData, setAnalyzePostsData] = useState<any>(null);
  const [analyzePostsProfessionalData, setAnalyzePostsProfessionalData] = useState<any>(null);

  // 添加ref引用
  const analyticsSectionRef = useRef<HTMLDivElement>(null);
  const professionalSectionRef = useRef<HTMLDivElement>(null);

  // 添加滚动方法
  const scrollToAnalyticsSection = () => {
    if (analyticsSectionRef.current) {
      analyticsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToProfessionalSection = () => {
    if (professionalSectionRef.current) {
      professionalSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [rPosts, setRPosts] = useState<any>([]);
  const [nrPosts, setNrPosts] = useState<any>([]);
  // Context 数据
  const contextValue = {
    desc,
    setDesc,
    subreddits,
    setSubreddits,
    aiKeywords,
    setAiKeywords,
    customKeywords,
    setCustomKeywords,
    analyzeData,
    setAnalyzeData,
    analyzePostsData,
    setAnalyzePostsData,
    analyzePostsProfessionalData,
    setAnalyzePostsProfessionalData,
    // 添加ref引用到context
    analyticsSectionRef,
    professionalSectionRef,
    // 添加滚动方法到context
    scrollToAnalyticsSection,
    scrollToProfessionalSection,
  };
  const [selectedPosts, setSelectedPosts] = useState({});

  useEffect(() => {
    if (!analyzeData?.analyze_posts) return;
    const { r_data, nr_data } = analyzeData?.analyze_posts;
    if (r_data?.length) setRPosts(r_data);
    if (nr_data?.length) setNrPosts(nr_data);
  }, [analyzeData]);

  const handleSelectAll = (checked: boolean) => {
    const newSelected = {};
    if (checked) {
      rPosts.forEach((post) => {
        newSelected[post.id] = true;
      });
      nrPosts.forEach((post) => {
        newSelected[post.id] = true;
      });
    }
    setSelectedPosts(newSelected);
  };

  const togglePostSelection = (postId) => {
    setSelectedPosts((prev) => {
      const newSelected = { ...prev };
      if (newSelected[postId]) {
        delete newSelected[postId];
      } else {
        newSelected[postId] = true;
      }
      return newSelected;
    });
  };

  // 计算已选中的帖子数量
  useEffect(() => {
    setSelectedCount(Object.keys(selectedPosts).length);
  }, [selectedPosts]);

  return (
    <PostSelectionContext.Provider value={contextValue}>
      <div
        className={`min-h-screen overflow-hidden bg-gray-100 pt-30 pb-20 text-gray-900 md:pt-20 xl:pt-30 xl:pb-25 dark:bg-gray-900 dark:text-gray-100`}
      >
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Header />
          <TopSection />
          <CustomParams />

          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200">
              <Rss color="#D74200" /> {t("relatedPostsAnalysis")}
            </h2>

            <PostActions
              selectedCount={selectedCount}
              onSelectAll={handleSelectAll}
              selectedPosts={selectedPosts}
              postsCount={rPosts.length + nrPosts.length}
            />

            <PostGrid
              isHighCorrelation={true}
              posts={rPosts}
              selectedPosts={selectedPosts}
              onTogglePost={togglePostSelection}
            />

            <PostGrid
              isHighCorrelation={false}
              posts={nrPosts}
              selectedPosts={selectedPosts}
              onTogglePost={togglePostSelection}
            />
          </div>
          <div ref={analyticsSectionRef}>
            {
              analyzePostsData && <AnalyticsSection />
            }
          </div>
          <div className="mt-10" ref={professionalSectionRef}>
            {
              analyzePostsProfessionalData && <AnalyzeProfessionalSection />
            }
          </div>
        </div>
      </div>
    </PostSelectionContext.Provider>
  );
};

export default RedditDashboard;
