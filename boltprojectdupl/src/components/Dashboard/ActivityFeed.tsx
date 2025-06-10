import React from 'react';
import { format, parseISO } from 'date-fns';
import { ActivityItem } from '../../types';
import { CheckCircle, Award, TrendingUp, Gift, ClipboardCheck } from 'lucide-react';
import { familyMembers, chores, rewards } from '../../data/mockData';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getMemberName = (id: string) => {
    const member = familyMembers.find(m => m.id === id);
    return member ? member.name : 'Unknown';
  };
  
  const getChoreName = (id?: string) => {
    if (!id) return 'Unknown';
    const chore = chores.find(c => c.id === id);
    return chore ? chore.name : 'Unknown';
  };
  
  const getRewardName = (id?: string) => {
    if (!id) return 'Unknown';
    const reward = rewards.find(r => r.id === id);
    return reward ? reward.name : 'Unknown';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chore_completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'points_earned':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'rank_achieved':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'reward_requested':
        return <Gift className="h-5 w-5 text-purple-500" />;
      case 'chore_assigned':
        return <ClipboardCheck className="h-5 w-5 text-indigo-500" />;
      default:
        return null;
    }
  };
  
  const getActivityMessage = (activity: ActivityItem) => {
    const name = getMemberName(activity.familyMemberId);
    
    switch (activity.type) {
      case 'chore_completed':
        return (
          <span>
            <span className="font-medium">{name}</span> completed{' '}
            <span className="font-medium">{getChoreName(activity.details.choreId)}</span>
          </span>
        );
      case 'points_earned':
        return (
          <span>
            <span className="font-medium">{name}</span> earned{' '}
            <span className="font-medium">{activity.details.points} points</span>
          </span>
        );
      case 'rank_achieved':
        return (
          <span>
            <span className="font-medium">{name}</span> reached the rank of{' '}
            <span className="font-medium">{activity.details.rank}</span>
          </span>
        );
      case 'reward_requested':
        return (
          <span>
            <span className="font-medium">{name}</span> requested{' '}
            <span className="font-medium">{getRewardName(activity.details.rewardId)}</span>
          </span>
        );
      case 'chore_assigned':
        return (
          <span>
            <span className="font-medium">{name}</span> was assigned{' '}
            <span className="font-medium">{getChoreName(activity.details.choreId)}</span>
          </span>
        );
      default:
        return null;
    }
  };

  const formatActivityTime = (timestamp: string) => {
    return format(parseISO(timestamp), 'MMM d, h:mm a');
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <li key={activity.id} className="py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm text-gray-900">
                      {getActivityMessage(activity)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {formatActivityTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;