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
  Bot
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

const ChildProfile: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const [activeTab, setActiveTab] = useState('identity');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);
  
  // Profile state
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [currentPoints, setCurrentPoints] = useState(450);
  const [currentRank, setCurrentRank] = useState(RANKS[3]); // Sergeant
  const [selectedCompanion, setSelectedCompanion] = useState(AI_COMPANIONS[0]);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [motivationalQuotes, setMotivationalQuotes] = useState(true);

  // Calculate next rank progress
  const nextRank = RANKS.find(rank => rank.pointsRequired > currentPoints) || RANKS[RANKS.length - 1];
  const progressPercentage = nextRank ? 
    ((currentPoints - currentRank.pointsRequired) / (nextRank.pointsRequired - currentRank.pointsRequired)) * 100 : 100;

  useEffect(() => {
    logger.info('ChildProfile: Page loaded', {
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

  const renderIdentityTab = () => (
    <div className="space-y-8">
      {/* Profile Image & Avatar */}
      <div className="text-center">
        <div className="relative inline-block">
          <div 
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg cursor-pointer hover:scale-105 transition-transform"
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
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <Camera size={16} />
          </button>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          {user?.user_metadata?.full_name || 'Young Soldier'}
        </h1>
        
        <div className="flex items-center justify-center mt-2">
          <span className="text-2xl mr-2">{currentRank.badge}</span>
          <span className={`text-xl font-semibold text-${currentRank.color}-600`}>
            {currentRank.name}
          </span>
        </div>
      </div>

      {/* Current Points */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-center text-white">
        <div className="flex items-center justify-center mb-2">
          <Star className="h-8 w-8 mr-2" />
          <span className="text-lg font-medium">Total Points</span>
        </div>
        <div className="text-4xl font-bold">{currentPoints.toLocaleString()}</div>
      </div>

      {/* Next Rank Progress */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Next Rank Progress</h3>
          <button 
            onClick={() => setShowRankModal(true)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            View All Ranks <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Progress to {nextRank.name}</span>
            <span className="text-sm font-medium text-gray-800">
              {currentPoints} / {nextRank.pointsRequired}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`bg-gradient-to-r from-${selectedTheme.primary}-400 to-${selectedTheme.secondary}-500 h-4 rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="text-center">
            <span className="text-lg font-semibold text-gray-800">
              {nextRank.pointsRequired - currentPoints} points to go!
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomizationTab = () => (
    <div className="space-y-8">
      {/* AI Companion Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Bot className="h-6 w-6 mr-2 text-blue-600" />
          My AI Companion
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {AI_COMPANIONS.map((companion) => (
            <button
              key={companion.id}
              onClick={() => handleCompanionSelect(companion)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCompanion.id === companion.id
                  ? `border-${companion.color}-500 bg-${companion.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{companion.icon}</div>
              <div className="font-medium text-gray-800">{companion.name}</div>
              <div className="text-sm text-gray-600">{companion.personality}</div>
            </button>
          ))}
        </div>
        
        {selectedCompanion && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{selectedCompanion.icon}</span>
              <div>
                <div className="font-medium text-blue-800">{selectedCompanion.name} says:</div>
                <div className="text-blue-700">
                  "Great job on your progress! Keep up the amazing work, soldier!"
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Theme Selection */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Palette className="h-6 w-6 mr-2 text-purple-600" />
          Choose Your Theme
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedTheme.id === theme.id
                  ? `border-${theme.primary}-500 bg-${theme.primary}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-full h-8 rounded mb-3 bg-gradient-to-r from-${theme.primary}-400 to-${theme.secondary}-500`}></div>
              <div className="font-medium text-gray-800">{theme.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sound & Notification Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Settings className="h-6 w-6 mr-2 text-gray-600" />
          Preferences
        </h3>
        
        <div className="space-y-4">
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
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
              <span className="font-medium text-gray-800">Motivational Messages</span>
            </div>
            <button
              onClick={() => setMotivationalQuotes(!motivationalQuotes)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                motivationalQuotes ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  motivationalQuotes ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r from-${selectedTheme.primary}-600 to-${selectedTheme.secondary}-700 text-white p-6`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Command Center</h1>
          <p className="text-lg opacity-90">Your personal mission control dashboard</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('identity')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'identity'
                  ? `text-${selectedTheme.primary}-600 border-b-2 border-${selectedTheme.primary}-600`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center">
                <Medal className="h-5 w-5 mr-2" />
                Identity Zone
              </div>
            </button>
            <button
              onClick={() => setActiveTab('customization')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'customization'
                  ? `text-${selectedTheme.primary}-600 border-b-2 border-${selectedTheme.primary}-600`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center">
                <Settings className="h-5 w-5 mr-2" />
                Customization
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto p-6">
        {activeTab === 'identity' && renderIdentityTab()}
        {activeTab === 'customization' && renderCustomizationTab()}
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Choose Your Avatar</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedAvatar.id === avatar.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2">
                      <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <div className="text-lg mb-1">{avatar.icon}</div>
                      <div className="font-medium text-gray-800">{avatar.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rank Ladder Modal */}
      {showRankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Rank Ladder</h2>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {RANKS.map((rank, index) => (
                  <div
                    key={rank.name}
                    className={`flex items-center p-3 rounded-lg ${
                      currentRank.name === rank.name
                        ? 'bg-yellow-100 border-2 border-yellow-400'
                        : currentPoints >= rank.pointsRequired
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className="text-2xl mr-3">{rank.badge}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{rank.name}</div>
                      <div className="text-sm text-gray-600">
                        {rank.pointsRequired.toLocaleString()} points
                      </div>
                    </div>
                    {currentRank.name === rank.name && (
                      <Crown className="h-5 w-5 text-yellow-600" />
                    )}
                    {currentPoints >= rank.pointsRequired && currentRank.name !== rank.name && (
                      <Trophy className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowRankModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

export default ChildProfile;