import React, { useState } from 'react';
import ChoresList from '../components/Dashboard/ChoresList';
import NewChoreModal from '../components/Chores/NewChoreModal';
import { chores } from '../data/mockData';

const Chores: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewChore = (choreData: any) => {
    // Here you would typically make an API call to create the chore
    console.log('New chore data:', choreData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Chores Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Chore
        </button>
      </div>
      <ChoresList chores={chores} />
      <NewChoreModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewChore}
      />

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

export default Chores;