import request from "@/utils/request";
import {URLConstant } from "@/app/api/URLConstant";
import { AIAnalysisType, AiAnalyzeType, PostsType, SearchType } from "@/app/api/reddit/type";

export const extractKeywordsByDesc = async (params: {
  desc: string
}) => {
  return request.post<any>(URLConstant.AI_EXTRACT_KEYWORDS_BY_DESC, params);
};

export const aiAnalyzeByKeywords = async (params: AiAnalyzeType) => {
  return request.post<any>(URLConstant.AI_ANALYSIS_BY_KEYWORDS, params);
};

export const aiAnalysis = async (params: AIAnalysisType) => {
  return request.get<any>(URLConstant.AI_ANALYSIS, params);
};

export const getHotPosts = async (params: PostsType) => {
  return request.get<any>(URLConstant.GET_HOT_POSTS,params);
};

export const searchPosts = async (params: SearchType) => {
  return request.get<any>(URLConstant.SEARCH_POSTS, params);
};

// 基础分析
export const analyzeBasicTrends = async (params: {
  posts_json: string;
}) => {
  return request.post<any>(URLConstant.ANALYZE_BASIC_TRENDS, params);
};
// 深度分析
export const analyzeProfessionalTrends = async (params: {
  posts_json: string;
}) => {
  return request.post<any>(URLConstant.ANALYZE_PROFESSIONAL_TRENDS, params);
};

export const getPostById = async (postId: string) => {
  return request.get<any>(URLConstant.GET_POST_BY_ID.replace('{post_id}', postId));
};

export const getPostComments = async (postId: string) => {
  return request.get<any>(URLConstant.GET_POST_COMMENTS_BY_ID.replace('{post_id}', postId));
};
