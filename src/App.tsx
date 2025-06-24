import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AdminLayout } from './components/Layout/AdminLayout';
import { CustomerLayout } from './components/Layout/CustomerLayout';
import { LoginForm } from './components/Auth/LoginForm';
import { BusinessInfo } from './components/Business/BusinessInfo';
import { MeetingsList } from './components/Meetings/MeetingList';
import { ServiceList } from './components/Business/ServiceInfo';
import { CustomerView } from './components/Customer/CustomerView';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminUserManager } from './components/Business/AdminUserManager';
import SignUpForm  from './components/Auth/SignUP';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* { Customer Routes } */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<CustomerView />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm/>} />
          <Route path="/meetings" element={<MeetingsList />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard/business" replace />} />
            <Route path="business" element={<BusinessInfo />} />
            <Route path="services" element={<ServiceList />} />
            <Route path="meetings" element={<MeetingsList />} />
            <Route path="users" element={<AdminUserManager />} />

          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;