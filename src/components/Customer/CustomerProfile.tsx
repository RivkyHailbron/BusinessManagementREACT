import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { usersAPI } from '../../services/api';
import { X, Pencil } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (user?.email) {
      usersAPI.getUser(user.email).then(res => {
        setFormData({ name: res.name, email: res.email, password: '' });
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.email) {
      await usersAPI.updateUser(user.email, formData);
      alert('הפרטים עודכנו בהצלחה!');
      setIsEdit(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:underline"
      >
        פרופיל שלי
      </button>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full max-w-md h-full bg-white shadow-lg z-50 p-6 overflow-y-auto border-r border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">פרטים אישיים</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isEdit && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">שם:</label>
                <input className="border p-2 w-full bg-gray-100" value={formData.name} readOnly />
              </div>
              <div>
                <label className="block text-sm text-gray-700">אימייל:</label>
                <input className="border p-2 w-full bg-gray-100" value={formData.email} readOnly />
              </div>
              <div>
                <label className="block text-sm text-gray-700">סיסמה:</label>
                <input type="password" className="border p-2 w-full bg-gray-100" value={formData.password} readOnly />
              </div>
              <button
                onClick={() => setIsEdit(true)}
                className="mt-4 flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
              >
                <Pencil className="w-4 h-4" /> ערוך
              </button>
            </div>
          )}

          {isEdit && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">שם:</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">סיסמה חדשה:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
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
                  onClick={() => setIsEdit(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  ביטול
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
};