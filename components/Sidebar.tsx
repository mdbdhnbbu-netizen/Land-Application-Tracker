
import React from 'react';
import { User } from '../types';
import { PlusIcon, UserCogIcon, TrashIcon, XIcon } from './Icons';

interface SidebarProps {
  users: User[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
  onAddNewUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ users, currentUserId, onSelectUser, onAddNewUser, onEditUser, onDeleteUser, isOpen, onClose }) => {
  
  return (
    <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 no-print flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">ব্যবহারকারীগণ</h2>
        <button onClick={onClose} className="md:hidden p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800" aria-label="Close sidebar">
            <XIcon className="w-5 h-5"/>
        </button>
      </div>
      <nav className="p-2 flex-grow overflow-y-auto">
        <ul>
          {users.map(user => (
            <li key={user.id} className="mb-1 group">
              <div className="flex items-center">
                 <button
                  onClick={() => onSelectUser(user.id)}
                  className={`flex-grow text-left px-3 py-2 text-sm font-medium flex items-center gap-3 rounded-md transition-colors ${
                    currentUserId === user.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${user.role === 'Admin' ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                    {user.name ? user.name.charAt(0) : '?'}
                  </span>
                  <span className="truncate">{user.name}</span>
                  {user.role === 'Admin' && <span className="text-xs font-semibold text-indigo-600 ml-auto">(অ্যাডমিন)</span>}
                </button>
                <div className="flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity ml-1 flex-shrink-0">
                    <button 
                      onClick={() => onEditUser(user)}
                      className="p-2 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                      title="ব্যবহারকারী সম্পাদনা করুন"
                    >
                      <UserCogIcon />
                    </button>
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 rounded-md text-slate-400 hover:bg-slate-200"
                      title="ব্যবহারকারী মুছে ফেলুন"
                    >
                      <TrashIcon />
                    </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t mt-auto">
          <button 
            onClick={onAddNewUser}
            className="w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 rounded-md px-4 py-2 gap-2"
            >
              <PlusIcon /> নতুন ব্যবহারকারী
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;