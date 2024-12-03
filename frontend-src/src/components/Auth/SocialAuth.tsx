import React from 'react';
import { FaGoogle, FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const SocialAuth: React.FC = () => {
    const { loginWithGoogle, loginWithLinkedIn, loginWithGitHub, loginWithFacebook } = useAuth();

    const socialButtons = [
        {
            icon: <FaGoogle className="w-5 h-5" />,
            label: 'Google',
            onClick: loginWithGoogle,
            bgColor: 'bg-red-500 hover:bg-red-600',
            ariaLabel: 'Sign in with Google'
        },
        {
            icon: <FaFacebookF className="w-5 h-5" />,
            label: 'Facebook',
            onClick: loginWithFacebook,
            bgColor: 'bg-blue-600 hover:bg-blue-700',
            ariaLabel: 'Sign in with Facebook'
        },
        {
            icon: <FaLinkedinIn className="w-5 h-5" />,
            label: 'LinkedIn',
            onClick: loginWithLinkedIn,
            bgColor: 'bg-blue-500 hover:bg-blue-600',
            ariaLabel: 'Sign in with LinkedIn'
        },
        {
            icon: <FaGithub className="w-5 h-5" />,
            label: 'GitHub',
            onClick: loginWithGitHub,
            bgColor: 'bg-gray-800 hover:bg-gray-900',
            ariaLabel: 'Sign in with GitHub'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {socialButtons.map((button) => (
                    <button
                        key={button.label}
                        onClick={button.onClick}
                        className={`flex items-center justify-center px-4 py-3 space-x-3 rounded-lg transition-colors duration-200 ${button.bgColor} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${button.bgColor.split('-')[1]}-500`}
                        aria-label={button.ariaLabel}
                    >
                        {button.icon}
                        <span className="font-medium">{button.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SocialAuth;
