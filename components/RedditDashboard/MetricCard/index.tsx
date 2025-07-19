import React from 'react';

const MetricCard = ({ metric }) => {
  const renderTrendIcon = () => {
    switch (metric.trend.direction) {
      case 'up':
        return <i className="fas fa-arrow-up text-green-500"></i>;
      case 'down':
        return <i className="fas fa-arrow-down text-red-500"></i>;
      case 'sync':
        return <i className="fas fa-sync text-gray-500"></i>;
      case 'clock':
        return <i className="fas fa-clock text-gray-500"></i>;
      default:
        return null;
    }
  };
  
  return (
    <div className="rounded-xl p-5 transition-all bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {metric.name}
        </div>
        <div className="flex items-center gap-1">
          {metric.trend.value && (
            <span className={`text-sm font-medium ${
              metric.trend.direction === 'up' ? 'text-green-500' :
                metric.trend.direction === 'down' ? 'text-red-500' : 'text-gray-500'
            }`}>
              {metric.trend.value}
            </span>
          )}
          {renderTrendIcon()}
        </div>
      </div>
      
      <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        {metric.value}
      </div>
    </div>
  );
};

export default MetricCard;
