import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, DollarSign, Calendar } from 'lucide-react';
import { useBusiness } from '../contexts/BusinessContext';
import { Service } from '../types';

export const CustomerView: React.FC = () => {
  const { business, services, loading } = useBusiness();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setShowBookingForm(true);
  };

  if (loading || !business) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Business Information */}
      <section className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{business.name}</h1>
          <p className="text-lg text-gray-600">ברוכים הבאים לקביעת פגישה</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <MapPin className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">כתובת</h3>
              <p className="text-gray-600">{business.address}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <Phone className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">טלפון</h3>
              <p className="text-gray-600">{business.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
            <Mail className="h-6 w-6 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">אימייל</h3>
              <p className="text-gray-600">{business.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">השירותים שלנו</h2>
          <p className="text-lg text-gray-600">בחר את השירות המתאים לך וקבע פגישה</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-200"
              onClick={() => handleServiceSelect(service)}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">{service.duration} דקות</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-lg font-bold">₪{service.price}</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                קביעת פגישה
              </button>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>אין שירותים זמינים כרגע</p>
          </div>
        )}
      </section>

      {showBookingForm && selectedService && (
        <BookingModal
          service={selectedService}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
};

interface BookingModalProps {
  service: Service;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ service, onClose }) => {
  const { bookAppointment } = useBusiness();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
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
      const success = await bookAppointment({
        serviceId: service.id,
        serviceName: service.name,
        ...formData
      });
      
      if (success) {
        setSuccess('הפגישה נקבעה בהצלחה!');
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('תפוס')) {
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
            <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="הכנס שם מלא"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="הכנס כתובת אימייל"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="הכנס מספר טלפון"
            />
          </div>

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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                dateError ? 'border-red-500 bg-red-50' : 'border-gray-300'
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