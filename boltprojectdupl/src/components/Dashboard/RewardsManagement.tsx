import React from 'react';
import { Reward, RewardRequest } from '../../types';
import { Gift, CheckCircle, XCircle } from 'lucide-react';
import { familyMembers } from '../../data/mockData';

interface RewardsManagementProps {
  rewards: Reward[];
  rewardRequests: RewardRequest[];
}

const RewardsManagement: React.FC<RewardsManagementProps> = ({ rewards, rewardRequests }) => {
  const pendingRequests = rewardRequests.filter(request => request.status === 'pending');
  
  const getFamilyMemberName = (id: string): string => {
    const member = familyMembers.find(m => m.id === id);
    return member ? member.name : 'Unknown';
  };
  
  const getRewardName = (id: string): string => {
    const reward = rewards.find(r => r.id === id);
    return reward ? reward.name : 'Unknown';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Rewards & Redemptions</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Add New Reward
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Available Rewards</h3>
            <div className="space-y-4">
              {rewards.map(reward => (
                <div key={reward.id} className="flex items-center border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  {reward.image ? (
                    <div className="w-12 h-12 relative rounded overflow-hidden bg-gray-100">
                      <img 
                        src={reward.image} 
                        alt={reward.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='100%' height='100%' fill='%23f3f4f6'/></svg>`;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Gift className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  
                  <div className="flex-1 ml-4">
                    <h4 className="text-md font-semibold text-gray-800">{reward.name}</h4>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{reward.pointsCost}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Pending Reward Requests</h3>
            
            {pendingRequests.length === 0 ? (
              <div className="border border-gray-200 rounded-lg p-8 text-center">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending reward requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map(request => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {getFamilyMemberName(request.familyMemberId)} requested:
                        </h4>
                        <p className="text-blue-600 font-semibold">{getRewardName(request.rewardId)}</p>
                      </div>
                      <div className="bg-yellow-100 px-2 py-1 rounded text-xs font-medium text-yellow-800">
                        Pending
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 justify-end">
                      <button className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                        <CheckCircle size={16} className="mr-1" />
                        <span className="text-sm">Approve</span>
                      </button>
                      
                      <button className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                        <XCircle size={16} className="mr-1" />
                        <span className="text-sm">Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {pendingRequests.length > 0 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All Requests
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsManagement;