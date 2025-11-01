
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  userToEdit: User | null;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Admin' | 'User'>('User');

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || '');
      setRole(userToEdit.role);
    }
  }, [userToEdit]);

  if (!isOpen || !userToEdit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && userToEdit) {
        const updatedUser = { 
            ...userToEdit, 
            name: name.trim(), 
            role,
        };
        onSave(updatedUser);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center no-print">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">ব্যবহারকারী সম্পাদনা করুন</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
            <label htmlFor="edit_user_id" className="block text-sm font-medium text-gray-700">ইমেইল (পরিবর্তনযোগ্য নয়)</label>
            <input
              type="text"
              id="edit_user_id"
              value={userToEdit?.email || ''}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              disabled
            />
          </div>
          <div>
            <label htmlFor="edit_user_name" className="block text-sm font-medium text-gray-700">ব্যবহারকারীর নাম</label>
            <input
              type="text"
              id="edit_user_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="edit_user_role" className="block text-sm font-medium text-gray-700">ভূমিকা</label>
            <select
              id="edit_user_role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'Admin' | 'User')}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="User">ব্যবহারকারী</option>
              <option value="Admin">অ্যাডমিন</option>
            </select>
          </div>
           <p className="text-xs text-gray-500 pt-2">দ্রষ্টব্য: পাসওয়ার্ড পরিবর্তন করতে, ব্যবহারকারীকে লগইন স্ক্রীন থেকে পাসওয়ার্ড রিসেট অপশন ব্যবহার করতে হবে (Firebase দ্বারা পরিচালিত)।</p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">বাতিল</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">সংরক্ষণ করুন</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDialog;
