import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const EmailVerification: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { verifyEmail, resendVerification } = useAuth();

    useEffect(() => {
        if (token) {
            verifyToken();
        } else {
            setVerifying(false);
        }
    }, [token]);

    const verifyToken = async () => {
        try {
            await verifyEmail(token!);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    const handleResendVerification = async () => {
        try {
            await resendVerification();
            setError(null);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to resend verification email');
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center">
                    <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                        Email Verification
                    </h2>

                    {error && (
                        <div className="mb-4 p-4 rounded-md bg-red-50 text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700">
                            {token
                                ? 'Email verified successfully! Redirecting to login...'
                                : 'Verification email sent! Please check your inbox.'}
                        </div>
                    )}

                    {!token && !success && (
                        <>
                            <p className="text-gray-600 mb-6">
                                Please verify your email address to continue. Check your inbox for the
                                verification link.
                            </p>
                            <p className="text-gray-600 mb-6">
                                If you haven't received the verification email, you can request a new
                                one.
                            </p>
                            <button
                                onClick={handleResendVerification}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Resend Verification Email
                            </button>
                        </>
                    )}

                    {token && !success && (
                        <div className="text-gray-600">
                            <p className="mb-4">Invalid or expired verification link.</p>
                            <button
                                onClick={handleResendVerification}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Request New Verification Link
                            </button>
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
