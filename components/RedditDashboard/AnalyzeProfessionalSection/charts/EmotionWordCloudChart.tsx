import React from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';
import 'echarts-wordcloud';

interface WordCloudItem {
  word: string;
  count: number;
}

interface EmotionWordCloudProps {
  data: WordCloudItem[];
}

/**
 * 情感词云图组件，使用ECharts词云图展示情感关键词
 */
const EmotionWordCloudChart: React.FC<EmotionWordCloudProps> = ({ data }) => {
  const t = useTranslations('AnalyzeProfessionalSection');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // 准备词云数据
  const wordCloudData = data.map(item => ({
    name: item.word,
    value: item.count,
    // 根据词频设置不同的样式
    textStyle: {
      color: getEmotionColor(item.word, item.count),
    }
  }));

  // 根据情感词的含义和频率生成颜色
  function getEmotionColor(word: string, count: number) {
    // 积极情感词汇
    const positiveWords = ['fascinating', 'want', 'better', 'worth', 'hope'];
    // 消极情感词汇
    const negativeWords = ['difficult', 'hard', 'struggle', 'worry', 'concern'];
    // 中性情感词汇
    const neutralWords = ['find', 'think', 'consider', 'see'];
    
    // 根据词频设置颜色深浅，频率越高颜色越深
    const intensity = Math.min(0.5 + count / 5 * 0.5, 1);
    
    if (positiveWords.some(w => word.toLowerCase().includes(w))) {
      // 积极情感用绿色系
      return isDark ? `rgba(52, 211, 153, ${intensity})` : `rgba(16, 185, 129, ${intensity})`;
    } else if (negativeWords.some(w => word.toLowerCase().includes(w))) {
      // 消极情感用红色系
      return isDark ? `rgba(248, 113, 113, ${intensity})` : `rgba(239, 68, 68, ${intensity})`;
    } else {
      // 中性情感用蓝色系
      return isDark ? `rgba(96, 165, 250, ${intensity})` : `rgba(59, 130, 246, ${intensity})`;
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
      sizeRange: [12, 40],
      rotationRange: [-45, 45],
      rotationStep: 15,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
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

export default EmotionWordCloudChart;