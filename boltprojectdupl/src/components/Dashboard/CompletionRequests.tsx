import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CompletionRequest {
  id: string;
  chore_id: string;
  child_id: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  child: {
    name: string;
  };
  chore: {
    name: string;
    points: number;
  };
}

interface CompletionRequestsProps {
  requests: CompletionRequest[];
  onRequestUpdate: () => void;
}

const CompletionRequests: React.FC<CompletionRequestsProps> = ({ requests, onRequestUpdate }) => {
  const handleApprove = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('chore_completion_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;
      onRequestUpdate();
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('chore_completion_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;
      onRequestUpdate();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  };

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Completion Requests</h2>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">
                    {request.child.name} has completed:
                  </p>
                  <p className="font-medium text-gray-900">{request.chore.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Worth {request.chore.points} points
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle size={16} className="mr-1" />
                    <span className="text-sm">Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    <XCircle size={16} className="mr-1" />
                    <span className="text-sm">Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletionRequests;