import React, { useContext, useState } from "react";
import MetricCard from '../MetricCard';
import { useTranslations } from 'next-intl';
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { FileText, SquareChartGantt, BarChart3, PieChart, TrendingUp, MessageCircle, Award, Users } from "lucide-react";
import { motion } from 'framer-motion';
import { PostSelectionContext } from "@/components/RedditDashboard";

// 定义类型
interface SubredditStat {
  count: number;
  avg_score: number;
  avg_comments: number;
  total_comments: number;
  total_score: number;
}

interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  upvote_ratio: number;
  num_comments: number;
  created_utc: number;
  url: string;
  permalink: string;
  is_self: boolean;
  selftext: string;
  keyword: string;
}

interface RedditData {
  total_posts: number;
  subreddit_stats: Record<string, SubredditStat>;
  most_active_subreddits: [string, SubredditStat][];
  top_posts_by_score: RedditPost[];
  top_posts_by_comments: RedditPost[];
}

interface AnalyticsSectionProps {

}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = () => {
  const context= useContext(PostSelectionContext);
  if (!context) {
    throw new Error('useContext must be used within a PostSelectionProvider');
  }
  const t = useTranslations('AnalyticsSection');
  const [activeView, setActiveView] = useState('data');
  
  // 直接使用提供的Reddit数据
  const data: RedditData = context.analyzePostsData;

  // 计算总体统计数据
  const totalUpvotes = Object.values(data.subreddit_stats).reduce((sum, stat) => sum + stat.total_score, 0);
  const totalComments = Object.values(data.subreddit_stats).reduce((sum, stat) => sum + stat.total_comments, 0);
  const avgUpvotesPerPost = totalUpvotes / data.total_posts;
  const avgCommentsPerPost = totalComments / data.total_posts;
  
  // 准备指标卡数据
  const metrics = [
    {
      name: t('totalPosts'),
      value: data.total_posts,
      trend: { direction: 'sync', value: null },
      icon: <FileText className="text-blue-500" />
    },
    {
      name: t('totalUpvotes'),
      value: totalUpvotes,
      trend: { direction: 'up', value: '+' + totalUpvotes },
      icon: <TrendingUp className="text-green-500" />
    },
    {
      name: t('totalComments'),
      value: totalComments,
      trend: { direction: 'up', value: '+' + totalComments },
      icon: <MessageCircle className="text-purple-500" />
    },
    {
      name: t('avgUpvotesPerPost'),
      value: avgUpvotesPerPost.toFixed(1),
      trend: { direction: 'clock', value: null },
      icon: <Award className="text-orange-500" />
    },
    {
      name: t('avgCommentsPerPost'),
      value: avgCommentsPerPost.toFixed(1),
      trend: { direction: 'clock', value: null },
      icon: <Users className="text-indigo-500" />
    },
    {
      name: t('activeSubreddits'),
      value: Object.keys(data.subreddit_stats).length,
      trend: { direction: 'sync', value: null },
      icon: <BarChart3 className="text-cyan-500" />
    }
  ];

  // 格式化日期
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };
  
  return (
    <section className="rounded-xl p-6 shadow-lg transition-all bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">{t('title')}</h2>
      <Tabs className="mb-5" size="lg" aria-label="Analytics tabs" color="warning" onSelectionChange={(key: string) => setActiveView(key)}>
        <Tab key="data" title={
          <div className="flex items-center gap-2">
            <FileText />
            {t('dataView')}
          </div>
        } />
        <Tab key="visualView" title={
          <div className="flex items-center gap-2">
            <SquareChartGantt />
            {t('visualView')}
          </div>
        } />
      </Tabs>
      
      {activeView === 'data' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* 指标卡部分 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <MetricCard metric={{
                  ...metric,
                  icon: metric.icon
                }} />
              </motion.div>
            ))}
          </div>

          {/* 热门帖子部分 */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('topPosts')}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 按得分排序的帖子 */}
              <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
                <CardBody>
                  <h4 className="text-md font-medium mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <TrendingUp className="text-green-500" /> {t('topPostsByScore')}
                  </h4>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {data.top_posts_by_score.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[80%]"
                          >
                            {post.title}
                          </a>
                          <span className="text-sm font-semibold flex items-center gap-1 text-green-600 dark:text-green-400">
                            <TrendingUp size={14} /> {post.score}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>r/{post.subreddit}</span>
                          <span>{formatDate(post.created_utc)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* 按评论排序的帖子 */}
              <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
                <CardBody>
                  <h4 className="text-md font-medium mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MessageCircle className="text-purple-500" /> {t('topPostsByComments')}
                  </h4>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {data.top_posts_by_comments.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[80%]"
                          >
                            {post.title}
                          </a>
                          <span className="text-sm font-semibold flex items-center gap-1 text-purple-600 dark:text-purple-400">
                            <MessageCircle size={14} /> {post.num_comments}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>r/{post.subreddit}</span>
                          <span>{formatDate(post.created_utc)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* 活跃 Subreddit 部分 */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('activeSubreddits')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.most_active_subreddits.map(([subreddit, stats], index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">r/{subreddit}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      {stats.count} {t('posts')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <TrendingUp size={14} className="text-green-500" />
                      <span>{t('avgScore')}: {stats.avg_score}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <MessageCircle size={14} className="text-purple-500" />
                      <span>{t('avgComments')}: {stats.avg_comments}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96"
        >
          <div className="rounded-xl p-5 relative bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
              <PieChart className="text-orange-500" /> {t('subredditDistribution')}
            </h3>
            <div className="bg-gray-800/20 dark:bg-gray-700/30 w-full h-64 rounded-lg flex flex-col items-center justify-center p-4">
              <SubredditDistributionChart data={data.subreddit_stats} />
            </div>
            <button className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
              <i className="fas fa-expand text-gray-400"></i>
            </button>
          </div>
          
          <div className="rounded-xl p-5 relative bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
              <BarChart3 className="text-blue-500" /> {t('postPerformance')}
            </h3>
            <div className="bg-gray-800/20 dark:bg-gray-700/30 w-full h-64 rounded-lg flex flex-col items-center justify-center p-4">
              <PostPerformanceChart data={data.top_posts_by_score} />
            </div>
            <button className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
              <i className="fas fa-expand text-gray-400"></i>
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

// Subreddit分布图表组件
const SubredditDistributionChart: React.FC<{data: Record<string, SubredditStat>}> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center">
      {Object.entries(data).map(([subreddit, stats], index) => (
        <div key={index} className="mb-2 w-full">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-700 dark:text-gray-300">{subreddit}</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{stats.count} posts</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(stats.count / Object.values(data).reduce((sum, s: SubredditStat) => sum + s.count, 0)) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 帖子表现图表组件
const PostPerformanceChart: React.FC<{data: RedditPost[]}> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center">
      {data.map((post, index) => (
        <div key={index} className="mb-3 w-full">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate w-3/4" title={post.title}>
              {post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <i className="fas fa-arrow-up text-orange-500"></i> {post.score}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">r/{post.subreddit}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <i className="fas fa-comment text-blue-500"></i> {post.num_comments}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
            <div
              className="bg-orange-500 h-1.5 rounded-full"
              style={{ width: `${(post.score / Math.max(...data.map(p => p.score || 1))) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsSection;
