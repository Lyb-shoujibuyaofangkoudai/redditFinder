import React from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';

interface HourlyActivityProps {
  data: Record<string, {
    count: number;
    total_score: number;
    total_comments: number;
    avg_score: number;
    avg_comments: number;
  }>;
}

/**
 * 小时活动柱状图组件
 */
const HourlyActivityChart: React.FC<HourlyActivityProps> = ({ data }) => {
  const t = useTranslations('AnalyzeProfessionalSection');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // 准备24小时的数据
  const hours = Array.from({ length: 24 }, (_, i) => i.toString());
  const postCounts = hours.map(hour => data[hour]?.count || 0);
  const avgScores = hours.map(hour => data[hour]?.avg_score || 0);
  const avgComments = hours.map(hour => data[hour]?.avg_comments || 0);
  
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
        data: hours,
        axisLabel: {
          color: isDark ? '#E5E7EB' : '#374151',
          formatter: '{value}:00'
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

export default HourlyActivityChart;