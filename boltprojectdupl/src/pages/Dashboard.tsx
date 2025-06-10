import React, { useEffect, useState } from 'react';
import StatusSummary from '../components/Dashboard/StatusSummary';
import FamilyMembers from '../components/Dashboard/FamilyMembers';
import ChoresList from '../components/Dashboard/ChoresList';
import RewardsManagement from '../components/Dashboard/RewardsManagement';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import PerformanceCharts from '../components/Dashboard/PerformanceCharts';
import CompletionRequests from '../components/Dashboard/CompletionRequests';
import NewChoreModal from '../components/Chores/NewChoreModal';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { logger } from '../utils/logger';
import {
  familyMembers,
  rewards,
  rewardRequests,
  activities,
  chores as mockChores,
  getCompletionChartData,
  getPointsChartData,
  getRankProgressData,
  getSummaryData
} from '../data/mockData';

const ITEMS_PER_PAGE = 10;

const Dashboard: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const [completionRequests, setCompletionRequests] = useState([]);
  const [chores, setChores] = useState([]);
  const [isNewChoreModalOpen, setIsNewChoreModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  
  const { handleError } = useErrorHandler({ component: 'Dashboard' });
  
  const {
    loading: choreLoading,
    error: choreError,
    execute: executeChoreOperation
  } = useAsyncOperation({
    component: 'Dashboard-Chores',
    retryCount: 2,
    retryDelay: 1000,
  });

  const {
    loading: requestLoading,
    error: requestError,
    execute: executeRequestOperation
  } = useAsyncOperation({
    component: 'Dashboard-Requests',
    retryCount: 1,
  });

  const summaryData = getSummaryData();
  const completionChartData = getCompletionChartData();
  const pointsChartData = getPointsChartData();
  const rankProgressData = getRankProgressData();
  const isParent = user?.user_metadata?.role === 'parent';

  const fetchChores = async () => {
    if (isDemoMode) {
      // Use mock data in demo mode
      setChores(mockChores);
      return mockChores;
    }

    return executeChoreOperation(async () => {
      logger.info('Dashboard: Fetching chores', { page, itemsPerPage: ITEMS_PER_PAGE });
      
      const { data, error } = await supabase
        .from('chores')
        .select('id, name, description, points, created_at')
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)
        .order('created_at', { ascending: false });

      if (error) {
        logger.apiError('chores', error, { page });
        throw error;
      }

      logger.info('Dashboard: Chores fetched successfully', { 
        count: data?.length || 0,
        page 
      });
      
      setChores(data || []);
      return data;
    }, { action: 'fetch_chores', page });
  };

  const fetchCompletionRequests = async () => {
    if (!isParent) return;

    if (isDemoMode) {
      // Use mock data in demo mode
      setCompletionRequests([]);
      return [];
    }
    
    return executeRequestOperation(async () => {
      logger.info('Dashboard: Fetching completion requests');
      
      const { data, error } = await supabase
        .from('chore_completion_requests')
        .select(`
          id,
          chore_id,
          child_id,
          status,
          submitted_at,
          child:children(name),
          chore:chores(name, points)
        `)
        .eq('status', 'pending')
        .limit(5);

      if (error) {
        logger.apiError('chore_completion_requests', error);
        throw error;
      }

      logger.info('Dashboard: Completion requests fetched successfully', { 
        count: data?.length || 0 
      });
      
      setCompletionRequests(data || []);
      return data;
    }, { action: 'fetch_completion_requests' });
  };

  const handleChoreComplete = async () => {
    try {
      logger.userAction('chore_completion_submitted');
      await fetchCompletionRequests();
    } catch (error) {
      handleError(error, { action: 'handle_chore_complete' });
    }
  };

  const handleNewChoreSuccess = async () => {
    try {
      logger.userAction('new_chore_created');
      await fetchChores();
      setIsNewChoreModalOpen(false);
    } catch (error) {
      handleError(error, { action: 'handle_new_chore_success' });
    }
  };

  const handlePageChange = (newPage: number) => {
    logger.userAction('page_changed', { from: page, to: newPage });
    setPage(newPage);
  };

  useEffect(() => {
    fetchChores();
  }, [page, isDemoMode]);

  useEffect(() => {
    if (isParent) {
      fetchCompletionRequests();
    }
  }, [isParent, isDemoMode]);

  // Show error state if critical data failed to load
  if (choreError && !chores.length && !isDemoMode) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Unable to Load Dashboard
          </h2>
          <p className="text-red-600 mb-4">
            We're having trouble loading your dashboard data. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Demo Mode Indicator */}
      {isDemoMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div className="ml-3">
              <p className="text-blue-800 font-medium">
                Demo Mode - {user?.user_metadata?.role === 'parent' ? 'Parent View' : 'Child View'}
              </p>
              <p className="text-blue-600 text-sm">
                You're viewing a demonstration with sample data. Sign up to create your real account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {(choreLoading || requestLoading) && !isDemoMode && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Error indicators */}
      {requestError && !isDemoMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            Some completion requests may not be up to date. {requestError}
          </p>
        </div>
      )}

      {isParent && (
        <CompletionRequests 
          requests={completionRequests}
          onRequestUpdate={fetchCompletionRequests}
        />
      )}
      
      <StatusSummary 
        totalChores={summaryData.totalChores}
        completedToday={summaryData.completedToday}
        completedThisWeek={summaryData.completedThisWeek}
        pendingChores={summaryData.pendingChores}
        overdueChores={summaryData.overdueChores}
        completionPercentage={summaryData.completionPercentage}
      />
      
      <FamilyMembers members={familyMembers} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChoresList 
          chores={chores}
          onChoreComplete={handleChoreComplete}
        />
        <ActivityFeed activities={activities} />
      </div>
      
      <RewardsManagement rewards={rewards} rewardRequests={rewardRequests} />
      
      <PerformanceCharts 
        completionData={completionChartData}
        pointsData={pointsChartData}
        rankProgress={rankProgressData}
      />

      {/* Pagination - only show if not in demo mode */}
      {!isDemoMode && (
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => handlePageChange(Math.max(0, page - 1))}
            disabled={page === 0 || choreLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {page + 1}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={chores.length < ITEMS_PER_PAGE || choreLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      <NewChoreModal 
        isOpen={isNewChoreModalOpen}
        onClose={() => setIsNewChoreModalOpen(false)}
        onSuccess={handleNewChoreSuccess}
      />
    </div>
  );
};

export default Dashboard;