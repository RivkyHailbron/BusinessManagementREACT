import React, { useEffect, useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
    fetchServices,
    createService,
    deleteService,
    updateService
} from '../../store/slices/servicesSlice';
import { AddServiceModal } from './AddServiceModal';
import { EditServiceModal } from './EditServiceModel'; // ייבוא הקומפוננטה החדשה
import { Service } from '../../types';

export const ServiceList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { services, loading } = useAppSelector((state) => state.services);
    const [showModal, setShowModal] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    const handleAdd = async (data: Omit<Service, 'id'>) => {
        try {
            await dispatch(createService(data)).unwrap();
            setShowModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = async (service: Service) => {
        try {
            await dispatch(updateService({ id: service.id, service })).unwrap();
            await dispatch(fetchServices()); // טען מחדש את השירותים לאחר העדכון
            setEditModalVisible(false); // סגור את המודל לאחר שמירה
        } catch (err) {
            console.error('Error updating service:', err);
        }
    };

    const handleRemove = async (id: string) => {
        if (window.confirm('למחוק שירות זה?')) {
            await dispatch(deleteService(id)).unwrap();
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">שירותים</h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <Plus size={16} />
                    <span>הוספה</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                    <div key={service.id} className="border p-4 rounded-lg shadow-sm space-y-2">
                        <div className="flex justify-between">
                            <h4 className="font-semibold">{service.name}</h4>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setEditingService(service);
                                        setEditModalVisible(true);
                                    }}
                                    className="text-blue-500"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleRemove(service.id)}
                                    className="text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <p className="text-sm text-gray-500">{service.producerEmail}</p>
                    </div>
                ))}
            </div>

            {services.length === 0 && !loading && (
                <p className="text-center text-gray-500 mt-8">אין שירותים להצגה</p>
            )}

            {showModal && (
                <AddServiceModal onClose={() => setShowModal(false)} onSave={handleAdd} />
            )}

            {editModalVisible && editingService && (
                <EditServiceModal
                    onClose={() => setEditModalVisible(false)}
                    onSave={handleEdit}
                    service={editingService} // שולחים את השירות לעריכה
                />
            )}
        </div>
    );
};
