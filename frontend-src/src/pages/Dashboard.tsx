import { useState } from 'react';
import {
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const stats = [
  { 
    name: 'Growth Rate', 
    value: '15%', 
    icon: ArrowTrendingUpIcon, 
    change: '+2.5%', 
    changeType: 'positive',
    description: 'vs. last month'
  },
  { 
    name: 'Market Size', 
    value: '$2.4M', 
    icon: ChartBarIcon, 
    change: '+12.3%', 
    changeType: 'positive',
    description: 'Total addressable market'
  },
  { 
    name: 'Customer Base', 
    value: '1,200', 
    icon: UserGroupIcon, 
    change: '+5.4%', 
    changeType: 'positive',
    description: 'Active customers'
  },
  { 
    name: 'Revenue', 
    value: '$540K', 
    icon: CurrencyDollarIcon, 
    change: '+8.1%', 
    changeType: 'positive',
    description: 'Monthly recurring revenue'
  },
];

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [30, 40, 45, 50, 55, 60],
      fill: true,
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
    },
  ],
};

const customerData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Enterprise',
      data: [20, 25, 30, 35],
      backgroundColor: 'rgb(99, 102, 241)',
    },
    {
      label: 'SMB',
      data: [30, 35, 40, 45],
      backgroundColor: 'rgb(147, 51, 234)',
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const topCustomers = [
  { name: 'Acme Corp', revenue: '$125,000', growth: '+12%' },
  { name: 'TechStart Inc', revenue: '$98,000', growth: '+8%' },
  { name: 'Global Solutions', revenue: '$87,500', growth: '+15%' },
  { name: 'InnovateCo', revenue: '$76,200', growth: '+5%' },
];

export const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Get a bird's eye view of your business performance
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="select-primary"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn-primary">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-full bg-indigo-50">
                    <item.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.changeType === 'positive' ? (
                          <ArrowUpIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        )}
                        <span className="ml-1">{item.change}</span>
                      </div>
                    </dd>
                    <dd className="mt-1 text-sm text-gray-500">{item.description}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Revenue Trend</h2>
            <div className="mt-4" style={{ height: '300px' }}>
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Customer Segments</h2>
            <div className="mt-4" style={{ height: '300px' }}>
              <Bar data={customerData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Customers */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Customers</h2>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topCustomers.map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.revenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {customer.growth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="btn-secondary flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                View Reports
              </button>
              <button className="btn-secondary flex items-center justify-center">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Add Customer
              </button>
              <button className="btn-secondary flex items-center justify-center">
                <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
                Growth Analysis
              </button>
              <button className="btn-secondary flex items-center justify-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                Revenue Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
