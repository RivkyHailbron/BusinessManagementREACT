import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../services/api';
import { User } from '../../types';
import { Pencil, X, Plus, Trash } from 'lucide-react';

export const AdminUserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const result = await usersAPI.getUsers();
      setUsers(result);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email });
    setIsNewUser(false);
    setIsDrawerOpen(true);
  };

  const handleNewUserClick = () => {
    setSelectedUser(null);
    setFormData({ name: '', email: '', password: '' });
    setIsNewUser(true);
    setIsDrawerOpen(true);
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        await usersAPI.createUser(formData as User);
      } else if (selectedUser?.email) {
        await usersAPI.updateUser(selectedUser.email, formData);
      }
      await loadUsers();
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">ניהול משתמשים</h1>
        <button
          onClick={handleNewUserClick}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> הוסף משתמש
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.email} className="border rounded-xl p-4 shadow-sm bg-white">
            <p><strong>שם:</strong> {user.name}</p>
            <p><strong>אימייל:</strong> {user.email}</p>
            {/* <p><strong>תפקיד:</strong> {user.role}</p> */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEditClick(user)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <Pencil className="w-4 h-4" /> ערוך
              </button>

            </div>
          </div>
        ))}
      </div>

      {isDrawerOpen && (
        <div className="fixed top-0 left-0 w-full max-w-md h-full bg-white shadow-lg z-50 p-6 overflow-y-auto border-r border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{isNewUser ? 'הוספת משתמש' : 'עריכת משתמש'}</h2>
            <button onClick={() => setIsDrawerOpen(false)} className="text-gray-500 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">שם:</label>
              <input
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">אימייל:</label>
              <input
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">סיסמה:</label>
              <input
                type="password"
                name="password"
                value={formData.password || ''}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>
            <div className="flex justify-between gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                שמור
              </button>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
