
import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, DollarSign, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchBusiness } from '../../store/slices/businessSlice';
import { fetchServices } from '../../store/slices/servicesSlice';
import { Service } from '../../types';
import { BookingModal } from './BookingModal';
import { useNavigate } from 'react-router-dom';
import { MeetingsList } from '../Meetings/MeetingList';
import { MeetingsForCustomer } from '../Meetings/MeetingsForCustomer';

export const CustomerView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { business, loading: businessLoading } = useAppSelector((state) => state.business);
  const { services, loading: servicesLoading } = useAppSelector((state) => state.services);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    dispatch(fetchBusiness());
    dispatch(fetchServices());
  }, [dispatch]);

  const handleServiceSelect = (service: Service) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setShowBookingForm(true);
  };

  if (businessLoading || servicesLoading || !business) {
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
          <p className="text-lg text-gray-600 mb-2">{business.description}</p>
          <p className="text-gray-600">{business.managerEmail}</p>
        </div>
      </section>

      {isAuthenticated && <MeetingsForCustomer />}

      {/* Services */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-right mb-8"> {/* שיניתי מ-text-center ל-text-left */}
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
