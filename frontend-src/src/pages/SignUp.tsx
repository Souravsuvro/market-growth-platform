import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import PasswordStrengthIndicator from '../components/Auth/PasswordStrengthIndicator';
import SocialAuth from '../components/Auth/SocialAuth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        industry: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState(false);
    const { signUp, error } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
        }

        if (!formData.industry.trim()) {
            newErrors.industry = 'Industry is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await signUp(formData);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/email-verification');
                }, 2000);
            } catch (err) {
                console.error('Signup error:', err);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {success && (
                        <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700">
                            Account created successfully! Redirecting to verification page...
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-4 rounded-md bg-red-50 text-red-700">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className={`mt-1 block w-full rounded-md border ${
                                    errors.name ? 'border-red-300' : 'border-gray-300'
                                } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className={`mt-1 block w-full rounded-md border ${
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className={`block w-full rounded-md border ${
                                        errors.password ? 'border-red-300' : 'border-gray-300'
                                    } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                            <PasswordStrengthIndicator password={formData.password} />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    className={`block w-full rounded-md border ${
                                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                    } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                                Company Name
                            </label>
                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                required
                                className={`mt-1 block w-full rounded-md border ${
                                    errors.companyName ? 'border-red-300' : 'border-gray-300'
                                } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                            {errors.companyName && (
                                <p className="mt-2 text-sm text-red-600">{errors.companyName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                                Industry
                            </label>
                            <input
                                id="industry"
                                name="industry"
                                type="text"
                                required
                                className={`mt-1 block w-full rounded-md border ${
                                    errors.industry ? 'border-red-300' : 'border-gray-300'
                                } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                value={formData.industry}
                                onChange={handleChange}
                            />
                            {errors.industry && (
                                <p className="mt-2 text-sm text-red-600">{errors.industry}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <SocialAuth />
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="text-sm text-center">
                            Already have an account?{' '}
                            <RouterLink to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign in
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
