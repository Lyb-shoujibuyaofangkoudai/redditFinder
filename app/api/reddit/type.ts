
export enum TimeFilterEnum {
  ALL = 'all',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum SortEnum {
  RELEVANCE = 'relevance',
  HOT = 'hot',
  TOP = 'top',
  NEW = 'new',
  COMMENTS = 'comments',
}

export type PostsType = {
  limit: number;
  time_filter: TimeFilterEnum;
  subreddits: string;
}

export type AIAnalysisType = {
  /**
   * 产品描述，产品描述内容
   */
  desc: string;
  /**
   * 是否使用AI分析，使用AI分析帖子内容与用户描述的相关性
   */
  isaiAnalyze?: boolean;
  /**
   * 是否只返回关键词和子版块，调用AI提取用户描述中的关键词和生成相应有关联的子版块
   */
  justNeedKeywordsSubreddits?: boolean;
  /**
   * 关键词列表，指定关键词列表，逗号分隔，会与AI提取的关键字进行合并
   */
  keywords?: null | string;
  /**
   * 帖子分页数量限制，返回的帖子数量限制，这个限制为最终返回条目
   */
  limit?: number;
  /**
   *
   * 帖子数量限制，返回的帖子数量限制,注意：此数量与分页数量不同，这个数量会和关键字相关联，如关键字有5个时，获取帖子数量为5，则会获取5x5=25个帖子,如果使用了AI分析，返回的结果可能会小于此数量
   */
  limitCount?: number;
  /**
   * 子版块列表，指定子版块列表，逗号分隔，会与AI生成的子版块进行合并
   */
  subreddits?: null | string;
  /**
   * 时间过滤器，时间过滤器（如'day','week'）
   */
  timeFilter?: TimeFilterEnum;
  [property: string]: any;
}


export type SearchType = {
  /**
   * 关键词列表，关键词列表，逗号分隔
   */
  keywords?: null | string;
  /**
   * 帖子数量限制，返回的帖子数量限制
   */
  limit?: number;
  /**
   * 排序方式，排序方式，可选值：relevance, hot, top, new, comments
   */
  sort?: SortEnum;
  /**
   * 子版块列表，要搜索的subreddit列表，逗号分隔
   */
  subreddits?: null | string;
  [property: string]: any;
}

export type AiAnalyzeType = {
  /**
   * 关键词列表，逗号分隔的关键词列表
   */
  keywords?: string;
  /**
   * 帖子分页数量限制，最终返回的条目数，数量要小于limit_count
   */
  limit?: number;
  /**
   * 帖子数量限制，返回的帖子数量限制
   */
  limit_count?: number;
  /**
   * 子版块列表，逗号分隔的subreddit列表
   */
  subreddits?: null | string;
  /**
   * 时间过滤器，时间过滤器（如'day','week'）
   */
  timeFilter?: null | string;
  [property: string]: any;
}
