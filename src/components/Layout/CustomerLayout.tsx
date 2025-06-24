import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Building2, LogIn, LogOut} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loadUserFromStorage, logout } from '../../store/slices/authSlice';
import { CustomerProfile } from '../Customer/CustomerProfile';
import { SignUpSignIn } from '../Auth/signUp-signIn';

export const CustomerLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // מעבר לעמוד הלוגין
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">שלום משתמש {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>יציאה</span>
              </button>
              {/* כפתור התחברות חדש */}
              <button
                onClick={handleLoginRedirect}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>התחברות</span>
              </button>
            </div>
            <CustomerProfile />
            <SignUpSignIn/>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
