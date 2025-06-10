import React from 'react';
import RewardsManagement from '../components/Dashboard/RewardsManagement';
import { rewards, rewardRequests } from '../data/mockData';

const Rewards: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Rewards Management</h1>
      </div>
      <RewardsManagement rewards={rewards} rewardRequests={rewardRequests} />

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

export default Rewards;