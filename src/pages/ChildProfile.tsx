import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Medal, 
  Star, 
  Trophy, 
  Target, 
  Settings, 
  Camera, 
  ChevronRight,
  Zap,
  Crown,
  Shield,
  Sword,
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  Palette,
  Bot,
  Award,
  Gift,
  BarChart3,
  MessageCircle,
  HelpCircle,
  Calendar,
  Flame,
  TrendingUp,
  CheckCircle2,
  X,
  ArrowRight,
  Users,
  Clock
} from 'lucide-react';
import { logger } from '../utils/logger';

// Mock data for ranks and avatars
const RANKS = [
  { name: 'Recruit', pointsRequired: 0, badge: '🎖️', color: 'gray' },
  { name: 'Private', pointsRequired: 100, badge: '🏅', color: 'green' },
  { name: 'Corporal', pointsRequired: 250, badge: '🎗️', color: 'blue' },
  { name: 'Sergeant', pointsRequired: 500, badge: '🏆', color: 'indigo' },
  { name: 'Lieutenant', pointsRequired: 1000, badge: '👑', color: 'purple' },
  { name: 'Captain', pointsRequired: 2000, badge: '⭐', color: 'orange' },
  { name: 'Major', pointsRequired: 4000, badge: '💎', color: 'amber' },
  { name: 'Colonel', pointsRequired: 8000, badge: '🌟', color: 'red' },
  { name: 'General', pointsRequired: 15000, badge: '👨‍✈️', color: 'yellow' }
];

const AVATARS = [
  { id: 1, name: 'Knight', icon: '🛡️', image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 2, name: 'Warrior', icon: '⚔️', image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 3, name: 'Mage', icon: '🧙‍♂️', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 4, name: 'Archer', icon: '🏹', image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 5, name: 'Paladin', icon: '🛡️', image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 6, name: 'Ninja', icon: '🥷', image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150' }
];

const AI_COMPANIONS = [
  { id: 1, name: 'Buddy Bot', personality: 'Encouraging', icon: '🤖', color: 'blue' },
  { id: 2, name: 'Spark', personality: 'Energetic', icon: '⚡', color: 'yellow' },
  { id: 3, name: 'Wise Owl', personality: 'Thoughtful', icon: '🦉', color: 'purple' },
  { id: 4, name: 'Captain Courage', personality: 'Brave', icon: '🦸‍♂️', color: 'red' }
];

const THEMES = [
  { id: 1, name: 'Military Green', primary: 'green', secondary: 'emerald' },
  { id: 2, name: 'Royal Blue', primary: 'blue', secondary: 'indigo' },
  { id: 3, name: 'Fire Red', primary: 'red', secondary: 'orange' },
  { id: 4, name: 'Purple Magic', primary: 'purple', secondary: 'violet' },
  { id: 5, name: 'Golden Glory', primary: 'yellow', secondary: 'amber' }
];

const RECENT_ACHIEVEMENTS = [
  { id: 1, name: 'First Mission', icon: '🎯', description: 'Completed your first chore', date: '2 days ago' },
  { id: 2, name: 'Streak Master', icon: '🔥', description: '5 days in a row!', date: '1 week ago' },
  { id: 3, name: 'Point Collector', icon: '💰', description: 'Earned 100 points', date: '2 weeks ago' }
];

const LIFETIME_STATS = {
  totalChoresCompleted: 47,
  totalPointsEarned: 1250,
  longestStreak: 12,
  rewardsRedeemed: 8
};

const REWARD_HISTORY = [
  { id: 1, name: 'Extra Screen Time', date: '3 days ago', points: 50 },
  { id: 2, name: 'Pizza Night Choice', date: '1 week ago', points: 100 },
  { id: 3, name: 'Movie Selection', date: '2 weeks ago', points: 75 }
];

const ChildProfile: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  
  // Profile state
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [currentPoints, setCurrentPoints] = useState(450);
  const [currentRank, setCurrentRank] = useState(RANKS[3]); // Sergeant
  const [selectedCompanion, setSelectedCompanion] = useState(AI_COMPANIONS[0]);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(75);
  const [motivationalQuotes, setMotivationalQuotes] = useState(true);

  // Calculate next rank progress
  const nextRank = RANKS.find(rank => rank.pointsRequired > currentPoints) || RANKS[RANKS.length - 1];
  const progressPercentage = nextRank ? 
    ((currentPoints - currentRank.pointsRequired) / (nextRank.pointsRequired - currentRank.pointsRequired)) * 100 : 100;

  const pointsNeeded = nextRank.pointsRequired - currentPoints;

  useEffect(() => {
    logger.info('ChildProfile: Mission Hub loaded', {
      userId: user?.id,
      isDemoMode,
      currentPoints,
      currentRank: currentRank.name
    });
  }, [user, isDemoMode, currentPoints, currentRank]);

  const handleAvatarSelect = (avatar: typeof AVATARS[0]) => {
    setSelectedAvatar(avatar);
    setShowAvatarModal(false);
    logger.userAction('avatar_changed', { avatarId: avatar.id, avatarName: avatar.name });
  };

  const handleCompanionSelect = (companion: typeof AI_COMPANIONS[0]) => {
    setSelectedCompanion(companion);
    logger.userAction('companion_changed', { companionId: companion.id, companionName: companion.name });
  };

  const handleThemeSelect = (theme: typeof THEMES[0]) => {
    setSelectedTheme(theme);
    logger.userAction('theme_changed', { themeId: theme.id, themeName: theme.name });
  };

  const handleAskParentForHelp = () => {
    logger.userAction('ask_parent_for_help');
    alert('Help request sent to parent! 📨');
  };

  const handleReportIssue = () => {
    logger.userAction('report_issue');
    alert('Issue reported to parent! 🚨');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Floating Card Container */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl mx-auto overflow-hidden">
        
        {/* Top Banner / Identity Zone */}
        <div className={`bg-gradient-to-br from-${selectedTheme.primary}-600 via-${selectedTheme.primary}-700 to-${selectedTheme.secondary}-800 text-white p-8 relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0ME0gMCAzMCBMIDQwIDMwIE0gMzAgMCBMIDMwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
          </div>
          
          <div className="relative text-center">
            {/* Profile Image / Custom Avatar */}
            <div className="relative inline-block mb-6">
              <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setShowAvatarModal(true)}
              >
                <img 
                  src={selectedAvatar.image} 
                  alt={selectedAvatar.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={() => setShowAvatarModal(true)}
                className="absolute bottom-2 right-2 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <Camera size={16} />
              </button>
            </div>
            
            {/* Child's Name */}
            <h1 className="text-4xl font-bold mb-2">
              {user?.user_metadata?.full_name || 'Young Soldier'}
            </h1>
            
            {/* Current Army Rank & Badge */}
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">{currentRank.badge}</span>
              <div className="text-center">
                <span className="text-2xl font-bold block">{currentRank.name}</span>
                <span className="text-sm opacity-90">Current Rank</span>
              </div>
            </div>

            {/* Current Point Balance */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 mr-2 text-yellow-300" />
                <span className="text-lg font-medium">Total Points</span>
              </div>
              <div className="text-5xl font-bold text-yellow-300">{currentPoints.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8 space-y-8">
          
          {/* Progress & Goal Tracking */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Target className="h-6 w-6 mr-2 text-blue-600" />
                Next Rank Mission
              </h3>
              <button 
                onClick={() => setShowRankModal(true)}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
              >
                View Rank Ladder <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Progress to {nextRank.name}</span>
                <span className="text-lg font-bold text-gray-800">
                  {currentPoints} / {nextRank.pointsRequired}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-${selectedTheme.primary}-400 to-${selectedTheme.secondary}-500 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-2`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                >
                  {progressPercentage > 20 && (
                    <span className="text-white text-xs font-bold">
                      {Math.round(progressPercentage)}%
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600">
                  {pointsNeeded} points to go!
                </span>
                <p className="text-gray-600 mt-1">Keep up the great work, soldier! 🎯</p>
              </div>
            </div>
          </div>

          {/* Personal Experience Customization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* My AI Companion Settings */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-200 transition-colors">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Bot className="h-6 w-6 mr-2 text-blue-600" />
                My AI Companion
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{selectedCompanion.icon}</div>
                <div className="font-bold text-gray-800">{selectedCompanion.name}</div>
                <div className="text-sm text-gray-600">{selectedCompanion.personality}</div>
              </div>
              
              <button
                onClick={() => {/* Open AI selection modal */}}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Change AI Voice
              </button>
              
              {selectedCompanion && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{selectedCompanion.icon}</span>
                    <div>
                      <div className="font-medium text-blue-800">{selectedCompanion.name} says:</div>
                      <div className="text-blue-700 text-sm">
                        "Outstanding progress, soldier! Your dedication is inspiring! 🌟"
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* App Theme & Sound Settings */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-purple-200 transition-colors">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Palette className="h-6 w-6 mr-2 text-purple-600" />
                Customize Experience
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => {/* Open theme selection */}}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl hover:bg-purple-700 transition-colors font-medium"
                >
                  Customize App Look
                </button>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {soundEnabled ? <Volume2 className="h-5 w-5 mr-2 text-green-600" /> : <VolumeX className="h-5 w-5 mr-2 text-gray-400" />}
                      <span className="font-medium text-gray-800">Sound Effects</span>
                    </div>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        soundEnabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          soundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {soundEnabled && (
                    <div className="ml-7">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={soundVolume}
                        onChange={(e) => setSoundVolume(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-xs text-gray-500 mt-1">Volume: {soundVolume}%</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements & Rewards Hub */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Award className="h-6 w-6 mr-2 text-yellow-600" />
                Achievements & Rewards
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recently Earned Badges */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Recent Achievements</h4>
                <div className="space-y-3">
                  {RECENT_ACHIEVEMENTS.map((achievement) => (
                    <div key={achievement.id} className="flex items-center bg-white rounded-xl p-3 shadow-sm">
                      <span className="text-2xl mr-3">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{achievement.name}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                        <div className="text-xs text-gray-500">{achievement.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowAchievementsModal(true)}
                  className="w-full mt-4 bg-yellow-600 text-white py-2 px-4 rounded-xl hover:bg-yellow-700 transition-colors font-medium"
                >
                  View All Awards
                </button>
              </div>
              
              {/* Rewards Section */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Rewards Center</h4>
                <div className="bg-white rounded-xl p-4 text-center">
                  <Gift className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">Ready to redeem your points?</p>
                  <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors font-medium mb-2">
                    Browse Rewards
                  </button>
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors font-medium">
                    Redeem Rewards
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Performance & History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Lifetime Statistics */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-indigo-600" />
                Lifetime Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">{LIFETIME_STATS.totalChoresCompleted}</div>
                  <div className="text-sm text-gray-600">Chores Completed</div>
                </div>
                <div className="text-center bg-green-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">{LIFETIME_STATS.totalPointsEarned.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                <div className="text-center bg-orange-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-orange-600 flex items-center justify-center">
                    <Flame className="h-6 w-6 mr-1" />
                    {LIFETIME_STATS.longestStreak}
                  </div>
                  <div className="text-sm text-gray-600">Longest Streak</div>
                </div>
                <div className="text-center bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">{LIFETIME_STATS.rewardsRedeemed}</div>
                  <div className="text-sm text-gray-600">Rewards Earned</div>
                </div>
              </div>
            </div>

            {/* Reward Redemption History */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-green-600" />
                Recent Rewards
              </h3>
              
              <div className="space-y-3">
                {REWARD_HISTORY.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div>
                      <div className="font-medium text-gray-800">{reward.name}</div>
                      <div className="text-sm text-gray-600">{reward.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{reward.points} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Parent Communication / Support */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-green-600" />
              Mission Support
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Parent-Set Personal Goal/Note */}
              <div className="bg-white rounded-xl p-4 border-l-4 border-green-500">
                <div className="flex items-center mb-2">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <span className="font-medium text-gray-700">Message from Command</span>
                </div>
                <p className="text-gray-800 italic">
                  "You're doing amazing, soldier! Keep pushing towards that Sergeant rank. 
                  I'm so proud of your dedication and hard work! 🌟"
                </p>
                <p className="text-sm text-gray-500 mt-2">- Your Mission Commander</p>
              </div>
              
              {/* Support Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAskParentForHelp}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Ask Parent for Help
                </button>
                <button
                  onClick={handleReportIssue}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors font-medium flex items-center justify-center"
                >
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Choose Your Avatar</h2>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedAvatar.id === avatar.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 shadow-md">
                      <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">{avatar.icon}</div>
                      <div className="font-medium text-gray-800">{avatar.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rank Ladder Modal */}
      {showRankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Rank Ladder</h2>
              <button
                onClick={() => setShowRankModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {RANKS.map((rank, index) => (
                  <div
                    key={rank.name}
                    className={`flex items-center p-4 rounded-xl transition-all ${
                      currentRank.name === rank.name
                        ? 'bg-yellow-100 border-2 border-yellow-400 shadow-lg'
                        : currentPoints >= rank.pointsRequired
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className="text-3xl mr-4">{rank.badge}</span>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{rank.name}</div>
                      <div className="text-sm text-gray-600">
                        {rank.pointsRequired.toLocaleString()} points required
                      </div>
                    </div>
                    {currentRank.name === rank.name && (
                      <Crown className="h-6 w-6 text-yellow-600" />
                    )}
                    {currentPoints >= rank.pointsRequired && currentRank.name !== rank.name && (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Modal */}
      {showAchievementsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Achievement Cabinet</h2>
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RECENT_ACHIEVEMENTS.map((achievement) => (
                  <div key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <div className="font-bold text-gray-800 mb-1">{achievement.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{achievement.description}</div>
                      <div className="text-xs text-gray-500">{achievement.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildProfile;