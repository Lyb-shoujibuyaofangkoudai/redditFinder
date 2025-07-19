import React from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';

interface DailyActivityProps {
  data: Record<string, {
    count: number;
    total_score: number;
    total_comments: number;
    avg_score: number;
    avg_comments: number;
  }>;
}

/**
 * 日活动柱状图组件
 */
const DailyActivityChart: React.FC<DailyActivityProps> = ({ data }) => {
  const t = useTranslations('AnalyzeProfessionalSection');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const days = Object.keys(data).sort();
  const postCounts = days.map(day => data[day].count);
  const avgScores = days.map(day => data[day].avg_score);
  const avgComments = days.map(day => data[day].avg_comments);
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: isDark ? '#374151' : '#fff',
      borderColor: isDark ? '#4B5563' : '#E5E7EB',
      textStyle: {
        color: isDark ? '#E5E7EB' : '#374151'
      }
    },
    legend: {
      data: [t('postCount'), t('avgScore'), t('avgComments')],
      textStyle: {
        color: isDark ? '#E5E7EB' : '#374151'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: days,
        axisLabel: {
          color: isDark ? '#E5E7EB' : '#374151',
          formatter: (value) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: t('postCount'),
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#6366F1'
          }
        },
        axisLabel: {
          formatter: '{value}',
          color: isDark ? '#E5E7EB' : '#374151'
        }
      },
      {
        type: 'value',
        name: t('avgValues'),
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#10B981'
          }
        },
        axisLabel: {
          formatter: '{value}',
          color: isDark ? '#E5E7EB' : '#374151'
        }
      }
    ],
    series: [
      {
        name: t('postCount'),
        type: 'bar',
        data: postCounts,
        itemStyle: {
          color: '#6366F1'
        }
      },
      {
        name: t('avgScore'),
        type: 'line',
        yAxisIndex: 1,
        data: avgScores,
        itemStyle: {
          color: '#10B981'
        },
        lineStyle: {
          width: 2,
          type: 'solid'
        },
        symbol: 'circle',
        symbolSize: 6
      },
      {
        name: t('avgComments'),
        type: 'line',
        yAxisIndex: 1,
        data: avgComments,
        itemStyle: {
          color: '#F59E0B'
        },
        lineStyle: {
          width: 2,
          type: 'solid'
        },
        symbol: 'circle',
        symbolSize: 6
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '300px' }} />
};

export default DailyActivityChart;