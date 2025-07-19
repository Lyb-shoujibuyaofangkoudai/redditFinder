import React from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';
import 'echarts-wordcloud';

interface WordCloudItem {
  word: string;
  count: number;
}

interface DemandWordCloudProps {
  data: WordCloudItem[];
}

/**
 * 需求词云图组件，使用ECharts词云图展示需求关键词
 */
const DemandWordCloudChart: React.FC<DemandWordCloudProps> = ({ data }) => {
  const t = useTranslations('AnalyzeProfessionalSection');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // 准备词云数据
  const wordCloudData = data.map(item => ({
    name: item.word,
    value: item.count,
    // 根据词频设置不同的样式
    textStyle: {
      color: getRandomColor(item.count),
    }
  }));

  // 根据词频生成不同的颜色
  function getRandomColor(count: number) {
    // 根据词频设置颜色深浅，频率越高颜色越深
    const intensity = Math.min(0.4 + count / 10 * 0.6, 1);
    
    if (isDark) {
      // 深色主题使用明亮的颜色
      const colors = [
        `rgba(77, 171, 247, ${intensity})`,
        `rgba(236, 108, 113, ${intensity})`,
        `rgba(89, 196, 230, ${intensity})`,
        `rgba(241, 143, 1, ${intensity})`,
        `rgba(87, 214, 141, ${intensity})`,
        `rgba(215, 111, 249, ${intensity})`
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      // 浅色主题使用深色系
      const colors = [
        `rgba(23, 119, 242, ${intensity})`,
        `rgba(220, 38, 38, ${intensity})`,
        `rgba(8, 145, 178, ${intensity})`,
        `rgba(217, 119, 6, ${intensity})`,
        `rgba(5, 150, 105, ${intensity})`,
        `rgba(124, 58, 237, ${intensity})`
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  const option = {
    tooltip: {
      show: true,
      formatter: function(params: any) {
        return `${params.name}: ${params.value}`;
      },
      backgroundColor: isDark ? '#374151' : '#fff',
      borderColor: isDark ? '#4B5563' : '#E5E7EB',
      textStyle: {
        color: isDark ? '#E5E7EB' : '#374151'
      }
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '90%',
      height: '90%',
      right: null,
      bottom: null,
      sizeRange: [12, 50],
      rotationRange: [-45, 45],
      rotationStep: 15,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function() {
          return getRandomColor(Math.floor(Math.random() * 10) + 1);
        }
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          shadowBlur: 10,
          shadowColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: wordCloudData
    }]
  };

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '100%', width: '100%' }} 
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default DemandWordCloudChart;