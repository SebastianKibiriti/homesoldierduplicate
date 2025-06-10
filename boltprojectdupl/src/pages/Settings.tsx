import React from 'react';
import { Bell, Shield, User, Home } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6">
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <User className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Profile Information</h3>
                    <p className="text-sm text-gray-500">Update your account details and profile</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Security</h3>
                    <p className="text-sm text-gray-500">Manage your password and security settings</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Notifications</h3>
                    <p className="text-sm text-gray-500">Configure your notification preferences</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Home className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Household</h3>
                    <p className="text-sm text-gray-500">Manage your household settings</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Danger Zone</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-800 font-medium">Delete Account</h3>
                <p className="text-sm text-red-600 mb-3">Once you delete your account, there is no going back.</p>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default Settings;