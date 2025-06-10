import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isNewChoreModalOpen, setIsNewChoreModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header 
          notificationCount={3} 
          onNewChore={() => setIsNewChoreModalOpen(true)}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 p-6 overflow-auto">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { 
                isNewChoreModalOpen,
                onCloseNewChoreModal: () => setIsNewChoreModalOpen(false)
              });
            }
            return child;
          })}
        </main>
      </div>

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

export default Layout;