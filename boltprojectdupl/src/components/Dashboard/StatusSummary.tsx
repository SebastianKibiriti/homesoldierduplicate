import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ClipboardList } from 'lucide-react';

interface StatusSummaryProps {
  totalChores: number;
  completedToday: number;
  completedThisWeek: number;
  pendingChores: number;
  overdueChores: number;
  completionPercentage: number;
}

const StatusSummary: React.FC<StatusSummaryProps> = ({
  totalChores,
  completedToday,
  completedThisWeek,
  pendingChores,
  overdueChores,
  completionPercentage
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Family Chore Status</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start">
            <div className="p-2 rounded-lg bg-blue-100 mr-3">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Chores</p>
              <p className="text-2xl font-bold text-gray-800">{totalChores}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-2 rounded-lg bg-green-100 mr-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Today</p>
              <p className="text-2xl font-bold text-gray-800">{completedToday}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-2 rounded-lg bg-amber-100 mr-3">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{pendingChores}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-2 rounded-lg bg-red-100 mr-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-gray-800">{overdueChores}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Weekly Completion Rate</span>
            <span className="text-sm font-semibold">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSummary;