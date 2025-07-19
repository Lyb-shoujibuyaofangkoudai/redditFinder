"use client";
import React, { useState, useEffect, useContext } from "react";
import { useTranslations } from 'next-intl';
import { Tabs, Tab, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { BarChart3, PieChart, TrendingUp, MessageCircle, Clock, Activity, LineChart, BarChart, CloudLightning, Calendar } from "lucide-react";
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import MetricCard from '../MetricCard';

// 导入子组件
import SentimentDistributionChart from './charts/SentimentDistributionChart';
import SubredditEngagementChart from './charts/SubredditEngagementChart';
import HourlyActivityChart from './charts/HourlyActivityChart';
import DailyActivityChart from './charts/DailyActivityChart';
import DemandWordCloudChart from './charts/DemandWordCloudChart';
import EmotionWordCloudChart from './charts/EmotionWordCloudChart';
import ViralPotentialChart from './charts/ViralPotentialChart';
import TrendingTopicsChart from './charts/TrendingTopicsChart';
import ActionableInsights from './charts/ActionableInsights';
import { PostSelectionContext } from "@/components/RedditDashboard";

/**
 * 专业数据分析组件，展示Reddit数据的深度分析结果
 */
const AnalyzeProfessionalSection: React.FC<any> = () => {
  const context= useContext(PostSelectionContext);
  if (!context) {
    throw new Error('useContext must be used within a PostSelectionProvider');
  }
  const t = useTranslations('AnalyzeProfessionalSection');
  const [activeView, setActiveView] = useState('overview');
  const data = context.analyzePostsProfessionalData;

  // 准备指标卡数据
  const metrics = [
    {
      name: t('dataQualityScore'),
      value: data.analysis_metadata.data_quality_score.toFixed(1) + '%',
      trend: { direction: 'up', value: null },
      icon: <Activity className="text-green-500" />
    },
    {
      name: t('averageSentiment'),
      value: (data.content_insights.average_sentiment * 100).toFixed(0) + '%',
      trend: { direction: data.content_insights.sentiment_trend === 'positive' ? 'up' : 'down', value: null },
      icon: <TrendingUp className="text-blue-500" />
    },
    {
      name: t('viralPotential'),
      value: data.viral_potential.average_viral_score.toFixed(1),
      trend: { direction: 'clock', value: null },
      icon: <Activity className="text-orange-500" />
    },
    {
      name: t('topEngagingSubreddit'),
      value: data.engagement_metrics.top_engaging_subreddit,
      trend: { direction: 'sync', value: null },
      icon: <MessageCircle className="text-purple-500" />
    },
    {
      name: t('optimalTimeRange'),
      value: data.predictions.peak_timing_prediction.optimal_time_range,
      trend: { direction: 'clock', value: null },
      icon: <Clock className="text-indigo-500" />
    },
    {
      name: t('engagementTrend'),
      value: t(data.predictions.engagement_forecast.engagement_trend),
      trend: { direction: data.predictions.engagement_forecast.engagement_trend === 'increasing' ? 'up' : 'down', value: null },
      icon: <BarChart3 className="text-cyan-500" />
    }
  ];

  // @ts-ignore
  return (
    <section className="rounded-xl p-6 shadow-lg transition-all bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">{t('title')}</h2>

      <Tabs className="mb-5" size="lg" aria-label="Professional analysis tabs" color="warning" onSelectionChange={(key: string) => setActiveView(key)}>
        <Tab key="overview" title={
          <div className="flex items-center gap-2">
            <BarChart3 />
            {t('overviewTab')}
          </div>
        } />
        <Tab key="content" title={
          <div className="flex items-center gap-2">
            <PieChart />
            {t('contentTab')}
          </div>
        } />
        <Tab key="temporal" title={
          <div className="flex items-center gap-2">
            <Clock />
            {t('temporalTab')}
          </div>
        } />
        <Tab key="engagement" title={
          <div className="flex items-center gap-2">
            <Activity />
            {t('engagementTab')}
          </div>
        } />
      </Tabs>

      {activeView === 'overview' && (
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

          {/* 可操作洞察 */}
          <ActionableInsights insights={data.actionable_insights} />

          {/* 情感分布和病毒潜力 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
              <CardHeader className="pb-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('sentimentDistribution')}</h3>
              </CardHeader>
              <CardBody>
                <SentimentDistributionChart data={data.content_insights.sentiment_distribution} />
              </CardBody>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
              <CardHeader className="pb-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('viralPotentialDistribution')}</h3>
              </CardHeader>
              <CardBody>
                <ViralPotentialChart data={data.viral_potential} />
              </CardBody>
            </Card>
          </div>
        </motion.div>
      )}

      {activeView === 'content' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* 词云图 */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
              <CardHeader className="pb-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('demandWordCloud')}</h3>
              </CardHeader>
              <CardBody>
                <div className="h-80">
                  <DemandWordCloudChart data={data.words_cloud.demand} />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* 情感词云和热门话题 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
              <CardHeader className="pb-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('emotionWordCloud')}</h3>
              </CardHeader>
              <CardBody>
                <div className="h-60">
                  <EmotionWordCloudChart data={data.words_cloud.emotion} />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
              <CardHeader className="pb-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('trendingTopics')}</h3>
              </CardHeader>
              <CardBody>
                <TrendingTopicsChart data={data.content_insights.trending_topics.slice(0, 10)} />
              </CardBody>
            </Card>
          </div>
        </motion.div>
      )}

      {activeView === 'temporal' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* 小时活动和日活动 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
              <CardHeader className="pb-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('hourlyActivity')}</h3>
              </CardHeader>
              <CardBody>
                <HourlyActivityChart data={data.temporal_trends.hourly_patterns} />
              </CardBody>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
              <CardHeader className="pb-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('dailyActivity')}</h3>
              </CardHeader>
              <CardBody>
                <DailyActivityChart data={data.temporal_trends.daily_patterns} />
              </CardBody>
            </Card>
          </div>

          {/* 峰值活动信息 */}
          <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
            <CardHeader className="pb-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('peakActivityInfo')}</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('peakHour')}</div>
                  <div className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Clock size={20} className="text-blue-500" />
                    {data.temporal_trends.peak_activity.hour}:00
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {data.temporal_trends.peak_activity.hour_posts} {t('posts')}
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('peakDay')}</div>
                  <div className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Calendar size={20} className="text-green-500" />
                    {data.temporal_trends.peak_activity.day}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {data.temporal_trends.peak_activity.day_posts} {t('posts')}
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('optimalTimeRange')}</div>
                  <div className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Clock size={20} className="text-purple-500" />
                    {data.predictions.peak_timing_prediction.optimal_time_range}
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('timeSpan')}</div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {new Date(data.temporal_trends.time_span.earliest).toLocaleString()}
                    <br />
                    <span className="text-gray-500 dark:text-gray-400">→</span>
                    <br />
                    {new Date(data.temporal_trends.time_span.latest).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {activeView === 'engagement' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Subreddit参与度 */}
          <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
            <CardHeader className="pb-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('subredditEngagement')}</h3>
            </CardHeader>
            <CardBody>
              <SubredditEngagementChart data={data.engagement_metrics.subreddit_rankings as any} />
            </CardBody>
          </Card>

          {/* 病毒潜力帖子 */}
          <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
            <CardHeader className="pb-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('topViralPosts')}</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {data.viral_potential.top_viral_posts.map((post, index) => (
                  <motion.div
                    key={post.post_id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate max-w-[80%]">
                        {post.title}
                      </div>
                      <span className="text-sm font-semibold flex items-center gap-1 text-orange-600 dark:text-orange-400">
                        <Activity size={14} /> {post.viral_score.toFixed(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span>r/{post.subreddit}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <TrendingUp size={12} className="text-green-500" />
                        <span>{post.current_score}</span>
                        <MessageCircle size={12} className="text-purple-500 ml-2" />
                        <span>{post.current_comments}</span>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">{t('viralVelocity')}</span>
                        <span className={`font-medium ${post.viral_velocity > 0.1 ? 'text-green-500' : 'text-gray-600 dark:text-gray-300'}`}>
                          {post.viral_velocity.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">{t('interactionIntensity')}</span>
                        <span className={`font-medium ${post.interaction_intensity > 3 ? 'text-green-500' : 'text-gray-600 dark:text-gray-300'}`}>
                          {post.interaction_intensity.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </section>
  );
};

export default AnalyzeProfessionalSection;
