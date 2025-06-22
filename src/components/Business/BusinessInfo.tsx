import React, { useEffect, useState } from 'react';
import { Edit2, Save } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchBusiness, updateBusiness } from '../../store/slices/businessSlice';

export const BusinessInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const { business, loading } = useAppSelector((state) => state.business);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    id: '',
    name: '',
    description: '',
    managerEmail: ''
  });

  useEffect(() => {
    dispatch(fetchBusiness());
  }, [dispatch]);

  useEffect(() => {
    if (business) {
      setEditData(business);
    }
  }, [business]);

  const handleSave = async () => {
    try {
      await dispatch(updateBusiness({ id: business!.id, business: editData })).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating business:', err);
    }
  };

  if (loading || !business) {
    return <div>טוען...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">פרטי העסק</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Edit2 size={16} />
            <span>עריכה</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Save size={16} />
              <span>שמירה</span>
            </button>
            <button onClick={() => { setIsEditing(false); setEditData(business); }} className="bg-gray-300 px-4 py-2 rounded-lg">ביטול</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>שם העסק</label>
          {isEditing ? (
            <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="input" />
          ) : <p className="bg-gray-100 p-2 rounded">{business.name}</p>}
        </div>
        <div>
          <label>תיאור</label>
          {isEditing ? (
            <input value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className="input" />
          ) : <p className="bg-gray-100 p-2 rounded">{business.description}</p>}
        </div>
        <div>
          <label>אימייל מנהל</label>
          {isEditing ? (
            <input value={editData.managerEmail} onChange={(e) => setEditData({ ...editData, managerEmail: e.target.value })} className="input" />
          ) : <p className="bg-gray-100 p-2 rounded">{business.managerEmail}</p>}
        </div>
      </div>
    </div>
  );
};
