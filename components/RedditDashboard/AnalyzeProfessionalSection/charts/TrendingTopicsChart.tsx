"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import ReactECharts from 'echarts-for-react';

/**
 * 热门话题图表组件，展示最热门的关键词及其频率
 * 
 * @param data - 包含关键词和频率的数据数组
 */
interface TrendingTopic {
  keyword: string;
  frequency: number;
}

interface TrendingTopicsChartProps {
  data: TrendingTopic[];
}

const TrendingTopicsChart: React.FC<TrendingTopicsChartProps> = ({ data }) => {
  const t = useTranslations('AnalyzeProfessionalSection');
  const { resolvedTheme } = useTheme();
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // 准备数据
    const keywords = data.map(item => item.keyword);
    const frequencies = data.map(item => item.frequency);

    // 设置图表选项
    setChartOptions({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          return `${keywords[dataIndex]}: ${frequencies[dataIndex]}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: resolvedTheme === 'dark' ? '#6b7280' : '#d1d5db'
          }
        },
        axisLabel: {
          color: resolvedTheme === 'dark' ? '#d1d5db' : '#4b5563'
        },
        splitLine: {
          lineStyle: {
            color: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: keywords,
        axisLine: {
          lineStyle: {
            color: resolvedTheme === 'dark' ? '#6b7280' : '#d1d5db'
          }
        },
        axisLabel: {
          color: resolvedTheme === 'dark' ? '#d1d5db' : '#4b5563'
        }
      },
      series: [
        {
          name: t('frequency'),
          type: 'bar',
          data: frequencies,
          itemStyle: {
            color: function(params: any) {
              // 根据频率生成不同深浅的颜色
              const colorList = resolvedTheme === 'dark' 
                ? ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']
                : ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
              
              const maxFreq = Math.max(...frequencies);
              const index = Math.floor((params.value / maxFreq) * (colorList.length - 1));
              return colorList[index];
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
            color: resolvedTheme === 'dark' ? '#d1d5db' : '#4b5563'
          }
        }
      ]
    });
  }, [data, resolvedTheme, t]);

  return (
    <div className="h-60">
      {data.length > 0 ? (
        <ReactECharts 
          option={chartOptions} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
          {t('noTrendingTopicsData')}
        </div>
      )}
    </div>
  );
};

export default TrendingTopicsChart;