
import React, { useState } from 'react';

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (email: string, name: string, role: 'Admin' | 'User', password: string) => Promise<void>;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ isOpen, onClose, onAddUser }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Admin' | 'User'>('User');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && name.trim() && password.trim()) {
      setLoading(true);
      setError('');
      try {
        await onAddUser(email.trim(), name.trim(), role, password.trim());
        setEmail('');
        setName('');
        setRole('User');
        setPassword('');
        onClose();
      } catch (e: any) {
        if (e.code === 'auth/email-already-in-use') {
            setError('এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে।');
        } else {
            setError('ব্যবহারকারী তৈরি করা যায়নি। আবার চেষ্টা করুন।');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center no-print">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">নতুন ব্যবহারকারী যোগ করুন</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">ইমেইল (লগইন আইডি)</label>
            <input
              type="email"
              id="user_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              autoFocus
            />
          </div>
           <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">ব্যবহারকারীর নাম</label>
            <input
              type="text"
              id="user_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="user_password" className="block text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
            <input
              type="password"
              id="user_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              minLength={6}
            />
             <p className="text-xs text-gray-500 mt-1">পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।</p>
          </div>
          <div>
            <label htmlFor="user_role" className="block text-sm font-medium text-gray-700">ভূমিকা</label>
            <select
              id="user_role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'Admin' | 'User')}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="User">ব্যবহারকারী</option>
              <option value="Admin">অ্যাডমিন</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">বাতিল</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                {loading ? 'যোগ হচ্ছে...' : 'যোগ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserDialog;