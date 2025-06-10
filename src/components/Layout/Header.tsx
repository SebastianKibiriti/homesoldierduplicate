import React, { useState } from 'react';
import { Bell, Plus, Search, Menu, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ParentProfile from '../../pages/ParentProfile';

interface HeaderProps {
  notificationCount: number;
  onNewChore?: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ notificationCount, onNewChore, onMenuClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showParentProfile, setShowParentProfile] = useState(false);
  const userName = user?.user_metadata?.full_name || 'Guest';
  const isParent = user?.user_metadata?.role === 'parent';
  const isChild = user?.user_metadata?.role === 'child';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = () => {
    if (isParent) {
      setShowParentProfile(true);
    } else if (isChild) {
      navigate('/profile');
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between max-w-[2000px] mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userName}!</h1>
                <p className="text-gray-500">Let's see how your family is doing today</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search size={18} className="text-gray-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none focus:outline-none text-sm w-40"
                />
              </div>
            </div>
            
            <button className="p-2 relative">
              <Bell size={20} className="text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            
            {isParent && onNewChore && (
              <button 
                onClick={onNewChore}
                className="hidden md:flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Plus size={18} className="mr-1" />
                <span className="text-sm font-medium">New Chore</span>
              </button>
            )}
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleProfileClick}
                className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-500 transition-all"
                title="View Profile"
              >
                <img 
                  src="https://images.pexels.com/photos/5393594/pexels-photo-5393594.jpeg?auto=compress&cs=tinysrgb&w=150" 
                  alt="Profile Avatar" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;
                  }}
                />
              </button>
              <button
                onClick={handleLogout}
                className="hidden md:block text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Parent Profile Modal */}
      {showParentProfile && (
        <ParentProfile
          isOpen={showParentProfile}
          onClose={() => setShowParentProfile(false)}
        />
      )}
    </>
  );
};

export default Header;