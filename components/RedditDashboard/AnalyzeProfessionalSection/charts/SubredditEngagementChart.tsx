import React from "react";
import { useTranslations } from "next-intl";
import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";

interface SubredditEngagementProps {
  data: [
    string,
    {
      avg_score: number;
      avg_comments: number;
      avg_engagement_ratio: number;
      consistency_score: number;
      engagement_score: number;
    },
  ][];
}

/**
 * Subreddit参与度柱状图组件
 */
const SubredditEngagementChart: React.FC<SubredditEngagementProps> = ({
  data,
}) => {
  const t = useTranslations("AnalyzeProfessionalSection");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const subreddits = data.map((item) =>
    typeof item === "string" ? item : item[0],
  );
  const engagementScores = data.map((item) =>
    typeof item === "string" ? 0 : item[1].engagement_score,
  );
  const avgScores = data.map((item) =>
    typeof item === "string" ? 0 : item[1].avg_score,
  );
  const avgComments = data.map((item) =>
    typeof item === "string" ? 0 : item[1].avg_comments,
  );

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: isDark ? "#374151" : "#fff",
      borderColor: isDark ? "#4B5563" : "#E5E7EB",
      textStyle: {
        color: isDark ? "#E5E7EB" : "#374151",
      },
    },
    legend: {
      data: [t("engagementScore"), t("avgScore"), t("avgComments")],
      textStyle: {
        color: isDark ? "#E5E7EB" : "#374151",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: subreddits,
        axisLabel: {
          color: isDark ? "#E5E7EB" : "#374151",
          rotate: 30,
          interval: 0,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: t("engagementScore"),
        position: "left",
        axisLine: {
          show: true,
          lineStyle: {
            color: "#6366F1",
          },
        },
        axisLabel: {
          formatter: "{value}",
          color: isDark ? "#E5E7EB" : "#374151",
        },
      },
      {
        type: "value",
        name: t("avgValues"),
        position: "right",
        axisLine: {
          show: true,
          lineStyle: {
            color: "#10B981",
          },
        },
        axisLabel: {
          formatter: "{value}",
          color: isDark ? "#E5E7EB" : "#374151",
        },
      },
    ],
    series: [
      {
        name: t("engagementScore"),
        type: "bar",
        data: engagementScores,
        itemStyle: {
          color: "#6366F1",
        },
      },
      {
        name: t("avgScore"),
        type: "bar",
        yAxisIndex: 1,
        data: avgScores,
        itemStyle: {
          color: "#10B981",
        },
      },
      {
        name: t("avgComments"),
        type: "bar",
        yAxisIndex: 1,
        data: avgComments,
        itemStyle: {
          color: "#F59E0B",
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "400px" }} />;
};

export default SubredditEngagementChart;
