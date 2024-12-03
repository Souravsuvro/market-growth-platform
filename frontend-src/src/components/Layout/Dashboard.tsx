import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface DashboardProps {
  children?: ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return (
    <div className="p-4 sm:ml-64 mt-14">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
        {children}
      </div>
    </div>
  );
};
