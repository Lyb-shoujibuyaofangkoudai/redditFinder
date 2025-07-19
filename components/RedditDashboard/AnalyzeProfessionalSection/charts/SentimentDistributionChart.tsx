import React from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';

interface SentimentDistributionProps {
  data: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

/**
 * 情感分布饼图组件
 */
const SentimentDistributionChart: React.FC<SentimentDistributionProps> = ({ data }) => {
  const t = useTranslations('AnalyzeProfessionalSection');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: isDark ? '#374151' : '#fff',
      borderColor: isDark ? '#4B5563' : '#E5E7EB',
      textStyle: {
        color: isDark ? '#E5E7EB' : '#374151'
      }
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: isDark ? '#E5E7EB' : '#374151'
      }
    },
    series: [
      {
        name: t('sentimentDistribution'),
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: isDark ? '#1F2937' : '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
            color: isDark ? '#E5E7EB' : '#374151'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: data.positive, name: t('positive'), itemStyle: { color: '#10B981' } },
          { value: data.neutral, name: t('neutral'), itemStyle: { color: '#6B7280' } },
          { value: data.negative, name: t('negative'), itemStyle: { color: '#EF4444' } }
        ]
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '300px' }} />
};

export default SentimentDistributionChart;