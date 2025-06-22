import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAppDispatch } from '../../hooks/redux';
import { googleLogin } from '../../store/slices/authSlice';

export const GoogleLoginButton: React.FC = () => {
    const dispatch = useAppDispatch();

    // GoogleLoginButton.tsx
    const handleSuccess = async (response: CredentialResponse) => {
        if (response.credential) {
            const idToken = response.credential;
            try {
                await dispatch(googleLogin({ idToken })).unwrap();
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
