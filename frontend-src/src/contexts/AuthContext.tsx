import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';

const API_URL = api.defaults.baseURL;

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    companyName: string;
    industry: string;
    emailVerified: boolean;
}

interface SignUpData {
    name: string;
    email: string;
    password: string;
    companyName: string;
    industry: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    signUp: (data: SignUpData) => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
    resendVerification: () => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    clearError: () => void;
    loginWithGoogle: () => Promise<void>;
    loginWithLinkedIn: () => Promise<void>;
    loginWithGitHub: () => Promise<void>;
    loginWithFacebook: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await api.get('/auth/me');
                setUser(response.data);
            }
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            
            if (!user.emailVerified) {
                throw new Error('Please verify your email before logging in');
            }
            
            localStorage.setItem('token', token);
            setUser(user);
        } catch (error: any) {
            setError(error.response?.data?.message || error.message || 'Login failed');
            throw error;
        }
    };

    const signUp = async (data: SignUpData) => {
        try {
            setError(null);
            const response = await api.post('/auth/signup', data);
            const { message } = response.data;
            return message; // Should return a message about verification email
        } catch (error: any) {
            setError(error.response?.data?.message || 'Sign up failed');
            throw error;
        }
    };

    const verifyEmail = async (token: string) => {
        try {
            setError(null);
            const response = await api.post('/auth/verify-email', { token });
            return response.data;
        } catch (error: any) {
            setError(error.response?.data?.message || 'Email verification failed');
            throw error;
        }
    };

    const resendVerification = async () => {
        try {
            setError(null);
            const response = await api.post('/auth/resend-verification');
            return response.data;
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to resend verification email');
            throw error;
        }
    };

    const requestPasswordReset = async (email: string) => {
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
            return response.data;
        } catch (err) {
            handleError(err);
            throw err;
        }
    };

    const resetPassword = async (token: string, newPassword: string) => {
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, {
                token,
                newPassword,
            });
            return response.data;
        } catch (err) {
            handleError(err);
            throw err;
        }
    };

    const loginWithGoogle = async () => {
        try {
            setError(null);
            window.location.href = `${api.defaults.baseURL}/auth/google`;
        } catch (error: any) {
            setError('Google login failed');
            throw error;
        }
    };

    const loginWithFacebook = async () => {
        try {
            setError(null);
            window.location.href = `${api.defaults.baseURL}/auth/facebook`;
        } catch (error: any) {
            setError('Facebook login failed');
            throw error;
        }
    };

    const loginWithLinkedIn = async () => {
        try {
            setError(null);
            window.location.href = `${api.defaults.baseURL}/auth/linkedin`;
        } catch (error: any) {
            setError('LinkedIn login failed');
            throw error;
        }
    };

    const loginWithGitHub = async () => {
        try {
            setError(null);
            window.location.href = `${api.defaults.baseURL}/auth/github`;
        } catch (error: any) {
            setError('GitHub login failed');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const clearError = () => {
        setError(null);
    };

    const handleError = (err: any) => {
        setError(err.response?.data?.message || err.message || 'An error occurred');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                error,
                login,
                logout,
                signUp,
                verifyEmail,
                resendVerification,
                requestPasswordReset,
                resetPassword,
                clearError,
                loginWithGoogle,
                loginWithLinkedIn,
                loginWithGitHub,
                loginWithFacebook,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
