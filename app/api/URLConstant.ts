export type Response<T> = {
  code: number;
  message: string;
  data: T;
}

const prefix = '/api/v1';

export const URLConstant = {
  TEST: `${prefix}/common/test`,
  // AI提取描述中的关键字
  AI_EXTRACT_KEYWORDS_BY_DESC: `${prefix}/reddit/ai-extract-keywords`,
  // AI 获取关键字关联的帖子
  AI_ANALYSIS_BY_KEYWORDS: `${prefix}/reddit/ai-analyze-posts-by-keywords`,
  // AI 分析帖子（整合版）
  AI_ANALYSIS: `${prefix}/reddit/ai-analysis`,
  // 获取热门帖子
  GET_HOT_POSTS: `${prefix}/reddit/posts`,
  // 更具关键字、子模块搜索帖子
  SEARCH_POSTS: `${prefix}/reddit/search`,
  // 多帖子基础分析
  ANALYZE_BASIC_TRENDS: `${prefix}/reddit/analyze`,
  // 多帖子深入分析
  ANALYZE_PROFESSIONAL_TRENDS: `${prefix}/reddit/analyze_professional`,
  GET_POST_BY_ID: `${prefix}/reddit/post/{post_id}`,
  GET_POST_COMMENTS_BY_ID: `${prefix}/reddit/post/{post_id}/comments`,
}
