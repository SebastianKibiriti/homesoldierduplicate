import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';
import { logger } from '../../utils/logger';

interface NewChoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const NewChoreModal: React.FC<NewChoreModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(10);

  const {
    loading: isSubmitting,
    error,
    execute: executeSubmission
  } = useAsyncOperation({
    component: 'NewChoreModal',
    onSuccess: () => {
      logger.userAction('new_chore_created', { name, points });
      onSuccess?.();
      handleClose();
    },
    onError: (error) => {
      logger.error('Failed to create chore', { name, points, error });
    }
  });

  const handleClose = () => {
    setName('');
    setDescription('');
    setPoints(10);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      logger.warn('NewChoreModal: Attempted to submit without name');
      return;
    }

    await executeSubmission(async () => {
      logger.info('NewChoreModal: Creating new chore', { name, points });

      const { error: choreError } = await supabase
        .from('chores')
        .insert([{
          parent_id: user?.id,
          name: name.trim(),
          description: description.trim(),
          points
        }]);

      if (choreError) {
        logger.apiError('chores', choreError, { name, points });
        throw choreError;
      }

      return { name, points };
    }, { action: 'create_chore', name, points });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Create New Chore</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
            <p className="text-sm font-medium">Error creating chore</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chore Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
              placeholder="e.g., Take out the trash"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={isSubmitting}
              placeholder="Optional: Add more details about this chore"
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Points *
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(Math.max(1, Number(e.target.value)))}
              min="1"
              max="1000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Points determine the reward value for completing this chore
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Chore'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChoreModal;