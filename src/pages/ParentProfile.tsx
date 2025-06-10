import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  CreditCard, 
  Users, 
  Settings, 
  Bot, 
  Gift, 
  HelpCircle, 
  FileText, 
  LogOut,
  Edit,
  Plus,
  Crown,
  Star,
  Camera,
  Volume2,
  VolumeX,
  Palette,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Trash2,
  MessageSquare,
  Calendar,
  BarChart3,
  Target,
  Award
} from 'lucide-react';
import { logger } from '../utils/logger';

// Mock data for subscription plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Basic',
    price: 'Free',
    features: [
      'Up to 3 children',
      'Basic chore management',
      'Standard rewards system',
      'Core rank progression'
    ],
    current: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$4.99/mo',
    features: [
      'Unlimited children',
      'Advanced chore scheduling',
      'Custom rewards creation',
      'Detailed analytics',
      'Priority support',
      'Custom AI personalities'
    ],
    current: false
  }
];

// Mock children data
const MOCK_CHILDREN = [
  {
    id: '1',
    name: 'Alex',
    age: 12,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 'Sergeant',
    points: 450,
    aiCompanion: 'Buddy Bot',
    parentGoal: 'Keep up the great work! Aim for Lieutenant rank this month.'
  },
  {
    id: '2',
    name: 'Jamie',
    age: 9,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 'Corporal',
    points: 320,
    aiCompanion: 'Captain Courage',
    parentGoal: 'Focus on completing chores consistently every day.'
  }
];

const AI_PERSONALITIES = [
  { id: 1, name: 'Buddy Bot', personality: 'Encouraging', icon: '🤖' },
  { id: 2, name: 'Spark', personality: 'Energetic', icon: '⚡' },
  { id: 3, name: 'Wise Owl', personality: 'Thoughtful', icon: '🦉' },
  { id: 4, name: 'Captain Courage', personality: 'Brave', icon: '🦸‍♂️' }
];

const NOTIFICATION_SETTINGS = [
  { id: 'chore_completed', label: 'Chore Completed', description: 'When a child completes a chore', enabled: true },
  { id: 'reward_requested', label: 'Reward Requested', description: 'When a child requests a reward', enabled: true },
  { id: 'child_login', label: 'Child Login', description: 'When a child logs into the app', enabled: false },
  { id: 'weekly_summary', label: 'Weekly Summary', description: 'Weekly progress reports', enabled: true },
  { id: 'rank_promotion', label: 'Rank Promotions', description: 'When a child achieves a new rank', enabled: true }
];

interface ParentProfileProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ParentProfile: React.FC<ParentProfileProps> = ({ isOpen = true, onClose }) => {
  const { user, signOut, isDemoMode } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [children, setChildren] = useState(MOCK_CHILDREN);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(NOTIFICATION_SETTINGS);
  
  // Form states
  const [parentName, setParentName] = useState(user?.user_metadata?.full_name || 'Parent User');
  const [parentEmail, setParentEmail] = useState(user?.email || 'parent@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    logger.info('ParentProfile: Command Center loaded', {
      userId: user?.id,
      isDemoMode,
      childrenCount: children.length
    });
  }, [user, isDemoMode, children]);

  const handleSaveProfile = () => {
    logger.userAction('parent_profile_updated', { name: parentName, email: parentEmail });
    alert('Profile updated successfully! ✅');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    logger.userAction('password_changed');
    alert('Password changed successfully! 🔒');
    setShowPasswordChange(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNotificationToggle = (settingId: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
    logger.userAction('notification_setting_changed', { settingId });
  };

  const handleChildGoalUpdate = (childId: string, goal: string) => {
    setChildren(prev => 
      prev.map(child => 
        child.id === childId 
          ? { ...child, parentGoal: goal }
          : child
      )
    );
    logger.userAction('child_goal_updated', { childId, goal });
  };

  const handleDeleteAccount = () => {
    logger.userAction('account_deletion_requested');
    alert('Account deletion request submitted. You will receive a confirmation email.');
    setShowDeleteConfirm(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      logger.userAction('parent_logout');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0ME0gMCAzMCBMIDQwIDMwIE0gMzAgMCBMIDMwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
          </div>
          
          <div className="relative flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Command Center Settings</h1>
              <p className="text-blue-100">Manage your family's Home Soldier experience</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <X size={28} />
              </button>
            )}
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          
          {/* Sidebar Navigation */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <nav className="p-4 space-y-2">
              <button
                onClick={() => setActiveSection('account')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                  activeSection === 'account' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="h-5 w-5 mr-3" />
                Account & Security
              </button>
              
              <button
                onClick={() => setActiveSection('subscription')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                  activeSection === 'subscription' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="h-5 w-5 mr-3" />
                Subscription & Billing
              </button>
              
              <button
                onClick={() => setActiveSection('family')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                  activeSection === 'family' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5 mr-3" />
                Family Management
              </button>
              
              <button
                onClick={() => setActiveSection('notifications')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                  activeSection === 'notifications' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bell className="h-5 w-5 mr-3" />
                Notifications
              </button>
              
              <button
                onClick={() => setActiveSection('ai')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                  activeSection === 'ai' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bot className="h-5 w-5 mr-3" />
                AI & Content Settings
              </button>
              
              <button
                onClick={() => setActiveSection('rewards')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                  activeSection === 'rewards' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Gift className="h-5 w-5 mr-3" />
                Rewards & Controls
              </button>
              
              <button
                onClick={() => setActiveSection('support')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                  activeSection === 'support' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="h-5 w-5 mr-3" />
                Support & Legal
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              
              {/* Account & Security Section */}
              {activeSection === 'account' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Account & Security</h2>
                    
                    {/* Profile Information */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        Profile Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <button
                        onClick={handleSaveProfile}
                        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-600" />
                        Security Settings
                      </h3>
                      
                      {!showPasswordChange ? (
                        <button
                          onClick={() => setShowPasswordChange(true)}
                          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                              <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              >
                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={handlePasswordChange}
                              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
                            >
                              Update Password
                            </button>
                            <button
                              onClick={() => setShowPasswordChange(false)}
                              className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription & Billing Section */}
              {activeSection === 'subscription' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Subscription & Billing</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {SUBSCRIPTION_PLANS.map((plan) => (
                        <div
                          key={plan.id}
                          className={`border-2 rounded-2xl p-6 transition-all ${
                            plan.current
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                            {plan.current && (
                              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Current Plan
                              </span>
                            )}
                          </div>
                          
                          <div className="text-3xl font-bold text-blue-600 mb-4">{plan.price}</div>
                          
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-gray-700">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          
                          {!plan.current && (
                            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors">
                              Upgrade to {plan.name}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing History</h3>
                      <div className="text-gray-600">
                        <p>No billing history available for free plan.</p>
                        <p className="text-sm mt-2">Upgrade to Premium to view detailed billing information.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Family Management Section */}
              {activeSection === 'family' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Family Management</h2>
                    <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Child
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {children.map((child) => (
                      <div key={child.id} className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                            <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800">{child.name}</h3>
                            <p className="text-gray-600">Age: {child.age}</p>
                            <div className="flex items-center mt-1">
                              <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm font-medium text-gray-700">{child.rank}</span>
                              <Star className="h-4 w-4 text-blue-500 ml-3 mr-1" />
                              <span className="text-sm font-medium text-gray-700">{child.points} pts</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedChild(selectedChild === child.id ? null : child.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        </div>
                        
                        {selectedChild === child.id && (
                          <div className="border-t border-gray-200 pt-4 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">AI Companion</label>
                              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                {AI_PERSONALITIES.map((ai) => (
                                  <option key={ai.id} value={ai.id} selected={ai.name === child.aiCompanion}>
                                    {ai.icon} {ai.name} - {ai.personality}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Personal Goal Message</label>
                              <textarea
                                value={child.parentGoal}
                                onChange={(e) => handleChildGoalUpdate(child.id, e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                placeholder="Enter a motivational message for your child..."
                              />
                            </div>
                            
                            <div className="flex space-x-3">
                              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Save Changes
                              </button>
                              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                                View Details
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Settings</h2>
                    
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Notifications</h3>
                      
                      <div className="space-y-4">
                        {notificationSettings.map((setting) => (
                          <div key={setting.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                            <div>
                              <div className="font-medium text-gray-800">{setting.label}</div>
                              <div className="text-sm text-gray-600">{setting.description}</div>
                            </div>
                            <button
                              onClick={() => handleNotificationToggle(setting.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  setting.enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI & Content Settings Section */}
              {activeSection === 'ai' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">AI & Content Settings</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Bot className="h-5 w-5 mr-2 text-blue-600" />
                          Default AI Settings
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Default AI Personality</label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              {AI_PERSONALITIES.map((ai) => (
                                <option key={ai.id} value={ai.id}>
                                  {ai.icon} {ai.name} - {ai.personality}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">AI Tone</label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              <option value="playful">More Playful</option>
                              <option value="balanced">Balanced</option>
                              <option value="direct">More Direct</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-green-600" />
                          Global App Settings
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-800">Enable Leaderboards</div>
                              <div className="text-sm text-gray-600">Show family competition rankings</div>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-800">Photo Proof Required</div>
                              <div className="text-sm text-gray-600">Require photos for chore completion</div>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rewards & Controls Section */}
              {activeSection === 'rewards' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Rewards & Controls</h2>
                    <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Reward
                    </button>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Reward Management</h3>
                    <p className="text-gray-600 mb-4">
                      Create and manage custom rewards for your children. Set point costs and availability.
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                      Manage Reward Catalog
                    </button>
                  </div>
                </div>
              )}

              {/* Support & Legal Section */}
              {activeSection === 'support' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Support & Legal</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                        <HelpCircle className="h-8 w-8 text-blue-600 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Help & Support</h3>
                        <p className="text-gray-600 mb-4">Get help with your account and app features</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Contact Support
                        </button>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                        <FileText className="h-8 w-8 text-green-600 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Legal Documents</h3>
                        <p className="text-gray-600 mb-4">Review our terms and privacy policy</p>
                        <div className="space-y-2">
                          <button className="block text-green-600 hover:text-green-800 text-sm">Privacy Policy</button>
                          <button className="block text-green-600 hover:text-green-800 text-sm">Terms of Service</button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Danger Zone */}
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                      <div className="flex items-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                        <h3 className="text-lg font-semibold text-red-800">Danger Zone</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
                          <p className="text-sm text-red-600 mb-3">
                            Once you delete your account, there is no going back. This will permanently delete your account and all associated data.
                          </p>
                          {!showDeleteConfirm ? (
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Delete Account
                            </button>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-red-800 font-medium">Are you absolutely sure?</p>
                              <div className="flex space-x-3">
                                <button
                                  onClick={handleDeleteAccount}
                                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Yes, Delete Account
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(false)}
                                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="border-t border-red-200 pt-4">
                          <button
                            onClick={handleLogout}
                            className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors flex items-center"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Log Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;