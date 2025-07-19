import React from 'react';
import { useTranslations } from 'next-intl';
import { ChartArea, Download, Settings, History } from "lucide-react";

const Header = () => {
  const t = useTranslations('RedditDashboard');
  
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-gray-700 dark:border-gray-600 mb-8">
      <div className="logo flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
          <ChartArea />
        </div>
        <h1 className="text-2xl font-bold text-black dark:text-white">
          {t('title')}
        </h1>
      </div>
      
      {/*<div className="flex items-center gap-4">*/}
      {/*  <div className="flex gap-3">*/}
      {/*    <button className={`px-4 py-2 rounded-lg flex items-center gap-2 border transition-all*/}
      {/*      dark:border-gray-600 text-gray-300 dark:hover:border-gray-400 dark:hover:bg-gray-800 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-100`}*/}
      {/*    >*/}
      {/*      <History /> {t('history')}*/}
      {/*    </button>*/}
      {/*    */}
      {/*    <button className={`px-4 py-2 rounded-lg flex items-center gap-2 border transition-all*/}
      {/*      dark:border-gray-600 text-gray-300 dark:hover:border-gray-400 dark:hover:bg-gray-800 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-100`}*/}
      {/*    >*/}
      {/*      <Settings /> {t('settings')}*/}
      {/*    </button>*/}
      {/*    */}
      {/*    <button className="px-4 py-2 rounded-lg flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-md hover:shadow-lg">*/}
      {/*      <Download /> {t('exportReport')}*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </header>
  );
};

export default Header;
