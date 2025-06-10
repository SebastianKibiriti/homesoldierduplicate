export type Rank = 'Recruit' | 'Private' | 'Corporal' | 'Sergeant' | 'Lieutenant' | 'Captain' | 'Major' | 'Colonel' | 'General';

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  rank: Rank;
  points: number;
  pendingChores: number;
  completedChores: number;
  overdueChores: number;
  lastActive: string;
  status: 'active' | 'offline';
}

export interface Chore {
  id: string;
  name: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  points: number;
  status: 'pending' | 'completed' | 'overdue';
  completedDate?: string;
  priority: 'low' | 'medium' | 'high';
  recurring?: boolean;
  recurrencePattern?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  available: boolean;
  timesRedeemed: number;
  image?: string;
}

export interface RewardRequest {
  id: string;
  rewardId: string;
  familyMemberId: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ActivityItem {
  id: string;
  type: 'chore_completed' | 'points_earned' | 'rank_achieved' | 'reward_requested' | 'chore_assigned';
  familyMemberId: string;
  timestamp: string;
  details: {
    choreId?: string;
    points?: number;
    rank?: Rank;
    rewardId?: string;
    assignedBy?: string;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}