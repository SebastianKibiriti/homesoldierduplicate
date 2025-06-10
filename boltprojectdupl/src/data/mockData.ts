import { FamilyMember, Chore, Reward, ActivityItem, RewardRequest, Rank } from '../types';
import { subDays, format, addDays } from 'date-fns';

// Helper function to generate dates
const getDate = (daysAgo: number) => format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
const getFutureDate = (daysAhead: number) => format(addDays(new Date(), daysAhead), 'yyyy-MM-dd');

// Family Members Data
export const familyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'Alex',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 'Sergeant',
    points: 450,
    pendingChores: 3,
    completedChores: 12,
    overdueChores: 1,
    lastActive: getDate(0),
    status: 'active'
  },
  {
    id: '2',
    name: 'Jamie',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 'Corporal',
    points: 320,
    pendingChores: 2,
    completedChores: 8,
    overdueChores: 0,
    lastActive: getDate(0),
    status: 'active'
  },
  {
    id: '3',
    name: 'Taylor',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 'Private',
    points: 175,
    pendingChores: 4,
    completedChores: 5,
    overdueChores: 2,
    lastActive: getDate(1),
    status: 'offline'
  }
];

// Chores Data
export const chores: Chore[] = [
  {
    id: '1',
    name: 'Take out the trash',
    description: 'Empty all trash cans and take to the curb',
    assignedTo: '1',
    dueDate: getDate(0),
    points: 10,
    status: 'pending',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Clean bedroom',
    description: 'Make bed, put away clothes, and vacuum',
    assignedTo: '1',
    dueDate: getFutureDate(1),
    points: 20,
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '3',
    name: 'Do the dishes',
    description: 'Wash, dry, and put away all dishes',
    assignedTo: '2',
    dueDate: getFutureDate(0),
    points: 15,
    status: 'pending',
    priority: 'high'
  },
  {
    id: '4',
    name: 'Mow the lawn',
    description: 'Cut grass and trim edges',
    assignedTo: '1',
    dueDate: getDate(2),
    points: 30,
    status: 'overdue',
    priority: 'medium'
  },
  {
    id: '5',
    name: 'Feed the dog',
    description: 'Give fresh food and water',
    assignedTo: '3',
    dueDate: getDate(1),
    points: 5,
    status: 'overdue',
    priority: 'high'
  },
  {
    id: '6',
    name: 'Fold laundry',
    description: 'Fold clean clothes and put them away',
    assignedTo: '2',
    dueDate: getFutureDate(2),
    points: 15,
    status: 'pending',
    priority: 'low'
  },
  {
    id: '7',
    name: 'Clean bathroom',
    description: 'Clean toilet, sink, and shower',
    assignedTo: '3',
    dueDate: getDate(3),
    points: 25,
    status: 'completed',
    completedDate: getDate(3),
    priority: 'medium'
  },
  {
    id: '8',
    name: 'Vacuum living room',
    description: 'Vacuum floors and dust furniture',
    assignedTo: '3',
    dueDate: getFutureDate(3),
    points: 20,
    status: 'pending',
    priority: 'medium'
  }
];

// Rewards Data
export const rewards: Reward[] = [
  {
    id: '1',
    name: 'Extra Screen Time',
    description: '30 minutes of additional screen time',
    pointsCost: 50,
    available: true,
    timesRedeemed: 12,
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Pizza Night',
    description: 'Choose pizza for dinner',
    pointsCost: 100,
    available: true,
    timesRedeemed: 5,
    image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Movie Night',
    description: 'Pick a movie for family movie night',
    pointsCost: 150,
    available: true,
    timesRedeemed: 3,
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '4',
    name: 'Skip One Chore',
    description: 'Skip one assigned chore of your choice',
    pointsCost: 200,
    available: true,
    timesRedeemed: 2,
    image: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

// Reward Requests
export const rewardRequests: RewardRequest[] = [
  {
    id: '1',
    rewardId: '1',
    familyMemberId: '1',
    requestDate: getDate(0),
    status: 'pending'
  },
  {
    id: '2',
    rewardId: '2',
    familyMemberId: '2',
    requestDate: getDate(1),
    status: 'pending'
  }
];

// Activity Feed Data
export const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'chore_completed',
    familyMemberId: '1',
    timestamp: getDate(0) + 'T10:30:00',
    details: {
      choreId: '7',
      points: 25
    }
  },
  {
    id: '2',
    type: 'points_earned',
    familyMemberId: '1',
    timestamp: getDate(0) + 'T10:31:00',
    details: {
      points: 25
    }
  },
  {
    id: '3',
    type: 'reward_requested',
    familyMemberId: '1',
    timestamp: getDate(0) + 'T14:15:00',
    details: {
      rewardId: '1'
    }
  },
  {
    id: '4',
    type: 'chore_completed',
    familyMemberId: '2',
    timestamp: getDate(1) + 'T09:45:00',
    details: {
      choreId: '3',
      points: 15
    }
  },
  {
    id: '5',
    type: 'rank_achieved',
    familyMemberId: '2',
    timestamp: getDate(1) + 'T09:46:00',
    details: {
      rank: 'Corporal'
    }
  },
  {
    id: '6',
    type: 'chore_assigned',
    familyMemberId: '3',
    timestamp: getDate(2) + 'T18:20:00',
    details: {
      choreId: '8',
      assignedBy: 'parent'
    }
  }
];

// Chart Data
export const getCompletionChartData = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return {
    labels: days,
    datasets: [
      {
        label: 'Alex',
        data: [3, 2, 1, 2, 3, 1, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Jamie',
        data: [2, 1, 2, 1, 1, 1, 0],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
        label: 'Taylor',
        data: [1, 1, 0, 1, 1, 1, 0],
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1
      }
    ]
  };
};

export const getPointsChartData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return {
    labels: months,
    datasets: [
      {
        label: 'Alex',
        data: [65, 120, 190, 270, 350, 450],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Jamie',
        data: [40, 80, 130, 190, 260, 320],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Taylor',
        data: [20, 40, 70, 100, 140, 175],
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };
};

export const getRankProgressData = () => {
  const ranks: Rank[] = ['Recruit', 'Private', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain', 'Major', 'Colonel', 'General'];
  
  return {
    alex: ranks.indexOf('Sergeant') + 1,
    jamie: ranks.indexOf('Corporal') + 1,
    taylor: ranks.indexOf('Private') + 1,
    total: ranks.length
  };
};

// Summary data
export const getSummaryData = () => {
  const totalChores = chores.length;
  const completedToday = chores.filter(chore => 
    chore.status === 'completed' && chore.completedDate === getDate(0)).length;
  const completedThisWeek = chores.filter(chore => 
    chore.status === 'completed').length;
  const pendingChores = chores.filter(chore => 
    chore.status === 'pending').length;
  const overdueChores = chores.filter(chore => 
    chore.status === 'overdue').length;
  
  const completionPercentage = Math.round((completedThisWeek / totalChores) * 100);
  
  return {
    totalChores,
    completedToday,
    completedThisWeek,
    pendingChores,
    overdueChores,
    completionPercentage
  };
};