import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useAppDispatch } from '../../hooks/redux';
import { createMeeting } from '../../store/slices/meetingsSlice';
import { Service } from '../../types';

interface BookingModalProps {
  service: Service;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ service, onClose }) => {

  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<any>({
    userEmail: (() => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).email || '' : '';
    })(),
    duration:' 30', // Default duration in minutes'
    date: '',
    time: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDateError(false);
    setLoading(true);

    try {
      console.log(service.id);
      
      await dispatch(createMeeting({
        serviceID: service.id,
       ...formData
      })).unwrap();

      setSuccess('הפגישה נקבעה בהצלחה!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err);
      if (err.includes('תפוס')) {
        setDateError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">קביעת פגישה</h3>
          <p className="text-gray-600">{service.name}</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תאריך</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                setDateError(false);
              }}
              required
              min={minDate}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${dateError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שעה</label>
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">בחר שעה</option>
              {Array.from({ length: 10 }, (_, i) => {
                const hour = 9 + i;
                const time = `${hour.toString().padStart(2, '0')}:00`;
                return (
                  <option key={time} value={time}>
                    {time}
                  </option>
                );
              })}
            </select>
          </div>
         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">משך הפגישה (בדקות)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
              min="30"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="30"
            />
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'מקבע פגישה...' : 'קביעת פגישה'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};