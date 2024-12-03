import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { requestPasswordReset, error } = useAuth();
    const [localError, setLocalError] = useState<string | null>(null);

    const validateEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!validateEmail(email)) {
            setLocalError('Please enter a valid email address');
            return;
        }

        try {
            await requestPasswordReset(email);
            setSubmitted(true);
        } catch (error) {
            // Error is handled by AuthContext
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                            Check Your Email
                        </h2>
                        <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700">
                            If an account exists with {email}, we've sent password reset
                            instructions to your email address.
                        </div>
                        <p className="text-gray-600 mb-6">
                            Please check your email and follow the instructions to reset your
                            password. The link will expire in 1 hour.
                        </p>
                        <RouterLink
                            to="/login"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Return to Login
                        </RouterLink>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <FaEnvelope className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Forgot your password?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email address and we'll send you instructions to reset your password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {(error || localError) && (
                        <div className="mb-4 p-4 rounded-md bg-red-50 text-red-700">
                            {error || localError}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Send Reset Instructions
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="text-sm text-center">
                            Remember your password?{' '}
                            <RouterLink
                                to="/login"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign in
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
