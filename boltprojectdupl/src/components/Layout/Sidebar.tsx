import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, CheckSquare, Award, BarChart2, Settings, HelpCircle, LogOut, Medal, X, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { logger } from '../../utils/logger';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarLinkProps {
  icon: React.ReactNode;
  text: string;
  path: string;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, text, path, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  const handleClick = () => {
    try {
      logger.userAction('navigation', { from: location.pathname, to: path });
      navigate(path);
      onClick?.();
    } catch (error) {
      logger.error('Navigation error', { from: location.pathname, to: path, error });
    }
  };

  return (
    <li>
      <button
        onClick={handleClick}
        className={`flex items-center w-full p-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-900 text-white' 
            : 'text-gray-300 hover:bg-blue-900/50 hover:text-white'
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span>{text}</span>
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { signOut, user } = useAuth();
  const { handleError } = useErrorHandler({ component: 'Sidebar' });
  const isChild = user?.user_metadata?.role === 'child';

  const handleLogout = async () => {
    try {
      logger.userAction('logout_initiated');
      await signOut();
      logger.info('Sidebar: User logged out successfully');
    } catch (error) {
      handleError(error, { action: 'logout' });
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        bg-blue-950 text-white w-64 min-h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 border-b border-blue-900 flex justify-between items-center">
          <div className="flex items-center">
            <Medal className="h-8 w-8 text-yellow-500 mr-3" />
            <h1 className="text-xl font-bold">Home Soldier</h1>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-5">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Main Menu</p>
            <nav>
              <ul className="space-y-1">
                {isChild ? (
                  <>
                    <SidebarLink 
                      icon={<User size={20} />} 
                      text="My Profile" 
                      path="/profile"
                      onClick={onClose}
                    />
                    <SidebarLink 
                      icon={<CheckSquare size={20} />} 
                      text="My Chores" 
                      path="/chores"
                      onClick={onClose}
                    />
                    <SidebarLink 
                      icon={<Award size={20} />} 
                      text="Rewards" 
                      path="/rewards"
                      onClick={onClose}
                    />
                  </>
                ) : (
                  <>
                    <SidebarLink 
                      icon={<Home size={20} />} 
                      text="Dashboard" 
                      path="/dashboard"
                      onClick={onClose}
                    />
                    <SidebarLink 
                      icon={<Users size={20} />} 
                      text="Family" 
                      path="/family"
                      onClick={onClose}
                    />
                    <SidebarLink 
                      icon={<CheckSquare size={20} />} 
                      text="Chores" 
                      path="/chores"
                      onClick={onClose}
                    />
                    <SidebarLink 
                      icon={<Award size={20} />} 
                      text="Rewards" 
                      path="/rewards"
                      onClick={onClose}
                    />
                    <SidebarLink 
                      icon={<BarChart2 size={20} />} 
                      text="Reports" 
                      path="/reports"
                      onClick={onClose}
                    />
                    {/*a faulty code to test sentry.io connection*/}
    return <button onClick={() => {throw new Error("This is your first error!");}}>Break the world</button>;
                  </>
                )}
              </ul>
            </nav>
          </div>
          
          <div className="p-5 mt-auto">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Account</p>
            <nav>
              <ul className="space-y-1">
                <SidebarLink 
                  icon={<Settings size={20} />} 
                  text="Settings" 
                  path="/settings"
                  onClick={onClose}
                />
                <SidebarLink 
                  icon={<HelpCircle size={20} />} 
                  text="Help & Support" 
                  path="/support"
                  onClick={onClose}
                />
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 rounded-lg transition-colors text-gray-300 hover:bg-blue-900/50 hover:text-white"
                  >
                    <span className="mr-3"><LogOut size={20} /></span>
                    <span>Log Out</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;