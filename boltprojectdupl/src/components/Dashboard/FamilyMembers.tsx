import React from 'react';
import { FamilyMember } from '../../types';
import { CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react';

interface FamilyMemberCardProps {
  member: FamilyMember;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({ member }) => {
  const getRankColor = (rank: string) => {
    const rankColors: Record<string, string> = {
      'Recruit': 'gray',
      'Private': 'green',
      'Corporal': 'blue',
      'Sergeant': 'indigo',
      'Lieutenant': 'purple',
      'Captain': 'orange',
      'Major': 'amber',
      'Colonel': 'red',
      'General': 'yellow'
    };
    
    return rankColors[rank] || 'gray';
  };

  const rankColor = getRankColor(member.rank);
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:translate-y-[-4px]">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-100">
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
              }}
            />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
            <div className="flex items-center mt-1">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full bg-${rankColor}-100 text-${rankColor}-800`}>
                {member.rank}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {member.status === 'active' ? (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Online
                  </span>
                ) : (
                  `Last active: ${member.lastActive}`
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-600">
            <span className="font-semibold text-lg">{member.points}</span> 
            <span className="text-sm"> points</span>
          </div>
          <button className="flex items-center text-blue-600 text-sm hover:text-blue-800 transition-colors">
            <Plus size={16} className="mr-1" />
            Assign Chore
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-green-50 p-2">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle2 size={14} className="text-green-600 mr-1" />
              <span className="text-sm text-green-700">Done</span>
            </div>
            <p className="text-lg font-bold text-green-800">{member.completedChores}</p>
          </div>
          
          <div className="rounded-lg bg-amber-50 p-2">
            <div className="flex items-center justify-center mb-1">
              <Clock size={14} className="text-amber-600 mr-1" />
              <span className="text-sm text-amber-700">Pending</span>
            </div>
            <p className="text-lg font-bold text-amber-800">{member.pendingChores}</p>
          </div>
          
          <div className="rounded-lg bg-red-50 p-2">
            <div className="flex items-center justify-center mb-1">
              <AlertCircle size={14} className="text-red-600 mr-1" />
              <span className="text-sm text-red-700">Overdue</span>
            </div>
            <p className="text-lg font-bold text-red-800">{member.overdueChores}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FamilyMembersProps {
  members: FamilyMember[];
}

const FamilyMembers: React.FC<FamilyMembersProps> = ({ members }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Family Members</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <FamilyMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamilyMembers;