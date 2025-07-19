import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardBody } from "@heroui/react";
import { Lightbulb } from "lucide-react";
import { motion } from 'framer-motion';

interface ActionableInsightsProps {
  insights: string[];
}

/**
 * 可操作洞察组件，展示AI生成的洞察和建议
 */
const ActionableInsights: React.FC<ActionableInsightsProps> = ({ insights }) => {
  const t = useTranslations('AnalyzeProfessionalSection');

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-0 shadow-sm overflow-hidden">
      <CardBody>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <Lightbulb className="text-amber-500" />
          {t('actionableInsights')}
        </h3>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 text-sm"
            >
              <div className="min-w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xs font-medium">
                {index + 1}
              </div>
              <p className="text-gray-700 dark:text-gray-300 pt-1">{insight}</p>
            </motion.div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default ActionableInsights;