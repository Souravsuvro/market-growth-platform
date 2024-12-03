import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    ChartBarIcon,
    UserGroupIcon,
    LightBulbIcon,
    DocumentChartBarIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  path: string;
  name: string;
  icon: JSX.Element;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      path: '/',
      name: 'Dashboard',
      icon: <HomeIcon />,
    },
    {
      path: '/market-analysis',
      name: 'Market Analysis',
      icon: <ChartBarIcon />,
    },
    {
      path: '/customer-intelligence',
      name: 'Customer Intelligence',
      icon: <UserGroupIcon />,
    },
    {
      path: '/growth-strategy',
      name: 'Growth Strategy',
      icon: <LightBulbIcon />,
    },
    {
      path: '/business-profile',
      name: 'Business Profile',
      icon: <ClipboardDocumentListIcon />,
    },
    {
      path: '/analysis-dashboard',
      name: 'Analysis Dashboard',
      icon: <DocumentChartBarIcon />,
    },
  ];

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform bg-white border-r border-gray-200">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg group ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={`${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                    {Icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};
