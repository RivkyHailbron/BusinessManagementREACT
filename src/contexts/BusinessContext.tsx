import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BusinessContextType, Business, Service, Appointment } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

interface BusinessProviderProps {
  children: ReactNode;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children }) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [businessData, servicesData, appointmentsData] = await Promise.all([
        api.getBusiness(),
        api.getServices(),
        api.getAppointments()
      ]);
      
      setBusiness(businessData);
      setServices(servicesData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateBusiness = async (updatedBusiness: Business) => {
    try {
      const result = await api.updateBusiness(updatedBusiness);
      setBusiness(result);
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      const newService = await api.addService(service);
      setServices(prev => [...prev, newService]);
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  };

  const removeService = async (serviceId: string) => {
    try {
      await api.removeService(serviceId);
      setServices(prev => prev.filter(s => s.id !== serviceId));
    } catch (error) {
      console.error('Error removing service:', error);
      throw error;
    }
  };

  const bookAppointment = async (appointment: Omit<Appointment, 'id' | 'status'>): Promise<boolean> => {
    try {
      const result = await api.bookAppointment(appointment);
      if (result.success) {
        // Refresh appointments
        const updatedAppointments = await api.getAppointments();
        setAppointments(updatedAppointments);
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.status === 400) {
        throw new Error('התאריך והשעה תפוסים, אנא בחר זמן אחר');
      }
      throw error;
    }
  };

  const value: BusinessContextType = {
    business,
    services,
    appointments,
    updateBusiness,
    addService,
    removeService,
    bookAppointment,
    fetchData,
    loading
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};