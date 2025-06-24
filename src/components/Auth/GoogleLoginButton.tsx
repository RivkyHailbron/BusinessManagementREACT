import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { googleLogin, logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const GoogleLoginButton: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    // GoogleLoginButton.tsx
    const handleSuccess = async (response: CredentialResponse) => {
        if (response.credential) {
            const idToken = response.credential;
            try {
                dispatch(logout());
                await dispatch(googleLogin({ idToken })).unwrap();
                const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
                console.log(isAuthenticated, user);
                if (isAuthenticated && user?.role === 'admin') {
                    console.log('Admin user detected, redirecting to dashboard*************************************');
                    navigate('/admin/dashboard/business');
                } else if (isAuthenticated && user?.role === 'user') {
                    navigate('/');
                }
            } catch (err) {
                console.error('Google login failed:', err);
            }
        }
    };


    return (
        <div className="flex justify-center mt-4">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.error('Login Failed')}
            />
        </div>
    );
};
