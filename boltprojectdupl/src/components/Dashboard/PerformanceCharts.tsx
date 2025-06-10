import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { ChartData } from '../../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceChartsProps {
  completionData: ChartData;
  pointsData: ChartData;
  rankProgress: {
    alex: number;
    jamie: number;
    taylor: number;
    total: number;
  };
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ 
  completionData, 
  pointsData,
  rankProgress
}) => {
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Performance & Progress</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">Daily Chore Completion</h3>
            <div className="h-72">
              <Bar options={barOptions} data={completionData} />
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">Points Earned Over Time</h3>
            <div className="h-72">
              <Line options={lineOptions} data={pointsData} />
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-md font-semibold text-gray-700 mb-4">Rank Progression</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Alex</span>
                <span className="text-sm text-gray-500">Sergeant</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(rankProgress.alex / rankProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Jamie</span>
                <span className="text-sm text-gray-500">Corporal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(rankProgress.jamie / rankProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Taylor</span>
                <span className="text-sm text-gray-500">Private</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-orange-600 h-2.5 rounded-full" 
                  style={{ width: `${(rankProgress.taylor / rankProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;