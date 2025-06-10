import React, { useState } from 'react';
import { Chore } from '../../types';
import { format, isAfter } from 'date-fns';
import { Clock, AlertCircle, Edit, CheckSquare, Trash2, Filter, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';
import { logger } from '../../utils/logger';

interface ChoresListProps {
  chores: Chore[];
  onChoreComplete?: (choreId: string) => void;
}

const ChoresList: React.FC<ChoresListProps> = ({ chores, onChoreComplete }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue'>('all');
  const { user } = useAuth();
  const { handleError } = useErrorHandler({ component: 'ChoresList' });
  
  const {
    loading: submissionLoading,
    execute: executeSubmission
  } = useAsyncOperation({
    component: 'ChoresList-Submission',
    onSuccess: () => {
      logger.userAction('chore_completion_request_submitted');
    },
    onError: (error) => {
      logger.error('Failed to submit chore completion request', { error });
    }
  });

  const isChild = user?.user_metadata?.role === 'child';
  
  const filteredChores = chores.filter(chore => {
    if (filter === 'all') return chore.status !== 'completed';
    if (filter === 'pending') return chore.status === 'pending';
    if (filter === 'overdue') return chore.status === 'overdue';
    return true;
  });

  const handleCompleteChore = async (choreId: string) => {
    if (submissionLoading) return;

    await executeSubmission(async () => {
      logger.info('ChoresList: Submitting completion request', { choreId });

      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('id')
        .eq('parent_id', user?.id)
        .single();

      if (childError) {
        logger.apiError('children', childError, { action: 'find_child' });
        throw new Error('Unable to find your profile. Please contact support.');
      }

      if (!childData?.id) {
        throw new Error('Child record not found. Please contact support.');
      }

      const { error: insertError } = await supabase
        .from('chore_completion_requests')
        .insert({
          chore_id: choreId,
          child_id: childData.id,
          status: 'pending'
        });

      if (insertError) {
        logger.apiError('chore_completion_requests', insertError, { choreId });
        throw insertError;
      }

      // Show success message
      if (typeof window !== 'undefined') {
        // In a real app, you'd use a toast library
        console.log('Completion request sent to parent!');
      }

      onChoreComplete?.(choreId);
    }, { choreId });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Low</span>;
      default:
        return null;
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'pending' | 'overdue') => {
    logger.userAction('chores_filter_changed', { from: filter, to: newFilter });
    setFilter(newFilter);
  };

  // Show error state if no chores and we're not loading
  if (!chores.length && !submissionLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming & Overdue Chores</h2>
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No chores available</p>
            <p className="text-sm text-gray-400">
              {isChild ? 'Ask your parent to assign some chores!' : 'Create some chores to get started.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Upcoming & Overdue Chores</h2>
          
          <div className="flex items-center">
            <div className="relative inline-block text-left mr-2">
              <button 
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={submissionLoading}
              >
                <Filter size={16} className="mr-1" />
                <span>Filter</span>
              </button>
            </div>
            
            <div className="flex rounded-md overflow-hidden border border-gray-300">
              <button
                className={`px-3 py-1 text-sm transition-colors ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleFilterChange('all')}
                disabled={submissionLoading}
              >
                All
              </button>
              <button
                className={`px-3 py-1 text-sm transition-colors ${
                  filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleFilterChange('pending')}
                disabled={submissionLoading}
              >
                Pending
              </button>
              <button
                className={`px-3 py-1 text-sm transition-colors ${
                  filter === 'overdue' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleFilterChange('overdue')}
                disabled={submissionLoading}
              >
                Overdue
              </button>
            </div>
          </div>
        </div>
        
        {filteredChores.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No chores match the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chore
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredChores.map((chore) => (
                  <tr key={chore.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{chore.name}</div>
                      <div className="text-xs text-gray-500">{chore.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {chore.assignedTo === '1' ? 'Alex' : 
                         chore.assignedTo === '2' ? 'Jamie' : 'Taylor'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {chore.dueDate ? format(new Date(chore.dueDate), 'MMM dd, yyyy') : 'No due date'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{chore.points}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(chore.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {chore.status === 'pending' ? (
                        <div className="flex items-center">
                          <Clock size={16} className="text-amber-500 mr-1" />
                          <span className="text-sm text-amber-600">Pending</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <AlertCircle size={16} className="text-red-500 mr-1" />
                          <span className="text-sm text-red-600">Overdue</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {!isChild && (
                          <>
                            <button 
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                              disabled={submissionLoading}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              disabled={submissionLoading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                        {isChild && (
                          <button 
                            onClick={() => handleCompleteChore(chore.id)}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mark as completed"
                            disabled={submissionLoading}
                          >
                            {submissionLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <CheckSquare size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChoresList;