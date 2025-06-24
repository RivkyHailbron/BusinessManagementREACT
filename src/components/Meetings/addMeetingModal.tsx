import React, { useEffect, useState } from 'react';
import { Meeting } from '../../types';
import { fetchServices } from '../../store/slices/servicesSlice'; // Import the function to fetch services
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

interface AddMeetingModalProps {
  onClose: () => void;
  onSave: (meeting: Omit<Meeting, 'id'>) => Promise<void>;
}

export const AddMeetingModal: React.FC<AddMeetingModalProps> = ({ onClose, onSave }) => {
  const dispatch = useAppDispatch();
  const { services } = useAppSelector((state) => state.services); // Get services from the Redux store
  const [formData, setFormData] = useState<Omit<Meeting, 'id'>>({
    serviceID: '',
    date: '',
    time: '',
    duration: '30',
    userEmail: '',
  });

  useEffect(() => {
    const loadServices = async () => {
      await dispatch(fetchServices()); // Fetch services when component mounts
    };
    loadServices();
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">הוספת פגישה חדשה</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שירות</label>
            <select
              value={formData.serviceID}
              onChange={(e) => setFormData({ ...formData, serviceID: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">בחר שירות</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תאריך</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שעה</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">משך (דקות)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
              min={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">אימייל משתמש</label>
            <input
              type="email"
              value={formData.userEmail}
              onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              הוספה
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
