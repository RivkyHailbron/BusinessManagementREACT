import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Wrench, Edit2, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchMeetings, updateMeeting, createMeeting } from '../../store/slices/meetingsSlice';
import { fetchServiceById } from '../../store/slices/servicesSlice';
import { Meeting } from '../../types';
import { usersAPI } from '../../services/api';
import { EditMeetingModal } from './EditMeetingModal';
import { AddMeetingModal } from './addMeetingModal';

export const MeetingsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { meetings, loading } = useAppSelector((state) => state.meetings);
  const [servicesMap, setServicesMap] = useState<{ [id: string]: string }>({});
  const [usersMap, setUsersMap] = useState<{ [email: string]: string }>({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchMeetings());
  }, [dispatch]);

  // טען שירותים חסרים בלבד
  useEffect(() => {
    const fetchMissingServices = async () => {
      const missing = Array.from(
        new Set(
          meetings
            .map((m) => m.serviceID)
            .filter((id) => !(id in servicesMap))
        )
      );
      if (missing.length === 0) return;
      const newServices: { [id: string]: string } = {};
      for (const id of missing) {
        try {
          const res = await dispatch(fetchServiceById(id)).unwrap();
          newServices[id] = res.name;
        } catch {
          newServices[id] = 'שגיאה בטעינת שירות';
        }
      }
      setServicesMap((prev) => ({ ...prev, ...newServices }));
    };
    if (meetings.length > 0 && !loading) fetchMissingServices();
  }, [meetings, loading, dispatch, servicesMap]);

  // טען משתמשים חסרים בלבד
  useEffect(() => {
    const fetchMissingUsers = async () => {
      const missing = Array.from(
        new Set(
          meetings
            .map((m) => m.userEmail)
            .filter((email) => email && !(email in usersMap))
        )
      );
      if (missing.length === 0) return;
      const newUsers: { [email: string]: string } = {};
      for (const email of missing) {
        try {
          const res = await usersAPI.getUser(email);
          newUsers[email] = res.name;
        } catch {
          newUsers[email] = 'שגיאה בטעינת משתמש';
        }
      }
      setUsersMap((prev) => ({ ...prev, ...newUsers }));
    };
    if (meetings.length > 0 && !loading) fetchMissingUsers();
  }, [meetings, loading, dispatch, usersMap]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getMeetingColorClass = (date: string) => {
    const meetingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    meetingDate.setHours(0, 0, 0, 0);
    const diffTime = meetingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'border-r-4 border-red-500 bg-red-50';
    if (diffDays <= 7 && diffDays > 0) return 'border-r-4 border-orange-500 bg-orange-50';
    if (diffDays < 0) return 'border-r-4 border-yellow-500 bg-yellow-50';
    return 'border-r-4 border-green-500 bg-green-50';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // שמירת עריכה
  const handleEdit = async (meeting: Meeting) => {
    await dispatch(updateMeeting({ id: meeting.id, meeting })).unwrap();
    setEditModalVisible(false);
    setEditingMeeting(null);
    await dispatch(fetchMeetings());
  };

  // שמירת פגישה חדשה
  const handleAdd = async (meeting: Omit<Meeting, 'id'>) => {
    await dispatch(createMeeting(meeting)).unwrap();
    setAddModalVisible(false);
    await dispatch(fetchMeetings());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">רשימת פגישות</h2>
        <button
          onClick={() => setAddModalVisible(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>הוספת פגישה</span>
        </button>
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>אין פגישות מתוכננות</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className={`rounded-lg p-6 transition-all hover:shadow-md ${getMeetingColorClass(meeting.date)}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(meeting.date)}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{meeting.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Wrench className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {servicesMap[meeting.serviceID] || 'טוען שירות...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {usersMap[meeting.userEmail] || 'טוען משתמש...'}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    title="ערוך פגישה"
                    onClick={() => {
                      setEditingMeeting(meeting);
                      setEditModalVisible(true);
                    }}
                    className="p-2 rounded hover:bg-gray-100 transition"
                  >
                    <Edit2 className="h-5 w-5 text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingMeeting && editModalVisible && (
        <EditMeetingModal
          meeting={editingMeeting}
          onClose={() => {
            setEditModalVisible(false);
            setEditingMeeting(null);
          }}
          onSave={handleEdit}
        />
      )}

      {addModalVisible && (
        <AddMeetingModal
          onClose={() => setAddModalVisible(false)}
          onSave={handleAdd}
        />
      )}
    </div>
  );
};