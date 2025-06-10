import React from 'react';
import FamilyMembers from '../components/Dashboard/FamilyMembers';
import { familyMembers } from '../data/mockData';

const Family: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Family Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Family Member
        </button>
      </div>
      <FamilyMembers members={familyMembers} />

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

export default Family;