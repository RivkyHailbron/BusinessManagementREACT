import React, { useState } from 'react';
import { Save, Edit2, Plus, Trash2 } from 'lucide-react';
import { useBusiness } from '../contexts/BusinessContext';
import { Service } from '../types';

export const BusinessDetails: React.FC = () => {
  const { business, services, updateBusiness, addService, removeService, loading } = useBusiness();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [editData, setEditData] = useState(business || {
    id: '',
    name: '',
    address: '',
    email: '',
    phone: ''
  });

  const handleSave = async () => {
    try {
      await updateBusiness(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating business:', error);
    }
  };

  const handleAddService = async (serviceData: Omit<Service, 'id'>) => {
    try {
      await addService(serviceData);
      setShowAddService(false);
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleRemoveService = async (serviceId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את השירות?')) {
      try {
        await removeService(serviceId);
      } catch (error) {
        console.error('Error removing service:', error);
      }
    }
  };

  if (loading || !business) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">פרטי העסק</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              <span>עריכה</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>שמירה</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditData(business);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                ביטול
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם העסק</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg">{business.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.address}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg">{business.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
            {isEditing ? (
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg">{business.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg">{business.phone}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">רשימת שירותים</h3>
          <button
            onClick={() => setShowAddService(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>הוספת שירות</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service: Service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{service.name}</h4>
                <button
                  onClick={() => handleRemoveService(service.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >

                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            
              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">אימייל יצרן: {service.producerEmail}</span>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>לא נוספו שירותים עדיין</p>
          </div>
        )}
      </div>

      {showAddService && (
        <AddServiceModal
          onClose={() => setShowAddService(false)}
          onSave={handleAddService}
        />
      )}
    </div>
  );
};

interface AddServiceModalProps {
  onClose: () => void;
  onSave: (service: Omit<Service, 'id'>) => Promise<void>;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    producerEmail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">הוספת שירות חדש</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם השירות</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תיאור</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">אימייל יצרן</label>
            <input
              type="email"
              value={formData.producerEmail}
              onChange={(e) => setFormData({ ...formData, producerEmail: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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