import React from 'react';
import PerformanceCharts from '../components/Dashboard/PerformanceCharts';
import { getCompletionChartData, getPointsChartData, getRankProgressData } from '../data/mockData';

const Reports: React.FC = () => {
  const completionChartData = getCompletionChartData();
  const pointsChartData = getPointsChartData();
  const rankProgressData = getRankProgressData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Performance Reports</h1>
      </div>
      <PerformanceCharts 
        completionData={completionChartData}
        pointsData={pointsChartData}
        rankProgress={rankProgressData}
      />

      {/* Bolt.new Badge */}
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
      >
        <span>Built with</span>
        <span className="font-semibold">Bolt.new</span>
      </a>
    </div>
  );
};

export default Reports;