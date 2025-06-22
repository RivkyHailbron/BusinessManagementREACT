import React from 'react';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import { useBusiness } from '../contexts/BusinessContext';

export const AppointmentsList: React.FC = () => {
  const { appointments, loading } = useBusiness();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getAppointmentColorClass = (date: string) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'border-r-4 border-red-500 bg-red-50'; // Today
    if (diffDays <= 7 && diffDays > 0) return 'border-r-4 border-orange-500 bg-orange-50'; // This week
    return 'border-r-4 border-green-500 bg-green-50'; // Future
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">רשימת פגישות</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>היום</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>השבוע</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>בעתיד</span>
          </div>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>אין פגישות מתוכננות</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment: any) => (
            <div
              key={appointment.id}
              className={`rounded-lg p-6 transition-all hover:shadow-md ${getAppointmentColorClass(appointment.date)}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(appointment.date)}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{appointment.customerName}</p>
                    <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-900">{appointment.customerEmail}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-900">{appointment.customerPhone}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status === 'confirmed' ? 'מאושר' : 'ממתין'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};