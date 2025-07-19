import React from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';

interface ViralPotentialProps {
  data: {
    total_analyzed: number;
    average_viral_score: number;
    distribution: {
      high_potential: {
        count: number;
        percentage: number;
      };
      medium_potential: {
        count: number;
        percentage: number;
      };
      low_potential: {
        count: number;
        percentage: number;
      };
    };
  };
}

/**
 * 病毒式传播潜力图表组件
 */
const ViralPotentialChart: React.FC<ViralPotentialProps> = ({ data }) => {
  const t = useTranslations('AnalyzeProfessionalSection');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // 准备饼图数据
  const pieData = [
    { value: data.distribution.high_potential.count, name: t('highPotential') },
    { value: data.distribution.medium_potential.count, name: t('mediumPotential') },
    { value: data.distribution.low_potential.count, name: t('lowPotential') }
  ];

  // 准备仪表盘数据
  const gaugeData = [
    {
      value: data.average_viral_score,
      name: t('viralScore'),
      title: {
        offsetCenter: ['0%', '20%']
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '50%']
      }
    }
  ];

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
        name: t('viralPotentialDistribution'),
        type: 'pie',
        radius: ['40%', '60%'],
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
        data: pieData,
        color: ['#F59E0B', '#3B82F6', '#6B7280']
      },
      {
        name: t('viralScore'),
        type: 'gauge',
        radius: '30%',
        center: ['50%', '50%'],
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 8,
            color: [
              [0.3, '#6B7280'],
              [0.7, '#3B82F6'],
              [1, '#F59E0B']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 6,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: isDark ? '#E5E7EB' : '#374151'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'inherit',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'inherit',
            width: 2
          }
        },
        axisLabel: {
          color: isDark ? '#E5E7EB' : '#374151',
          fontSize: 10,
          distance: -60,
          formatter: function(value: number) {
            if (value === 0) {
              return 'Low';
            } else if (value === 50) {
              return 'Med';
            } else if (value === 100) {
              return 'High';
            }
            return '';
          }
        },
        title: {
          offsetCenter: [0, '-20%'],
          fontSize: 12,
          color: isDark ? '#E5E7EB' : '#374151'
        },
        detail: {
          fontSize: 18,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: function(value: number) {
            return Math.round(value);
          },
          color: isDark ? '#E5E7EB' : '#374151'
        },
        data: gaugeData
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '300px' }} />;
};

export default ViralPotentialChart;